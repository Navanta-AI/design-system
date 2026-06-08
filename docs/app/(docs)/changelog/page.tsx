import type { Metadata } from 'next'
import { DocsWithToc } from '@/app/components/docs-with-toc'

export const metadata: Metadata = {
  title: 'Changelog - Navanta Design System',
  description: 'Latest updates and releases for Navanta Design System',
}

const sectionLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'v0-2-6', label: 'v0.2.6' },
  { id: 'v0-2-5', label: 'v0.2.5' },
  { id: 'v0-2-4', label: 'v0.2.4' },
  { id: 'v0-2-0', label: 'v0.2.0–v0.2.3' },
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

      <section id="v0-2-6" className="scroll-mt-24 space-y-8 border-l-2 border-border pl-6 relative border-t border-border pt-6">
        <div className="relative">
          <div className="absolute -left-[1.95rem] mt-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
          <h2 className="text-xl font-semibold tracking-tight">v0.2.6 — Standardized Table Cells &amp; AI Star</h2>
          <p className="text-sm text-muted-foreground mt-1">May 30, 2026</p>
          <div className="mt-4 space-y-6">
            <p className="text-sm text-muted-foreground">Standardized the data-table experience to match the HMTX Portal design — typed cell-content variants, functioning sorting, and a shared AI mark.</p>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">New — Table cell variants</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">Table.Cell</code> gained a <code className="text-xs bg-muted px-1 py-0.5 rounded">variant</code>: <code className="text-xs bg-muted px-1 py-0.5 rounded">id</code> (circle badge + link text + copy), <code className="text-xs bg-muted px-1 py-0.5 rounded">party</code> (avatar + title + subtext), <code className="text-xs bg-muted px-1 py-0.5 rounded">status</code> (progress dots + label), <code className="text-xs bg-muted px-1 py-0.5 rounded">date</code> (auto relative subtext), and <code className="text-xs bg-muted px-1 py-0.5 rounded">input</code> (inline editable, 120px min-width). Plain text/number stays the default.</li>
                <li>Canonical status registry <code className="text-xs bg-muted px-1 py-0.5 rounded">TABLE_STATUSES</code> (4-step lifecycle) with a per-row <code className="text-xs bg-muted px-1 py-0.5 rounded">tone</code> override (success / warning / danger), plus <code className="text-xs bg-muted px-1 py-0.5 rounded">formatTableDate</code> / <code className="text-xs bg-muted px-1 py-0.5 rounded">formatRelativeTime</code> helpers.</li>
                <li>Added semantic tokens <code className="text-xs bg-muted px-1 py-0.5 rounded">--text-link</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">--info-strong</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">--info-subtle</code> (light + dark).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">New — Sorting</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">useTableSort(data, getValue, initial?)</code> makes sorting functional out of the box: returns <code className="text-xs bg-muted px-1 py-0.5 rounded">sorted</code> rows and <code className="text-xs bg-muted px-1 py-0.5 rounded">getHeadProps(key, enabled?)</code> to spread onto each <code className="text-xs bg-muted px-1 py-0.5 rounded">Table.HeadCell</code>. Pass an initial key for a default sort; pass <code className="text-xs bg-muted px-1 py-0.5 rounded">enabled = false</code> to disable sorting for a column.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">New — TableShell chrome &amp; empty states</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>TableShell</strong> is now the standard table chrome: heading + <code className="text-xs bg-muted px-1 py-0.5 rounded">Customize</code> action, toolbar (built-in <code className="text-xs bg-muted px-1 py-0.5 rounded">search</code> + <code className="text-xs bg-muted px-1 py-0.5 rounded">filters</code> slot), optional <code className="text-xs bg-muted px-1 py-0.5 rounded">tabs</code> with count badges, and the footer (count + pagination + page-size).</li>
                <li><strong><code className="text-xs bg-muted px-1 py-0.5 rounded">EmptyState</code></strong> (nested-ring icon, title, description, action) + <strong><code className="text-xs bg-muted px-1 py-0.5 rounded">Table.Empty</code></strong> (full-span centered row) standardize the first-time and no-results screens — column headers and footer stay visible and the content centers in the body.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">New</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong><code className="text-xs bg-muted px-1 py-0.5 rounded">AiStar</code></strong>: standard inline AI mark (<code className="text-xs bg-muted px-1 py-0.5 rounded">size</code> + <code className="text-xs bg-muted px-1 py-0.5 rounded">title</code> props). Drop it into any container heading to flag AI-generated content. Self-contained SVG — no longer depends on a consumer copying <code className="text-xs bg-muted px-1 py-0.5 rounded">AI-star-small.svg</code> into <code className="text-xs bg-muted px-1 py-0.5 rounded">/public</code>, and its gradient ids are unique per instance so multiple stars never collide.</li>
                <li><strong>Built into the table</strong>: <code className="text-xs bg-muted px-1 py-0.5 rounded">Table.HeadCell</code> now takes an <code className="text-xs bg-muted px-1 py-0.5 rounded">ai</code> prop that renders the star before the column label — <code className="text-xs bg-muted px-1 py-0.5 rounded">&lt;Table.HeadCell ai&gt;Christy Score&lt;/Table.HeadCell&gt;</code> — so AI-derived columns are flagged consistently without hand-wiring the icon.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Improvements</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>ChristySuggestions</strong> and <strong>PageHeading</strong> now render the shared <code className="text-xs bg-muted px-1 py-0.5 rounded">AiStar</code> instead of an <code className="text-xs bg-muted px-1 py-0.5 rounded">&lt;img&gt;</code> pointing at <code className="text-xs bg-muted px-1 py-0.5 rounded">/public</code>, so the AI mark renders out of the box in consumer apps.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="v0-2-5" className="scroll-mt-24 space-y-8 border-l-2 border-border pl-6 relative border-t border-border pt-6">
        <div className="relative">
          <div className="absolute -left-[1.95rem] mt-1.5 h-3 w-3 rounded-full border-2 border-muted-foreground bg-background" />
          <h2 className="text-xl font-semibold tracking-tight">v0.2.5 — Consolidation &amp; Style Fixes</h2>
          <p className="text-sm text-muted-foreground mt-1">May 30, 2026</p>
          <div className="mt-4 space-y-6">
            <p className="text-sm text-muted-foreground">Collapsed duplicate components into the base layer, folded the Christy button and Modal into existing components, and fixed styles that previously only rendered inside the docs app.</p>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Breaking Changes</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Removed <code className="text-xs bg-muted px-1 py-0.5 rounded">PrimaryButton</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">SecondaryButton</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">DisabledButton</code>, and <code className="text-xs bg-muted px-1 py-0.5 rounded">ChristyButton</code> — use <code className="text-xs bg-muted px-1 py-0.5 rounded">Button</code> with a <code className="text-xs bg-muted px-1 py-0.5 rounded">variant</code> (Christy is now <code className="text-xs bg-muted px-1 py-0.5 rounded">variant=&quot;christy&quot;</code>).</li>
                <li>Removed <code className="text-xs bg-muted px-1 py-0.5 rounded">Modal</code> — use <code className="text-xs bg-muted px-1 py-0.5 rounded">Dialog</code>, which now accepts <code className="text-xs bg-muted px-1 py-0.5 rounded">title</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">subtitle</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">icon</code>, and <code className="text-xs bg-muted px-1 py-0.5 rounded">footer</code> convenience props.</li>
                <li>Removed <code className="text-xs bg-muted px-1 py-0.5 rounded">TrendCard</code> and <code className="text-xs bg-muted px-1 py-0.5 rounded">ProgressCard</code> — use the KPI family (<code className="text-xs bg-muted px-1 py-0.5 rounded">KpiStatCard</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">KpiProgressCard</code>).</li>
                <li>Removed <code className="text-xs bg-muted px-1 py-0.5 rounded">Dropdown</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">SearchInput</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">TextInput</code>, the duplicate <code className="text-xs bg-muted px-1 py-0.5 rounded">Textarea</code>, and the ui <code className="text-xs bg-muted px-1 py-0.5 rounded">ToastContainer</code> — use <code className="text-xs bg-muted px-1 py-0.5 rounded">Select</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">Input</code>, and <code className="text-xs bg-muted px-1 py-0.5 rounded">Toaster</code>.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Improvements</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Button</strong>: added a <code className="text-xs bg-muted px-1 py-0.5 rounded">christy</code> gradient variant.</li>
                <li><strong>Dialog</strong>: optional <code className="text-xs bg-muted px-1 py-0.5 rounded">title</code>/<code className="text-xs bg-muted px-1 py-0.5 rounded">subtitle</code>/<code className="text-xs bg-muted px-1 py-0.5 rounded">icon</code>/<code className="text-xs bg-muted px-1 py-0.5 rounded">footer</code> props provide a Modal-style API alongside the compound children.</li>
                <li><strong>TableShell</strong>: now composes the base <code className="text-xs bg-muted px-1 py-0.5 rounded">Select</code> for its page-size control.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Fixes</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Ship a default <code className="text-xs bg-muted px-1 py-0.5 rounded">border-color: var(--border)</code> in <code className="text-xs bg-muted px-1 py-0.5 rounded">styles.css</code> so bare borders and dividers no longer render as hard <code className="text-xs bg-muted px-1 py-0.5 rounded">currentColor</code> edges in consumer apps (previously correct only in the docs).</li>
                <li>Ship the <code className="text-xs bg-muted px-1 py-0.5 rounded">.christy-btn-primary</code> gradient class in <code className="text-xs bg-muted px-1 py-0.5 rounded">styles.css</code> so the Christy CTA styles work without any consumer setup.</li>
                <li><strong>Tooltip</strong>: now shadow-only — removed the unintended border.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="v0-2-4" className="scroll-mt-24 space-y-8 border-l-2 border-border pl-6 relative border-t border-border pt-6">
        <div className="relative">
          <div className="absolute -left-[1.95rem] mt-1.5 h-3 w-3 rounded-full border-2 border-muted-foreground bg-background" />
          <h2 className="text-xl font-semibold tracking-tight">v0.2.4 — Self-Contained Styles</h2>
          <p className="text-sm text-muted-foreground mt-1">May 30, 2026</p>
          <div className="mt-4 space-y-6">
            <p className="text-sm text-muted-foreground">Fixed the published package so components render fully styled out of the box.</p>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Fixes</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">dist/styles.css</code> is now a self-contained compiled stylesheet (Tailwind theme, the utilities the components use, and a <code className="text-xs bg-muted px-1 py-0.5 rounded">@theme inline</code> token mapping — no preflight). Earlier versions shipped only raw tokens, so components imported from the package rendered as unstyled text.</li>
                <li>Consumers now only need <code className="text-xs bg-muted px-1 py-0.5 rounded">@import &quot;@admin-navanta/design-system/styles.css&quot;;</code> — the previous <code className="text-xs bg-muted px-1 py-0.5 rounded">@source</code>/<code className="text-xs bg-muted px-1 py-0.5 rounded">@theme</code> workaround is no longer required.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="v0-2-0" className="scroll-mt-24 space-y-8 border-l-2 border-border pl-6 relative border-t border-border pt-6">
        <div className="relative">
          <div className="absolute -left-[1.95rem] mt-1.5 h-3 w-3 rounded-full border-2 border-muted-foreground bg-background" />
          <h2 className="text-xl font-semibold tracking-tight">v0.2.0 – v0.2.3 — Packaging &amp; Distribution</h2>
          <p className="text-sm text-muted-foreground mt-1">May 25, 2026</p>
          <div className="mt-4 space-y-6">
            <p className="text-sm text-muted-foreground">Release-automation and distribution groundwork.</p>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Changes</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Renamed the package to <code className="text-xs bg-muted px-1 py-0.5 rounded">@admin-navanta/design-system</code>.</li>
                <li>Added a tag-driven GitHub Actions workflow that publishes the package on version-tag push.</li>
                <li>Cross-platform CI build fixes (rolldown native bindings / lockfile handling on Linux).</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="v0-1-0" className="scroll-mt-24 space-y-8 border-l-2 border-border pl-6 relative border-t border-border pt-6">
        <div className="relative">
          <div className="absolute -left-[1.95rem] mt-1.5 h-3 w-3 rounded-full border-2 border-muted-foreground bg-background" />
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
