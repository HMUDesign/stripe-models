module.exports = {
	collectCoverage: true,
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'/jest.setup.js',
	],
	coverageDirectory: '_coverage',
	coverageThreshold: {
		global: {
			branches: 90,
			functions: 90,
			lines: 90,
			statements: -10,
		},
	},
	setupFiles: [
		'./jest.setup.js',
	],
};
