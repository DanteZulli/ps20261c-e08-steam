import { useEffect, useState } from 'react'

function Games({ onGoToLogin, onNavigate }) {
  const [juegos, setJuegos] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [genero, setGenero] = useState('')
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false)
  const usuarioGuardado = localStorage.getItem('steam-lite-user')
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null
  const estaLogueado = Boolean(usuario)

  const cargarJuegos = async (textoBusqueda = '', generoSeleccionado = '') => {
    const response = await fetch(
      `/api/juegos?q=${encodeURIComponent(textoBusqueda)}&genero=${encodeURIComponent(generoSeleccionado)}`,
    )

    return response.json()
  }

  const obtenerJuegos = async (textoBusqueda = '', generoSeleccionado = '') => {
    setLoading(true)

    try {
      const data = await cargarJuegos(textoBusqueda, generoSeleccionado)
      setJuegos(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!estaLogueado) {
      return
    }

    let isMounted = true

    const iniciarCarga = async () => {
      try {
        const data = await cargarJuegos()

        if (isMounted) {
          setJuegos(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    iniciarCarga()

    return () => {
      isMounted = false
    }
  }, [estaLogueado])

  if (!estaLogueado) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '2rem',
          backgroundColor: '#1b2838',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '520px' }}>
          <h1 style={{ marginBottom: '1rem' }}>🎮 Steam Lite</h1>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            debes iniciar sesion para poder explorar juegos
          </p>
          <button
            onClick={onGoToLogin}
            style={{
              padding: '0.9rem 1.2rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: '#66c0f4',
              color: '#0f1720',
            }}
          >
            Ir a iniciar sesión
          </button>
        </div>
      </main>
    )
  }

  return (
    <main
      style={{
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#1b2838',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
        <h1 style={{ marginBottom: '2rem' }}>🎮 Steam Lite</h1>
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setMostrarMenuUsuario(!mostrarMenuUsuario)}
            style={{
              padding: '0.8rem 1rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: '#66c0f4',
              color: '#0f1720',
            }}
          >
            Usuario
          </button>
          <button
  onClick={() => onNavigate('/carrito')}
  style={{
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: '#2a475e',
    color: 'white',
  }}
>
  🛒 Carrito
</button>
<button
  onClick={() => onNavigate('/biblioteca')}
  style={{
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: '#2a475e',
    color: 'white',
  }}
>
  📚 Biblioteca
</button> 

          {mostrarMenuUsuario && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 0.75rem)',
                right: 0,
                minWidth: '240px',
                backgroundColor: '#2a475e',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 18px 40px rgba(0, 0, 0, 0.35)',
                zIndex: 10,
              }}
            >
              <p style={{ marginBottom: '0.5rem', fontWeight: 700 }}>{usuario.user_name}</p>
              <p style={{ marginBottom: '1rem', color: '#c6d4df', fontSize: '0.95rem' }}>{usuario.email}</p>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('steam-lite-user')
                  onGoToLogin()
                }}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  backgroundColor: '#ff8a8a',
                  color: '#2b0f0f',
                }}
              >
                Desloguearse
              </button>
            </div>
          )}
        </div>
      </div>

      <input
        type="text"
        placeholder="Buscar juego..."
        value={busqueda}
        onChange={(e) => {
          const valor = e.target.value

          setBusqueda(valor)
          obtenerJuegos(valor, genero)
        }}
        style={{
          padding: '0.8rem',
          width: '300px',
          marginBottom: '2rem',
          borderRadius: '8px',
          border: 'none',
          fontSize: '1rem',
        }}
      />

      <button
        onClick={() => setMostrarFiltros(!mostrarFiltros)}
        style={{
          padding: '0.8rem 1rem',
          marginLeft: '1rem',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Filtros
      </button>

      {mostrarFiltros && (
        <div
          style={{
            backgroundColor: '#2a475e',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '2rem',
            width: '300px',
          }}
        >
          <h3>Filtrar por género</h3>

          <select
            value={genero}
            onChange={(e) => {
              const valor = e.target.value

              setGenero(valor)
              obtenerJuegos(busqueda, valor)
            }}
            style={{
              padding: '0.8rem',
              width: '100%',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
            }}
          >
            <option value="">Todos los géneros</option>
            <option value="Metroidvania">Metroidvania</option>
            <option value="RPG">RPG</option>
            <option value="Plataformas">Plataformas</option>
            <option value="Puzzle">Puzzle</option>
          </select>
        </div>
      )}

      {loading ? (
        <p>Cargando juegos...</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem',
          }}
        >
          {juegos.map((juego) => (
            <div
              key={juego.id}
              onClick={() => onNavigate(`/juegos/${juego.id}`)}
              style={{
                cursor: 'pointer',
                backgroundColor: '#2a475e',
                padding: '1rem',
                borderRadius: '10px',
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(' + juego.imagen_url + ')',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <h2>{juego.titulo}</h2>
              <p>{juego.genero}</p>
              <p>{juego.descripcion}</p>
              <div style={{ marginTop: '0.5rem' }}>
                {juego.precio_oferta ? (
                  <>
                    <span style={{ textDecoration: 'line-through', color: '#8f98a0', marginRight: '0.5rem' }}>
                      ${juego.precio}
                    </span>
                    <span style={{ color: '#beee11', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      ${juego.precio_oferta}
                    </span>
                    <span style={{
                      marginLeft: '0.5rem',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      backgroundColor: '#beee11',
                      color: '#0f1720',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}>
                      -{juego.descuento}%
                    </span>
                  </>
                ) : (
                  <span style={{ color: '#beee11', fontWeight: 'bold' }}>${juego.precio}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Games