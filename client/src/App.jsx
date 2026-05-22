import { useEffect, useState } from 'react'

function App() {
  const [juegos, setJuegos] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [genero, setGenero] = useState('')
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const obtenerJuegos = (textoBusqueda = '', generoSeleccionado = '') => {
  setLoading(true)

  fetch(`/api/juegos?q=${textoBusqueda}&genero=${generoSeleccionado}`)
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
          obtenerJuegos(e.target.value, genero)
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
