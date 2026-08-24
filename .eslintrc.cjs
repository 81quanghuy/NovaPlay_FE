module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react-hooks', 'jsx-a11y', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    'react-hooks/exhaustive-deps': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'import/no-unresolved': 'off',
    'import/no-named-as-default-member': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
        message: 'Không hardcode hex màu trong src; dùng design token.',
      },
      {
        selector: "JSXAttribute[name.name='style']",
        message: 'Không dùng inline style tĩnh; dùng Tailwind/token. Chỉ ngoại lệ cho giá trị động thật sự.',
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/features/*/components/*'],
            message: 'Component dùng chung phải nằm ở components/ui hoặc components/layout.',
          },
        ],
      },
    ],
  },
};
