export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              💰 Expense Tracker
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your personal finance management solution. Track expenses, manage savings, and achieve your financial goals with ease.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Multi-currency support
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Savings vault
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Visual analytics
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Excel reports
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/dashboard" className="hover:text-white transition">Dashboard</a>
              </li>
              <li>
                <a href="/profile" className="hover:text-white transition">Profile</a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition">About</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Expense Tracker. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            Made with ❤️ for better financial management
          </p>
        </div>
      </div>
    </footer>
  )
}
