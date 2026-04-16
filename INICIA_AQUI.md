# 🚀 Tracker de Gastos - ¡Listo para Usar!

## ⚡ Inicio Instantáneo

### Opción 1: Lo Más Fácil
En la carpeta `tracker gastos`, encontrarás:

**`Tracker Gastos.exe`** ← **Doble clic aquí y solo eso**

La app se compilará automáticamente (primera vez) y se abrirá en tu navegador en `http://localhost:3000`

---

### Opción 2: Acceso Directo en Escritorio
```
Clic derecho en "Tracker Gastos.exe" 
→ Enviar a → Escritorio (crear acceso directo)
```

Así tendrás un icono en tu escritorio para ejecutar la app con un clic.

---

## 📱 Usar en tu Móvil

1. Ejecuta `Tracker Gastos.exe`
2. En tu móvil (misma WiFi):
   - Abre el navegador
   - Ve a: `http://IP_DE_TU_PC:3000`
   - (Para encontrar tu IP: Abre Terminal/PowerShell y escribe `ipconfig`)

3. **Instálalo como app nativa:**
   - **Android**: Menú ⋮ → "Instalar aplicación"
   - **iPhone**: Compartir → "Agregar a pantalla de inicio"

---

## ✨ Características

✅ **Totalmente Offline** - Funciona sin internet (excepto el chatbot)
✅ **Instalable en Móvil** - Como app nativa, sin AppStore
✅ **Auto-Compilado** - Primera vez compila automáticamente
✅ **Sin Dependencias** - Todo en un solo archivo .exe
✅ **Datos Privados** - Todo en tu computadora/móvil, nunca enviado a servidores

---

## 🎯 Primer Inicio

1. Doble clic: `Tracker Gastos.exe`
2. Espera a que se compile (solo la primera vez, ~30 segundos)
3. Se abre automáticamente en: http://localhost:3000
4. Verás un modal pidiendo tu API Key de Groq
   - (Si no tienes, ve a https://console.groq.com/keys - ¡es gratis!)
5. ¡Ya está! Comienza a usar

---

## 🔄 Próximos Inicios

Solo doble clic en `Tracker Gastos.exe` - ya estará compilado y arrancará en segundos.

---

## 🐛 Si Algo Falla

### El puerto 3000 está en uso
```bash
# Abre PowerShell y escribe:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Quieres reinstalación limpia
```bash
# Elimina la carpeta "dist" y vuelve a ejecutar el .exe
rm -r dist
Tracker\ Gastos.exe
```

---

## 📚 Documentación

- **MOBILE_INSTALL.md** - Guía detallada para instalar en móvil
- **COMO_EJECUTAR.md** - Todas las formas de ejecutar la app
- **CHATBOT_README.md** - Cómo usar el chatbot

---

## 🎉 ¡Eso es todo!

No necesitas:
- Terminal
- Comandos
- npm
- Node.js

Solo **un clic** y tu tracker está corriendo.

---

**¿Problemas? Revisa los logs en la ventana que se abre al ejecutar el .exe**

¡Disfruta tu app! 💰
