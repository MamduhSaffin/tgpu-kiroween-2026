import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Users, Calendar, Award, Mail, ArrowLeft, Bookmark, BookmarkCheck, Zap, Send } from 'lucide-react'
import { COMPANIES } from '../data/companies'
import { getCustomCompanies, getShortlist, toggleShortlist } from '../lib/storage'
import { computeMatches } from '../lib/matcher'
import InquiryModal from '../components/InquiryModal'
import clsx from 'clsx'
import type { Company } from '../data/companies'

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [shortlist, setShortlist] = useState<string[]>(getShortlist)
  const [inquireTarget, setInquireTarget] = useState<Company | null>(null)

  const allCompanies = useMemo(() => [...COMPANIES, ...getCustomCompanies()], [])
  const company = allCompanies.find(c => c.id === id)

  const topMatches = useMemo(
    () => (company ? computeMatches(company, allCompanies).slice(0, 3) : []),
    [company, allCompanies]
  )

  if (!company) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-500">
        <p className="mb-4">Company not found.</p>
        <Link to="/directory" className="text-tgpu-blue hover:underline">← Back to Directory</Link>
      </div>
    )
  }

  const shortlisted = shortlist.includes(company.id)

  function handleToggle() {
    setShortlist(toggleShortlist(company!.id))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main profile */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
                style={{ backgroundColor: company.logoColor }}
              >
                {company.logoInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{company.name}</h1>
                    <p className="text-gray-500 text-sm mt-0.5">{company.tagline}</p>
                  </div>
                  <button
                    onClick={handleToggle}
                    className={clsx(
                      'flex-shrink-0 p-2 rounded-xl transition-colors',
                      shortlisted ? 'text-tgpu-gold bg-amber-50' : 'text-gray-400 hover:text-tgpu-gold hover:bg-amber-50'
                    )}
                    title={shortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                  >
                    {shortlisted ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-tgpu-navy/10 text-tgpu-navy capitalize">{company.role}</span>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">{company.sector}</span>
                  {company.featured && <span className="text-xs font-medium px-3 py-1 rounded-full bg-tgpu-gold/20 text-yellow-800">Featured</span>}
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-50 pt-5">
              <InfoItem icon={MapPin} label="Location" value={`${company.city}, ${company.country}`} />
              <InfoItem icon={Users} label="Employees" value={company.employees} />
              <InfoItem icon={Calendar} label="Established" value={String(company.established)} />
              <InfoItem icon={Mail} label="Revenue" value={company.annualRevenue} />
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-3">About</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{company.description}</p>
          </div>

          {/* Products */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-3">Products & Services</h2>
            <div className="flex flex-wrap gap-2">
              {company.products.map(p => (
                <span key={p} className="text-sm bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1 rounded-xl">{p}</span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          {company.certifications.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Award size={16} /> Certifications</h2>
              <div className="flex flex-wrap gap-2">
                {company.certifications.map(cert => (
                  <span key={cert} className="text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full">{cert}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Contact */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">Contact</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <div className="font-medium">{company.contactName}</div>
              <div className="text-gray-500 text-xs">{company.contactEmail}</div>
            </div>
            <button
              onClick={() => setInquireTarget(company)}
              className="mt-4 w-full py-2.5 bg-tgpu-navy text-white text-sm font-semibold rounded-xl hover:bg-tgpu-blue transition-colors flex items-center justify-center gap-2"
            >
              <Send size={14} /> Send Partnership Enquiry
            </button>
          </div>

          {/* Partnership types */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Partnership Interests</h3>
            <div className="flex flex-wrap gap-2">
              {company.partnershipTypes.map(pt => (
                <span key={pt} className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800">{pt}</span>
              ))}
            </div>
          </div>

          {/* Target markets */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Target Markets</h3>
            <div className="flex flex-wrap gap-2">
              {company.targetMarkets.map(m => (
                <span key={m} className="text-xs font-medium px-2.5 py-1 rounded-full bg-tgpu-gold/20 text-yellow-800">{m}</span>
              ))}
            </div>
          </div>

          {/* Top matches preview */}
          {topMatches.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide flex items-center gap-1.5">
                <Zap size={14} className="text-tgpu-gold" /> Top Matches
              </h3>
              <div className="space-y-3">
                {topMatches.map(m => (
                  <Link
                    key={m.company.id}
                    to={`/directory/${m.company.id}`}
                    className="flex items-center gap-2.5 group"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: m.company.logoColor }}
                    >
                      {m.company.logoInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-800 group-hover:text-tgpu-blue transition-colors line-clamp-1">{m.company.name}</div>
                      <div className="text-xs text-gray-400">{m.company.country}</div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        m.totalScore >= 80 ? 'bg-emerald-100 text-emerald-800' :
                        m.totalScore >= 60 ? 'bg-blue-100 text-blue-800' :
                        m.totalScore >= 40 ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>{m.totalScore}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <button
                onClick={() => navigate(`/match?company=${encodeURIComponent(company.id)}`)}
                className="mt-3 w-full py-2 text-xs font-medium text-tgpu-blue hover:bg-blue-50 rounded-xl transition-colors"
              >
                See all matches →
              </button>
            </div>
          )}
        </div>
      </div>

      {inquireTarget && (
        <InquiryModal from={null} to={inquireTarget} onClose={() => setInquireTarget(null)} />
      )}
    </div>
  )
}

function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-xs text-gray-400 mb-0.5"><Icon size={11} /> {label}</div>
      <div className="text-sm font-medium text-gray-800 leading-tight">{value}</div>
    </div>
  )
}
