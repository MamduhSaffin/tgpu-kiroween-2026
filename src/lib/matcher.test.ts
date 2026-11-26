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

  it('credits a distributor in the exporter target country in either direction', () => {
    const exporter = { ...COMPANIES.find(c => c.id === 'my-001')!, targetMarkets: ['UAE' as const] }
    const distributor = { ...COMPANIES.find(c => c.id === 'uae-001')!, targetMarkets: [] }
    for (const [source, candidate] of [[exporter, distributor], [distributor, exporter]]) {
      const match = computeMatches(source, [candidate])[0]
      expect(match.factors.find(f => f.label === 'Market Overlap')?.score).toBe(12)
      expect(match.factors.reduce((sum, f) => sum + f.maxScore, 0)).toBe(100)
    }
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

  it('achieves the exact maximum with six fully documented factors', () => {
    const exporter = {
      ...COMPANIES[0], exportReadiness: 'Established exporter' as const, commercialCapacity: '20 cases',
      targetMarkets: ['UAE', 'Qatar'] as const,
    }
    const source = { ...exporter, targetMarkets: [...exporter.targetMarkets] }
    const candidate = { ...source, id: 'max-match', country: 'UAE' as const, role: 'buyer' as const }
    const match = computeMatches(source, [candidate])[0]
    expect(match.factors.map(factor => factor.score)).toEqual([30, 20, 15, 10, 15, 10])
    expect(match.totalScore).toBe(100)
    expect(match.grade).toBe('Excellent')
  })

  it('normalizes certifications and excludes duplicate candidates and demand-only pairings', () => {
    const exporter = { ...COMPANIES[0], certifications: ['ISO 9001'], partnershipTypes: [] }
    const buyer = {
      ...COMPANIES[8], role: 'buyer' as const, certifications: [' iso 9001 ', 'ISO   9001', 'ISO 9001'],
      targetMarkets: [],
    }
    const matches = computeMatches(exporter, [buyer, buyer])
    expect(matches).toHaveLength(1)
    expect(matches[0].factors[5].score).toBe(7)
    expect(matches[0].mismatches.join(' ')).not.toContain('Request current certificates')
    expect(computeMatches(buyer, [COMPANIES[8]])).toEqual([])
    expect(computeMatches(buyer, [exporter])[0].factors[2].score).toBe(12)
  })

  it('gives missing evidence zero points and tolerates malformed arrays', () => {
    const source = { ...COMPANIES[0], sector: 'constructor', products: null, targetMarkets: undefined,
      partnershipTypes: {}, certifications: [null], exportReadiness: undefined } as unknown as typeof COMPANIES[number]
    const candidate = { ...COMPANIES[8], sector: 'constructor' } as unknown as typeof COMPANIES[number]
    const [match] = computeMatches(source, [candidate])
    expect(match.totalScore).toBe(0)
    expect(match.grade).toBe('Fair')
    expect(match.factors.map(factor => factor.score)).toEqual([0, 0, 0, 0, 0, 0])
    expect(match.commercialOpportunity).toBeTruthy()
  })
})
