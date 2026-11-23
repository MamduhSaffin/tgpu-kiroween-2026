import { LOCALSTORAGE_KEY_COMPANIES, LOCALSTORAGE_KEY_SHORTLIST, LOCALSTORAGE_KEY_INQUIRIES } from '../data/companies'
import type { Company } from '../data/companies'

function isStoredCompany(value: unknown): value is Company {
  if (typeof value !== 'object' || value === null) return false
  const company = value as Partial<Company>
  return (
    typeof company.id === 'string' &&
    typeof company.name === 'string' &&
    typeof company.tagline === 'string' &&
    typeof company.role === 'string' &&
    typeof company.sector === 'string' &&
    typeof company.country === 'string' &&
    typeof company.city === 'string' &&
    typeof company.annualRevenue === 'string' &&
    typeof company.employees === 'string' &&
    typeof company.established === 'number' &&
    typeof company.description === 'string' &&
    typeof company.contactName === 'string' &&
    typeof company.contactEmail === 'string' &&
    typeof company.logoInitials === 'string' &&
    typeof company.logoColor === 'string' &&
    typeof company.featured === 'boolean' &&
    Array.isArray(company.products) &&
    Array.isArray(company.partnershipTypes) &&
    Array.isArray(company.targetMarkets) &&
    Array.isArray(company.certifications)
  )
}

// ── Custom companies ─────────────────────────────────────────────────────────
export function getCustomCompanies(): Company[] {
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_KEY_COMPANIES)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed)
      ? parsed.filter(isStoredCompany)
      : []
  } catch {
    return []
  }
}

export function saveCustomCompany(company: Company): void {
  const existing = getCustomCompanies()
  const updated = [...existing.filter(c => c.id !== company.id), company]
  localStorage.setItem(LOCALSTORAGE_KEY_COMPANIES, JSON.stringify(updated))
}

// ── Shortlist ────────────────────────────────────────────────────────────────
export function getShortlist(): string[] {
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_KEY_SHORTLIST)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
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
  const existing = getInquiries()
  const full: Inquiry = {
    ...inquiry,
    id: `inq-${Date.now()}`,
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
