const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/tests/**/*.test.ts?(x)',
    '**/src/**/*.test.ts?(x)'
  ],
  collectCoverageFrom: [
    'src/lib/api/**/*.{js,jsx,ts,tsx}',
    '!src/lib/api/**/*.d.ts',
    '!src/lib/api/**/*.test.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(jose|@panva|oidc-token-hash|next-auth|@babel/runtime/helpers/esm|@swc/helpers))',
  ],
}

module.exports = createJestConfig(customJestConfig) 