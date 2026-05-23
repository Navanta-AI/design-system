'use client'

import { useEffect, useMemo, useState } from 'react'

export interface OnThisPageLink {
  id: string
  label: string
}

interface OnThisPageNavProps {
  links: OnThisPageLink[]
}

const TRACK_OFFSET = 120
const SCROLL_CONTAINER_ID = 'docs-scroll-container'

function getActiveSection(links: OnThisPageLink[]) {
  if (!links.length) {
    return ''
  }

  const container = document.getElementById(SCROLL_CONTAINER_ID)
  const scrollElement = container ?? document.documentElement
  const scrollTop = container ? container.scrollTop : window.scrollY
  const viewportHeight = container ? container.clientHeight : window.innerHeight
  const viewportBottom = scrollTop + viewportHeight
  const documentHeight = scrollElement.scrollHeight

  // Pin the final section at the true end of page scroll.
  if (viewportBottom >= documentHeight - 2) {
    return links[links.length - 1].id
  }

  let activeId = links[0].id
  const containerTop = container?.getBoundingClientRect().top ?? 0
  for (const link of links) {
    const section = document.getElementById(link.id)
    if (!section) {
      continue
    }

    const rect = section.getBoundingClientRect()
    const absoluteTop = container
      ? rect.top - containerTop + scrollTop
      : rect.top + scrollTop
    if (absoluteTop - TRACK_OFFSET <= scrollTop) {
      activeId = link.id
    } else {
      break
    }
  }

  return activeId
}

export function OnThisPageNav({ links }: OnThisPageNavProps) {
  const safeLinks = useMemo(() => links.filter((link) => link.id), [links])
  const [activeId, setActiveId] = useState(safeLinks[0]?.id ?? '')

  useEffect(() => {
    if (!safeLinks.length) {
      return
    }

    const syncFromScroll = () => {
      const next = getActiveSection(safeLinks)
      if (!next) return
      setActiveId((prev) => (prev === next ? prev : next))
    }

    const syncFromHash = () => {
      const hashId = window.location.hash.replace('#', '')
      if (hashId && safeLinks.some((link) => link.id === hashId)) {
        setActiveId(hashId)
        return
      }
      syncFromScroll()
    }

    syncFromHash()

    let ticking = false
    const onScroll = () => {
      if (ticking) {
        return
      }
      ticking = true
      window.requestAnimationFrame(() => {
        syncFromScroll()
        ticking = false
      })
    }

    const scrollContainer = document.getElementById(SCROLL_CONTAINER_ID)
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', onScroll, { passive: true })
    } else {
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    window.addEventListener('resize', onScroll)
    window.addEventListener('hashchange', syncFromHash)

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', onScroll)
      } else {
        window.removeEventListener('scroll', onScroll)
      }
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('hashchange', syncFromHash)
    }
  }, [safeLinks])

  return (
    <nav className="relative mt-2">
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-px bg-border" />
      {safeLinks.map((link) => {
        const isActive = link.id === activeId
        return (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={`relative block px-3 py-1.5 text-[12px] font-semibold leading-5 transition-colors ${
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span
              className={`pointer-events-none absolute bottom-0 left-0 top-0 w-px ${
                isActive ? 'bg-foreground' : 'bg-transparent'
              }`}
            />
            {link.label}
          </a>
        )
      })}
    </nav>
  )
}
