import React, { useEffect, useState } from 'react'
import { getMyBookings, cancelBooking } from '../../services/bookings'
import { config } from '../../services/config'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import './Bookings.css'

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [cancelTarget, setCancelTarget] = useState(null) // booking to cancel
  const [cancelling, setCancelling] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    const response = await getMyBookings()
    if (response && response.status === 'success') {
      setBookings(response.data)
    }
    setLoading(false)
  }

  // Determine booking status based on dates
  const getStatus = (booking) => {
    if (booking.status === 'cancelled') return 'cancelled'
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkIn = new Date(booking.fromDate)
    const checkOut = new Date(booking.toDate)
    if (checkOut < today) return 'completed'
    if (checkIn <= today && checkOut >= today) return 'ongoing'
    return 'upcoming'
  }

  const statusConfig = {
    upcoming:  { label: 'Upcoming',  color: '#00d2ff', bg: 'rgba(0,210,255,0.12)',  icon: '📅' },
    ongoing:   { label: 'Ongoing',   color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  icon: '🏠' },
    completed: { label: 'Completed', color: '#94a3b8', bg: 'rgba(148,163,184,0.12)',icon: '✅' },
    cancelled: { label: 'Cancelled', color: '#ff416c', bg: 'rgba(255,65,108,0.12)', icon: '❌' },
  }

  const tabs = [
    { key: 'all',       label: 'All Trips' },
    { key: 'upcoming',  label: 'Upcoming' },
    { key: 'ongoing',   label: 'Ongoing' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ]

  const filtered = activeTab === 'all'
    ? bookings
    : bookings.filter((b) => getStatus(b) === activeTab)

  const tabCount = (key) =>
    key === 'all' ? bookings.length : bookings.filter((b) => getStatus(b) === key).length

  // Dates formatting
  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  }

  const nightsBetween = (from, to) => {
    if (!from || !to) return 0
    const diff = new Date(to) - new Date(from)
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  // Cancel booking
  const handleCancelConfirm = async () => {
    if (!cancelTarget) return
    setCancelling(true)
    const response = await cancelBooking(cancelTarget.id)
    if (response && response.status === 'success') {
      toast.success('Booking cancelled successfully!')
      await fetchBookings()
    } else {
      toast.error('Failed to cancel booking. Please try again.')
    }
    setCancelling(false)
    setCancelTarget(null)
  }

  // Summary stats
  const totalSpent = bookings
    .filter((b) => getStatus(b) !== 'cancelled')
    .reduce((sum, b) => sum + (Number(b.total) || 0), 0)
  const upcomingCount = bookings.filter((b) => getStatus(b) === 'upcoming').length
  const completedCount = bookings.filter((b) => getStatus(b) === 'completed').length

  return (
    <div className='trips-page'>
      {/* Page Header */}
      <div className='trips-hero'>
        <div className='trips-hero-bg' />
        <div className='container trips-hero-content'>
          <div>
            <h1 className='trips-title'>
              <i className='bi bi-suitcase-lg me-3' />
              My Trips
            </h1>
            <p className='trips-subtitle'>Your complete travel journey in one place</p>
          </div>
          <button
            className='trips-browse-btn'
            onClick={() => navigate('/home/properties')}
          >
            <i className='bi bi-plus-lg me-2' />
            Book New Stay
          </button>
        </div>
      </div>

      <div className='container trips-body'>
        {/* Summary Stats */}
        <div className='trips-stats-row'>
          <div className='trips-stat'>
            <span className='trips-stat-icon'>🧳</span>
            <div>
              <div className='trips-stat-value'>{bookings.length}</div>
              <div className='trips-stat-label'>Total Trips</div>
            </div>
          </div>
          <div className='trips-stat'>
            <span className='trips-stat-icon'>📅</span>
            <div>
              <div className='trips-stat-value'>{upcomingCount}</div>
              <div className='trips-stat-label'>Upcoming</div>
            </div>
          </div>
          <div className='trips-stat'>
            <span className='trips-stat-icon'>✅</span>
            <div>
              <div className='trips-stat-value'>{completedCount}</div>
              <div className='trips-stat-label'>Completed</div>
            </div>
          </div>
          <div className='trips-stat'>
            <span className='trips-stat-icon'>💰</span>
            <div>
              <div className='trips-stat-value'>₹{totalSpent.toLocaleString('en-IN')}</div>
              <div className='trips-stat-label'>Total Spent</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='trips-tabs'>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`trips-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className='trips-tab-count'>{tabCount(tab.key)}</span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className='trips-loading'>
            <div className='trips-spinner' />
            <p>Loading your trips...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className='trips-empty'>
            <div className='trips-empty-icon'>✈️</div>
            <h3>No trips found</h3>
            <p>
              {activeTab === 'all'
                ? "You haven't booked any properties yet."
                : `No ${activeTab} trips at the moment.`}
            </p>
            {activeTab === 'all' && (
              <button
                className='trips-browse-btn'
                onClick={() => navigate('/home/properties')}
              >
                Explore Properties
              </button>
            )}
          </div>
        )}

        {/* Booking Cards */}
        {!loading && filtered.length > 0 && (
          <div className='trips-list'>
            {filtered.map((booking) => {
              const status = getStatus(booking)
              const sc = statusConfig[status]
              const nights = nightsBetween(booking.fromDate, booking.toDate)
              const canCancel = status === 'upcoming' || status === 'ongoing'

              return (
                <div className='trip-card' key={booking.id}>
                  {/* Property Image */}
                  <div className='trip-card-img-wrap'>
                    <img
                      src={`${config.server}/${booking.propertyImage}`}
                      alt={booking.propertyTitle}
                      className='trip-card-img'
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80'
                      }}
                    />
                    <div
                      className='trip-status-badge'
                      style={{ background: sc.bg, color: sc.color, borderColor: sc.color + '55' }}
                    >
                      {sc.icon} {sc.label}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className='trip-card-body'>
                    <div className='trip-card-top'>
                      <div>
                        <h4 className='trip-property-name'>{booking.propertyTitle}</h4>
                        <p className='trip-property-addr'>
                          <i className='bi bi-geo-alt me-1' />
                          {booking.propertyAddress || 'India'}
                        </p>
                      </div>
                      <div className='trip-price-box'>
                        <span className='trip-total'>₹{Number(booking.total).toLocaleString('en-IN')}</span>
                        <span className='trip-nights'>{nights} night{nights !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className='trip-dates-row'>
                      <div className='trip-date-box'>
                        <span className='trip-date-label'>
                          <i className='bi bi-box-arrow-in-right me-1' />Check-in
                        </span>
                        <span className='trip-date-value'>{formatDate(booking.fromDate)}</span>
                      </div>
                      <div className='trip-date-arrow'>→</div>
                      <div className='trip-date-box'>
                        <span className='trip-date-label'>
                          <i className='bi bi-box-arrow-right me-1' />Check-out
                        </span>
                        <span className='trip-date-value'>{formatDate(booking.toDate)}</span>
                      </div>
                    </div>

                    <div className='trip-card-footer'>
                      <div className='trip-booking-id'>
                        <i className='bi bi-hash' />Booking #{booking.id}
                      </div>
                      <div className='trip-card-actions'>
                        {canCancel && (
                          <button
                            className='trip-cancel-btn'
                            onClick={() => setCancelTarget(booking)}
                          >
                            <i className='bi bi-x-circle me-1' />
                            Cancel
                          </button>
                        )}
                        <button
                          className='trip-view-btn'
                          onClick={() =>
                            navigate('/home/property-details', {
                              state: { id: booking.propertyId },
                            })
                          }
                        >
                          <i className='bi bi-eye me-1' />
                          View Property
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelTarget && (
        <div className='trips-modal-overlay' onClick={() => !cancelling && setCancelTarget(null)}>
          <div className='trips-modal' onClick={(e) => e.stopPropagation()}>
            <div className='trips-modal-icon'>⚠️</div>
            <h3 className='trips-modal-title'>Cancel Booking?</h3>
            <p className='trips-modal-desc'>
              Are you sure you want to cancel your booking for
              <span className='trips-modal-property'> "{cancelTarget.propertyTitle}"</span>?
              <br />
              <small className='text-muted'>This action cannot be undone.</small>
            </p>
            <div className='trips-modal-actions'>
              <button
                className='trips-modal-confirm'
                onClick={handleCancelConfirm}
                disabled={cancelling}
              >
                {cancelling ? (
                  <>
                    <span className='spinner-border spinner-border-sm me-2' />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <i className='bi bi-x-circle me-2' />
                    Yes, Cancel
                  </>
                )}
              </button>
              <button
                className='trips-modal-back'
                onClick={() => setCancelTarget(null)}
                disabled={cancelling}
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bookings
