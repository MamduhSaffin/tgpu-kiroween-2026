/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from 'vitest'
import { COMPANIES, LOCALSTORAGE_KEY_COMPANIES, LOCALSTORAGE_KEY_SHORTLIST } from '../data/companies'
import {
  clearDemoData,
  getCustomCompanies,
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
      COMPANIES[0],
      COMPANIES[0],
      { id: 'broken', name: 'Broken' },
    ]))

    const stored = getCustomCompanies()
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(COMPANIES[0].id)
  })

  it('saves, deduplicates, toggles, and resets demo data', () => {
    const company = { ...COMPANIES[0], id: 'test-company' }
    saveCustomCompany(company)
    saveCustomCompany(company)
    expect(getCustomCompanies()).toEqual([company])

    expect(toggleShortlist(company.id)).toEqual([company.id])
    expect(toggleShortlist(company.id)).toEqual([])
    expect(getShortlist()).toEqual([])

    clearDemoData()
    expect(getCustomCompanies()).toEqual([])
  })

  it('rejects invalid company profiles', () => {
    expect(() => saveCustomCompany({ id: 'x' } as never)).toThrow('Invalid company profile.')
  })
})
