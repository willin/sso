/** @type { import("eslint").Linter.FlatConfig } */
module.exports = {
  root: true,
  extends: [
    '@hono/eslint-config',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single', { avoidEscape: true }],
    '@typescript-eslint/no-explicit-any': 'warn',
    // 'no-undef': ['error', { typeof: false }],
    'node/no-unsupported-features/node-builtins': [
      'error',
      {
        version: '>=16.0.0',
        ignores: []
      }
    ],
    'node/no-unsupported-features/es-builtins': [
      'error',
      {
        version: '>=16.0.0',
        ignores: []
      }
    ]
  },
  parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname
  }
};
