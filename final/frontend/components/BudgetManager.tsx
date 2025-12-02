'use client'

import { useState, useEffect } from 'react'
import { setBudget, getBudgetStatus, deleteBudget } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { AlertCircle, CheckCircle, TrendingUp, Plus, Trash2, DollarSign, ChevronDown, ChevronUp } from 'lucide-react'

interface Budget {
  budgetId?: string  // Add budgetId for deletion
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
  selectedMonth?: string
}

export default function BudgetManager({ username, categories, currency, selectedMonth }: BudgetManagerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false) // Closed by default
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const month = selectedMonth || new Date().toISOString().slice(0, 7)

  useEffect(() => {
    if (username && month) {
      loadBudgets()
    }
  }, [username, month])

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

  const handleDeleteBudget = async (category: string) => {
    if (!confirm(`Are you sure you want to delete the budget for ${category}?`)) return

    try {
      // Find the budget with the budgetId from loaded budgets
      const budgetToDelete = budgets.find((b: Budget) => b.category === category)
      
      if (budgetToDelete && budgetToDelete.budgetId) {
        await deleteBudget(budgetToDelete.budgetId)
        await loadBudgets()
      } else {
        alert('Budget ID not found')
      }
    } catch (error: any) {
      alert(error.message || 'Failed to delete budget')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-50 border-green-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'exceeded': return 'bg-red-50 border-red-200'
      default: return 'bg-slate-50 border-slate-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'exceeded': return <AlertCircle className="w-5 h-5 text-red-600" />
      default: return <TrendingUp className="w-5 h-5 text-slate-400" />
    }
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'exceeded': return 'bg-red-500'
      default: return 'bg-slate-400'
    }
  }

  return (
    <Card className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'p-6' : 'p-4'}`}>
      <div className="flex justify-between items-center">
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
          <div className={`bg-gradient-to-br from-primary-600 to-violet-600 rounded-xl shadow-lg transition-all duration-500 ${isExpanded ? 'p-3' : 'p-2'}`}>
            <TrendingUp className={`text-white transition-all duration-500 ${isExpanded ? 'w-6 h-6' : 'w-5 h-5'}`} />
          </div>
          <div>
            <h2 className={`font-bold text-slate-900 font-heading transition-all duration-500 ${isExpanded ? 'text-2xl' : 'text-lg'}`}>
              Monthly Budgets
            </h2>
            {isExpanded && (
              <p className="text-sm text-slate-500 mt-1 animate-in fade-in slide-in-from-left-2 duration-300">
                Track spending limits for {new Date(month + '-01').toLocaleDateString('default', { month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
        {isExpanded && (
          <Button
            onClick={() => setShowForm(!showForm)}
            className="w-44 gap-2 animate-in fade-in zoom-in duration-300 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-700 hover:to-violet-700 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Add Budget
          </Button>
        )}
      </div>

      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'mt-6 opacity-100' : 'mt-0 opacity-0 h-0 overflow-hidden'}`}>
        {showForm && (
          <form onSubmit={handleSetBudget} className="mb-6 p-6 bg-white rounded-xl border-2 border-primary-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="font-bold text-slate-900 mb-4 text-lg">Set Budget Limit</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={categories.map(cat => ({ value: cat, label: cat }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Budget Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="pl-10 bg-white border-slate-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Setting...' : 'Set Budget'}
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {budgets.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <TrendingUp className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">No budgets set for this month</p>
              <p className="text-sm text-slate-400 mt-1">Click "Add Budget" to start tracking your spending limits!</p>
            </div>
          ) : (
            budgets.map((budget, index) => (
              <div
                key={budget.category}
                className={`p-5 rounded-xl border transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-4 ${getStatusColor(budget.status)}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(budget.status)}
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{budget.category}</h3>
                      <p className="text-sm text-slate-600 font-medium">
                        {budget.status === 'exceeded' && '⚠️ Over budget!'}
                        {budget.status === 'warning' && '⚡ Approaching limit'}
                        {budget.status === 'good' && '✓ On track'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${budget.percentage > 100 ? 'text-red-600' : 'text-slate-900'}`}>
                      {budget.percentage.toFixed(0)}%
                    </span>
                    <p className="text-xs text-slate-500">used</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600 font-medium">
                      Spent: {currency} {budget.spent.toLocaleString()}
                    </span>
                    <span className="text-slate-600 font-medium">
                      Limit: {currency} {budget.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden border border-slate-200/50">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressColor(budget.status)}`}
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-200/50">
                  <p className="text-sm font-medium text-slate-700">
                    Remaining: <span className={`font-bold ${budget.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {currency} {Math.abs(budget.remaining).toLocaleString()}
                      {budget.remaining < 0 && ' over'}
                    </span>
                  </p>
                  <button
                    onClick={() => handleDeleteBudget(budget.category)}
                    className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete budget"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {budgets.some(b => b.status !== 'good') && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl animate-in fade-in slide-in-from-bottom-4">
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
      </div>
    </Card>
  )
}
