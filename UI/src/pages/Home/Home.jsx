import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import './Home.css'

function Home() {
  const location = useLocation()

  return (
    <div className='home-wrapper'>
      <Navbar />

      {/* Main page content */}
      <main className='home-main'>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className='site-footer'>
        <div className='footer-container'>
          <div className='footer-grid'>
            {/* Brand col */}
            <div className='footer-brand-col'>
              <div className='footer-logo'>
                <span>🏠</span>
                <span className='footer-brand-name'>MyAirbnb</span>
              </div>
              <p className='footer-tagline'>
                Find your perfect stay anywhere in the world. Premium properties, seamless bookings.
              </p>
              <div className='footer-socials'>
                <a href='#' className='social-icon' aria-label='Twitter'><i className='bi bi-twitter-x'></i></a>
                <a href='#' className='social-icon' aria-label='Instagram'><i className='bi bi-instagram'></i></a>
                <a href='#' className='social-icon' aria-label='LinkedIn'><i className='bi bi-linkedin'></i></a>
                <a href='#' className='social-icon' aria-label='Facebook'><i className='bi bi-facebook'></i></a>
              </div>
            </div>

            {/* Links col */}
            <div className='footer-links-col'>
              <h4 className='footer-col-title'>Explore</h4>
              <ul className='footer-link-list'>
                <li><a href='/home/properties'>All Properties</a></li>
                <li><a href='/home/about-us'>About Us</a></li>
                <li><a href='/home/contact-us'>Contact Us</a></li>
              </ul>
            </div>

            {/* Links col 2 */}
            <div className='footer-links-col'>
              <h4 className='footer-col-title'>Support</h4>
              <ul className='footer-link-list'>
                <li><a href='#'>Help Center</a></li>
                <li><a href='#'>Privacy Policy</a></li>
                <li><a href='#'>Terms of Service</a></li>
              </ul>
            </div>

            {/* Contact col */}
            <div className='footer-links-col'>
              <h4 className='footer-col-title'>Contact</h4>
              <ul className='footer-link-list no-link'>
                <li><i className='bi bi-envelope me-2'></i>support@myairbnb.com</li>
                <li><i className='bi bi-telephone me-2'></i>+91 98765 43210</li>
                <li><i className='bi bi-geo-alt me-2'></i>Pune, Maharashtra, India</li>
              </ul>
            </div>
          </div>

          <div className='footer-bottom'>
            <div className='footer-divider'></div>
            <div className='footer-bottom-row'>
              <span>© 2025 MyAirbnb · Sunbeam InfoTech. All rights reserved.</span>
              <span className='footer-made-with'>Made with ❤️ in India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
