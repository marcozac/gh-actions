import { readFileSync } from 'fs';
import { parse as jsonParse } from 'jju';
import { load as yamlParse } from 'js-yaml';
import * as core from '@actions/core';

const errors: string[] = [];
let error: string;

const fileContent: Input =
    core.getInput('type') === 'json'
        ? jsonParse(readFileSync('__tests__/read-ci/__read-ci__.json', 'utf8'))
        : yamlParse(readFileSync('__tests__/read-ci/__read-ci__.yaml', 'utf8'));

// Run test for each key
Object.keys(fileContent).forEach((key) => test(key as keyof Input));

if (errors.length > 0) {
    core.setFailed(`Action failed with errors: ${errors.join('\n, ')}`);
}

function test(input: keyof Input) {
    core.info(`Testing ${input} input from action step...`);

    const value: string[] = JSON.parse(core.getInput(input));

    value.forEach((v, i) => {
        if (v !== fileContent[input][i]) {
            error = `
                Test \`${input}\` input failed with value: ${v}.
                Expected value: ${fileContent[input][i]}.
            `;
            core.error(error);
            errors.push(error);
        }
    });
}

interface Input {
    os: string[];
    node: string[];
}
