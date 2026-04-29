import React, { useEffect, useState } from 'react'
import { getAdminBookings } from '../../services/admin'

function ManageBookings({ searchQuery = '' }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const loadBookings = async () => {
    setLoading(true)
    const response = await getAdminBookings()
    if (response && response.status === 'success') {
      setBookings(response.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const filtered = bookings.filter(b => {
    const q = searchQuery.toLowerCase()
    return (
      b.propertyTitle?.toLowerCase().includes(q) ||
      b.userName?.toLowerCase().includes(q) ||
      b.userEmail?.toLowerCase().includes(q) ||
      String(b.id).includes(q)
    )
  })

  const totalRevenue = filtered.reduce((sum, b) => sum + (b.total || 0), 0)

  return (
    <div>
      {/* Revenue banner */}
      <div
        className='mb-3 p-3 d-flex align-items-center gap-3'
        style={{
          background: 'rgba(56,239,125,0.07)',
          border: '1px solid rgba(56,239,125,0.2)',
          borderRadius: '12px',
        }}
      >
        <i className='bi bi-cash-coin' style={{ fontSize: '1.6rem', color: '#38ef7d' }}></i>
        <div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Revenue (Filtered)
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38ef7d' }}>
            ₹{totalRevenue.toLocaleString()}
          </div>
        </div>
        <div className='ms-auto'>
          <button className='btn btn-sm btn-outline-success' onClick={loadBookings}>
            <i className='bi bi-arrow-clockwise me-1'></i>Refresh
          </button>
        </div>
      </div>

      <div className='manage-table-card'>
        <div className='manage-table-header'>
          <div className='d-flex align-items-center gap-2'>
            <h5 className='manage-table-title'>
              <i className='bi bi-calendar-check me-2' style={{ color: '#ffd200' }}></i>All Bookings
            </h5>
            <span className='manage-count-badge'>{filtered.length} records</span>
          </div>
        </div>

        <div className='manage-table-wrap'>
          {loading ? (
            <div className='text-center py-5'>
              <div className='spinner-border' style={{ color: '#ffd200' }} role='status'></div>
              <p className='mt-2 text-muted'>Loading bookings...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className='text-center py-5 text-muted'>
              <i className='bi bi-calendar-x display-5 d-block mb-2'></i>
              No bookings found{searchQuery ? ` for "${searchQuery}"` : ''}
            </div>
          ) : (
            <table className='table table-hover align-middle mb-0'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Guest</th>
                  <th>Property</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Total Paid</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const checkIn = new Date(b.fromDate)
                  const checkOut = new Date(b.toDate)
                  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
                  return (
                    <tr key={b.id}>
                      <td className='text-muted' style={{ fontSize: '0.8rem' }}>{b.id}</td>
                      <td className='text-muted' style={{ fontSize: '0.82rem' }}>
                        {new Date(b.createdTimestamp).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td>
                        <div className='fw-medium' style={{ fontSize: '0.88rem' }}>{b.userName}</div>
                        <div className='text-muted' style={{ fontSize: '0.75rem' }}>{b.userEmail}</div>
                      </td>
                      <td className='fw-medium' style={{ fontSize: '0.88rem' }}>{b.propertyTitle}</td>
                      <td className='text-muted' style={{ fontSize: '0.82rem' }}>{b.fromDate}</td>
                      <td className='text-muted' style={{ fontSize: '0.82rem' }}>{b.toDate}</td>
                      <td>
                        <span className='fw-bold' style={{ color: '#38ef7d' }}>
                          ₹{b.total?.toLocaleString()}
                        </span>
                        {nights > 0 && (
                          <div className='text-muted' style={{ fontSize: '0.72rem' }}>{nights} night{nights !== 1 ? 's' : ''}</div>
                        )}
                      </td>
                      <td>
                        <span
                          className='badge'
                          style={{
                            background: 'rgba(56,239,125,0.15)',
                            color: '#38ef7d',
                            border: '1px solid rgba(56,239,125,0.3)',
                            borderRadius: '20px',
                            fontSize: '0.72rem',
                          }}
                        >
                          ✅ Confirmed
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageBookings
