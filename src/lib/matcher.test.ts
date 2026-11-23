import { describe, expect, it } from 'vitest'
import { COMPANIES } from '../data/companies'
import { computeMatches } from './matcher'

describe('computeMatches', () => {
  it('returns deterministic ranks and total scores from 0 to 100', () => {
    const source = COMPANIES.find(company => company.id === 'my-001')!
    const first = computeMatches(source, COMPANIES)
    const second = computeMatches(source, COMPANIES)

    expect(first).toEqual(second)
    expect(first.length).toBeGreaterThan(0)
    expect(first.map(match => match.totalScore)).toEqual(
      first.map(match => match.totalScore).sort((a, b) => b - a)
    )
    first.forEach(match => {
      expect(match.totalScore).toBeGreaterThanOrEqual(0)
      expect(match.totalScore).toBeLessThanOrEqual(100)
      expect(match.factors.reduce((sum, factor) => sum + factor.score, 0)).toBe(match.totalScore)
      expect(match.mismatches.length).toBeGreaterThan(0)
      expect(match.recommendedNextAction).not.toBe('')
    })
  })

  it('excludes the source company and same-role candidates', () => {
    const source = COMPANIES.find(company => company.id === 'my-001')!
    const matches = computeMatches(source, COMPANIES)
    expect(matches.some(match => match.company.id === source.id)).toBe(false)
    expect(matches.some(match => match.company.role === 'exporter')).toBe(false)
  })

  it('returns a direct market and partnership explanation for a strong candidate', () => {
    const source = COMPANIES.find(company => company.id === 'my-001')!
    const candidate = COMPANIES.find(company => company.id === 'uae-001')!
    const match = computeMatches(source, [source, candidate])[0]

    expect(match.company.id).toBe(candidate.id)
    expect(match.marketRelevance).toContain('UAE')
    expect(match.factors.find(factor => factor.label === 'Market Overlap')?.score).toBeGreaterThan(0)
  })
})
