module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/migrations/**',
    '!src/app.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup-real-db.js'],
  testTimeout: 10000
};