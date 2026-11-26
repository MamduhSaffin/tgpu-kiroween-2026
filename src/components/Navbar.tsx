import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import clsx from 'clsx'

const NAV_LINKS = [
  { to: '/directory', label: 'Directory' },
  { to: '/match', label: 'Find Matches' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/register', label: 'Register' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-tgpu-navy/95 backdrop-blur-xl text-white shadow-lg border-b border-emerald-400/15 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="https://raw.githubusercontent.com/MamduhSaffin/tgpugulf-match-os/16e181e583715698bea9b545efb0541f1345e396/public/gulf-advisory-logo.webp" alt="TGPU Gulf Advisory" className="w-10 h-10 object-contain bg-white rounded-lg p-1 shrink-0" />
            <span className="font-bold text-xl tracking-tight text-white">MatchOS</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-emerald-300 text-emerald-950'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-navigation" className="md:hidden border-t border-white/10 px-4 pb-4 pt-2 space-y-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-tgpu-gold text-tgpu-navy'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
