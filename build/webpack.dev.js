/**
 * webpack 开发版本配置
 */
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const { pub, dev } = require('./config')
const base = require('./webpack.base')

module.exports = merge(base, {
	devtool: '#cheap-module-eval-source-map',
	entry: {
		app: [ './build/dev-client', base.entry.app ]
	},
	output: {
		filename: 'js/[name].js',
		chunkFilename: 'js/chunk.[name].js'
	},
	plugins: [
		new webpack.EnvironmentPlugin({
            NODE_ENV: dev.env
        }),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new ExtractTextPlugin('[name].css'),
    	new FriendlyErrorsPlugin(),
    	new HtmlPlugin({
			title: pub.title,
    		filename: pub.html,
    		template: pub.template,
    		inject: pub.inject
    	})
	],
	performance: {
        hints: false
	}
})
