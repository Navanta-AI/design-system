import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { componentRegistry, getComponentBySlug } from '@/lib/component-registry'
import type { ComponentMeta } from '@/lib/component-registry'
import { ComponentTabs } from '@/app/components/component-tabs'
import { DocsWithToc } from '@/app/components/docs-with-toc'
import { ButtonDemo } from './demos/button-demo'
import { InputDemo } from './demos/input-demo'
import { CardDemo } from './demos/card-demo'
import { TextareaDemo } from './demos/textarea-demo'
import { CheckboxDemo } from './demos/checkbox-demo'
import { RadioDemo } from './demos/radio-demo'
import { SwitchDemo } from './demos/switch-demo'
import { SelectDemo } from './demos/select-demo'
import { DialogDemo } from './demos/dialog-demo'
import { ToastDemo } from './demos/toast-demo'
import { AccordionDemo } from './demos/accordion-demo'
import { TabsDemo } from './demos/tabs-demo'
import { TableDemo } from './demos/table-demo'
import { BreadcrumbsDemo } from './demos/breadcrumbs-demo'
import { TooltipDemo } from './demos/tooltip-demo'
import { AvatarDemo } from './demos/avatar-demo'
import { SkeletonDemo } from './demos/skeleton-demo'
import { ProgressDemo } from './demos/progress-demo'
import { PaginationDemo } from './demos/pagination-demo'
import { KpiDemo } from './demos/kpi-demo'
import { SliderDemo } from './demos/slider-demo'
import { DatePickerDemo } from './demos/datepicker-demo'
import { DropzoneDemo } from './demos/dropzone-demo'
import { BarChartDemo } from './demos/bar-chart-demo'
import { LineChartDemo } from './demos/line-chart-demo'
import { StackedBarChartDemo } from './demos/stacked-bar-chart-demo'

const demoMap: Record<string, React.ComponentType<{ meta: ComponentMeta }>> = {
  button: ButtonDemo,
  input: InputDemo,
  card: CardDemo,
  textarea: TextareaDemo,
  checkbox: CheckboxDemo,
  radio: RadioDemo,
  switch: SwitchDemo,
  select: SelectDemo,
  dialog: DialogDemo,
  toast: ToastDemo,
  accordion: AccordionDemo,
  tabs: TabsDemo,
  table: TableDemo,
  breadcrumbs: BreadcrumbsDemo,
  tooltip: TooltipDemo,
  avatar: AvatarDemo,
  skeleton: SkeletonDemo,
  progress: ProgressDemo,
  pagination: PaginationDemo,
  kpi: KpiDemo,
  slider: SliderDemo,
  datepicker: DatePickerDemo,
  dropzone: DropzoneDemo,
  'bar-chart': BarChartDemo,
  'line-chart': LineChartDemo,
  'stacked-bar-chart': StackedBarChartDemo,
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
