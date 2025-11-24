export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent font-heading">
              Expense Tracker
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your personal finance command center. Track expenses, manage savings, and achieve your financial freedom with our premium suite of tools.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 font-heading">Features</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="text-primary-500">✓</span>
                Multi-currency Support
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary-500">✓</span>
                Secure Savings Vault
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary-500">✓</span>
                Interactive Analytics
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary-500">✓</span>
                Excel Export Reports
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 font-heading">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/dashboard" className="hover:text-primary-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span> Dashboard
                </a>
              </li>
              <li>
                <a href="/profile" className="hover:text-primary-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span> Profile
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-primary-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span> About Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>
            © {currentYear} Expense Tracker. All rights reserved.
          </p>
          <p className="mt-2 md:mt-0 flex items-center gap-1">
            Made with <span className="text-red-500">❤️</span> for financial wellness
          </p>
        </div>
      </div>
    </footer>
  )
}
