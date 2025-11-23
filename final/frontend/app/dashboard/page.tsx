'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getTransactions, getMonthlyReport, addTransaction, downloadExcel, deleteTransaction, getProfile } from '@/lib/api'
import { Transaction, MonthlyReport, UserProfile } from '@/types'
import SummaryCards from '@/components/SummaryCards'
import SavingsVault from '@/components/SavingsVault'
import Footer from '@/components/Footer'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { formatCurrency } from '@/lib/currency'

export default function DashboardPage() {
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [report, setReport] = useState<MonthlyReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    type: 'expense',
    category: 'Food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    currency: 'PKR'
  })
  const [showCharts, setShowCharts] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem('username')
    if (!user) {
      router.push('/login')
      return
    }
    setUsername(user)
    loadData(user)
  }, [router])

  const loadData = async (user: string) => {
    try {
      const [txns, rpt, profile] = await Promise.all([
        getTransactions(user),
        getMonthlyReport(user),
        getProfile(user)
      ])
      setTransactions(txns)
      setReport(rpt)
      setUserProfile(profile)
      setFormData(prev => ({ ...prev, currency: profile.currency }))
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username) return

    try {
      await addTransaction({
        username,
        type: formData.type as 'income' | 'expense',
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: formData.date,
        currency: formData.currency
      })
      
      setFormData({
        type: 'expense',
        category: 'Food',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        currency: 'PKR'
      })
      
      loadData(username)
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return
    
    try {
      await deleteTransaction(id)
      if (username) loadData(username)
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('username')
    router.push('/login')
  }

  const handleExport = () => {
    if (username) {
      downloadExcel(username)
    }
  }

  const categories = {
    expense: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other'],
    income: ['Salary', 'Freelance', 'Investments', 'Savings', 'Other']
  }

  const currencies = ['PKR', 'USD', 'EUR', 'GBP', 'SAR', 'AED']

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#6366F1']

  const chartData = report?.categoryBreakdown || report?.category_breakdown
    ? Object.entries(report?.categoryBreakdown || report?.category_breakdown || {}).map(([name, value]) => ({
        name,
        value: Number(value)
      }))
    : []

  const monthlyData = [
    { name: 'Income', value: report?.totalIncome || report?.total_income || 0, fill: '#10B981' },
    { name: 'Expense', value: report?.totalExpense || report?.total_expense || 0, fill: '#EF4444' },
    { name: 'Savings', value: report?.savingsVault || 0, fill: '#8B5CF6' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-200 to-purple-50">
      {/* Classy Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Expense Tracker
              </h1>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-lg">
                <span className="text-gray-600 text-sm">Welcome, </span>
                <strong className="text-gray-800">{username}</strong>
              </div>
              <Link
                href="/profile"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About
              </Link>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <SummaryCards report={report} loading={loading} currency={userProfile?.currency || 'PKR'} />

        <div className="mb-8 mt-6">
          <SavingsVault 
            username={username || ''}
            savingsVault={userProfile?.savingsVault || 0}
            currency={userProfile?.currency || 'PKR'}
            balance={report?.balance || 0}
            onUpdate={() => loadData(username || '')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Add Transaction</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <select
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white font-medium"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value, category: categories[e.target.value as keyof typeof categories][0] })}
                  >
                    <option value="expense">💸 Expense</option>
                    <option value="income">💰 Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white font-medium"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories[formData.type as keyof typeof categories].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white font-semibold text-lg"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                  <select
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white font-medium"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  >
                    {currencies.map((curr) => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    required
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  ✨ Add Transaction
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Recent Transactions</h2>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                {transactions.map((txn) => (
                  <div key={txn.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition group">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{txn.description}</p>
                      <p className="text-sm text-gray-600">{txn.category} • {txn.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-lg font-bold ${txn.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, userProfile?.currency || 'PKR')}
                      </div>
                      <button
                        onClick={() => handleDelete(txn.id)}
                        className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No transactions yet. Add your first transaction!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3 rounded-xl">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Analytics</h2>
              </div>
              <button
                onClick={() => setShowCharts(!showCharts)}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold"
              >
                {showCharts ? '👁️ Hide Charts' : '📊 Show Charts'}
              </button>
            </div>

            {/* Animated Chart Container */}
            <div 
              className={`transition-all duration-500 ease-in-out ${
                showCharts ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Category Breakdown Pie Chart */}
                <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-800">Expense by Category</h3>
                  </div>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 py-12">No expense data available</p>
                )}
              </div>

              {/* Income vs Expense Bar Chart */}
              <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                  <h3 className="text-lg font-bold text-gray-800">Income vs Expense</h3>
                </div>
                {report && ((report.totalIncome || report.total_income || 0) > 0 || (report.totalExpense || report.total_expense || 0) > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
                        {monthlyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 py-12">No financial data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>

      <Footer />
    </div>
  )
}
