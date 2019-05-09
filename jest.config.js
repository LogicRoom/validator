const path = require('path')

module.exports = {
  displayName: 'test',
  transform: {
    '^.+\\.ts$': 'babel-jest'
  },
  testMatch: ['**/*test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '^src/(.*)': '<rootDir>/src/$1'
  }
}
