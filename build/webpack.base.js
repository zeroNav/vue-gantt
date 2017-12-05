/**
 * 公共配置
 */
const path = require('path')
const webpack = require('webpack')
const { pub } = require('./config')
const end = 'production' === process.env.NODE_ENV
const _url = path.join(__dirname, '../src')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
	entry: {
		app: './src/main'
	},
	output: {
		publicPath: pub.assetsPublicPath,
	},
	/* plugins: [
		new BundleAnalyzerPlugin({
			analyzerMode: 'server',
			analyzerHost: '127.0.0.1',
			analyzerPort: end ? 9527 : 9528,
			reportFilename: 'report.html',
			defaultSizes: 'parsed',
			openAnalyzer: true,
			logLevel: 'info'
		})
	], */
	module: {
		rules: [{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
				// include: _url
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					extractCSS: end,
					cssModules: end ? {
						camelCase: true,
						localIdentName: '[hash:base64:8]'
					} : {
						localIdentName: '[name]--[local]'
					}
				}
			},
			{
				test: /\.(c|sc)ss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'vue-style-loader',
					use: [
						'css-loader',
						'autoprefixer-loader',
						'sass-loader'
					]
				})
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: end ? 1e3 : 1,
					name: `img/${['[name]', '[hash:10]'][+end]}.[ext]`
				}
			},
			{
				test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
				loader: 'file-loader',
				options: {
					name: `fonts/[name].[ext]`
				}
			}
		]
	},
	resolve: {
		modules: [
			path.join(_url, 'utils'),
			'node_modules'
		],
		extensions: ['.js', '.vue', '.json', '.css', '.scss'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'$site': path.join(__dirname, '../config/site.js'),
			'@': path.join(_url, 'components'),
			'~': path.join(_url, 'pages'),
			'assets': path.join(_url, 'assets'),
			'style': path.join(_url, 'style'),
			'api': path.join(_url, 'api'),
			// 'mock': path.join(_url, 'mock')
		}
	}
}