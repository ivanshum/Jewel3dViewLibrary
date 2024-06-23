// eslint.config.mjs

import { defineConfig } from 'eslint';

export default defineConfig({
  extends: [
    // Base ESLint rules (consider using a shareable config like `eslint:recommended`)
    'eslint:recommended',

    // Prettier integration (should be last)
    'prettier',
  ],
  plugins: ['prettier'],
  // Disables any ESLint rules that conflict with Prettier formatting
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }], // Adjust Prettier options as needed
  },
});