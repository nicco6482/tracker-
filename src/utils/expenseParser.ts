import {
  Category,
  PaymentMethod,
  CurrencyCode,
  CATEGORIES,
  PAYMENT_METHODS,
} from '../types'

export interface ParsedExpense {
  amount: number
  description: string
  category: Category
  paymentMethod: PaymentMethod
  currency: CurrencyCode
  date: string
  confidence: number // 0-1, qué tan seguro es el parsing
}

/**
 * Mejora el parsing de gastos desde mensajes naturales del usuario
 * Soporta patrones como:
 * - "Gasté 15€ en comida hoy"
 * - "15 euros de gasolina con tarjeta"
 * - "Coffee: $5"
 * - "Transferencia de 50€ a Juan"
 */
export function parseExpenseFromUserMessage(
  message: string
): ParsedExpense | null {
  const lowerMessage = message.toLowerCase()

  // Patrones para detectar cantidad
  const amountPatterns = [
    /(?:gast[éé]|costo|precio|val[ií]a?)\s+(?:de\s+)?(\d+(?:[.,]\d{1,2})?)\s*(?:€|euros?|usd|\$|£|libras?|pesos?)/i,
    /(\d+(?:[.,]\d{1,2})?)\s*(?:€|euros?|usd|\$|£|libras?|pesos?)\s+(?:en|de|para|por)\s+([a-záéíóú\s]+)/i,
    /gasto\s+de\s+(\d+(?:[.,]\d{1,2})?)\s+(?:en\s+)?([a-záéíóú\s]*)/i,
    /compré?\s+([a-záéíóú\s]+)\s+por\s+(\d+(?:[.,]\d{1,2})?)/i,
    /(\d+(?:[.,]\d{1,2})?)\s*(?:€|euros?|usd|\$)/i,
  ]

  let amount = 0
  let categoryHint = ''

  for (const pattern of amountPatterns) {
    const match = message.match(pattern)
    if (match) {
      // El primer grupo siempre es la cantidad
      amount = parseFloat(match[1].replace(',', '.'))
      // Si hay un segundo grupo, puede ser categoria
      if (match[2]) {
        categoryHint = match[2]
      }
      break
    }
  }

  if (amount <= 0) {
    return null
  }

  // Detectar categoría
  let category: Category = 'Otros'
  let categoryConfidence = 0.3

  for (const cat of CATEGORIES) {
    if (
      lowerMessage.includes(cat.toLowerCase()) ||
      categoryHint.includes(cat.toLowerCase())
    ) {
      category = cat
      categoryConfidence = 0.9
      break
    }
  }

  // Patrones específicos de categoría para mejorar precisión
  if (lowerMessage.match(/comida|almuerzo|desayuno|cena|restaurante|café|pizza/)) {
    category = 'Comida'
    categoryConfidence = 0.95
  } else if (lowerMessage.match(/gasolina|combustible|nafta|diesel|benzina/)) {
    category = 'Gasolina'
    categoryConfidence = 0.95
  } else if (lowerMessage.match(/tabacc?o|cigarro|puros?/)) {
    category = 'Tabaco'
    categoryConfidence = 0.95
  } else if (
    lowerMessage.match(/fiesta|party|bebida|alcohol|cerveza|copas?|disc/)
  ) {
    category = 'Fiesta'
    categoryConfidence = 0.95
  } else if (lowerMessage.match(/compra|ropa|zapato|tienda|shop|mall/)) {
    category = 'Compras'
    categoryConfidence = 0.95
  }

  // Detectar método de pago
  let paymentMethod: PaymentMethod = 'Efectivo'
  let paymentConfidence = 0.3

  if (lowerMessage.match(/tarjeta\s+de\s+débito|débito|debit/)) {
    paymentMethod = 'Tarjeta débito'
    paymentConfidence = 0.95
  } else if (lowerMessage.match(/tarjeta\s+de\s+crédito|crédito|credit/)) {
    paymentMethod = 'Tarjeta crédito'
    paymentConfidence = 0.95
  } else if (lowerMessage.match(/transferencia|transfer/)) {
    paymentMethod = 'Transferencia'
    paymentConfidence = 0.95
  } else if (lowerMessage.match(/bizum|biz/)) {
    paymentMethod = 'Bizum'
    paymentConfidence = 0.95
  } else if (lowerMessage.match(/paypal|pay ?pal/)) {
    paymentMethod = 'PayPal'
    paymentConfidence = 0.95
  } else if (lowerMessage.match(/efectivo|cash|dinero|metálico/)) {
    paymentMethod = 'Efectivo'
    paymentConfidence = 0.95
  } else if (lowerMessage.match(/tarjeta(?!\s+de)/)) {
    paymentMethod = 'Tarjeta débito'
    paymentConfidence = 0.6
  }

  // Detectar moneda
  let currency: CurrencyCode = 'EUR'
  if (
    message.includes('$') ||
    lowerMessage.includes('usd') ||
    lowerMessage.includes('dólares?')
  ) {
    currency = 'USD'
  } else if (
    message.includes('£') ||
    lowerMessage.includes('libra') ||
    lowerMessage.includes('gbp')
  ) {
    currency = 'GBP'
  } else if (lowerMessage.includes('peso')) {
    currency = 'MXN' // Default to Mexican Peso
  }

  // Generar descripción
  const descriptionMatch = message.match(/(?:para|de|en|por)\s+([a-záéíóú\s]+?)(?:\s+(?:en|de|con|por|hoy|ayer|mañana)|$)/i)
  let description = descriptionMatch
    ? descriptionMatch[1].trim()
    : `${category}`

  // Truncar y limpiar descripción
  description = description
    .substring(0, 50)
    .replace(/\s+/g, ' ')
    .trim()

  if (!description) {
    description = `${category}`
  }

  // Detectar fecha (mañana, hoy, ayer, o fecha específica)
  let date = new Date().toISOString().split('T')[0]
  if (lowerMessage.includes('ayer')) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    date = yesterday.toISOString().split('T')[0]
  } else if (lowerMessage.includes('mañana')) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    date = tomorrow.toISOString().split('T')[0]
  }

  // Calcular confianza general
  const confidence = Math.min(
    0.95,
    (categoryConfidence + paymentConfidence + 1) / 3
  )

  return {
    amount,
    description,
    category,
    paymentMethod,
    currency,
    date,
    confidence,
  }
}
