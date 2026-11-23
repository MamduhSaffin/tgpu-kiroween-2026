import { LOCALSTORAGE_KEY_COMPANIES, LOCALSTORAGE_KEY_SHORTLIST, LOCALSTORAGE_KEY_INQUIRIES } from '../data/companies'
import type { Company } from '../data/companies'

// ── Custom companies ─────────────────────────────────────────────────────────
export function getCustomCompanies(): Company[] {
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_KEY_COMPANIES)
    return raw ? (JSON.parse(raw) as Company[]) : []
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
    return raw ? (JSON.parse(raw) as string[]) : []
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
    return raw ? (JSON.parse(raw) as Inquiry[]) : []
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
