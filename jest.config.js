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
    "src/components/**/*.ts",
    "src/components/**/*.tsx",
    "!src/game/logic/**/*.test.ts",
    "!src/game/logic/__tests__/**",
    "!src/components/**/*.test.ts",
    "!src/components/**/__tests__/**",
    "!src/components/**/index.tsx",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
};
