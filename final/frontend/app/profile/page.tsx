'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProfile, updateName, updatePassword, updateCurrency, getCurrencyRates } from '@/lib/api'
import { UserProfile } from '@/types'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { User, Mail, Calendar, Lock, Globe, Edit2, Save, X, LayoutDashboard, Info, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [currencies, setCurrencies] = useState<string[]>(['PKR', 'USD', 'EUR', 'GBP', 'SAR', 'AED'])

  const [editMode, setEditMode] = useState(false)
  const [newName, setNewName] = useState('')

  const [passwordMode, setPasswordMode] = useState(false)
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const user = localStorage.getItem('username')
    if (!user) {
      router.push('/login')
      return
    }
    setUsername(user)
    loadProfile(user)
    loadCurrencies()
  }, [router])

  const loadProfile = async (user: string) => {
    try {
      const data = await getProfile(user)
      setProfile(data)
      setNewName(data.fullName)
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCurrencies = async () => {
    try {
      const data = await getCurrencyRates()
      if (data.rates) {
        setCurrencies(Object.keys(data.rates))
      }
    } catch (error) {
      console.error('Failed to load currencies:', error)
    }
  }

  const handleUpdateName = async () => {
    if (!username || !newName.trim()) return

    try {
      await updateName(username, newName)
      alert('Name updated successfully!')
      setEditMode(false)
      loadProfile(username)
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleUpdatePassword = async () => {
    if (!username) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!')
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!')
      return
    }

    try {
      await updatePassword(username, passwordData.oldPassword, passwordData.newPassword)
      alert('Password updated successfully!')
      setPasswordMode(false)
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleUpdateCurrency = async (newCurrency: string) => {
    if (!username) return

    try {
      await updateCurrency(username, newCurrency)
      loadProfile(username)
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('username')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-primary-500/20">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-700 to-violet-700 bg-clip-text text-transparent font-heading">
                Expense Tracker
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Info className="w-4 h-4" /> About
                </Button>
              </Link>
              <Button variant="danger" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-violet-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {profile?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 font-heading">My Profile</h2>
            <p className="text-slate-500">Manage your account settings and preferences</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Profile Info Card */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-500" /> Personal Information
              </h3>
              {!editMode && (
                <Button variant="outline" size="sm" onClick={() => setEditMode(true)} className="gap-2">
                  <Edit2 className="w-4 h-4" /> Edit Name
                </Button>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Username</label>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-slate-900 font-medium border border-slate-100">
                    <User className="w-4 h-4 text-slate-400" />
                    {profile?.username}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Email Address</label>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-slate-900 font-medium border border-slate-100">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {profile?.email}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
                {editMode ? (
                  <div className="flex gap-2">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Enter your full name"
                      className="max-w-md"
                    />
                    <Button onClick={handleUpdateName} className="gap-2">
                      <Save className="w-4 h-4" /> Save
                    </Button>
                    <Button variant="ghost" onClick={() => {
                      setEditMode(false)
                      setNewName(profile?.fullName || '')
                    }} className="gap-2">
                      <X className="w-4 h-4" /> Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-slate-900 font-medium border border-slate-100">
                    <User className="w-4 h-4 text-slate-400" />
                    {profile?.fullName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Member Since</label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-slate-900 font-medium border border-slate-100 w-fit">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          </Card>

          {/* Currency Settings Card */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-500" /> Currency Preference
            </h3>
            <p className="text-slate-500 mb-6 text-sm">
              Select your preferred currency. All transactions will be automatically converted.
            </p>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {currencies.map((curr) => (
                <button
                  key={curr}
                  onClick={() => handleUpdateCurrency(curr)}
                  className={cn(
                    "p-3 rounded-xl font-semibold transition-all duration-200 border",
                    profile?.currency === curr
                      ? "bg-primary-50 border-primary-500 text-primary-700 shadow-sm ring-1 ring-primary-500"
                      : "bg-white border-slate-200 text-slate-600 hover:border-primary-300 hover:bg-slate-50"
                  )}
                >
                  {curr}
                </button>
              ))}
            </div>
          </Card>

          {/* Password Change Card */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary-500" /> Security
              </h3>
              {!passwordMode && (
                <Button variant="secondary" size="sm" onClick={() => setPasswordMode(true)} className="gap-2">
                  <Lock className="w-4 h-4" /> Change Password
                </Button>
              )}
            </div>

            {passwordMode && (
              <div className="space-y-4 max-w-md bg-slate-50 p-6 rounded-xl border border-slate-100">
                <Input
                  label="Current Password"
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  placeholder="Enter current password"
                />
                <Input
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />

                <div className="flex gap-3 pt-2">
                  <Button onClick={handleUpdatePassword} className="flex-1">
                    Update Password
                  </Button>
                  <Button variant="ghost" onClick={() => {
                    setPasswordMode(false)
                    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
                  }} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
