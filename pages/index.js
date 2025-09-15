// pages/index.js

export default function Home() {
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Bienvenido a LÍA Consultoría</h1>
      <p style={styles.subtitle}>
        Tu aliado imparcial en bienes raíces y expansión.
      </p>
      <section style={styles.card}>
        <h2>¿Qué hacemos?</h2>
        <p>
          Te ayudamos a tomar decisiones inmobiliarias con claridad,
          transparencia y estrategia. Nuestro enfoque está en ti, no en la
          propiedad.
        </p>
      </section>
      <section style={styles.card}>
        <h2>Servicios principales</h2>
        <ul>
          <li>TIC – Test Inteligente de Claridad</li>
          <li>Diagnóstico estratégico de propiedades</li>
          <li>Acompañamiento en negociación y cierre</li>
          <li>Capacitación para inversionistas y compradores</li>
        </ul>
      </section>
    </main>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "40px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2.5rem",
    color: "#003366", // azul LÍA
    textAlign: "center",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#555",
    textAlign: "center",
    marginBottom: "30px",
  },
  card: {
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
};
