import { readFileSync } from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

const external = [
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.dependencies || {}),
  'react/jsx-runtime',
];

const isExternal = (id) => external.some((dep) => id === dep || id.startsWith(dep + '/'));

const postcssPlugin = postcss({
  modules: true,
  extract: 'navanta.css',
  minimize: true,
});

export default [
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/esm',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    external: isExternal,
    plugins: [
      postcssPlugin,
      resolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist/esm',
        outDir: 'dist/esm',
      }),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env', '@babel/preset-react'],
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        exclude: 'node_modules/**',
      }),
      commonjs(),
    ],
  },
  // CJS build
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named',
    },
    external: isExternal,
    plugins: [
      postcss({
        modules: true,
        inject: false,
      }),
      resolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: undefined,
        outDir: 'dist/cjs',
        compilerOptions: {
          declaration: false,
          declarationDir: undefined,
        },
      }),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env', '@babel/preset-react'],
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        exclude: 'node_modules/**',
      }),
      commonjs(),
    ],
  },
];
