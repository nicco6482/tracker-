#!/usr/bin/env node

/**
 * Script para iniciar la app en modo desarrollo
 * Usa: node dev-server.js
 * Alternativamente: npm run dev-server
 */

import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

console.log(`
╔════════════════════════════════════════════════════╗
║   🚀 TRACKER DE GASTOS - Modo Desarrollo         ║
╚════════════════════════════════════════════════════╝

⚙️  Compilando proyecto...
`)

// Ejecutar vite en modo dev
const vite = spawn('npx', ['vite'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
})

vite.on('error', (err) => {
  console.error('Error:', err.message)
  process.exit(1)
})

vite.on('exit', (code) => {
  process.exit(code)
})
