module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb/base', 'airbnb-typescript/base'],
  ignorePatterns: ['**/*.js'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.json',
  },
  rules: {
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    // handled by prettier,
    '@typescript-eslint/indent': 'off',
    'object-curly-newline': 'off',
    'no-underscore-dangle': 'off',
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
  },
};
