import StyleDictionary from 'style-dictionary';

const nameTransform = {
  name: 'name/kebab',
  type: 'name',
  transform: (token) => token.path.join('-'),
};

// ── Light theme: base tokens + light colors + light effects ──
const sdLight = new StyleDictionary({
  hooks: { transforms: { 'name/kebab': nameTransform } },
  source: ['tokens/base.json', 'tokens/color-light.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      transforms: ['name/kebab'],
      buildPath: 'dist/tokens/',
      files: [{
        destination: 'tokens-light.css',
        format: 'css/variables',
        options: { selector: ':root, [data-theme="light"]' },
      }],
    },
    json: {
      transformGroup: 'css',
      transforms: ['name/kebab'],
      buildPath: 'dist/tokens/',
      files: [{
        destination: 'tokens.json',
        format: 'json/flat',
      }],
    },
  },
});

// ── Dark theme: base tokens + dark colors + dark effects ─────
const sdDark = new StyleDictionary({
  hooks: { transforms: { 'name/kebab': nameTransform } },
  source: ['tokens/base.json', 'tokens/color-dark.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      transforms: ['name/kebab'],
      buildPath: 'dist/tokens/',
      files: [{
        destination: 'tokens-dark.css',
        format: 'css/variables',
        options: { selector: '[data-theme="dark"]' },
      }],
    },
  },
});

// ── JS module: base + light (for runtime defaults) ──────────
const sdJs = new StyleDictionary({
  hooks: { transforms: { 'name/kebab': nameTransform } },
  source: ['tokens/base.json', 'tokens/color-light.json'],
  platforms: {
    js: {
      transformGroup: 'js',
      buildPath: 'dist/tokens/',
      files: [{
        destination: 'tokens.js',
        format: 'javascript/es6',
      }],
    },
  },
});

await sdLight.buildAllPlatforms();
await sdDark.buildAllPlatforms();
await sdJs.buildAllPlatforms();

console.log('\n✓ All token builds complete');
