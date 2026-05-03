module.exports = {
  displayName: 'yarzawin-api-e2e',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/**/*.e2e.ts'],
  coverageDirectory: '../../coverage/apps/yarzawin-api-e2e',
  testTimeout: 30000,
}
