'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@navanta-ai/design-system'

type SidebarLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
}

export function SidebarLink({ href, children, className }: SidebarLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center rounded-md px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-accent text-accent-foreground font-medium'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
        className
      )}
    >
      {children}
    </Link>
  )
}
