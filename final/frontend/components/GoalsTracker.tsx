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

export default function GoalsTracker({ username, currency, onUpdate }: GoalsTrackerProps & { onUpdate?: () => void }) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
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
      if (onUpdate) onUpdate() // Trigger parent update
    } catch (error: any) {
      console.error('Contribute error:', error)
      setError(error.message || 'Failed to contribute')
      alert(error.message || 'Failed to contribute to goal')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (goalId: string) => {
    // Find the goal to check if it's complete
    const goal = goals.find(g => g.id === goalId)
    if (!goal) return

    const isComplete = goal.current_amount >= goal.target_amount
    
    let choice = ''
    
    if (isComplete) {
      // Goal is complete - just ask if they want to delete
      if (confirm(`🎉 Congratulations! This goal is complete!\n\nGoal: ${goal.name}\nAchieved: ${currency} ${goal.current_amount.toLocaleString()}\n\nDelete this goal?`)) {
        choice = 'complete'
      } else {
        return
      }
    } else {
      // Goal is incomplete - ask if completing or cancelling
      const message = `What would you like to do with this goal?\n\n` +
        `Goal: ${goal.name}\n` +
        `Progress: ${currency} ${goal.current_amount.toLocaleString()} of ${currency} ${goal.target_amount.toLocaleString()}\n\n` +
        `Click "OK" to COMPLETE (end goal, no refund)\n` +
        `Click "Cancel" to CANCEL (get your ${currency} ${goal.current_amount.toLocaleString()} back)`
      
      if (confirm(message)) {
        choice = 'complete'  // User clicked OK - mark as complete
      } else {
        choice = 'cancel'   // User clicked Cancel - return money
      }
    }

    setError('')
    try {
      // completed=true means "mark as done, no refund"
      // completed=false means "cancel and refund"
      const isCompleted = choice === 'complete'
      await deleteGoal(goalId, isCompleted)
      await loadGoals()
      if (onUpdate) onUpdate()  // Refresh balance
      
      if (choice === 'cancel' && goal.current_amount > 0) {
        alert(`✅ Goal cancelled!\n\n${currency} ${goal.current_amount.toLocaleString()} returned to your balance.`)
      } else if (choice === 'complete') {
        alert('🎉 Goal completed and removed! Great job!')
      }
    } catch (error: any) {
      console.error('Delete error:', error)
      setError(error.message || 'Failed to delete goal')
      alert(error.message || 'Failed to delete goal')
    }
  }

  const minDate = new Date().toISOString().split('T')[0]

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
            <Target className={`text-white transition-all duration-500 ${isExpanded ? 'w-6 h-6' : 'w-5 h-5'}`} />
          </div>
          <div>
            <h2 className={`font-bold text-slate-900 font-heading transition-all duration-500 ${isExpanded ? 'text-2xl' : 'text-lg'}`}>
              Financial Goals
            </h2>
            {isExpanded && (
              <p className="text-sm text-slate-500 animate-in fade-in slide-in-from-left-2 duration-300">Track your savings targets</p>
            )}
          </div>
        </div>
        {isExpanded && (
          <Button onClick={() => setShowForm(!showForm)} className="gap-2 animate-in fade-in zoom-in duration-300">
            <Plus className="w-4 h-4" /> New Goal
          </Button>
        )}
      </div>

      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'mt-6 opacity-100' : 'mt-0 opacity-0 h-0 overflow-hidden'}`}>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-2">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {showForm && (
            <form onSubmit={handleCreateGoal} className="mb-6 p-6 bg-white rounded-xl border-2 border-primary-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="font-bold text-slate-900 mb-4 text-lg">Create New Goal</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Goal Name</label>
                  <Input
                    placeholder="e.g., Emergency Fund, Vacation"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-white border-slate-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Amount</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                        className="pl-10 bg-white border-slate-300 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                      <Input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                        min={minDate}
                        className="pl-10 bg-white border-slate-300 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Goal'}
                </Button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Target className="w-8 h-8 text-primary-400" />
                </div>
                <p className="text-slate-600 font-medium">No goals yet</p>
                <p className="text-sm text-slate-400 mt-1">Set your first financial goal to start tracking!</p>
              </div>
            ) : (
              goals.map((goal, index) => (
                <div
                  key={goal.id}
                  className="p-5 border border-slate-200 rounded-xl bg-white hover:shadow-lg hover:border-primary-200 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-slate-900">{goal.name}</h3>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 font-medium">Progress</span>
                        <span className="font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full text-xs">
                          {goal.progress_percentage.toFixed(1)}%
                        </span>
                      </div>

                      <div className="relative w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-violet-600 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-xs mt-2 text-slate-500 font-medium">
                        <span>{currency} {goal.current_amount.toLocaleString()}</span>
                        <span>{currency} {goal.target_amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Deadline</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        {goal.days_remaining} days
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Daily</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        {currency} {goal.daily_savings_required.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {contributingTo === goal.id ? (
                    <div className="flex gap-2 animate-in fade-in zoom-in duration-200">
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 z-10 pointer-events-none" />
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={contributeAmount}
                          onChange={(e) => setContributeAmount(e.target.value)}
                          min="0"
                          step="0.01"
                          className="pl-8 h-9 text-sm bg-white relative z-0"
                          autoFocus
                        />
                      </div>
                      <Button
                        onClick={() => handleContribute(goal.id)}
                        disabled={loading || !contributeAmount}
                        size="sm"
                        className="h-9"
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
                        className="h-9"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setContributingTo(goal.id)}
                      className="w-full gap-2 group hover:shadow-md transition-all"
                      variant="outline"
                    >
                      <TrendingUp className="w-4 h-4 text-primary-600 group-hover:scale-110 transition-transform" />
                      Contribute
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
