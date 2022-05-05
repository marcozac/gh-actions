// @ts-check

/** @type {import('@marcozac/eslint-config/eslint-config').Config} */
const config = {
    root: true,
    extends: ['@marcozac/eslint-config'],
    rules: {
        'no-console': 'off',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    },

    overrides: [
        {
            files: ['rollup.config.js'],
            parserOptions: {
                sourceType: 'module',
            },
            rules: {
                'import/no-extraneous-dependencies': 'off',
                'node/no-unpublished-import': 'off',
            },
        },
    ],
};
module.exports = config;
