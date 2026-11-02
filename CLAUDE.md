# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **IMPORTANT — ALWAYS read the docs first.** Before generating or modifying ANY code, Claude must ALWAYS first consult the relevant documentation file in the `doc/` directory (e.g. `doc/ui.md` for UI work) and follow its guidance. This is not optional: every code change must begin by checking `doc/` for a file covering the area being touched. Never rely on prior assumptions when a `doc/` file applies.

- /doc/ui.md
- /doc/data-fetching.md
@AGENTS.md

## Commands

- `npm run dev` — start the dev server (http://localhost:3000). Note: `next dev` rewrites the `nextjs-agent-rules` block in `AGENTS.md`; commit that change with your work to keep the tree clean.
- `npm run build` — production build.
- `npm run start` — serve the production build.
- `npm run lint` — run ESLint.

There is no test setup in this project yet.

## Architecture

A **Next.js 16** App Router project (React 19, TypeScript, Tailwind CSS v4) — currently the unmodified `create-next-app` starter, intended to grow into a lifting-diary app.

- **Version caveat:** Next.js 16 has breaking changes vs. older releases. Per `AGENTS.md`, consult `node_modules/next/dist/docs/` before writing Next.js code rather than relying on prior knowledge.
- **App Router** under `src/app/` — `layout.tsx` (root layout) and `page.tsx` (routes). Segment layouts/pages use Next 16's globally-available typed props (e.g. `LayoutProps<"/">`); no manual `params`/`children` typing needed.
- **Import alias:** `@/*` maps to `./src/*`.
- **Styling:** Tailwind v4 via `@tailwindcss/postcss` (configured in `postcss.config.mjs`); global styles and theme in `src/app/globals.css`. Geist / Geist Mono fonts loaded through `next/font/google` in the root layout and exposed as `--font-geist-sans` / `--font-geist-mono`.
- **Linting:** flat ESLint config (`eslint.config.mjs`) extending `eslint-config-next` core-web-vitals + TypeScript rules.
