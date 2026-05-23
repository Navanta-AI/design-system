import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageTokensPath = path.join(root, 'packages/design-system/src/tokens.css');
const css = fs.readFileSync(packageTokensPath, 'utf8');

function parseBlockVars(selector) {
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

const light = parseBlockVars(':root');
const dark = parseBlockVars('\\.dark');

const PAIRS = [
  ['--background', '--foreground'],
  ['--card', '--card-foreground'],
  ['--popover', '--popover-foreground'],
  ['--primary', '--primary-foreground'],
  ['--secondary', '--secondary-foreground'],
  ['--muted', '--muted-foreground'],
  ['--accent', '--accent-foreground'],
  ['--destructive', '--destructive-foreground'],
  ['--success', '--success-foreground'],
  ['--warning', '--warning-foreground'],
  ['--info', '--info-foreground'],
];

function hexToRgb(hex) {
  const raw = hex.replace('#', '').trim();
  if (![3, 6].includes(raw.length)) throw new Error(`Unsupported color format: ${hex}`);
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  const n = Number.parseInt(full, 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

function channelToLinear(c) {
  const x = c / 255;
  return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b);
}

function contrastRatio(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function requireHex(map, key, mode) {
  const v = map.get(key);
  if (!v) throw new Error(`[contrast] Missing ${key} in ${mode} mode.`);
  if (!/^#[0-9a-fA-F]{6}$/.test(v)) {
    throw new Error(`[contrast] ${key} in ${mode} mode must be 6-digit hex. Found: ${v}`);
  }
  return v.toUpperCase();
}

let failed = false;
for (const [bg, fg] of PAIRS) {
  const lBg = requireHex(light, bg, 'light');
  const lFg = requireHex(light, fg, 'light');
  const dBg = requireHex(dark, bg, 'dark');
  const dFg = requireHex(dark, fg, 'dark');

  const lightRatio = contrastRatio(lBg, lFg);
  const darkRatio = contrastRatio(dBg, dFg);

  if (lightRatio < 4.5) {
    failed = true;
    console.error(`[contrast] light ${bg}/${fg} ratio ${lightRatio.toFixed(2)} < 4.5`);
  }
  if (darkRatio < 4.5) {
    failed = true;
    console.error(`[contrast] dark ${bg}/${fg} ratio ${darkRatio.toFixed(2)} < 4.5`);
  }
}

if (failed) {
  process.exit(1);
}

console.log('[contrast] OK: semantic utility/text pairs satisfy >= 4.5 contrast in light and dark.');
