# Design System — Change Log & Decisions

A running record of changes made to `@navanta-ai/design-system`, paired with the
user guidance / suggestions that drove each one. Newest session at the top.

> Convention: every entry notes **what changed**, **why** (the suggestion), and **where**
> (file). Standards distilled from these are promoted into [CLAUDE.md](./CLAUDE.md).

---

## 2026-06-08

### 1. Pill — new status-tag component (semantic variants × 3 sizes)
**Suggestion:** "we don't have a pill component… that has all semantic variations with
blue, red, amber and grey. [Figma: Iris-Shareable, node 546-3031, small example]. You
can have pill size of all three sizes — small, medium and large."

- New `Pill` component: `cva`-based, four semantic variants — `info` (blue), `danger`
  (red), `warning` (amber), `neutral` (grey) — across `sm` / `md` / `lg`. Optional
  leading `icon` prop (scales per size), label as children. `span` + `forwardRef`,
  matching the `Button` pattern.
- **Sourced from Figma:** the small/`danger` pill is the exact spec — `Destructive/50`
  background `#fff1f2` + `Destructive/800` text/icon `#a7000f`, `px-8 py-2`, `gap-4`,
  `rounded-4`, 12px Geist Medium, 12px icon. info/warning/neutral follow the same
  **50 bg / 800 fg** tonal system.
- **Tokens (per standards — no raw hex in components):** added `--pill-{info,danger,
  warning,neutral}-{bg,fg}` to `tokens.css` (light + dark).
- Kept brand color out of it (neutral grey variant, not brand) per the color standard —
  brand stays reserved for Christy chrome.
- Files: `src/components/Pill.tsx`, `src/index.ts`, `src/tokens.css`; docs:
  `demos/pill-demo.tsx`, `component-registry.ts` (slug `pill`, Data Display),
  `[slug]/page.tsx` demoMap, `sidebar.tsx` (Tag icon).

### 2. Pill — directional/route layout + neutral color reconciled to Figma
**Suggestion:** "we will need one design for pill like this as well" [Figma: Iris-Shareable,
node 546-3127 — a neutral `🚚 → HOU` route pill].

- **Multi-icon support:** dropped the forced single-size icon wrapper; icons now render
  inline and size to the text (`1em`, = Phosphor's default = 12px at `sm`, matching the
  Figma spec). This lets a leading group compose a glyph + a smaller directional arrow,
  e.g. `icon={<><Truck weight="fill" /><ArrowRight size={8} weight="bold" /></>}` →
  `🚚 → HOU`. No `!important` overrides; matches the `Button` icon-passing philosophy.
- **Neutral color reconciled:** Figma confirms the neutral pill = `Color/Neutral/100`
  bg `#f4f4f5` (already correct) + `Color/Neutral/900` text `#18181b` — bumped
  `--pill-neutral-fg` from `#3f3f46` → `#18181b` to be exact.
- Docs: added a "Directional / route" example (sm/md/lg) to `pill-demo.tsx`.
- Files: `src/components/Pill.tsx`, `src/tokens.css`, `demos/pill-demo.tsx`.

### 3. Pill — icon weight (outline → duotone)
**Suggestions:** "the icons we are using in pill should always be outline phosphor icons"
→ then "the outline width should match in the font width there" → resolved to **duotone**.

- Phosphor icons are filled vector paths (not CSS-strokable), so "outline width" is only
  the discrete `weight` prop (`thin`/`light`/`regular`/`bold`); there's no `medium` to
  match Geist Medium text. After weighing `regular` vs `bold`, the call was **`duotone`**.
- Set every pill icon to `weight="duotone"` — demo, generated snippet, registry
  `usageExample`, component JSDoc, and the TableShell Priority column.
- Standard in [CLAUDE.md](./CLAUDE.md) updated: *Icons in `Pill` use the Phosphor
  `duotone` weight.*
- Files: `demos/pill-demo.tsx`, `component-registry.ts`, `src/components/Pill.tsx`.

### 4. TableShell — `pill` cell variant + Priority column; heading → body-medium
**Suggestions:** "add the pill style column in the table shell" + "the table shell heading
should be of body medium size."

- **`pill` cell variant:** `Table.Cell variant="pill"` renders a semantic `Pill`
  (`pillVariant` = blue/red/amber/grey, `pillSize`, `label`, optional duotone `icon`).
  `Table` composes the DS `Pill` rather than hand-rolling.
- **Demo:** added a sortable **Priority** column to the TableShell playground
  (Critical/On Track/On Hold/Standard → danger/info/warning/neutral pills), wired into
  column customize + visibility.
- **Heading:** title dropped from `16px font-semibold` → **`14px font-medium`** (body-medium
  type style); the title icon resized `18px` → **`14px` (1:1)** to match.
- Files: `src/components/Table.tsx`, `src/components/ui/TableShell.tsx`;
  docs: `table-shell-playground.tsx`, `component-registry.ts`.

### 5. TableShell — open filter chips (`filterChips`)
**Suggestion:** "in the table shell we need … chips that will be based on the pills in the
table … like open filters rather than having the dropdown option … based on priority for
now, but … user can decide what should they be used for."

- New `filterChips?: FilterChip[]` + `filterChipsLabel?` props on `TableShell` — a row of
  **pill-style toggle chips** below the toolbar, an always-visible alternative to a filter
  dropdown. Active chip = matching Pill tonal color (reuses the `--pill-*` tokens);
  inactive = neutral outline. `<button aria-pressed>` for accessibility.
- **Generic by design:** each chip is `{ key, label, variant?, icon?, count?, active,
  onToggle }` — the consumer decides the filter dimension. Exported `FilterChip` type.
- **Demo:** the TableShell playground now derives chips from the Priority pill presets
  (with counts), filters the table on toggle, and adds a "Priority chips" chrome control.
- Files: `src/components/ui/TableShell.tsx`, `src/components/ui/index.ts`;
  docs: `table-shell-playground.tsx`, `component-registry.ts`.

### 6. TableShell — unified filter bar (`facets` model)
**Suggestion:** "three sections on top … we should not have more than 2. Can we mix the
search, dropdown and priority filters … filters could be based on insights like high demand,
this week … the user [should] have the liberty to filter based on the top ways."

- **Designed via a judge-panel workflow** (4 concepts → 3 independent judges → synthesis;
  unanimous winner: promoted quick-filter chips + a "More filters" overflow). Then a
  4-lens **adversarial review workflow** on the diff surfaced 5 real bugs, all fixed
  before finalizing.
- **One unified filter band** replaces the old toolbar + chips + active-pills bands
  (3 → ≤2 sections). Per the user's choices: dropdowns are **promoted inline**; saved-view
  **Tabs stay a standalone band** (a separate scope axis).
- **`FilterFacet` model** (`src/components/ui/facets.ts`) — a discriminated union on `kind`:
  `select` (single-select, reuses DS `Select` unmodified via a `null`↔sentinel bridge),
  `toggle-group` (multi-select, reuses the `aria-pressed` chips), and `toggle` — a
  **boolean insight** (High demand, This week, …), the extensibility primitive. The
  consumer declares their "top" filters as data (`promoted` + array order); the rest
  auto-demote into a **"More filters"** popover, sectioned by `group`. An arbitrary insight
  — even a Christy-recommended one — is one more object, zero component changes.
- New internal **`Popover`** primitive (focus-on-open, focus trap, Escape returns focus,
  outside-click) — made portal-aware so a nested `Select` doesn't tear it down.
- **Additive / backward compatible:** new `facets` / `maxInlineChips` / `moreFiltersLabel`
  props; legacy `filters` / `filterChips` / `activeFilters` still work and are ignored when
  `facets` is set (documented precedence: facets wins). Exported `FilterFacet`,
  `SelectFacet`, `ToggleGroupFacet`, `ToggleFacet`, `FacetOption`, `Popover`.
- Review fixes: cleared select showed a blank trigger (sentinel + `placeholder` on
  `SelectValue`); popover collapsed when picking a nested-select option / on Escape
  (portal-aware guards); inline `toggle-group` had no group label (added `role="group"`);
  legacy search width preserved at 480px.
- Files: `src/components/ui/facets.ts` (new), `src/components/ui/Popover.tsx` (new),
  `src/components/ui/TableShell.tsx`, `src/components/ui/index.ts`;
  docs: `table-shell-playground.tsx`, `component-registry.ts`.

---

### 7. Product Catalog — full-page TEMPLATE (composition showcase)
**Suggestion:** "consider this as a template for your design" [Figma: Iris-Shareable, node
449-4163 — a "Product Catalog" screen].

- Built a real screen composed **entirely from DS components** at
  `/playground/product-catalog` — validates the whole system end-to-end: the unified
  `TableShell` filter bar (search + Critical/High/Transfers toggle facets + an "All time"
  select), saved-view tabs (Review/On Hold/Rejected/Approved with count badges), and an
  11-column table using the `id` cell (SKU + subtitle), `pill` cells (Source neutral
  route-pill / info "CT", Exception danger/warning), a `Branch · Class` micro-pill cell, a
  2-line Order Insight (urgent subtext in `--destructive`), and a brand-tinted **Iris (AI)**
  insight column (`--text-accent`, the one place brand is allowed).
- **Component additions (both backward compatible, additive):**
  - `Table.Cell variant="id"` gained an optional **`subtitle`** (SKU + product-name pattern).
  - `Checkbox` gained **`indeterminate`** (DOM-prop via ref + a dash glyph + `aria-checked="mixed"`)
    for the select-all control. Wired into the checkbox demo + registry.
- **Reviewed via an adversarial workflow** (fidelity / correctness-a11y / compat → verify);
  fixes applied: made the "All time" select actually filter (age window), added the
  select-all indeterminate state, documented the `id` subtitle + `Checkbox` indeterminate
  in the registry. Tab badges match Figma exactly (7/1/0/5); kept the Review count at 7
  (the badge) rather than the mock footer's contradictory "1-4 of 4".
- Files: `docs/app/components/product-catalog-template.tsx` (new),
  `docs/app/playground/product-catalog/page.tsx` (new),
  `packages/design-system/src/components/Table.tsx` (id subtitle),
  `packages/design-system/src/components/Checkbox.tsx` (indeterminate);
  docs: `table-shell-demo.tsx` (link), `checkbox-demo.tsx`, `component-registry.ts`.

### 8. TableShell — search section restyled to Figma spec
**Suggestion:** "for the search section lets follow the design like this only" [Figma:
Iris-Shareable, node 449-4173].

- Restyled the unified-bar search (`FacetSearch`) to the Figma spec: **fixed 320px** box on
  sm+ (was a flex-grow field), **`rounded-[8px]`**, **regular-weight** trailing magnifier
  (was bold), and a **light neutral placeholder** (`--text-neutral`, ~Color/Neutral/400).
- **Layout to match Figma:** search sits left, all filters (promoted facets + "More" +
  "Clear all") are grouped and **right-aligned** (`sm:ml-auto`) — previously the flex-grow
  search was incidentally right-clustering them. Applies consistently to the Product Catalog
  template and the TableShell playground (shared render path).
- Border kept token-driven (`--input` #e4e4e7 ≈ Figma Border/Strong #d4d6d8 — imperceptible).
- Files: `packages/design-system/src/components/ui/TableShell.tsx`.

### 9. TableShell — removed the facet-bar "Clear all"
**Suggestion:** "clear all should not be an option on select of any filter. deselect should
do that."

- Dropped the auto-appearing **"Clear all"** link from the unified filter bar. Clearing a
  filter is now done by **deselecting** it directly — toggling an active chip off, or
  choosing the "All …" entry in a select. Removed the now-unused `handleClearAll` /
  `totalActive` / `resetFacet` usage in the band (the `resetFacet`/`facetActiveCount`
  helpers stay exported for consumers). The legacy `activeFilters` + `onClearAllFilters`
  path is unchanged.
- Files: `packages/design-system/src/components/ui/TableShell.tsx`.

### 10. Docs — Templates section (Table Shell design set)
**Suggestion:** "lets have this design set for type of table shell designs."

- Added a **Templates** docs section — a gallery of full-screen reference designs composed
  from DS components, grouped by design family. The first family is **Table Shell**, with
  **Product Catalog** as the first template (card with a real preview thumbnail, description,
  and DS-feature tags, linking to the live full-page view at `/playground/product-catalog`).
- Data-driven via a new `template-registry.ts` (`TemplateMeta` + `TEMPLATE_CATEGORIES`) so a
  new template is one registry entry + a playground page. Sidebar gained a "Templates" nav item.
- Files: `docs/lib/template-registry.ts` (new), `docs/app/(docs)/templates/page.tsx` (new),
  `docs/public/templates/product-catalog.png` (thumbnail), `docs/app/components/sidebar.tsx`
  (nav), `docs/app/playground/product-catalog/page.tsx` (back-link → /templates).

### 11. TableShell — empty / no-results made integral
**Suggestion:** "for no products or no search result, we need to make sure that is integral
part of the table shell."

- Empty handling is now **built into TableShell**: new `emptyState` (no data) and
  `noResultsState` (with `isFiltered`) props. When `totalItems === 0`, TableShell paints the
  screen **centered in the body with the column headers still visible** — the consumer just
  renders the header + rows (no rows ⇒ the empty screen shows), no hand-rolled
  `<Table.Empty>` needed. The lower-level `Table.Empty` stays available for custom bodies.
- Migrated the playground and the Product Catalog template to the integral props (each
  passes `emptyState` / `noResultsState` / `isFiltered` and just maps rows). Registry updated.
- Backward compatible: consumers that pass neither prop are unchanged.
- Files: `packages/design-system/src/components/ui/TableShell.tsx`; docs:
  `table-shell-playground.tsx`, `product-catalog-template.tsx`, `component-registry.ts`.

### 12. Checkbox — indeterminate state now gets the dark selected border
**Suggestion:** "on selected checkbox the border should be black. right now it is showing a
border color default."

- The `indeterminate` state (partial select-all) had a dark fill but no border rule, so it
  rendered with the light default border. Added `indeterminate:border-primary` alongside the
  existing `checked:border-primary` — both selected states now show the dark primary
  (`#232122`) border matching the fill.
- Files: `packages/design-system/src/components/Checkbox.tsx`.

### 13. Docs — fix unlayered `*` border reset that broke border-color utilities
**Why:** the selected-checkbox border (and entry #12's fix) still showed the default light
color. Root cause: `docs/app/globals.css` had an **unlayered** `* { border-color: var(--border) }`
reset. In CSS cascade layers, unlayered rules beat ALL `@layer` rules, so it silently
overrode every Tailwind border-color utility (`checked:border-primary`, `border-destructive`,
focus `border-black`, …). It was invisible everywhere those utilities happened to also be
`--border`-colored — only distinct ones (the checked checkbox's `#232122`) exposed it.

- Wrapped the reset in `@layer base` so utilities (in `@layer utilities`) override it again.
  The package's `styles.css` already provides this reset layered; the docs' unlayered copy was
  the culprit. Verified the served CSS now has the universal reset at layer depth 1 and no
  unlayered copy — so `checked:`/`indeterminate:border-primary` resolve to `--primary` (#232122).
- Files: `docs/app/globals.css`.

### 14. TableShell — filter cap, colored chip icons, integral Customize, unified borders
**Suggestion:** "5 max filters, rest in a dropdown; chips should have colored icons to
distinguish them; standardize Customize and make it integral (visible by default, omittable);
all borders same as the line-item borders."

- **Max 5 inline filter CONTROLS:** `maxInlineChips` default 6 → **5**, and the cap now counts
  individual controls — a multi-select group counts one slot **per option** (4 priority chips =
  4 slots), not one per facet. The rest auto-demote into the "More filters" dropdown.
  (Demoted the 4-chip Priority group in the Orders demo so it shows ≤5 controls inline.)
- **Colored chip icons:** the filter chip's leading glyph is now tinted by its semantic
  variant (`--pill-{danger,warning,info,neutral}-fg`) in BOTH states, so chips are
  distinguishable even when inactive.
- **Customize is integral:** new `customize?: boolean` (default **true**) — the GearSix
  Customize button is part of the heading and shown by default; pass `customize={false}` to
  omit. Standardized as a ghost `sm` Button (GearSix + label) everywhere. `onCustomize` is now
  just the handler.
- **Unified borders:** every TableShell divider/outline (tabs, "More filters", active-filter
  pills, inactive chips) now uses `--border-light` — the same token as the table row
  (line-item) borders.
- Files: `src/components/ui/TableShell.tsx`; docs: `table-shell-playground.tsx`
  (Customize wiring), `component-registry.ts`.

### 15. TableShell filter bar — dropdowns after chips; "More filters" as a dropdown
**Suggestion:** "the position of dropdowns should be after the chips ui, and More filters
should have dropdown ui."

- **Order:** inline facets now render **chips (toggle / toggle-group) first, then dropdowns
  (selects)** via a stable sort, regardless of the consumer's array order.
- **"More filters" dropdown UI:** restyled from a pill button to a dropdown trigger that
  matches the Select controls — `rounded-md border border-input`, `h-8`, a leading Funnel,
  the active-count badge, and a trailing `CaretDown` that rotates when open.
- Files: `src/components/ui/TableShell.tsx`.

### 16. TableShell — built-in Customize (column show/hide + reorder), standard everywhere
**Suggestion:** "the customize button is not working on the Product Catalog template; make sure
all is part of standard table shell (heading, icon, search, filters, tabs, pagination)."

- Customize was inert on the Product Catalog (it passed a no-op `onCustomize`); only the
  playground hand-rolled a working popover. Made column customization an **integral, standard**
  TableShell feature so it works the same everywhere.
- New `columns?: TableColumn[]` + `onColumnsChange?` props. When provided, the Customize button
  opens a **built-in popover** (per-column show/hide via Switch + drag-to-reorder via the
  Popover primitive); the consumer reflects the order + `hidden` flags when rendering the
  header/cells. `onCustomize` remains the fallback when `columns` is absent (backward compatible).
  Exported `TableColumn`.
- **Product Catalog template** converted to column-driven rendering + wired `columns`/
  `onColumnsChange` → Customize now works there.
- **Playground** migrated off its hand-rolled popover (+ FLIP) to the built-in one, so the
  experience is standard. (heading, icon, search, filters, tabs, pagination were already
  standard TableShell props.)
- Files: `src/components/ui/TableShell.tsx`, `src/components/ui/index.ts`; docs:
  `product-catalog-template.tsx`, `table-shell-playground.tsx`, `component-registry.ts`.

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
