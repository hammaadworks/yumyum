module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: [
          'next/babel',
          ['@babel/preset-react', { runtime: 'automatic' }],
        ],
      },
    ],
  },
  testMatch: ['**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)'],
  verbose: true,
  // 👇 crucial for source maps in TS
  collectCoverage: false,
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
