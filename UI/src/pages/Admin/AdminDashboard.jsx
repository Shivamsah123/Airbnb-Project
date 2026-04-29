import React, { useEffect, useState } from 'react'
import { getAdminStats } from '../../services/admin'
import ManageUsers from './ManageUsers'
import ManageProperties from './ManageProperties'
import ManageCategories from './ManageCategories'
import ManageBookings from './ManageBookings'
import './Admin.css'

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({ users: 0, properties: 0, bookings: 0 })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      const statsRes = await getAdminStats()
      if (statsRes && statsRes.status === 'success') {
        setStats(statsRes.data)
      }
      setLoading(false)
    }
    if (activeTab === 'overview') {
      loadStats()
    }
  }, [activeTab])

  const menuItems = [
    { key: 'overview', icon: 'bi-speedometer2', label: 'Overview' },
    { key: 'users', icon: 'bi-people', label: 'Manage Users' },
    { key: 'properties', icon: 'bi-house-door', label: 'Properties' },
    { key: 'categories', icon: 'bi-tags', label: 'Categories' },
    { key: 'bookings', icon: 'bi-calendar-check', label: 'All Bookings' },
  ]

  const statCards = [
    {
      label: 'Total Users',
      value: stats.users,
      icon: 'bi-people-fill',
      gradient: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
      glow: 'rgba(0, 210, 255, 0.3)',
    },
    {
      label: 'Active Properties',
      value: stats.properties,
      icon: 'bi-house-fill',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      glow: 'rgba(56, 239, 125, 0.3)',
    },
    {
      label: 'Total Bookings',
      value: stats.bookings,
      icon: 'bi-calendar-check-fill',
      gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
      glow: 'rgba(255, 210, 0, 0.3)',
    },
    {
      label: 'Revenue (Est.)',
      value: `₹${((stats.bookings || 0) * 3500).toLocaleString()}`,
      icon: 'bi-currency-rupee',
      gradient: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
      glow: 'rgba(238, 9, 121, 0.3)',
    },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'users': return <ManageUsers searchQuery={searchQuery} />
      case 'properties': return <ManageProperties searchQuery={searchQuery} />
      case 'categories': return <ManageCategories />
      case 'bookings': return <ManageBookings searchQuery={searchQuery} />
      default:
        return (
          <div className='admin-overview'>
            <div className='overview-header'>
              <h3 className='overview-title'>Platform Overview</h3>
              <p className='overview-subtitle'>Real-time insights for your Airbnb platform</p>
            </div>

            {/* Stat Cards */}
            <div className='admin-stat-grid'>
              {statCards.map((card, i) => (
                <div key={i} className='admin-stat-card' style={{ '--card-glow': card.glow }}>
                  <div className='stat-icon-wrap' style={{ background: card.gradient }}>
                    <i className={`bi ${card.icon}`}></i>
                  </div>
                  <div className='stat-info'>
                    <span className='stat-label'>{card.label}</span>
                    <span className='stat-value'>{loading ? '...' : card.value}</span>
                  </div>
                  <div className='stat-bg-blob' style={{ background: card.gradient }}></div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className='quick-actions-section'>
              <h4 className='section-subtitle'>Quick Actions</h4>
              <div className='quick-actions-grid'>
                {[
                  { icon: 'bi-person-plus', label: 'View New Users', tab: 'users', color: '#00d2ff' },
                  { icon: 'bi-house-add', label: 'Review Properties', tab: 'properties', color: '#38ef7d' },
                  { icon: 'bi-tag', label: 'Add Category', tab: 'categories', color: '#ffd200' },
                  { icon: 'bi-journal-check', label: 'Check Bookings', tab: 'bookings', color: '#ff6a00' },
                ].map((action, i) => (
                  <button
                    key={i}
                    className='quick-action-card'
                    onClick={() => { setActiveTab(action.tab); setSidebarOpen(false) }}
                    style={{ '--action-color': action.color }}
                  >
                    <i className={`bi ${action.icon} quick-action-icon`}></i>
                    <span>{action.label}</span>
                    <i className='bi bi-arrow-right quick-arrow'></i>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Banner */}
            <div className='admin-info-banner'>
              <i className='bi bi-shield-check info-banner-icon'></i>
              <div>
                <h5>Admin Portal Active</h5>
                <p>You have full control over users, properties, categories and bookings. Use the sidebar or quick actions above to navigate.</p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className='admin-layout'>
      {/* Mobile Toggle Button */}
      <button
        className='admin-sidebar-toggle'
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-layout-sidebar'}`}></i>
        <span>{sidebarOpen ? 'Close Menu' : 'Menu'}</span>
      </button>

      <div className='admin-body'>
        {/* ===== SIDEBAR ===== */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className='sidebar-header'>
            <div className='admin-avatar'>
              <i className='bi bi-shield-fill-check'></i>
            </div>
            <div>
              <p className='sidebar-role'>Administrator</p>
              <p className='sidebar-subtitle'>Full Access</p>
            </div>
          </div>

          {/* Search Bar in Sidebar */}
          <div className='sidebar-search'>
            <i className='bi bi-search sidebar-search-icon'></i>
            <input
              type='text'
              placeholder='Search...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='sidebar-search-input'
            />
            {searchQuery && (
              <button className='sidebar-search-clear' onClick={() => setSearchQuery('')}>
                <i className='bi bi-x'></i>
              </button>
            )}
          </div>

          <nav className='sidebar-nav'>
            {menuItems.map((item) => (
              <button
                key={item.key}
                className={`sidebar-nav-btn ${activeTab === item.key ? 'active' : ''}`}
                onClick={() => { setActiveTab(item.key); setSidebarOpen(false) }}
              >
                <i className={`bi ${item.icon} sidebar-nav-icon`}></i>
                <span>{item.label}</span>
                {activeTab === item.key && <i className='bi bi-chevron-right sidebar-active-arrow'></i>}
              </button>
            ))}
          </nav>

          <div className='sidebar-footer'>
            <div className='sidebar-footer-badge'>
              <i className='bi bi-circle-fill text-success me-2' style={{ fontSize: '0.5rem' }}></i>
              System Online
            </div>
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className='admin-main'>
          <div className='admin-content-header'>
            <h2 className='admin-page-title'>
              {menuItems.find(m => m.key === activeTab)?.label || 'Overview'}
            </h2>
            {activeTab !== 'overview' && activeTab !== 'categories' && (
              <div className='admin-header-search'>
                <i className='bi bi-search'></i>
                <input
                  type='text'
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='admin-header-search-input'
                />
              </div>
            )}
          </div>
          <div className='admin-content-body'>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
