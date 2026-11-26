import { COMPANIES, LOCALSTORAGE_KEY_COMPANIES, LOCALSTORAGE_KEY_SHORTLIST, LOCALSTORAGE_KEY_INQUIRIES } from '../data/companies'
import type { Company } from '../data/companies'

function companyKey(company: Company): string {
  return [company.country, company.name.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, ' ')].join(':')
}

function isStoredCompany(value: unknown): value is Company {
  if (typeof value !== 'object' || value === null) return false
  const company = value as Partial<Company>
  return (
    typeof company.id === 'string' && /^[\w-]+$/.test(company.id) &&
    typeof company.name === 'string' && Boolean(company.name.trim()) &&
    typeof company.tagline === 'string' &&
    ['exporter', 'buyer', 'distributor', 'both'].some(role => role === company.role) &&
    typeof company.sector === 'string' &&
    typeof company.country === 'string' &&
    typeof company.city === 'string' &&
    typeof company.annualRevenue === 'string' &&
    typeof company.employees === 'string' &&
    Number.isInteger(company.established) &&
    typeof company.description === 'string' &&
    typeof company.contactName === 'string' &&
    typeof company.contactEmail === 'string' &&
    typeof company.logoInitials === 'string' &&
    typeof company.logoColor === 'string' &&
    typeof company.featured === 'boolean' &&
    Array.isArray(company.products) &&
    company.products.every(item => typeof item === 'string') &&
    Array.isArray(company.partnershipTypes) &&
    company.partnershipTypes.every(item => typeof item === 'string') &&
    Array.isArray(company.targetMarkets) &&
    company.targetMarkets.every(item => typeof item === 'string') &&
    Array.isArray(company.certifications) &&
    company.certifications.every(item => typeof item === 'string')
  )
}

// ── Custom companies ─────────────────────────────────────────────────────────
export function getCustomCompanies(): Company[] {
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_KEY_COMPANIES)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    const ids = new Set(COMPANIES.map(company => company.id))
    const names = new Set(COMPANIES.map(companyKey))
    return parsed.filter(isStoredCompany).filter(company => {
      const key = companyKey(company)
      if (ids.has(company.id) || names.has(key)) return false
      ids.add(company.id)
      names.add(key)
      return true
    })
  } catch {
    return []
  }
}

export function saveCustomCompany(company: Company): void {
  if (!isStoredCompany(company)) throw new Error('Invalid company profile.')
  const existing = getCustomCompanies()
  if ([...COMPANIES, ...existing].some(candidate =>
    (candidate.id !== company.id || COMPANIES.includes(candidate)) && companyKey(candidate) === companyKey(company)
  )) throw new Error('A company with this name is already registered in this country.')
  if (COMPANIES.some(candidate => candidate.id === company.id)) throw new Error('Invalid company profile.')
  const updated = [...existing.filter(c => c.id !== company.id), company]
  localStorage.setItem(LOCALSTORAGE_KEY_COMPANIES, JSON.stringify(updated))
}

// ── Shortlist ────────────────────────────────────────────────────────────────
export function getShortlist(): string[] {
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_KEY_SHORTLIST)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return [...new Set(parsed.filter((id): id is string => typeof id === 'string' && id.length > 0))]
  } catch {
    return []
  }
}

export function toggleShortlist(id: string): string[] {
  const current = getShortlist()
  const next = current.includes(id) ? current.filter(i => i !== id) : [...current, id]
  localStorage.setItem(LOCALSTORAGE_KEY_SHORTLIST, JSON.stringify(next))
  return next
}

export function isShortlisted(id: string): boolean {
  return getShortlist().includes(id)
}

// ── Inquiries ────────────────────────────────────────────────────────────────
export interface Inquiry {
  id: string
  fromCompanyId: string
  toCompanyId: string
  message: string
  sentAt: string
}

export function getInquiries(): Inquiry[] {
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_KEY_INQUIRIES)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed)
      ? parsed.filter((inquiry): inquiry is Inquiry => (
        typeof inquiry === 'object' &&
        inquiry !== null &&
        typeof (inquiry as Inquiry).id === 'string' &&
        typeof (inquiry as Inquiry).fromCompanyId === 'string' &&
        typeof (inquiry as Inquiry).toCompanyId === 'string' &&
        typeof (inquiry as Inquiry).message === 'string' &&
        typeof (inquiry as Inquiry).sentAt === 'string'
      ))
      : []
  } catch {
    return []
  }
}

export function saveInquiry(inquiry: Omit<Inquiry, 'id' | 'sentAt'>): Inquiry {
  const message = inquiry.message.trim()
  if (message.length < 20 || message.length > 2000) throw new Error('Enter a message between 20 and 2,000 characters.')
  if (!inquiry.fromCompanyId || !inquiry.toCompanyId || inquiry.fromCompanyId === inquiry.toCompanyId) {
    throw new Error('Choose a different company to enquire about.')
  }
  const existing = getInquiries()
  const full: Inquiry = {
    ...inquiry,
    id: `inq-${crypto.randomUUID()}`,
    message,
    sentAt: new Date().toISOString(),
  }
  localStorage.setItem(LOCALSTORAGE_KEY_INQUIRIES, JSON.stringify([...existing, full]))
  return full
}

export function clearDemoData(): void {
  localStorage.removeItem(LOCALSTORAGE_KEY_COMPANIES)
  localStorage.removeItem(LOCALSTORAGE_KEY_SHORTLIST)
  localStorage.removeItem(LOCALSTORAGE_KEY_INQUIRIES)
}
