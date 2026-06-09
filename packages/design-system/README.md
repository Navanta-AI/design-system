# Navanta Design System

A modern, highly-accessible React component library for the Navanta client portal, natively integrated with **Tailwind v4** and fully optimized for the Next.js App Router (React Server Components).

## Features
- **Tailwind v4 Integration**: Styles compile natively into your Tailwind layer utilizing modern CSS custom property mechanics.
- **Accessible Overlays**: Clean overlay architectures with robust focus trapping and keyboard event capture bound inside `<Dialog>` and `<Toast>`.
- **React Server Components (RSC) Ready**: Explicit `"use client"` directives bundle flawlessly, safeguarding Next.js layout streaming pipelines.
- **Native Semantic Theming**: Zero-configuration theme switching (Light/Dark mode) utilizing raw CSS variables paired with Tailwind utility classes.
- **Tree-shakeable**: Minimal external payload size with high runtime efficiency.

## Installation

```bash
npm install @navanta-ai/design-system @phosphor-icons/react
```

## Setup (Next.js Application)

Navanta exports its semantic styling rules explicitly. You must import the package's CSS payload directly into your root layout file (`app/layout.tsx` for App Router).

```tsx
// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";

// 1. Import your standard global styles (including standard Tailwind)
import "./globals.css";
// 2. Import the Navanta design system tokens
import "@navanta-ai/design-system/styles.css"; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    {/* Setting the base background and foreground from the imported tokens */}
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
```

## Quick Start

Navanta exposes modular components from its main entry point seamlessly.

```tsx
"use client"
import { useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@navanta-ai/design-system";

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Modal
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} size="md">
        <DialogHeader>Installation Success</DialogHeader>
        <DialogBody>
          The Navanta Design System is functioning correctly within your component tree!
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
```

## Component Library
The v1.0.0 package ships with 10 critical components out of the box:
- **Overlays**: `Dialog`, `Toast` (with `ToastProvider` and `<Toaster />`)
- **Forms**: `Input`, `Textarea`, `Checkbox`, `Radio`, `Switch`, `Select`
- **Interface**: `Button`, `Card`

## Development Guide
Navanta relies on `tsdown` to construct the ESM (`.mjs`) and CJS (`.cjs`) output bundles flawlessly.

```bash
# Rebuild the package bundles and types locally
npm run build

# Watch mode for iterative local development
npm run dev
```
