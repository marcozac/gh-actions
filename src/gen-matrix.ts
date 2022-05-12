import * as core from '@actions/core';
import { objectToMatrix } from './helpers/object-to-matrix';

try {
    genMatrix(JSON.parse(core.getInput('object'))).forEach(([key, matrix]) => {
        core.setOutput(key as string, matrix);
    });
} catch (error) {
    core.setFailed(error.message);
}

function genMatrix(input: Input) {
    return Object.entries(input).map(([key, sources]) => [
        key,
        sources.flatMap((entry) => {
            const { name, ...obj } = entry;
            return objectToMatrix(obj as Record<string, unknown[]>).map((item) => ({ name, ...item }));
        }),
    ]);
}

type Input = Record<
    string,
    {
        name: string;
        [key: string]: string | unknown[];
    }[]
>;
