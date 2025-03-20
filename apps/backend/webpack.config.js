const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
	entry: ['./src/index.ts'],
	target: 'node',
	externals: {
		express: "require('express')"
	},
	output: {
		filename: 'index.js',
		path: path.join(__dirname, '../../dist'),
		devtoolModuleFilenameTemplate: '[absolute-resource-path]'
	},
	devtool: 'cheap-module-source-map',
	mode: 'development',
	resolve: {
		extensions: ['.ts', '.js'],
		modules: ['node_modules', path.resolve(__dirname)],
		fallback: {
			'mongodb-client-encryption': false,
			snappy: false,
			'gcp-metadata': false,
			'@aws-sdk/credential-providers': false,
			'@mongodb-js/zstd': false,
			kerberos: false,
			socks: false,
			aws4: false
		}
	},
	context: __dirname,
	module: {
		rules: [
			{
				test: /\.ts?$/,
				loader: 'ts-loader',
				options: {
					projectReferences: true,
					allowTsInNodeModules: true
				}
			}
		]
	},
	plugins: [new Dotenv()]
};
