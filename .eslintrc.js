module.exports = {
    env: {
        node: true,
        es2021: true,
        jest: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:eslint-comments/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: ['eslint-plugin-prefer-arrow', '@typescript-eslint'],
    rules: {
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single', { avoidEscape: true }],
        semi: ['error', 'never'],
        '@typescript-eslint/ban-types': 'off',
        'spaced-comment': 'error',
        '@typescript-eslint/no-throw-literal': 'error',
        'eslint-comments/no-unused-disable': 'error',
        'eslint-comments/require-description': 'error',
        eqeqeq: 'error',
        'prefer-arrow/prefer-arrow-functions': [
            'error',
            {
                classPropertiesAllowed: true,
            },
        ],
        '@typescript-eslint/no-invalid-this': 'error',
        'require-await': 'error',
        '@typescript-eslint/no-floating-promises': ['error', { ignoreIIFE: true }],
        'no-return-await': 'error',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
}
