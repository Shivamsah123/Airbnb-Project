import React from 'react'
import { config } from '../../services/config'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../providers/AuthProvider'
import './GridPropertiesListing.css'

function GridPropertiesListing({ properties, onDeleteProperty, wishlistIds = [], onToggleWishlist }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const onDetails = (id) => {
    navigate('/home/property-details', { state: { id: id } })
  }

  if (!properties || properties.length === 0) {
    return (
      <div className='grid-empty-state'>
        <i className='bi bi-house-slash'></i>
        <h4>No Properties Found</h4>
        <p>Try a different search term or check back later.</p>
      </div>
    )
  }

  return (
    <div className='properties-grid'>
      {properties.map((property) => {
        const isWishlisted = wishlistIds.includes(property['id'])
        return (
          <div className='property-card' key={property['id']}>
            {/* Image */}
            <div className='property-card-img-wrap'>
              <img
                src={`${config.server}/${property['profileImage']}`}
                className='property-card-img'
                alt={property['title']}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=No+Image' }}
              />
              {/* Overlay badges */}
              <div className='property-card-badges'>
                {property['beds'] && (
                  <span className='property-badge'>
                    🛏 {property['beds']} beds
                  </span>
                )}
              </div>
              {/* Wishlist - only for non-admin */}
              {!isAdmin && (
                <button
                  className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
                  onClick={() => onToggleWishlist(property['id'])}
                  title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isWishlisted ? '❤️' : '🤍'}
                </button>
              )}
              {/* Admin Delete badge */}
              {isAdmin && (
                <button
                  className='admin-delete-btn'
                  onClick={() => onDeleteProperty(property['id'])}
                  title='Delete property'
                >
                  <i className='bi bi-trash'></i>
                </button>
              )}
            </div>

            {/* Card Body */}
            <div className='property-card-body'>
              <h5 className='property-card-title'>{property['title']}</h5>

              <div className='property-card-meta'>
                {property['location'] && (
                  <span className='property-location'>
                    <i className='bi bi-geo-alt'></i> {property['location']}
                  </span>
                )}
                <div className='property-features'>
                  {property['bathrooms'] && (
                    <span><i className='bi bi-droplet'></i> {property['bathrooms']} bath</span>
                  )}
                </div>
              </div>

              <div className='property-card-footer'>
                <div className='property-rent'>
                  <span className='rent-amount'>₹{Number(property['rent']).toLocaleString()}</span>
                  <span className='rent-per'>/night</span>
                </div>
                <button
                  className='btn-view-details'
                  onClick={() => onDetails(property['id'])}
                >
                  View Details <i className='bi bi-arrow-right'></i>
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default GridPropertiesListing
