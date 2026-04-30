# ticktock — Timesheet Management App

A SaaS-style timesheet management application built with Vue 3 + PrimeVue.

## Live Demo

https://ticktock-time-management-app.netlify.app/

## Tech Stack

| Tool | Purpose |
|------|---------|
| Vue 3 (Composition API) | Frontend framework |
| Vite | Build tool |
| Pinia | State management |
| Vue Router | Client-side routing |
| PrimeVue 4 | UI component library |
| PrimeIcons | Icon set |
| Tailwind CSS | Utility-first CSS framework |

## Getting Started

### Requirements
- Node.js 18+ (tested on v24)
- npm 9+

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Login credentials
| Email | Password |
|-------|----------|
| izza@example.com | password123 |
| jane@example.com | password123 |

## Project Structure

```
src/
├── assets/        # Global CSS (Tailwind directives + custom styles)
├── components/    # Reusable components (Navbar, StatusBadge, EntryModal)
├── data/          # Mock data (simulates API responses)
├── router/        # Vue Router config + auth guard
├── stores/        # Pinia stores (auth, timesheets)
└── views/         # Pages (Login, Dashboard, WeekDetail)
```

## Features
- ✅ Login with session persistence (sessionStorage)
- ✅ Auth route guard (redirects to /login if not authenticated)
- ✅ Dashboard table view with status badges + pagination
- ✅ Status filter dropdown
- ✅ Week detail view with daily grouped entries
- ✅ Add / Edit / Delete timesheet entries
- ✅ Form validation with error messages
- ✅ Responsive layout with Tailwind CSS
- ✅ Toast notifications

## Assumptions
- Authentication is mocked (no real backend) — session stored in sessionStorage
- All data is in-memory — changes reset on page refresh (by design for this assessment)
- The `date` field for new entries defaults to today's date
