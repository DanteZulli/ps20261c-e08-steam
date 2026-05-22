import { useEffect, useState } from 'react'
import Login from './Login.jsx'
import Games from './Games.jsx'

function HomePage({ onGoToLogin }) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
        background: 'linear-gradient(180deg, #1b2838 0%, #101822 100%)',
      }}
    >
      <button
        onClick={onGoToLogin}
        style={{
          padding: '1rem 1.4rem',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '1rem',
          backgroundColor: '#66c0f4',
          color: '#0f1720',
        }}
      >
        Iniciar sesión
      </button>
    </main>
  )
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (nextPath) => {
    window.history.pushState({}, '', nextPath)
    setPathname(nextPath)
  }

  const handleLoginSuccess = (usuario) => {
    localStorage.setItem('steam-lite-user', JSON.stringify(usuario))
    navigate('/juegos')
  }

  if (pathname === '/login') {
    return <Login onSuccess={handleLoginSuccess} onBack={() => navigate('/')} />
  }

  if (pathname === '/juegos') {
    return <Games onGoToLogin={() => navigate('/login')} />
  }

  return <HomePage onGoToLogin={() => navigate('/login')} />
}

export default App
