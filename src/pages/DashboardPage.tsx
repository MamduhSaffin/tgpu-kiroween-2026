import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Send, BarChart3, Users, MessageSquare, Zap } from 'lucide-react'
import { COMPANIES } from '../data/companies'
import { getCustomCompanies, getShortlist, toggleShortlist, getInquiries } from '../lib/storage'
import CompanyCard from '../components/CompanyCard'

export default function DashboardPage() {
  const [shortlist, setShortlist] = useState<string[]>(getShortlist)
  const inquiries = getInquiries()
  const allCompanies = useMemo(() => [...COMPANIES, ...getCustomCompanies()], [])

  const shortlisted = allCompanies.filter(c => shortlist.includes(c.id))
  const customCompanies = getCustomCompanies()

  function handleToggle(id: string) {
    setShortlist(toggleShortlist(id))
  }

  const stats = [
    { icon: Bookmark, label: 'Shortlisted', value: shortlisted.length, color: 'text-tgpu-gold' },
    { icon: Send, label: 'Enquiries Sent', value: inquiries.length, color: 'text-blue-500' },
    { icon: Users, label: 'My Profiles', value: customCompanies.length, color: 'text-emerald-500' },
    { icon: BarChart3, label: 'Total Companies', value: allCompanies.length, color: 'text-purple-500' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Shortlisted partners, sent enquiries, and registered profiles — all stored locally.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <s.icon size={22} className={s.color} />
            <div className="text-3xl font-bold text-gray-900 mt-2">{s.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Shortlisted */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Bookmark size={18} className="text-tgpu-gold" /> Shortlisted Partners
          </h2>
          <Link to="/directory" className="text-sm text-tgpu-blue hover:underline">Browse more →</Link>
        </div>
        {shortlisted.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
            <Bookmark size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No shortlisted companies yet.</p>
            <p className="text-sm mt-1">Use the bookmark icon on any company card to save it here.</p>
            <Link to="/directory" className="mt-3 inline-block text-sm text-tgpu-blue hover:underline">Go to Directory →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shortlisted.map(company => (
              <CompanyCard
                key={company.id}
                company={company}
                shortlisted
                onToggleShortlist={handleToggle}
              />
            ))}
          </div>
        )}
      </section>

      {/* Enquiries */}
      <section className="mb-10">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <MessageSquare size={18} className="text-blue-500" /> Sent Enquiries
        </h2>
        {inquiries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
            <Send size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No enquiries sent yet.</p>
            <p className="text-sm mt-1">Use the "Enquire" button on the matching page to send a partnership enquiry.</p>
            <Link to="/match" className="mt-3 inline-block text-sm text-tgpu-blue hover:underline">Go to Matching →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {inquiries.map(inq => {
              const toCompany = allCompanies.find(c => c.id === inq.toCompanyId)
              const fromCompany = allCompanies.find(c => c.id === inq.fromCompanyId)
              return (
                <div key={inq.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {toCompany && (
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ backgroundColor: toCompany.logoColor }}
                        >
                          {toCompany.logoInitials}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          To: {toCompany?.name ?? inq.toCompanyId}
                        </div>
                        {fromCompany && (
                          <div className="text-xs text-gray-500">From: {fromCompany.name}</div>
                        )}
                        <div className="text-xs text-gray-400 mt-0.5">
                          {new Date(inq.sentAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium flex-shrink-0">
                      Demo — not sent
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 leading-relaxed line-clamp-3 border-t border-gray-50 pt-3">
                    {inq.message}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Registered profiles */}
      {customCompanies.length > 0 && (
        <section>
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Users size={18} className="text-emerald-500" /> Your Registered Profiles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {customCompanies.map(company => (
              <CompanyCard
                key={company.id}
                company={company}
                shortlisted={shortlist.includes(company.id)}
                onToggleShortlist={handleToggle}
              />
            ))}
          </div>
        </section>
      )}

      {/* Find matches CTA */}
      <div className="mt-10 bg-gradient-to-r from-tgpu-navy to-tgpu-blue rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Zap size={18} className="text-tgpu-gold" /> Ready to find more partners?
          </h3>
          <p className="text-gray-300 text-sm mt-1">Run the matching engine against all 16 demo companies.</p>
        </div>
        <Link
          to="/match"
          className="px-6 py-3 bg-tgpu-gold text-tgpu-navy font-bold rounded-xl hover:bg-amber-400 transition-colors whitespace-nowrap"
        >
          Go to Matching →
        </Link>
      </div>
    </div>
  )
}
