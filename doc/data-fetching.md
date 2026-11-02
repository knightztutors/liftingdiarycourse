# Data Fetching Standard

This document defines the **mandatory** standard for all data fetching across the entire project. Every code change that reads or loads data must follow these rules exactly. Consult this file (per `CLAUDE.md`) before writing or modifying any data-fetching code.

## 1. Fetch data ONLY in Server Components

- **ALL data fetching in this app MUST be done via Server Components.** This is the only permitted place to load data.
- **Data must NOT be fetched any other way.** Specifically, do **not** fetch data via:
  - ❌ Route handlers (`app/**/route.ts`, API routes)
  - ❌ Client Components (`"use client"`) — no `useEffect` + `fetch`, no SWR, no React Query, no `fetch` in the browser
  - ❌ Any other mechanism (middleware, server actions used as read endpoints, client-side ORM calls, etc.)
- ✅ Server Components call the data-layer helper functions directly (see section 2) and pass the resulting data down to Client Components as props.
- If a Client Component needs data, the parent Server Component must fetch it and pass it in as props. The Client Component never fetches it itself.

> This is very important. There are no exceptions. If a situation seems to require fetching data outside a Server Component, **stop and raise it** rather than working around this rule.

## 2. Database queries ONLY via `/data` helper functions

- **Every database query MUST live in a helper function inside the `/data` directory.** Server Components must not query the database inline — they call a `/data` helper.
- These helper functions are the single source of truth for database access. No query may be written anywhere else.

### What this means in practice

- ✅ Add a dedicated helper function in `/data` for each read your app needs.
- ✅ Server Components import and call these helpers.
- ❌ Do **not** query the database directly inside a Server Component, Client Component, or route handler.

## 3. Queries ONLY via Drizzle ORM — NO raw SQL

- **All database queries MUST use the Drizzle ORM.**
- **Do NOT use raw SQL.** No raw SQL strings, no template-literal SQL, no `db.execute(sql\`...\`)` for application queries. Express every query through Drizzle's query builder / schema.

## 4. A user may ONLY access their own data

This is **incredibly important** and non-negotiable.

- A logged-in user **MUST only ever be able to access their own data.** They must **NOT** be able to access any data belonging to any other user.
- Every `/data` helper that reads user-owned data **MUST** scope the query to the currently authenticated user (e.g. filter by the authenticated user's id) as part of the Drizzle query itself.
- The user's identity must come from the trusted server-side session/auth — **never** from a client-supplied id, query parameter, or request body that could be tampered with.
- Never return rows that are not owned by the authenticated user. When in doubt, filter more strictly, not less.

### Checklist for every `/data` read helper

- [ ] Runs only in a Server Component context.
- [ ] Uses Drizzle ORM (no raw SQL).
- [ ] Derives the user id from the server-side session, not from client input.
- [ ] Filters results to the authenticated user's own data.
