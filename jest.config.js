module.exports = {
  collectCoverage: true,
  preset: 'ts-jest/presets/js-with-ts',
  collectCoverageFrom: ['src/**', '!test/**'],
  roots: ['src', 'test'],
  moduleDirectories: ['node_modules', 'src'],
};
