import { useEffect, useState } from 'react'
import Login from './Login.jsx'
import Register from './Register.jsx'
import Games from './Games.jsx'
import GameDetail from './GameDetail.jsx'

function HomePage({ onGoToLogin, onGoToRegister }) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem',
        background: 'linear-gradient(180deg, #1b2838 0%, #101822 100%)',
      }}
    >
      <h1 style={{ color: '#fff', marginBottom: '1rem' }}>🎮 Steam Lite</h1>
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
      <button
        onClick={onGoToRegister}
        style={{
          padding: '1rem 1.4rem',
          borderRadius: '12px',
          border: '1px solid #66c0f4',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '1rem',
          backgroundColor: 'transparent',
          color: '#66c0f4',
        }}
      >
        Registrarse
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
    return <Login onSuccess={handleLoginSuccess} onBack={() => navigate('/')} onGoToRegister={() => navigate('/register')} />
  }

  if (pathname === '/register') {
    return <Register onSuccess={handleLoginSuccess} onBack={() => navigate('/')} onGoToLogin={() => navigate('/login')} />
  }

  if(pathname.startsWith('/juegos/')){
    const id= pathname.split('/')[2]
    return <GameDetail id={id} onBack={() => navigate('/juegos')} />
  }

  if (pathname === '/juegos') {
    return <Games onGoToLogin={() => navigate('/login')} onNavigate={navigate} />
  }

  return <HomePage onGoToLogin={() => navigate('/login')} onGoToRegister={() => navigate('/register')} />
}

export default App
