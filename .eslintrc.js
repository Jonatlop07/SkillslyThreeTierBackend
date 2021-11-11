module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/indent': ['warn', 2],
    '@typescript-eslint/quotes': ['error', 'single'],
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/no-extra-parens': 'warn',
    '@typescript-eslint/no-extra-semi': 'error',
    '@typescript-eslint/comma-spacing': 'error',
    '@typescript-eslint/keyword-spacing': 'error',
    '@typescript-eslint/brace-style': ['error', '1tbs']
  },
};
