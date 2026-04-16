@echo off
chcp 65001 >nul
cls

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║   🚀 Compilando Tracker de Gastos...              ║
echo ╚════════════════════════════════════════════════════╝
echo.

call npm run build

if errorlevel 1 (
    echo.
    echo ❌ Error en la compilación
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║   ✅ Compilación exitosa!                         ║
echo ║   💾 Inciando servidor...                         ║
echo ╚════════════════════════════════════════════════════╝
echo.

call node server.js

pause
