import { readFileSync } from 'fs';
import { basename } from 'path';
import * as core from '@actions/core';

try {
    readCi({
        ciFile: core.getInput('ciFile', { required: true }),
        type: core.getInput('type') as Input['type'],
        exclude: core.getMultilineInput('exclude'),
        log: core.getMultilineInput('log'),
    });
} catch (error) {
    core.setFailed(error.message);
}

function readCi(input: Input) {
    // The configuration file content
    let content: string | Record<string, unknown>;

    content = readFileSync(input.ciFile, 'utf8') as string;

    if (input.type === 'json') {
        content = JSON.parse(content) as Record<string, unknown>;

        Object.keys(content).forEach((key) => {
            if (!input.exclude.includes(key)) core.setOutput(key, (content as Record<string, unknown>)[key]);

            if (input.log.includes(key))
                core.info(`${key}: ${JSON.stringify((content as Record<string, unknown>)[key])}`);
        });
    } else if (input.type === 'text') {
        core.setOutput(basename(input.ciFile).replace('.', '_'), content);
    } else {
        core.error(`Type ${input.type} not allowed.`);
    }
}

interface Input {
    /** The file to read. */
    ciFile: string;

    /**
     * The file type.
     *
     * @defaultValue json
     *
     * @remarks
     * Defines how the file content should be interpreted.
     *
     * `json`: each key-value is set as an output.
     * `text`: reads the file content and set its content as value of an output named as `ciFile`. Note that all dots will be replaced with an underscore.
     *
     * @example
     * ```json
     * // my/config.json
     * {
     *   "os": ["20.04", "18.04"],
     *   "node": ["16", "14"]
     * }
     * ```
     *
     * The example file above treated as `json` produces an output `os: ["20.04", "18.04"]` and `node: ["16", "14"]`.
     *
     * As `text` the output will be: `config_json: "{"os": ["20.04", "18.04"],"node": ["16", "14"]}"`
     */
    type: 'json' | 'text';

    /**
     * Excludes output generation for some properties.
     *
     * @defaultValue []
     *
     * @remarks
     * For files with type `json`, prevents to set an output for the listed properties.
     * Their value may be printed - e.g. for debug purposes - listing them in `log`.
     *
     * @example
     * ```ts
     * // Disables output for `key0` and `key1`
     * const options: Options = {
     *   ciFile: 'my/file',
     *   exclude: ['key0', 'key1'],
     * };
     * ```
     */
    exclude: string[];

    /**
     * Enables logging for some properties value.
     *
     * @defaultValue []
     *
     * @remarks
     * For files with type `json`, prints the value of the listed properties.
     *
     * @example
     * ```ts
     * // Disables output for `key0` and `key1`
     * const options: Options = {
     *   ciFile: 'my/file',
     *   exclude: ['key0', 'key1'],
     * };
     * ```
     */
    log: string[];
}
