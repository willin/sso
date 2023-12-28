/** @type { import("eslint").Linter.FlatConfig } */
module.exports = {
  root: true,
  extends: ['@svelte-dev/eslint-config'],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single', { avoidEscape: true }],
    '@typescript-eslint/no-explicit-any': 'warn'
    // 'no-undef': ['error', { typeof: false }],
  },
  parserOptions: {
    extraFileExtensions: ['.svelte'],
    tsconfigRootDir: __dirname
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  ]
};
