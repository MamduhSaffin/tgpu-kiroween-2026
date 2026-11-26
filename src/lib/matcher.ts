/**
 * TGPU GCC Match – Rule-Based Matching Engine
 *
 * This is a transparent, weighted rule engine. It is NOT a trained machine-learning
 * model. Scores are deterministic and fully explainable. Each factor is documented.
 *
 * Scoring breakdown (total 100 pts):
 *   Sector compatibility  – 30 pts
 *   Product fit           – 20 pts
 *   Market overlap        – 15 pts
 *   Partnership alignment – 10 pts
 *   Export readiness      – 15 pts
 *   Certification fit     – 10 pts
 */

import type { Company, Sector, Country } from '../data/companies'

export interface ScoreFactor {
  label: string
  score: number
  maxScore: number
  explanation: string
}

export interface MatchResult {
  company: Company
  totalScore: number
  grade: 'Excellent' | 'Strong' | 'Good' | 'Fair'
  factors: ScoreFactor[]
  summary: string
  mismatches: string[]
  marketRelevance: string
  commercialOpportunity: string
  recommendedNextAction: string
}

function listed<T extends string>(values: T[] | undefined): T[] {
  return Array.isArray(values)
    ? values.filter(value => typeof value === 'string' && value.trim().length > 0)
    : []
}

function labelKey(value: string): string {
  return value.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, ' ')
}

function sharedLabels(first: string[], second: string[]): string[] {
  const keys = new Set(listed(first).map(labelKey))
  return [...new Map(listed(second).map(value => [labelKey(value), value.trim()])).entries()]
    .filter(([key]) => keys.has(key))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, label]) => label)
}

const ROLES = new Set(['exporter', 'distributor', 'buyer', 'both'])

function marketPair(a: Company, b: Company) {
  if (a.role === 'exporter' || (a.role === 'both' && b.role !== 'exporter' && (b.role !== 'both' || a.id < b.id))) return { supplier: a, recipient: b }
  return { supplier: b, recipient: a }
}

// ── Sector compatibility matrix ──────────────────────────────────────────────
// Sectors that complement each other but aren't identical score partial points.
const SECTOR_AFFINITY: Partial<Record<Sector, Sector[]>> = {
  'Food & Beverage': ['Palm Oil & Oleochemicals', 'Halal Cosmetics'],
  'Palm Oil & Oleochemicals': ['Food & Beverage', 'Halal Cosmetics', 'Chemicals', 'Rubber & Plastics'],
  'Halal Cosmetics': ['Food & Beverage', 'Palm Oil & Oleochemicals'],
  'Medical Devices': ['Rubber & Plastics', 'Chemicals'],
  'Electronics & Electrical': ['Machinery & Equipment'],
  'Rubber & Plastics': ['Medical Devices', 'Machinery & Equipment', 'Palm Oil & Oleochemicals'],
  'Machinery & Equipment': ['Electronics & Electrical', 'Rubber & Plastics'],
  'Timber & Furniture': [],
  'Textiles & Apparel': ['Halal Cosmetics'],
  'Chemicals': ['Palm Oil & Oleochemicals', 'Rubber & Plastics', 'Medical Devices'],
}

function scoreSector(a: Company, b: Company): ScoreFactor {
  const MAX = 30
  if (a.sector && a.sector === b.sector && Object.prototype.hasOwnProperty.call(SECTOR_AFFINITY, a.sector)) {
    return {
      label: 'Sector Match',
      score: MAX,
      maxScore: MAX,
      explanation: `Both operate in ${a.sector} – direct sector alignment.`,
    }
  }
  const affinityA = Object.prototype.hasOwnProperty.call(SECTOR_AFFINITY, a.sector) ? SECTOR_AFFINITY[a.sector] ?? [] : []
  const affinityB = Object.prototype.hasOwnProperty.call(SECTOR_AFFINITY, b.sector) ? SECTOR_AFFINITY[b.sector] ?? [] : []
  if (affinityA.includes(b.sector) || affinityB.includes(a.sector)) {
    return {
      label: 'Sector Match',
      score: 20,
      maxScore: MAX,
      explanation: `${a.sector} and ${b.sector} are complementary sectors with meaningful supply-chain overlap.`,
    }
  }
  return {
    label: 'Sector Match',
    score: 0,
    maxScore: MAX,
    explanation: `${a.sector} and ${b.sector} do not have strong sector alignment.`,
  }
}

// ── Product fit ──────────────────────────────────────────────────────────────
function scoreProducts(a: Company, b: Company): ScoreFactor {
  const MAX = 20
  const normalize = (s: string) => labelKey(s).replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
  const wordsA = new Set(listed(a.products).flatMap(p => normalize(p).split(' ')))
  const wordsB = new Set(listed(b.products).flatMap(p => normalize(p).split(' ')))
  const stopwords = new Set(['and', 'for', 'of', 'the', 'in', 'a', 'an', '&'])
  wordsA.forEach(w => { if (!w || stopwords.has(w)) wordsA.delete(w) })
  wordsB.forEach(w => { if (!w || stopwords.has(w)) wordsB.delete(w) })

  const intersection = [...wordsA].filter(w => wordsB.has(w))
  if (!wordsA.size || !wordsB.size) {
    return { label: 'Product Fit', score: 0, maxScore: MAX, explanation: 'One or both profiles lack usable product details.' }
  }
  const union = new Set([...wordsA, ...wordsB])
  const jaccard = union.size > 0 ? intersection.length / union.size : 0
  const raw = Math.round(jaccard * MAX * 3) // amplify sparse overlap
  const score = Math.min(raw, MAX)

  if (score >= 20) {
    return { label: 'Product Fit', score, maxScore: MAX, explanation: `Strong product overlap detected (shared terms: ${intersection.slice(0, 3).join(', ')}).` }
  } else if (score >= 10) {
    return { label: 'Product Fit', score, maxScore: MAX, explanation: `Moderate product compatibility (some shared terms: ${intersection.slice(0, 2).join(', ')}).` }
  } else if (score > 0) {
    return { label: 'Product Fit', score, maxScore: MAX, explanation: `Limited product overlap – supplementary fit possible.` }
  }
  return { label: 'Product Fit', score: 0, maxScore: MAX, explanation: `Product lines do not appear to overlap directly.` }
}

// ── Market overlap ───────────────────────────────────────────────────────────
function scoreMarkets(a: Company, b: Company): ScoreFactor {
  const MAX = 15
  const { supplier, recipient } = marketPair(a, b)
  const supplierMarkets = listed(supplier.targetMarkets)
  const recipientMarkets = listed(recipient.targetMarkets)
  const setA = new Set<Country>(supplierMarkets)
  const overlap = [...new Set(recipientMarkets.filter(m => setA.has(m) && m !== recipient.country))].sort()
  const directHit = Boolean(recipient.country && setA.has(recipient.country))

  const score = Math.min(
    (directHit ? 12 : 0) + overlap.length * 4,
    MAX
  )

  const marketNames = [...new Set([...(directHit ? [recipient.country] : []), ...overlap])]

  if (score >= 12) {
    return { label: 'Market Overlap', score, maxScore: MAX, explanation: `Strong geographic alignment in ${marketNames.join(', ')}.${directHit ? ` ${recipient.name} is based in a market targeted by ${supplier.name}.` : ''}` }
  } else if (score >= 8) {
    return { label: 'Market Overlap', score, maxScore: MAX, explanation: `Partial market overlap in ${marketNames.join(', ')}.` }
  } else if (score > 0) {
    return { label: 'Market Overlap', score, maxScore: MAX, explanation: `Minimal market overlap – some geographic adjacency exists.` }
  }
  return { label: 'Market Overlap', score: 0, maxScore: MAX, explanation: `No shared target markets identified.` }
}

// ── Partnership alignment ────────────────────────────────────────────────────
function scorePartnership(a: Company, b: Company): ScoreFactor {
  const MAX = 10
  const common = sharedLabels(a.partnershipTypes, b.partnershipTypes)
  const score = Math.min(common.length * 7, MAX)

  if (score >= 10) {
    return { label: 'Partnership Fit', score, maxScore: MAX, explanation: `Excellent alignment – both seek: ${common.join(', ')}.` }
  } else if (score >= 7) {
    return { label: 'Partnership Fit', score, maxScore: MAX, explanation: `Good partnership fit – common type: ${common.join(', ')}.` }
  }
  return { label: 'Partnership Fit', score: 0, maxScore: MAX, explanation: `Different preferred partnership models. Negotiation may be needed.` }
}

function scoreReadiness(a: Company): ScoreFactor {
  const MAX = 15
  const levels = { 'Established exporter': 15, Exporting: 11, Planning: 7 }
  const readiness = a.exportReadiness
  const directReadiness = readiness && Object.prototype.hasOwnProperty.call(levels, readiness) ? levels[readiness] : undefined
  const capacity = typeof a.commercialCapacity === 'string' && a.commercialCapacity.trim()
  const documentedCapacity = capacity && labelKey(capacity) !== 'not disclosed'
  const score = directReadiness === undefined ? 0 : directReadiness - (documentedCapacity ? 0 : 3)

  return {
    label: 'Export Readiness',
    score,
    maxScore: MAX,
    explanation: directReadiness !== undefined && readiness
      ? `${a.name} reports ${readiness.toLowerCase()} status. ${documentedCapacity ? `Stated capacity: ${capacity}.` : 'Capacity has not been disclosed.'}`
      : 'Export readiness was not specified; verify sample, volume, and delivery capability directly.',
  }
}

function scoreCertification(a: Company, b: Company): ScoreFactor {
  const MAX = 10
  const common = sharedLabels(a.certifications, b.certifications)
  return {
    label: 'Certification Alignment',
    score: common.length ? Math.min(MAX, 5 + common.length * 2) : 0,
    maxScore: MAX,
    explanation: common.length
      ? `Both profiles list ${common.join(', ')}. Verify issuer, validity, product scope, and destination-market acceptance.`
      : 'No shared credentials are documented. Ask for applicable certificates and verify destination-market requirements.',
  }
}

// ── Grade helper ─────────────────────────────────────────────────────────────
function grade(score: number): MatchResult['grade'] {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Strong'
  if (score >= 40) return 'Good'
  return 'Fair'
}

// ── Summary generator ────────────────────────────────────────────────────────
function buildSummary(b: Company, total: number, factors: ScoreFactor[]): string {
  const strongest = [...factors].sort((x, y) => y.score / y.maxScore - x.score / x.maxScore)
    .find(factor => factor.score > 0)
  return strongest
    ? `${b.name} is a ${grade(total).toLowerCase()} match. ${strongest.explanation}`
    : `${b.name} has no documented alignment across the six scoring factors.`
}

function buildMismatches(a: Company, b: Company, factors: ScoreFactor[]): string[] {
  const [sector, products, markets, partnership, readiness, certifications] = factors
  const risks: string[] = []
  if (sector.score < sector.maxScore) risks.push('Check whether the companies serve the same customer segment.')
  if (products.score < 10) risks.push('Confirm product specifications and whether the partner has demand for them.')
  const { supplier, recipient } = marketPair(a, b)
  if (!listed(supplier.targetMarkets).includes(recipient.country)) {
    risks.push(`${supplier.name} has not listed ${recipient.country} as a target market.`)
  }
  if (!markets.score) risks.push('Validate local demand and the proposed route to market.')
  if (!partnership.score) risks.push('Confirm a workable partnership model before discussing terms.')
  if (readiness.score < 11) risks.push('Confirm sample availability, lead times, and minimum order volumes.')
  if (!certifications.score) risks.push('Request current certificates and check the required approvals.')
  return risks.length ? risks : ['Confirm commercial terms, available capacity, and applicable approvals directly.']
}

function buildOpportunity(a: Company, b: Company): string {
  const common = sharedLabels(a.partnershipTypes, b.partnershipTypes)
  const { supplier, recipient } = marketPair(a, b)
  return common.length
    ? `Explore ${common.map(label => label.toLowerCase()).join(' or ')} with ${recipient.name} in ${recipient.country}.`
    : `Ask ${recipient.name} what it sources in ${recipient.country} and whether ${supplier.name} can meet that demand.`
}

function buildNextAction(total: number): string {
  if (total >= 80) return 'Arrange a structured discovery call; verify product fit, volumes, commercial terms, and applicable market requirements.'
  if (total >= 60) return 'Qualify the opportunity with a short capability and market-request briefing before committing resources.'
  if (total >= 40) return 'Use exploratory outreach to clarify the sector, partnership model, and certification gaps.'
  return 'Treat this as a low-priority lead until direct market demand and a workable partnership model are confirmed.'
}

// ── Main export ──────────────────────────────────────────────────────────────
export function computeMatches(source: Company, candidates: Company[]): MatchResult[] {
  if (!source?.id || !source.name || !ROLES.has(source.role)) return []
  const seen = new Set([source.id])
  const pool = candidates.filter(candidate => {
    if (!candidate?.id || !candidate.name || !ROLES.has(candidate.role) || seen.has(candidate.id)) return false
    const hasSupplier = source.role === 'exporter' || candidate.role === 'exporter'
    const hasRecipient = ['buyer', 'distributor'].includes(source.role) || ['buyer', 'distributor'].includes(candidate.role)
    if (source.role !== 'both' && candidate.role !== 'both' && !(hasSupplier && hasRecipient)) return false
    seen.add(candidate.id)
    return true
  })

  return pool
    .map(candidate => {
      const f1 = scoreSector(source, candidate)
      const f2 = scoreProducts(source, candidate)
      const f3 = scoreMarkets(source, candidate)
      const f4 = scorePartnership(source, candidate)
      const f5 = scoreReadiness(source)
      const f6 = scoreCertification(source, candidate)
      const factors = [f1, f2, f3, f4, f5, f6]
      const total = factors.reduce((s, f) => s + f.score, 0)
      const mismatches = buildMismatches(source, candidate, factors)
      const marketRelevance = f3.explanation
      const recommendedNextAction = buildNextAction(total)
      return {
        company: candidate,
        totalScore: total,
        grade: grade(total),
        factors,
        summary: buildSummary(candidate, total, factors),
        mismatches,
        marketRelevance,
        commercialOpportunity: buildOpportunity(source, candidate),
        recommendedNextAction,
      } satisfies MatchResult
    })
    .sort((a, b) => b.totalScore - a.totalScore || a.company.name.localeCompare(b.company.name) || a.company.id.localeCompare(b.company.id))
}
