export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
  collectCoverageFrom: [
    "src/game/logic/**/*.ts",
    "!src/game/logic/**/*.test.ts",
    "!src/game/logic/__tests__/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
};
