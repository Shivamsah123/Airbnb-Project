import React from 'react'
import './AboutUs.css'

const team = [
  {
    name: 'Shivam Kumar Sah',
    role: 'Full Stack Developer',
    desc: 'Passionate about building scalable web applications with modern tech stack.',
    emoji: '👨‍💻',
    skills: ['React', 'Node.js', 'MongoDB'],
  },
  {
    name: 'Sunbeam InfoTech',
    role: 'Project Mentors',
    desc: 'Guiding students to build industry-ready, production-grade applications.',
    emoji: '🏫',
    skills: ['Java', 'Spring Boot', 'Microservices'],
  },
]

const stats = [
  { value: '500+', label: 'Properties Listed', icon: '🏠' },
  { value: '2K+', label: 'Happy Guests', icon: '😊' },
  { value: '50+', label: 'Cities Covered', icon: '🗺️' },
  { value: '24/7', label: 'Support Available', icon: '🛎️' },
]

const values = [
  {
    icon: '🔒',
    title: 'Safe & Secure',
    desc: 'Every property is verified. Your bookings and payments are always protected.',
  },
  {
    icon: '💎',
    title: 'Premium Quality',
    desc: 'We handpick properties that meet our high standards of comfort and style.',
  },
  {
    icon: '⚡',
    title: 'Instant Booking',
    desc: 'Book your perfect stay in minutes. No delays, no complications.',
  },
  {
    icon: '💰',
    title: 'Best Prices',
    desc: 'Competitive pricing with no hidden fees. What you see is what you pay.',
  },
]

function AboutUs() {
  return (
    <div className='about-page'>
      {/* Hero Banner */}
      <div className='about-hero'>
        <div className='about-hero-content'>
          <span className='about-hero-badge'>🏠 About MyAirbnb</span>
          <h1 className='about-hero-title'>
            Your Home, <span className='gradient-text'>Everywhere</span>
          </h1>
          <p className='about-hero-desc'>
            We connect travelers with unique, handpicked properties across India.
            Whether you're looking for a cozy apartment or a luxury villa —
            we've got the perfect place for you.
          </p>
        </div>
        {/* Decorative blobs */}
        <div className='about-blob about-blob-1'></div>
        <div className='about-blob about-blob-2'></div>
      </div>

      <div className='about-container'>
        {/* Stats Row */}
        <div className='about-stats-row'>
          {stats.map((s, i) => (
            <div className='about-stat-item' key={i}>
              <span className='stat-emoji'>{s.icon}</span>
              <span className='stat-num'>{s.value}</span>
              <span className='stat-lbl'>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className='about-section'>
          <div className='about-section-text'>
            <div className='section-tag'>Our Mission</div>
            <h2 className='section-heading'>Making Travel Feel Like Home</h2>
            <p className='section-body'>
              MyAirbnb was born from a simple idea — everyone deserves a place
              where they feel at home, no matter where they are in the world.
              We built this platform to make property rental <strong>effortless,
              transparent, and delightful</strong> for both guests and hosts.
            </p>
            <p className='section-body'>
              Our platform connects property owners with travelers looking for
              authentic, comfortable stays. We take care of the technology so
              you can focus on what matters — <strong>creating memories</strong>.
            </p>
          </div>
          <div className='about-section-visual'>
            <div className='mission-card'>
              <div className='mission-icon'>🌍</div>
              <h4>Built for India</h4>
              <p>Designed keeping Indian travelers and property owners in mind, with local support and pricing in ₹.</p>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className='about-values-section'>
          <div className='section-tag center'>Our Values</div>
          <h2 className='section-heading center'>Why Choose MyAirbnb?</h2>
          <div className='values-grid'>
            {values.map((v, i) => (
              <div className='value-card' key={i}>
                <div className='value-icon'>{v.icon}</div>
                <h4 className='value-title'>{v.title}</h4>
                <p className='value-desc'>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className='about-team-section'>
          <div className='section-tag center'>The Team</div>
          <h2 className='section-heading center'>People Behind MyAirbnb</h2>
          <div className='team-grid'>
            {team.map((member, i) => (
              <div className='team-card' key={i}>
                <div className='team-avatar'>{member.emoji}</div>
                <h4 className='team-name'>{member.name}</h4>
                <p className='team-role'>{member.role}</p>
                <p className='team-desc'>{member.desc}</p>
                <div className='team-skills'>
                  {member.skills.map((s, j) => (
                    <span className='skill-tag' key={j}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className='about-cta'>
          <h3>Ready to find your perfect stay?</h3>
          <p>Explore hundreds of properties across India right now.</p>
          <a href='/home/properties' className='cta-btn'>
            Browse Properties <i className='bi bi-arrow-right ms-2'></i>
          </a>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
