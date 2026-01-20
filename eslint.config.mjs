import antfu from '@antfu/eslint-config';

export default antfu(
  {
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: true,
    },
    typescript: true,
  },
  {
    ignores: ['**/*.md'],
  },
  {
    rules: {
      semi: ['error', 'always'],
      'no-console': 'off',
      'unused-imports/no-unused-vars': 'error',
      'unused-imports/no-unused-imports': 'error',
      'ts/consistent-type-imports': 'off',
      'node/prefer-global/process': 'off',
      'node/prefer-global/buffer': 'off',
      'regexp/no-super-linear-backtracking': 'off',
      'regexp/no-contradiction-with-assertion': 'off',
      'ts/no-unused-expressions': 'error',
      'style/brace-style': 'off',
      'style/quote-props': 'off',
      'style/eol-last': 'off',
      'antfu/if-newline': 'off',
    },
  },
);
