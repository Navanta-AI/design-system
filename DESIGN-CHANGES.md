# Design System — Change Log & Decisions

A running record of changes made to `@admin-navanta/design-system`, paired with the
user guidance / suggestions that drove each one. Newest session at the top.

> Convention: every entry notes **what changed**, **why** (the suggestion), and **where**
> (file). Standards distilled from these are promoted into [CLAUDE.md](./CLAUDE.md).

---

## 2026-05-30

### 1. PageHeading & TableShell — brand color → neutral text-style tokens
**Suggestion:** "for components like PageHeading and TableShell, why is the brand color
shade used? We are supposed to use neutral color shading, and the color token set to
text-styles. Fix this in the core package."

- `PageHeading` title: removed brand `gradient-text`, now `text-[var(--text-primary)]`;
  subtitle `--brand-purple-deep` → `--text-secondary`.
- `TableShell` icon + title `--brand-purple-deep` → `--text-primary`; active page button
  `--brand-primary` / `text-white` → `--primary` / `--primary-foreground` (neutral).
- Files: `src/components/ui/PageHeading.tsx`, `src/components/ui/TableShell.tsx`.
- **Left intentionally brand-colored** (per decision): `RadioCard` selected accent,
  `DetailPanelShell` edge, `ChristySuggestions` AI chrome.

### 2. TableShell — compose existing DS components
**Suggestion:** "make sure TableShell uses existing components like pagination, search
input, and dropdown."

- Pagination: replaced hand-rolled page buttons with the `Pagination` component.
- Search: added optional built-in search via the `Input` component (opt-in through
  `onSearchChange`; backward compatible — `header` slot still works).
- Page-size dropdown: already used `Select` (unchanged).
- File: `src/components/ui/TableShell.tsx`.

### 3. Radio — neutral donut indicator (ported from Christy/RadioCard)
**Suggestion:** "I like the radio interaction in Christy Suggestions — reflect the same
in the basic Radio. Use neutral color, not brand."

- Selected state now fills the circle with neutral `primary` and punches a `background`
  inner hole (donut), with a scale+fade transition. Error state uses `destructive`.
- File: `src/components/Radio.tsx`.

### 4. Radio — `card` variant (text + subtext, neutral)
**Suggestion:** "add a variation to the radio that works like the Christy suggestion —
same structure of text and subtext — but neutral."

- New opt-in `card` prop renders a clickable card (label + `helperText` subtext +
  optional `badge`). Selected state is CSS-driven via `has-[:checked]` →
  neutral `accent` bg + `primary` border (works controlled & uncontrolled).
- File: `src/components/Radio.tsx`.

### 5. Docs — Radio page shows both variants, interactively
**Suggestion:** "I don't see the change on the radio page — with an option to check both
versions."

- Root cause: the demo rendered a single never-selected radio, so the donut never showed
  and there was no card example.
- Rebuilt the demo to show **Default** and **Card** groups, both pre-selected/interactive;
  added a representative `codeTemplate`; documented `card`/`badge` props and dropped the
  stale `label` knob in the registry.
- Files: `docs/app/(docs)/components/[slug]/demos/radio-demo.tsx`,
  `docs/lib/component-registry.ts`.

### 6. ChristySuggestions — use DS components + brand-tinted reasoning + christy button
**Suggestion:** "make Christy Suggestions use our components; use the brand color for the
background of the reasoning bullets container; the confirm button should be our christy
button."

- Option cards: replaced bespoke `RadioCard` with the DS `Radio` `card` variant.
- Reasoning bullets container background: `--surface-info` → `--surface-accent`
  (brand-tinted surface token) in both selection & static states.
- Confirm button: confirmed it uses `<Button variant="christy">`.
- File: `src/components/ui/panel/ChristySuggestions.tsx`.

### 7. Button `christy` variant — correct gradient from Figma + hover + docs
**Suggestion:** "the christy variant gradient is not correct — use this Figma for the
correct gradient [Iris-Shareable 414-4316], and this for hover [692-3276]. Also make sure
it's available on the buttons docs page."

- Added tokens `--gradient-christy` (`154.42deg, #1d4a86 1.66% → #3d348b 83.4%`) and
  `--gradient-christy-hover` (`154.42deg, #153664 1.66% → #2b2566 83.4%`).
- `.christy-btn-primary` now uses the gradient and **swaps to the darker gradient on
  hover** (was an opacity dim). `--gradient-brand` left intact (used by `gradient-text`).
- Added **Christy** to the buttons demo variant selector.
- Files: `src/tokens.css`, `src/styles.css`,
  `docs/app/(docs)/components/[slug]/demos/button-demo.tsx`.

### 8. Fix: christy gradient not reflecting in docs (stale local override)
**Suggestion:** "the christy button gradient is still not updated like I shared per Figma."

- Root cause: `docs/app/globals.css` had its own **unlayered** copy of `.christy-btn-primary`
  (using the old `--gradient-brand` + opacity hover). Unlayered rules beat the package's
  `@layer components` rule, so it masked the corrected gradient.
- Note: docs import the package from **source** (`@import ".../src/styles.css"`, which
  itself `@import`s `tokens.css`) — so the package was already correct; the override was
  the only problem.
- Fix: removed the duplicate from `docs/app/globals.css`; `.christy-btn-primary` is now
  defined once, in the package. (Standard: never redefine a package component class in docs.)
- File: `docs/app/globals.css`.

### 9. Button — default border radius set to 8px
**Suggestion:** "for buttons let's have the default border radius set to 8px."

- Base `buttonVariants` class `rounded-lg` → `rounded-[8px]`. Explicit so it's stable
  regardless of theme `--radius-lg` (the docs `@theme` overrides it to 12px). Still
  overridable via `className`.
- File: `src/components/Button.tsx`.

### 10. Table — standardized cell content variants (match HMTX Portal Figma)
**Suggestion:** "in table experience, lets update it to match our table structure in this
figma design … 1. Icon-circle + text + copy 2. Avatar + text + subtext 3. status dots + text
4. date + relative subtext 5. text/number 6. input field as a cell." Decisions: prop-driven
`Table.Cell variant=`, canonical status registry + tone override, auto relative time, map to
existing tokens + add missing.

- `Table.Cell` gained `variant`: `id` (circle badge + link text + copy button), `party`
  (avatar image/initials + title + subtext), `status` (progress dots + label), `date`
  (formatted date + auto relative subtext), `input` (inline editable). Plain text/number
  stays the default (with `mono`/`align`).
- `TABLE_STATUSES` registry — 4-step order lifecycle (open→in-process→shipped→delivered,
  plus on-hold/delayed/cancelled) with per-row `tone` override; `statusToneColor` maps
  tone→token. `formatTableDate` / `formatRelativeTime` helpers (no deps).
- Tokens added (mapped to existing where possible, per decision): `--text-link` #005b89,
  `--info-strong` #004b71, `--info-subtle` #f0f9ff (light + dark).
- Files: `src/components/Table.tsx`, `src/components/table-cell-utils.ts`, `src/tokens.css`,
  `src/index.ts`; docs `table-demo.tsx` + registry.

### 11. Table — `input` cell 120px min-width + demo filter/test controls
**Suggestion:** "make sure the demo has correct options to filter the table and change
things around to test the table. also … the text input option has a 120px fixed minimum
width."

- `input` variant now has a 120px minimum width.
- Docs Table demo: search `Input`, status `Select` filter, striped/hoverable/compact
  `Switch`es, and live per-column sorting toggles — composing existing DS components.
- Files: `src/components/Table.tsx`; docs `table-demo.tsx`.

### 12. Table — functioning sorting (`useTableSort`) + per-column enable/disable
**Suggestion:** "have the option of sorting enabled and make sure its functioning by
default. in the component as well as demo we need to see the option to enable and disable
sorting for certain columns."

- Added `useTableSort(data, getValue, initial?)` → `{ sorted, getHeadProps(key, enabled?),
  toggle, setSort, … }`. Sorts by an initial column by default; spread `getHeadProps` onto
  a `Table.HeadCell` to wire the caret + click. `enabled = false` renders a column
  non-sortable. `HeadCell`'s `sortable`/`sortDirection`/`onSort` stay the presentational layer.
- Demo sorts by HD PO # by default; checkboxes toggle sortability per column.
- Files: `src/components/use-table-sort.ts`, `src/index.ts`; docs `table-demo.tsx` + registry.

### 13. Docs — Table demo follows the Button demo's page design
**Suggestion:** "the ui for demo page for table is not following the design we have put in
components/button."

- Rebuilt the Table docs demo to use the same demo-page shell as `button-demo`: a single
  `rounded-xl` card with a `#fafafa` controls bar (`ControlLabel` + `Input` + `Select` +
  Shadcn-style pill toggles), the live preview area, and a `DynamicCodeBlock` footer —
  instead of the generic `ComponentPreview` + ad-hoc Switch/Checkbox bar. Filters (search,
  status) and the per-column sorting toggles now match the established control styling.
- File: `docs/app/(docs)/components/[slug]/demos/table-demo.tsx` (docs only — no package change).

### 14. Docs — "Christy Insight" AI column in the Table demo
**Suggestion:** "let have a column … we can call it Christy Insight. and have a brand color
text in the column cells. keep the column heading to the neutral color we are using as it though."

- Added a `Christy Insight` column to the Table demo using `<Table.HeadCell ai>` — the header
  keeps the neutral foreground text and the AI star renders before the label. Cell text uses
  the brand token `--text-accent` (per the standard: brand color is reserved for Christy/AI
  chrome; headings stay neutral).
- File: `docs/app/(docs)/components/[slug]/demos/table-demo.tsx` (docs only).

### 15. EmptyState component + standardized table empty / no-results screens
**Suggestion:** "should we have search option … in the table component or in the table shell …
because if we want to standardize no result screen and first time user screen. how can we do that?"
Decisions: search = first-class TableShell prop; empty states = a reusable `EmptyState`
component wired into TableShell.

- Reasoning shared with the user: the base `Table` only renders the rows it's handed, so it
  can't filter or know *why* it's empty — the toolbar (search) and the count (`totalItems`)
  belong to `TableShell`, which is therefore where both search and the empty-state decision live.
- New `EmptyState` (`icon` / `title` / `description` / `action`, neutral styling, `sm`/`md`).
- `TableShell` renders `EmptyState` when `totalItems === 0`: `empty` (first-time, with a CTA)
  vs `noResults` (filtered → defaults to a "Clear search" action), chosen by `isFiltered`
  (inferred from the built-in search value when omitted). Footer is hidden on the empty screen.
  Search itself was already a first-class TableShell prop (`searchValue` / `onSearchChange`).
- Files: `src/components/ui/EmptyState.tsx`, `src/components/ui/TableShell.tsx`,
  `src/components/ui/index.ts`; docs `empty-state-demo.tsx`, `table-shell-demo.tsx`, registry,
  slug page, sidebar.

### 16. TableShell standard chrome + centered empty state (Figma 987-7952 / 802-4493)
**Suggestion:** "this is how we want the table shell to include … table heading, option to
customize columns, filters, search, tabs for further easy filtering. this should be the
standard table shell until someone requests to change. … demo example section … with the
background and options to change the visual of table … user should be able to play around. …
empty state of figma like this … when the result is nothing found with search or filter or
both the context should stay in center."

- `TableShell` now renders the standard chrome top→bottom: **heading** (title + a
  **Customize** gear action), **toolbar** (built-in search + a `filters` slot), optional
  **tabs** (count badges), the table body, and the footer (count + pagination + page-size).
  New props: `filters`, `tabs`/`activeTab`/`onTabChange`, `onCustomize`/`customizeLabel`.
- **Empty/no-results corrected** to the Figma: keep the column headers **and** footer, and
  **center** the content in the body. Added `Table.Empty` (full-span centered row) and
  reworked `EmptyState` (nested-ring icon, link/CTA action). Reverted the prior approach
  (replace whole body, hide footer, `empty`/`noResults`/`isFiltered` props on TableShell).
- Demo: the TableShell page is now a playground card (matching the Button demo) — toggle
  Search / Filters / Tabs / Customize, a Customize column-visibility popover, a Watchlist-tab
  empty, search/filter no-results, and a Simulate-empty first-time screen; rich table with
  the cell variants + sorting.
- Files: `src/components/ui/TableShell.tsx`, `src/components/ui/EmptyState.tsx`,
  `src/components/Table.tsx` (`Table.Empty`); docs `table-shell-demo.tsx` + registry.

### 17. Docs — full-page TableShell playground
**Suggestion:** "for a table shell playground we will need a full page view. check how can we
achieve that."

- The component docs page is capped at `max-w-[1000px]` by `(docs)/layout.tsx` plus a 220px
  "on this page" rail — too tight for the full table chrome. Added a route **outside the
  `(docs)` group** so it skips that cap/rail while still inheriting the root layout (global
  sidebar, theme, toast): `app/playground/table-shell/page.tsx` — full-width.
- Extracted the playground into a shared client component `app/components/table-shell-playground.tsx`
  (`showCode` prop); the docs demo renders it + an "Open full-page playground ↗" link, and the
  route renders it full-width with a back link.
- Gotcha logged: importing a Phosphor icon into the **server** page module broke the build
  (`createContext is not a function` during page-data collection) — Phosphor calls
  `createContext` at module scope, so keep icons inside client components only. Used a plain
  arrow in the server page.
- Files: `docs/app/playground/table-shell/page.tsx`, `docs/app/components/table-shell-playground.tsx`,
  `docs/app/(docs)/components/[slug]/demos/table-shell-demo.tsx` (docs only).

### 18. Docs — TableShell page is full-width by default
**Suggestion:** "can we see if we can have expanded view as default for the table shell page."

- The wide orders table was cramped on the docs page: `(docs)/layout.tsx` caps every page at
  `max-w-[1000px]` and the component page adds a 220px "On this page" rail (~780px usable on
  xl). Now `/components/table-shell` renders **edge-to-edge by default** — no separate click
  into the full-page playground needed.
- The `(docs)` layout is a server component with no access to the `[slug]` param, so the
  per-route width decision is made client-side: extracted the centered width column into
  `app/components/docs-content-column.tsx` (client, `usePathname`) which drops `max-w-[1000px]`
  for routes in a `FULL_WIDTH_PATHS` set. Add a route there to make any other page full-width.
- Dropped the TOC rail for this page via a new `hideOnThisPage` prop on `DocsWithToc`
  (renders the single full-width content column instead of the `…_220px` grid). All other
  docs pages keep the 1000px cap + rail unchanged.
- Verified against the running dev server: `/components/table-shell` SSR HTML has no
  `max-w-[1000px]` and no `…_220px` grid; `/components/button` keeps both.
- Files (docs only): `docs/app/components/docs-content-column.tsx` (new),
  `docs/app/(docs)/layout.tsx`, `docs/app/components/docs-with-toc.tsx`,
  `docs/app/(docs)/components/[slug]/page.tsx`.

### 19. Docs — drag-to-reorder + toggle in the TableShell Customize popover
**Suggestion:** "can we make sure we bring the experience of dragging and moving the columns
in the customize section?" + "instead of checkbox we should use turn on and off toggle placed
on right. the item height should be at least 32px."

- The Customize popover is consumer-owned demo code (TableShell only exposes `onCustomize`),
  so this stays in the shared `app/components/table-shell-playground.tsx` (covers both the docs
  demo and the full-page playground). Not a published component — can be promoted to a reusable
  `ColumnCustomizer` later if the app needs it.
- Each row is now: a left **grip handle** (`DotsSixVertical`), the label, and the DS **`Switch`**
  on the **right** (replaced `Checkbox`); rows are **≥32px** (`min-h-[32px]`).
- **Drag-to-reorder** uses native HTML5 DnD (no new dependency — matches the `Dropzone` pattern):
  the handle initiates the drag and sets the full row as the drag image; the row is the drop
  target. A neutral 2px insertion line shows above/below the target, and `moveKey` drops *after*
  the target when dragging down / *before* when dragging up so every slot (incl. the ends) is
  reachable. `po` stays pinned first and `Qty` last; only the optional columns reorder.
- Column order flows straight through: `cols` is derived from `colOrder`, and the table
  header/body already map over `cols`, so the table reflects the new order live.
- Known limitation (demo): pointer-drag only, no keyboard reorder yet.
- Files (docs only): `docs/app/components/table-shell-playground.tsx`.

### 20. EmptyState — match the HMTX Portal Figma (watchlist empty)
**Suggestion:** "the design for empty state and even watchlist is not correct … Implement this
design from Figma." (node `802:4802` — "Your watchlist is empty").

- Pulled the exact spec via the Figma MCP and corrected `EmptyState`
  (`src/components/ui/EmptyState.tsx`) to match:
  - **Title** 16px → **18px**, line-height 1.3 → **1.44** (still `--text-primary`).
  - Title→body gap 6px → **8px**; **description** now `--text-primary` + **line-height 22px**
    (was `--text-secondary`/1.5), per the Figma (`text-&-icons/primary #212121`).
  - **Icon rings** outer 132×132 → **136×139** (52/38/24 radii, 102×103 + 66×66 inner
    unchanged); icon rendered at **32px**, neutral `--text-neutral`.
  - New opt-in **`link`** prop `{ label, onClick?, href? }` — a 14px **medium underlined**
    `--text-link` (#005b89, already the exact Figma `color/info/800`) line sitting **directly
    under the description** (no gap), instead of a separated `action`. Backward compatible;
    `action` stays for Button CTAs.
- The Figma star is **duotone** (0.2 fill + outline) — switched the watchlist icon from
  `weight="regular"` to `weight="duotone"`; applied duotone to the no-results / no-orders
  icons too for a consistent look.
- Docs updated alongside: watchlist empty now uses `link={…}` (playground), the EmptyState
  demo gains a third (link-style) example + duotone icons, and the registry documents `link`.
- Rebuilt `dist/` (`npm run build`); verified the docs dev server now serves the new markup
  (18px/`leading-[1.44]` title, 139px ring, rendered link). **Restart the docs dev server**
  if an older `dist` is cached.
- Files: `packages/design-system/src/components/ui/EmptyState.tsx`;
  `docs/app/components/table-shell-playground.tsx`,
  `docs/app/(docs)/components/[slug]/demos/empty-state-demo.tsx`, `docs/lib/component-registry.ts`.

### 21. Switch — Apple-grade spacing + a legit docs page
**Suggestion:** "the toggle is not looking professional design. check apple design system to
make the minor spacing fixes for the component. then also make the component legit as a page
for the package."

- **Spacing fix** (`src/components/Switch.tsx`): the track used a 1px `border` whose color
  matched the fill (`border-input` on `bg-input` / `border-primary` on `bg-primary`), so it
  added nothing visually but shrank the inner box and made the knob insets uneven (≈1px left
  vs 2px right). Switched to a borderless solid track with **`border-2 border-transparent`** —
  per Apple HIG, this reserves a **uniform 2px knob inset** on all sides (background-clip
  border-box keeps the track filled), so the 16px knob fills the 16px inner height and travels
  16px edge-to-edge with symmetric 2px gaps. Also: subtler knob shadow
  (`shadow-[0_1px_2px_0_rgba(0,0,0,0.2)]` instead of `shadow-lg`), `duration-200 ease-in-out`
  on both track + knob, and `ring-offset-2` for a cleaner focus ring. Size unchanged (h-5 w-9).
- **Legit page**: the demo was a 638-byte stub. Rebuilt `switch-demo.tsx` into a Radio-style
  showcase — a knob-driven Playground plus On/Off, With-helper-text, and States (disabled
  off/on, error) groups + a controlled/uncontrolled `codeTemplate`. Registry now has a
  `usageExample` and the previously-missing `defaultChecked` / `onCheckedChange` props.
- Rebuilt `dist/`; verified the dev server serves the new track (no color border) + all demo
  groups. **Restart the docs dev server** if an older `dist` is cached.
- Files: `packages/design-system/src/components/Switch.tsx`;
  `docs/app/(docs)/components/[slug]/demos/switch-demo.tsx`, `docs/lib/component-registry.ts`.

### 22. Switch — exact HMTX Portal toggle from Figma (on/off states)
**Suggestion:** "Implement this design from Figma" — `535:20294` (active) + `535:20313`
(inactive), the "Toggle - Switch" component (documented against Apple HIG).

- Supersedes the colors + sizing from #21 (the rebuilt demo page from #21 stays). Pulled both
  states via the Figma MCP and matched the spec exactly:
  - **Track**: flat, fully rounded, **2px inset** (`p-0.5`). On = `#0087ce`
    (`Color/Info/600`); off = `rgba(60,60,67,0.3)` (`Labels/Tertiary`, the iOS off gray).
  - **Knob**: a **wide white pill** (not a circle, ≈1.6:1) that travels edge-to-edge. Subtle
    shadow kept for edge definition.
  - **Size**: the Figma master is 64×28 / knob 39×24; per follow-up feedback ("too big") the
    default ships **scaled ~0.7× to a 44×20 track / 26×16 knob / 14px travel** (`h-5 w-11`,
    knob `h-4 w-[26px]`, `translate-x-[14px]`) — fits the 32px Customize rows while keeping the
    exact wide-pill ratio.
- Added semantic tokens rather than hex in the component: `--switch-on`, `--switch-off`,
  `--switch-knob` in `tokens.css` (light + a lighter dark off-fill `rgba(120,120,128,0.4)` so
  the track stays visible on dark surfaces; knob stays white in both).
- Verified the build pipeline end-to-end: `tsdown` emits the new classes into `dist/index.mjs`,
  `@source` scans it, and `dist/styles.css` now contains `.translate-x-\[21px\]`,
  `.w-\[39px\]`, and `.bg-\[var(--switch-on/off/knob)\]`; `dist/tokens.css` has the tokens.
  Served `/components/switch` renders the new toggle (blue track, 39px knob, 21px travel; old
  round knob gone). `tsc` clean.
- Note: ships at the reduced 44×20 size (see Size above); the wide-pill look is preserved. A
  proportional `size` variant could be added later if multiple sizes are needed.
- Files: `packages/design-system/src/components/Switch.tsx`,
  `packages/design-system/src/tokens.css`, `docs/lib/component-registry.ts`.

### 23. Customize popover — premium drag-to-reorder (live reorder + FLIP)
**Suggestion:** "can we improve the drag experience"

- Upgraded the column drag-reorder (docs `table-shell-playground.tsx`, still dependency-free
  native HTML5 DnD) from "static insertion line + reorder-on-drop" to a modern feel:
  - **Live reorder on hover**: `onDragOver` compares the pointer Y to each row's vertical
    midpoint (`reorderList(order, dragKey, overKey, placeAfter)`) and rearranges the list
    under the cursor in real time. No-op updates are filtered (`sameOrder`) so it doesn't
    thrash; hovering the dragged row itself is a no-op, so it's jitter-free.
  - **FLIP slide animation**: a `useLayoutEffect` (isomorphic, to dodge the SSR warning)
    records each row's rect and, when `colOrder` changes mid-drag, animates `translateY` from
    the old position to the new via the Web Animations API (160ms, custom easing). Only runs
    during an active drag; on open it just records baseline positions (no animate-on-open).
  - **Lift styling**: the dragged source row reads as a placeholder (`bg-muted/60 opacity-60`)
    while the browser drag-image floats with the cursor; grab/grabbing cursors on the handle.
  - Dropped the old `dragOverKey` state, the absolute insertion-line element, and `moveKey`.
- Verified: `tsc` clean; `/components/table-shell` renders (200, no error overlay).
- Limitation: pointer-only (HTML5 DnD has no touch). A pointer-events rewrite would add touch
  + keyboard reorder if needed later.
- Files (docs only): `docs/app/components/table-shell-playground.tsx`.

### 24. Customize popover — match the Select dropdown surface
**Suggestion:** "why the dropdown for custom is different from the select component?"

- Root cause: the Customize panel is hand-rolled demo code (TableShell only exposes
  `onCustomize`), and the package has **no generic Popover/DropdownMenu primitive** (only
  `Select`, a single-select listbox, and `Tooltip`; `ui/Dropdown.tsx` was deleted earlier).
  So the panel had drifted from `SelectContent`'s surface.
- Quick reconcile (chosen): restyled the popover `<div>` to `SelectContent`'s treatment —
  `rounded-md` (was `rounded-lg`), `bg-popover` / `text-popover-foreground` (was
  `bg-background`), `shadow-md` (was `shadow-lg`), `overflow-hidden`, and `p-1` content
  density. Now visually identical to the Status/Date `Select` dropdowns beside it.
- Animation note: `Select` uses `animate-in fade-in-0 zoom-in-95`, but the repo has **no
  tailwindcss-animate plugin**, so those are dead no-ops (Select doesn't actually animate).
  Gave the panel a real, dependency-free **scale/fade entrance** via the Web Animations API
  (120ms, `origin-top-right`) so it opens like a proper dropdown.
- Verified: `.rounded-md`/`.bg-popover`/`.text-popover-foreground`/`.shadow-md` resolve in the
  loaded CSS; `tsc` clean; `/components/table-shell` renders (200, no error overlay).
- Follow-ups offered: add the animate plugin so `Select` animates too (for true parity), or
  extract a real `Popover`/`DropdownMenu` primitive into the package (the root-cause fix).
- Files (docs only): `docs/app/components/table-shell-playground.tsx`.

### 25. Customize popover — Qty is now a managed column
**Suggestion:** "why is qty column not part of the dropdown?" → make it fully toggleable +
reorderable.

- Previously `HD PO #` and `Qty` were hard-coded outside the column map (pinned first/last),
  so only the middle `OPTIONAL_COLUMNS` appeared in the Customize panel. Moved `qty` into
  `OPTIONAL_COLUMNS` so it now has a grip + toggle in the dropdown (hideable and draggable to
  any position); `HD PO #` stays pinned first as the row identifier.
- Rendering: `qty` is now emitted inside the header/body `cols.map` (header `align="right"`,
  no sort; body `variant="input"` number cell) instead of as trailing pinned cells.
  `visibleColCount` dropped from `1 + cols.length + 1` to `1 + cols.length`.
- Verified: `tsc` clean; `/components/table-shell` renders (200, no error overlay); Qty header
  appears once (no duplication).
- Qty column is **left-aligned** (header + input cell), consistent with the other columns and
  with being draggable to any position (was `align="right"` when pinned last).
- Files (docs only): `docs/app/components/table-shell-playground.tsx`.

### 26. Table `variant="id"` — link-style only actual links
**Suggestion:** "halstead order column should not be of link color as its not a link. also the
font weight should be normal."

- `Table.Cell variant="id"` always rendered `font-medium text-[var(--text-link)]`, even with no
  `href` — so the Halstead Order # (a plain ID) looked clickable. Made it conditional on
  `href`: a real link keeps `font-medium` + `--text-link`; a plain ID now renders
  `font-normal` + `--text-primary` (neutral). Link color now implies clickability.
- Fixes Halstead in both the playground and the Table demo automatically; the HD PO # cell
  (`href="#"`) stays link-styled. Updated the `--text-link` token comment to match.
- Core change → rebuilt `dist/`. Verified on the live page: the Halstead value renders
  `font-normal text-[var(--text-primary)]`; the HD PO # value keeps `font-medium
  text-[var(--text-link)]`. Build + `tsc` clean.
- Files: `packages/design-system/src/components/Table.tsx`,
  `packages/design-system/src/tokens.css`.

### Pending
- No publish yet. All of the above is built into `dist/` and the version is bumped to
  **v0.2.6** locally (AI-star icon + table standardization + EmptyState + TableShell chrome). Tag + publish when the user approves.
