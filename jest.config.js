/** @type {import('@jest/types').InitialOptions} */
const config = {
    verbose: true,
    clearMocks: true,
    moduleFileExtensions: ['js', 'ts'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
export default config;
