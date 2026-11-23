import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Zap, Info } from 'lucide-react'
import { COMPANIES } from '../data/companies'
import type { Company } from '../data/companies'
import { getCustomCompanies, getShortlist, toggleShortlist } from '../lib/storage'
import { computeMatches } from '../lib/matcher'
import MatchCard from '../components/MatchCard'
import InquiryModal from '../components/InquiryModal'

export default function MatchPage() {
  const location = useLocation()
  const preselectedId = (location.state as { companyId?: string } | null)?.companyId

  const allCompanies = useMemo(() => [...COMPANIES, ...getCustomCompanies()], [])
  const [selectedId, setSelectedId] = useState<string>(preselectedId ?? allCompanies[0]?.id ?? '')
  const [shortlist, setShortlist] = useState<string[]>(getShortlist)
  const [inquireTarget, setInquireTarget] = useState<Company | null>(null)

  useEffect(() => {
    if (preselectedId) setSelectedId(preselectedId)
  }, [preselectedId])

  const selectedCompany = allCompanies.find(c => c.id === selectedId) ?? null
  const matches = useMemo(
    () => (selectedCompany ? computeMatches(selectedCompany, allCompanies) : []),
    [selectedCompany, allCompanies]
  )

  function handleToggle(id: string) {
    setShortlist(toggleShortlist(id))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Zap size={22} className="text-tgpu-gold" /> AI-Assisted Matching
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Select a company to see its ranked GCC partner recommendations with score explanations.
        </p>
      </div>

      {/* Prototype notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex gap-3 text-sm text-blue-800">
        <Info size={18} className="flex-shrink-0 mt-0.5" />
        <div>
          <strong>Rule-based prototype, not a trained AI model.</strong> Scores are computed by a transparent
          weighted-rule engine across four factors: sector compatibility, product fit, market overlap, and
          partnership alignment. Each recommendation includes a plain-language explanation.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company selector */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
            <h2 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Select Company</h2>
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
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
        <div className="lg:col-span-2 space-y-4">
          {matches.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Zap size={40} className="mx-auto mb-3 opacity-20" />
              <p>Select a company to see matches.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">{matches.length}</span> potential partners found
                </p>
                <span className="text-xs text-gray-400">Sorted by compatibility score</span>
              </div>
              {matches.map((result, i) => (
                <MatchCard
                  key={result.company.id}
                  result={result}
                  rank={i + 1}
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
