# monis.rent — Workspace Designer

A polished, interactive workspace configurator for a Bali rental service, created for the **Desent Solutions Developer Challenge**.

## What it does

- Builds a workspace around 3 desks and 3 ergonomic chairs
- Adds/removes monitors (up to three), a task lamp, plant, and desk mat
- Updates a layered CSS workspace scene and monthly estimate in real time
- Persists the current setup during the browser session
- Opens a complete rental request flow with validation and confirmation state
- Works comfortably across mobile, tablet, and desktop sizes

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, and small bespoke CSS illustration primitives. No external image assets are required.

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). Validate the production build with `npm run lint`, `npm run typecheck`, and `npm run build`.

## Design & architecture

The preview is intentionally a composable CSS scene rather than a static product image: each selected product drives a specific visual layer, so the design remains fast and responsive without third-party assets. Product data lives in `lib/products.ts`; UI/state and rental interaction live in `components/workspace-designer.tsx`.

The visual direction combines warm teak, tropical greens, soft terracotta, and editorial typography to feel at home with Bali-based nomads. The reference sketch informed the configurator structure only, not the final visual system.

## Assumptions and next steps

Prices are illustrative monthly Bali rental estimates. A production version would connect stock availability, delivery zones, payments, and a CRM. It could also add sharable configuration URLs and richer 3D/photographic product previews.

## Live site

Live: [desent-workspace-designer-gray.vercel.app](https://desent-workspace-designer-gray.vercel.app/)

Source: [techandmedia/desent-workspace-designer](https://github.com/techandmedia/desent-workspace-designer).

## Release notes

### v1.0.2 — 16 July 2026

- Fixed manual rental-date entry: invalid and too-early dates now receive immediate, accessible guidance without removing keyboard or paste input.

### v1.0.1 — 16 July 2026

- Fixed rental date validation: past dates, today, and dates inside the 48-hour setup window are unavailable.
- Added clear date-field guidance explaining the earliest available delivery date.

### v1.0.0 — Initial production release

- Released the interactive monis.rent workspace configurator to Vercel production.
- Included real-time workspace preview, monthly pricing summary, accessory controls, and validated rental-request flow.
