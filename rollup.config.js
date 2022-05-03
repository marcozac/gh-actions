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
];

export default config;
