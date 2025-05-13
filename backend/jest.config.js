// backend/jest.config.js
module.exports = {
    testEnvironment: 'node',
    verbose: true,
    modulePathIgnorePatterns: [
      '<rootDir>/node_modules/',
      '<rootDir>/config/'      // ← ignore tout le dossier config
    ]
  };