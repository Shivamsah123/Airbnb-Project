import React, { useEffect, useState } from 'react'
import { getCategories, addCategory, deleteCategory } from '../../services/adminCategories'
import { config } from '../../services/config'
import { toast } from 'react-toastify'

function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formOpen, setFormOpen] = useState(false)

  const loadCategories = async () => {
    setLoading(true)
    const response = await getCategories()
    if (response && response.status === 'success') {
      setCategories(response.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!title || !details || !file) {
      toast.warning('Please fill all fields and select an image')
      return
    }
    setSubmitting(true)
    const response = await addCategory(title, details, file)
    if (response && response.status === 'success') {
      toast.success('Category added successfully')
      setTitle('')
      setDetails('')
      setFile(null)
      setFormOpen(false)
      loadCategories()
    } else {
      toast.error('Failed to add category')
    }
    setSubmitting(false)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      const response = await deleteCategory(id)
      if (response && response.status === 'success') {
        toast.success('Category deleted')
        loadCategories()
      } else {
        toast.error('Failed to delete')
      }
    }
  }

  return (
    <div>
      {/* Add Category Toggle */}
      <div className='mb-3 d-flex justify-content-end'>
        <button
          className='btn btn-primary btn-sm'
          onClick={() => setFormOpen(!formOpen)}
        >
          <i className={`bi ${formOpen ? 'bi-x-lg' : 'bi-plus-lg'} me-2`}></i>
          {formOpen ? 'Cancel' : 'Add New Category'}
        </button>
      </div>

      {/* Add Category Form */}
      {formOpen && (
        <div
          className='mb-4 p-4'
          style={{
            background: 'rgba(0,210,255,0.04)',
            border: '1px solid rgba(0,210,255,0.2)',
            borderRadius: '14px',
            animation: 'fadeInUp 0.25s ease',
          }}
        >
          <h5 className='mb-3' style={{ color: '#00d2ff', fontSize: '0.95rem', fontWeight: 600 }}>
            <i className='bi bi-tags me-2'></i>Add New Category
          </h5>
          <form onSubmit={handleAdd}>
            <div className='row g-3'>
              <div className='col-md-4'>
                <label className='form-label' style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Category Title</label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='e.g. Beachfront'
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div className='col-md-4'>
                <label className='form-label' style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Description</label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Short description...'
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                />
              </div>
              <div className='col-md-3'>
                <label className='form-label' style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Icon Image</label>
                <input
                  type='file'
                  className='form-control'
                  accept='image/*'
                  onChange={e => setFile(e.target.files[0])}
                />
              </div>
              <div className='col-md-1 d-flex align-items-end'>
                <button type='submit' className='btn btn-primary w-100' disabled={submitting}>
                  {submitting ? <span className='spinner-border spinner-border-sm'></span> : <i className='bi bi-check-lg'></i>}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className='manage-table-card'>
        <div className='manage-table-header'>
          <div className='d-flex align-items-center gap-2'>
            <h5 className='manage-table-title'>
              <i className='bi bi-tags me-2' style={{ color: '#ffd200' }}></i>Categories
            </h5>
            <span className='manage-count-badge'>{categories.length} total</span>
          </div>
          <button className='btn btn-sm btn-outline-warning' onClick={loadCategories}>
            <i className='bi bi-arrow-clockwise me-1'></i>Refresh
          </button>
        </div>

        <div className='manage-table-wrap'>
          {loading ? (
            <div className='text-center py-5'>
              <div className='spinner-border' style={{ color: '#ffd200' }} role='status'></div>
              <p className='mt-2 text-muted'>Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className='text-center py-5 text-muted'>
              <i className='bi bi-tags display-5 d-block mb-2'></i>
              No categories found. Add one above!
            </div>
          ) : (
            <div className='row g-3 p-3'>
              {categories.map(c => (
                <div className='col-md-3 col-sm-4 col-6' key={c.id}>
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(0,210,255,0.1)',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,210,255,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,210,255,0.1)'}
                  >
                    <img
                      src={`${config.server}/${c.image}`}
                      alt={c.title}
                      style={{
                        width: 50, height: 50, objectFit: 'cover',
                        borderRadius: '10px', marginBottom: '0.6rem',
                        border: '1px solid rgba(0,210,255,0.2)',
                      }}
                      onError={e => { e.target.style.display = 'none' }}
                    />
                    <div className='fw-medium' style={{ fontSize: '0.88rem', color: '#e2e8f0' }}>{c.title}</div>
                    <div className='text-muted' style={{ fontSize: '0.75rem', marginBottom: '0.6rem' }}>{c.details}</div>
                    <button
                      className='btn btn-sm btn-outline-danger'
                      style={{ borderRadius: '8px', fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                      onClick={() => handleDelete(c.id)}
                    >
                      <i className='bi bi-trash me-1'></i>Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageCategories
