import { useState, useMemo } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Zap, Info, Download, Printer } from 'lucide-react'
import { COMPANIES } from '../data/companies'
import type { Company } from '../data/companies'
import { getCustomCompanies, getShortlist, toggleShortlist } from '../lib/storage'
import { computeMatches } from '../lib/matcher'
import type { MatchResult } from '../lib/matcher'
import MatchCard from '../components/MatchCard'
import InquiryModal from '../components/InquiryModal'

export default function MatchPage() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const preselectedId = (location.state as { companyId?: string } | null)?.companyId

  const allCompanies = useMemo(() => [...COMPANIES, ...getCustomCompanies()], [])
  const requestedId = searchParams.get('company') ?? preselectedId
  const requestedCompany = allCompanies.find(company => company.id === requestedId)
  const selectedCompany = requestedCompany ?? allCompanies[0]
  const [shortlist, setShortlist] = useState<string[]>(getShortlist)
  const [inquireTarget, setInquireTarget] = useState<Company | null>(null)
  const [gradeFilter, setGradeFilter] = useState<'All' | MatchResult['grade']>('All')
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'country'>('score')
  const [error, setError] = useState('')
  const matches = useMemo(
    () => (selectedCompany ? computeMatches(selectedCompany, allCompanies) : []),
    [selectedCompany, allCompanies]
  )
  const visibleMatches = useMemo(() => {
    const filtered = gradeFilter === 'All' ? [...matches] : matches.filter(match => match.grade === gradeFilter)
    return filtered.sort((a, b) => {
      if (sortBy === 'name') return a.company.name.localeCompare(b.company.name)
      if (sortBy === 'country') return a.company.country.localeCompare(b.company.country)
      return b.totalScore - a.totalScore || a.company.name.localeCompare(b.company.name)
    })
  }, [matches, gradeFilter, sortBy])

  function handleToggle(id: string) {
    try {
      setShortlist(toggleShortlist(id))
      setError('')
    } catch {
      setError('Could not update the shortlist. Check that browser storage is available.')
    }
  }

  const ranks = new Map(matches.map((match, index) => [match.company.id, index + 1]))

  function exportSummary() {
    if (!selectedCompany) return
    const header = ['Rank', 'Company', 'Country', 'Sector', 'Score', 'Grade', 'Next action']
    const rows = visibleMatches.map(match => [
      String(ranks.get(match.company.id)),
      match.company.name,
      match.company.country,
      match.company.sector,
      String(match.totalScore),
      match.grade,
      match.recommendedNextAction,
    ])
    const csv = [header, ...rows]
      .map(row => row.map(value => {
        const safeValue = /^[\s]*[=+@-]|^[\t\r\n]/.test(value) ? "'" + value : value
        return `"${safeValue.replace(/"/g, '""')}"`
      }).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `gcc-match-${selectedCompany.id}.csv`
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Zap size={22} className="text-tgpu-gold" /> Partner Matching
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Select a company to see its ranked GCC partner recommendations with score explanations.
        </p>
      </div>

      {/* Prototype notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex gap-3 text-sm text-blue-800">
        <Info size={18} className="flex-shrink-0 mt-0.5" />
        <div>
          <strong>Deterministic compatibility scoring.</strong> Scores are computed by a transparent
          weighted-rule engine across six factors: sector compatibility, product fit, market overlap, partnership alignment, export readiness, and certification alignment. Each recommendation includes a plain-language explanation.
        </div>
      </div>

      {requestedId && !requestedCompany && <p role="status" className="mb-4 text-sm text-amber-800">The requested profile is unavailable in this browser. Showing the sample exporter instead.</p>}
      {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company selector */}
        <div className="min-w-0 lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
            <h2 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Select Company</h2>
            <select
              aria-label="Company to match"
              value={selectedCompany.id}
              onChange={e => {
                const id = e.target.value
                setSearchParams({ company: id })
              }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tgpu-navy/20 bg-white mb-4"
            >
              {allCompanies.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.country})</option>
              ))}
            </select>

            {selectedCompany && (
              <div className="space-y-3">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: selectedCompany.logoColor }}
                >
                  {selectedCompany.logoInitials}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{selectedCompany.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{selectedCompany.city}, {selectedCompany.country}</div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs bg-tgpu-navy/10 text-tgpu-navy px-2 py-0.5 rounded-full font-medium">
                    {selectedCompany.sector}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                    {selectedCompany.role}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{selectedCompany.tagline}</p>
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Products / Services</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedCompany.products.map(p => (
                      <span key={p} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md">{p}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Target Markets</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedCompany.targetMarkets.map(m => (
                      <span key={m} className="text-xs bg-tgpu-gold/20 text-yellow-800 px-2 py-0.5 rounded-md">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Match results */}
        <div className="min-w-0 lg:col-span-2 space-y-4">
          {matches.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Zap size={40} className="mx-auto mb-3 opacity-20" />
              <p>No complementary companies are available for this profile.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">{visibleMatches.length}</span> potential partners found
                </p>
                <div className="flex flex-wrap gap-2">
                  <select
                    aria-label="Filter matches by grade"
                    value={gradeFilter}
                    onChange={e => setGradeFilter(e.target.value as typeof gradeFilter)}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white"
                  >
                    <option>All</option>
                    <option>Excellent</option>
                    <option>Strong</option>
                    <option>Good</option>
                    <option>Fair</option>
                  </select>
                  <select
                    aria-label="Sort matches"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white"
                  >
                    <option value="score">Highest score</option>
                    <option value="name">Company name</option>
                    <option value="country">Country</option>
                  </select>
                  <button type="button" onClick={exportSummary} className="inline-flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white hover:bg-gray-50">
                    <Download size={13} /> Export
                  </button>
                  <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white hover:bg-gray-50">
                    <Printer size={13} /> Print
                  </button>
                </div>
              </div>
              {visibleMatches.length === 0 && (
                <p role="status" className="rounded-xl bg-white p-5 text-sm text-gray-600">
                  No partners have this grade. <button className="underline" onClick={() => setGradeFilter('All')}>Show all grades</button>
                </p>
              )}
              {visibleMatches.map(result => (
                <MatchCard
                  key={selectedCompany.id + ":" + result.company.id}
                  result={result}
                  rank={ranks.get(result.company.id)!}
                  shortlisted={shortlist.includes(result.company.id)}
                  onToggleShortlist={handleToggle}
                  onInquire={c => setInquireTarget(c)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {inquireTarget && (
        <InquiryModal
          from={selectedCompany}
          to={inquireTarget}
          onClose={() => setInquireTarget(null)}
        />
      )}
    </div>
  )
}
