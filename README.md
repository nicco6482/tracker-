# 💰 Tracker de Gastos - PWA

Tu app personal de finanzas con IA, totalmente offline y privada.

## ✨ Características

- 📊 Dashboard con análisis de gastos
- 💬 Chatbot con IA (Groq) para registrar gastos naturalmente
- 💼 Cartera/billetera integrada
- 📱 PWA - Instalable en cualquier móvil
- 🔒 100% privado - Datos locales en tu dispositivo
- ⚡ Funciona sin internet (excepto chatbot)

## 🚀 Deploy en Vercel (Gratis)

### Opción 1: Lo Más Fácil (5 minutos)

1. **Copia este repo a GitHub**:
   - Ve a https://github.com/new
   - Crea un nuevo repositorio (cualquier nombre)
   - Sube los archivos de esta carpeta

2. **Conecta a Vercel**:
   - Ve a https://vercel.com
   - Click en "New Project"
   - Selecciona tu repositorio de GitHub
   - Vercel auto-detecta Vite
   - ¡Deploy automático!

3. **Tu URL en vivo**: `https://tu-nombre.vercel.app`

### Opción 2: Con Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🔑 Configurar API Key de Groq

Una vez en Vercel:
1. Ve a Settings → Environment Variables
2. Agrega `GROQ_API_KEY` con tu valor de https://console.groq.com/keys
3. Re-deploy
4. ¡Listo!

O en la app web, el usuario puede ingresar su propia API Key (se guarda localmente)

---

## 📱 Instalación en Móvil

1. Abre tu URL de Vercel en el móvil
2. **Android**: Menú ⋮ → "Instalar aplicación"
3. **iPhone**: Compartir → "Agregar a pantalla de inicio"
4. ¡Funciona 100% offline!

---

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Servir (requiere curl o similar)
npm run prod
```

---

## 📚 Archivos Importantes

| Archivo | Descripción |
|---------|-----------|
| `Tracker Gastos.exe` | Ejecutable para Windows (sin terminal) |
| `vercel.json` | Configuración para Vercel |
| `src/` | Código React |
| `dist/` | Compilado (generado en build) |

---

## 🎯 Lo Próximo

- [ ] Subir a GitHub
- [ ] Conectar a Vercel
- [ ] Configurar API Key (opcional)
- [ ] ¡Compartir con amigos!

---

## 📜 Licencia

Código abierto - Úsalo como quieras

---

**Preguntas?** Revisa los archivos MD en la carpeta raíz.

¡Disfruta tu tracker! 🚀💰
