export default function Home() {
  return (
    <div style={{
      padding: '50px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh'
    }}>
      <h1 style={{color: '#1a202c', fontSize: '2.5rem'}}>
        🚀 ¡Mi App Next.js Funciona!
      </h1>
      <p style={{fontSize: '1.2rem', color: '#4a5568'}}>
        Corriendo perfectamente en Netlify
      </p>
      <div style={{marginTop: '30px'}}>
        <button style={{
          padding: '15px 30px',
          fontSize: '16px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          ¡Funciona! 🎉
        </button>
      </div>
    </div>
  )
}
