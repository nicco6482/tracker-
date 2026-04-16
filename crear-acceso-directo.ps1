
# Script para crear acceso directo bonito
# Ejecuta este script UNA vez con: powershell -ExecutionPolicy Bypass -File crear-acceso-directo.ps1

$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.IO.Path]::Combine($env:USERPROFILE, "Desktop")
$ShortcutPath = [System.IO.Path]::Combine($PSScriptRoot, "Tracker Gastos.lnk")
$TargetPath = [System.IO.Path]::Combine($PSScriptRoot, "Tracker Gastos.exe")

$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetPath
$Shortcut.Description = "Tracker de Gastos - App personal de finanzas"
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.Save()

Write-Host "✅ Acceso directo creado: $ShortcutPath" -ForegroundColor Green
Write-Host "📍 Ubícalo en tu escritorio para rápido acceso" -ForegroundColor Cyan
