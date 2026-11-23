import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, BookmarkCheck, ChevronDown, ChevronUp, MapPin, Send } from 'lucide-react'
import clsx from 'clsx'
import type { MatchResult } from '../lib/matcher'
import ScoreBreakdown from './ScoreBreakdown'

interface Props {
  result: MatchResult
  rank: number
  shortlisted: boolean
  onToggleShortlist: (id: string) => void
  onInquire: (company: MatchResult['company']) => void
}

export default function MatchCard({ result, rank, shortlisted, onToggleShortlist, onInquire }: Props) {
  const [expanded, setExpanded] = useState(rank <= 2)
  const { company } = result

  return (
    <div className={clsx(
      'bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all',
      rank === 1 ? 'border-tgpu-gold ring-1 ring-tgpu-gold/30' : 'border-gray-100'
    )}>
      {rank === 1 && (
        <div className="bg-tgpu-gold text-tgpu-navy text-xs font-bold px-4 py-1.5 rounded-t-2xl flex items-center gap-1">
          ★ Top Match
        </div>
      )}
      <div className="p-5">
        {/* Company header */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
            style={{ backgroundColor: company.logoColor }}
          >
            {company.logoInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <Link
                to={`/directory/${company.id}`}
                className="font-semibold text-gray-900 hover:text-tgpu-blue transition-colors line-clamp-1"
              >
                {company.name}
              </Link>
              <button
                onClick={() => onToggleShortlist(company.id)}
                className={clsx(
                  'flex-shrink-0 p-1.5 rounded-lg transition-colors',
                  shortlisted ? 'text-tgpu-gold bg-amber-50' : 'text-gray-400 hover:text-tgpu-gold hover:bg-amber-50'
                )}
              >
                {shortlisted ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
              <MapPin size={11} />
              <span>{company.city}, {company.country}</span>
              <span className="text-gray-300">·</span>
              <span className="font-medium text-gray-600">{company.sector}</span>
            </div>
          </div>
        </div>

        {/* Score */}
        <ScoreBreakdown result={result} expanded={expanded} />

        {/* Toggle + actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-xs text-tgpu-blue hover:text-tgpu-navy font-medium transition-colors"
          >
            {expanded ? <><ChevronUp size={14} /> Hide detail</> : <><ChevronDown size={14} /> Show breakdown</>}
          </button>
          <div className="flex gap-2">
            <Link
              to={`/directory/${company.id}`}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Profile
            </Link>
            <button
              onClick={() => onInquire(company)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-tgpu-navy text-white hover:bg-tgpu-blue transition-colors flex items-center gap-1"
            >
              <Send size={12} /> Enquire
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
