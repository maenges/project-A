import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: react,
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React 관련 규칙
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',

      // TypeScript 관련 규칙
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': 'off', // TypeScript에서는 @typescript-eslint/no-unused-vars 사용
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',

      // React Refresh
      'react-refresh/only-export-components': 'off',

      // 기타 규칙
      'no-console': 'off',
      'no-debugger': 'warn',
      'no-extra-boolean-cast': 'off',
      'no-unsafe-optional-chaining': 'off',
      'padding-line-between-statements': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**', '*.config.*'],
  },
];
