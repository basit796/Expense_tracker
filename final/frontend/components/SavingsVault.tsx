'use client'

import { useState } from 'react'
import { addToSavings, withdrawFromSavings } from '@/lib/api'
import { formatCurrency } from '@/lib/currency'

interface SavingsVaultProps {
  username: string
  savingsVault: number
  currency: string
  balance: number
  onUpdate: () => void
}

export default function SavingsVault({ username, savingsVault, currency, balance, onUpdate }: SavingsVaultProps) {
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState<'add' | 'withdraw'>('add')
  const [loading, setLoading] = useState(false)
  const [showVault, setShowVault] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) return
    
    const amountValue = parseFloat(amount)
    
    // Check if user has enough balance to add to vault
    if (mode === 'add' && balance < amountValue) {
      alert('Insufficient balance! You cannot save more than your current balance.')
      return
    }
    
    setLoading(true)
    try {
      if (mode === 'add') {
        await addToSavings(username, amountValue)
      } else {
        await withdrawFromSavings(username, amountValue)
      }
      setAmount('')
      onUpdate()
      alert(`Successfully ${mode === 'add' ? 'added to' : 'withdrawn from'} savings vault!`)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">💰 Savings Vault</h3>
              <p className="text-sm text-gray-600">Your piggy bank: <span className="font-semibold text-purple-600">{formatCurrency(savingsVault, currency)}</span></p>
            </div>
          </div>
          {!showVault && (
            <button
              onClick={() => setShowVault(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Open Vault
            </button>
          )}
        </div>
      </div>

      {/* Animated Vault Content */}
      <div 
        className={`transition-all duration-500 ease-in-out ${
          showVault ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-xl text-white shadow-inner">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm opacity-90 mb-1">Current Balance in Vault</p>
                <p className="text-4xl font-bold">{formatCurrency(savingsVault, currency)}</p>
              </div>
              <button
                onClick={() => setShowVault(false)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                title="Close Vault"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('add')}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    mode === 'add'
                      ? 'bg-white text-purple-600 shadow-lg scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  💵 Add Money
                </button>
                <button
                  type="button"
                  onClick={() => setMode('withdraw')}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    mode === 'withdraw'
                      ? 'bg-white text-purple-600 shadow-lg scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  💸 Withdraw
                </button>
              </div>

              <div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Enter amount in ${currency}`}
                  className="w-full p-4 rounded-lg text-gray-800 font-semibold text-lg focus:ring-4 focus:ring-purple-300 focus:outline-none"
                  required
                />
              </div>

              {mode === 'add' && balance < parseFloat(amount || '0') && (
                <div className="bg-red-500/90 border-2 border-red-300 rounded-lg p-3 animate-pulse">
                  <p className="text-sm font-semibold">⚠️ Insufficient balance! Current balance: {formatCurrency(balance, currency)}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (mode === 'add' && balance < parseFloat(amount || '0'))}
                className="w-full bg-white text-purple-600 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  mode === 'add' ? '💰 Save to Vault' : '💸 Withdraw from Vault'
                )}
              </button>
            </form>

            <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <p className="text-xs opacity-90 leading-relaxed">
                💡 <strong>Tip:</strong> Money added to the vault is deducted from your balance. Use it to save for specific goals, emergencies, or future expenses. Your savings are safe here!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
