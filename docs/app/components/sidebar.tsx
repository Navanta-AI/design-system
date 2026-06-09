'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Info,
  Lightning,
  DownloadSimple,
  Feather,
  Clock,
  BookOpen,
  DiamondsFour,
  MagnifyingGlass,
  TextT,
  CheckCircle,
  User,
  ListDashes,
  CaretRight,
  Cursor,
  IdentificationCard,
  CheckSquare,
  CalendarBlank,
  CaretDown,
  CloudArrowUp,
  PictureInPicture,
  ToggleLeft,
  RadioButton,
  Table,
  Rows,
  SlidersHorizontal,
  Circle,
  ArrowsOutLineHorizontal,
  Spinner,
  Bell,
  Question,
  GridFour,
  Gauge,
  Palette,
  ChartBar,
  ChartLineUp,
  Sparkle,
  Article,
  Sidebar as SidebarIcon,
  Warning,
  Tray,
  Tag,
  Browsers,
} from '@phosphor-icons/react'
import { componentRegistry } from '@/lib/component-registry'

type NavIcon = React.ComponentType<{ size?: number; className?: string }>

interface NavItemProps {
  href: string
  label: string
  icon: NavIcon
}

function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname()
  const isActive =
    href !== '#' &&
    (pathname === href || (href !== '/' && pathname?.startsWith(href)))

  return (
    <Link
      href={href}
      className={`flex items-center gap-[6px] h-[31px] px-[14px] rounded-[8px] text-[13px] transition-colors ${
        isActive
          ? 'bg-muted text-foreground font-medium'
          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
      }`}
    >
      <Icon size={14} className="shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  )
}

const componentIconMap: Record<string, NavIcon> = {
  accordion:  ListDashes,
  avatar:     User,
  breadcrumbs: CaretRight,
  button:     Cursor,
  pill:       Tag,
  card:       IdentificationCard,
  checkbox:   CheckSquare,
  datepicker: CalendarBlank,
  dialog:     PictureInPicture,
  dropzone:   CloudArrowUp,
  input:      TextT,
  kpi:        Gauge,
  pagination: ArrowsOutLineHorizontal,
  progress:   Gauge,
  radio:      RadioButton,
  select:     CaretDown,
  skeleton:   Spinner,
  slider:     SlidersHorizontal,
  switch:     ToggleLeft,
  table:      Table,
  tabs:       Rows,
  textarea:   GridFour,
  toast:      Bell,
  tooltip:    Question,
  'bar-chart': ChartBar,
  'line-chart': ChartLineUp,
  'stacked-bar-chart': ChartBar,
  'page-heading': Article,
  'table-shell': Table,
  'detail-panel': SidebarIcon,
  'christy-suggestions': Sparkle,
  'panel-alert': Warning,
  'panel-info-grid': GridFour,
  'panel-timeline': Clock,
  'empty-state': Tray,
}

export function Sidebar() {
  const components = [...componentRegistry].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  return (
    <aside className="flex h-screen w-[280px] shrink-0 flex-col overflow-y-auto border-r border-border bg-background hide-scrollbar">
      {/* Search */}
      <div className="px-[18px] pt-[16px] pb-[16px]">
        <button
          type="button"
          onClick={() => {
            document.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
            )
          }}
          className="flex h-[32px] w-full items-center justify-between rounded-[8px] border border-border bg-background px-[12px] text-foreground transition-colors hover:bg-muted/40"
          aria-label="Open command palette (⌘K)"
        >
          <div className="flex items-center gap-[4px]">
            <MagnifyingGlass size={14} className="text-muted-foreground" />
            <span className="text-[13px] text-foreground font-['Geist',sans-serif]">Search</span>
          </div>
          <div className="flex items-center gap-[2px] rounded-[4px] border border-border bg-muted/40 px-[6px] py-[2px]">
            <span className="text-[10px] text-muted-foreground">⌘</span>
            <span className="text-[10px] text-muted-foreground">K</span>
          </div>
        </button>
      </div>

      {/* General nav */}
      <nav className="flex flex-col gap-[6px] px-[18px]">
        <NavItem href="/about-navanta" label="Portal Design System" icon={Info} />
        <NavItem href="/getting-started" label="Getting Started" icon={Lightning} />
        <NavItem href="/resources" label="Resources" icon={DownloadSimple} />
        <NavItem href="/templates" label="Templates" icon={Browsers} />
        <NavItem href="/theme" label="Theme" icon={Palette} />
        <NavItem href="/changelog" label="Changelog" icon={Clock} />
      </nav>

      {/* Divider */}
      <div className="mx-[18px] my-[20px] border-t border-border" />

      {/* Guidelines */}
      <div className="flex flex-col gap-[12px] px-[18px]">
        <div className="flex items-center gap-[4px] pl-[14px]">
          <BookOpen size={14} className="text-muted-foreground" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2px] text-muted-foreground">
            Guidelines
          </span>
        </div>
        <div className="flex flex-col gap-[6px]">
          <NavItem href="/grid-layout" label="Grid & Layout" icon={GridFour} />
          <NavItem href="/typography" label="Typography" icon={TextT} />
          <NavItem href="/colors" label="Color" icon={Circle} />
          <NavItem href="/iconography" label="Iconography" icon={Feather} />
          <NavItem href="/validation" label="Validation" icon={CheckCircle} />
          <NavItem href="/accessibility" label="Accessibility" icon={User} />
        </div>
      </div>

      {/* Divider */}
      <div className="mx-[18px] my-[20px] border-t border-border" />

      {/* Components */}
      <div className="flex flex-col gap-[12px] px-[18px] pb-[24px]">
        <div className="flex items-center gap-[4px] pl-[14px]">
          <DiamondsFour size={14} className="text-muted-foreground" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2px] text-muted-foreground">
            Components
          </span>
        </div>
        <div className="flex flex-col gap-[6px]">
          {components.map((component) => {
            const Icon = componentIconMap[component.slug] ?? SlidersHorizontal
            return (
              <NavItem
                key={component.slug}
                href={`/components/${component.slug}`}
                label={component.name}
                icon={Icon}
              />
            )
          })}
        </div>
      </div>
    </aside>
  )
}
