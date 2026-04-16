# 🤖 Chatbot de Gastos

## Configuración

1. **Obtén tu API Key de Anthropic:**
   - Ve a [console.anthropic.com/keys](https://console.anthropic.com/keys)
   - Genera una nueva clave API
   - Copia la clave (empieza con `sk-ant-`)

2. **Agrega la clave a la app:**
   - Al abrir la app por primera vez, verás un modal pidiendo tu API Key
   - Pega la clave y haz click en "Guardar"
   - ¡Listo! El chatbot estará disponible en la esquina inferior derecha

## Cómo Usar

### Registrar Gastos
Simplemente escribe frases naturales para registrar gastos:

```
"Gasté 15€ en comida"
"20 euros de gasolina"
"5 dólares en un café"
"50€ en compras con tarjeta"
"Transferencia de 100€"
```

El bot automáticamente:
- 🔍 Detecta la cantidad
- 📁 Clasifica la categoría
- 💳 Identifica el método de pago
- 💱 Reconoce la moneda
- 📅 Usa la fecha actual (o pasada si dices "ayer")

### Consultas Generales
También puedes hacer preguntas:
- "¿Cuál es mi gasto promedio?"
- "¿En qué categoría gasto más?"
- "Consejos para ahorrar"
- Y mucho más...

## Categorías Soportadas
- Comida
- Gasolina
- Tabaco
- Fiesta
- Compras
- Otros

## Métodos de Pago
- Efectivo
- Tarjeta débito
- Tarjeta crédito
- Transferencia
- Bizum
- PayPal
- Otro

## Monedas
- EUR (€) - Euro
- USD ($) - Dólar
- GBP (£) - Libra
- MXN ($) - Peso Mexicano
- COP ($) - Peso Colombiano
- ARS ($) - Peso Argentino

## Notas

- La clave API se guarda localmente en tu navegador (localStorage)
- Los gastos registrados se guardan también localmente
- No se envía información sensible a servidores externos (solo mensajes al API de Anthropic)
- El parsing es inteligente y puede captar variaciones naturales de lenguaje
