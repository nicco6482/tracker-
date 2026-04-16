import { useState, useEffect } from 'react'
import { Expense } from '../types'

// Cambiar este key borra todos los datos guardados y empieza desde cero
const STORAGE_KEY = 'tracker-gastos-v2'

function load(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (data: Omit<Expense, 'id'>) => {
    setExpenses(prev =>
      [{ ...data, id: crypto.randomUUID() }, ...prev].sort((a, b) =>
        b.date.localeCompare(a.date)
      )
    )
  }

  const editExpense = (id: string, data: Omit<Expense, 'id'>) => {
    setExpenses(prev =>
      prev
        .map(e => (e.id === id ? { ...data, id } : e))
        .sort((a, b) => b.date.localeCompare(a.date))
    )
  }

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  return { expenses, addExpense, editExpense, deleteExpense }
}
