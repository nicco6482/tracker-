# 🚀 Cómo Ejecutar Tracker de Gastos

## Windows (Más Fácil)

### Opción 1: Doble clic (Con Interfaz)
1. Ve a la carpeta del proyecto
2. **Doble clic en `START.bat`**
3. Se compilará y abrirá automáticamente en `http://localhost:3000`

### Opción 2: Línea de Comandos
```bash
npm run start
```

---

## macOS / Linux

### Terminal
```bash
npm run start
```

---

## Desarrollo (Con Hot Reload)

Si quieres cambios automáticos mientras desarrollas:

```bash
npm run dev
```

Luego abre en el navegador: `http://localhost:5173`

---

## Una vez compilado (Producción)

Si ya compilaste antes y solo quieres levantar el servidor:

```bash
npm run prod
```

O simplemente ejecuta `START.bat` en Windows.

---

## 📱 Acceso desde Móvil

1. **Compila la app**:
   ```bash
   npm run build
   ```

2. **Inicia el servidor**:
   ```bash
   npm run prod
   ```

3. **En tu móvil**:
   - Conéctate a la misma red WiFi
   - Abre: `http://IP_DE_TU_PC:3000`
   - (Encuentra tu IP: En Windows cmd → `ipconfig`, busca "IPv4")

4. **Instala la app**:
   - Android: Menú ⋮ → "Instalar aplicación"
   - iPhone: Compartir → "Agregar a pantalla de inicio"

---

## 🎯 Resumen de Comandos

| Comando | Descripción |
|---------|------------|
| `npm run start` | Compila + Inicia servidor (Producción) |
| `npm run build` | Solo compila |
| `npm run prod` | Solo inicia servidor (requiere compilación previa) |
| `npm run dev` | Modo desarrollo con hot reload |
| `npm run dev-server` | Alternativa desarrollo |

---

## ✅ Checklist Inicial

- [ ] Tienes Node.js instalado (`node --version`)
- [ ] Ejecutaste `npm install` al principio
- [ ] Tienes tu API Key de Groq (https://console.groq.com/keys)
- [ ] Ejecutaste `npm run start` o `START.bat`
- [ ] La app está en `http://localhost:3000`

---

## 🐛 Troubleshooting

### "Puerto 3000 ya está en uso"
```bash
# En Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# En Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### "npm command not found"
- Descarga Node.js desde https://nodejs.org/
- Reinstala/actualiza

### Código de error en la compilación
```bash
npm run build
```
Revisa los errores mostrados y reporta.

---

## 🎉 ¡Listo!

Una vez levantado el servidor, la app estará disponible en:
- **PC**: http://localhost:3000
- **Móvil**: http://IP_DE_TU_PC:3000

¡Disfruta tu tracker de gastos! 💰
