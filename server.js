import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = 3000

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

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url)

  // Security: prevent directory traversal
  if (!filePath.startsWith(path.join(__dirname, 'dist'))) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // SPA: redirect to index.html for routes
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

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║   🎉 TRACKER DE GASTOS - Servidor en ejecución   ║
╚════════════════════════════════════════════════════╝

🌐 Accede a: http://localhost:${PORT}

📱 En tu móvil:
  1. Conecta a la misma WiFi que esta computadora
  2. Abre en el navegador: http://<TU_IP>:${PORT}
  3. (Puedes ver tu IP ejecutando: ipconfig getifaddr en0)

🔐 Características:
  ✓ Offline completo
  ✓ Service Worker activado
  ✓ Instalable como app nativa

Presiona Ctrl+C para detener el servidor
  `)
})
