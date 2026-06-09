export type PropDef = {
  name: string
  type: string
  default?: string
  description: string
}

export type KnobDef = {
  name: string
  type: 'select' | 'boolean' | 'text'
  options?: string[]
  default: string | boolean
}

export type ComponentMeta = {
  slug: string
  name: string
  description: string
  category: 'Forms' | 'Data Display' | 'Feedback' | 'Layout'
  props: PropDef[]
  knobs: KnobDef[]
  importName: string
  /** Optional custom usage code block shown in the Usage section. Falls back to a generic template if omitted. */
  usageExample?: string
  /** Markdown or raw string for custom guidelines. */
  guidelines?: string
  /** Markdown or raw string for accessibility notes. */
  accessibility?: string
}

export const CATEGORIES: ComponentMeta['category'][] = [
  'Forms',
  'Data Display',
  'Feedback',
  'Layout',
]

export const componentRegistry: ComponentMeta[] = [
  {
    slug: 'button',
    name: 'Button',
    description:
      'Displays a button or a component that looks like a button. Supports multiple visual variants, sizes, and icon placements.',
    category: 'Forms',
    importName: 'Button',
    usageExample: `import { Button } from '@navanta-ai/design-system'

export default function Example() {
  return <Button>Click me</Button>
}`,
    props: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link' | 'christy'",
        default: "'primary'",
        description: 'Controls the visual style of the button. Use "christy" for the gradient Christy CTA.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | 'icon'",
        default: "'md'",
        description: 'Controls the size of the button. Use "icon" for square icon-only buttons.',
      },
      {
        name: 'iconLeft',
        type: 'ReactNode',
        description: 'Icon or element rendered to the left of the label.',
      },
      {
        name: 'iconRight',
        type: 'ReactNode',
        description: 'Icon or element rendered to the right of the label.',
      },
      {
        name: 'fullWidth',
        type: 'boolean',
        default: 'false',
        description: 'Stretches the button to fill its container width.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Prevents interaction and applies muted styling.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Content rendered inside the button.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes merged with the component styles.',
      },
    ],
    knobs: [
      {
        name: 'variant',
        type: 'select',
        options: ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link', 'christy'],
        default: 'primary',
      },
      {
        name: 'size',
        type: 'select',
        options: ['sm', 'md', 'lg', 'icon'],
        default: 'md',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: false,
      },
    ],
  },
  {
    slug: 'pill',
    name: 'Pill',
    description:
      'A compact status tag — soft tinted background with strong tonal text and an optional leading icon. Four semantic variants (info=blue, danger=red, warning=amber, neutral=grey) across three sizes. Each variant is a 50/800 tonal pair; the danger pair is the exact Figma spec (Iris-Shareable "Stable Table Cell"). Use for status, counts, and labels — keep brand color reserved for Christy (AI) chrome.',
    category: 'Data Display',
    importName: 'Pill',
    usageExample: `import { Pill } from '@navanta-ai/design-system'
// Pill icons use the Phosphor duotone weight.
import { WarningCircle } from '@phosphor-icons/react'

export default function Example() {
  return (
    <Pill variant="danger" size="sm" icon={<WarningCircle weight="duotone" />}>
      Critical
    </Pill>
  )
}`,
    props: [
      { name: 'variant', type: `'info' | 'danger' | 'warning' | 'neutral'`, default: 'neutral', description: 'Semantic tone — blue / red / amber / grey.' },
      { name: 'size', type: `'sm' | 'md' | 'lg'`, default: 'sm', description: 'Pill size. Small matches the Figma table-cell spec.' },
      { name: 'icon', type: 'React.ReactNode', description: 'Optional leading icon (SVG/Phosphor glyph); scales to the pill size.' },
      { name: 'children', type: 'React.ReactNode', description: 'The pill label.' },
    ],
    knobs: [
      { name: 'variant', type: 'select', options: ['info', 'danger', 'warning', 'neutral'], default: 'danger' },
      { name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'sm' },
      { name: 'label', type: 'text', default: 'Critical' },
      { name: 'icon', type: 'boolean', default: true },
    ],
  },
  {
    slug: 'input',
    name: 'Input',
    description:
      'A text input field with optional label, helper text, and error state support.',
    category: 'Forms',
    importName: 'Input',
    props: [
      {
        name: 'label',
        type: 'string',
        description: 'Accessible label rendered above the input.',
      },
      {
        name: 'placeholder',
        type: 'string',
        description: 'Placeholder text displayed when the input is empty.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'Height of the input field: sm (28px), md (32px), lg (36px).',
      },
      {
        name: 'error',
        type: 'string | boolean',
        description:
          'Error state. Pass a string for an error message or true to apply error styling.',
      },
      {
        name: 'helperText',
        type: 'string',
        description: 'Supplementary text displayed below the input.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Prevents interaction and applies muted styling.',
      },
    ],
    knobs: [
      {
        name: 'label',
        type: 'text',
        default: 'Email',
      },
      {
        name: 'placeholder',
        type: 'text',
        default: 'you@example.com',
      },
      {
        name: 'size',
        type: 'select',
        options: ['sm', 'md', 'lg'],
        default: 'md',
      },
      {
        name: 'error',
        type: 'text',
        default: '',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: false,
      },
    ],
  },
  {
    slug: 'card',
    name: 'Card',
    description:
      'A container component with header, content, and footer slots for grouping related content.',
    category: 'Data Display',
    importName: 'Card',
    props: [
      {
        name: 'hoverable',
        type: 'boolean',
        default: 'false',
        description: 'Adds a shadow lift effect on hover.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes for custom styling.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description:
          'Content rendered inside the card. Use CardHeader, CardContent, CardFooter sub-components.',
      },
    ],
    knobs: [
      {
        name: 'view',
        type: 'select',
        options: ['form', 'media'],
        default: 'form',
      },
      {
        name: 'hoverable',
        type: 'boolean',
        default: false,
      },
    ],
  },
  {
    slug: 'textarea',
    name: 'Textarea',
    description: 'A multi-line text input field with auto-resizing capability.',
    category: 'Forms',
    importName: 'Textarea',
    props: [
      { name: 'label', type: 'string', description: 'Accessible label rendered above the textarea.' },
      { name: 'placeholder', type: 'string', description: 'Placeholder text displayed when empty.' },
      { name: 'error', type: 'string | boolean', description: 'Error state message or styling.' },
      { name: 'helperText', type: 'string', description: 'Supplementary text below the textarea.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction.' },
    ],
    knobs: [
      { name: 'label', type: 'text', default: 'Bio' },
      { name: 'placeholder', type: 'text', default: 'Tell us about yourself...' },
      { name: 'error', type: 'text', default: '' },
      { name: 'disabled', type: 'boolean', default: false },
    ],
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    description: 'A control that allows the user to toggle between checked and not checked.',
    category: 'Forms',
    importName: 'Checkbox',
    props: [
      { name: 'label', type: 'string', description: 'Label rendered next to the checkbox.' },
      { name: 'helperText', type: 'string', description: 'Supplementary text below the label.' },
      { name: 'error', type: 'string | boolean', description: 'Error state message or styling.' },
      { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Mixed/partial state — e.g. a "select all" when only some rows are selected. Shows a dash and announces aria-checked="mixed".' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction.' },
    ],
    knobs: [
      { name: 'label', type: 'text', default: 'Accept terms and conditions' },
      { name: 'indeterminate', type: 'boolean', default: false },
      { name: 'error', type: 'text', default: '' },
      { name: 'disabled', type: 'boolean', default: false },
    ],
  },
  {
    slug: 'radio',
    name: 'Radio',
    description: 'A control that allows the user to select a single option from a set.',
    category: 'Forms',
    importName: 'Radio',
    props: [
      { name: 'label', type: 'string', description: 'Label rendered next to the radio (text).' },
      { name: 'helperText', type: 'string', description: 'Supplementary subtext below the label.' },
      { name: 'card', type: 'boolean', default: 'false', description: 'Render as a selectable card with text + subtext and a neutral tinted selected state.' },
      { name: 'badge', type: 'ReactNode', description: 'Optional badge rendered inline next to the label (card variant).' },
      { name: 'error', type: 'string | boolean', description: 'Error state message or styling.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction.' },
    ],
    knobs: [
      { name: 'error', type: 'text', default: '' },
      { name: 'disabled', type: 'boolean', default: false },
    ],
  },
  {
    slug: 'switch',
    name: 'Switch',
    description: 'A control that toggles a single setting on or off — a flat, fully-rounded track with a wide white pill knob (HMTX Portal / Apple HIG). On = info blue, off = neutral translucent gray. Use for instant on/off settings (for a form value that submits, prefer a Checkbox).',
    category: 'Forms',
    importName: 'Switch',
    usageExample: `import { Switch } from '@navanta-ai/design-system'
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
}`,
    props: [
      { name: 'label', type: 'string', description: 'Label rendered next to the switch.' },
      { name: 'helperText', type: 'string', description: 'Supplementary text below the label.' },
      { name: 'error', type: 'string | boolean', description: 'Error state message or styling.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction.' },
      { name: 'checked', type: 'boolean', description: 'Controlled checked state of the switch.' },
      { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Initial checked state when uncontrolled.' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Called when the switch is toggled.' },
    ],
    knobs: [
      { name: 'label', type: 'text', default: 'Enable notifications' },
      { name: 'error', type: 'text', default: '' },
      { name: 'disabled', type: 'boolean', default: false },
    ],
  },
  {
    slug: 'select',
    name: 'Select',
    description: 'Displays a list of options for the user to pick from — triggered by a button.',
    category: 'Forms',
    importName: 'Select',
    props: [
      { name: 'value', type: 'string', description: 'The controlled selected value.' },
      { name: 'defaultValue', type: 'string', description: 'The default value when uncontrolled.' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Callback fired when the selected value changes.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction.' },
    ],
    knobs: [
      { name: 'disabled', type: 'boolean', default: false },
    ],
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    description: 'A modal window that overlays either the primary window or another dialog window.',
    category: 'Feedback',
    importName: 'Dialog',
    props: [
      { name: 'open', type: 'boolean', description: 'Controlled open state.' },
      { name: 'onClose', type: 'function', description: 'Callback fired when the dialog should close.' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: 'Maximum width of the dialog.' },
      { name: 'closeOnOverlay', type: 'boolean', default: 'true', description: 'Closes dialog when clicking overlay.' },
      { name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Closes dialog when pressing Escape.' },
      { name: 'showCloseButton', type: 'boolean', default: 'true', description: 'Shows an optional close button in the top-right corner.' },
    ],
    knobs: [
      { name: 'size', type: 'select', options: ['sm', 'md', 'lg', 'full'], default: 'md' },
      { name: 'closeOnOverlay', type: 'boolean', default: true },
    ],
  },
  {
    slug: 'toast',
    name: 'Toast',
    description: 'A succinct message that is displayed temporarily.',
    category: 'Feedback',
    importName: 'Toast',
    props: [
      { name: 'type', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", description: 'Visual intent of the toast.' },
      { name: 'title', type: 'string', description: 'Primary title.' },
      { name: 'message', type: 'string', description: 'Sub-message or description.' },
      { name: 'duration', type: 'number', default: '5000', description: 'Milliseconds before auto-dismissal. 0 to disable.' },
      { name: 'position', type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'", default: "'bottom-right'", description: 'Screen position where the toast appears.' },
      { name: 'onClose', type: 'function', description: 'Callback fired when dismissed.' },
    ],
    knobs: [
      { name: 'type', type: 'select', options: ['info', 'success', 'warning', 'error'], default: 'info' },
      { name: 'title', type: 'text', default: 'Profile Updated' },
      { name: 'message', type: 'text', default: 'Your changes were saved successfully.' },
      { name: 'duration', type: 'select', options: ['3000', '5000', '0'], default: '5000' },
      { name: 'position', type: 'select', options: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'], default: 'bottom-right' },
    ],
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    description: 'A vertically stacked set of interactive headings that each reveal a section of content.',
    category: 'Data Display',
    importName: 'Accordion',
    props: [
      { name: 'items', type: 'AccordionItem[]', description: 'Array of items containing title, content, and disabled state.' },
      { name: 'variant', type: "'default' | 'bordered' | 'separated'", default: "'default'", description: 'Visual style of the accordion.' },
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Allows multiple items to be open at once.' },
    ],
    knobs: [
      { name: 'variant', type: 'select', options: ['default', 'bordered', 'separated'], default: 'default' },
      { name: 'multiple', type: 'boolean', default: false },
      { name: 'disabled', type: 'boolean', default: false },
    ],
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
    category: 'Data Display',
    importName: 'Tabs',
    props: [
      { name: 'tabs', type: 'TabItem[]', description: 'Array of tabs with id, label, disabled status, and optional badge.' },
      { name: 'activeTab', type: 'string', description: 'Id of the controlled active tab.' },
      { name: 'onChange', type: '(id: string) => void', description: 'Callback fired when a tab is clicked.' },
      { name: 'variant', type: "'underline' | 'pills' | 'bordered'", default: "'underline'", description: 'Visual style of the tabs.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the tabs.' },
      { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretches tabs to fill container width.' },
    ],
    knobs: [
      { name: 'variant', type: 'select', options: ['underline', 'pills', 'bordered'], default: 'underline' },
      { name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      { name: 'fullWidth', type: 'boolean', default: false },
      { name: 'disabled', type: 'boolean', default: false },
    ],
  },
  {
    slug: 'table',
    name: 'Table',
    description:
      'A responsive table for tabular data. Table.Cell supports standardized content variants — id (badge + copy), party (avatar + title/subtitle), status (progress dots + label), pill (semantic status Pill), date (auto relative subtext), and input (inline editable) — plus plain text/number by default.',
    category: 'Data Display',
    importName: 'Table',
    props: [
      { name: 'striped', type: 'boolean', default: 'false', description: 'Alternating background colors for rows.' },
      { name: 'hoverable', type: 'boolean', default: 'false', description: 'Highlight rows on hover.' },
      { name: 'compact', type: 'boolean', default: 'false', description: 'Reduces padding inside cells.' },
      { name: 'stickyHeader', type: 'boolean', default: 'false', description: 'Fixes header at the top when scrolling.' },
      { name: 'Cell variant', type: "'id' | 'party' | 'status' | 'pill' | 'date' | 'input'", description: 'Standardized cell content. Omit for plain text/number (use mono / align as usual).' },
      { name: 'Cell (id)', type: 'value, icon?, badge?, href?, copyable?, subtitle?', description: 'ID/SKU. With an icon it shows a circle badge; copy button is on by default. Omit icon for the plain (Halstead) style. Pass subtitle for a muted product/description line below the ID (e.g. SKU + product name).' },
      { name: 'Cell (party)', type: 'avatar?: {src|initials}, title, subtitle?', description: 'Avatar (image or initials) with a title and optional subtext — e.g. a "Ship to" column.' },
      { name: 'Cell (status)', type: "status?: TableStatusKey, steps?, completed?, tone?, label?", description: 'Progress dots + label. Pass a registry status key, or set steps/completed/tone/label manually. tone (success/warning/danger/neutral) overrides the dot color.' },
      { name: 'Cell (pill)', type: "pillVariant?: 'info'|'danger'|'warning'|'neutral', pillSize?, label, icon?", description: 'Renders a status Pill. Uses label for the text and icon for an optional outline glyph. pillVariant = blue/red/amber/grey.' },
      { name: 'Cell (date)', type: 'date: Date|string|number, relative?, subtext?, now?', description: 'Formats the date (e.g. "Mar 03, 2026") with an auto relative subtext ("5 mins ago" / "in 2 days"). Pass subtext to override.' },
      { name: 'Cell (input)', type: 'value, onValueChange, placeholder?, inputType?', description: 'Inline editable cell built on the base Input (compact size, 120px min-width).' },
      { name: 'HeadCell sortable / ai', type: 'sortable?, sortDirection?, onSort?, ai?', description: 'Per-column sorting UI; set sortable for the caret/clicks. ai renders the Christy AI star before a neutral column label.' },
      { name: 'Table.Empty', type: 'colSpan?, minHeight?', description: 'Full-width centered empty row — keeps column headers visible and centers an <EmptyState> when there are no rows.' },
      { name: 'useTableSort()', type: '(data, getValue, initial?) => { sorted, getHeadProps }', description: 'Hook that makes sorting functional: returns sorted rows and getHeadProps(key, enabled?) to spread onto each HeadCell. Pass an initial { key } for default sorting.' },
    ],
    knobs: [
      { name: 'striped', type: 'boolean', default: false },
      { name: 'hoverable', type: 'boolean', default: true },
      { name: 'compact', type: 'boolean', default: false },
    ],
  },
  {
    slug: 'bar-chart',
    name: 'Bar Chart',
    description: 'A categorical bar graph for comparing values across labels.',
    category: 'Data Display',
    importName: 'BarChart',
    usageExample: `import { BarChart } from '@navanta-ai/design-system'

const data = [
  { label: 'Mon', value: 24 },
  { label: 'Tue', value: 18 },
  { label: 'Wed', value: 32 },
  { label: 'Thu', value: 28 },
  { label: 'Fri', value: 40 },
]

export default function Example() {
  return <BarChart data={data} color="var(--chart-2)" showValueLabels />
}`,
    props: [
      { name: 'data', type: 'ChartDatum[]', description: 'Data points containing label and numeric value.' },
      { name: 'height', type: 'number', default: '220', description: 'Chart height in pixels.' },
      { name: 'color', type: 'string', default: "'var(--chart-2)'", description: 'Bar fill color.' },
      { name: 'accessibilityMode', type: "'default' | 'colorblind-safe'", default: "'default'", description: 'Applies pattern overlays and outlines for color-blind-safe readability.' },
      { name: 'showGrid', type: 'boolean', default: 'true', description: 'Shows horizontal grid lines.' },
      { name: 'showYAxisLabels', type: 'boolean', default: 'true', description: 'Shows Y-axis value labels.' },
      { name: 'showValueLabels', type: 'boolean', default: 'false', description: 'Shows values above bars.' },
    ],
    knobs: [
      { name: 'dataset', type: 'select', options: ['weekly', 'monthly'], default: 'weekly' },
      { name: 'color', type: 'select', options: ['chart-1', 'chart-2', 'chart-3', 'success', 'warning'], default: 'chart-2' },
      { name: 'accessibilityMode', type: 'select', options: ['default', 'colorblind-safe'], default: 'default' },
      { name: 'showGrid', type: 'boolean', default: true },
      { name: 'showYAxisLabels', type: 'boolean', default: true },
      { name: 'showValueLabels', type: 'boolean', default: false },
    ],
  },
  {
    slug: 'line-chart',
    name: 'Line Chart',
    description: 'A trend line graph for visualizing changes over time.',
    category: 'Data Display',
    importName: 'LineChart',
    usageExample: `import { LineChart } from '@navanta-ai/design-system'

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
}`,
    props: [
      { name: 'data', type: 'ChartDatum[]', description: 'Data points containing label and numeric value.' },
      { name: 'height', type: 'number', default: '220', description: 'Chart height in pixels.' },
      { name: 'lineColor', type: 'string', default: "'var(--chart-3)'", description: 'Line stroke color.' },
      { name: 'showArea', type: 'boolean', default: 'true', description: 'Renders an area fill below the line.' },
      { name: 'smooth', type: 'boolean', default: 'true', description: 'Uses curved interpolation between points.' },
      { name: 'showPoints', type: 'boolean', default: 'true', description: 'Shows point markers on each data point.' },
    ],
    knobs: [
      { name: 'dataset', type: 'select', options: ['weekly', 'monthly'], default: 'monthly' },
      { name: 'color', type: 'select', options: ['chart-1', 'chart-2', 'chart-3', 'success', 'warning'], default: 'chart-3' },
      { name: 'showGrid', type: 'boolean', default: true },
      { name: 'showArea', type: 'boolean', default: true },
      { name: 'smooth', type: 'boolean', default: true },
      { name: 'showPoints', type: 'boolean', default: true },
    ],
  },
  {
    slug: 'stacked-bar-chart',
    name: 'Stacked Bar Chart',
    description: 'A segmented bar graph to show part-to-whole composition inside each category.',
    category: 'Data Display',
    importName: 'StackedBarChart',
    usageExample: `import { StackedBarChart } from '@navanta-ai/design-system'

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
}`,
    props: [
      { name: 'data', type: 'StackedChartDatum[]', description: 'Array of bars; each bar has multiple labeled segments.' },
      { name: 'height', type: 'number', default: '240', description: 'Chart height in pixels.' },
      { name: 'showLegend', type: 'boolean', default: 'true', description: 'Shows segment legend below chart.' },
      { name: 'showTotals', type: 'boolean', default: 'false', description: 'Shows total value above each stacked bar.' },
      { name: 'showGrid', type: 'boolean', default: 'true', description: 'Shows horizontal grid lines.' },
      { name: 'accessibilityMode', type: "'default' | 'colorblind-safe'", default: "'default'", description: 'Applies patterns and outlines for color-blind-safe reading.' },
    ],
    knobs: [
      { name: 'dataset', type: 'select', options: ['claims', 'operations'], default: 'claims' },
      { name: 'showLegend', type: 'boolean', default: true },
      { name: 'showTotals', type: 'boolean', default: true },
      { name: 'showGrid', type: 'boolean', default: true },
      { name: 'accessibilityMode', type: 'select', options: ['default', 'colorblind-safe'], default: 'default' },
    ],
  },
  {
    slug: 'breadcrumbs',
    name: 'Breadcrumbs',
    description: 'Displays the path to the current resource using a hierarchy of links.',
    category: 'Layout',
    importName: 'Breadcrumbs',
    props: [
      { name: 'items', type: 'BreadcrumbItem[]', description: 'Array of items with label, href, and onClick handler.' },
      { name: 'maxItems', type: 'number', description: 'Maximum number of items to show before collapsing inner items with ellipsis.' },
      { name: 'separator', type: 'ReactNode', description: 'Custom separator element.' },
    ],
    knobs: [
      { name: 'maxItems', type: 'select', options: ['0', '3'], default: '0' },
    ],
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    category: 'Feedback',
    importName: 'Tooltip',
    props: [
      { name: 'content', type: 'ReactNode', description: 'The content to display inside the tooltip.' },
      { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", description: 'The preferred side of the trigger to render against when open.' },
      { name: 'align', type: "'start' | 'center' | 'end'", default: "'center'", description: 'The preferred alignment against the trigger.' },
      { name: 'delay', type: 'number', default: '300', description: 'Duration in milliseconds before the tooltip appears.' },
    ],
    knobs: [
      { name: 'side', type: 'select', options: ['top', 'right', 'bottom', 'left'], default: 'top' },
      { name: 'align', type: 'select', options: ['start', 'center', 'end'], default: 'center' },
      { name: 'delay', type: 'select', options: ['0', '300', '700'], default: '300' },
    ],
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    description: 'An image element with a fallback for representing the user.',
    category: 'Data Display',
    importName: 'Avatar',
    props: [
      { name: 'src', type: 'string', description: 'The image source URL.' },
      { name: 'alt', type: 'string', default: "'Avatar'", description: 'Alternative screen reader text.' },
      { name: 'initials', type: 'string', description: 'Initials to show if the image is missing.' },
      { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Size of the avatar.' },
      { name: 'shape', type: "'circle' | 'square'", default: "'circle'", description: 'Shape of the avatar.' },
      { name: 'status', type: "'online' | 'offline' | 'away' | 'busy' | 'none'", description: 'An optional status indicator bubble.' },
    ],
    knobs: [
      { name: 'size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
      { name: 'shape', type: 'select', options: ['circle', 'square'], default: 'circle' },
      { name: 'status', type: 'select', options: ['none', 'online', 'offline', 'away', 'busy'], default: 'none' },
    ],
  },
  {
    slug: 'skeleton',
    name: 'Skeleton',
    description: 'Displays a placeholder preview of content before the data gets loaded to reduce load-time frustration.',
    category: 'Feedback',
    importName: 'Skeleton',
    props: [
      { name: 'variant', type: "'text' | 'circular' | 'rectangular' | 'rounded'", default: "'text'", description: 'The visual style of the skeleton.' },
      { name: 'width', type: 'string | number', description: 'Overrides the default width.' },
      { name: 'height', type: 'string | number', description: 'Overrides the default height.' },
      { name: 'count', type: 'number', default: '1', description: 'Number of repeating skeleton lines to render.' },
      { name: 'animate', type: 'boolean', default: 'true', description: 'Whether to show the pulse animation.' },
    ],
    knobs: [
      { name: 'variant', type: 'select', options: ['text', 'circular', 'rectangular', 'rounded'], default: 'text' },
      { name: 'animate', type: 'boolean', default: true },
    ],
  },
  {
    slug: 'progress',
    name: 'Progress',
    description: 'Displays an indicator showing the completion progress of a task.',
    category: 'Feedback',
    importName: 'Progress',
    props: [
      { name: 'value', type: 'number', description: 'The progress value.' },
      { name: 'max', type: 'number', default: '100', description: 'The maximum progress value.' },
      { name: 'variant', type: "'default' | 'success' | 'warning' | 'error'", default: "'default'", description: 'Visual style of the progress bar.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height of the linear progress track.' },
      { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Whether the progress is indeterminate.' },
      { name: 'showLabel', type: 'boolean', default: 'false', description: 'Whether to display the percentage label.' },
      { name: 'striped', type: 'boolean', default: 'false', description: 'Adds zebra stripes to the linear progress bar.' },
    ],
    knobs: [
      { name: 'variant', type: 'select', options: ['default', 'success', 'warning', 'error'], default: 'default' },
      { name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      { name: 'circularSize', type: 'select', options: ['48', '64', '80'], default: '48' },
      { name: 'striped', type: 'boolean', default: false },
      { name: 'indeterminate', type: 'boolean', default: false },
      { name: 'showLabel', type: 'boolean', default: true },
    ],
  },
  {
    slug: 'pagination',
    name: 'Pagination',
    description: 'Allows the user to select a specific page from a range of pages.',
    category: 'Data Display',
    importName: 'Pagination',
    props: [
      { name: 'total', type: 'number', description: 'Total number of data items.' },
      { name: 'page', type: 'number', description: 'The current active page.' },
      { name: 'onChange', type: '(page: number) => void', description: 'Callback fired when page changes.' },
      { name: 'pageSize', type: 'number', default: '10', description: 'Number of items per page.' },
      { name: 'siblingCount', type: 'number', default: '1', description: 'Number of pages to show around current page before folding.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the pagination items.' },
      { name: 'showEdges', type: 'boolean', default: 'true', description: 'Whether to show previous/next buttons.' },
    ],
    knobs: [
      { name: 'total', type: 'select', options: ['10', '50', '100', '1000'], default: '100' },
      { name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      { name: 'siblingCount', type: 'select', options: ['0', '1', '2'], default: '1' },
      { name: 'showEdges', type: 'boolean', default: true },
    ],
  },
  {
    slug: 'kpi',
    name: 'KPI',
    description: 'Dashboard-ready key performance indicator cards for stat and progress use cases.',
    category: 'Data Display',
    importName: 'KpiStatCard',
    usageExample: `import { Info } from '@phosphor-icons/react'
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
}`,
    props: [
      { name: 'KpiStatCard', type: 'Component', description: 'Shows title, value, trend delta, and optional sparkline/icon.' },
      { name: 'KpiProgressCard', type: 'Component', description: 'Shows KPI value with a progress bar and completion label.' },
      { name: 'KpiTrendBadge', type: 'Component', description: 'Compact trend badge for up/down/neutral states.' },
      { name: 'KpiGrid', type: 'Component', description: 'Responsive KPI layout grid with 1-4 column options.' },
    ],
    knobs: [
      { name: 'variant', type: 'select', options: ['stat', 'progress'], default: 'stat' },
      { name: 'cardWidth', type: 'select', options: ['320', '280'], default: '320' },
      { name: 'trend', type: 'select', options: ['up', 'down', 'neutral'], default: 'up' },
      { name: 'label', type: 'text', default: 'Open Orders' },
      { name: 'number', type: 'text', default: '18' },
      { name: 'percentage', type: 'text', default: '78.5' },
      {
        name: 'progressColor',
        type: 'select',
        options: [
          'brand',
          'success',
          'warning',
          'destructive',
          'info',
        ],
        default: 'destructive',
      },
      { name: 'showInfo', type: 'boolean', default: true },
    ],
  },
  {
    slug: 'slider',
    name: 'Slider',
    description: 'An input element where the user selects a value from within a given range.',
    category: 'Forms',
    importName: 'Slider',
    props: [
      { name: 'value', type: 'number[]', description: 'The controlled value array (e.g., [50] or [20, 80]).' },
      { name: 'defaultValue', type: 'number[]', default: '[0]', description: 'The default value array.' },
      { name: 'min', type: 'number', default: '0', description: 'The minimum allowed value.' },
      { name: 'max', type: 'number', default: '100', description: 'The maximum allowed value.' },
      { name: 'step', type: 'number', default: '1', description: 'The increment/decrement step.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the slider is disabled.' },
      { name: 'label', type: 'string', description: 'An optional textual label.' },
      { name: 'showValue', type: 'boolean', default: 'false', description: 'Whether to display the exact selected value.' },
    ],
    knobs: [
      { name: 'circle', type: 'select', options: ['single', 'range'], default: 'single' },
      { name: 'step', type: 'select', options: ['1', '5', '10'], default: '1' },
      { name: 'showValue', type: 'boolean', default: true },
      { name: 'disabled', type: 'boolean', default: false },
    ],
  },
  {
    slug: 'datepicker',
    name: 'Date Picker',
    description: 'A component that allows users to select a date from a calendar.',
    category: 'Forms',
    importName: 'DatePicker',
    props: [
      { name: 'value', type: 'Date | null', description: 'The selected date.' },
      { name: 'onChange', type: '(date: Date | null) => void', description: 'Callback when date is selected.' },
      { name: 'placeholder', type: 'string', default: "'Select date'", description: 'Placeholder for empty state.' },
      { name: 'label', type: 'string', description: 'Input label element.' },
      { name: 'helperText', type: 'string', description: 'Instructive text below the field.' },
      { name: 'error', type: 'string | boolean', description: 'Error message and styling trigger.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the picker is intractable.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Trigger dimensions height.' },
    ],
    knobs: [
      { name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      { name: 'disabled', type: 'boolean', default: false },
      { name: 'error', type: 'boolean', default: false },
      { name: 'helperText', type: 'boolean', default: true },
    ],
  },
  {
    slug: 'dropzone',
    name: 'Dropzone',
    description: 'A drag-and-drop zone for uploading files.',
    category: 'Forms',
    importName: 'Dropzone',
    props: [
      { name: 'onFilesAdded', type: '(files: File[]) => void', description: 'Callback fired when files are selected or dropped.' },
      { name: 'files', type: 'DropzoneFile[]', description: 'List of currently selected files.' },
      { name: 'onFileRemove', type: '(id: string) => void', description: 'Callback fired when a file is removed.' },
      { name: 'multiple', type: 'boolean', default: 'true', description: 'Whether multiple files can be selected.' },
      { name: 'accept', type: 'string', description: 'Comma-separated list of accepted file types (e.g., "image/*, .pdf").' },
      { name: 'maxSize', type: 'number', description: 'Maximum file size in bytes.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the dropzone is disabled.' },
      { name: 'label', type: 'string', default: "'Click or drag files to upload'", description: 'Primary textual instruction.' },
      { name: 'description', type: 'string', description: 'Secondary instructional text.' },
    ],
    knobs: [
      { name: 'multiple', type: 'boolean', default: true },
      { name: 'disabled', type: 'boolean', default: false },
    ],
  },
  {
    slug: 'page-heading',
    name: 'Page Heading',
    description:
      'A page header with the Christy AI star icon, a gradient title, and a subtitle. Used at the top of a view.',
    category: 'Layout',
    importName: 'PageHeading',
    usageExample: `import { PageHeading } from '@navanta-ai/design-system'

export default function Example() {
  return <PageHeading title="Order Dashboard" subtitle="Track shipments and resolve claims in one place" />
}`,
    props: [
      { name: 'title', type: 'string', description: 'Gradient page title.' },
      { name: 'subtitle', type: 'string', description: 'Purple subtitle below the title.' },
    ],
    knobs: [
      { name: 'title', type: 'text', default: 'Order Dashboard' },
      { name: 'subtitle', type: 'text', default: 'Track shipments and resolve claims in one place' },
    ],
  },
  {
    slug: 'table-shell',
    name: 'Table Shell',
    description:
      'Reusable table chrome — a titled container with a unified filter bar (search + dropdowns + chips + insight filters via the `facets` model), a table body, and a footer with item count, pagination, and page-size controls. Saved-view tabs stay a separate axis.',
    category: 'Data Display',
    importName: 'TableShell',
    usageExample: `import { TableShell, Table, Input } from '@navanta-ai/design-system'
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
}`,
    props: [
      { name: 'title', type: 'string', description: 'Table title shown in the header.' },
      { name: 'icon', type: 'Icon', description: 'Phosphor icon rendered next to the title.' },
      { name: 'totalItems', type: 'number', description: 'Total filtered item count (drives pagination).' },
      { name: 'currentPage', type: 'number', description: 'Current page (1-based).' },
      { name: 'onPageChange', type: '(page: number) => void', description: 'Page change handler.' },
      { name: 'pageSize', type: 'number', description: 'Items per page.' },
      { name: 'onPageSizeChange', type: '(size: number) => void', description: 'Page size change handler.' },
      { name: 'pageSizeOptions', type: 'number[]', default: '[10, 25, 50]', description: 'Available page size options.' },
      { name: 'searchValue / onSearchChange', type: 'string / (v) => void', description: 'Providing onSearchChange renders the built-in toolbar search (consumer owns filtering).' },
      { name: 'searchPlaceholder', type: 'string', default: "'Search'", description: 'Placeholder for the built-in search field.' },
      { name: 'facets', type: 'FilterFacet[]', description: 'UNIFIED filter bar (recommended) — search + dropdowns + chips + insight filters as ONE band. A FilterFacet is kind:"select" (single-select, reuses Select), kind:"toggle-group" (multi-select chips), or kind:"toggle" (a boolean insight like "High demand"/"This week"). promoted shows inline; the rest auto-collapse into a "More filters" popover. Array order = layout order; group sections the popover. Consumer-declared insight facets need zero component changes. When set, the legacy filters/filterChips/activeFilters props are ignored.' },
      { name: 'maxInlineChips', type: 'number', default: '5', description: 'Max inline filter CONTROLS before the rest demote into the "More filters" dropdown — a multi-select group counts one control per option.' },
      { name: 'moreFiltersLabel', type: 'ReactNode', default: "'More filters'", description: 'Trigger label for the overflow popover.' },
      { name: 'filters', type: 'ReactNode', description: 'DEPRECATED (prefer facets). Filter controls at the right of the toolbar (e.g. Select dropdowns).' },
      { name: 'activeFilters', type: 'ActiveFilter[]', description: 'DEPRECATED (prefer facets). Active filters as removable pills. Each item has key, label, value, onRemove.' },
      { name: 'onClearAllFilters', type: '() => void', description: 'Called when "Clear all" is clicked (also fired for facets after each facet is reset).' },
      { name: 'filterChips', type: 'FilterChip[]', description: 'DEPRECATED (prefer a facets toggle-group). Open pill-style toggle chips. Each chip has key, label, variant?, icon?, count?, active, onToggle.' },
      { name: 'filterChipsLabel', type: 'ReactNode', description: 'DEPRECATED. Optional leading label for the legacy filter chip row.' },
      { name: 'tabs / activeTab / onTabChange', type: 'TabItem[] / string / (id) => void', description: 'Optional tab row for quick filtering, with count badges (TabItem.badge).' },
      { name: 'customize', type: 'boolean', default: 'true', description: 'The Customize action (gear) is integral to the heading and shown by default. Set false to omit it.' },
      { name: 'columns / onColumnsChange', type: 'TableColumn[] / (cols) => void', description: 'Provide columns to get the BUILT-IN Customize popover (per-column show/hide + drag-reorder). TableColumn = { key, label, hideable?, hidden? }. Reflect the resulting order + hidden flags when you render the table header + cells. When set, the Customize button opens this popover instead of calling onCustomize.' },
      { name: 'onCustomize / customizeLabel', type: '() => void / string', description: 'customizeLabel sets the button text. onCustomize is the fallback handler used only when columns is NOT provided.' },
      { name: 'header', type: 'ReactNode', description: 'Extra header slot above the body (filter chips, banners).' },
      { name: 'emptyState / noResultsState', type: 'ReactNode', description: 'INTEGRAL empty handling. When totalItems === 0, TableShell paints the screen centered with column headers still visible — emptyState for no data, noResultsState when isFiltered. Pass an <EmptyState>; render just the header (no rows) in children.' },
      { name: 'isFiltered', type: 'boolean', description: 'Whether search/filters are active — selects noResultsState over emptyState.' },
      { name: 'children', type: 'ReactNode', description: 'The table — a <Table> with header + rows. When totalItems === 0, render just the header; TableShell shows emptyState/noResultsState. (Table.Empty still works for fully custom bodies.)' },
    ],
    knobs: [],
  },
  {
    slug: 'empty-state',
    name: 'Empty State',
    description:
      'A centered "nothing here" screen with an optional nested-ring icon, title, description, an optional inline link, and an action. Use it for first-time/empty states (offer a primary CTA) and no-results states (offer a way to clear). TableShell renders it automatically when a table is empty.',
    category: 'Feedback',
    importName: 'EmptyState',
    usageExample: `import { EmptyState, Button } from '@navanta-ai/design-system'
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
}`,
    props: [
      { name: 'icon', type: 'ReactNode', description: 'Optional icon shown inside concentric rings (pass a sized node, e.g. <Star weight="duotone" />). Rendered at 32px.' },
      { name: 'title', type: 'string', description: 'Headline (18px semibold).' },
      { name: 'description', type: 'ReactNode', description: 'Supporting line(s) below the title (14px).' },
      { name: 'link', type: '{ label: string; onClick?: () => void; href?: string }', description: 'A text link rendered directly under the description (medium, underlined, --text-link). Use for "search instead" affordances; for a Button CTA use action.' },
      { name: 'action', type: 'ReactNode', description: 'Optional separated action area below — typically a Button (primary CTA or "Clear filters").' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Vertical padding scale.' },
    ],
    knobs: [],
  },
  {
    slug: 'detail-panel',
    name: 'Detail Panel',
    description:
      'A slide-out right-side panel (drawer) with a header, optional actions and status row, scrollable content, and a sticky footer. Compose panel parts inside it.',
    category: 'Layout',
    importName: 'DetailPanelShell',
    usageExample: `import { DetailPanelShell, PanelInfoGrid, Button } from '@navanta-ai/design-system'
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
}`,
    props: [
      { name: 'open', type: 'boolean', description: 'Controls panel visibility.' },
      { name: 'onClose', type: '() => void', description: 'Called on close button or backdrop click.' },
      { name: 'title', type: 'string', description: 'Panel header title.' },
      { name: 'subtitle', type: 'string', description: 'Subtitle line below the title.' },
      { name: 'externalHref', type: 'string', description: 'Shows an external-link icon in the header.' },
      { name: 'width', type: 'number', default: '400', description: 'Panel width in px.' },
      { name: 'actions', type: 'ReactNode', description: 'Action buttons rendered below the header.' },
      { name: 'statusRow', type: 'ReactNode', description: 'Compact status row below the actions.' },
      { name: 'children', type: 'ReactNode', description: 'Main scrollable content.' },
      { name: 'footer', type: 'ReactNode', description: 'Sticky footer (e.g. a confirm button).' },
    ],
    knobs: [
      { name: 'width', type: 'select', options: ['360', '400', '480'], default: '400' },
    ],
  },
  {
    slug: 'christy-suggestions',
    name: 'Christy Suggestions',
    description:
      'An AI recommendation card branded with Christy. Supports selection (radio cards), static, and confirmed states, with optional reasoning and summary.',
    category: 'Feedback',
    importName: 'ChristySuggestions',
    usageExample: `import { ChristySuggestions } from '@navanta-ai/design-system'
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
}`,
    props: [
      { name: 'mode', type: "'selection' | 'static' | 'confirmed'", description: 'Which state the card renders.' },
      { name: 'options', type: 'SuggestionOption[]', description: 'Selectable options (selection mode).' },
      { name: 'selectedIdx', type: 'number', description: 'Currently selected option index (selection mode).' },
      { name: 'onSelect', type: '(idx: number) => void', description: 'Called when an option is selected.' },
      { name: 'onConfirm', type: '() => void', description: 'Called when the confirm button is pressed.' },
      { name: 'recommendedIdx', type: 'number', description: 'Index of the recommended option (highlighted).' },
      { name: 'confirmLabel', type: 'string', default: "'Confirm Selection'", description: 'Confirm button label.' },
      { name: 'phase', type: "'idle' | 'confirming' | 'confirmed'", default: "'idle'", description: 'Confirmation phase for loading/success states.' },
      { name: 'reasoning', type: 'string[]', description: 'Reasoning lines shown below the recommendation.' },
      { name: 'summary', type: 'string', description: 'Summary text describing the recommendation.' },
      { name: 'confirmedLabel', type: 'string', description: 'What was confirmed (confirmed mode).' },
    ],
    knobs: [],
  },
  {
    slug: 'panel-alert',
    name: 'Panel Alert',
    description:
      'A colour-coded alert block for detail panels, with an icon, title, optional badge, description, and detail lines.',
    category: 'Feedback',
    importName: 'PanelAlert',
    usageExample: `import { PanelAlert } from '@navanta-ai/design-system'

export default function Example() {
  return (
    <PanelAlert
      type="warning"
      title="Shipment delayed"
      badge="2 days"
      description="Carrier reported a weather hold in transit."
    />
  )
}`,
    props: [
      { name: 'type', type: "'danger' | 'warning' | 'info' | 'success' | 'cancelled'", description: 'Severity, which drives colour and icon.' },
      { name: 'title', type: 'string', description: 'Alert title.' },
      { name: 'badge', type: 'string', description: 'Optional badge shown at the end of the title row.' },
      { name: 'description', type: 'string', description: 'Description text below the title.' },
      { name: 'details', type: 'string[]', description: 'Additional detail lines.' },
    ],
    knobs: [
      { name: 'type', type: 'select', options: ['danger', 'warning', 'info', 'success', 'cancelled'], default: 'warning' },
      { name: 'badge', type: 'boolean', default: true },
    ],
  },
  {
    slug: 'panel-info-grid',
    name: 'Panel Info Grid',
    description:
      'A label-value grid for detail panels, with optional leading icons and clickable link values.',
    category: 'Data Display',
    importName: 'PanelInfoGrid',
    usageExample: `import { PanelInfoGrid } from '@navanta-ai/design-system'
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
}`,
    props: [
      { name: 'title', type: 'string', description: 'Section title above the grid.' },
      { name: 'rows', type: 'InfoRow[]', description: 'Rows with label, value, optional icon, and optional link/href.' },
    ],
    knobs: [],
  },
  {
    slug: 'panel-timeline',
    name: 'Panel Timeline',
    description:
      'A vertical status timeline for detail panels, with colour-coded milestone dots, connectors, dates, and event notes.',
    category: 'Data Display',
    importName: 'PanelTimeline',
    usageExample: `import { PanelTimeline } from '@navanta-ai/design-system'

const milestones = [
  { id: 'ordered', label: 'Ordered', status: 'completed', date: 'May 3', events: [{ type: 'PO issued', date: 'May 3', severity: 'info' }] },
  { id: 'shipped', label: 'Shipped', status: 'active', date: 'May 7', events: [{ type: 'In transit', date: 'May 7', severity: 'warning', note: 'Weather delay' }] },
  { id: 'delivered', label: 'Delivered', status: 'pending', events: [] },
]

export default function Example() {
  return <PanelTimeline title="Delivery progress" milestones={milestones} />
}`,
    props: [
      { name: 'title', type: 'string', default: "'Delivery Status'", description: 'Section title above the timeline.' },
      { name: 'milestones', type: 'TimelineMilestone[]', description: 'Ordered milestones with status, date, and events.' },
      { name: 'idPrefix', type: 'string', default: "'ptl'", description: 'Unique prefix for SVG gradient ids to avoid collisions.' },
    ],
    knobs: [],
  },
]

export function getComponentBySlug(slug: string): ComponentMeta | undefined {
  return componentRegistry.find((c) => c.slug === slug)
}
