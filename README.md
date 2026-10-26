# OmniRoute Frontend

**AI-powered retail operations platform** for modern grocery and multi-department stores.

OmniRoute gives store operators a real-time command center for inventory health, sales velocity, supplier workflows, and AI-assisted floor audits — all in one place.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)

---

## Overview

OmniRoute Frontend is the operator-facing dashboard for retail store operations. It connects live POS telemetry, inventory ledgers, and supplier data into a single, fast UI so teams can act on stockouts, spoilage risk, and sales trends in real time.

### Key capabilities

| Module | What it does |
|--------|----------------|
| **Operations Dashboard** | Live KPIs: gross sales, stock valuation, stockout alerts, shrinkage & spoilage risk |
| **Inventory** | SKU-level stock, reorder points, safety buffers, and department views |
| **Sales** | Record sales / batch entry, velocity tracking, basket insights |
| **Intake** | Scan inbound purchase orders and receive stock |
| **Suppliers** | Draft and manage purchase orders; auto-reorder for low-buffer items |
| **Scanner** | Barcode / scan workflows for floor operations |
| **Analytics** | Department contribution, hourly velocity, trends |
| **AI Copilot** | AI floor audit across aisles; quick markdowns and operational suggestions |
| **Settings** | Facility and operational configuration |

---

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS 4, Radix UI / shadcn-style components
- **Icons:** Lucide React
- **State / data:** Custom inventory context + client-side domain models

---

## Getting started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun

### Install & run

```bash
# Clone
git clone https://github.com/chinonsoxavier/omniroute-fe.git
cd omniroute-fe

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Project structure

```
app/
  (app)/           # Authenticated app shell
    page.tsx       # Operations dashboard
    inventory/     # Inventory management
    sales/         # Sales & batch entry
    intake/        # Inbound stock receiving
    suppliers/     # Purchase orders & suppliers
    scanner/       # Scan workflows
    analytics/     # Velocity & department analytics
    ai-copilot/    # AI floor audit & suggestions
    settings/      # Configuration
  (auth)/          # Auth routes
components/        # Shared UI and feature components
lib/               # Types, inventory context, utilities
```

---

## Features in focus

- **Real-time style operations UI** — POS sync status, peak foot traffic, and live velocity indicators
- **Critical stock awareness** — Low safety-buffer and out-of-stock alerts with one-click auto-PO drafting
- **AI floor audit** — Run aisle-level audits and surface actionable messages
- **Quick operational actions** — Record sale, scan inbound PO, apply markdowns from the dashboard
- **Department & velocity views** — Sales contribution by department and hourly checkout trends

---

## Related repositories

- [omniroute-be](https://github.com/chinonsoxavier/omniroute-be) — Backend services for OmniRoute

---

## Author

**Chinonso Xavier**  
Full-stack engineer · [GitHub](https://github.com/chinonsoxavier) · [Portfolio](https://chinonsoxavier.vercel.app/)

---

## License

Private / proprietary unless otherwise stated. Contact the author for usage permissions.
