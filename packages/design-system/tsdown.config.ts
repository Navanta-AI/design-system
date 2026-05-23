import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    // Per-component entries will be added as components are built in Phase 2+
  },
  format: ['esm', 'cjs'],
  dts: true,
  outDir: 'dist',
  clean: true,
  deps: {
    neverBundle: ['react', 'react-dom'],
  },
  banner: '"use client";',
  // Note: tsdown v0.21 uses banner for adding directives.
  // "use client" will be added via banner when component entries are added in Phase 2+.
  // tokens.css is copied via the build script (cp src/tokens.css dist/tokens.css)
})
