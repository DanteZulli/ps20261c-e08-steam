import { useState } from "react";

function Cart({carrito, onBack, onComprar}){
    const total = carrito.reduce((acum, juego) => acum + juego.precio, 0)

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

    <h1>🛒 Tu carrito</h1>

    {carrito.length === 0 ? (
      <p style={{ color: '#8f98a0' }}>Tu carrito está vacío.</p>
    ) : (
      <>
        {carrito.map((juego) => (
          <div
            key={juego.id}
            style={{
              backgroundColor: '#2a475e',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{juego.titulo}</span>
            <span style={{ color: '#beee11' }}>${juego.precio}</span>
          </div>
        ))}

        <div
          style={{
            borderTop: '1px solid #3a546e',
            paddingTop: '1rem',
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            Total: ${total.toFixed(2)}
          </span>
          <button
            onClick={onComprar}
            style={{
              padding: '0.8rem 1.5rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              backgroundColor: '#66c0f4',
              color: '#0f1720',
            }}
          >
            Confirmar compra
          </button>
        </div>
      </>
    )}
  </main>
)
}



export default Cart