import { useEffect, useState } from 'react'

function Library({ onBack }) {
  const [juegos, setJuegos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [instalados, setInstalados] = useState([])

    useEffect(() =>{
        const usuarioLocal =JSON.parse(localStorage.getItem('steam-lite-user') || '{}')
        let isMounted= true

        const iniciarCarga = async() => {
            try {
                const response = await fetch (`/api/biblioteca/${usuarioLocal.user_id}`)
                const data= await response.json()

                if(isMounted){
                    setJuegos(data)
                }

            } catch (error) {
                setError("No se pudo cargar la biblioteca")
            } finally{
                if(isMounted){
                    setLoading(false)
                }
            }
        }


        iniciarCarga()

        return () => {
            isMounted=false
        }
    }, [])

    const toggleInstalar = (id) => {
    const yaInstalado = instalados.includes(id)

    if (yaInstalado) {
        setInstalados(instalados.filter((j) => j !== id))
    } else {
        setInstalados([...instalados, id])
  }
}

    if (loading) {
  return <p>Cargando biblioteca...</p>
}

if (error) {
  return <p>{error}</p>
}

return (
  <main
    style={{
      padding: '2rem',
      backgroundColor: '#1b2838',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
    }}
  >
    <button
      onClick={onBack}
      style={{
        background: 'transparent',
        border: 'none',
        color: '#9fc9e4',
        cursor: 'pointer',
        marginBottom: '1.5rem',
        fontSize: '0.95rem',
      }}
    >
      ← Volver
    </button>

    <h1>📚 Mi Biblioteca</h1>

    {juegos.length === 0 ? (
      <p style={{ color: '#8f98a0' }}>No tenés juegos en tu biblioteca todavía.</p>
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
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{juego.titulo}</h2>
            <p style={{ color: '#8f98a0', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Adquirido: {juego.fecha_adquisicion}
            </p>
            <button
                onClick={() => !instalados.includes(juego.id) && toggleInstalar(juego.id)}
              style={{
                width: '100%',
                padding: '0.7rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                backgroundColor: instalados.includes(juego.id) ? '#beee11' : '#66c0f4',
                color: '#0f1720',
              }}
            >
              {instalados.includes(juego.id) ? '▶ Jugar' : '⬇ Instalar'}
            </button>
          </div>
        ))}
      </div>
    )}
  </main>
)

}

export default Library