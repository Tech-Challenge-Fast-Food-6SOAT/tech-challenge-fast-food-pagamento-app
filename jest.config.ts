import type { Config } from '@jest/types';

export const produto: Config.InitialProjectOptions = {
  displayName: 'Pagamento',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.steps.ts'],
};

const config: Config.InitialOptions = {
  verbose: true,
  projects: [produto],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
};

export default config;
