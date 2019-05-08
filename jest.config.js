const path = require('path')

module.exports = {
  displayName: 'test',
  transform: {
    '^.+\\.tsx?$': 'babel-jest'
  },
  testMatch: ['**/*test.+(ts|tsx)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(css|jpg|png)$': '<rootDir>/empty-module.js',
    '^src/(.*)': '<rootDir>/src/$1'
  }
}
