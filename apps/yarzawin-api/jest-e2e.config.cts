module.exports = {
  displayName: 'yarzawin-api-e2e',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.e2e.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testMatch: ['<rootDir>/**/*.e2e.ts'],
  coverageDirectory: '../../coverage/apps/yarzawin-api-e2e',
  testTimeout: 30000,
}
