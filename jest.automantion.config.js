module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathPattern: '*.spec.js',
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    }
  };