# KL7 Garage — Monorepo

This repository contains both the user-facing website and the admin dashboard for KL7 Garage. Both apps connect to the **same Supabase database**.

## Structure

```
kl7_merged/
├── user-app/     # Public-facing website (new_kl7)
└── admin-app/    # Admin / dealer console (Admin_KL7)
```

---

## user-app (Public Website)

React + TypeScript + Vite frontend for the KL7 Garage customer-facing site.

### Setup & Run

```bash
cd user-app
npm install
npm run dev       # → http://localhost:5173
```

### Build

```bash
npm run build     # outputs to dist/
```

---

## admin-app (Dealer Console)

React + TypeScript + Vite admin dashboard for managing inventory, leads, and enquiries.

### Setup & Run

```bash
cd admin-app
npm install
npm run dev       # → http://localhost:5173
```

> **Note:** Run admin-app on a different port if both apps run simultaneously. Edit `vite.config.ts` in either app and set `server.port` to a different value (e.g. `5174`).

### Build

```bash
npm run build     # outputs to dist/
```

---

## Shared Database

Both apps use the same Supabase project. The `.env` file in each app must contain:

```env
VITE_kl7_supabase_url=<your-supabase-url>
VITE_kl7_supabase_anon_key=<your-supabase-anon-key>
```

The `.env` files are already pre-filled in both apps — do not commit them to version control.
