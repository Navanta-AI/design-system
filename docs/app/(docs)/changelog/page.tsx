import type { Metadata } from 'next'
import { DocsWithToc } from '@/app/components/docs-with-toc'

export const metadata: Metadata = {
  title: 'Changelog - Navanta Design System',
  description: 'Latest updates and releases for Navanta Design System',
}

const sectionLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'v0-1-0', label: 'v0.1.0' },
  { id: 'v0-0-1', label: 'v0.0.1' },
]

export default function ChangelogPage() {
  return (
    <DocsWithToc links={sectionLinks} contentClassName="max-w-3xl space-y-10">
      <section id="overview" className="scroll-mt-24">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Changelog</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Latest updates and releases to the Navanta Design System component system.
        </p>
      </section>

      <section id="v0-1-0" className="scroll-mt-24 space-y-8 border-l-2 border-border pl-6 relative border-t border-border pt-6">
        <div className="relative">
          <div className="absolute -left-[1.95rem] mt-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
          <h2 className="text-xl font-semibold tracking-tight">v0.1.0 — Component Expansion</h2>
          <p className="text-sm text-muted-foreground mt-1">April 2, 2026</p>
          <div className="mt-4 space-y-6">
            <p className="text-sm text-muted-foreground">Major expansion of the component library — 13 new components added across data display, feedback, and form categories.</p>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">New Components</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Accordion</strong>: Collapsible content panels with smooth animation.</li>
                <li><strong>Tabs</strong>: Accessible tabbed navigation with keyboard support.</li>
                <li><strong>Table</strong>: Full-featured data table with sortable columns and responsive layout.</li>
                <li><strong>Breadcrumbs</strong>: Hierarchical navigation trail.</li>
                <li><strong>Tooltip</strong>: Lightweight hover label with 4 placement options.</li>
                <li><strong>Avatar</strong>: User avatars with image, initials fallback, and AvatarGroup stacking.</li>
                <li><strong>Skeleton</strong>: Loading placeholder with pulse animation.</li>
                <li><strong>Progress</strong>: Linear and circular progress indicators.</li>
                <li><strong>Pagination</strong>: Page navigation with configurable sibling count.</li>
                <li><strong>Slider</strong>: Range input with custom thumb and track styling.</li>
                <li><strong>DatePicker</strong>: Custom calendar picker with no external dependencies.</li>
                <li><strong>Dropzone</strong>: File upload zone with drag-and-drop support.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Updated Components</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Card</strong>: Added <code className="text-xs bg-muted px-1 py-0.5 rounded">CardTitle</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">CardDescription</code>, and <code className="text-xs bg-muted px-1 py-0.5 rounded">CardAction</code> sub-components.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="v0-0-1" className="scroll-mt-24 space-y-8 border-l-2 border-border pl-6 relative border-t border-border pt-6">
        <div className="relative">
          <div className="absolute -left-[1.95rem] mt-1.5 h-3 w-3 rounded-full border-2 border-muted-foreground bg-background" />
          <h2 className="text-xl font-semibold tracking-tight">v0.0.1 — Initial Release</h2>
          <p className="text-sm text-muted-foreground mt-1">March 19, 2026</p>
          <div className="mt-4 space-y-6">
            <p className="text-sm text-muted-foreground">First release of Navanta Design System — a unified, natively typed package built on Tailwind v4, fully compatible with React Server Components.</p>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Core Components</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Button</strong>: 6 variants (primary, secondary, outline, ghost, destructive, link) and 4 sizes with icon support.</li>
                <li><strong>Input</strong>: Clearable text input with left/right semantic icons.</li>
                <li><strong>Card</strong>: Composable layout card with header, content, and footer slots.</li>
                <li><strong>Textarea</strong>: Auto-resizing textarea with min/max height constraints.</li>
                <li><strong>Checkbox</strong>: Accessible animated checkbox using peer class mechanics.</li>
                <li><strong>Radio</strong>: Native accessible radio input with custom styling.</li>
                <li><strong>Switch</strong>: Animated toggle conforming to <code className="text-xs bg-muted px-1 py-0.5 rounded">role="switch"</code>.</li>
                <li><strong>Select</strong>: Composable dropdown with groups, labels, and separators.</li>
                <li><strong>Dialog</strong>: Accessible modal with Esc dismissal and focus trapping.</li>
                <li><strong>Toast</strong>: Context-API-powered stackable notifications with <code className="text-xs bg-muted px-1 py-0.5 rounded">Toaster</code> and <code className="text-xs bg-muted px-1 py-0.5 rounded">ToastProvider</code>.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </DocsWithToc>
  )
}
