# Navanta Design System — Component Reference

> Auto-generated from the design-system component registry. Every component below ships from
> the published package **`@navanta-ai/design-system`**. This file lists each component, its
> import, what it's for, and its full prop surface + interactive knobs.

## Install & import

```bash
npm install @navanta-ai/design-system
```

```ts
// import components by name from the package root:
import { Button, DataTable, TableShell /* … */ } from '@navanta-ai/design-system'

// import the compiled styles ONCE at your app root (required — ships tokens + utilities):
import "@navanta-ai/design-system/styles.css"
```

The compiled `styles.css` is **self-contained**: it ships the design tokens (light **and**
dark), the theme scale, and every utility class the components use — with **no preflight**,
so importing it will not reset your app's base styles. Dark mode follows the token set (put
your app in its dark context and the DS tokens flip automatically).

## Conventions that persist across every component

- **Semantic tokens, not hardcoded color.** Components resolve to token vars
  (`--text-primary`, `--surface-base`, `--border-default`, …). Override the tokens to
  re-theme; don't override component internals.
- **Neutral UI, brand reserved for Christy (AI).** General text/icons/chrome use neutral
  + semantic tokens. Brand color/gradient is reserved for the Christy (AI) surfaces
  (`ChristySuggestions`, the `christy` Button variant, AI-star headings).
- **New props/variants are opt-in and backward-compatible** — adding a flag never changes
  existing behavior.
- **`DataTable` is the one standard table** (declarative `columns[]` + `data[]`; each
  `Column<T>` owns its header, `cell(row, ctx)`, width, `align`, and sort). The old
  compound `Table` is **deprecated** and is removed in **v0.5.0** — build new tables on
  `DataTable`.
- **Table alignment:** every column left by default (numbers included); only the last
  column right-aligns (`DataTable`: set `align: 'right'` on it). Two-line cells
  (id+subtitle, date+subtext) render gapless.
- **`TableShell` filtering uses the `facets` model** — search + dropdowns + chips +
  insight toggles as ONE `facets={[…]}` list. These behaviors are automatic when you pass
  `facets` (they do **not** apply to the deprecated `filters`/`filterChips`/`activeFilters`
  props):
  - An **applied-filters bar** ("Filtered by:" chips + Clear All) auto-renders whenever any
    facet has a value.
  - **Search stays left, filters stay right, one row**; below ~896px of band width all
    facets collapse into a single **"Filters"** popover so nothing clips.
  - Any filter value list longer than **7** auto-adds a search field.
- **`TableShell` Customize auto-reads your columns.** Pass the SAME `columns` your
  `DataTable` renders to `TableShell.columns`; the popover lists exactly those columns,
  the **first column is fixed**, and it emits `visibleKeys` — share that one state with the
  `DataTable`'s `visibleKeys`.
- **Overlays escape overflow + collide-adjust.** `Tooltip`, `Select`, `ColumnFilterMenu`,
  and the filter popovers portal out of clipped containers and flip/clamp to the viewport;
  they share one chrome (border + `--shadow-menu`).
- **KPI cards** have token-defined spacing/height (consistent footprint in a `KpiGrid`);
  the info affordance is always the standard `Info` glyph via the `info` prop.

## Components by category

**Forms** — [Button](#button) · [Input](#input) · [Textarea](#textarea) · [Checkbox](#checkbox) · [Radio](#radio) · [Switch](#switch) · [Segmented Control](#segmented-control) · [Select](#select) · [Slider](#slider) · [Date Picker](#datepicker) · [Dropzone](#dropzone)

**Data Display** — [Pill](#pill) · [Chip](#chip) · [Card](#card) · [Accordion](#accordion) · [Tabs](#tabs) · [Data Table](#data-table) · [Bar Chart](#bar-chart) · [Line Chart](#line-chart) · [Stacked Bar Chart](#stacked-bar-chart) · [Avatar](#avatar) · [Pagination](#pagination) · [KPI](#kpi) · [Table Shell](#table-shell) · [Panel Info Grid](#panel-info-grid) · [Panel Timeline](#panel-timeline)

**Feedback** — [Dialog](#dialog) · [Toast](#toast) · [Tooltip](#tooltip) · [Skeleton](#skeleton) · [Progress](#progress) · [Empty State](#empty-state) · [Christy Suggestions](#christy-suggestions) · [Panel Alert](#panel-alert)

**Layout** — [Breadcrumbs](#breadcrumbs) · [Page Heading](#page-heading) · [Side Navigation](#side-nav) · [Detail Panel](#detail-panel)

---

## Forms

### Button

<a id="button"></a>
**Import:** `import { Button } from '@navanta-ai/design-system'`

Displays a button or a component that looks like a button. Supports multiple visual variants, sizes, and icon placements.

```tsx
import { Button } from '@navanta-ai/design-system'

export default function Example() {
  return <Button>Click me</Button>
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive' \| 'link' \| 'christy'` | `'primary'` | Controls the visual style of the button. Use "christy" for the gradient Christy CTA. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'icon'` | `'md'` | Controls the size of the button. Use "icon" for square icon-only buttons. |
| `iconLeft` | `ReactNode` | — | Icon or element rendered to the left of the label. |
| `iconRight` | `ReactNode` | — | Icon or element rendered to the right of the label. |
| `fullWidth` | `boolean` | `false` | Stretches the button to fill its container width. |
| `disabled` | `boolean` | `false` | Prevents interaction and applies muted styling. |
| `children` | `ReactNode` | — | Content rendered inside the button. |
| `className` | `string` | — | Additional CSS classes merged with the component styles. |

**Interactive knobs** (playground-configurable): `variant`, `size`, `disabled`

### Input

<a id="input"></a>
**Import:** `import { Input } from '@navanta-ai/design-system'`

A text input field with optional label, helper text, and error state support.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Accessible label rendered above the input. |
| `placeholder` | `string` | — | Placeholder text displayed when the input is empty. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height of the input field: sm (28px), md (32px), lg (36px). |
| `error` | `string \| boolean` | — | Error state. Pass a string for an error message or true to apply error styling. |
| `helperText` | `string` | — | Supplementary text displayed below the input. |
| `disabled` | `boolean` | `false` | Prevents interaction and applies muted styling. |

**Interactive knobs** (playground-configurable): `label`, `placeholder`, `size`, `error`, `disabled`

### Textarea

<a id="textarea"></a>
**Import:** `import { Textarea } from '@navanta-ai/design-system'`

A multi-line text input field with auto-resizing capability.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Accessible label rendered above the textarea. |
| `placeholder` | `string` | — | Placeholder text displayed when empty. |
| `error` | `string \| boolean` | — | Error state message or styling. |
| `helperText` | `string` | — | Supplementary text below the textarea. |
| `disabled` | `boolean` | `false` | Prevents interaction. |

**Interactive knobs** (playground-configurable): `label`, `placeholder`, `error`, `disabled`

### Checkbox

<a id="checkbox"></a>
**Import:** `import { Checkbox } from '@navanta-ai/design-system'`

A control that allows the user to toggle between checked and not checked.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Label rendered next to the checkbox. |
| `helperText` | `string` | — | Supplementary text below the label. |
| `error` | `string \| boolean` | — | Error state message or styling. |
| `indeterminate` | `boolean` | `false` | Mixed/partial state — e.g. a "select all" when only some rows are selected. Shows a dash and announces aria-checked="mixed". |
| `disabled` | `boolean` | `false` | Prevents interaction. |

**Interactive knobs** (playground-configurable): `label`, `indeterminate`, `error`, `disabled`

### Radio

<a id="radio"></a>
**Import:** `import { Radio } from '@navanta-ai/design-system'`

A control that allows the user to select a single option from a set.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Label rendered next to the radio (text). |
| `helperText` | `string` | — | Supplementary subtext below the label. |
| `card` | `boolean` | `false` | Render as a selectable card with text + subtext and a neutral tinted selected state. |
| `badge` | `ReactNode` | — | Optional badge rendered inline next to the label (card variant). |
| `error` | `string \| boolean` | — | Error state message or styling. |
| `disabled` | `boolean` | `false` | Prevents interaction. |

**Interactive knobs** (playground-configurable): `error`, `disabled`

### Switch

<a id="switch"></a>
**Import:** `import { Switch } from '@navanta-ai/design-system'`

A control that toggles a single setting on or off — a flat, fully-rounded track with a wide white pill knob (HMTX Portal / Apple HIG). On = info blue, off = neutral translucent gray. Use for instant on/off settings (for a form value that submits, prefer a Checkbox).

```tsx
import { Switch } from '@navanta-ai/design-system'
import * as React from 'react'

export default function Example() {
  const [on, setOn] = React.useState(true)
  return (
    <Switch
      label="Email notifications"
      helperText="Get notified when an order ships."
      checked={on}
      onCheckedChange={setOn}
    />
  )
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Label rendered next to the switch. |
| `helperText` | `string` | — | Supplementary text below the label. |
| `error` | `string \| boolean` | — | Error state message or styling. |
| `disabled` | `boolean` | `false` | Prevents interaction. |
| `checked` | `boolean` | — | Controlled checked state of the switch. |
| `defaultChecked` | `boolean` | `false` | Initial checked state when uncontrolled. |
| `onCheckedChange` | `(checked: boolean) => void` | — | Called when the switch is toggled. |

**Interactive knobs** (playground-configurable): `label`, `error`, `disabled`

### Segmented Control

<a id="segmented-control"></a>
**Import:** `import { SegmentedControl } from '@navanta-ai/design-system'`

A row of mutually-exclusive options in a pill track — pick one of a small set. The active segment lifts onto a white surface. Available in three sizes. Use for switching views/modes inline; for a longer list prefer Select, for form values prefer Radio.

```tsx
import { SegmentedControl } from '@navanta-ai/design-system'
import * as React from 'react'

export default function Example() {
  const [view, setView] = React.useState('list')
  return (
    <SegmentedControl
      aria-label="View"
      size="md"
      value={view}
      onValueChange={setView}
      options={[
        { value: 'list', label: 'List' },
        { value: 'board', label: 'Board' },
        { value: 'calendar', label: 'Calendar' },
      ]}
    />
  )
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `SegmentedControlOption[]` | — | The selectable segments: { value, label, disabled? }. |
| `value` | `string` | — | Controlled selected value. |
| `defaultValue` | `string` | — | Initial value when uncontrolled (defaults to the first option). |
| `onValueChange` | `(value: string) => void` | — | Called when the selection changes. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control size. |
| `radius` | `'full' \| 'lg' \| 'md' \| 'sm' \| 'none'` | `'full'` | Corner rounding of the track + segments (full = pill). |
| `fullWidth` | `boolean` | `false` | Stretch segments to equal widths across the container. |
| `disabled` | `boolean` | `false` | Disables the whole control. |
| `aria-label` | `string` | — | Accessible name for the group (recommended). |

**Interactive knobs** (playground-configurable): `size`, `radius`, `fullWidth`, `disabled`

### Select

<a id="select"></a>
**Import:** `import { Select } from '@navanta-ai/design-system'`

Displays a list of options for the user to pick from — triggered by a button.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `multiple` | `boolean` | `false` | Enable multi-select. When true, value/defaultValue/onValueChange become string[]; picking an option TOGGLES it and the menu stays open. The trigger shows the single label or "N selected". |
| `value` | `string \| string[]` | — | The controlled selected value — string in single mode, string[] when multiple. |
| `defaultValue` | `string \| string[]` | — | The default value when uncontrolled (string, or string[] when multiple). |
| `onValueChange` | `(value: string \| string[]) => void` | — | Fired when the selection changes — receives a string in single mode, the full string[] when multiple. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Trigger height — set on the Select root (inherited by SelectTrigger) or per-trigger on SelectTrigger. Matches the Input field sizes (sm=h-7, md=h-8, lg=h-9). |
| `disabled` | `boolean` | `false` | Prevents interaction. |
| `hideCheck` | `boolean` | `false` | Hide the selected-item checkmark (and its left gutter) in the dropdown list. |
| `searchable` | `boolean` | — | Show a search field at the top of the dropdown that filters options by label (query resets on close; empty groups + their labels hide; shows "No results"). Omit to auto-enable for lists longer than 7 options; set explicitly to force on/off. |
| `SelectItem icon` | `ReactNode` | — | Per-option leading glyph — pass a Phosphor icon with weight="duotone" (DS convention). Sized to the option text and mirrored on the trigger when that option is selected. |

**Interactive knobs** (playground-configurable): `size`, `searchable`, `disabled`, `hideCheck`

### Slider

<a id="slider"></a>
**Import:** `import { Slider } from '@navanta-ai/design-system'`

An input element where the user selects a value from within a given range.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number[]` | — | The controlled value array (e.g., [50] or [20, 80]). |
| `defaultValue` | `number[]` | `[0]` | The default value array. |
| `min` | `number` | `0` | The minimum allowed value. |
| `max` | `number` | `100` | The maximum allowed value. |
| `step` | `number` | `1` | The increment/decrement step. |
| `disabled` | `boolean` | `false` | Whether the slider is disabled. |
| `label` | `string` | — | An optional textual label. |
| `showValue` | `boolean` | `false` | Whether to display the exact selected value. |

**Interactive knobs** (playground-configurable): `circle`, `step`, `showValue`, `disabled`

### Date Picker

<a id="datepicker"></a>
**Import:** `import { DatePicker } from '@navanta-ai/design-system'`

A component that allows users to select a date from a calendar.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `Date \| null` | — | The selected date. |
| `onChange` | `(date: Date \| null) => void` | — | Callback when date is selected. |
| `placeholder` | `string` | `'Select date'` | Placeholder for empty state. |
| `label` | `string` | — | Input label element. |
| `helperText` | `string` | — | Instructive text below the field. |
| `error` | `string \| boolean` | — | Error message and styling trigger. |
| `disabled` | `boolean` | `false` | Whether the picker is intractable. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Trigger dimensions height. |

**Interactive knobs** (playground-configurable): `size`, `disabled`, `error`, `helperText`

### Dropzone

<a id="dropzone"></a>
**Import:** `import { Dropzone } from '@navanta-ai/design-system'`

A drag-and-drop zone for uploading files.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onFilesAdded` | `(files: File[]) => void` | — | Callback fired when files are selected or dropped. |
| `files` | `DropzoneFile[]` | — | List of currently selected files. |
| `onFileRemove` | `(id: string) => void` | — | Callback fired when a file is removed. |
| `multiple` | `boolean` | `true` | Whether multiple files can be selected. |
| `accept` | `string` | — | Comma-separated list of accepted file types (e.g., "image/*, .pdf"). |
| `maxSize` | `number` | — | Maximum file size in bytes. |
| `disabled` | `boolean` | `false` | Whether the dropzone is disabled. |
| `label` | `string` | `'Click or drag files to upload'` | Primary textual instruction. |
| `description` | `string` | — | Secondary instructional text. |

**Interactive knobs** (playground-configurable): `multiple`, `disabled`

---

## Data Display

### Pill

<a id="pill"></a>
**Import:** `import { Pill } from '@navanta-ai/design-system'`

A compact status tag — soft tinted background with strong tonal text and an optional leading icon. Four semantic variants (info=blue, danger=red, warning=amber, neutral=grey) across three sizes. Each variant is a 50/800 tonal pair; the danger pair is the exact Figma spec (Iris-Shareable "Stable Table Cell"). Use for status, counts, and labels — keep brand color reserved for Christy (AI) chrome.

```tsx
import { Pill } from '@navanta-ai/design-system'
// Pill icons use the Phosphor duotone weight.
import { WarningCircle } from '@phosphor-icons/react'

export default function Example() {
  return (
    <Pill variant="danger" size="sm" icon={<WarningCircle weight="duotone" />}>
      Critical
    </Pill>
  )
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'info' \| 'danger' \| 'warning' \| 'neutral'` | `neutral` | Semantic tone — blue / red / amber / grey. |
| `size` | `'sm' \| 'md' \| 'lg'` | `sm` | Pill size. Small matches the Figma table-cell spec. |
| `icon` | `React.ReactNode` | — | Optional leading icon (SVG/Phosphor glyph); scales to the pill size. |
| `children` | `React.ReactNode` | — | The pill label. |

**Interactive knobs** (playground-configurable): `variant`, `size`, `label`, `icon`

### Chip

<a id="chip"></a>
**Import:** `import { Chip } from '@navanta-ai/design-system'`

A compact, toggleable filter/selection control in a fully-rounded shape. Unselected chips sit on a white surface with a default border; selecting fills with the secondary surface and a strong border. The leading icon is tinted by variant (blue/red/amber/grey) and the trailing count renders in its own rounded container. Used by TableShell’s filter chips, but standalone.

```tsx
import { Chip } from '@navanta-ai/design-system'
import { WarningCircle } from '@phosphor-icons/react'
import * as React from 'react'

export default function Example() {
  const [on, setOn] = React.useState(false)
  return (
    <Chip
      variant="danger"
      selected={on}
      count={4}
      icon={<WarningCircle weight="duotone" />}
      onClick={() => setOn((v) => !v)}
    >
      Critical
    </Chip>
  )
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `selected` | `boolean` | `false` | Selected/pressed state — shown with a strong border (aria-pressed). |
| `variant` | `'info' \| 'danger' \| 'warning' \| 'neutral'` | `neutral` | Tints the leading icon by semantic (blue/red/amber/grey). |
| `icon` | `React.ReactNode` | — | Leading icon — a duotone Phosphor glyph. |
| `count` | `number` | — | Optional trailing count — rendered in its own rounded container. |
| `children` | `React.ReactNode` | — | Chip label. |
| `onClick` | `() => void` | — | Toggle handler (Chip is a <button>). |

**Interactive knobs** (playground-configurable): `variant`, `selected`, `label`, `count`, `icon`

### Card

<a id="card"></a>
**Import:** `import { Card } from '@navanta-ai/design-system'`

A container component with header, content, and footer slots for grouping related content.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `hoverable` | `boolean` | `false` | Adds a shadow lift effect on hover. |
| `className` | `string` | — | Additional CSS classes for custom styling. |
| `children` | `ReactNode` | — | Content rendered inside the card. Use CardHeader, CardContent, CardFooter sub-components. |

**Interactive knobs** (playground-configurable): `view`, `hoverable`

### Accordion

<a id="accordion"></a>
**Import:** `import { Accordion } from '@navanta-ai/design-system'`

A vertically stacked set of interactive headings that each reveal a section of content.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `AccordionItem[]` | — | Array of items containing title, content, and disabled state. |
| `variant` | `'default' \| 'bordered' \| 'separated'` | `'default'` | Visual style of the accordion. |
| `multiple` | `boolean` | `false` | Allows multiple items to be open at once. |

**Interactive knobs** (playground-configurable): `variant`, `multiple`, `disabled`

### Tabs

<a id="tabs"></a>
**Import:** `import { Tabs } from '@navanta-ai/design-system'`

A set of layered sections of content—known as tab panels—that are displayed one at a time.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tabs` | `TabItem[]` | — | Array of tabs: { id, label, disabled?, badge?, icon?, tone? }. Pass `icon` (a Phosphor-style icon component) to render a leading icon alongside the label — supported in every variant. |
| `activeTab` | `string` | — | Id of the controlled active tab. |
| `onChange` | `(id: string) => void` | — | Callback fired when a tab is clicked. |
| `variant` | `'underline' \| 'pills' \| 'bordered'` | `'underline'` | Visual style of the tabs. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the tabs. |
| `fullWidth` | `boolean` | `false` | Stretches tabs to fill container width. |

**Interactive knobs** (playground-configurable): `variant`, `size`, `icons`, `fullWidth`, `disabled`

### Data Table

<a id="data-table"></a>
**Import:** `import { DataTable } from '@navanta-ai/design-system'`

The standard DS table — declarative `columns[]` + `data[]` as the single source of truth for headers and cells. Each column defines its own cell renderer, width, alignment, and sort. Supports row selection (checkbox slot), leading/trailing slot columns (star, actions), grouped rendering, client or controlled sort, loading/empty states, mobile cards, and footer. (Replaces the deprecated compound `Table`, removed in v0.5.0.)

```tsx
import { DataTable, type DataTableColumn } from '@navanta-ai/design-system'

type Order = { id: string; party: string; qty: number }

const columns: DataTableColumn<Order>[] = [
  { key: 'id', label: 'Order', cell: (r) => r.id },
  { key: 'party', label: 'Ship to', cell: (r) => r.party },
  { key: 'qty', label: 'Qty', align: 'right', sortable: true, cell: (r) => r.qty },
]

export default function Example() {
  return (
    <DataTable
      columns={columns}
      data={[{ id: 'PO-1001', party: 'Acme Co', qty: 12 }]}
      rowKey={(r) => r.id}
      sortMode="client"
    />
  )
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `Column<T>[]` | — | Declarative columns — single source of truth for header + cell. Each: key, label, cell(row, ctx) [required], width? (px \| "NN%"), minWidth?/maxWidth?, align? (left/right/center), sortable?, sortKey?, headerCell?, cellClassName?, wrapLines? (1\|2), caretSide?, alwaysVisible?. |
| `data` | `T[]` | — | Flat rows. Mutually exclusive with groups. |
| `groups` | `GroupConfig<T>[]` | — | Grouped/sectioned rows — a full-width band above each group, shared colgroup so columns align. |
| `rowKey` | `(row: T) => string` | — | Stable per-row key. Required. |
| `selection` | `SelectionConfig<T>` | — | { selected, onToggleRow, onToggleAll, isRowDisabled? } — adds a left checkbox slot column automatically. |
| `sort / onSortChange / sortMode` | `SortState, fn, 'client' \| 'controlled'` | — | Sorting. 'client' sorts flat data internally; 'controlled' (default) defers to the caller. |
| `leadingSlots / trailingSlots` | `SlotColumn<T>[]` | — | Non-data columns (star, expand chevron, actions menu) before/after the data columns. |
| `visibleKeys` | `string[]` | — | Ordered visible column keys — both filters AND reorders: columns render in this array’s order, not the columns[] order. Define columns once and swap visibleKeys per variant instead of building multiple column arrays. |
| `isRowExpanded / renderNestedRow / nestedRowClassName` | `(row) => boolean, (row, ctx) => ReactNode, string` | — | Expandable/nested rows: renderNestedRow is rendered as a full-colspan <tr> directly under any row where isRowExpanded returns true — for inline sub-row editors, detail panels, or nested content. nestedRowClassName styles that <td>. |
| `rowActions / alwaysShowRowActions` | `(row, ctx) => ReactNode, boolean` | — | Hover-reveal action cluster pinned to the row’s trailing edge (gradient-masked overlay in the last cell), shown on row hover/focus; alwaysShowRowActions keeps it visible. Clicks don’t bubble to onRowClick. |
| `renderBulkBar` | `(selectedRows: T[]) => ReactNode` | — | Sticky bulk-action bar rendered above the table whenever the selection is non-empty. Requires selection. |
| `Column.stopRowClick` | `boolean (per column)` | — | Set on a data column so clicks in that cell (a Select/dropdown, inline input) don’t bubble to onRowClick. |
| `GroupConfig.emptyState` | `ReactNode (per group)` | — | Rendered as a full-width row under a group’s band when that group has zero rows after filtering — per-group empty messaging. |
| `ColumnFilterMenu` | `component` | — | Column-header filter + sort popover (funnel icon → Sort A→Z/Z→A + a checkbox filter list), portaled with viewport flip/clamp and the shared DS Popover chrome (border + --shadow-menu). Lists longer than 7 values auto-gain a search field (list scrolls internally). Render it from a column’s headerCell. Fully controlled — bind its selected/onToggle/onClear to the same state as a TableShell toggle-group facet and the applied filter reflects in the filter band above the table. |
| `isLoading / loadingRowCount / emptyState` | `boolean, number, ReactNode` | — | Skeleton rows while loading; emptyState renders when there are no rows. |
| `onRowClick / isRowClickable / rowClassName / rowStyle / rowHoverColor` | `fns` | — | Per-row interactivity and styling hooks. |
| `rowHeight / headerHeight` | `number \| "auto", number` | — | Fixed row height (px) or "auto" for multi-line content. |
| `renderMobileCard / mobileEmpty` | `(row, ctx) => ReactNode` | — | Responsive card layout below the table breakpoint. |
| `footer` | `ReactNode \| cells[]` | — | Footer row content (totals, etc.). |
| `appearance` | `headerVariant, headerBg, cellPaddingX, rowHoverBg, …` | — | Visual knobs to match house styles. headerVariant: 'default' \| 'filled' \| 'capsule'. |

**Interactive knobs** (playground-configurable): `headerVariant`, `selectable`, `loading`

### Bar Chart

<a id="bar-chart"></a>
**Import:** `import { BarChart } from '@navanta-ai/design-system'`

A categorical bar graph for comparing values across labels.

```tsx
import { BarChart } from '@navanta-ai/design-system'

const data = [
  { label: 'Mon', value: 24 },
  { label: 'Tue', value: 18 },
  { label: 'Wed', value: 32 },
  { label: 'Thu', value: 28 },
  { label: 'Fri', value: 40 },
]

export default function Example() {
  return <BarChart data={data} color="var(--chart-2)" showValueLabels />
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `ChartDatum[]` | — | Data points containing label and numeric value. |
| `height` | `number` | `220` | Chart height in pixels. |
| `color` | `string` | `'var(--chart-2)'` | Bar fill color. |
| `accessibilityMode` | `'default' \| 'colorblind-safe'` | `'default'` | Applies pattern overlays and outlines for color-blind-safe readability. |
| `showGrid` | `boolean` | `true` | Shows horizontal grid lines. |
| `showYAxisLabels` | `boolean` | `true` | Shows Y-axis value labels. |
| `showValueLabels` | `boolean` | `false` | Shows values above bars. |

**Interactive knobs** (playground-configurable): `dataset`, `color`, `accessibilityMode`, `showGrid`, `showYAxisLabels`, `showValueLabels`

### Line Chart

<a id="line-chart"></a>
**Import:** `import { LineChart } from '@navanta-ai/design-system'`

A trend line graph for visualizing changes over time.

```tsx
import { LineChart } from '@navanta-ai/design-system'

const data = [
  { label: 'Jan', value: 18 },
  { label: 'Feb', value: 22 },
  { label: 'Mar', value: 28 },
  { label: 'Apr', value: 24 },
  { label: 'May', value: 34 },
  { label: 'Jun', value: 38 },
]

export default function Example() {
  return <LineChart data={data} lineColor="var(--chart-3)" showArea />
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `ChartDatum[]` | — | Data points containing label and numeric value. |
| `height` | `number` | `220` | Chart height in pixels. |
| `lineColor` | `string` | `'var(--chart-3)'` | Line stroke color. |
| `showArea` | `boolean` | `true` | Renders an area fill below the line. |
| `smooth` | `boolean` | `true` | Uses curved interpolation between points. |
| `showPoints` | `boolean` | `true` | Shows point markers on each data point. |

**Interactive knobs** (playground-configurable): `dataset`, `color`, `showGrid`, `showArea`, `smooth`, `showPoints`

### Stacked Bar Chart

<a id="stacked-bar-chart"></a>
**Import:** `import { StackedBarChart } from '@navanta-ai/design-system'`

A segmented bar graph to show part-to-whole composition inside each category.

```tsx
import { StackedBarChart } from '@navanta-ai/design-system'

const data = [
  {
    label: 'Claims Requested',
    segments: [
      { label: 'Damage', value: 3, color: 'var(--chart-1)' },
      { label: 'Warranty', value: 4, color: 'var(--chart-2)' },
      { label: 'Missing Items', value: 6, color: 'var(--chart-3)' },
    ],
  },
]

export default function Example() {
  return (
    <StackedBarChart
      data={data}
      showLegend
      showTotals
      accessibilityMode="colorblind-safe"
    />
  )
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `StackedChartDatum[]` | — | Array of bars; each bar has multiple labeled segments. |
| `height` | `number` | `240` | Chart height in pixels. |
| `showLegend` | `boolean` | `true` | Shows segment legend below chart. |
| `showTotals` | `boolean` | `false` | Shows total value above each stacked bar. |
| `showGrid` | `boolean` | `true` | Shows horizontal grid lines. |
| `accessibilityMode` | `'default' \| 'colorblind-safe'` | `'default'` | Applies patterns and outlines for color-blind-safe reading. |

**Interactive knobs** (playground-configurable): `dataset`, `showLegend`, `showTotals`, `showGrid`, `accessibilityMode`

### Avatar

<a id="avatar"></a>
**Import:** `import { Avatar } from '@navanta-ai/design-system'`

An image element with a fallback for representing the user.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | — | The image source URL. |
| `alt` | `string` | `'Avatar'` | Alternative screen reader text. |
| `initials` | `string` | — | Initials to show if the image is missing. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size of the avatar. |
| `shape` | `'circle' \| 'square'` | `'circle'` | Shape of the avatar. |
| `status` | `'online' \| 'offline' \| 'away' \| 'busy' \| 'none'` | — | An optional status indicator bubble. |

**Interactive knobs** (playground-configurable): `size`, `shape`, `status`

### Pagination

<a id="pagination"></a>
**Import:** `import { Pagination } from '@navanta-ai/design-system'`

Allows the user to select a specific page from a range of pages.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `total` | `number` | — | Total number of data items. |
| `page` | `number` | — | The current active page. |
| `onChange` | `(page: number) => void` | — | Callback fired when page changes. |
| `pageSize` | `number` | `10` | Number of items per page. |
| `siblingCount` | `number` | `1` | Number of pages to show around current page before folding. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the pagination items. |
| `showEdges` | `boolean` | `true` | Whether to show previous/next buttons. |

**Interactive knobs** (playground-configurable): `total`, `size`, `siblingCount`, `showEdges`

### KPI

<a id="kpi"></a>
**Import:** `import { KpiStatCard } from '@navanta-ai/design-system'`

Dashboard-ready key performance indicator cards for stat, progress, comparison, and breakdown use cases.

```tsx
import { Info } from '@phosphor-icons/react'
import { KpiGrid, KpiProgressCard, KpiStatCard, Tooltip } from '@navanta-ai/design-system'

const infoIcon = (
  <Tooltip content="More info">
    <Info size={14} weight="regular" />
  </Tooltip>
)

export default function Example() {
  return (
    <KpiGrid columns={2}>
      <KpiStatCard
        title="Open Orders"
        value="$18"
        change="+3 vs last month"
        trend="up"
        icon={infoIcon}
      />

      <KpiProgressCard
        title="Credit Balance"
        value="$728K"
        subtitle="78.5% of $1M credit limit used"
        progress={78.5}
        progressGradient="linear-gradient(to left, #DE1010 0%, rgba(222,16,16,0.4) 17.788%, rgba(222,16,16,0.4) 100%)"
        icon={infoIcon}
      />
    </KpiGrid>
  )
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `KpiStatCard` | `Component` | — | Shows title, value, trend delta, and optional sparkline/icon. |
| `KpiProgressCard` | `Component` | — | Shows KPI value with a progress bar and completion label. |
| `KpiBreakdownCard` | `Component` | — | Vertical stack of title + value + a single-line breakdown/detail line (subtitle) in primary text. Token-defined padding/min-height/gap; `info` (boolean \| string) shows the standard, non-replaceable Info icon (string = tooltip). No trend or progress. |
| `KpiComparisonCard` | `Component` | — | Shows current value with a previous-period comparison row. |
| `KpiTrendBadge` | `Component` | — | Compact trend badge for up/down/neutral states. |
| `KpiGrid` | `Component` | — | Responsive KPI layout grid with 1-4 column options. |

**Interactive knobs** (playground-configurable): `variant`, `cardWidth`, `trend`, `label`, `number`, `percentage`, `progressColor`, `showInfo`

### Table Shell

<a id="table-shell"></a>
**Import:** `import { TableShell } from '@navanta-ai/design-system'`

Reusable table chrome — a titled container with a unified filter bar (search + dropdowns + chips + insight filters via the `facets` model), a table body, and a footer with item count, pagination, and page-size controls. Saved-view tabs stay a separate axis.

```tsx
import { TableShell, Table, Input } from '@navanta-ai/design-system'
import { Package } from '@phosphor-icons/react'
import * as React from 'react'

export default function Example() {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  return (
    <TableShell
      title="Open Orders"
      icon={Package}
      totalItems={orders.length}
      currentPage={page}
      onPageChange={setPage}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
    >
      <Table>{/* ...rows */}</Table>
    </TableShell>
  )
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Table title shown in the header. |
| `icon` | `Icon` | — | Phosphor icon rendered next to the title. |
| `totalItems` | `number` | — | Total filtered item count (drives pagination). |
| `currentPage` | `number` | — | Current page (1-based). |
| `onPageChange` | `(page: number) => void` | — | Page change handler. |
| `pageSize` | `number` | — | Items per page. |
| `onPageSizeChange` | `(size: number) => void` | — | Page size change handler. |
| `pageSizeOptions` | `number[]` | `[10, 25, 50]` | Available page size options. |
| `searchValue / onSearchChange` | `string / (v) => void` | — | Providing onSearchChange renders the built-in toolbar search (consumer owns filtering). |
| `searchPlaceholder` | `string` | `'Search'` | Placeholder for the built-in search field. |
| `facets` | `FilterFacet[]` | — | UNIFIED filter bar (recommended) — search + dropdowns + chips + insight filters as ONE band. A FilterFacet is kind:"select" (single-select, reuses Select), kind:"toggle-group" (multi-select chips), or kind:"toggle" (a boolean insight like "High demand"/"This week"). promoted shows inline; the rest auto-collapse into a "More filters" popover. Array order = layout order; group sections the popover. Consumer-declared insight facets need zero component changes. When set, the legacy filters/filterChips/activeFilters props are ignored. |
| `maxInlineChips` | `number` | `5` | Max inline filter CONTROLS before the rest demote into the "More filters" dropdown — a multi-select group counts one control per option. |
| `moreFiltersLabel` | `ReactNode` | `'More filters'` | Trigger label for the overflow popover. |
| `filters` | `ReactNode` | — | DEPRECATED (prefer facets). Filter controls at the right of the toolbar (e.g. Select dropdowns). |
| `activeFilters` | `ActiveFilter[]` | — | DEPRECATED (prefer facets). Active filters as removable pills. Each item has key, label, value, onRemove. |
| `onClearAllFilters` | `() => void` | — | Called when "Clear all" is clicked (also fired for facets after each facet is reset). |
| `filterChips` | `FilterChip[]` | — | DEPRECATED (prefer a facets toggle-group). Open pill-style toggle chips. Each chip has key, label, variant?, icon?, count?, active, onToggle. |
| `filterChipsLabel` | `ReactNode` | — | DEPRECATED. Optional leading label for the legacy filter chip row. |
| `tabs / activeTab / onTabChange` | `TabItem[] / string / (id) => void` | — | Optional tab row for quick filtering, with count badges (TabItem.badge). |
| `customize` | `boolean` | `true` | The Customize action (gear) is integral to the heading and shown by default. Set false to omit it. |
| `columns` | `readonly TableColumn[]` | — | Provide columns to get the BUILT-IN Customize popover (per-column show/hide + drag-reorder), auto-populated from this list — pass the SAME columns your table renders (a DataTable’s Column[] is assignable directly: shared key/label/alwaysVisible). The FIRST column is FIXED (always shown, not reorderable). TableColumn = { key, label, hideable?, hidden?, alwaysVisible? }. |
| `visibleKeys / onVisibleKeysChange` | `string[] / (keys) => void` | — | STANDARD controlled model, shared with DataTable’s visibleKeys: Customize edits emit the next ordered visible keys — feed the same state to your DataTable. Visibility = membership; order = the array (hidden columns listed after). Prefer this over onColumnsChange. |
| `onColumnsChange` | `(cols: TableColumn[]) => void` | — | LEGACY alternative to visibleKeys — emits the columns with mutated hidden flags + new order. Used only when visibleKeys is not set. Reflect the order + hidden flags when you render the header + cells. |
| `onCustomize / customizeLabel` | `() => void / string` | — | customizeLabel sets the button text. onCustomize is the fallback handler used only when columns is NOT provided. |
| `header` | `ReactNode` | — | Extra header slot above the body (filter chips, banners). |
| `emptyState / noResultsState` | `ReactNode` | — | INTEGRAL empty handling. When totalItems === 0, TableShell paints the screen centered with column headers still visible — emptyState for no data, noResultsState when isFiltered. Pass an <EmptyState>; render just the header (no rows) in children. |
| `isFiltered` | `boolean` | — | Whether search/filters are active — selects noResultsState over emptyState. |
| `children` | `ReactNode` | — | The table — a <Table> with header + rows. When totalItems === 0, render just the header; TableShell shows emptyState/noResultsState. (Table.Empty still works for fully custom bodies.) |

### Panel Info Grid

<a id="panel-info-grid"></a>
**Import:** `import { PanelInfoGrid } from '@navanta-ai/design-system'`

A label-value grid for detail panels, with optional leading icons and clickable link values.

```tsx
import { PanelInfoGrid } from '@navanta-ai/design-system'
import { Package, Truck } from '@phosphor-icons/react'

export default function Example() {
  return (
    <PanelInfoGrid
      title="Order details"
      rows={[
        { label: 'Order', value: 'ORD-1847', icon: Package },
        { label: 'Carrier', value: 'FedEx', icon: Truck },
        { label: 'Tracking', value: 'Open', link: true, href: '#' },
      ]}
    />
  )
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Section title above the grid. |
| `rows` | `InfoRow[]` | — | Rows with label, value, optional icon, and optional link/href. |

### Panel Timeline

<a id="panel-timeline"></a>
**Import:** `import { PanelTimeline } from '@navanta-ai/design-system'`

A vertical status timeline for detail panels, with colour-coded milestone dots, connectors, dates, and event notes.

```tsx
import { PanelTimeline } from '@navanta-ai/design-system'

const milestones = [
  { id: 'ordered', label: 'Ordered', status: 'completed', date: 'May 3', events: [{ type: 'PO issued', date: 'May 3', severity: 'info' }] },
  { id: 'shipped', label: 'Shipped', status: 'active', date: 'May 7', events: [{ type: 'In transit', date: 'May 7', severity: 'warning', note: 'Weather delay' }] },
  { id: 'delivered', label: 'Delivered', status: 'pending', events: [] },
]

export default function Example() {
  return <PanelTimeline title="Delivery progress" milestones={milestones} />
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `'Delivery Status'` | Section title above the timeline. |
| `milestones` | `TimelineMilestone[]` | — | Ordered milestones with status, date, and events. |
| `idPrefix` | `string` | `'ptl'` | Unique prefix for SVG gradient ids to avoid collisions. |

---

## Feedback

### Dialog

<a id="dialog"></a>
**Import:** `import { Dialog } from '@navanta-ai/design-system'`

A modal window that overlays either the primary window or another dialog window.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Controlled open state. |
| `onClose` | `function` | — | Callback fired when the dialog should close. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Maximum width of the dialog. |
| `closeOnOverlay` | `boolean` | `true` | Closes dialog when clicking overlay. |
| `closeOnEscape` | `boolean` | `true` | Closes dialog when pressing Escape. |
| `showCloseButton` | `boolean` | `true` | Shows an optional close button in the top-right corner. |

**Interactive knobs** (playground-configurable): `size`, `closeOnOverlay`

### Toast

<a id="toast"></a>
**Import:** `import { Toast } from '@navanta-ai/design-system'`

A succinct message that is displayed temporarily.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Visual intent of the toast. |
| `title` | `string` | — | Primary title. |
| `message` | `string` | — | Sub-message or description. |
| `duration` | `number` | `5000` | Milliseconds before auto-dismissal. 0 to disable. |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' \| 'top-center' \| 'bottom-center'` | `'bottom-right'` | Screen position where the toast appears. |
| `onClose` | `function` | — | Callback fired when dismissed. |

**Interactive knobs** (playground-configurable): `type`, `title`, `message`, `duration`, `position`

### Tooltip

<a id="tooltip"></a>
**Import:** `import { Tooltip } from '@navanta-ai/design-system'`

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `ReactNode` | — | The content to display inside the tooltip. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | The preferred side of the trigger to render against when open. |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | The preferred alignment against the trigger. |
| `delay` | `number` | `300` | Duration in milliseconds before the tooltip appears. |
| `variant` | `'default' \| 'inverse'` | `'default'` | Both use the theme-inverse surface (dark bubble in light theme, light in dark theme). inverse adds the HMTX curved pointer aimed at the trigger (SideNav rail style); default is a plain bubble. The tooltip is portaled to <body>, so an overflow:hidden ancestor never clips it. |

**Interactive knobs** (playground-configurable): `variant`, `side`, `align`, `delay`

### Skeleton

<a id="skeleton"></a>
**Import:** `import { Skeleton } from '@navanta-ai/design-system'`

Displays a placeholder preview of content before the data gets loaded to reduce load-time frustration.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'text' \| 'circular' \| 'rectangular' \| 'rounded'` | `'text'` | The visual style of the skeleton. |
| `width` | `string \| number` | — | Overrides the default width. |
| `height` | `string \| number` | — | Overrides the default height. |
| `count` | `number` | `1` | Number of repeating skeleton lines to render. |
| `animate` | `boolean` | `true` | Whether to show the pulse animation. |

**Interactive knobs** (playground-configurable): `variant`, `animate`

### Progress

<a id="progress"></a>
**Import:** `import { Progress } from '@navanta-ai/design-system'`

Displays an indicator showing the completion progress of a task.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | — | The progress value. |
| `max` | `number` | `100` | The maximum progress value. |
| `variant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'neutral'` | `'default'` | Visual style of the progress bar (neutral = black/charcoal). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height of the linear progress track. |
| `indeterminate` | `boolean` | `false` | Whether the progress is indeterminate. |
| `showLabel` | `boolean` | `false` | Whether to display the percentage label. |
| `striped` | `boolean` | `false` | Adds zebra stripes to the linear progress bar. |
| `disabled` | `boolean` | `false` | Muted, non-interactive state — fill switches to the neutral grey gradient. |

**Interactive knobs** (playground-configurable): `variant`, `size`, `circularSize`, `striped`, `indeterminate`, `disabled`, `showLabel`

### Empty State

<a id="empty-state"></a>
**Import:** `import { EmptyState } from '@navanta-ai/design-system'`

A centered "nothing here" screen with an optional nested-ring icon, title, description, an optional inline link, and an action. Use it for first-time/empty states (offer a primary CTA) and no-results states (offer a way to clear). TableShell renders it automatically when a table is empty.

```tsx
import { EmptyState, Button } from '@navanta-ai/design-system'
import { Package } from '@phosphor-icons/react'

export default function Example() {
  return (
    <EmptyState
      icon={<Package />}
      title="No orders yet"
      description="When orders come in, they'll appear here."
      action={<Button size="sm">New order</Button>}
    />
  )
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `ReactNode` | — | Optional icon shown inside concentric rings (pass a sized node, e.g. <Star weight="duotone" />). Rendered at 32px. |
| `title` | `string` | — | Headline (18px semibold). |
| `description` | `ReactNode` | — | Supporting line(s) below the title (14px). |
| `link` | `{ label: string; onClick?: () => void; href?: string }` | — | A text link rendered directly under the description (medium, underlined, --text-link). Use for "search instead" affordances; for a Button CTA use action. |
| `action` | `ReactNode` | — | Optional separated action area below — typically a Button (primary CTA or "Clear filters"). |
| `size` | `'sm' \| 'md'` | `'md'` | Vertical padding scale. |

### Christy Suggestions

<a id="christy-suggestions"></a>
**Import:** `import { ChristySuggestions } from '@navanta-ai/design-system'`

An AI recommendation card branded with Christy. Supports selection (radio cards), static, and confirmed states, with optional reasoning and summary.

```tsx
import { ChristySuggestions } from '@navanta-ai/design-system'
import * as React from 'react'

export default function Example() {
  const [selectedIdx, setSelectedIdx] = React.useState(0)
  return (
    <ChristySuggestions
      mode="selection"
      summary="Christy recommends expediting through the secondary vendor."
      options={[
        { label: 'Expedite via Globex', detail: '+$120 freight · arrives Fri', credit: 'Recommended' },
        { label: 'Wait for primary vendor', detail: 'No added cost · arrives next Wed' },
      ]}
      recommendedIdx={0}
      selectedIdx={selectedIdx}
      onSelect={setSelectedIdx}
      onConfirm={() => {}}
    />
  )
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `'selection' \| 'static' \| 'confirmed'` | — | Which state the card renders. |
| `options` | `SuggestionOption[]` | — | Selectable options (selection mode). |
| `selectedIdx` | `number` | — | Currently selected option index (selection mode). |
| `onSelect` | `(idx: number) => void` | — | Called when an option is selected. |
| `onConfirm` | `() => void` | — | Called when the confirm button is pressed. |
| `recommendedIdx` | `number` | — | Index of the recommended option (highlighted). |
| `confirmLabel` | `string` | `'Confirm Selection'` | Confirm button label. |
| `phase` | `'idle' \| 'confirming' \| 'confirmed'` | `'idle'` | Confirmation phase for loading/success states. |
| `reasoning` | `string[]` | — | Reasoning lines shown below the recommendation. |
| `summary` | `string` | — | Summary text describing the recommendation. |
| `confirmedLabel` | `string` | — | What was confirmed (confirmed mode). |

### Panel Alert

<a id="panel-alert"></a>
**Import:** `import { PanelAlert } from '@navanta-ai/design-system'`

A colour-coded alert block for detail panels, with an icon, title, and description.

```tsx
import { PanelAlert } from '@navanta-ai/design-system'

export default function Example() {
  return (
    <PanelAlert
      type="warning"
      title="Shipment delayed"
      description="Carrier reported a weather hold in transit."
    />
  )
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'danger' \| 'warning' \| 'info' \| 'success' \| 'cancelled'` | — | Severity, which drives colour and icon. |
| `title` | `string` | — | Alert title. |
| `description` | `string` | — | Description text below the title. |

**Interactive knobs** (playground-configurable): `type`

---

## Layout

### Breadcrumbs

<a id="breadcrumbs"></a>
**Import:** `import { Breadcrumbs } from '@navanta-ai/design-system'`

Displays the path to the current resource using a hierarchy of links.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | — | Array of items with label, href, and onClick handler. |
| `maxItems` | `number` | — | Maximum number of items to show before collapsing inner items with ellipsis. |
| `separator` | `ReactNode` | — | Custom separator element. |

**Interactive knobs** (playground-configurable): `maxItems`

### Page Heading

<a id="page-heading"></a>
**Import:** `import { PageHeading } from '@navanta-ai/design-system'`

A page header with the large Christy AI star (single four-point spark, AiStar variant="large"), a neutral title, and a subtitle. Used at the top of a view.

```tsx
import { PageHeading } from '@navanta-ai/design-system'

export default function Example() {
  return <PageHeading title="Order Dashboard" subtitle="Track shipments and resolve claims in one place" />
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Page title (neutral text-primary). |
| `subtitle` | `string` | — | Subtitle below the title (neutral text-secondary). |

**Interactive knobs** (playground-configurable): `title`, `subtitle`

### Side Navigation

<a id="side-nav"></a>
**Import:** `import { SideNav } from '@navanta-ai/design-system'`

The standard portal side navigation (from the HMTX portal): a 48px collapsed icon rail with tooltips that is always visible, plus a 256px expanded panel that slides over it with a backdrop. Grouped sections with uppercase labels, Phosphor icons (bold at rest, fill when active), a settings gear, and a user block that anchors a profile menu.

```tsx
import { SideNav } from '@navanta-ai/design-system'
import { SquaresFour, Package } from '@phosphor-icons/react'
import * as React from 'react'

export default function Example() {
  const [activeKey, setActiveKey] = React.useState('dashboard')
  return (
    <SideNav
      sections={[
        {
          label: 'Core Operations',
          items: [
            { key: 'dashboard', label: 'Dashboard', icon: SquaresFour },
            { key: 'orders', label: 'Order Tracking', icon: Package, href: '/orders' },
          ],
        },
      ]}
      activeKey={activeKey}
      onNavigate={(item) => setActiveKey(item.key)}
      user={{ name: 'John Smith', description: 'Portal Admin', initials: 'JS' }}
      onUserClick={(anchor) => {/* open profile dropdown */}}
      onSettingsClick={() => {/* go to account settings */}}
    />
  )
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sections` | `SideNavSection[]` | — | Grouped nav items: { label?, items: { key, label, icon, href? }[] }. Icons are Phosphor components (rendered bold; fill when active). |
| `activeKey` | `string` | — | key of the active item — gets the active fill and icon treatment. |
| `onNavigate` | `(item: SideNavItem) => void` | — | Called on item click (also collapses the expanded panel). |
| `expanded` | `boolean` | — | Controlled expanded state; pair with onExpandedChange. Omit for uncontrolled (defaultExpanded). |
| `defaultExpanded` | `boolean` | `false` | Uncontrolled initial expanded state. |
| `onExpandedChange` | `(expanded: boolean) => void` | — | Fires when the panel expands/collapses. |
| `logo` | `React.ReactNode` | — | Expanded-panel logo (full wordmark). |
| `logoCollapsed` | `React.ReactNode` | — | Rail logo (monogram). |
| `user` | `SideNavUser` | — | { name, description?, initials?, avatarSrc?, color? } — renders the bottom user block. |
| `onUserClick` | `(anchor: 'rail' \| 'panel') => void` | — | User block click — anchor tells which surface to anchor a profile dropdown to. |
| `onSettingsClick` | `() => void` | — | Renders the gear button on the rail when provided. |
| `overlayIn` | `'viewport' \| 'container'` | `'viewport'` | Whether the expanded panel + backdrop overlay the viewport (fixed) or the nearest positioned ancestor (absolute). |

**Interactive knobs** (playground-configurable): `expanded`, `user`, `settings`

### Detail Panel

<a id="detail-panel"></a>
**Import:** `import { DetailPanelShell } from '@navanta-ai/design-system'`

A slide-out right-side panel (drawer) with a header, optional actions and status row, scrollable content, and a sticky footer. Compose panel parts inside it.

```tsx
import { DetailPanelShell, PanelInfoGrid, Button } from '@navanta-ai/design-system'
import * as React from 'react'

export default function Example() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>View order</Button>
      <DetailPanelShell
        open={open}
        onClose={() => setOpen(false)}
        title="ORD-1847"
        subtitle="Delivery Tracking · $4,980.00"
      >
        <PanelInfoGrid title="Order details" rows={[{ label: 'Carrier', value: 'FedEx' }]} />
      </DetailPanelShell>
    </>
  )
}
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Controls panel visibility. |
| `onClose` | `() => void` | — | Called on close button or backdrop click. |
| `title` | `string` | — | Panel header title. |
| `subtitle` | `string` | — | Subtitle line below the title. |
| `externalHref` | `string` | — | Shows an external-link icon in the header. |
| `width` | `number` | `400` | Panel width in px. |
| `actions` | `ReactNode` | — | Action buttons rendered below the header. |
| `statusRow` | `ReactNode` | — | Compact status row below the actions. |
| `children` | `ReactNode` | — | Main scrollable content. |
| `footer` | `ReactNode` | — | Sticky footer (e.g. a confirm button). |

**Interactive knobs** (playground-configurable): `width`

---
