import React, { useEffect, useState } from 'react'
import { deleteProperty, getProperties } from '../../services/properties'
import { getWishlistIds, toggleWishlist } from '../../services/wishlist'
import './PropertyListing.css'
import { toast } from 'react-toastify'
import TablePropertiesListing from '../../components/TablePropertiesListing/TablePropertiesListing'
import GridPropertiesListing from '../../components/GridPropetiesListing/GridPropertiesListing'
import { useAuth } from '../../providers/AuthProvider'

function PropertyListing() {
  const [properties, setProperties] = useState([])
  const [layout, setLayout] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [wishlistIds, setWishlistIds] = useState([])
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const getPropertiesList = async (search = '') => {
    setLoading(true)
    const response = await getProperties(search)
    if (response && response['status'] === 'success') {
      setProperties(response['data'])
    }
    setLoading(false)
  }

  useEffect(() => {
    getPropertiesList(searchQuery)
    if (!isAdmin) fetchWishlistIds()
  }, [])

  const fetchWishlistIds = async () => {
    const response = await getWishlistIds()
    if (response && response.status === 'success') {
      setWishlistIds(response.data)
    }
  }

  const handleToggleWishlist = async (propertyId) => {
    const response = await toggleWishlist(propertyId)
    if (response && response.status === 'success') {
      fetchWishlistIds()
    } else {
      toast.error('Failed to update wishlist')
    }
  }

  const onDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return
    const response = await deleteProperty(id)
    if (response && response['status'] === 'success') {
      toast.success('Property deleted successfully')
      getPropertiesList()
    } else {
      toast.error(response?.['error'] || 'Failed to delete property')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    getPropertiesList(searchQuery)
  }

  return (
    <div>
      {/* Hero Section */}
      <div
        className='hero-section'
        style={{
          backgroundImage: `linear-gradient(rgba(7, 11, 20, 0.55), rgba(7, 11, 20, 0.88)), url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='hero-content'>
          <div className='hero-badge'>🌍 Discover Amazing Places</div>
          <h1 className='hero-title'>Find Your Perfect Stay</h1>
          <p className='hero-subtitle'>Browse thousands of handpicked properties across India</p>
          <form className='hero-search-form' onSubmit={handleSearch}>
            <div className='hero-search-box'>
              <i className='bi bi-search hero-search-icon'></i>
              <input
                type='text'
                className='hero-search-input'
                placeholder='Search by title, location...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type='submit' className='hero-search-btn'>
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className='container-xl py-4'>
        <div className='listing-header'>
          <div>
            <h3 className='listing-title'>
              {isAdmin ? '🏠 All Properties' : '🌟 Featured Properties'}
            </h3>
            {!loading && (
              <p className='listing-count text-muted'>
                {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
                {searchQuery ? ` for "${searchQuery}"` : ''}
              </p>
            )}
          </div>
          <div className='layout-toggle'>
            <button
              onClick={() => setLayout('grid')}
              className={`layout-btn ${layout === 'grid' ? 'active' : ''}`}
              title='Grid view'
            >
              <i className='bi bi-grid'></i>
            </button>
            <button
              onClick={() => setLayout('table')}
              className={`layout-btn ${layout === 'table' ? 'active' : ''}`}
              title='Table view'
            >
              <i className='bi bi-list-ul'></i>
            </button>
          </div>
        </div>

        {loading ? (
          <div className='text-center py-5'>
            <div className='spinner-border' style={{ color: '#00d2ff', width: '3rem', height: '3rem' }} role='status'></div>
            <p className='mt-3 text-muted'>Loading properties...</p>
          </div>
        ) : (
          <>
            {layout === 'grid' && (
              <GridPropertiesListing
                properties={properties}
                onDeleteProperty={onDeleteProperty}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
              />
            )}
            {layout === 'table' && (
              <TablePropertiesListing
                properties={properties}
                onDeleteProperty={onDeleteProperty}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default PropertyListing
