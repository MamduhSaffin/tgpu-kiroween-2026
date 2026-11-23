import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { saveCustomCompany } from '../lib/storage'
import type { Company, Sector, Country, PartnershipType, Role } from '../data/companies'

const SECTORS: Sector[] = ['Food & Beverage', 'Palm Oil & Oleochemicals', 'Rubber & Plastics', 'Electronics & Electrical', 'Medical Devices', 'Halal Cosmetics', 'Machinery & Equipment', 'Timber & Furniture', 'Textiles & Apparel', 'Chemicals']
const COUNTRIES: Country[] = ['Malaysia', 'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman']
const PARTNERSHIP_TYPES: PartnershipType[] = ['Distribution Agreement', 'Joint Venture', 'OEM Supply', 'Agency Representation', 'Strategic Investment', 'Franchise', 'Direct Import']
const ROLES: Role[] = ['exporter', 'distributor', 'buyer', 'both']
const LOGO_COLORS = ['#1E6B4F', '#1565C0', '#C9A84C', '#AD1457', '#6A1B9A', '#00695C', '#4E342E', '#1B5E20', '#0A1628']
const CURRENT_YEAR = new Date().getFullYear()

const INITIAL_FORM = {
  name: '',
  tagline: '',
  role: 'exporter' as Role,
  sector: 'Food & Beverage' as Sector,
  country: 'Malaysia' as Country,
  city: '',
  products: '',
  partnershipTypes: [] as PartnershipType[],
  targetMarkets: [] as Country[],
  description: '',
  contactName: '',
  contactEmail: '',
  annualRevenue: '',
  employees: '',
  established: '',
  certifications: '',
  logoColor: LOGO_COLORS[0],
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [savedCompanyId, setSavedCompanyId] = useState('')
  const [error, setError] = useState('')

  const [form, setForm] = useState(INITIAL_FORM)

  function set(field: string, value: unknown) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function toggleArray<T>(arr: T[], value: T): T[] {
    return arr.includes(value) ? arr.filter(i => i !== value) : [...arr, value]
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Company name is required.'); return }
    if (form.name.trim().length < 2 || form.name.trim().length > 120) {
      setError('Company name must be between 2 and 120 characters.'); return
    }
    if (!form.city.trim()) { setError('City is required.'); return }
    if (form.city.trim().length > 80) { setError('City must be 80 characters or fewer.'); return }
    const products = form.products.split(',').map(s => s.trim()).filter(Boolean)
    if (products.length === 0) { setError('Please list at least one product.'); return }
    if (products.length > 20 || products.some(product => product.length > 80)) {
      setError('List up to 20 products, with each product no longer than 80 characters.'); return
    }
    if (form.partnershipTypes.length === 0) { setError('Select at least one partnership type.'); return }
    if (form.targetMarkets.length === 0) { setError('Select at least one target market.'); return }
    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail.trim())) {
      setError('Enter a valid contact email address.'); return
    }
    if (form.established) {
      const year = Number(form.established)
      if (!Number.isInteger(year) || year < 1800 || year > CURRENT_YEAR) {
        setError(`Established year must be between 1800 and ${CURRENT_YEAR}.`); return
      }
    }
    if (form.employees && (!/^\d+$/.test(form.employees.trim()) || Number(form.employees) < 1)) {
      setError('Employees must be a positive whole number.'); return
    }

    const initials = form.name.trim().split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')

    const company: Company = {
      id: `custom-${Date.now()}`,
      name: form.name.trim(),
      tagline: form.tagline.trim() || `${form.sector} ${form.role} based in ${form.city}`,
      role: form.role,
      sector: form.sector,
      products,
      country: form.country,
      city: form.city.trim(),
      partnershipTypes: form.partnershipTypes,
      targetMarkets: form.targetMarkets,
      annualRevenue: form.annualRevenue || 'Not disclosed',
      employees: form.employees || 'Not disclosed',
      established: parseInt(form.established) || new Date().getFullYear(),
      certifications: form.certifications.split(',').map(s => s.trim()).filter(Boolean),
      description: form.description.trim() || `${form.name} is a ${form.role} in the ${form.sector} sector.`,
      contactName: form.contactName.trim() || 'Contact',
      contactEmail: form.contactEmail.trim() || 'contact@example.com',
      logoInitials: initials || '??',
      logoColor: form.logoColor,
      featured: false,
    }

    saveCustomCompany(company)
    setSavedCompanyId(company.id)
    setSaved(true)
  }

  if (saved) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <CheckCircle size={56} className="text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Registered!</h2>
        <p className="text-gray-500 mb-6">Your company profile has been saved to localStorage and will appear in the directory and matching engine.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(`/match?company=${encodeURIComponent(savedCompanyId)}`)}
            className="px-6 py-3 bg-tgpu-navy text-white font-semibold rounded-xl hover:bg-tgpu-blue transition-colors"
          >
            Find My Matches
          </button>
          <button
            onClick={() => { setSaved(false); setError(''); setForm(INITIAL_FORM) }}
            className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Register Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Register Your Company</h1>
        <p className="text-gray-500 text-sm mt-1">Your profile is saved locally in your browser and used by the matching engine.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
        ⓘ Demo prototype — data is stored in localStorage only. No account is created and no data is transmitted.
      </div>

      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Company Details</h3>
          <Field label="Company Name *">
            <input required value={form.name} onChange={e => set('name', e.target.value)} className={INPUT} placeholder="e.g. Acme Foods Sdn Bhd" />
          </Field>
          <Field label="Tagline">
            <input value={form.tagline} onChange={e => set('tagline', e.target.value)} className={INPUT} placeholder="One-sentence description of your business" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Role *">
              <select value={form.role} onChange={e => set('role', e.target.value)} className={INPUT}>
                {ROLES.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
              </select>
            </Field>
            <Field label="Sector *">
              <select value={form.sector} onChange={e => set('sector', e.target.value)} className={INPUT}>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Country *">
              <select value={form.country} onChange={e => set('country', e.target.value)} className={INPUT}>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="City *">
              <input required value={form.city} onChange={e => set('city', e.target.value)} className={INPUT} placeholder="e.g. Kuala Lumpur" />
            </Field>
          </div>
          <Field label="Products / Services (comma-separated) *">
            <input value={form.products} onChange={e => set('products', e.target.value)} className={INPUT} placeholder="e.g. Frozen meals, Instant noodles, Sauces" />
          </Field>
          <Field label="Description">
            <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className={INPUT + ' resize-none'} placeholder="Brief company overview…" />
          </Field>
        </div>

        {/* Partnership preferences */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Partnership Preferences</h3>
          <Field label="Partnership Types * (select all that apply)">
            <div className="flex flex-wrap gap-2">
              {PARTNERSHIP_TYPES.map(pt => (
                <button
                  key={pt} type="button"
                  onClick={() => set('partnershipTypes', toggleArray(form.partnershipTypes, pt))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors font-medium ${form.partnershipTypes.includes(pt) ? 'bg-tgpu-navy text-white border-tgpu-navy' : 'bg-white text-gray-600 border-gray-200 hover:border-tgpu-navy'}`}
                >
                  {pt}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Target Markets * (select all that apply)">
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map(c => (
                <button
                  key={c} type="button"
                  onClick={() => set('targetMarkets', toggleArray(form.targetMarkets, c))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors font-medium ${form.targetMarkets.includes(c) ? 'bg-tgpu-gold text-tgpu-navy border-tgpu-gold' : 'bg-white text-gray-600 border-gray-200 hover:border-tgpu-gold'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* Contact & extras */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Contact & Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Contact Name">
              <input value={form.contactName} onChange={e => set('contactName', e.target.value)} className={INPUT} placeholder="Full name" />
            </Field>
            <Field label="Contact Email">
              <input type="email" value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} className={INPUT} placeholder="email@company.com" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Annual Revenue">
              <input value={form.annualRevenue} onChange={e => set('annualRevenue', e.target.value)} className={INPUT} placeholder="e.g. RM 50M" />
            </Field>
            <Field label="Employees">
              <input value={form.employees} onChange={e => set('employees', e.target.value)} className={INPUT} placeholder="e.g. 200" />
            </Field>
            <Field label="Est. Year">
              <input type="number" value={form.established} onChange={e => set('established', e.target.value)} className={INPUT} placeholder="2010" />
            </Field>
          </div>
          <Field label="Certifications (comma-separated)">
            <input value={form.certifications} onChange={e => set('certifications', e.target.value)} className={INPUT} placeholder="e.g. ISO 9001, JAKIM Halal, CE Mark" />
          </Field>
          <Field label="Logo Colour">
            <div className="flex gap-2 flex-wrap">
              {LOGO_COLORS.map(c => (
                <button
                  key={c} type="button"
                  onClick={() => set('logoColor', c)}
                  aria-label={`Choose logo colour ${c}`}
                  aria-pressed={form.logoColor === c}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-lg transition-transform ${form.logoColor === c ? 'ring-2 ring-offset-2 ring-tgpu-gold scale-110' : 'hover:scale-105'}`}
                />
              ))}
            </div>
          </Field>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-tgpu-navy text-white font-bold rounded-xl hover:bg-tgpu-blue transition-colors text-base"
        >
          Register Company
        </button>
      </form>
    </div>
  )
}

const INPUT = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tgpu-navy/20 focus:border-tgpu-navy bg-white transition'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}
