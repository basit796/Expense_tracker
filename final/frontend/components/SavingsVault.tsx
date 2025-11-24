'use client'

import { useState } from 'react'
import { addToSavings, withdrawFromSavings } from '@/lib/api'
import { formatCurrency } from '@/lib/currency'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PiggyBank, Lock, Unlock, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

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
      // Optional: Add toast here
    } catch (error: any) {
      console.error(error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-2xl shadow-indigo-500/20">
      <div className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <PiggyBank className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Savings Vault</h3>
              <p className="text-indigo-100">
                Total Saved: <span className="font-bold text-white text-lg">{formatCurrency(savingsVault, currency)}</span>
              </p>
            </div>
          </div>
          {!showVault && (
            <Button
              onClick={() => setShowVault(true)}
              variant="secondary"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Open Vault <Unlock className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Animated Vault Content */}
      <div
        className={cn(
          "transition-all duration-500 ease-in-out overflow-hidden bg-white/5 backdrop-blur-sm",
          showVault ? 'max-h-[600px] opacity-100 border-t border-white/10' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-indigo-100">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Secure Vault Access</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowVault(false)}
              className="text-white hover:bg-white/10 hover:text-white"
            >
              Close
            </Button>
          </div>

          <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
            <div className="flex gap-2 mb-6 bg-black/20 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setMode('add')}
                className={cn(
                  "flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2",
                  mode === 'add' ? 'bg-white text-indigo-600 shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                <ArrowRight className="w-4 h-4" /> Deposit
              </button>
              <button
                type="button"
                onClick={() => setMode('withdraw')}
                className={cn(
                  "flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2",
                  mode === 'withdraw' ? 'bg-white text-indigo-600 shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                <ArrowLeft className="w-4 h-4" /> Withdraw
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-indigo-100 ml-1 mb-2 block">
                  Amount ({currency})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-black/20 border-2 border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-black/30 transition-all font-mono text-lg"
                    required
                  />
                </div>
              </div>

              {mode === 'add' && balance < parseFloat(amount || '0') && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 flex items-center gap-3 text-red-100 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>Insufficient balance. Available: {formatCurrency(balance, currency)}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || (mode === 'add' && balance < parseFloat(amount || '0'))}
                className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none"
                size="lg"
                isLoading={loading}
              >
                {mode === 'add' ? 'Confirm Deposit' : 'Confirm Withdrawal'}
              </Button>
            </form>
          </div>

          <p className="text-xs text-indigo-200 text-center opacity-80">
            Funds in the vault are separated from your main balance.
          </p>
        </div>
      </div>
    </Card>
  )
}
