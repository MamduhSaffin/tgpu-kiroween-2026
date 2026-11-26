/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from 'vitest'
import { COMPANIES, LOCALSTORAGE_KEY_COMPANIES, LOCALSTORAGE_KEY_SHORTLIST } from '../data/companies'
import {
  clearDemoData,
  getCustomCompanies,
  getInquiries,
  saveInquiry,
  getShortlist,
  saveCustomCompany,
  toggleShortlist,
} from './storage'

const memoryStorage = (() => {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, String(value)),
    removeItem: (key: string) => values.delete(key),
    clear: () => values.clear(),
  }
})()

Object.defineProperty(globalThis, 'localStorage', {
  value: memoryStorage,
  configurable: true,
})

describe('browser storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('recovers from malformed JSON', () => {
    localStorage.setItem(LOCALSTORAGE_KEY_COMPANIES, '{broken')
    localStorage.setItem(LOCALSTORAGE_KEY_SHORTLIST, 'not-json')

    expect(getCustomCompanies()).toEqual([])
    expect(getShortlist()).toEqual([])
  })

  it('filters malformed companies and duplicate ids', () => {
    localStorage.setItem(LOCALSTORAGE_KEY_COMPANIES, JSON.stringify([
      { ...COMPANIES[0], id: 'custom-example', name: 'Example Profile' },
      { ...COMPANIES[0], id: 'custom-example', name: 'Example Profile' },
      COMPANIES[0],
      { id: 'broken', name: 'Broken' },
    ]))

    const stored = getCustomCompanies()
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe('custom-example')
  })

  it('saves, deduplicates, toggles, and resets demo data', () => {
    const company = { ...COMPANIES[0], id: 'test-company', name: 'Fictional Example' }
    saveCustomCompany(company)
    saveCustomCompany(company)
    expect(getCustomCompanies()).toEqual([company])

    expect(toggleShortlist(company.id)).toEqual([company.id])
    expect(toggleShortlist(company.id)).toEqual([])
    expect(getShortlist()).toEqual([])

    clearDemoData()
    expect(getCustomCompanies()).toEqual([])
  })

  it('rejects duplicate company names in the same country even when spacing and case differ', () => {
    const company = { ...COMPANIES[0], id: 'test-1', name: 'Test Example' }
    saveCustomCompany(company)
    expect(() => saveCustomCompany({ ...company, id: 'test-2', name: ' test   EXAMPLE ' }))
      .toThrow('already registered')
    expect(() => saveCustomCompany({ ...COMPANIES[0], id: 'test-3' })).toThrow('already registered')
    expect(getCustomCompanies()).toEqual([company])
  })

  it('validates and persists local enquiries and resets only app data', () => {
    const request = { fromCompanyId: 'my-001', toCompanyId: 'uae-001', message: '  Please share your wholesale terms.  ' }
    expect(() => saveInquiry({ ...request, toCompanyId: request.fromCompanyId })).toThrow()
    expect(() => saveInquiry({ ...request, message: 'Too short' })).toThrow()
    const first = saveInquiry(request)
    const second = saveInquiry(request)
    expect(second.id).not.toBe(first.id)
    expect(getInquiries()).toEqual([{ ...first, message: request.message.trim() }, second])
    localStorage.setItem('unrelated', 'keep')
    clearDemoData()
    expect(getInquiries()).toEqual([])
    expect(localStorage.getItem('unrelated')).toBe('keep')
  })

  it('rejects invalid company profiles', () => {
    expect(() => saveCustomCompany({ id: 'x' } as never)).toThrow('Invalid company profile.')
  })
})
