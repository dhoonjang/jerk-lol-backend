module.exports = {
  preset: "ts-jest",
  testMatch: ["**/*.test.ts"],
  coverageThreshold: {
    global: {
      statements: 70,
    },
  },
};
