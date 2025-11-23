'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProfile, updateName, updatePassword, updateCurrency, getCurrencyRates } from '@/lib/api'
import { UserProfile } from '@/types'
import Link from 'next/link'

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
      alert('Currency updated successfully!')
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            💰 Expense Tracker
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 transition"
            >
              About
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">👤 My Profile</h2>

        <div className="grid gap-6">
          {/* Profile Info Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Profile Information</h3>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  ✏️ Edit Name
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-800 font-semibold">
                  {profile?.username}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                  {profile?.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                {editMode ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                    <button
                      onClick={handleUpdateName}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false)
                        setNewName(profile?.fullName || '')
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {profile?.fullName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Member Since</label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Currency Settings Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">💱 Currency Preference</h3>
            <p className="text-gray-600 mb-4">
              Select your preferred currency. All transactions will be converted to this currency.
            </p>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {currencies.map((curr) => (
                <button
                  key={curr}
                  onClick={() => handleUpdateCurrency(curr)}
                  className={`p-3 rounded-lg font-semibold transition ${
                    profile?.currency === curr
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Password Change Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">🔒 Change Password</h3>
              {!passwordMode && (
                <button
                  onClick={() => setPasswordMode(true)}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                >
                  Change Password
                </button>
              )}
            </div>

            {passwordMode && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleUpdatePassword}
                    className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => {
                      setPasswordMode(false)
                      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
                    }}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
