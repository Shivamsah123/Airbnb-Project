import React from 'react'
import { config } from '../../services/config'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../providers/AuthProvider'

function TablePropertiesListing({ properties, onDeleteProperty, wishlistIds = [], onToggleWishlist }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const onDetails = (id) => {
    navigate('/home/property-details', { state: { id: id } })
  }

  return (
    <div className='table-responsive'>
      <table className='table table-hover align-middle'>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Title</th>
            <th>Details</th>
            <th>Rent/Night</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.length === 0 ? (
            <tr>
              <td colSpan={6} className='text-center py-4 text-muted'>
                <i className='bi bi-house-slash me-2'></i>No properties found
              </td>
            </tr>
          ) : (
            properties.map((property) => (
              <tr key={property['id']}>
                <td className='text-muted' style={{ fontSize: '0.8rem' }}>{property['id']}</td>
                <td>
                  <img
                    className='thumbnail'
                    src={`${config.server}/${property['profileImage']}`}
                    alt={property['title']}
                    style={{
                      width: 60, height: 60, objectFit: 'cover',
                      borderRadius: '10px', border: '1px solid rgba(0,210,255,0.2)'
                    }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/60?text=No+Image' }}
                  />
                </td>
                <td className='fw-medium'>{property['title']}</td>
                <td className='text-muted' style={{ fontSize: '0.85rem', maxWidth: '200px' }}>
                  <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {property['details']}
                  </span>
                </td>
                <td>
                  <span className='fw-bold' style={{ color: '#00d2ff' }}>₹{Number(property['rent']).toLocaleString()}</span>
                </td>
                <td>
                  <div className='d-flex gap-2 align-items-center'>
                    {isAdmin && (
                      <button
                        onClick={() => onDeleteProperty(property['id'])}
                        className='btn btn-sm btn-outline-danger'
                        style={{ borderRadius: '8px' }}
                      >
                        <i className='bi bi-trash me-1'></i>Delete
                      </button>
                    )}
                    {!isAdmin && (
                      <button
                        onClick={() => onToggleWishlist(property['id'])}
                        className='btn btn-sm'
                        style={{
                          background: wishlistIds.includes(property['id']) ? 'rgba(255,65,108,0.15)' : 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,65,108,0.3)',
                          borderRadius: '8px',
                          color: '#ff6b8a'
                        }}
                        title={wishlistIds.includes(property['id']) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        {wishlistIds.includes(property['id']) ? '❤️' : '🤍'}
                      </button>
                    )}
                    <button
                      onClick={() => onDetails(property['id'])}
                      className='btn btn-sm btn-primary'
                      style={{ borderRadius: '8px' }}
                    >
                      <i className='bi bi-eye me-1'></i>View
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TablePropertiesListing
