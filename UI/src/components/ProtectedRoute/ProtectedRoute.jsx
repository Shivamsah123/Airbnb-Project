import React from 'react'
import { useAuth } from '../../providers/AuthProvider'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, requiredRole }) {
  // get the user info from AuthContext
  const { user } = useAuth()

  if (!user) {
    return <Navigate to='/login' />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to='/home/properties' />
  }

  return children
}

export default ProtectedRoute
