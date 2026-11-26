# MatchOS by TGPU Legacy — Kiroween 2026 GCC Match

## Elevator pitch

MatchOS helps Malaysian exporters shortlist buyers and distributors across the Gulf. Open the sample match to see a ranked list, a breakdown of every score, and the questions to ask before contacting each partner.

## Inspiration

A company directory can surface dozens of names. Exporters still have to work out which companies serve their target markets, handle their products, and want the same kind of partnership. MatchOS makes those signals visible together.

## Problem and target users

Malaysian small and midsize exporters need to screen GCC partners before spending time and money on outreach. GCC buyers, distributors, and trade advisers can also use the demo to compare possible routes to market.

## What it does

Start with the fictional NusaPure Foods profile to see ranked recommendations immediately. Each recommendation shows a compatibility score out of 100, six factor explanations, a commercial opportunity, potential gaps, certification considerations, and a suggested next step. The directory supports search and filters. Judges can also create a fictional profile, shortlist companies, compare them in the dashboard, save a practice enquiry, and export results as CSV.

## How it was built

The React application uses TypeScript and Vite, with React Router for routes and Tailwind CSS for styling. The rule engine evaluates sector compatibility (30), product fit (20), market overlap (15), partnership alignment (10), export readiness (15), and certification alignment (10). These rules produce deterministic scores based on profile details. Listed certificates are a discussion point and require verification for each product and destination.

## Kiro usage

The repository records Kiro CLI planning the initial browser-only architecture, scaffolding its profiles, scoring engine and pages, and checking the TypeScript build. The initial implementation commit records Kiro CLI as its author and lists the features it produced. [Initial Kiro CLI implementation](https://github.com/MamduhSaffin/tgpu-kiroween-2026/commit/0b2840c042a2c58d11e24fb9100543da857c9cfb)

**Evidence pending.** The public checkout has no tracked root `.kiro/` artifacts. Before entering, recover and commit any original Kiro artifacts, or complete and document a real project task using Kiro with tracked specs, hooks, or steering that were actually used. The release hardening pass does not supply additional Kiro usage claims.

## Technical architecture

Cloudflare Workers serves the compiled SPA and supports direct navigation to application routes. Profiles, bookmarks, and practice enquiries stay in the current browser’s local storage. The application has no account system, email delivery, or database connection. The 16 bundled company profiles and their business details are fictional.

## Challenges

Buyer and exporter profiles must produce consistent market explanations when viewed in either direction. Missing data and duplicate labels should never raise a score. The release tests also check that reloading a nested route preserves the selected profile and that reset removes local demo activity.

## Accomplishments

The sample match is available from the home page in one click. Users can review the scoring evidence, compare shortlisted candidates, and save an outreach draft in the same session. The project uses no paid application services.

## Lessons learned

A compatibility score is easier to act on when each factor identifies its supporting evidence and the open questions. Missing evidence should be visible to users because it changes what they need to verify before outreach.

## Future development

With validated company data and the necessary permissions, the workflow could support verified profiles, product-specific market requirements, team review, and real outreach.

## Built With

Kiro CLI, React, React Router, TypeScript, Vite, Tailwind CSS, Lucide, browser localStorage, Vitest, Playwright, Cloudflare Workers.

## Links

- [Public GitHub repository](https://github.com/MamduhSaffin/tgpu-kiroween-2026)
- [Verified public demo on the dedicated Cloudflare Worker](https://tgpu-kiroween-2026.moesaffin.workers.dev/)
- [Cloudflare Pages fallback](https://match.tgpu.my/)
- YouTube demo: pending.

## Devpost entry checklist

- Verify the root `.kiro/` artifacts and complete the Kiro write-up with the workflows that actually ran.
- Confirm the open-source license is detectable on GitHub and disclose any pre-existing project code or assets incorporated, including reused brand artwork.
- Select the category supported by the submission. Costume Contest is a candidate and requires a polished themed interface that enhances use.
- Confirm entrant eligibility and include the public YouTube demonstration. The official rules recommend a runtime under three minutes.
- Kiro credits request deadline: 2 December 2026, 4:00 AM Malaysia time. Devpost submission deadline: 5 December 2026, 6:00 AM Malaysia time. [Kiroween 2026 official rules](https://kiroween.devpost.com/rules)
