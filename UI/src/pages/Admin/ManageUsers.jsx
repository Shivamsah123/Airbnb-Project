import React, { useEffect, useState } from 'react'
import { getAdminUsers, deleteUser } from '../../services/admin'
import { toast } from 'react-toastify'

function ManageUsers({ searchQuery = '' }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const loadUsers = async () => {
    setLoading(true)
    const response = await getAdminUsers()
    if (response && response.status === 'success') {
      setUsers(response.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to ban this user?')) {
      const response = await deleteUser(id)
      if (response && response.status === 'success') {
        toast.success('User banned successfully')
        loadUsers()
      } else {
        toast.error('Failed to ban user')
      }
    }
  }

  const filtered = users.filter(u => {
    const q = searchQuery.toLowerCase()
    return (
      (u.firstName + ' ' + u.lastName).toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q) ||
      String(u.id).includes(q)
    )
  })

  return (
    <div className='manage-table-card'>
      <div className='manage-table-header'>
        <div className='d-flex align-items-center gap-2'>
          <h5 className='manage-table-title'>
            <i className='bi bi-people me-2 text-info'></i>Users
          </h5>
          <span className='manage-count-badge'>{filtered.length} records</span>
        </div>
        <button className='btn btn-sm btn-outline-info' onClick={loadUsers}>
          <i className='bi bi-arrow-clockwise me-1'></i>Refresh
        </button>
      </div>

      <div className='manage-table-wrap'>
        {loading ? (
          <div className='text-center py-5'>
            <div className='spinner-border text-info' role='status'></div>
            <p className='mt-2 text-muted'>Loading users...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className='text-center py-5 text-muted'>
            <i className='bi bi-search display-5 d-block mb-2'></i>
            No users found{searchQuery ? ` for "${searchQuery}"` : ''}
          </div>
        ) : (
          <table className='table table-hover align-middle mb-0'>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id}>
                  <td className='text-muted' style={{ fontSize: '0.8rem' }}>{u.id}</td>
                  <td>
                    <div className='d-flex align-items-center gap-2'>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: 'white',
                          flexShrink: 0,
                        }}
                      >
                        {(u.firstName || u.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <span className='fw-medium'>{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  <td className='text-muted' style={{ fontSize: '0.88rem' }}>{u.email}</td>
                  <td className='text-muted' style={{ fontSize: '0.88rem' }}>{u.phoneNumber || '—'}</td>
                  <td>
                    <span
                      className='badge'
                      style={{
                        background: u.role === 'admin'
                          ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                          : 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                        color: u.role === 'admin' ? '#1a1200' : 'white',
                        fontSize: '0.75rem',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '20px',
                      }}
                    >
                      {u.role === 'admin' ? '⚡ Admin' : '👤 User'}
                    </span>
                  </td>
                  <td>
                    {u.isDeleted ? (
                      <span className='badge bg-danger' style={{ borderRadius: '20px' }}>🚫 Banned</span>
                    ) : (
                      <span className='badge bg-success' style={{ borderRadius: '20px' }}>✅ Active</span>
                    )}
                  </td>
                  <td>
                    {u.role !== 'admin' && !u.isDeleted && (
                      <button
                        className='btn btn-sm btn-outline-danger'
                        style={{ borderRadius: '8px', fontSize: '0.8rem' }}
                        onClick={() => handleDelete(u.id)}
                      >
                        <i className='bi bi-slash-circle me-1'></i>Ban
                      </button>
                    )}
                    {u.isDeleted && (
                      <span className='text-muted' style={{ fontSize: '0.8rem' }}>—</span>
                    )}
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

export default ManageUsers
