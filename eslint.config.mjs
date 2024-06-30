// eslint.config.mjs
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import { includeIgnoreFile } from '@eslint/compat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');
// Begin fix
react.configs['jsx-runtime'].plugins = { react };
react.configs['jsx-runtime'].languageOptions = {
  parserOptions: react.configs['jsx-runtime'].parserOptions,
};
delete react.configs['jsx-runtime'].parserOptions;
// End fix
export default [
  includeIgnoreFile(gitignorePath),
  react.configs['jsx-runtime'],
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    ignores: ['.yarn/', 'rollup.config.js'],
  },
];
