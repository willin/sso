module.exports = {
  root: true,
  extends: ['@svelte-dev/eslint-config', '@hono/eslint-config'],
  rules: {
    semi: ['error', 'always'],
    'no-undef': ['error'],
    'node/no-unsupported-features/node-builtins': [
      'error',
      {
        version: '>=16.0.0',
        ignores: []
      }
    ]
  }
};
