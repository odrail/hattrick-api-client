import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';

const baseConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'es',
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
    },
    {
      file: 'dist/bundle.iife.min.js',
      format: 'iife',
      name: 'HattrickApiClient',
      plugins: [terser()],
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