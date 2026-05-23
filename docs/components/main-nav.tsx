"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6">
          <rect width="256" height="256" fill="none"></rect>
          <line x1="208" y1="128" x2="128" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
          <line x1="192" y1="40" x2="40" y2="192" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
        </svg>
        <span className="hidden font-bold lg:inline-block">
          navanta/ui
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <Link
          href="/getting-started"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/getting-started" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Docs
        </Link>
        <Link
          href="/components/button"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/components") ? "text-foreground" : "text-foreground/60"
          )}
        >
          Components
        </Link>
        <Link
          href="/colors"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/colors") ? "text-foreground" : "text-foreground/60"
          )}
        >
          Colors
        </Link>
      </nav>
    </div>
  )
}
