module.exports = {
  collectCoverageFrom: [
    'base/**/*.{js,jsx,ts,tsx}',
    '!base/**/*.d.ts',
    'channel/**/*.{js,jsx,ts,tsx}',
    '!channel/**/*.d.ts',
  ],
  testMatch: [
    '<rootDir>/base/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/base/**/*.{spec,test}.{js,jsx,ts,tsx}',
    '<rootDir>/channel/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/channel/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  modulePaths: [],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  setupFilesAfterEnv: ['./base/jest.setup.tsx'],
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/base/$1',
  },
}
