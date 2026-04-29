import React, { useState } from 'react'
import { useAuth } from '../../providers/AuthProvider'
import { toast } from 'react-toastify'
import './UserProfile.css'

function UserProfile() {
  const { user, setUser } = useAuth()

  // Edit mode toggle
  const [isEditing, setIsEditing] = useState(false)

  // Local form state — pre-filled from context
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  })

  const [saving, setSaving] = useState(false)

  const getInitials = () => {
    const name = user?.firstName || ''
    const last = user?.lastName || ''
    return `${name.charAt(0)}${last.charAt(0)}`.toUpperCase() || '?'
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (!form.firstName.trim()) {
      toast.warning('First name cannot be empty')
      return
    }
    setSaving(true)

    // Update in AuthContext + localStorage (local-only, no backend call needed)
    const updatedUser = { ...user, ...form }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))

    setTimeout(() => {
      setSaving(false)
      setIsEditing(false)
      toast.success('Profile updated successfully! ✅')
    }, 600)
  }

  const handleCancel = () => {
    // Reset form to current user data
    setForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    })
    setIsEditing(false)
  }

  const stats = [
    { icon: '🏠', label: 'Properties Viewed', value: '24' },
    { icon: '❤️', label: 'Wishlist Items', value: '8' },
    { icon: '📅', label: 'Total Bookings', value: '3' },
    { icon: '⭐', label: 'Reviews Given', value: '5' },
  ]

  return (
    <div className='profile-page'>
      {/* Hero Banner */}
      <div className='profile-hero'>
        <div className='profile-hero-overlay' />
        <div className='profile-hero-content'>
          <div className='profile-avatar-wrapper'>
            <div className='profile-avatar-ring'>
              <div className='profile-avatar-circle'>
                {getInitials()}
              </div>
            </div>
            {user?.role === 'admin' && (
              <span className='profile-admin-crown'>👑</span>
            )}
          </div>
          <h1 className='profile-username'>
            {user?.firstName} {user?.lastName}
          </h1>
          <span className={`profile-role-badge ${user?.role === 'admin' ? 'admin' : 'user'}`}>
            {user?.role === 'admin' ? '⚡ Administrator' : '👤 Guest Member'}
          </span>
        </div>
      </div>

      <div className='profile-body container'>
        {/* Stats Row */}
        <div className='profile-stats-row'>
          {stats.map((s, i) => (
            <div className='profile-stat-card' key={i}>
              <span className='stat-icon'>{s.icon}</span>
              <span className='stat-value'>{s.value}</span>
              <span className='stat-label'>{s.label}</span>
            </div>
          ))}
        </div>

        <div className='profile-grid'>
          {/* Left — Info Card */}
          <div className='profile-info-card card p-4'>
            <div className='profile-card-header'>
              <h4 className='profile-section-title'>
                <i className='bi bi-person-lines-fill me-2' />
                Personal Information
              </h4>
              {!isEditing && (
                <button
                  className='profile-edit-btn'
                  onClick={() => setIsEditing(true)}
                >
                  <i className='bi bi-pencil-square me-1' />
                  Edit Profile
                </button>
              )}
            </div>

            <div className='profile-fields'>
              {/* First Name */}
              <div className='profile-field'>
                <label className='profile-label'>
                  <i className='bi bi-person me-2' />First Name
                </label>
                {isEditing ? (
                  <input
                    name='firstName'
                    value={form.firstName}
                    onChange={handleChange}
                    className='form-control profile-input'
                    placeholder='Enter first name'
                  />
                ) : (
                  <div className='profile-value'>{user?.firstName || '—'}</div>
                )}
              </div>

              {/* Last Name */}
              <div className='profile-field'>
                <label className='profile-label'>
                  <i className='bi bi-person me-2' />Last Name
                </label>
                {isEditing ? (
                  <input
                    name='lastName'
                    value={form.lastName}
                    onChange={handleChange}
                    className='form-control profile-input'
                    placeholder='Enter last name'
                  />
                ) : (
                  <div className='profile-value'>{user?.lastName || '—'}</div>
                )}
              </div>

              {/* Email */}
              <div className='profile-field'>
                <label className='profile-label'>
                  <i className='bi bi-envelope me-2' />Email Address
                </label>
                {isEditing ? (
                  <input
                    name='email'
                    value={form.email}
                    onChange={handleChange}
                    className='form-control profile-input'
                    placeholder='Enter email'
                    type='email'
                  />
                ) : (
                  <div className='profile-value'>{user?.email || '—'}</div>
                )}
              </div>

              {/* Phone */}
              <div className='profile-field'>
                <label className='profile-label'>
                  <i className='bi bi-telephone me-2' />Phone Number
                </label>
                {isEditing ? (
                  <input
                    name='phone'
                    value={form.phone}
                    onChange={handleChange}
                    className='form-control profile-input'
                    placeholder='Enter phone number'
                    type='tel'
                  />
                ) : (
                  <div className='profile-value'>{user?.phone || '—'}</div>
                )}
              </div>

              {/* Bio */}
              <div className='profile-field full-width'>
                <label className='profile-label'>
                  <i className='bi bi-chat-quote me-2' />About Me
                </label>
                {isEditing ? (
                  <textarea
                    name='bio'
                    value={form.bio}
                    onChange={handleChange}
                    className='form-control profile-input'
                    placeholder='Tell something about yourself...'
                    rows={3}
                  />
                ) : (
                  <div className='profile-value bio-text'>
                    {user?.bio || 'No bio added yet. Click Edit to add one!'}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className='profile-actions full-width'>
                  <button
                    className='btn btn-primary profile-save-btn'
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className='spinner-border spinner-border-sm me-2' />
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className='bi bi-check-lg me-2' />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    className='btn profile-cancel-btn'
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <i className='bi bi-x-lg me-2' />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right — Account Details Card */}
          <div className='profile-right-col'>
            {/* Account Info */}
            <div className='card p-4 profile-account-card mb-3'>
              <h4 className='profile-section-title'>
                <i className='bi bi-shield-lock me-2' />
                Account Details
              </h4>
              <div className='account-detail-row'>
                <span className='account-label'>Account Type</span>
                <span className={`account-value role-pill ${user?.role === 'admin' ? 'admin' : 'user'}`}>
                  {user?.role === 'admin' ? '⚡ Admin' : '👤 User'}
                </span>
              </div>
              <div className='account-detail-row'>
                <span className='account-label'>Member Since</span>
                <span className='account-value'>April 2025</span>
              </div>
              <div className='account-detail-row'>
                <span className='account-label'>Account Status</span>
                <span className='account-value status-active'>
                  <span className='status-dot' />
                  Active
                </span>
              </div>
              <div className='account-detail-row'>
                <span className='account-label'>Last Login</span>
                <span className='account-value'>Today</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className='card p-4 profile-actions-card'>
              <h4 className='profile-section-title'>
                <i className='bi bi-lightning me-2' />
                Quick Actions
              </h4>
              <div className='quick-actions-list'>
                <a href='/home/wishlist' className='quick-action-item'>
                  <i className='bi bi-heart-fill' />
                  <span>My Wishlist</span>
                  <i className='bi bi-chevron-right ms-auto' />
                </a>
                <a href='/home/bookings' className='quick-action-item'>
                  <i className='bi bi-calendar-check-fill' />
                  <span>My Bookings</span>
                  <i className='bi bi-chevron-right ms-auto' />
                </a>
                <a href='/home/properties' className='quick-action-item'>
                  <i className='bi bi-house-door-fill' />
                  <span>Browse Properties</span>
                  <i className='bi bi-chevron-right ms-auto' />
                </a>
                <a href='/home/contact-us' className='quick-action-item'>
                  <i className='bi bi-headset' />
                  <span>Contact Support</span>
                  <i className='bi bi-chevron-right ms-auto' />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
