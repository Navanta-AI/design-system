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
    usageExample: `import { Button } from '@admin-navanta/design-system'

export default function Example() {
  return <Button>Click me</Button>
}`,
    props: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'",
        default: "'primary'",
        description: 'Controls the visual style of the button.',
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
        options: ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
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
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction.' },
    ],
    knobs: [
      { name: 'label', type: 'text', default: 'Accept terms and conditions' },
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
      { name: 'label', type: 'string', description: 'Label rendered next to the radio.' },
      { name: 'helperText', type: 'string', description: 'Supplementary text below the label.' },
      { name: 'error', type: 'string | boolean', description: 'Error state message or styling.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction.' },
    ],
    knobs: [
      { name: 'label', type: 'text', default: 'Option 1' },
      { name: 'error', type: 'text', default: '' },
      { name: 'disabled', type: 'boolean', default: false },
    ],
  },
  {
    slug: 'switch',
    name: 'Switch',
    description: 'A control that allows the user to toggle between on and off.',
    category: 'Forms',
    importName: 'Switch',
    props: [
      { name: 'label', type: 'string', description: 'Label rendered next to the switch.' },
      { name: 'helperText', type: 'string', description: 'Supplementary text below the label.' },
      { name: 'error', type: 'string | boolean', description: 'Error state message or styling.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction.' },
      { name: 'checked', type: 'boolean', description: 'Controlled checked state of the switch.' },
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
    description: 'A responsive table component for displaying tabular data.',
    category: 'Data Display',
    importName: 'Table',
    props: [
      { name: 'striped', type: 'boolean', default: 'false', description: 'Alternating background colors for rows.' },
      { name: 'hoverable', type: 'boolean', default: 'false', description: 'Highlight rows on hover.' },
      { name: 'compact', type: 'boolean', default: 'false', description: 'Reduces padding inside cells.' },
      { name: 'stickyHeader', type: 'boolean', default: 'false', description: 'Fixes header at the top when scrolling.' },
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
    usageExample: `import { BarChart } from '@admin-navanta/design-system'

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
    usageExample: `import { LineChart } from '@admin-navanta/design-system'

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
    usageExample: `import { StackedBarChart } from '@admin-navanta/design-system'

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
import { KpiGrid, KpiProgressCard, KpiStatCard, Tooltip } from '@admin-navanta/design-system'

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
]

export function getComponentBySlug(slug: string): ComponentMeta | undefined {
  return componentRegistry.find((c) => c.slug === slug)
}
