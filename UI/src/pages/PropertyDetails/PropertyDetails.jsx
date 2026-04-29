import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getPropertyDetails } from '../../services/properties'
import { toast } from 'react-toastify'
import { config } from '../../services/config'
import './PropertyDetails.css'

function PropertyDetails() {
  // load the property details here
  const [property, setProperty] = useState(null)

  // get the reference of location object
  // location object is used to get the state sent by the previous component
  const location = useLocation()
  const navigate = useNavigate()

  const loadPropertyDetails = async (id) => {
    const response = await getPropertyDetails(id)
    if (response['status'] == 'success') {
      setProperty(response['data'][0])
    } else {
      toast.error(response['error'])
    }
  }

  useEffect(() => {
    // Safely get the property id from navigation state
    if (!location.state || !location.state.id) {
      toast.error('Property not found. Redirecting...')
      navigate('/home/properties')
      return
    }
    const { id } = location.state
    // get the property details
    loadPropertyDetails(id)
  }, [])

  const renderPropertyDetails = () => {
    return (
      <div>
        <h2 className='mb-3 mt-3'>{property['title']}</h2>
        <img
          src={`${config.server}/${property['profileImage']}`}
          style={{ height: 400, width: '100%' }}
          alt=''
        />
        <div className='mt-3 guests-details mb-3'>
          {property['guests']} guests | {property['bedrooms']} bedrooms |{' '}
          {property['beds']} beds | {property['bathrooms']} bathrooms
        </div>
        <hr />
        <h4>
          Hosted by{' '}
          <span style={{ fontWeight: 'bold' }}>
            {' '}
            {property['ownerName']} ({property['contactNo']})
          </span>
        </h4>
        <hr />
        <div className='guests-details'>{property['details']}</div>
        <hr />
        <h3>What this place offers</h3>
        <ul>
          {property['isLakeView'] == 1 && (
            <li>
              <div>Lake View</div>
            </li>
          )}
          {property['isTV'] == 1 && (
            <li>
              <div>TV available</div>
            </li>
          )}
          {property['isAC'] == 1 && (
            <li>
              <div>Air Conditioner available</div>
            </li>
          )}
          {property['isMiniBar'] == 1 && (
            <li>
              <div>Minibar available</div>
            </li>
          )}
          {property['isWifi'] == 1 && (
            <li>
              <div>WiFi available</div>
            </li>
          )}
          {property['isBreakfast'] == 1 && (
            <li>
              <div>Breakfast available</div>
            </li>
          )}
          {property['isParking'] == 1 && (
            <li>
              <div>Parking available</div>
            </li>
          )}
        </ul>
        <hr />
        <div className='d-flex justify-content-between align-items-center bg-light p-3 rounded'>
          <div>
            <h4 className='mb-0'>₹{property['rent']} <span className='fs-6 text-muted'>night</span></h4>
          </div>
          <button 
            className='btn btn-success btn-lg px-5'
            onClick={() => navigate('/home/cart', { state: { property: property } })}
          >
            Book Now
          </button>
        </div>
      </div>
    )
  }

  return <div className='container'>{property && renderPropertyDetails()}</div>
}

export default PropertyDetails
