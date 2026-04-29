import React, { useEffect, useState } from 'react'
import { getAdminProperties, deleteAdminProperty } from '../../services/admin'
import { config } from '../../services/config'
import { toast } from 'react-toastify'

function ManageProperties({ searchQuery = '' }) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  const loadProperties = async () => {
    setLoading(true)
    const response = await getAdminProperties()
    if (response && response.status === 'success') {
      setProperties(response.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadProperties()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      const response = await deleteAdminProperty(id)
      if (response && response.status === 'success') {
        toast.success('Property deleted successfully')
        loadProperties()
      } else {
        toast.error('Failed to delete property')
      }
    }
  }

  const filtered = properties.filter(p => {
    const q = searchQuery.toLowerCase()
    return (
      p.title?.toLowerCase().includes(q) ||
      p.ownerName?.toLowerCase().includes(q) ||
      p.ownerEmail?.toLowerCase().includes(q) ||
      String(p.id).includes(q)
    )
  })

  return (
    <div className='manage-table-card'>
      <div className='manage-table-header'>
        <div className='d-flex align-items-center gap-2'>
          <h5 className='manage-table-title'>
            <i className='bi bi-house-door me-2 text-success'></i>Properties
          </h5>
          <span className='manage-count-badge'>{filtered.length} records</span>
        </div>
        <button className='btn btn-sm btn-outline-success' onClick={loadProperties}>
          <i className='bi bi-arrow-clockwise me-1'></i>Refresh
        </button>
      </div>

      <div className='manage-table-wrap'>
        {loading ? (
          <div className='text-center py-5'>
            <div className='spinner-border text-success' role='status'></div>
            <p className='mt-2 text-muted'>Loading properties...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className='text-center py-5 text-muted'>
            <i className='bi bi-house display-5 d-block mb-2'></i>
            No properties found{searchQuery ? ` for "${searchQuery}"` : ''}
          </div>
        ) : (
          <table className='table table-hover align-middle mb-0'>
            <thead>
              <tr>
                <th>#</th>
                <th>Property</th>
                <th>Owner</th>
                <th>Rent/Night</th>
                <th>Beds</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className='text-muted' style={{ fontSize: '0.8rem' }}>{p.id}</td>
                  <td>
                    <div className='d-flex align-items-center gap-2'>
                      <img
                        src={`${config.server}/${p.profileImage}`}
                        alt='property'
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: 'cover',
                          borderRadius: '10px',
                          border: '1px solid rgba(0,210,255,0.2)',
                        }}
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                      <div>
                        <div className='fw-medium' style={{ fontSize: '0.9rem' }}>{p.title}</div>
                        <div className='text-muted' style={{ fontSize: '0.78rem' }}>{p.location || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className='fw-medium' style={{ fontSize: '0.88rem' }}>{p.ownerName}</div>
                    <div className='text-muted' style={{ fontSize: '0.78rem' }}>{p.ownerEmail}</div>
                  </td>
                  <td>
                    <span className='fw-bold' style={{ color: '#38ef7d' }}>₹{p.rent?.toLocaleString()}</span>
                  </td>
                  <td className='text-muted'>{p.beds || '—'}</td>
                  <td>
                    <button
                      className='btn btn-sm btn-outline-danger'
                      style={{ borderRadius: '8px', fontSize: '0.8rem' }}
                      onClick={() => handleDelete(p.id)}
                    >
                      <i className='bi bi-trash me-1'></i>Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ManageProperties
