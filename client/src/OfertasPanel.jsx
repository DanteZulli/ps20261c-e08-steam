import { useEffect, useState } from 'react'

function OfertasPanel({ onBack, juegoInicial }) {
  const [ofertas, setOfertas] = useState([])
  const [juegos, setJuegos] = useState([])
  const [loading, setLoading] = useState(true)

  const [juegoId, setJuegoId] = useState(juegoInicial || '')
  const [descuento, setDescuento] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [bulkGenero, setBulkGenero] = useState('')
  const [bulkDescuento, setBulkDescuento] = useState('')
  const [bulkInicio, setBulkInicio] = useState('')
  const [bulkFin, setBulkFin] = useState('')

  const cargarOfertas = async () => {
    try {
      const r = await fetch('/api/ofertas')
      const d = await r.json()
      setOfertas(d)
    } catch (e) {
      console.error(e)
    }
  }

  const cargarJuegos = async () => {
    try {
      const r = await fetch('/api/juegos')
      const d = await r.json()
      setJuegos(d)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const init = async () => {
      await Promise.all([cargarOfertas(), cargarJuegos()])
      setLoading(false)
    }
    init()
  }, [])

  const handleCrearOferta = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!juegoId || !descuento || !fechaInicio || !fechaFin) {
      setError('Completá todos los campos.')
      return
    }

    if (fechaFin < fechaInicio) {
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.')
      return
    }

    try {
      const r = await fetch('/api/ofertas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          juego_id: Number(juegoId),
          descuento: Number(descuento),
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
        }),
      })
      const data = await r.json()
      if (r.ok) {
        setSuccess('Oferta creada correctamente.')
        setDescuento('')
        setFechaInicio('')
        setFechaFin('')
        await cargarOfertas()
      } else {
        setError(data.message)
      }
    } catch {
      setError('Error de conexión.')
    }
  }

  const handleEliminar = async (id) => {
    try {
      await fetch(`/api/ofertas/${id}`, { method: 'DELETE' })
      await cargarOfertas()
    } catch {
      setError('Error al eliminar.')
    }
  }

  const handleBulk = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!bulkGenero || !bulkDescuento || !bulkInicio || !bulkFin) {
      setError('Completá todos los campos para la oferta masiva.')
      return
    }

    if (bulkFin < bulkInicio) {
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.')
      return
    }

    try {
      const r = await fetch('/api/ofertas/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genero: bulkGenero,
          descuento: Number(bulkDescuento),
          fecha_inicio: bulkInicio,
          fecha_fin: bulkFin,
        }),
      })
      const data = await r.json()
      if (r.ok) {
        setSuccess(data.message)
        setBulkDescuento('')
        setBulkInicio('')
        setBulkFin('')
        await cargarOfertas()
      } else {
        setError(data.message)
      }
    } catch {
      setError('Error de conexión.')
    }
  }

  const juegoSeleccionado = juegos.find((j) => j.id === Number(juegoId))

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

      <h1>Gestión de Ofertas</h1>

      {error && (
        <p style={{ color: '#ff8a8a', background: '#2b0f0f', padding: '0.8rem', borderRadius: '8px' }}>{error}</p>
      )}
      {success && (
        <p style={{ color: '#8aff8a', background: '#0f2b0f', padding: '0.8rem', borderRadius: '8px' }}>{success}</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
        <section style={{ backgroundColor: '#16202d', padding: '1.5rem', borderRadius: '8px' }}>
          <h2>Crear Oferta Individual</h2>
          <form onSubmit={handleCrearOferta} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', color: '#acb2b8' }}>Juego</label>
              <select
                value={juegoId}
                onChange={(e) => setJuegoId(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: 'none', backgroundColor: '#2a3f5a', color: 'white' }}
              >
                <option value="">Seleccionar juego...</option>
                {juegos.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.titulo} — ${j.precio}
                  </option>
                ))}
              </select>
            </div>

            {juegoSeleccionado && descuento && (
              <p style={{ color: '#beee11', fontSize: '1.1rem' }}>
                Precio original: ${juegoSeleccionado.precio} →{' '}
                <strong>${(juegoSeleccionado.precio * (100 - Number(descuento)) / 100).toFixed(2)}</strong>
                {' '}({descuento}% OFF)
              </p>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', color: '#acb2b8' }}>Descuento (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={descuento}
                onChange={(e) => setDescuento(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: 'none', backgroundColor: '#2a3f5a', color: 'white', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', color: '#acb2b8' }}>Fecha de inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: 'none', backgroundColor: '#2a3f5a', color: 'white', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', color: '#acb2b8' }}>Fecha de fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: 'none', backgroundColor: '#2a3f5a', color: 'white', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                backgroundColor: '#66c0f4',
                color: '#0f1720',
              }}
            >
              Crear Oferta
            </button>
          </form>
        </section>

        <section style={{ backgroundColor: '#16202d', padding: '1.5rem', borderRadius: '8px' }}>
          <h2>Oferta Masiva por Etiqueta</h2>
          <form onSubmit={handleBulk} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', color: '#acb2b8' }}>Género / Etiqueta</label>
              <select
                value={bulkGenero}
                onChange={(e) => setBulkGenero(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: 'none', backgroundColor: '#2a3f5a', color: 'white' }}
              >
                <option value="">Seleccionar género...</option>
                {[...new Set(juegos.map((j) => j.genero).filter(Boolean))].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', color: '#acb2b8' }}>Descuento (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={bulkDescuento}
                onChange={(e) => setBulkDescuento(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: 'none', backgroundColor: '#2a3f5a', color: 'white', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', color: '#acb2b8' }}>Fecha de inicio</label>
              <input
                type="date"
                value={bulkInicio}
                onChange={(e) => setBulkInicio(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: 'none', backgroundColor: '#2a3f5a', color: 'white', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', color: '#acb2b8' }}>Fecha de fin</label>
              <input
                type="date"
                value={bulkFin}
                onChange={(e) => setBulkFin(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: 'none', backgroundColor: '#2a3f5a', color: 'white', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                backgroundColor: '#beee11',
                color: '#0f1720',
              }}
            >
              Aplicar a todos los {bulkGenero && `"${bulkGenero}"`}
            </button>
          </form>
        </section>
      </div>

      <section style={{ marginTop: '2rem', backgroundColor: '#16202d', padding: '1.5rem', borderRadius: '8px' }}>
        <h2>Ofertas Actuales</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : ofertas.length === 0 ? (
          <p style={{ color: '#8f98a0' }}>No hay ofertas registradas.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #3a546e' }}>
                  <th style={{ padding: '0.8rem', textAlign: 'left', color: '#acb2b8' }}>Juego</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left', color: '#acb2b8' }}>Desc.</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left', color: '#acb2b8' }}>Precio Original</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left', color: '#acb2b8' }}>Precio Oferta</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left', color: '#acb2b8' }}>Inicio</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left', color: '#acb2b8' }}>Fin</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left', color: '#acb2b8' }}>Estado</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left', color: '#acb2b8' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {ofertas.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #2a475e' }}>
                    <td style={{ padding: '0.8rem' }}>{o.juego_titulo}</td>
                    <td style={{ padding: '0.8rem', color: '#beee11', fontWeight: 'bold' }}>{o.descuento}%</td>
                    <td style={{ padding: '0.8rem' }}>${o.juego_precio}</td>
                    <td style={{ padding: '0.8rem', color: '#beee11' }}>${o.precio_oferta}</td>
                    <td style={{ padding: '0.8rem' }}>{o.fecha_inicio}</td>
                    <td style={{ padding: '0.8rem' }}>{o.fecha_fin}</td>
                    <td style={{ padding: '0.8rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                          backgroundColor: o.activa ? '#1f4a2a' : '#4a1f1f',
                          color: o.activa ? '#8aff8a' : '#ff8a8a',
                        }}
                      >
                        {o.activa ? 'Activa' : 'Expirada'}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem' }}>
                      <button
                        onClick={() => handleEliminar(o.id)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: '#ff8a8a',
                          color: '#2b0f0f',
                          fontWeight: 'bold',
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default OfertasPanel