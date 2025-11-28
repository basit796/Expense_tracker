'use client'

import { useState, useEffect } from 'react'
import { setBudget, getBudgetStatus, deleteBudget } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AlertCircle, CheckCircle, TrendingUp, Plus, Trash2, DollarSign, ChevronDown, ChevronUp } from 'lucide-react'

interface Budget {
  category: string
  budget: number
  spent: number
  remaining: number
  percentage: number
  status: 'good' | 'warning' | 'exceeded'
  currency: string
}

interface BudgetManagerProps {
  username: string
  categories: string[]
  currency: string
}

export default function BudgetManager({ username, categories, currency }: BudgetManagerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [month] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    if (username) {
      loadBudgets()
    }
  }, [username])

  const loadBudgets = async () => {
    try {
      const data = await getBudgetStatus(username, month)
      setBudgets(data.budget_status || [])
    } catch (error) {
      console.error('Failed to load budgets:', error)
    }
  }

  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !amount) return

    setLoading(true)
    try {
      await setBudget(username, category, parseFloat(amount), month, currency)
      setCategory('')
      setAmount('')
      setShowForm(false)
      await loadBudgets()
    } catch (error: any) {
      alert(error.message || 'Failed to set budget')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-50 border-green-300'
      case 'warning': return 'bg-yellow-50 border-yellow-300'
      case 'exceeded': return 'bg-red-50 border-red-300'
      default: return 'bg-gray-50 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'exceeded': return <AlertCircle className="w-5 h-5 text-red-600" />
      default: return <TrendingUp className="w-5 h-5 text-gray-600" />
    }
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'exceeded': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-600" />
            )}
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-heading">Monthly Budgets</h2>
            {isExpanded && (
              <p className="text-sm text-slate-500 mt-1">Track spending limits for {new Date(month + '-01').toLocaleDateString('default', { month: 'long', year: 'numeric' })}</p>
            )}
          </div>
        </div>
        {isExpanded && (
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Budget
          </Button>
        )}
      </div>

      {isExpanded && (
        <>
          {showForm && (
            <form onSubmit={handleSetBudget} className="mb-6 p-4 bg-gradient-to-br from-primary-50 to-violet-50 rounded-xl border-2 border-primary-200">
              <h3 className="font-bold text-slate-900 mb-3">Set Budget Limit</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="number"
                    placeholder="Budget Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Setting...' : 'Set Budget'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {budgets.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No budgets set for this month</p>
                <p className="text-sm text-slate-400 mt-1">Click "Add Budget" to get started!</p>
              </div>
            ) : (
              budgets.map((budget) => (
                <div
                  key={budget.category}
                  className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${getStatusColor(budget.status)}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(budget.status)}
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{budget.category}</h3>
                        <p className="text-sm text-slate-600">
                          {budget.status === 'exceeded' && '⚠️ Over budget!'}
                          {budget.status === 'warning' && '⚡ Approaching limit'}
                          {budget.status === 'good' && '✓ On track'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-slate-900">
                        {budget.percentage.toFixed(0)}%
                      </span>
                      <p className="text-xs text-slate-500">used</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-700 font-medium">
                        Spent: {currency} {budget.spent.toLocaleString()}
                      </span>
                      <span className="text-slate-700 font-medium">
                        Budget: {currency} {budget.budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-white/70 rounded-full h-4 border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getProgressColor(budget.status)}`}
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                    <p className="text-sm font-medium text-slate-700">
                      Remaining: <span className={`font-bold ${budget.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {currency} {Math.abs(budget.remaining).toLocaleString()}
                        {budget.remaining < 0 && ' over'}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {budgets.some(b => b.status !== 'good') && (
            <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-yellow-900">Budget Alerts</h4>
                  <p className="text-sm text-yellow-800 mt-1">
                    {budgets.filter(b => b.status === 'exceeded').length > 0 && 
                      `${budgets.filter(b => b.status === 'exceeded').length} budget(s) exceeded. `}
                    {budgets.filter(b => b.status === 'warning').length > 0 && 
                      `${budgets.filter(b => b.status === 'warning').length} budget(s) approaching limit.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  )
}
