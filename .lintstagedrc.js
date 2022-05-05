// @ts-check

import { ESLint } from 'eslint';

const removeIgnoredFiles = async (/** @type {string[]} */ files) => {
    const eslint = new ESLint();
    const isIgnored = await Promise.all(
        files.map((file) => {
            return eslint.isPathIgnored(file);
        }),
    );
    const filteredFiles = files.filter((_, i) => !isIgnored[i]);
    return filteredFiles.join(' ');
};

export default {
    '*': 'prettier --ignore-unknown --write',

    '*.{ts,js,json}': async (files) => {
        const filesToLint = await removeIgnoredFiles(files);
        return [`eslint --max-warnings=0 ${filesToLint}`];
    },

    '*.{ts}': () => ['tsc -p tsconfig.json --noEmit'],
};
