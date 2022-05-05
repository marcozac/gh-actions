import { readFileSync } from 'fs';
import { basename } from 'path';
import { parse as jsonParse } from 'jju';
import { load as yamlParse } from 'js-yaml';
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

    switch (input.type) {
        case 'json':
            content = jsonParse(content) as Record<string, unknown>;
            setObjOutput(content, input.exclude, input.log);
            break;

        case 'yaml':
            content = yamlParse(content) as Record<string, unknown>;
            setObjOutput(content, input.exclude, input.log);
            break;

        case 'text':
            core.setOutput(basename(input.ciFile).replace('.', '_'), content);
            break;

        default:
            core.error(`Type ${input.type} not allowed.`);
    }
}

function setObjOutput(content: Record<string, unknown>, exclude: string[], log: string[]) {
    Object.keys(content).forEach((key) => {
        if (!exclude.includes(key)) core.setOutput(key, content[key]);
        if (log.includes(key)) core.info(`${key}: ${JSON.stringify(content[key])}`);
    });
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
     * `yaml`: the same as `json`
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
    type: 'json' | 'yaml' | 'text';

    /**
     * Excludes output generation for some properties.
     *
     * @defaultValue []
     *
     * @remarks
     * For files with type `json` or `yaml`, prevents to set an output for the listed properties.
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
     * For files with type `json` or `yaml`, prints the value of the listed properties.
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
