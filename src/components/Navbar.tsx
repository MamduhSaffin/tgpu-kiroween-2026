import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Zap } from 'lucide-react'
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
            <div className="w-9 h-9 rounded-lg bg-tgpu-gold flex items-center justify-center">
              <Zap size={20} className="text-tgpu-navy" />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-base tracking-wide text-white">Match</span>
              <span className="text-tgpu-gold font-bold text-base ml-1">OS</span>
            </div>
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
