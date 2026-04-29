import React from 'react'

import { toast } from 'react-toastify'

function ContactUs() {
  const [formData, setFormData] = React.useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.warning('Please fill all fields')
      return
    }
    toast.success('Your message has been sent successfully! We will get back to you soon.')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className='container mt-5'>
      <div className='row'>
        <div className='col-md-6 mb-4'>
          <h2 className='fw-bold text-primary mb-4'>Get In Touch</h2>
          <p className='text-muted mb-4'>
            Have a question about a booking? Want to partner with us? Or just want to say hi? 
            Fill out the form and our team will get back to you within 24 hours.
          </p>
          
          <div className='mb-3'>
            <h5>📍 Office Address</h5>
            <p className='text-muted'>123 Airbnb Street, Silicon Valley, CA 94025</p>
          </div>
          <div className='mb-3'>
            <h5>📞 Phone Number</h5>
            <p className='text-muted'>+1 (800) 123-4567</p>
          </div>
          <div className='mb-3'>
            <h5>✉️ Email Address</h5>
            <p className='text-muted'>support@myairbnb.com</p>
          </div>
        </div>

        <div className='col-md-6'>
          <div className='card border-0 shadow p-4'>
            <h4 className='mb-4'>Send a Message</h4>
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label className='form-label'>Full Name</label>
                <input 
                  type='text' 
                  className='form-control' 
                  placeholder='John Doe'
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className='mb-3'>
                <label className='form-label'>Email Address</label>
                <input 
                  type='email' 
                  className='form-control' 
                  placeholder='john@example.com'
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className='mb-3'>
                <label className='form-label'>Message</label>
                <textarea 
                  className='form-control' 
                  rows='5' 
                  placeholder='How can we help you?'
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button type='submit' className='btn btn-primary w-100'>Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
