import { MonthlyReport } from '@/types'
import { formatCurrency } from '@/lib/currency'

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
          <div key={i} className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  const income = report?.totalIncome || report?.total_income || 0
  const expense = report?.totalExpense || report?.total_expense || 0
  const balance = report?.balance || 0
  const isNegativeBalance = balance < 0

  return (
    <div className="space-y-4">

      {isNegativeBalance && (
        <div className="bg-red-500 text-white p-4 rounded-xl shadow-lg flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="font-bold">⚠️ Warning: Negative Balance!</p>
            <p className="text-sm">
              Your balance is currently {formatCurrency(balance, currency)}. Your expenses exceed your
              income.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Income Card */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Total Income</p>
              <p className="text-3xl font-bold">{formatCurrency(income, currency)}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-gradient-to-br from-red-500 to-pink-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium mb-1">Total Expenses</p>
              <p className="text-3xl font-bold">{formatCurrency(expense, currency)}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div
          className={`bg-gradient-to-br ${
            balance >= 0 ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600'
          } p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Balance</p>
              <p className="text-3xl font-bold">{formatCurrency(balance, currency)}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
