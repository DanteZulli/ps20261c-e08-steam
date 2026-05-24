import { useEffect, useState } from 'react'

function GameDetail({ id, onBack }) {
    const [juego, setJuego]= useState(null)
    const [loading, setLoading]= useState(true)
    const [error, setError]= useState('')
    
    useEffect(()=>{
    let isMounted=true

    const iniciarCarga= async () => {
        try {
            const response= await fetch(`/api/juegos/${id}`)
            const data= await response.json()

            if (isMounted){
                setJuego(data)
            }
        } catch (error) {
            if(isMounted){
                setError('No se pudo cargar el juego.')
            }
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

}, [id])

if (loading){
    return <p>Cargando juego...</p>
}

if(error){
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

      <h1>{juego.titulo}</h1>
      <p>{juego.genero}</p>
      <p>{juego.descripcion}</p>
      <p>${juego.precio}</p>
      <p>Lanzamiento: {juego.fecha_lanzamiento}</p>
    </main>
  )
}


export default GameDetail

