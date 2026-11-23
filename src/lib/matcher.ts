/**
 * TGPU GCC Match – Rule-Based Matching Engine
 *
 * This is a transparent, weighted rule engine. It is NOT a trained machine-learning
 * model. Scores are deterministic and fully explainable. Each factor is documented.
 *
 * Scoring breakdown (total 100 pts):
 *   Sector compatibility  – 40 pts
 *   Product fit           – 25 pts
 *   Market overlap        – 20 pts
 *   Partnership alignment – 15 pts
 */

import type { Company, Sector, Country, PartnershipType } from '../data/companies'

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
  const MAX = 40
  if (a.sector === b.sector) {
    return {
      label: 'Sector Match',
      score: MAX,
      maxScore: MAX,
      explanation: `Both operate in ${a.sector} – direct sector alignment.`,
    }
  }
  const affinityA = SECTOR_AFFINITY[a.sector] ?? []
  const affinityB = SECTOR_AFFINITY[b.sector] ?? []
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
  const MAX = 25
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const wordsA = new Set(a.products.flatMap(p => normalize(p).split(' ')))
  const wordsB = new Set(b.products.flatMap(p => normalize(p).split(' ')))
  const stopwords = new Set(['and', 'for', 'of', 'the', 'in', 'a', 'an', '&'])
  wordsA.forEach(w => { if (stopwords.has(w)) wordsA.delete(w) })
  wordsB.forEach(w => { if (stopwords.has(w)) wordsB.delete(w) })

  const intersection = [...wordsA].filter(w => wordsB.has(w))
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
  const MAX = 20
  // Find countries that appear in both companies' target market lists
  const setA = new Set<Country>([a.country, ...a.targetMarkets])
  const overlap = [...new Set(b.targetMarkets.filter(m => setA.has(m)))]
  // Also check that b operates in a market a is targeting
  const directHit = a.targetMarkets.includes(b.country)

  const score = Math.min(
    (directHit ? 12 : 0) + overlap.length * 4,
    MAX
  )

  const marketNames = [...new Set([...(directHit ? [b.country] : []), ...overlap])]

  if (score >= 16) {
    return { label: 'Market Overlap', score, maxScore: MAX, explanation: `Strong geographic alignment – shared markets: ${marketNames.join(', ')}.` }
  } else if (score >= 8) {
    return { label: 'Market Overlap', score, maxScore: MAX, explanation: `Partial market overlap in ${marketNames.join(', ')}.` }
  } else if (score > 0) {
    return { label: 'Market Overlap', score, maxScore: MAX, explanation: `Minimal market overlap – some geographic adjacency exists.` }
  }
  return { label: 'Market Overlap', score: 0, maxScore: MAX, explanation: `No shared target markets identified.` }
}

// ── Partnership alignment ────────────────────────────────────────────────────
function scorePartnership(a: Company, b: Company): ScoreFactor {
  const MAX = 15
  const setA = new Set<PartnershipType>(a.partnershipTypes)
  const common = b.partnershipTypes.filter(p => setA.has(p))
  const score = Math.min(common.length * 7, MAX)

  if (score >= 14) {
    return { label: 'Partnership Fit', score, maxScore: MAX, explanation: `Excellent alignment – both seek: ${common.join(', ')}.` }
  } else if (score >= 7) {
    return { label: 'Partnership Fit', score, maxScore: MAX, explanation: `Good partnership fit – common type: ${common.join(', ')}.` }
  }
  return { label: 'Partnership Fit', score: 0, maxScore: MAX, explanation: `Different preferred partnership models. Negotiation may be needed.` }
}

// ── Grade helper ─────────────────────────────────────────────────────────────
function grade(score: number): MatchResult['grade'] {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Strong'
  if (score >= 40) return 'Good'
  return 'Fair'
}

// ── Summary generator ────────────────────────────────────────────────────────
function buildSummary(a: Company, b: Company, total: number, factors: ScoreFactor[]): string {
  const topFactor = [...factors].sort((x, y) => y.score / y.maxScore - x.score / x.maxScore)[0]
  const g = grade(total)
  if (g === 'Excellent') {
    return `${b.name} is an excellent match for ${a.name}. The strongest signal is ${topFactor.label.toLowerCase()}, supported by complementary market presence and aligned partnership goals.`
  }
  if (g === 'Strong') {
    return `${b.name} presents a strong opportunity. ${topFactor.explanation} Further discussion on partnership terms is recommended.`
  }
  if (g === 'Good') {
    return `${b.name} shows potential. ${topFactor.explanation} Some alignment gaps exist and would benefit from direct dialogue.`
  }
  return `${b.name} is a partial match. The two businesses share limited overlap at this time, but may still find complementary value in exploratory discussions.`
}

// ── Main export ──────────────────────────────────────────────────────────────
export function computeMatches(source: Company, candidates: Company[]): MatchResult[] {
  // Exclude self; optionally exclude same-country same-role (exporter ↔ exporter not useful)
  const pool = candidates.filter(c => {
    if (c.id === source.id) return false
    // Avoid matching exporter-to-exporter or distributor-to-distributor unless both=both
    if (source.role !== 'both' && c.role !== 'both' && source.role === c.role) return false
    return true
  })

  return pool
    .map(candidate => {
      const f1 = scoreSector(source, candidate)
      const f2 = scoreProducts(source, candidate)
      const f3 = scoreMarkets(source, candidate)
      const f4 = scorePartnership(source, candidate)
      const factors = [f1, f2, f3, f4]
      const total = factors.reduce((s, f) => s + f.score, 0)
      return {
        company: candidate,
        totalScore: total,
        grade: grade(total),
        factors,
        summary: buildSummary(source, candidate, total, factors),
      } satisfies MatchResult
    })
    .sort((a, b) => b.totalScore - a.totalScore || a.company.name.localeCompare(b.company.name))
}
