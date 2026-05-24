import { useState } from 'react'

function Register({ onSuccess, onBack, onGoToLogin }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo registrar.')
      }

      onSuccess({ user_name: username, email })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
        background:
          'radial-gradient(circle at top, rgba(102, 192, 244, 0.22), transparent 36%), linear-gradient(180deg, #1b2838 0%, #101822 100%)',
        color: '#e7eef5',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'rgba(42, 71, 94, 0.92)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9fc9e4',
            cursor: 'pointer',
            marginBottom: '1rem',
            padding: 0,
            fontSize: '0.95rem',
          }}
        >
          ← Volver
        </button>

        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Crear cuenta</h1>
        <p style={{ color: '#c6d4df', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Registrate para acceder al catálogo de juegos.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <label style={{ display: 'grid', gap: '0.5rem' }}>
            <span style={{ fontWeight: 600 }}>Nombre de usuario</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre de usuario"
              required
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: '#0f1720',
                color: '#fff',
                fontSize: '1rem',
              }}
            />
          </label>

          <label style={{ display: 'grid', gap: '0.5rem' }}>
            <span style={{ fontWeight: 600 }}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
              required
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: '#0f1720',
                color: '#fff',
                fontSize: '1rem',
              }}
            />
          </label>

          <label style={{ display: 'grid', gap: '0.5rem' }}>
            <span style={{ fontWeight: 600 }}>Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              autoComplete="new-password"
              required
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: '#0f1720',
                color: '#fff',
                fontSize: '1rem',
              }}
            />
          </label>

          {error ? (
            <p
              style={{
                backgroundColor: 'rgba(255, 99, 99, 0.12)',
                border: '1px solid rgba(255, 99, 99, 0.3)',
                color: '#ffb3b3',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
              }}
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.95rem 1rem',
              borderRadius: '10px',
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              fontWeight: 700,
              fontSize: '1rem',
              backgroundColor: '#66c0f4',
              color: '#07111a',
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#9fc9e4' }}>
          ¿Ya tenés cuenta?{' '}
          <button
            type="button"
            onClick={onGoToLogin}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#66c0f4',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            Iniciar sesión
          </button>
        </p>
      </section>
    </main>
  )
}

export default Register
