'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, CheckCircle2, Shield, TrendingUp } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const username = localStorage.getItem('username')
    if (username) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            New: Savings Vault Feature Available
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight font-heading mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Financial Freedom <br /> Starts Here.
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
            Take control of your finances with our premium expense tracking suite.
            Monitor spending, set savings goals, and visualize your wealth growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8">
                Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 font-heading">Why Choose Us?</h2>
          <p className="text-slate-500 mt-4">Everything you need to manage your money effectively.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <TrendingUp className="w-8 h-8 text-primary-600" />,
              title: "Smart Analytics",
              description: "Visualize your spending habits with interactive charts and detailed monthly reports."
            },
            {
              icon: <Shield className="w-8 h-8 text-primary-600" />,
              title: "Secure Vault",
              description: "Keep your savings separate and secure in your personal digital vault."
            },
            {
              icon: <CheckCircle2 className="w-8 h-8 text-primary-600" />,
              title: "Easy Tracking",
              description: "Log income and expenses in seconds. Export data to Excel for offline analysis."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-primary-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 font-heading">Ready to transform your financial life?</h2>
          <p className="text-primary-100 mb-8 text-lg">Join thousands of users who are already saving more and spending smarter.</p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 h-14 px-10 text-lg shadow-xl">
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
