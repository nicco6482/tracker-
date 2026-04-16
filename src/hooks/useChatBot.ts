import { useState, useCallback } from 'react'
import { Expense, Category, PaymentMethod, CurrencyCode, CATEGORIES, PAYMENT_METHODS } from '../types'
import { parseExpenseFromUserMessage } from '../utils/expenseParser'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ExpenseFromChat {
  amount: number
  description: string
  category: Category
  paymentMethod: PaymentMethod
  currency: CurrencyCode
  date: string
}

export function useChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de gastos. Puedo ayudarte a:\n• Registrar gastos (ej: "Gasté 15€ en comida hoy")\n• Analizar tus gastos\n• Responder preguntas generales',
      timestamp: new Date(),
    },
  ])

  const parseExpenseFromMessage = useCallback(
    (message: string): ExpenseFromChat | null => {
      const parsed = parseExpenseFromUserMessage(message)
      return parsed ? {
        amount: parsed.amount,
        description: parsed.description,
        category: parsed.category,
        paymentMethod: parsed.paymentMethod,
        currency: parsed.currency,
        date: parsed.date,
      } : null
    },
    []
  )

  const addMessage = useCallback(
    (userMessage: string, assistantResponse: string) => {
      const newMessages: ChatMessage[] = [
        ...messages,
        {
          id: `user-${Date.now()}`,
          role: 'user',
          content: userMessage,
          timestamp: new Date(),
        },
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: assistantResponse,
          timestamp: new Date(),
        },
      ]
      setMessages(newMessages)
    },
    [messages]
  )

  return {
    messages,
    addMessage,
    parseExpenseFromMessage,
  }
}
