module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js"],
  coverageDirectory: "./coverage",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
