const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.(test|spec).(ts|tsx|js)"],
  // jose och andra ESM-paket måste transformeras av Next.js babel-pipeline
  transformIgnorePatterns: [
    "/node_modules/(?!(jose|@panva|oidc-token-hash|openid-client)/)",
  ],
};

module.exports = createJestConfig(customJestConfig);
