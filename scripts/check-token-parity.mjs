import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docsGlobalsPath = path.join(root, 'docs/app/globals.css');
const packageTokensPath = path.join(root, 'packages/design-system/src/tokens.css');

const docsCss = fs.readFileSync(docsGlobalsPath, 'utf8');
const packageCss = fs.readFileSync(packageTokensPath, 'utf8');

const requiredImports = [
  '@import "../../packages/design-system/src/styles.css";',
  '@import "@navanta/design-system/styles.css";',
  '@import "@navanta/design-system/tokens.css";',
];

if (!requiredImports.some((line) => docsCss.includes(line))) {
  console.error(
    `[parity] Missing canonical token import in docs globals. Expected one of: ${requiredImports.join(' or ')}`
  );
  process.exit(1);
}

const coreVars = [
  '--background', '--foreground', '--card', '--card-foreground', '--popover', '--popover-foreground',
  '--primary', '--primary-foreground', '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
  '--accent', '--accent-foreground', '--destructive', '--destructive-foreground', '--success', '--success-foreground',
  '--warning', '--warning-foreground', '--info', '--info-foreground', '--border', '--input', '--ring'
];

const duplicateDefs = coreVars.filter((v) => new RegExp(`${v}\\s*:`, 'g').test(docsCss));
if (duplicateDefs.length > 0) {
  console.error('[parity] Docs globals re-defines canonical tokens. Remove local definitions for:');
  console.error(`  ${duplicateDefs.join(', ')}`);
  process.exit(1);
}

function parseBlockVars(css, selector) {
  const blockMatch = css.match(new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm'));
  if (!blockMatch) return new Map();

  const vars = new Map();
  const varRegex = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let match;
  while ((match = varRegex.exec(blockMatch[1])) !== null) {
    vars.set(match[1], match[2].trim());
  }
  return vars;
}

const rootVars = parseBlockVars(packageCss, ':root');
const darkVars = parseBlockVars(packageCss, '\\.dark');

const requiredPackageVars = [...coreVars, '--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5', '--chart-6'];
for (const key of requiredPackageVars) {
  if (!rootVars.has(key)) {
    console.error(`[parity] Missing ${key} in package :root tokens.`);
    process.exit(1);
  }
  if (!darkVars.has(key)) {
    console.error(`[parity] Missing ${key} in package .dark tokens.`);
    process.exit(1);
  }
}

console.log('[parity] OK: docs consumes canonical package tokens and required vars exist in light/dark.');
