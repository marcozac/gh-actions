/**
 * Creates a matrix from a `key/array` object.
 *
 * @param obj - The object to convert.
 * @returns An array of objects with all the `key/array-item` possible combinations.
 *
 * @example
 * ```ts
 * const example = {
 *   foo: ['bar', 'baz'],
 *   some: [1, 'hello', 'world']
 * };
 *
 * objectToMatrix(example);
 * // [{foo: 'bar', some: 1}, {foo: 'baz', some: 1}, {foo: 'bar', some: 'hello'}, {foo: 'baz', some: 'hello'}, ...]
 * ```
 */
export const objectToMatrix = (obj: Record<string, unknown[]>) => {
    let outArr: any[] = [];
    const entriesArr = Object.entries(obj).map(([key, values]) => values.map((v) => [key, v]));

    entriesArr.forEach((entry) => {
        outArr =
            outArr.length === 0
                ? entry.map((item) => [item])
                : (outArr = outArr.flatMap((outVal) => entry.map((entryVal) => [...outVal, entryVal])));
    });

    return outArr.map((entries) => Object.fromEntries(entries));
};
