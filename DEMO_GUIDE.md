# GCC Match Demonstration Guide

## Elevator pitch

GCC Match helps Malaysian companies explore suitable distributors, buyers, and partners across the Gulf Cooperation Council using a transparent, deterministic market-entry assessment.

## Problem

Malaysian exporters often need to compare unfamiliar markets, partner roles, product fit, certifications, and export readiness before committing time and budget to GCC outreach.

## Proposed solution

GCC Match provides a browser-based company profile, ranked partner results, factor-level explanations, market-entry guidance, shortlisting, candidate comparison, and a printable/exportable summary.

## Key differentiators

- Transparent six-factor scoring; no claim of trained AI or guaranteed outcomes
- Fictional but internally consistent Malaysian and GCC demo profiles
- Plain-language mismatch and next-action guidance
- Local-only demo workflow with no paid account or external service
- Responsive, accessible B2B interface

## Technical architecture

- React 18 and React Router
- TypeScript and Vite
- Tailwind CSS
- Deterministic rule engine in `src/lib/matcher.ts`
- Validated browser localStorage persistence
- Cloudflare Pages static deployment

## Two-minute demo walkthrough

1. Open the landing page and select **Find My Matches**.
2. Use **NusaPure Foods Sdn Bhd** as the sample Malaysian exporter.
3. Review the ranked GCC partners and compatibility grades.
4. Expand the top result to explain sector, product, market, partnership, readiness, and certification factors.
5. Read the GCC relevance, mismatch, and recommended next-action guidance.
6. Shortlist one or more candidates and open the dashboard.
7. Export or print the assessment, or register another fictional company.

## Known limitations

- Demo records are fictional and are not verified businesses.
- Matching is heuristic and must not be treated as due diligence or regulatory advice.
- Data is stored only in localStorage in the current browser.
- There is no authentication, real enquiry delivery, or production database.
- Regulatory approvals and market access require independent verification.

## Judging presentation

Lead with the export-market problem, then show the sample Malaysian company, ranked GCC results, and one detailed explanation. Emphasize transparency: every score is explainable and every recommendation is qualified. Finish with the dashboard and export actions.
