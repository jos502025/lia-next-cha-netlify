import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Llamada a OpenAI con modelo gpt-4o-mini
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Bearer ${process.env.OPENAI_API_KEY}
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content || "Lo siento, no pude generar respuesta.";

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
