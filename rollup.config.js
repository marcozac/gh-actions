// @ts-check

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

/** @type {import('rollup').RollupOptions[]} */
const config = [
    {
        input: 'src/read-ci.ts',
        output: {
            file: 'dist/read-ci.js',
            format: 'es',
        },
        plugins: [commonjs(), resolve(), typescript()],
    },
    {
        input: 'src/docker-tags.ts',
        output: {
            file: 'dist/docker-tags.js',
            format: 'es',
        },
        plugins: [commonjs(), resolve(), typescript()],
    },
    {
        input: 'src/gen-matrix.ts',
        output: {
            file: 'dist/gen-matrix.js',
            format: 'es',
        },
        plugins: [commonjs(), resolve(), typescript()],
    },

    // TESTS
    {
        input: 'src/__tests__/__read-ci__.ts',
        output: {
            file: '__tests__/read-ci/__read-ci__.js',
            format: 'es',
        },
        plugins: [commonjs(), resolve(), typescript()],
    },
];

export default config;
