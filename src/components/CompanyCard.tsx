import { Link } from 'react-router-dom'
import { Bookmark, BookmarkCheck, MapPin, Building2 } from 'lucide-react'
import clsx from 'clsx'
import type { Company } from '../data/companies'

interface Props {
  company: Company
  shortlisted: boolean
  onToggleShortlist: (id: string) => void
  showMatchButton?: boolean
  onMatch?: (company: Company) => void
}

const ROLE_LABEL: Record<Company['role'], string> = {
  exporter: 'Exporter',
  distributor: 'Distributor',
  buyer: 'Buyer',
  both: 'Exporter / Distributor',
}

const ROLE_COLOR: Record<Company['role'], string> = {
  exporter: 'bg-blue-100 text-blue-800',
  distributor: 'bg-emerald-100 text-emerald-800',
  buyer: 'bg-purple-100 text-purple-800',
  both: 'bg-amber-100 text-amber-800',
}

export default function CompanyCard({ company, shortlisted, onToggleShortlist, showMatchButton, onMatch }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      {/* Header */}
      <div className="p-5 pb-3 flex items-start gap-4">
        {/* Logo avatar */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ backgroundColor: company.logoColor }}
        >
          {company.logoInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/directory/${company.id}`}
              className="font-semibold text-gray-900 hover:text-tgpu-blue line-clamp-2 leading-tight transition-colors"
            >
              {company.name}
            </Link>
            <button
              type="button"
              onClick={() => onToggleShortlist(company.id)}
              aria-label={shortlisted ? `Remove ${company.name} from shortlist` : `Add ${company.name} to shortlist`}
              className={clsx(
                'flex-shrink-0 p-1.5 rounded-lg transition-colors',
                shortlisted ? 'text-tgpu-gold bg-amber-50' : 'text-gray-400 hover:text-tgpu-gold hover:bg-amber-50'
              )}
              title={shortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
            >
              {shortlisted ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{company.tagline}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="px-5 py-3 flex flex-wrap gap-2">
        <span className={clsx('text-xs font-medium px-2.5 py-1 rounded-full', ROLE_COLOR[company.role])}>
          {ROLE_LABEL[company.role]}
        </span>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
          {company.sector}
        </span>
        {company.featured && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-tgpu-gold/20 text-yellow-800">
            Featured
          </span>
        )}
      </div>

      {/* Location & employees */}
      <div className="px-5 py-2 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><MapPin size={12} />{company.city}, {company.country}</span>
        <span className="flex items-center gap-1"><Building2 size={12} />{company.employees} employees</span>
      </div>

      {/* Products */}
      <div className="px-5 py-3">
        <div className="flex flex-wrap gap-1.5">
          {company.products.slice(0, 3).map(p => (
            <span key={p} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md">
              {p}
            </span>
          ))}
          {company.products.length > 3 && (
            <span className="text-xs text-gray-400 px-1 py-0.5">+{company.products.length - 3} more</span>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-5 py-3 mt-auto border-t border-gray-50 flex gap-2">
        <Link
          to={`/directory/${company.id}`}
          className="flex-1 text-center text-sm font-medium py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View Profile
        </Link>
        {showMatchButton && onMatch && (
          <button
            onClick={() => onMatch(company)}
            className="flex-1 text-sm font-medium py-2 rounded-xl bg-tgpu-navy text-white hover:bg-tgpu-blue transition-colors"
          >
            Find Matches
          </button>
        )}
      </div>
    </div>
  )
}
