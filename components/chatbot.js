"use client";
import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages([...messages, { role: "user", content: input }, { role: "bot", content: data.reply }]);
    setInput("");
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", maxWidth: "500px" }}>
      <div style={{ minHeight: "200px", marginBottom: "1rem" }}>
        {messages.map((m, i) => (
          <p key={i}><b>{m.role}:</b> {m.content}</p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "70%" }}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}
