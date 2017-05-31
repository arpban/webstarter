var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: "./src/js/main.js",
	output: {
		path: __dirname + "/dist/js/",
		filename: "main.js"
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		]
	}
}