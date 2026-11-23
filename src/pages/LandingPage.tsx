import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Globe, Search, BarChart3, Shield, Users } from 'lucide-react'
import { COMPANIES } from '../data/companies'

const STATS = [
  { label: 'Demo Companies', value: `${COMPANIES.length}+` },
  { label: 'GCC Countries', value: '6' },
  { label: 'Industry Sectors', value: '10' },
  { label: 'Match Factors', value: '6' },
]

const FEATURES = [
  {
    icon: Search,
    title: 'Partner Discovery',
    desc: 'Search and filter Malaysian exporters and GCC buyers by sector, country, and partnership type.',
  },
  {
    icon: Zap,
    title: 'Transparent Matching',
    desc: 'A transparent weighted-rule engine scores compatibility across six factors and explains every recommendation.',
  },
  {
    icon: BarChart3,
    title: 'Explainable Scores',
    desc: 'Every match comes with a 0–100 score and a plain-language breakdown of why it works.',
  },
  {
    icon: Globe,
    title: 'GCC Coverage',
    desc: 'UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, and Oman — all six GCC markets in one place.',
  },
  {
    icon: Users,
    title: 'Partnership Enquiries',
    desc: 'Send a partnership enquiry directly from the match results page and track it in your dashboard.',
  },
  {
    icon: Shield,
    title: 'No Account Required',
    desc: 'Register your company profile and shortlist matches — everything saves locally in your browser.',
  },
]

export default function LandingPage() {
  const featured = COMPANIES.filter(c => c.featured).slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-tgpu-navy via-tgpu-blue to-tgpu-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-tgpu-gold/20 border border-tgpu-gold/30 rounded-full px-4 py-1.5 text-tgpu-gold text-sm font-medium mb-6">
              <Zap size={14} /> AWS KiroWeen 2026 Hackathon Prototype
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Connect Malaysian Exporters with{' '}
              <span className="text-tgpu-gold">GCC Partners</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              TGPU GCC Match uses transparent rule-based matching to help Malaysian businesses discover
              distributors, buyers, and strategic partners across the Gulf Cooperation Council.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/match"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-tgpu-gold text-tgpu-navy font-bold rounded-xl hover:bg-amber-400 transition-colors text-base"
              >
                Find My Matches <ArrowRight size={18} />
              </Link>
              <Link
                to="/directory"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20 text-base"
              >
                Browse Directory
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-tgpu-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-tgpu-navy">{s.value}</div>
                <div className="text-tgpu-navy/70 text-sm font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need to find the right partner</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Built for the TGPU KiroWeen 2026 hackathon to demonstrate how transparent tooling can accelerate
              Malaysian export market development.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-100 hover:border-tgpu-gold/40 hover:shadow-sm transition-all">
                <div className="w-11 h-11 rounded-xl bg-tgpu-navy flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-tgpu-gold" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured companies */}
      <section className="py-16 bg-tgpu-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Companies</h2>
              <p className="text-sm text-gray-500 mt-1">Fictional demonstration data — not real businesses</p>
            </div>
            <Link to="/directory" className="text-tgpu-blue text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(company => (
              <Link
                key={company.id}
                to={`/directory/${company.id}`}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: company.logoColor }}
                  >
                    {company.logoInitials}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-tgpu-blue transition-colors line-clamp-1">
                      {company.name}
                    </div>
                    <div className="text-xs text-gray-500">{company.country} · {company.sector}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{company.tagline}</p>
                <div className="mt-3 flex items-center gap-1 text-tgpu-blue text-xs font-medium">
                  View profile <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-tgpu-navy text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your GCC partner?</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Register your company profile and let the matching engine surface the most compatible
            distributors, buyers, and strategic partners across the GCC.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-tgpu-gold text-tgpu-navy font-bold rounded-xl hover:bg-amber-400 transition-colors"
            >
              Register Your Company
            </Link>
            <Link
              to="/match"
              className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              Try Demo Matching
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
