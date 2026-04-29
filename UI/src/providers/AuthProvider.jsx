import { createContext, useContext, useState } from 'react'

// create an empty context
const AuthContext = createContext()

function AuthProvider({ children }) {
  // create state to store logged user information, initialize from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

// expose the context using custom hook
export function useAuth() {
  return useContext(AuthContext)
}
