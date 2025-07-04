import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import fs from 'fs';

const packageJSONRaw = fs.readFileSync('package.json', 'utf8')
const { author, license, homepage, name, version } = JSON.parse(packageJSONRaw);
const banner = `/*\n * ${name} v${version}\n * ${homepage}\n * (c) ${(new Date()).getFullYear()} ${author.name} | ${license} License\n */`;

const baseConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'es',
		banner,
    }
  ],
  plugins: [
    typescript(),
  ],
};

const iifeConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.iife.js',
      format: 'iife',
      name: 'HattrickApiClient',
      banner
    },
    {
      file: 'dist/bundle.iife.min.js',
      format: 'iife',
      banner,
      name: 'HattrickApiClient',
      plugins: [terser({ format: { preamble: banner } })],
    },
  ],
  plugins: [
    typescript(),
    nodeResolve(),
    commonjs(),
    nodePolyfills(),
  ],
};

export default [baseConfig, iifeConfig];