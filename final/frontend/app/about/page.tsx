'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LayoutDashboard, LogIn, Target, Lightbulb, Globe, BarChart3, PieChart, Shield, Download, Zap, Layers, Server, Database, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  const router = useRouter()

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
              <Link href="/login">
                <Button size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" /> Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-violet-600 to-primary-600 bg-clip-text text-transparent font-heading">
            About Expense Tracker
          </h2>
          <p className="text-xl text-slate-500 leading-relaxed">
            Your personal finance management solution. We empower you to take control of your financial future with intuitive tools and powerful insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 hover:shadow-xl transition-shadow duration-300 border-primary-100">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900 font-heading">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed">
              To empower individuals with simple yet powerful tools to track, manage, and optimize their personal finances. We believe financial awareness is the first step to financial freedom.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-shadow duration-300 border-violet-100">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-6">
              <Lightbulb className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900 font-heading">Our Vision</h3>
            <p className="text-slate-600 leading-relaxed">
              To become the most user-friendly expense tracking platform that helps millions make informed financial decisions through intelligent insights and beautiful design.
            </p>
          </Card>
        </div>

        <div>
          <h3 className="text-3xl font-bold mb-10 text-center text-slate-900 font-heading">✨ Key Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Globe className="w-6 h-6 text-blue-600" />, title: "Multi-Currency", desc: "Support for PKR, USD, EUR, GBP, SAR, and AED with automatic conversion", color: "bg-blue-50" },
              { icon: <BarChart3 className="w-6 h-6 text-violet-600" />, title: "Visual Analytics", desc: "Beautiful charts and graphs to visualize your spending patterns", color: "bg-violet-50" },
              { icon: <PieChart className="w-6 h-6 text-pink-600" />, title: "Monthly Reports", desc: "Detailed monthly breakdowns with category-wise analysis", color: "bg-pink-50" },
              { icon: <Shield className="w-6 h-6 text-emerald-600" />, title: "Secure & Private", desc: "Your data is encrypted and stored securely", color: "bg-emerald-50" },
              { icon: <Download className="w-6 h-6 text-amber-600" />, title: "Export to Excel", desc: "Download your transaction history in Excel format", color: "bg-amber-50" },
              { icon: <Zap className="w-6 h-6 text-indigo-600" />, title: "Real-time Updates", desc: "Instant updates and synchronization across all features", color: "bg-indigo-50" }
            ].map((feature, i) => (
              <Card key={i} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  {feature.icon}
                </div>
                <h4 className="font-bold text-lg mb-2 text-slate-900">{feature.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-8 text-center font-heading">🏗️ Technology Stack</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm">
                  <Layers className="w-6 h-6 text-primary-300" />
                </div>
                <h4 className="font-bold text-xl">Frontend</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>Next.js 14</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>React Hooks</li>
                </ul>
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm">
                  <Server className="w-6 h-6 text-violet-300" />
                </div>
                <h4 className="font-bold text-xl">Backend</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>Java 17</li>
                  <li>FastAPI (Python)</li>
                  <li>REST APIs</li>
                  <li>JSON Storage</li>
                </ul>
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm">
                  <Database className="w-6 h-6 text-pink-300" />
                </div>
                <h4 className="font-bold text-xl">Features</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>Currency Converter</li>
                  <li>Password Hashing</li>
                  <li>Data Persistence</li>
                  <li>Excel Export</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-white to-slate-50 border-slate-200">
          <h3 className="text-3xl font-bold mb-6 text-slate-900 font-heading">👨‍💻 Development Status</h3>
          <p className="text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            This project was built with modern technologies and best practices in mind.
            The architecture follows a microservices approach with Java handling business logic,
            FastAPI providing the API layer, and Next.js delivering a seamless user experience.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="bg-blue-50 px-6 py-3 rounded-xl border border-blue-100">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Version</p>
              <p className="text-2xl font-bold text-blue-700">2.0.0</p>
            </div>
            <div className="bg-emerald-50 px-6 py-3 rounded-xl border border-emerald-100">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Status</p>
              <p className="text-2xl font-bold text-emerald-700">Active</p>
            </div>
            <div className="bg-slate-100 px-6 py-3 rounded-xl border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">License</p>
              <p className="text-2xl font-bold text-slate-700">MIT</p>
            </div>
          </div>

          <Link href="/register">
            <Button size="lg" className="px-8 h-14 text-lg shadow-xl shadow-primary-500/20">
              Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </Card>
      </main>

      <footer className="bg-slate-900 text-white py-12 mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400">
            &copy; 2025 Expense Tracker. Built with ❤️ using Next.js, Java & FastAPI
          </p>
        </div>
      </footer>
    </div>
  )
}
