# 🚀 Guía: Subir a Vercel en 5 Minutos

Vercel hostea tu app **gratis** y funciona sin nada en tu computadora.

## Paso 1: Crear Repositorio GitHub

1. Ve a https://github.com/new
2. Nombre: `tracker-gastos` (o lo que prefieras)
3. Descripción: "Mi tracker personal de gastos"
4. **Público** (así Vercel puede acceder)
5. Click **"Create repository"**

## Paso 2: Subir Archivos a GitHub

Tienes dos opciones:

### Opción A: Con GitHub Desktop (Visual)
1. Descarga https://desktop.github.com
2. Clone tu repo
3. Copia todos los archivos de `tracker gastos` ahí
4. Commit + Push

### Opción B: Con Git Terminal (Rápido)
En PowerShell, en la carpeta del proyecto:
```bash
git init
git add .
git commit -m "Initial commit: Tracker de gastos"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/tracker-gastos.git
git push -u origin main
```

_(Reemplaza `TU_USUARIO` con tu usuario de GitHub)_

## Paso 3: Conectar a Vercel

1. Ve a https://vercel.com/sign-up
2. Click **"Continue with GitHub"**
3. Autoriza a Vercel
4. Click **"New Project"**
5. Selecciona `tracker-gastos` (tu repo)
6. Vercel auto-detecta la configuración ✓
7. Click **"Deploy"**

**¡Listo!** Tu URL aparecerá como:
```
https://tracker-gastos-USERNAME.vercel.app
```

## Paso 4: Configurar API Key (Opcional)

Si quieres que todos usen el mismo API Key (no recomendado):

1. En Vercel Dashboard → tu proyecto
2. Settings → Environment Variables
3. Variable: `GROQ_API_KEY`
4. Value: Tu API Key de https://console.groq.com/keys
5. Re-deploy

**Mejor opción**: Cada usuario ingresa su propia API Key en la app (se guarda localmente).

## Paso 5: ¡Usa tu App!

Abre: `https://tu-nombre.vercel.app`

### En móvil:
- Abre la URL en el navegador
- Android: Menú ⋮ → "Instalar"
- iPhone: Compartir → "Agregar a pantalla de inicio"
- ✅ ¡Instala como app nativa!

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios locales y hagas push a GitHub:
```bash
git add .
git commit -m "Descripción del cambio"
git push
```

Vercel **automáticamente** re-deploya. ¡Sin hacer nada más!

---

## ✅ Checklist

- [ ] Creé repo en https://github.com
- [ ] Subí archivos a GitHub
- [ ] Conecté a Vercel con el repo
- [ ] Mi URL funciona: `https://????.vercel.app`
- [ ] Instalé en mi móvil como app
- [ ] ¡Funciona offline! 🎉

---

## 💡 Ventajas Vercel

✓ **Gratis** - Dominio incluido
✓ **Rápido** - CDN global
✓ **Automático** - Deploy con cada push a GitHub
✓ **Confiable** - Millones de apps hosting aquí
✓ **SSL/HTTPS** - Seguro de serie

---

## 🆘 Troubleshooting

### "Mi GitHub no autoriza a Vercel"
- Verifica que tu repo sea **público**
- Intenta conectarte a Vercel directamente desde GitHub

### "El deploy falla"
- Ve a Vercel Dashboard → Deployments → Ver logs
- Generalmente dice qué salió mal
- Revisa que `npm install` y `npm run build` funcionen localmente

### "No veo cambios en Vercel"
- Asegúrate de hacer `git push`
- Vercel tarda ~2-3 minutos en deployer
- Refresca (Ctrl+F5) el navegador sin caché

---

## 🎯 Próximo Paso (Opcional)

Comparte tu URL con amigos:
```
Accede a mi tracker: https://tracker-gastos-tuNombre.vercel.app
Cada quien tiene sus datos locales, ¡completamente privado!
```

---

**¡Felicidades!** Your app is now live 🚀

Sin terminal, sin servidor propio, ¡totalmente gratis!
