# TGPU GCC Match – AWS KiroWeen 2026

> Explainable business matching connecting Malaysian exporters with GCC distributors, buyers, and strategic partners.

**Hackathon:** AWS KiroWeen 2026  
**Team:** TGPU  
**Status:** Working prototype · runs entirely in the browser · no backend or paid services required

---

## Quick Start

```bash
git clone https://github.com/MamduhSaffin/tgpu-kiroween-2026.git
cd tgpu-kiroween-2026
npm ci
npm run dev
```

Open `http://localhost:5173` (or the Codespaces forwarded URL — see below).

### GitHub Codespaces

1. Open the repository in a Codespace.
2. Run `npm ci && npm run dev` in the terminal.
3. When Vite starts on port **5173**, Codespaces shows a **"Open in Browser"** toast — click it.  
   Alternatively: go to the **Ports** tab (bottom panel), find port 5173, and click the globe icon.

---

## Features

| Feature | Detail |
|---|---|
| Landing page | Hero, stats, featured companies, CTA |
| Company directory | 16 fictional companies; searchable and filterable by country, sector, role, products, and descriptions |
| Rule-based matching | Weighted engine scores every candidate 0–100 with an explainable six-factor breakdown |
| Match explanations | Each recommendation includes a plain-language explanation of *why* it matches |
| Company profiles | Full detail pages: about, products, certifications, contact, top matches |
| Partnership enquiry | In-app enquiry form saved to localStorage (demo only — no email sent) |
| Shortlist / Dashboard | Bookmark companies; view shortlist, enquiries, and registered profiles |
| Registration form | Add your own company; it enters the matching pool immediately |
| Responsive design | Works on desktop, tablet, and mobile |

---

## Architecture

```
tgpu-kiroween-2026/
├── src/
│   ├── data/
│   │   └── companies.ts        # 16 fictional company profiles + localStorage keys
│   ├── lib/
│   │   ├── matcher.ts          # Rule-based scoring engine (6 factors → 0-100)
│   │   └── storage.ts          # localStorage helpers (shortlist, inquiries, custom companies)
│   ├── components/
│   │   ├── Layout.tsx           # Navbar + Footer shell
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── CompanyCard.tsx      # Card used in directory and dashboard
│   │   ├── MatchCard.tsx        # Card used in matching results
│   │   ├── ScoreBreakdown.tsx   # Score ring + factor bars
│   │   └── InquiryModal.tsx     # Partnership enquiry modal
│   └── pages/
│       ├── LandingPage.tsx
│       ├── DirectoryPage.tsx
│       ├── MatchPage.tsx
│       ├── DashboardPage.tsx
│       ├── RegisterPage.tsx
│       └── CompanyDetailPage.tsx
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

**Tech stack:** React 18 · Vite 8 · TypeScript 5 · Tailwind CSS 3 · React Router 7 · Lucide React

---

## Matching Engine

The engine is a **transparent weighted-rule system** — not a trained machine-learning model. Every score is fully deterministic and explainable.

| Factor | Weight | Logic |
|---|---|---|
| Sector compatibility | 30 pts | Exact match = 30; complementary sectors = 20 |
| Product fit | 20 pts | Amplified Jaccard similarity, capped at 20 |
| Market overlap | 15 pts | Direct market hit = 12; shared markets = 4 each, capped at 15 |
| Partnership alignment | 10 pts | 7 per distinct shared type, capped at 10 |
| Export readiness | 15 pts | Selected profile readiness and stated capacity. An undisclosed readiness level scores zero. |
| Certification alignment | 10 pts | Distinct shared certification labels, matched without regard to case or repeated spaces. Verify applicability independently. |

**Grade bands:** Excellent ≥ 80 · Strong ≥ 60 · Good ≥ 40 · Fair < 40

Exporters match with buyers and distributors. A dual-role company can participate on either side. Market and certification evidence stays consistent when a pair is viewed in reverse. Export readiness is based on the selected profile. Missing evidence scores zero.

---

## Data

All 16 companies are **entirely fictional** and created for demonstration purposes only. They do not represent real businesses, real partnerships, or verified commercial relationships. Contact details use the reserved `example.invalid` domain.

Companies are split as:
- **8 Malaysian exporters** — Food & Beverage, Palm Oil, Medical Devices, Electronics, Halal Cosmetics, Timber & Furniture, Rubber & Plastics, Textiles
- **8 GCC distributors/buyers** — UAE (×2), Saudi Arabia (×2), Qatar, Kuwait, Bahrain, Oman

User-registered companies are stored in `localStorage` under key `tgpu_gcc_match_custom_companies` and participate in matching immediately.

---

## Limitations

- **Not real AI.** The matching engine is a hand-crafted rule system, not a trained model. Scores reflect rule alignment, not genuine business compatibility.
- **Demo data only.** No real company information is used. Do not make business decisions based on this prototype.
- **No backend.** All data lives in the browser. Clearing localStorage resets shortlists, enquiries, and registered profiles.
- **No authentication.** Anyone using the same browser can see the same localStorage data.
- **No email delivery.** The enquiry form stores messages locally only.
- **Demo reset.** Use **Dashboard → Reset demo data** to clear registered profiles, shortlists, and enquiries before a presentation.
- **Client-only routing.** The selected matching profile is stored in the URL. Sample profiles can be shared. Registered profiles are available on the browser where they were created.

---

## Suggested Demo Script (under 3 minutes)

| Time | Action |
|---|---|
| 0:00 | Open the landing page. Point out the KiroWeen branding, the stat bar (16 companies, 6 GCC countries), and the Featured Companies section. |
| 0:30 | Navigate to **Directory**. Show search and filters — filter by UAE, then by Food & Beverage sector. |
| 1:00 | Click **Find Matches** on *NusaPure Foods*. The matching engine runs and returns ranked results for all GCC candidates. |
| 1:20 | On the match results, expand the top match to show the **score breakdown** — six factor bars with plain-language explanations. Point out the "rule-based prototype, not trained AI" disclaimer. |
| 1:40 | Click **Enquire** on the top match. Fill in the modal and submit. Show the success state ("saved to localStorage"). |
| 2:00 | Navigate to **Dashboard**. Show the shortlist count, the saved enquiry, and the stats cards. |
| 2:20 | Navigate to **Register**. Fill in a new fictional company. Submit, then click "Find My Matches" to see the new company in the matching engine. |
| 2:50 | Wrap up: highlight zero infrastructure cost, fully explainable scoring, and the path to productionising (real company DB, trained ML model, auth, email). |

---

## Kiro CLI Usage

This prototype was built using **Kiro CLI** (AWS KiroWeen 2026):

- Kiro reviewed the empty repository and proposed the architecture before writing any code.
- Kiro wrote all source files in a single structured pass: data layer → matching engine → components → pages.
- Kiro caught and fixed a TypeScript unused-import error (`Trash2`) before the build succeeded.
- Kiro confirmed the build output (`vite build` producing `dist/`) before starting the dev server.

Kiro operates within the repository only — no external deployments, no paid services, and no modification of production systems.

See [SUBMISSION.md](SUBMISSION.md) for the initial Kiro commit and the tracked evidence still needed for Devpost.

---

## Available Scripts

```bash
npm run dev       # Start dev server on 0.0.0.0:5173
npm run build     # TypeScript check + production build to dist/
npm run preview   # Serve the production build locally on 0.0.0.0:4173
npm run typecheck # TypeScript validation
npm test          # Vitest unit tests
npx playwright install chromium
npm run test:browser # Run browser tests against the built Worker
```

`npm run build` runs unit tests before compiling. GitHub Actions also validates installation, types, Worker packaging, dependencies, and Chromium user journeys. Run the build before starting browser tests.

## Deployment and rollback

Cloudflare Workers Builds watches `main` for the existing `tgpu-kiroween-2026` Worker. It runs `npm run build` and then deploys the compiled assets with the checked-in Wrangler configuration. The Worker serves the SPA and needs no environment variables or database bindings. The existing Pages deployment also serves this repository.

For a source rollback, revert the release merge through a PR and allow Workers Builds to redeploy the resulting `main` commit. For an immediate runtime rollback, use the Worker’s **Deployments** tab to roll back to the last verified version, then reconcile `main`. Worker rollback does not change local browser data.
