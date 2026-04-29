import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../providers/AuthProvider'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const onLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname.includes(path)

  const getInitials = () => {
    if (!user) return '?'
    const name = user.firstName || user.name || user.email || ''
    return name.charAt(0).toUpperCase()
  }

  return (
    <nav className={`custom-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className='nav-container'>
        {/* Brand */}
        <Link className='nav-brand' to='/home/properties'>
          <span className='brand-icon'>🏠</span>
          <span className='brand-text'>MyAirbnb</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li>
            <Link
              className={`nav-item-link ${isActive('/home/properties') ? 'active' : ''}`}
              to='/home/properties'
              onClick={() => setMenuOpen(false)}
            >
              <i className='bi bi-house-door'></i>
              <span>Properties</span>
            </Link>
          </li>

          {user?.role === 'admin' && (
            <>
              <li>
                <Link
                  className={`nav-item-link ${isActive('/home/add-property') ? 'active' : ''}`}
                  to='/home/add-property'
                  onClick={() => setMenuOpen(false)}
                >
                  <i className='bi bi-plus-square'></i>
                  <span>Add Property</span>
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-item-link admin-link ${isActive('/home/admin') ? 'active' : ''}`}
                  to='/home/admin/dashboard'
                  onClick={() => setMenuOpen(false)}
                >
                  <i className='bi bi-shield-check'></i>
                  <span>Admin Panel</span>
                </Link>
              </li>
            </>
          )}

          {user?.role !== 'admin' && (
            <>
              <li>
                <Link
                  className={`nav-item-link ${isActive('/home/wishlist') ? 'active' : ''}`}
                  to='/home/wishlist'
                  onClick={() => setMenuOpen(false)}
                >
                  <i className='bi bi-heart'></i>
                  <span>Wishlist</span>
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-item-link ${isActive('/home/bookings') ? 'active' : ''}`}
                  to='/home/bookings'
                  onClick={() => setMenuOpen(false)}
                >
                  <i className='bi bi-calendar-check'></i>
                  <span>Bookings</span>
                </Link>
              </li>
            </>
          )}

          <li>
            <Link
              className={`nav-item-link ${isActive('/home/about-us') ? 'active' : ''}`}
              to='/home/about-us'
              onClick={() => setMenuOpen(false)}
            >
              <i className='bi bi-info-circle'></i>
              <span>About</span>
            </Link>
          </li>
          <li>
            <Link
              className={`nav-item-link ${isActive('/home/contact-us') ? 'active' : ''}`}
              to='/home/contact-us'
              onClick={() => setMenuOpen(false)}
            >
              <i className='bi bi-envelope'></i>
              <span>Contact</span>
            </Link>
          </li>
        </ul>

        {/* Right side: Avatar + Logout */}
        <div className='nav-right'>
          <Link
            to='/home/profile'
            className='user-badge'
            style={{ textDecoration: 'none' }}
            title='View Profile'
          >
            <div className='user-avatar'>{getInitials()}</div>
            <div className='user-info'>
              <span className='user-name'>{user?.firstName || user?.name || 'User'}</span>
              <span className={`user-role-badge ${user?.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                {user?.role === 'admin' ? '⚡ Admin' : '👤 User'}
              </span>
            </div>
          </Link>
          <button className='logout-btn' onClick={onLogout}>
            <i className='bi bi-box-arrow-right'></i>
            <span>Logout</span>
          </button>
          {/* Mobile hamburger */}
          <button className='hamburger' onClick={() => setMenuOpen(!menuOpen)}>
            <span className={menuOpen ? 'bar open' : 'bar'}></span>
            <span className={menuOpen ? 'bar open' : 'bar'}></span>
            <span className={menuOpen ? 'bar open' : 'bar'}></span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
