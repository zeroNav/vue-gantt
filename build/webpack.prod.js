/**
 * webpack 生产版本配置
 */
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const { pub, end } = require('./config')
const base = require('./webpack.base')

module.exports = merge(base, {
	output: {
		path: end.assetsRoot,
		filename: 'js/[name].[chunkhash:10].js',
		chunkFilename: 'js/[id].[chunkhash:10].js'
	},
	plugins: [
		new webpack.EnvironmentPlugin({
            NODE_ENV: end.env
        }),
		new ExtractTextPlugin({
			filename: 'css/[name].[contenthash:10].css'
		}),
		new OptimizeCSSPlugin({
			cssProcessorOptions: { safe: true }
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks(module, count){
				return (
					module.resource &&
					/\.js$/.test(module.resource) &&
					0 === module.resource.indexOf(path.join(__dirname, '../node_modules'))
				)
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			chunks: [ 'vendor' ]
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				drop_console: true
            },
            output: {
                comments: false
            }
		}),
		new HtmlPlugin({
			title: pub.title,
			filename: pub.html,
			template: pub.template,
			inject: pub.inject,
			favicon: end.favicon,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
			},
			chunksSortMode: 'dependency'
		}),
		new CopyPlugin([
			{
				from: path.join(__dirname, '../src/assets/favicon'),
				to: end.assetsRoot
			}
		])
	]
})
