cat > bootstrap_lia.sh <<'EOF'
#!/usr/bin/env bash
set -e

# Estructura
mkdir -p app/api/chat components
# globals.css
cat > app/globals.css <<'CSS'
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Helvetica, Arial; background: #ffffff; color: #0f172a; }
/* 🎨 Paleta LÍA */
:root {
  --lia-azul-oscuro: #004AAD;
  --lia-azul-claro: #007BFF;
  --lia-dorado: #C9A040;
  --lia-gris: #7A7A7A;
  --lia-gris-claro: #E5E5E5;
  --lia-blanco: #FFFFFF;
}
.container { max-width: 960px; margin: 0 auto; padding: 24px; }
.header { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:18px 0 8px; }
.brand { font-weight:800; font-size:20px; letter-spacing:.4px; color:var(--lia-azul-oscuro); }
.badge { background: linear-gradient(180deg, var(--lia-azul-oscuro) 0%, var(--lia-azul-claro) 100%); color:var(--lia-blanco); padding:6px 12px; border-radius:999px; font-size:12px; font-weight:700; }
.hero { border:1px solid var(--lia-gris-claro); border-radius:16px; padding:24px; background:#fff; }
.hero h1 { margin:0 0 8px; font-size:28px; color:var(--lia-azul-oscuro); }
.hero p { margin:0; color:#334155; }
.chat-wrap { margin-top:16px; border:1px solid var(--lia-gris-claro); border-radius:14px; overflow:hidden; }
.chat-header { padding:12px 16px; background:linear-gradient(180deg, var(--lia-azul-oscuro) 0%, var(--lia-azul-claro) 100%); color:var(--lia-blanco); font-weight:700; }
.chat-body { padding:16px; max-height:420px; overflow-y:auto; }
.msg { margin:8px 0; padding:12px 14px; border-radius:12px; line-height:1.35; font-size:15px; }
.msg.user { background:#f8fafc; border:1px solid #e2e8f0; }
.msg.bot { background:#fcf7e8; border:1px solid #f1e0a6; }
.chat-form { display:flex; gap:10px; padding:12px; border-top:1px solid var(--lia-gris-claro); }
.input { flex:1; padding:12px; border:1px solid #d1d5db; border-radius:8px; font-size:15px; }
.btn-lia { background-color:var(--lia-dorado); color:var(--lia-azul-oscuro); font-weight:700; border:none; padding:12px 18px; border-radius:10px; transition:all .25s; cursor:pointer; }
.btn-lia:hover { background-color:var(--lia-azul-oscuro); color:var(--lia-dorado); transform:translateY(-1px); }
.btn-lia-whatsapp-float { position:fixed; width:60px; height:60px; bottom:20px; right:20px; background:#25D366; color:#fff; border:2px solid var(--lia-dorado); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:28px; z-index:1000; box-shadow:0 4px 12px rgba(0,0,0,.2); transition:all .3s; cursor:pointer; }
.btn-lia-whatsapp-float:hover { background-color:var(--lia-dorado); color:var(--lia-azul-oscuro); border-color:var(--lia-azul-oscuro); transform:scale(1.1); }
.btn-lia-whatsapp-float::after { content: attr(data-tooltip); position:absolute; bottom:70px; right:0; background:var(--lia-azul-oscuro); color:#fff; padding:6px 10px; border-radius:6px; font-size:13px; opacity:0; white-space:nowrap; transition:opacity .3s; pointer-events:none; }
.btn-lia-whatsapp-float:hover::after { opacity:1; }
CSS

# layout.tsx
cat > app/layout.tsx <<'TS'
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LÍA Consultoría — Chat",
  description: "MVP escalable de chat consultivo con branding LÍA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
TS

# page.tsx
cat > app/page.tsx <<'TS'
import ChatBox from "@/components/ChatBox";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <main className="container">
      <header className="header">
        <div className="brand">LÍA Consultoría</div>
        <div className="badge">MVP escalable</div>
      </header>

      <section className="hero">
        <h1>Chat consultivo — Tu Navegante LÍA</h1>
        <p>Resuelve dudas en 3 minutos, sin compromiso. Si lo necesitas, te conectamos con un Navegante por WhatsApp.</p>

        <div className="chat-wrap" style={{marginTop: 16}}>
          <div className="chat-header">Asistente LÍA</div>
          <ChatBox />
        </div>
      </section>

      <WhatsAppFloat />
    </main>
  );
}
TS

# API route con streaming + selector mini/pro
cat > app/api/chat/route.ts <<'TS'
import { NextRequest } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs"; // Netlify Functions (Node 18)

export async function POST(req: NextRequest) {
  const { message, model = "gpt-5-mini", stream = true } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "Falta OPENAI_API_KEY" }), { status: 500 });
  }
  if (!message || typeof message !== "string") {
    return new Response(JSON.stringify({ error: "Mensaje inválido" }), { status: 400 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const system = `Eres un asesor inmobiliario de LÍA Consultoría: claro, empático, estratégico y orientado a resultados.
Usa el tono LÍA (confianza, claridad, ROI, plusvalía). Haz preguntas abiertas y evita vender por vender.`;

  try {
    if (stream) {
      const s = await client.responses.stream({
        model,
        input: [
          { role: "system", content: system },
          { role: "user", content: message.slice(0, 2000) }
        ],
        max_output_tokens: 500
      });
      const rs = s.toReadableStream();
      return new Response(rs, {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" }
      });
    }

    const r = await client.responses.create({
      model,
      input: [
        { role: "system", content: system },
        { role: "user", content: message.slice(0, 2000) }
      ],
      max_output_tokens: 500
    });
    return new Response(JSON.stringify({ reply: r.output_text ?? "" }), { headers: { "Content-Type": "application/json" }});
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
  }
}
TS

# ChatBox.tsx (stream + switch)
cat > components/ChatBox.tsx <<'TSX'
'use client';

import { useEffect, useRef, useState } from 'react';
type Message = { role: 'user' | 'assistant'; content: string };

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hola, soy tu Navegante LÍA. ¿Sobre qué te ayudo hoy? (PSI, TIC, diagnóstico, inversión, plusvalía...)' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<'gpt-5-mini' | 'gpt-5'>('gpt-5-mini');
  const [useStream, setUseStream] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userText }]);

    if (useStream) {
      const idx = messages.length + 1;
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText, model, stream: true })
        });
        if (!res.body) throw new Error('No stream');
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages(prev => { const c = [...prev]; c[idx] = { role: 'assistant', content: acc }; return c; });
        }
      } catch {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Error de red. Intenta nuevamente.' }]);
      } finally { setLoading(false); }
    } else {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText, model, stream: false })
        });
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Gracias, ¿puedes darme más contexto?' }]);
      } catch {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Error de red. Intenta nuevamente.' }]);
      } finally { setLoading(false); }
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') sendMessage();
  }

  return (
    <div>
      <div style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 12px', borderBottom:'1px solid #E5E5E5' }}>
        <label style={{ fontSize:13 }}>
          Modelo:&nbsp;
          <select value={model} onChange={e => setModel(e.target.value as any)} style={{ padding:6, borderRadius:6, border:'1px solid #d1d5db' }}>
            <option value="gpt-5-mini">mini (rápido/barato)</option>
            <option value="gpt-5">pro (momentos de verdad)</option>
          </select>
        </label>
        <label style={{ fontSize:13, display:'flex', gap:6, alignItems:'center' }}>
          <input type="checkbox" checked={useStream} onChange={e => setUseStream(e.target.checked)} />
          Streaming
        </label>
      </div>

      <div className="chat-body" ref={listRef}>
        {messages.map((m, i) => (<div key={i} className={msg ${m.role === 'assistant' ? 'bot' : 'user'}}>{m.content}</div>))}
      </div>

      <div className="chat-form">
        <input className="input" placeholder={loading ? "Enviando..." : "Escribe aquí..."} value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={onKeyDown} disabled={loading}/>
        <button className="btn-lia" onClick={sendMessage} disabled={loading}>{loading ? '...' : 'Enviar'}</button>
      </div>
    </div>
  );
}
TSX

# WhatsApp Float
cat > components/WhatsAppFloat.tsx <<'TSX'
'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function WhatsAppFloat() {
  const pathname = usePathname();
  const [href, setHref] = useState('#');
  const [tooltip, setTooltip] = useState('Hablar con un Navegante LÍA');

  useEffect(() => {
    const number = process.env.NEXT_PUBLIC_LIA_WHATSAPP_NUMBER || '5213312345678';
    const base = https://wa.me/${number}?text=;
    let message = 'Hola, quiero más información sobre LÍA.';
    let tip = 'Hablar con un Navegante LÍA';
    if (pathname?.includes('nivel-psi')) { message = 'Hola, estoy interesado en el Nivel PSI de LÍA.'; tip = 'Hablar sobre Nivel PSI'; }
    else if (pathname?.includes('tic')) { message = 'Hola, me interesa hacer el Test Inteligente de Claridad (TIC).'; tip = 'Agendar Test de Claridad (TIC)'; }
    else if (pathname?.includes('diagnostico')) { message = 'Hola, quiero agendar un diagnóstico estratégico con LÍA.'; tip = 'Solicitar Diagnóstico Estratégico'; }
    else if (pathname?.includes('expansion')) { message = 'Hola, quiero conocer más sobre el acompañamiento en expansión.'; tip = 'Explorar Expansión con LÍA'; }
    setHref(base + encodeURIComponent(message));
    setTooltip(tip);
  }, [pathname]);

  return (
    <a id="lia-whatsapp-btn" className="btn-lia-whatsapp-float" href={href} data-tooltip={tooltip} target="_blank" aria-label="WhatsApp LÍA">
      <span style={{fontSize:0}}>WhatsApp</span>
      <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.46 0 .1 5.35.1 11.95c0 2.09.55 4.12 1.6 5.92L0 24l6.29-1.64A11.86 11.86 0 0 0 12.06 24c6.6 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.49-8.57Z"/></svg>
    </a>
  );
}
TSX

# package.json
cat > package.json <<'JSON'
{
  "name": "lia-next-chat-netlify",
  "version": "0.1.0",
  "private": true,
  "scripts": { "dev": "next dev", "build": "next build", "start": "next start", "lint": "next lint" },
  "dependencies": { "next": "14.2.5", "openai": "^4.58.1", "react": "18.3.1", "react-dom": "18.3.1" },
  "devDependencies": { "@types/node": "^20.11.30", "@types/react": "^18.2.66", "@types/react-dom": "^18.2.22", "eslint": "^8.57.0", "eslint-config-next": "14.2.5", "typescript": "^5.4.5" }
}
JSON

# next.config.js
cat > next.config.js <<'JS'
/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true };
module.exports = nextConfig;
JS

# tsconfig.json
cat > tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "es2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["next-env.d.ts", "/.ts", "/.tsx"],
  "exclude": ["node_modules"]
}
JSON

# next-env.d.ts
cat > next-env.d.ts <<'DTS'
/// <reference types="next" />
/// <reference types="next/image-types/global" />
DTS

# .env.example
cat > .env.example <<'ENV'
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_LIA_WHATSAPP_NUMBER=5213312345678
ENV

# netlify.toml + .nvmrc
cat > netlify.toml <<'TOML'
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[functions]
  node_bundler = "esbuild"
  external_node_modules = ["openai"]

[build.environment]
  NODE_VERSION = "18"
TOML

echo "18" > .nvmrc

# README
cat > README.md <<'MD'
# LÍA Chat (Next.js + Netlify)
- Chat con streaming y switch mini/pro.
- Botón WhatsApp flotante con mensajes dinámicos.
## Dev
npm i
cp .env.example .env.local
# coloca tu OPENAI_API_KEY
npm run dev
## Netlify
Build: npm run build
Publish: .next
Node: 18
Env: OPENAI_API_KEY, NEXT_PUBLIC_LIA_WHATSAPP_NUMBER
MD

echo "OK"
EOF

chmod +x bootstrap_lia.sh
./bootstrap_lia.sh# lia-next-cha-netlify 
 curl -s https://raw.githubusercontent.com/openai-samples/lia-bootstrap/main/bootstrap_lia.sh | bash