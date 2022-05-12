import * as convert from '../helpers/object-to-matrix';

describe('object to matrix', () => {
    it('generate matrix', () => {
        expect(
            convert.objectToMatrix({ foo: ['bar', 'baz'], greetings: ['hello', 'world'], someVal: [0, 'x', 4, 'yy'] }),
        ).toStrictEqual([
            {
                foo: 'bar',
                greetings: 'hello',
                someVal: 0,
            },
            {
                foo: 'bar',
                greetings: 'hello',
                someVal: 'x',
            },
            {
                foo: 'bar',
                greetings: 'hello',
                someVal: 4,
            },
            {
                foo: 'bar',
                greetings: 'hello',
                someVal: 'yy',
            },
            {
                foo: 'bar',
                greetings: 'world',
                someVal: 0,
            },
            {
                foo: 'bar',
                greetings: 'world',
                someVal: 'x',
            },
            {
                foo: 'bar',
                greetings: 'world',
                someVal: 4,
            },
            {
                foo: 'bar',
                greetings: 'world',
                someVal: 'yy',
            },
            {
                foo: 'baz',
                greetings: 'hello',
                someVal: 0,
            },
            {
                foo: 'baz',
                greetings: 'hello',
                someVal: 'x',
            },
            {
                foo: 'baz',
                greetings: 'hello',
                someVal: 4,
            },
            {
                foo: 'baz',
                greetings: 'hello',
                someVal: 'yy',
            },
            {
                foo: 'baz',
                greetings: 'world',
                someVal: 0,
            },
            {
                foo: 'baz',
                greetings: 'world',
                someVal: 'x',
            },
            {
                foo: 'baz',
                greetings: 'world',
                someVal: 4,
            },
            {
                foo: 'baz',
                greetings: 'world',
                someVal: 'yy',
            },
        ]);
    });
});
