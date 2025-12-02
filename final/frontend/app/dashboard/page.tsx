'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getTransactions, getMonthlyReport, addTransaction, downloadExcel, deleteTransaction, getProfile } from '@/lib/api'
import { Transaction, MonthlyReport, UserProfile } from '@/types'
import SummaryCards from '@/components/SummaryCards'
import SavingsVault from '@/components/SavingsVault'
import BudgetManager from '@/components/BudgetManager'
import GoalsTracker from '@/components/GoalsTracker'
import Footer from '@/components/Footer'
import TransactionForm from '@/components/dashboard/TransactionForm'
import TransactionList from '@/components/dashboard/TransactionList'
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts'
import FinancialChat from '@/components/FinancialChat'
import { Button } from '@/components/ui/Button'
import { LogOut, User, Download, LayoutDashboard, Info, ChevronLeft, ChevronRight } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [report, setReport] = useState<MonthlyReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [monthLoading, setMonthLoading] = useState(false)
  const [showCharts, setShowCharts] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)) // YYYY-MM
  const [viewAllTime, setViewAllTime] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('username')
    if (!user) {
      router.push('/login')
      return
    }
    setUsername(user)
    loadData(user)
  }, [router])

  useEffect(() => {
    if (username) {
      setMonthLoading(true)
      loadData(username).finally(() => setMonthLoading(false))
    }
  }, [selectedMonth, viewAllTime])

  const loadData = async (user: string) => {
    try {
      const month = viewAllTime ? undefined : selectedMonth
      const [txns, rpt, profile] = await Promise.all([
        viewAllTime ? getTransactions(user) : getTransactions(user, month),
        viewAllTime ? getMonthlyReport(user) : getMonthlyReport(user, month),
        getProfile(user)
      ])
      setTransactions(txns)
      setReport(rpt)
      setUserProfile(profile)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTransaction = async (data: any) => {
    if (!username || !userProfile) return
    await addTransaction({
      username,
      ...data
    })
    await loadData(username)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return

    try {
      await deleteTransaction(id)
      if (username) await loadData(username)
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-primary-500/20">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-700 to-violet-700 bg-clip-text text-transparent font-heading">
                Expense Tracker
              </h1>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-600">
                  {username}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="hidden md:flex gap-2">
                    <User className="w-4 h-4" /> Profile
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="ghost" size="sm" className="hidden md:flex gap-2">
                    <Info className="w-4 h-4" /> About
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="gap-2 text-primary-600 border-primary-200 hover:bg-primary-50"
                >
                  <Download className="w-4 h-4" /> Export
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 font-heading">Dashboard</h2>
            <p className="text-slate-500 mt-1">Overview of your financial health</p>
          </div>
          <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            Currency: <span className="font-bold text-slate-900">{userProfile?.currency || 'PKR'}</span>
          </div>
        </div>

        <SummaryCards
          report={report}
          loading={loading}
          currency={userProfile?.currency || 'PKR'}
        />

        <SavingsVault
          username={username || ''}
          savingsVault={userProfile?.savingsVault || 0}
          currency={userProfile?.currency || 'PKR'}
          balance={report?.balance || 0}
          onUpdate={() => loadData(username || '')}
        />

        {/* Month Selector */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">Viewing Data For:</h3>
          <div className="flex items-center gap-3">
            <Button
              variant={viewAllTime ? "outline" : "primary"}
              size="sm"
              onClick={() => setViewAllTime(!viewAllTime)}
              className="gap-2"
            >
              {viewAllTime ? 'Switch to Monthly' : 'View All Time'}
            </Button>
            
            {!viewAllTime && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const date = new Date(selectedMonth + '-01')
                    date.setMonth(date.getMonth() - 1)
                    setSelectedMonth(date.toISOString().slice(0, 7))
                  }}
                  className="gap-2"
                  disabled={monthLoading}
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                <div className="px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg min-w-[160px] text-center">
                  {monthLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-primary-600">Loading...</span>
                    </div>
                  ) : (
                    <span className="font-bold text-primary-700">
                      {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const date = new Date(selectedMonth + '-01')
                    date.setMonth(date.getMonth() + 1)
                    setSelectedMonth(date.toISOString().slice(0, 7))
                  }}
                  className="gap-2"
                  disabled={selectedMonth >= new Date().toISOString().slice(0, 7) || monthLoading}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TransactionForm
              onSubmit={handleAddTransaction}
              categories={categories}
              currencies={currencies}
            />
          </div>

          <div className="lg:col-span-2 h-[600px]">
            <TransactionList
              transactions={transactions}
              onDelete={handleDelete}
              currency={userProfile?.currency || 'PKR'}
              selectedMonth={selectedMonth}
              viewAllTime={viewAllTime}
              loading={monthLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BudgetManager
            username={username || ''}
            categories={categories.expense}
            currency={userProfile?.currency || 'PKR'}
            selectedMonth={selectedMonth}
          />

          <GoalsTracker
            username={username || ''}
            currency={userProfile?.currency || 'PKR'}
            onUpdate={() => loadData(username || '')}
          />
        </div>

        <AnalyticsCharts
          report={report}
          showCharts={showCharts}
          setShowCharts={setShowCharts}
          username={username || ''}
          selectedMonth={selectedMonth}
          viewAllTime={viewAllTime}
          loading={monthLoading}
        />
      </main>

      <Footer />

      {username && <FinancialChat username={username} />}
    </div>
  )
}
