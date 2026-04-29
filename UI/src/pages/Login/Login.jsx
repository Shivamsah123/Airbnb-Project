import React, { useState } from 'react'
import './Login.css'
import { toast } from 'react-toastify'
import { login } from '../../services/users'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../providers/AuthProvider'

function Login() {
  // add the state members for inputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // get the user from AuthContext
  const { setUser } = useAuth()

  // get navigate function reference
  const navigate = useNavigate()

  // click event handler of Login button
  const onLogin = async () => {
    if (email.length == 0) {
      toast.warning('please enter email')
    } else if (password.length == 0) {
      toast.warning('please enter password')
    } else {
      const response = await login(email, password)
      if (response['status'] == 'success') {
        toast.success('login successful')

        // get the token from response and cache it in local storage
        localStorage.setItem('token', response['data']['token'])
        
        const userInfo = {
          firstName: response['data']['firstName'],
          lastName: response['data']['lastName'],
          role: response['data']['role'],
          email: email,
          phone: response['data']['phone'] || '',
        }

        // set the logged in user information
        setUser(userInfo)
        localStorage.setItem('user', JSON.stringify(userInfo))

        // navigate to the proper page based on role
        if (userInfo.role === 'admin') {
          navigate('/home/admin/dashboard')
        } else {
          navigate('/home/properties')
        }
      } else {
        toast.error(response['error'])
      }
    }
  }

  return (
    <div className='container-fluid px-0' style={{ height: '100vh', overflow: 'hidden' }}>
      <div className='row g-0 h-100'>
        {/* Left Side: Image */}
        <div className='col-md-6 d-none d-md-block'>
          <div 
            style={{
              backgroundImage: `linear-gradient(rgba(7, 11, 20, 0.4), rgba(7, 11, 20, 0.8)), url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white'
            }}
          >
            <h1 className='display-3 fw-bold mb-3' style={{ textShadow: '0 0 20px rgba(0, 210, 255, 0.8)' }}>
              MyAirbnb
            </h1>
            <p className='lead fs-4' style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              Find your next perfect stay.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className='col-md-6 d-flex align-items-center justify-content-center bg-dark' style={{ backgroundColor: 'var(--bg-dark) !important' }}>
          <div className='card shadow-lg p-5 border-0' style={{ width: '100%', maxWidth: '450px', background: 'rgba(16, 24, 39, 0.8)' }}>
            <div className='text-center mb-4'>
              <h2 className='fw-bold' style={{ color: 'var(--neon-blue)' }}>Welcome Back</h2>
              <p className='text-muted'>Please login to your account</p>
            </div>

            <div className='mb-4'>
              <label className='form-label text-light'>Email Address</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type='email'
                className='form-control form-control-lg'
                placeholder='Enter your email'
              />
            </div>
            
            <div className='mb-4'>
              <label className='form-label text-light'>Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type='password'
                className='form-control form-control-lg'
                placeholder='Enter your password'
              />
            </div>

            <div className='d-flex justify-content-between align-items-center mb-4'>
              <div className='form-check'>
                <input type='checkbox' className='form-check-input' id='rememberMe' />
                <label className='form-check-label text-muted' htmlFor='rememberMe'>Remember me</label>
              </div>
            </div>

            <button
              onClick={onLogin}
              className='btn btn-primary btn-lg w-100 mb-4 fw-bold'
              style={{ background: 'var(--neon-blue-gradient)' }}
            >
              Sign In
            </button>

            <div className='text-center text-muted'>
              Don't have an account yet? <Link to='/register' className='text-decoration-none' style={{ color: 'var(--neon-blue)' }}>Register here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
