import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { CommandPalette } from '@/app/components/command-palette'
import { Sidebar } from '@/app/components/sidebar'
import { ToastProvider, Toaster } from '@admin-navanta/design-system'
import './globals.css'

export const metadata: Metadata = {
  title: 'Navanta Design System',
  description: 'A Tailwind v4-based component library for the Navanta client portal, with a beautiful docs site',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans text-sm antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="navanta-portal-theme"
        >
          <ToastProvider>
            <div className="flex h-screen overflow-hidden bg-background font-sans antialiased">
              <CommandPalette />
              <div className="hidden md:block">
                <Sidebar />
              </div>
              <div id="docs-scroll-container" className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
                {children}
              </div>
              <Toaster position="bottom-right" />
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
