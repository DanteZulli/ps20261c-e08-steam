import { useState, useEffect } from 'react'

function App() {
  const [msg, setMsg] = useState('Cargando...')

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => setMsg(data.message))
      .catch(() => setMsg('Error al conectar con el backend'))
  }, [])

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
      <h1>🎮 Steam Lite</h1>
      <p>{msg}</p>
    </main>
  )
}

export default App
