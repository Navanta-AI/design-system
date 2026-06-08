# Publishing & Consuming `@admin-navanta/design-system`

The package is published privately to **GitHub Packages** under the
`admin-navanta` org. Tag-driven CI handles the actual publish — no manual
`npm publish` should be needed.

---

## Cutting a release

Every release is a Git tag in the form `vX.Y.Z` that matches the `version`
field in [`packages/design-system/package.json`](packages/design-system/package.json).
The [`Publish package`](.github/workflows/publish.yml) workflow verifies that
match, builds, and publishes on every tag push.

```bash
# 1. Bump the version in the package
cd packages/design-system
npm version patch          # 0.2.3 -> 0.2.4   (or `minor` / `major` / explicit `0.3.0`)
cd ../..

# 2. Commit the bump
git add packages/design-system/package.json
git commit -m "Release v0.2.4"

# 3. Tag and push (this is what triggers the workflow)
git tag v0.2.4
git push origin main --tags
```

Watch the run at <https://github.com/admin-navanta/design-system/actions>.
Workflow steps:

1. **Verify tag matches package version** — fails fast if the tag and the
   `package.json` version disagree.
2. **Install dependencies** — deletes the lockfile first so the Linux runner
   resolves the matching native bindings (see *Gotchas* below).
3. **Build the package** — runs `tsdown` to emit ESM + CJS + types.
4. **Publish** — runs `npm publish --access restricted` using the built-in
   `GITHUB_TOKEN`. The package stays private to the `admin-navanta` org.

When the run is green, the new version shows up at
<https://github.com/admin-navanta/design-system/pkgs/npm/design-system>.

---

## Consuming the package in another project

### One-time setup per machine

Generate a Personal Access Token at
<https://github.com/settings/tokens/new> with at least the **`read:packages`**
scope, then export it:

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
# Persist by adding to ~/.zshrc (or ~/.bashrc)
```

### One-time setup per consuming project

Create a `.npmrc` at the project root:

```
@admin-navanta:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Add `.npmrc` to `.gitignore` only if it contains a literal token. The
`${GITHUB_TOKEN}` form above reads from the environment, so it's safe to
commit.

### Install and use

```bash
npm install @admin-navanta/design-system
```

```tsx
// app/layout.tsx
import '@admin-navanta/design-system/styles.css'

// any client component
import { Button, Dialog } from '@admin-navanta/design-system'
```

### Installing in CI

GitHub Actions runners can use the workflow's built-in `GITHUB_TOKEN`:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    registry-url: 'https://npm.pkg.github.com'
    scope: '@admin-navanta'
- run: npm install
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

For non-GitHub CI (Vercel, Netlify, etc.), set a `GITHUB_TOKEN` (or
`NPM_TOKEN`) secret with `read:packages` and reference it from the
`.npmrc`.

---

## Gotchas

### Scope must match the repo owner

GitHub Packages only accepts packages whose npm scope matches the owner of
the hosting repo. Because the repo lives under `admin-navanta`, the package
name has to be `@admin-navanta/design-system`. Renaming the repo or moving
it to a different org/user requires a coordinated package rename across all
imports in the codebase.

### macOS-generated lockfile drops Linux native bindings

`tsdown` ships native binaries via `rolldown`. When `npm install` runs on
macOS, the resulting `package-lock.json` only resolves the darwin binding
and omits Linux entries — so `npm ci` on the Linux runner explodes with
`Cannot find module '@rolldown/binding-linux-x64-gnu'`
([npm/cli#4828](https://github.com/npm/cli/issues/4828)).

The workflow deletes the lockfile before `npm install` to sidestep this.
If you ever switch back to `npm ci` for speed, regenerate the lockfile
inside a Linux container first — e.g.:

```bash
docker run --rm -v "$PWD":/app -w /app node:20 \
  bash -c 'rm package-lock.json && npm install --include=optional'
```

### Re-publishing an existing version

GitHub Packages won't let you re-publish a version that already exists.
If a release succeeds halfway and you need to fix something, **bump the
version** — don't try to retag.

### Repo / package visibility

GitHub Packages npm visibility inherits from the source repo's visibility.
If you make the repo public, the package becomes publicly installable.
Manage explicit access at
<https://github.com/orgs/admin-navanta/packages/npm/design-system/settings>.

---

## Quick reference

| Action                                                  | Command / Link                                                                                |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Cut release `vX.Y.Z`                                    | `cd packages/design-system && npm version <bump> && cd ../.. && git tag vX.Y.Z && git push --tags` |
| Watch workflow runs                                     | <https://github.com/admin-navanta/design-system/actions>                                      |
| Browse published versions                               | <https://github.com/admin-navanta/design-system/pkgs/npm/design-system>                       |
| Manage who can install                                  | <https://github.com/orgs/admin-navanta/packages/npm/design-system/settings>                   |
| Generate a `read:packages` PAT (for consumers)          | <https://github.com/settings/tokens/new?scopes=read:packages>                                 |
