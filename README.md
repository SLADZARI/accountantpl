# AccountantPL

A lightweight, responsive **Polish-language accounting dashboard prototype** prepared for Vercel.

> **Status: DEMO / starter only.** The original test assignment was not found in the empty repository at initialization. This prototype is a runnable UI baseline, **not** a tested or production accounting system.

## Quick start

Requirements: Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run check
npm run dev
```

Open the local address printed by Vite. To validate production output:

```sh
npm run build
npm run preview
```

## Functions available

- Responsive desktop/mobile navigation, monthly selector, Polish PLN formatting.
- Income, expenses and net balance from **synthetic** monthly fixtures.
- Expandable rows, search, income/expense filtering.
- CSV export of the currently filtered visible records.
- Light/dark themes (local browser preference).
- Keyboard focus and reduced-motion support.

**Not implemented:** authentication, real banking integration, invoicing, Polish tax/VAT/JPK calculations, audit trail, persistence of transactions, or authorization. Do not upload personal/financial data to the demo.

## Vercel deployment

1. Import `SLADZARI/accountantpl` into [Vercel](https://vercel.com/new).
2. Framework preset: **Vite**; root directory: repository root.
3. Build command: `npm run build`; output directory: `dist`.
4. Set Production Branch to `main`; enable Preview Deployments on pull requests.
5. Merge only after build, tests and browser acceptance. No environment variables are required for this static demo.

The `vercel.json` file contains conservative static response headers. There is no server-side access control: **Preview URLs are not a security boundary**.

## Team working agreement

- `main`: approved and deployable; every change through a PR.
- Branches: `feat/*`, `fix/*`, `docs/*`.
- Attach acceptance criteria and screenshots for mobile (~390px) and desktop (~1440px).
- Run `npm run check && npm run build`, verify keyboard navigation, month totals, filtering and CSV.
- Never commit real financial data, credentials or secrets. Record facts separately from demo assumptions.

## Next step

Add the authoritative test assignment under `docs/TEST_ASSIGNMENT.md` with a requirement-to-test mapping. Confirm legal and Polish accounting requirements before adding any real financial workflows.
