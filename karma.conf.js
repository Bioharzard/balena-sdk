const _ = require('lodash');
const getKarmaConfig = require('balena-config-karma');
const packageJSON = require('./package.json');

const BROWSER_BUNDLE = 'es2015/balena-browser.min.js';

module.exports = function (config) {
	require('dotenv').config();
	const envVars = [
		'TEST_API_URL',
		'TEST_EMAIL',
		'TEST_PASSWORD',
		'TEST_USERNAME',
		'TEST_MEMBER_EMAIL',
		'TEST_MEMBER_PASSWORD',
		'TEST_MEMBER_USERNAME',
		'TEST_REGISTER_EMAIL',
		'TEST_REGISTER_PASSWORD',
		'TEST_REGISTER_USERNAME',
	];

	const karmaConfig = getKarmaConfig(packageJSON);
	karmaConfig.webpack.resolve.fallback = {
		constants: false,
		crypto: require.resolve('crypto-browserify'),
		domain: require.resolve('domain-browser'),
		dns: false,
		fs: false,
		net: false,
		os: require.resolve('os-browserify'),
		path: false,
		stream: require.resolve('stream-browserify'),
		url: false,
		util: require.resolve('util'),
		zlib: require.resolve('browserify-zlib'),
	};
	karmaConfig.webpack.plugins = [
		new getKarmaConfig.webpack.ProvidePlugin({
			// Polyfills or mocks for various node stuff
			process: 'process/browser',
			Buffer: ['buffer', 'Buffer'],
		}),
		new getKarmaConfig.webpack.EnvironmentPlugin(envVars),
	];
	karmaConfig.webpack.module.rules.push({
		test: /\.m?js/,
		resolve: {
			fullySpecified: false,
		},
	});
	karmaConfig.webpack.experiments = {
		asyncWebAssembly: true,
	};
	// do not pre-process the browser build
	karmaConfig.preprocessors = _.omitBy(
		karmaConfig.preprocessors,
		(_value, key) => key.startsWith('es2015/') || key.startsWith('es2018/'),
	);
	karmaConfig.client = {
		mocha: {
			timeout: 5 * 60 * 1000,
			retries: 2,
			slow: 10 * 1000,
		},
	};
	karmaConfig.files = [
		BROWSER_BUNDLE,
		'tests/**/*.spec.js',
		'tests/**/*.spec.ts',
	];

	const { TEST_ONLY_ON_ENVIRONMENT } = process.env;
	if (TEST_ONLY_ON_ENVIRONMENT && TEST_ONLY_ON_ENVIRONMENT !== 'browser') {
		console.log(
			`TEST_ONLY_ON_ENVIRONMENT is set to ${TEST_ONLY_ON_ENVIRONMENT}`,
		);
		console.log('Skipping browser tests');
		karmaConfig.files = [];
		karmaConfig.failOnEmptyTestSuite = false;
	}

	return config.set(karmaConfig);
};
