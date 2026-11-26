import clsx from 'clsx'
import type { MatchResult } from '../lib/matcher'

interface Props {
  result: MatchResult
  expanded?: boolean
}

const GRADE_STYLES: Record<MatchResult['grade'], string> = {
  Excellent: 'bg-emerald-500',
  Strong: 'bg-emerald-600',
  Good: 'bg-amber-500',
  Fair: 'bg-gray-400',
}

const GRADE_TEXT: Record<MatchResult['grade'], string> = {
  Excellent: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  Strong: 'text-emerald-800 bg-emerald-50 border-emerald-300',
  Good: 'text-amber-700 bg-amber-50 border-amber-200',
  Fair: 'text-gray-600 bg-gray-50 border-gray-200',
}

export default function ScoreBreakdown({ result, expanded = false }: Props) {
  const pct = result.totalScore

  return (
    <div className="space-y-3">
      {/* Score ring + grade */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg aria-hidden="true" viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E5E7EB" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke={pct >= 80 ? '#10B981' : pct >= 60 ? '#047857' : pct >= 40 ? '#F59E0B' : '#9CA3AF'}
              strokeWidth="3"
              pathLength="100"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800">
            {pct}<span className="sr-only"> out of 100</span>
          </span>
        </div>
        <div>
          <span className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full border', GRADE_TEXT[result.grade])}>
            {result.grade} Match
          </span>
          <p className="text-xs text-gray-500 mt-1.5 leading-snug max-w-xs">{result.summary}</p>
        </div>
      </div>

      {/* Factor bars */}
      {expanded && (
        <div className="space-y-2.5">
          {result.factors.map(f => {
            const factorPct = Math.round((f.score / f.maxScore) * 100)
            return (
              <div key={f.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-700">{f.label}</span>
                  <span className="text-xs text-gray-500">{f.score}/{f.maxScore}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={clsx('h-full rounded-full transition-all', GRADE_STYLES[result.grade])}
                    style={{ width: `${factorPct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-tight">{f.explanation}</p>
              </div>
            )
          })}
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-2">
            <p className="text-xs text-gray-700"><strong>Market relevance</strong> · {result.marketRelevance}</p>
            <p className="text-xs text-gray-700"><strong>Commercial opportunity</strong> · {result.commercialOpportunity}</p>
            {result.mismatches.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-700">Gaps and risks</p>
                <ul className="mt-1 list-disc pl-4 space-y-0.5">
                  {result.mismatches.map(item => <li key={item} className="text-xs text-gray-500">{item}</li>)}
                </ul>
              </div>
            )}
            <p className="text-xs text-gray-700"><strong>Recommended next action</strong> · {result.recommendedNextAction}</p>
          </div>
        </div>
      )}

    </div>
  )
}
