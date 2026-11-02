# UI Coding Standard

This document defines the **mandatory** coding standard for all UI work across the entire project. Every code change that touches the UI must follow these rules exactly. Consult this file (per `CLAUDE.md`) before writing or modifying any UI code.

## 1. Components: shadcn/ui ONLY

- **ONLY shadcn/ui components may be used for the UI.** Every piece of UI — buttons, inputs, dialogs, cards, tables, dropdowns, forms, toasts, etc. — must be a shadcn/ui component.
- **ABSOLUTELY NO custom components may be created.** Do not hand-roll bespoke components, do not wrap raw HTML elements into new reusable UI primitives, and do not build one-off styled elements that duplicate what shadcn/ui already provides.
- If a UI element is needed, find the matching shadcn/ui component and add it via the shadcn CLI (e.g. `npx shadcn@latest add <component>`). Then compose the page from those components.
- If no shadcn/ui component exists for a required need, **stop and raise it** rather than inventing a custom component. Do not work around this rule.

### What this means in practice

- ✅ Compose pages and features by assembling shadcn/ui components.
- ✅ Add new shadcn/ui components through the shadcn CLI as needed.
- ✅ Apply layout and spacing using Tailwind utility classes directly on shadcn/ui components and standard layout elements.
- ❌ Do **not** create new component files that define custom UI primitives.
- ❌ Do **not** fork, rename, or re-implement shadcn/ui components into custom equivalents.
- ❌ Do **not** pull in other component libraries (Material UI, Chakra, Ant Design, etc.).

## 2. Date formatting: date-fns ONLY

- **All date formatting must be done via [`date-fns`](https://date-fns.org/).** Do not use `Intl.DateTimeFormat`, `toLocaleDateString`, manual string building, or any other date library (Moment, Day.js, Luxon, etc.).

### Required display format

Dates shown in the UI must be formatted as **ordinal day + abbreviated month + full year**:

| Example         |
| --------------- |
| `1st Sep 2025`  |
| `2nd Aug 2026`  |
| `3rd Jan 2026`  |
| `4th Jun 2024`  |

### How to produce it

Use the `do MMM yyyy` format string with date-fns:

```ts
import { format } from "date-fns";

format(new Date(2025, 8, 1), "do MMM yyyy"); // "1st Sep 2025"
format(new Date(2026, 7, 2), "do MMM yyyy"); // "2nd Aug 2026"
format(new Date(2026, 0, 3), "do MMM yyyy"); // "3rd Jan 2026"
format(new Date(2024, 5, 4), "do MMM yyyy"); // "4th Jun 2024"
```

- `do` → day of month with ordinal suffix (`1st`, `2nd`, `3rd`, `4th`, …)
- `MMM` → three-letter month, correctly capitalised (`Sep`, `Aug`, `Jan`, `Jun`)
- `yyyy` → four-digit year

Always format dates at the point of display. Store and pass dates as `Date` objects or ISO strings; only convert to the human-readable string with date-fns when rendering.
