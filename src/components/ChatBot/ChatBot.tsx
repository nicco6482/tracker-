import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Loader } from 'lucide-react'
import { useChatBot, ChatMessage } from '../../hooks/useChatBot'
import { Expense } from '../../types'
import { parseExpenseFromUserMessage } from '../../utils/expenseParser'

interface ChatBotProps {
  apiKey: string
  onExpenseCreated: (expense: Omit<Expense, 'id'>) => void
}

export default function ChatBot({ apiKey, onExpenseCreated }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [pendingExpense, setPendingExpense] = useState<any>(null)
  const { messages, addMessage, parseExpenseFromMessage } = useChatBot()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      // Intentar parsear gasto del mensaje
      const expenseData = parseExpenseFromUserMessage(userMessage)

      // Preparar contexto para Groq
      const systemPrompt = `Eres un asistente de finanzas personal amable y útil para un tracker de gastos.
Tus responsabilidades:
1. Ayudar al usuario a registrar gastos de forma natural
2. Responder preguntas sobre finanzas personales
3. Ser conciso pero útil

Categorías disponibles: Comida, Gasolina, Tabaco, Fiesta, Compras, Otros
Métodos de pago: Efectivo, Tarjeta débito, Tarjeta crédito, Transferencia, Bizum, PayPal, Otro

Si detectas que el usuario quiere registrar un gasto, confirma los detalles de forma breve y amable.
Responde siempre en el mismo idioma que el usuario. Mantén respuestas cortas y prácticas.`

      // Llamar a Groq API (compatible con OpenAI)
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
              .filter(m => m.role === 'user' || m.role === 'assistant')
              .map(m => ({
                role: m.role,
                content: m.content,
              })),
            { role: 'user', content: userMessage },
          ],
          max_tokens: 512,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Error en la API')
      }

      const data = await response.json()
      const assistantMessage =
        data.choices[0]?.message?.content || 'No pude procesar tu mensaje'

      addMessage(userMessage, assistantMessage)

      // Si se detectó un gasto, crearlo
      if (expenseData && expenseData.confidence > 0.6) {
        setPendingExpense(expenseData)
        onExpenseCreated(expenseData)
        // Feedback visual
        setTimeout(() => {
          addMessage(
            '',
            `✓ Gasto registrado: ${expenseData.currency} ${expenseData.amount.toFixed(2)} en ${expenseData.category}`
          )
        }, 500)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido'
      addMessage(
        userMessage,
        `Disculpa, ocurrió un error: ${errorMessage}. Verifica tu clave API.`
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 z-40"
        aria-label="Abrir chat"
      >
        <MessageCircle size={24} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl flex flex-col max-h-96 z-50 animate-in">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">Asistente de Gastos</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-blue-700 p-1 rounded transition-colors"
          aria-label="Cerrar chat"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-300 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
              <Loader size={14} className="animate-spin" />
              <span className="text-xs">..procesando</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3 bg-white rounded-b-lg flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ej: Gasté 15€ en comida..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded px-3 py-2 transition-colors flex items-center gap-1"
          aria-label="Enviar mensaje"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
