#!/usr/bin/env bash
set -e

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
CSS

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
    "strict": true,
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

# package.json
cat > package.json <<'JSON'
{
  "name": "lia-next-chat-netlify",
  "version": "0.1.0",
  "scripts": { "dev": "next dev", "build": "next build", "start": "next start" },
  "dependencies": { "next": "14.2.5", "openai": "^4.58.1", "react": "18.3.1", "react-dom": "18.3.1" }
}
JSON

# netlify.toml
cat > netlify.toml <<'TOML'
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
TOML

echo "✅ Proyecto LÍA generado"
