import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-tgpu-navy text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-3" aria-label="MatchOS home">
              <img src="/match-logo.svg" alt="TGPU Match" className="w-10 h-10 object-contain bg-white rounded-lg p-1" />
              <span className="font-bold text-white">MatchOS</span>
            </Link>
            <p className="text-sm leading-relaxed">
              A TGPU Legacy demonstration of rule-based matching between
              Malaysian exporters and GCC distributors.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/directory', 'Directory'], ['/match', 'Find Matches'], ['/dashboard', 'Dashboard'], ['/register', 'Register']].map(([to, label]) => (
                <li key={to}><Link to={to} className="inline-block py-2 hover:text-tgpu-gold transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Disclaimer</h4>
            <p className="text-sm leading-relaxed">
              All companies shown are <strong className="text-gray-300">fictional demonstration data</strong> created
              for hackathon purposes only. Matching scores are produced by a transparent rule-based engine,
              not a trained AI model. No real partnerships are implied.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>© 2026 MatchOS – AWS KiroWeen 2026 Prototype</p>
          <p className="text-tgpu-gold font-medium">Built with React · Vite · Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}
