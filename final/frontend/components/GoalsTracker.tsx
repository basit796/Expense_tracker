'use client'

import { useState, useEffect } from 'react'
import { createGoal, getGoals, contributeToGoal, deleteGoal } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Target, Plus, Calendar, DollarSign, TrendingUp, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface Goal {
  id: string
  name: string
  target_amount: number
  current_amount: number
  progress_percentage: number
  remaining: number
  deadline: string
  days_remaining: number
  daily_savings_required: number
  category: string
  currency: string
}

interface GoalsTrackerProps {
  username: string
  currency: string
}

export default function GoalsTracker({ username, currency }: GoalsTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(false)
  const [contributingTo, setContributingTo] = useState<string | null>(null)
  const [contributeAmount, setContributeAmount] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (username) {
      loadGoals()
    }
  }, [username])

  const loadGoals = async () => {
    try {
      setError('')
      const data = await getGoals(username)
      setGoals(data)
    } catch (error: any) {
      console.error('Failed to load goals:', error)
      setError(error.message || 'Failed to load goals')
    }
  }

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !targetAmount || !deadline) return

    setLoading(true)
    setError('')
    try {
      await createGoal(username, name, parseFloat(targetAmount), deadline, currency)
      setName('')
      setTargetAmount('')
      setDeadline('')
      setShowForm(false)
      await loadGoals()
    } catch (error: any) {
      console.error('Create goal error:', error)
      setError(error.message || 'Failed to create goal')
      alert(error.message || 'Failed to create goal. Please check if backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleContribute = async (goalId: string) => {
    if (!contributeAmount) return

    setLoading(true)
    setError('')
    try {
      await contributeToGoal(goalId, parseFloat(contributeAmount))
      setContributingTo(null)
      setContributeAmount('')
      await loadGoals()
    } catch (error: any) {
      console.error('Contribute error:', error)
      setError(error.message || 'Failed to contribute')
      alert(error.message || 'Failed to contribute to goal')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    setError('')
    try {
      await deleteGoal(goalId)
      await loadGoals()
    } catch (error: any) {
      console.error('Delete error:', error)
      setError(error.message || 'Failed to delete goal')
      alert(error.message || 'Failed to delete goal')
    }
  }

  const minDate = new Date().toISOString().split('T')[0]

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
          <div className="bg-gradient-to-br from-primary-600 to-violet-600 p-3 rounded-xl shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-heading">Financial Goals</h2>
            {isExpanded && (
              <p className="text-sm text-slate-500">Track your savings targets</p>
            )}
          </div>
        </div>
        {isExpanded && (
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" /> New Goal
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {isExpanded && (
        <>
          {showForm && (
            <form onSubmit={handleCreateGoal} className="mb-6 p-4 bg-gradient-to-br from-primary-50 to-violet-50 rounded-xl border-2 border-primary-200">
              <h3 className="font-bold text-slate-900 mb-3">Create New Goal</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Goal Name (e.g., Emergency Fund, Vacation)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                    <Input
                      type="number"
                      placeholder="Target Amount"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                    <Input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      required
                      min={minDate}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Goal'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary-600" />
                </div>
                <p className="text-slate-500 font-medium">No goals yet</p>
                <p className="text-sm text-slate-400 mt-1">Set your first financial goal!</p>
              </div>
            ) : (
              goals.map((goal) => (
                <div key={goal.id} className="p-5 border-2 border-primary-200 rounded-xl bg-gradient-to-br from-white to-primary-50 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-slate-900">{goal.name}</h3>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-bold text-primary-700">
                          {goal.progress_percentage.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="relative w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-600 to-violet-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-xs mt-1 text-slate-600">
                        <span>{currency} {goal.current_amount.toLocaleString()}</span>
                        <span>{currency} {goal.target_amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/70 p-3 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-medium">Deadline</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        {goal.days_remaining} days left
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-600 mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-xs font-medium">Daily Target</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        {currency} {goal.daily_savings_required.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">per day</p>
                    </div>
                  </div>

                  {contributingTo === goal.id ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={contributeAmount}
                        onChange={(e) => setContributeAmount(e.target.value)}
                        min="0"
                        step="0.01"
                        className="flex-1"
                        autoFocus
                      />
                      <Button 
                        onClick={() => handleContribute(goal.id)}
                        disabled={loading || !contributeAmount}
                        size="sm"
                      >
                        Add
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setContributingTo(null)
                          setContributeAmount('')
                        }}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setContributingTo(goal.id)}
                      className="w-full gap-2"
                      variant="outline"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Contribute
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </Card>
  )
}
