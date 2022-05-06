import { dockerTags } from '../docker-tags';

it('combine two lists + main', () => {
    expect(
        dockerTags({
            image: 'image-name/example',
            latest: false,
            main: true,
            order: ['php', 'ubuntu'],
            outputType: 'command',
            combine: {
                php: ['8.1.5', '8.1', '8'],
                ubuntu: ['ubuntu20.04', 'ubuntu', 'focal'],
            },
        }),
    ).toBe(
        '-t image-name/example:8.1.5-ubuntu20.04 -t image-name/example:8.1.5-ubuntu -t image-name/example:8.1.5-focal -t image-name/example:8.1-ubuntu20.04 -t image-name/example:8.1-ubuntu -t image-name/example:8.1-focal -t image-name/example:8-ubuntu20.04 -t image-name/example:8-ubuntu -t image-name/example:8-focal -t image-name/example:8.1.5 -t image-name/example:8.1 -t image-name/example:8',
    );
});

it('combine two lists + latest tags', () => {
    expect(
        dockerTags({
            image: 'image-name/example',
            latest: true,
            main: false,
            order: ['php', 'ubuntu'],
            outputType: 'list',
            combine: {
                php: ['8.1.5', '8.1', '8'],
                ubuntu: ['ubuntu20.04', 'ubuntu', 'focal'],
            },
        }),
    ).toStrictEqual([
        'image-name/example:8.1.5-ubuntu20.04',
        'image-name/example:8.1.5-ubuntu',
        'image-name/example:8.1.5-focal',
        'image-name/example:8.1-ubuntu20.04',
        'image-name/example:8.1-ubuntu',
        'image-name/example:8.1-focal',
        'image-name/example:8-ubuntu20.04',
        'image-name/example:8-ubuntu',
        'image-name/example:8-focal',
        'image-name/example:latest',
    ]);
});

it('error: undefined outputType', () => {
    expect(() =>
        dockerTags({
            image: 'image-name/example',
            latest: false,
            main: false,
            order: ['php', 'ubuntu'],
            combine: {
                php: ['8.1.5', '8.1', '8'],
                ubuntu: ['ubuntu20.04', 'ubuntu', 'focal'],
            },
        }),
    ).toThrow();
});
