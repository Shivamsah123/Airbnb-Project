import React from 'react'

import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createBooking } from '../../services/bookings'
import { toast } from 'react-toastify'
import { config } from '../../services/config'

function Cart() {
  const location = useLocation()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (location.state && location.state.property) {
      setProperty(location.state.property)
    } else {
      toast.warning('No property selected for booking.')
      navigate('/home/properties')
    }
  }, [location, navigate])

  // Calculate total days and price
  useEffect(() => {
    if (fromDate && toDate && property) {
      const start = new Date(fromDate)
      const end = new Date(toDate)
      const timeDiff = end.getTime() - start.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
      
      if (daysDiff > 0) {
        setTotal(daysDiff * property.rent)
      } else {
        setTotal(0)
      }
    }
  }, [fromDate, toDate, property])

  const handleConfirmBooking = async () => {
    if (!fromDate || !toDate) {
      toast.warning('Please select check-in and check-out dates.')
      return
    }
    if (total <= 0) {
      toast.warning('Check-out date must be after check-in date.')
      return
    }

    const response = await createBooking(property.id, fromDate, toDate, total)
    if (response && response.status === 'success') {
      toast.success('Booking confirmed successfully! 🎉')
      navigate('/home/bookings')
    } else {
      toast.error('Failed to create booking.')
    }
  }

  if (!property) return null

  return (
    <div className='container mt-5'>
      <h2 className='page-header mb-4'>Confirm Booking</h2>
      <div className='row'>
        <div className='col-md-8'>
          <div className='card shadow-sm mb-4'>
            <div className='card-body'>
              <h4 className='card-title mb-4'>Select Dates</h4>
              <div className='row'>
                <div className='col-md-6 mb-3'>
                  <label className='form-label fw-bold'>Check-in Date</label>
                  <input 
                    type='date' 
                    className='form-control' 
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className='col-md-6 mb-3'>
                  <label className='form-label fw-bold'>Check-out Date</label>
                  <input 
                    type='date' 
                    className='form-control' 
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    min={fromDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='card shadow-sm'>
            <div className='card-body'>
              <h4 className='card-title mb-4'>Payment Method</h4>
              <div className='alert alert-secondary'>
                <i className='bi bi-credit-card me-2'></i>
                Payment gateway simulation. No real card needed.
              </div>
              <button 
                className='btn btn-primary btn-lg w-100 mt-3'
                onClick={handleConfirmBooking}
                disabled={total <= 0}
              >
                Confirm & Pay ₹{total}
              </button>
            </div>
          </div>
        </div>

        <div className='col-md-4'>
          <div className='card shadow-sm'>
            <img 
              src={`${config.server}/${property.profileImage}`} 
              className='card-img-top' 
              alt={property.title} 
              style={{height: '200px', objectFit: 'cover'}}
            />
            <div className='card-body'>
              <h5 className='card-title'>{property.title}</h5>
              <p className='text-muted small'>{property.address}</p>
              <hr />
              <div className='d-flex justify-content-between mb-2'>
                <span>₹{property.rent} x nights</span>
                <span>₹{total}</span>
              </div>
              <div className='d-flex justify-content-between mb-2 text-success'>
                <span>Service fee</span>
                <span>₹0</span>
              </div>
              <hr />
              <div className='d-flex justify-content-between fw-bold fs-5'>
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
