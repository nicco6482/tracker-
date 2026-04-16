import { useState, useEffect } from 'react'
import { CurrencyCode } from '../types'

export interface Wallet {
  balance: number // dinero disponible
  currency: CurrencyCode
}

const STORAGE_KEY = 'tracker-wallet-v1'

function loadWallet(): Wallet {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { balance: 0, currency: 'EUR' }
  } catch {
    return { balance: 0, currency: 'EUR' }
  }
}

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet>(loadWallet)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet))
  }, [wallet])

  const addBalance = (amount: number) => {
    setWallet(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance + amount),
    }))
  }

  const subtractBalance = (amount: number) => {
    setWallet(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount),
    }))
  }

  const setBalance = (amount: number) => {
    setWallet(prev => ({
      ...prev,
      balance: Math.max(0, amount),
    }))
  }

  const setCurrency = (currency: CurrencyCode) => {
    setWallet(prev => ({
      ...prev,
      currency,
    }))
  }

  return {
    wallet,
    addBalance,
    subtractBalance,
    setBalance,
    setCurrency,
  }
}
