"use client";
import { useState, useEffect } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Mensaje automático al iniciar
  useEffect(() => {
    const welcomeMessage = {
      role: "bot",
      content: "👋 Hola, soy tu Asistente LÍA. Estoy aquí para ayudarte a analizar ubicaciones, inversiones y plusvalía. ¿Sobre qué zona quieres empezar?"
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      const botMessage = { role: "bot", content: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠ Error: " + error.message }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🤖 Bot Consultor LÍA</h2>
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <p
            key={i}
            style={{
              ...styles.message,
              textAlign: msg.role === "user" ? "right" : "left",
              color: msg.role === "user" ? "#1F4E79" : "#333"
            }}
          >
            <b>{msg.role === "user" ? "Tú" : "Bot"}:</b> {msg.content}
          </p>
        ))}
        {loading && <p style={styles.loading}>⏳ pensando...</p>}
      </div>
      <div style={styles.inputRow}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe aquí..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>Enviar</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "20px auto",
    fontFamily: "Arial, sans-serif",
    textAlign: "center"
  },
  title: {
    color: "#1F4E79",
    marginBottom: "15px"
  },
  chatBox: {
    border: "1px solid #8A94A6",
    borderRadius: "8px",
    padding: "10px",
    height: "400px",
    overflowY: "auto",
    marginBottom: "15px",
    backgroundColor: "#fff"
  },
  message: {
    margin: "6px 0",
    fontSize: "14px"
  },
  loading: {
    fontStyle: "italic",
    color: "#999"
  },
  inputRow: {
    display: "flex",
    gap: "10px"
  },
  input: {
    flex: 1,
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px"
  },
  button: {
    backgroundColor: "#1F4E79",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "4px",
    cursor: "pointer"
  }
};
