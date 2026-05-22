import { useEffect, useState } from 'react'

function App() {
  const [juegos, setJuegos] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const obtenerJuegos = (textoBusqueda = '') => {
  setLoading(true)

  fetch(`/api/juegos?q=${textoBusqueda}`)
      .then((res) => res.json())
      .then((data) => {
        setJuegos(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }

  useEffect(() => {
    obtenerJuegos()
  }, [])

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
      <h1 style={{ marginBottom: '2rem' }}>🎮 Steam Lite</h1>
      <input
        type="text"
        placeholder="Buscar juego..."
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value)
          obtenerJuegos(e.target.value)
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
              style={{
                backgroundColor: '#2a475e',
                padding: '1rem',
                borderRadius: '10px',
              }}
            >
              <h2>{juego.titulo}</h2>

              <p>{juego.genero}</p>

              <p>${juego.precio}</p>

              <p>{juego.descripcion}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default App
