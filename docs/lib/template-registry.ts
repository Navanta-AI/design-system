/**
 * Template registry — full-screen reference designs built entirely from DS
 * components. Grouped by the kind of design ("Table Shell" = screens driven by
 * the unified TableShell). Add a new entry here to surface it in /templates.
 */

export type TemplateCategory = 'Table Shell'

export type TemplateMeta = {
  /** URL-safe id. */
  slug: string
  /** Display name. */
  name: string
  /** One-paragraph summary of what the screen demonstrates. */
  description: string
  /** Which design family this template belongs to. */
  category: TemplateCategory
  /** Where to view the full-page template. */
  href: string
  /** Preview image under /public. */
  thumbnail?: string
  /** DS pieces the template exercises (shown as chips). */
  tags?: string[]
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = ['Table Shell']

export const templateRegistry: TemplateMeta[] = [
  {
    slug: 'product-catalog',
    name: 'Product Catalog',
    description:
      'A full inventory/catalog screen: the unified TableShell filter bar (search + Critical / High / Transfers chips + a time select), saved-view tabs, pill cells (Source route/code, Exception), an id cell with a product subtitle, and a Christy (AI) "Iris Insight" column.',
    category: 'Table Shell',
    href: '/playground/product-catalog',
    thumbnail: '/templates/product-catalog.png',
    tags: ['TableShell', 'Facets', 'Pill cells', 'Tabs', 'AI insight'],
  },
]

export function getTemplatesByCategory(category: TemplateCategory): TemplateMeta[] {
  return templateRegistry.filter((t) => t.category === category)
}
