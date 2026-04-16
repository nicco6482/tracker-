#!/usr/bin/env node
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import os from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = 3000

// Verificar si dist existe, si no, compilar
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  console.log('Compilando proyecto...')
  try {
    execSync('npm run build', { cwd: __dirname, stdio: 'inherit' })
  } catch (e) {
    console.error('Error compilando:', e.message)
    process.exit(1)
  }
}

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.webmanifest': 'application/manifest+json',
}

function getLocalIP() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return 'localhost'
}

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url)

  if (!filePath.startsWith(path.join(__dirname, 'dist'))) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(__dirname, 'dist', 'index.html'), (err, content) => {
          if (err) {
            res.writeHead(500)
            res.end('Server Error')
            return
          }
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end(content)
        })
      } else {
        res.writeHead(500)
        res.end('Server Error')
      }
    } else {
      const ext = path.extname(filePath)
      const contentType = mimeTypes[ext] || 'application/octet-stream'
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(content)
    }
  })
})

const localIP = getLocalIP()

server.listen(PORT, '0.0.0.0', () => {
  console.clear()
  console.log(`
╔════════════════════════════════════════════════════╗
║     🎉 TRACKER DE GASTOS - En Ejecución          ║
║              ✅ Compilado y Listo                 ║
╚════════════════════════════════════════════════════╝

🌐 URLs:
   • Localmente:  http://localhost:${PORT}
   • En móvil:    http://${localIP}:${PORT}

📱 Instalación en Móvil:
   1. Abre el navegador con una de las URLs
   2. Android: Menú ⋮ → "Instalar aplicación"
   3. iPhone: Compartir → "Agregar a pantalla de inicio"

💡 Funciona COMPLETAMENTE OFFLINE después de instalar

Cierra esta ventana para detener el servidor...
  `)
})
