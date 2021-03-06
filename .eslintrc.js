module.exports = {
  extends: ['@scatterlab/eslint-config'],
  parserOptions: {
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'warn',
  },
};
