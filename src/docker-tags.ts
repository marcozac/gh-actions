import * as core from '@actions/core';

try {
    core.setOutput(
        'tags',
        dockerTags({
            image: core.getInput('image'),
            order: JSON.parse(core.getInput('order')),
            combine: JSON.parse(core.getInput('combine')),
            outputType: core.getInput('outputType') as 'command' | 'list',
            latest: core.getBooleanInput('latest'),
            main: core.getBooleanInput('main'),
        }),
    );
} catch (error) {
    core.setFailed(error.message);
}

export function dockerTags(input: Input) {
    let tags: string[] = [];

    input.order.forEach((key, i) => {
        tags = i === 0 ? input.combine[key] : tags.flatMap((tag) => input.combine[key].map((v) => `${tag}-${v}`));
    });

    if (input.main) tags = tags.concat(input.combine[input.order[0]]);
    if (input.latest) tags = tags.concat('latest');

    switch (input.outputType) {
        case 'command':
            return tags.map((tag) => `-t ${input.image}:${tag}`).join(' ');

        case 'list':
            return tags.map((tag) => `${input.image}:${tag}`);

        default:
            throw new Error(`Output type '${input.outputType}' not allowed.`);
    }
}

export interface Input {
    /** The image to tag. */
    image: string;

    /** The `combine` keys order to use for tags generation. */
    order: string[];

    /**
     * The values to combine.
     *
     * @example
     * ```ts
     * // Generate the `repo/example:<php>-<ubuntu>` tag combinations
     * const input: Input = {
     *   image: 'repo/example',
     *   order: ['php', 'ubuntu'],
     *   combine: {
     *     php: ['8.1.5', '8.1', '8'],
     *     ubuntu: ['ubuntu20.04', 'ubuntu', 'focal'],
     *   },
     * }
     * ```
     */
    combine: {
        [name: string]: string[];
    };

    /**
     * The output type.
     *
     * @defaultValue command
     *
     * @remarks
     * Use `command` to generate a string like `-t <image>:<tag> -t ...` ready to use in `docker build` commands. Use `list` to generate an array-like output.
     */
    outputType?: 'command' | 'list';

    /**
     * Include the `latest` tag.
     *
     * @defaultValue false
     */
    latest: boolean;

    /**
     * Add the first combination as main tags sequence.
     *
     * @example
     * ```ts
     * const input: Input = {
     *   image: 'repo/example',
     *   // add `repo/example:8.1.5`, `repo/example:8.1`, `repo/example:8` to the tags list
     *   main: true,
     *   order: ['php', 'ubuntu'],
     *   combine: {
     *     php: ['8.1.5', '8.1', '8'],
     *     ubuntu: ['ubuntu20.04', 'ubuntu', 'focal'],
     *   },
     * }
     * ```
     */
    main: boolean;
}
