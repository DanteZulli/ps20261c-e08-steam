import { useEffect, useState } from 'react'

function GameDetail({ id, onBack }) {
    const [juego, setJuego] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    
    const [resenas, setResenas] = useState([])
    const [nuevoComentario, setNuevoComentario] = useState('')
    const [nuevoRating, setNuevoRating] = useState(5) // Por defecto 5 estrellas

    useEffect(() => {
        let isMounted = true

        const iniciarCarga = async () => {
            try {
                const response = await fetch(`/api/juegos/${id}`)
                const data = await response.json()

                const resenasResponse = await fetch(`/api/juegos/${id}/resenas`)
                const resenasData = await resenasResponse.json()

                if (isMounted) {
                    setJuego(data)
                    setResenas(resenasData) 
                }
            } catch (error) {
                if (isMounted) {
                    setError('No se pudo cargar el juego o las reseñas.')
                }
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
    }, [id])

    const manejarEnvioResena = async (e) => {
        e.preventDefault() 

        if (!nuevoComentario.trim()) return alert('Por favor, escribí un comentario.')

        // 🌟 LEEMOS LA CLAVE EXACTA QUE SETEA APP.JS
        const usuarioLocal = JSON.parse(localStorage.getItem('steam-lite-user') || '{}')

        // Validamos si el usuario realmente pasó por el login
        if (!usuarioLocal.user_id) {
            return alert('Debes iniciar sesión para dejar una reseña.')
        }

        const datosResena = {
            contenido: nuevoComentario,
            rating: nuevoRating,
            juego_id: id,
            usuario_id: usuarioLocal.user_id // <-- ENVIAMOS EL ID REAL DE LA SESIÓN ACTIVA
        }

        try {
            const response = await fetch('http://localhost:3001/api/resenas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosResena)
            })

            if (response.ok) {
                alert('¡Reseña publicada!')
                setNuevoComentario('') 
                
                // Refrescamos la lista de opiniones
                const resenasResponse = await fetch(`/api/juegos/${id}/resenas`)
                const resenasData = await resenasResponse.json()
                setResenas(resenasData)
            } else {
                alert('Error al publicar la reseña.')
            }
        } catch (error) {
            console.error(error)
            alert('Error de conexión con el servidor.')
        }
    }

    if (loading) {
        return <p>Cargando juego...</p>
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

            <div
                style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(' + juego.imagen_url + ')',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '3rem 2rem',
                    borderRadius: '8px',
                    marginBottom: '2rem',
                }}
            >
                <h1 style={{ margin: 0 }}>{juego.titulo}</h1>
                <p style={{ color: '#67c1f5', fontWeight: 'bold', marginTop: '0.5rem' }}>{juego.genero}</p>
                <p>{juego.descripcion}</p>
                <p style={{ fontSize: '1.25rem', color: '#beee11' }}>${juego.precio}</p>
                <p style={{ fontSize: '0.85rem', color: '#8f98a0' }}>Lanzamiento: {juego.fecha_lanzamiento}</p>
            </div>

            <hr style={{ border: '0', height: '1px', background: '#3a546e', margin: '2rem 0' }} />

            {/* === NUEVO: Formulario para dejar una Reseña === */}
            <section style={{ backgroundColor: '#16202d', padding: '1.5rem', borderRadius: '4px', marginBottom: '2rem' }}>
                <h3 style={{ marginTop: 0 }}>Dejar una reseña</h3>
                <form onSubmit={manejarEnvioResena}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ marginRight: '1rem' }}>Valoración:</label>
                        <select 
                            value={nuevoRating} 
                            onChange={(e) => setNuevoRating(Number(e.target.value))}
                            style={{ padding: '0.3rem', backgroundColor: '#2a3f5a', color: 'white', border: 'none', borderRadius: '3px' }}
                        >
                            <option value="5">⭐⭐⭐⭐⭐ (Excelente)</option>
                            <option value="4">⭐⭐⭐⭐ (Bueno)</option>
                            <option value="3">⭐⭐⭐ (Regular)</option>
                            <option value="2">⭐⭐ (Malo)</option>
                            <option value="1">⭐ (Muy malo)</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <textarea
                            rows="4"
                            placeholder="Escribí qué te pareció el juego..."
                            value={nuevoComentario}
                            onChange={(e) => setNuevoComentario(e.target.value)}
                            style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem', backgroundColor: '#2a3f5a', color: 'white', border: 'none', borderRadius: '3px', resize: 'vertical' }}
                        />
                    </div>
                    <button 
                        type="submit"
                        style={{ backgroundColor: '#67c1f5', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Publicar Reseña
                    </button>
                </form>
            </section>

            {/* === NUEVO: Listado de Reseñas === */}
            <section>
                <h2>Reseñas de la Comunidad</h2>
                {resenas.length === 0 ? (
                    <p style={{ color: '#8f98a0' }}>Nadie escribió una reseña sobre este juego todavía. ¡Sé el primero!</p>
                ) : (
                    resenas.map((r) => (
                        <div 
                            key={r.id} 
                            style={{ backgroundColor: '#16202d', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', borderLeft: '4px solid #67c1f5' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 'bold', color: '#67c1f5' }}>👤 {r.username}</span>
                                <span style={{ color: '#beee11' }}>{'⭐'.repeat(r.rating)}</span>
                            </div>
                            <p style={{ margin: 0, color: '#acb2b8' }}>{r.contenido}</p>
                            <small style={{ color: '#566675', display: 'block', marginTop: '0.5rem' }}>Publicado el: {r.created_at}</small>
                        </div>
                    ))
                )}
            </section>
        </main>
    )
}

export default GameDetail