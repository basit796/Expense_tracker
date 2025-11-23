'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            💰 Expense Tracker
          </h1>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            About Expense Tracker
          </h2>
          <p className="text-xl text-gray-600">
            Your personal finance management solution
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To empower individuals with simple yet powerful tools to track, manage, and optimize their personal finances. We believe financial awareness is the first step to financial freedom.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To become the most user-friendly expense tracking platform that helps millions make informed financial decisions through intelligent insights and beautiful design.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl mb-12">
          <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">✨ Key Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-4xl mb-3">💱</div>
              <h4 className="font-bold text-lg mb-2 text-blue-600">Multi-Currency Support</h4>
              <p className="text-gray-600 text-sm">Support for PKR, USD, EUR, GBP, SAR, and AED with automatic conversion</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="text-4xl mb-3">📊</div>
              <h4 className="font-bold text-lg mb-2 text-purple-600">Visual Analytics</h4>
              <p className="text-gray-600 text-sm">Beautiful charts and graphs to visualize your spending patterns</p>
            </div>

            <div className="text-center p-6 bg-pink-50 rounded-xl">
              <div className="text-4xl mb-3">📈</div>
              <h4 className="font-bold text-lg mb-2 text-pink-600">Monthly Reports</h4>
              <p className="text-gray-600 text-sm">Detailed monthly breakdowns with category-wise analysis</p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-4xl mb-3">🔒</div>
              <h4 className="font-bold text-lg mb-2 text-green-600">Secure & Private</h4>
              <p className="text-gray-600 text-sm">Your data is encrypted and stored securely</p>
            </div>

            <div className="text-center p-6 bg-yellow-50 rounded-xl">
              <div className="text-4xl mb-3">📥</div>
              <h4 className="font-bold text-lg mb-2 text-yellow-600">Export to Excel</h4>
              <p className="text-gray-600 text-sm">Download your transaction history in Excel format</p>
            </div>

            <div className="text-center p-6 bg-indigo-50 rounded-xl">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="font-bold text-lg mb-2 text-indigo-600">Real-time Updates</h4>
              <p className="text-gray-600 text-sm">Instant updates and synchronization across all features</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl shadow-xl text-white mb-12">
          <h3 className="text-3xl font-bold mb-6 text-center">🏗️ Technology Stack</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="font-bold text-xl mb-2">Frontend</h4>
              <ul className="space-y-1 text-blue-100">
                <li>Next.js 14</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>React Hooks</li>
              </ul>
            </div>

            <div className="text-center">
              <h4 className="font-bold text-xl mb-2">Backend</h4>
              <ul className="space-y-1 text-purple-100">
                <li>Java 17</li>
                <li>FastAPI (Python)</li>
                <li>REST APIs</li>
                <li>JSON Storage</li>
              </ul>
            </div>

            <div className="text-center">
              <h4 className="font-bold text-xl mb-2">Features</h4>
              <ul className="space-y-1 text-pink-100">
                <li>Currency Converter</li>
                <li>Password Hashing</li>
                <li>Data Persistence</li>
                <li>Excel Export</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">👨‍💻 Development</h3>
          <p className="text-gray-600 text-center mb-6 max-w-3xl mx-auto">
            This project was built with modern technologies and best practices in mind. 
            The architecture follows a microservices approach with Java handling business logic, 
            FastAPI providing the API layer, and Next.js delivering a seamless user experience.
          </p>
          
          <div className="flex justify-center gap-4">
            <div className="bg-blue-50 px-6 py-3 rounded-lg">
              <p className="text-sm text-gray-600">Version</p>
              <p className="text-2xl font-bold text-blue-600">2.0.0</p>
            </div>
            <div className="bg-purple-50 px-6 py-3 rounded-lg">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-2xl font-bold text-purple-600">Active</p>
            </div>
            <div className="bg-green-50 px-6 py-3 rounded-lg">
              <p className="text-sm text-gray-600">License</p>
              <p className="text-2xl font-bold text-green-600">MIT</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
          >
            Get Started Now →
          </Link>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; 2025 Expense Tracker. Built with ❤️ using Next.js, Java & FastAPI
          </p>
        </div>
      </footer>
    </div>
  )
}
