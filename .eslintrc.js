module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  parser: 'babel-eslint',
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2017,
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        semi: false,
      },
    ],
    eqeqeq: ['error', 'always']
  },
}