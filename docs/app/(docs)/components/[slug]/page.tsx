import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { componentRegistry, getComponentBySlug } from '@/lib/component-registry'
import type { ComponentMeta } from '@/lib/component-registry'
import { ComponentTabs } from '@/app/components/component-tabs'
import { DocsWithToc } from '@/app/components/docs-with-toc'

/**
 * Each demo is loaded lazily via next/dynamic so a given component page only
 * pulls in its own demo chunk — not all ~33 demos (and their heavy deps like
 * charts / shiki). This keeps per-page bundles small and, in dev, makes
 * Turbopack compile only the visited demo instead of the whole set.
 */
type DemoComponent = React.ComponentType<{ meta: ComponentMeta }>

const demoMap: Record<string, DemoComponent> = {
  button: dynamic(() => import('./demos/button-demo').then((m) => m.ButtonDemo)),
  pill: dynamic(() => import('./demos/pill-demo').then((m) => m.PillDemo)),
  chip: dynamic(() => import('./demos/chip-demo').then((m) => m.ChipDemo)),
  input: dynamic(() => import('./demos/input-demo').then((m) => m.InputDemo)),
  card: dynamic(() => import('./demos/card-demo').then((m) => m.CardDemo)),
  textarea: dynamic(() => import('./demos/textarea-demo').then((m) => m.TextareaDemo)),
  checkbox: dynamic(() => import('./demos/checkbox-demo').then((m) => m.CheckboxDemo)),
  radio: dynamic(() => import('./demos/radio-demo').then((m) => m.RadioDemo)),
  switch: dynamic(() => import('./demos/switch-demo').then((m) => m.SwitchDemo)),
  select: dynamic(() => import('./demos/select-demo').then((m) => m.SelectDemo)),
  dialog: dynamic(() => import('./demos/dialog-demo').then((m) => m.DialogDemo)),
  toast: dynamic(() => import('./demos/toast-demo').then((m) => m.ToastDemo)),
  accordion: dynamic(() => import('./demos/accordion-demo').then((m) => m.AccordionDemo)),
  tabs: dynamic(() => import('./demos/tabs-demo').then((m) => m.TabsDemo)),
  table: dynamic(() => import('./demos/table-demo').then((m) => m.TableDemo)),
  breadcrumbs: dynamic(() => import('./demos/breadcrumbs-demo').then((m) => m.BreadcrumbsDemo)),
  tooltip: dynamic(() => import('./demos/tooltip-demo').then((m) => m.TooltipDemo)),
  avatar: dynamic(() => import('./demos/avatar-demo').then((m) => m.AvatarDemo)),
  skeleton: dynamic(() => import('./demos/skeleton-demo').then((m) => m.SkeletonDemo)),
  progress: dynamic(() => import('./demos/progress-demo').then((m) => m.ProgressDemo)),
  pagination: dynamic(() => import('./demos/pagination-demo').then((m) => m.PaginationDemo)),
  kpi: dynamic(() => import('./demos/kpi-demo').then((m) => m.KpiDemo)),
  slider: dynamic(() => import('./demos/slider-demo').then((m) => m.SliderDemo)),
  datepicker: dynamic(() => import('./demos/datepicker-demo').then((m) => m.DatePickerDemo)),
  dropzone: dynamic(() => import('./demos/dropzone-demo').then((m) => m.DropzoneDemo)),
  'bar-chart': dynamic(() => import('./demos/bar-chart-demo').then((m) => m.BarChartDemo)),
  'line-chart': dynamic(() => import('./demos/line-chart-demo').then((m) => m.LineChartDemo)),
  'stacked-bar-chart': dynamic(() => import('./demos/stacked-bar-chart-demo').then((m) => m.StackedBarChartDemo)),
  'page-heading': dynamic(() => import('./demos/page-heading-demo').then((m) => m.PageHeadingDemo)),
  'side-nav': dynamic(() => import('./demos/side-nav-demo').then((m) => m.SideNavDemo)),
  'table-shell': dynamic(() => import('./demos/table-shell-demo').then((m) => m.TableShellDemo)),
  'detail-panel': dynamic(() => import('./demos/detail-panel-demo').then((m) => m.DetailPanelDemo)),
  'christy-suggestions': dynamic(() => import('./demos/christy-suggestions-demo').then((m) => m.ChristySuggestionsDemo)),
  'panel-alert': dynamic(() => import('./demos/panel-alert-demo').then((m) => m.PanelAlertDemo)),
  'panel-info-grid': dynamic(() => import('./demos/panel-info-grid-demo').then((m) => m.PanelInfoGridDemo)),
  'panel-timeline': dynamic(() => import('./demos/panel-timeline-demo').then((m) => m.PanelTimelineDemo)),
  'empty-state': dynamic(() => import('./demos/empty-state-demo').then((m) => m.EmptyStateDemo)),
}

export function generateStaticParams() {
  return componentRegistry.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const comp = getComponentBySlug(slug)
  if (!comp) return {}
  return { title: `${comp.name} - Navanta Design System` }
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const component = getComponentBySlug(slug)

  if (!component) {
    notFound()
  }

  const DemoComponent = demoMap[component.slug]

  // Wide data tables read better edge-to-edge: this page opts into the full-width
  // docs layout (see DocsContentColumn) and drops the "On this page" rail.
  const fullWidth = component.slug === 'table-shell'

  const demoContent = DemoComponent ? (
    <DemoComponent meta={component} />
  ) : (
    <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-border bg-background p-10 text-muted-foreground text-sm">
      Demo not yet available for this component.
    </div>
  )

  return (
    <DocsWithToc
      links={[
        { id: 'overview', label: 'Overview' },
        { id: 'component-docs', label: 'Component Docs' },
      ]}
      contentClassName="space-y-6"
      hideOnThisPage={fullWidth}
    >
      <section id="overview" className="scroll-mt-24">
        <h1 className="text-[20px] font-semibold text-[#161616] dark:text-foreground">{component.name}</h1>
        <p className="mt-2 text-[14px] text-[#535353] dark:text-muted-foreground">{component.description}</p>
        <div id="component-docs" className="mt-6 scroll-mt-24">
          <ComponentTabs component={component}>
            {demoContent}
          </ComponentTabs>
        </div>
      </section>
    </DocsWithToc>
  )
}
