import { MonthlyReport } from '@/types'
import { formatCurrency } from '@/lib/currency'
import { Card } from '@/components/ui/Card'
import { TrendingUp, TrendingDown, Wallet, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SummaryCardsProps {
  report: MonthlyReport | null
  loading: boolean
  currency: string
}

export default function SummaryCards({ report, loading, currency }: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 h-32 animate-pulse bg-slate-100/50">
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
          </Card>
        ))}
      </div>
    )
  }

  const income = report?.totalIncome || report?.total_income || 0
  const expense = report?.totalExpense || report?.total_expense || 0
  const balance = report?.balance || 0
  const isNegativeBalance = balance < 0

  return (
    <div className="space-y-6">
      {isNegativeBalance && (
        <div className="bg-danger-50 border border-danger-100 text-danger-700 p-4 rounded-2xl shadow-sm flex items-center gap-3 animate-slide-up">
          <div className="bg-danger-100 p-2 rounded-full">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold">Negative Balance Warning</p>
            <p className="text-sm opacity-90">
              Your expenses exceed your income. Current balance: <span className="font-bold">{formatCurrency(balance, currency)}</span>
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Card */}
        <Card hover className="p-6 bg-gradient-to-br from-success-500 to-emerald-600 text-white border-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-100 text-sm font-medium mb-1">Total Income</p>
              <p className="text-3xl font-bold tracking-tight">{formatCurrency(income, currency)}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </Card>

        {/* Expense Card */}
        <Card hover className="p-6 bg-gradient-to-br from-danger-500 to-rose-600 text-white border-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-danger-100 text-sm font-medium mb-1">Total Expenses</p>
              <p className="text-3xl font-bold tracking-tight">{formatCurrency(expense, currency)}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <TrendingDown className="w-8 h-8 text-white" />
            </div>
          </div>
        </Card>

        {/* Balance Card */}
        <Card
          hover
          className={cn(
            "p-6 text-white border-none",
            balance >= 0
              ? "bg-gradient-to-br from-primary-500 to-violet-600"
              : "bg-gradient-to-br from-orange-500 to-red-600"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Current Balance</p>
              <p className="text-3xl font-bold tracking-tight">{formatCurrency(balance, currency)}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
