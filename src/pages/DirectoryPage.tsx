import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { COMPANIES } from '../data/companies'
import type { Company } from '../data/companies'
import { getCustomCompanies, getShortlist, toggleShortlist } from '../lib/storage'
import CompanyCard from '../components/CompanyCard'

const COUNTRIES = ['All', 'Malaysia', 'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman'] as const
const ROLES = ['All', 'exporter', 'distributor', 'buyer', 'both'] as const
const SECTORS = ['All', 'Food & Beverage', 'Palm Oil & Oleochemicals', 'Rubber & Plastics', 'Electronics & Electrical', 'Medical Devices', 'Halal Cosmetics', 'Machinery & Equipment', 'Timber & Furniture', 'Textiles & Apparel', 'Chemicals'] as const

export default function DirectoryPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState<typeof COUNTRIES[number]>('All')
  const [role, setRole] = useState<typeof ROLES[number]>('All')
  const [sector, setSector] = useState<typeof SECTORS[number]>('All')
  const [shortlist, setShortlist] = useState<string[]>(getShortlist)
  const [showFilters, setShowFilters] = useState(false)

  const allCompanies = useMemo(() => [...COMPANIES, ...getCustomCompanies()], [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return allCompanies.filter(c => {
      if (country !== 'All' && c.country !== country) return false
      if (role !== 'All' && c.role !== role) return false
      if (sector !== 'All' && c.sector !== sector) return false
      if (q && ![
        c.name,
        c.sector,
        c.tagline,
        c.description,
        ...c.products,
      ].some(value => value.toLowerCase().includes(q))) return false
      return true
    })
  }, [allCompanies, query, country, role, sector])

  function handleToggle(id: string) {
    setShortlist(toggleShortlist(id))
  }

  function handleMatch(company: Company) {
    navigate(`/match?company=${encodeURIComponent(company.id)}`)
  }

  const hasFilters = country !== 'All' || role !== 'All' || sector !== 'All' || query !== ''

  function clearFilters() {
    setQuery('')
    setCountry('All')
    setRole('All')
    setSector('All')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Company Directory</h1>
        <p className="text-gray-500 text-sm mt-1">
          {allCompanies.length} fictional demo companies · {filtered.length} matching your filters
        </p>
      </div>

      {/* Search + filter toggle */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, sector, or description…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tgpu-navy/20 focus:border-tgpu-navy bg-white transition"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(f => !f)}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white"
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filters</span>
          {hasFilters && <span className="w-2 h-2 rounded-full bg-tgpu-gold" />}
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Country</label>
            <select
              value={country}
              onChange={e => setCountry(e.target.value as typeof country)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tgpu-navy/20 bg-white"
            >
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as typeof role)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tgpu-navy/20 bg-white capitalize"
            >
              {ROLES.map(r => <option key={r} className="capitalize">{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Sector</label>
            <select
              value={sector}
              onChange={e => setSector(e.target.value as typeof sector)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tgpu-navy/20 bg-white"
            >
              {SECTORS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No companies match your filters.</p>
          <button onClick={clearFilters} className="mt-2 text-sm text-tgpu-blue hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(company => (
            <CompanyCard
              key={company.id}
              company={company}
              shortlisted={shortlist.includes(company.id)}
              onToggleShortlist={handleToggle}
              showMatchButton
              onMatch={handleMatch}
            />
          ))}
        </div>
      )}
    </div>
  )
}
