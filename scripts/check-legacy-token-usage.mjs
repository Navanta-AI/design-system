import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const legacyTokens = [
  '--surface-',
  '--text-',
  '--border-default',
  '--border-strong',
  '--brand-primary',
  '--brand-purple-deep',
  '--btn-primary-',
  '--btn-secondary-',
  '--gradient-',
  '--shadow-focus',
];

const allowPrefixes = [
  'packages/design-system/src/tokens.css',
  'packages/design-system/src/components/ui/',
  'docs/app/globals.css',
];

const scanDirs = ['docs', 'packages'];
const ignoredDirs = ['node_modules', '.git', '.next', 'dist', 'build'];
const allowedExtensions = ['.json', '.js', '.ts', '.tsx', '.css', '.md', '.mjs'];

const disallowed = [];

function checkFile(filePath) {
  const normalizedPath = path.relative(root, filePath).replaceAll('\\\\', '/').replaceAll('\\', '/');
  const isAllowedZone = allowPrefixes.some((prefix) => normalizedPath.startsWith(prefix));
  if (isAllowedZone) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const token of legacyTokens) {
      if (line.includes(token)) {
        disallowed.push(`${normalizedPath}:${i + 1}:${line.trim()}`);
      }
    }
  }
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (ignoredDirs.includes(file)) continue;
      walk(filePath);
    } else {
      const ext = path.extname(file);
      if (allowedExtensions.includes(ext)) {
        checkFile(filePath);
      }
    }
  }
}

for (const d of scanDirs) {
  const dirPath = path.join(root, d);
  if (fs.existsSync(dirPath)) {
    walk(dirPath);
  }
}

if (disallowed.length > 0) {
  console.error('[legacy-gate] Found legacy token usage outside allowed migration zones:');
  for (const line of disallowed) {
    console.error(`  ${line}`);
  }
  process.exit(1);
}

console.log('[legacy-gate] OK: legacy token usage constrained to migration-safe files.');
process.exit(0);
