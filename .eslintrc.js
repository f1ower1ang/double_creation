module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/prettier', '@vue/typescript'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': 'off',
    quotes: ['error', 'single'],
    indent: ['error', 2, { MemberExpression: 'off' }],
    'arrow-parens': 0,
    'no-loop-func': 2,
    'space-before-function-paren': ['error', 'never'],
    'no-unreachable': 0
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
}
