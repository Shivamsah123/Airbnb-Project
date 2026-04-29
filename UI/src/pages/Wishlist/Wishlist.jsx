import React, { useEffect, useState } from 'react'
import { getWishlist, toggleWishlist } from '../../services/wishlist'
import GridPropertiesListing from '../../components/GridPropetiesListing/GridPropertiesListing'
import { toast } from 'react-toastify'

function Wishlist() {
  const [properties, setProperties] = useState([])
  const [wishlistIds, setWishlistIds] = useState([])

  const loadWishlist = async () => {
    const response = await getWishlist()
    if (response && response.status === 'success') {
      setProperties(response.data)
      setWishlistIds(response.data.map(p => p.id))
    }
  }

  useEffect(() => {
    loadWishlist()
  }, [])

  const handleToggleWishlist = async (propertyId) => {
    const response = await toggleWishlist(propertyId)
    if (response && response.status === 'success') {
      toast.success('Removed from wishlist')
      loadWishlist() // refresh list
    } else {
      toast.error('Failed to update wishlist')
    }
  }

  return (
    <div>
      <div className='container mt-4'>
        <h2 className='page-header mb-4'>My Wishlist ❤️</h2>
        {properties.length === 0 ? (
          <div className='alert alert-info'>Your wishlist is empty.</div>
        ) : (
          <GridPropertiesListing
            properties={properties}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        )}
      </div>
    </div>
  )
}

export default Wishlist
