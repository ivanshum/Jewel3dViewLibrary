import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json' with { type: 'json' };

const input = ['src/index.js'];
const devMode = process.env.NODE_ENV === 'development';

export default [
  {
    // UMD
    input,
    plugins: [
      nodeResolve(),
      babel({
        exclude: '.yarn/**',
        babelHelpers: 'bundled',
        presets: ['@babel/preset-react'],
      }),
      commonjs(),
      terser(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
    output: {
      file: `dist/umd/${pkg.name}.min.js`,
      format: 'umd',
      name: 'j3vl', // this is the name of the global object
      esModule: false,
      exports: 'named',
      sourcemap: true,
    },
  },
  // ESM and CJS
  {
    input,
    plugins: [
      nodeResolve(),
      babel({
        exclude: '.yarn/**',
        babelHelpers: 'bundled',
        presets: ['@babel/preset-react'],
      }),
      commonjs(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
    output: [
      {
        dir: 'dist/esm',
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
      {
        dir: 'dist/cjs',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
    ],
  },
];
