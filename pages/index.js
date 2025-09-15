import ChatBox from "../aplicacion/components/ChatBox";

export default function Home() {
  return (
    <main style={{padding:"2rem", fontFamily:"Arial, sans-serif"}}>
      <h1 style={{marginBottom:"1rem"}}>Bienvenido a LÍA Consultoría</h1>
      <p style={{marginBottom:"1rem"}}>
        Este es tu asistente en tiempo real. Escribe un mensaje y obtén una respuesta inmediata:
      </p>
      <ChatBox />
    </main>
  );
}
