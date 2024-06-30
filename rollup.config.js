import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json' with { type: 'json' };
import nodeExternals from 'rollup-plugin-node-externals';

const input = ['src/index.js'];
const devMode = (process.env.NODE_ENV || 'development').toLowerCase();

const sharedPlugins = [
  nodeResolve(),
  babel({
    exclude: '.yarn/**',
    babelHelpers: 'bundled',
    presets: ['@babel/preset-react'],
  }),
  commonjs(),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify(devMode),
  }),
];

const outputs = [
  {
    file: `dist/umd/${pkg.name}.min.js`,
    format: 'umd',
    name: 'j3vlFull',
    esModule: false,
    exports: 'named',
    sourcemap: true,
  },
  {
    file: `dist/umd-ext/${pkg.name}.min.js`,
    format: 'umd',
    name: 'j3vlExt',
    esModule: false,
    exports: 'named',
    sourcemap: true,
  },
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
];

const config = [];
outputs.forEach((output) => {
  config.push({
    // UMD
    input,
    plugins: [
      ...sharedPlugins,
      output.name && terser(),
      output.name === 'j3vlExt' && nodeExternals(),
    ],
    output: output,
  });
});

export default config;
