import { createContext, useContext, useState } from 'react'

// step1: create context
const ThemeContext = createContext()

// step2: create provider
function ThemeProvider({ children }) {
  // create a state to store theme information
  const [theme, setTheme] = useState('light')

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider

// step3: create custom hook to share the information
export function useTheme() {
  return useContext(ThemeContext)
}
