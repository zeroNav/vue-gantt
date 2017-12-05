 /* 
 * @Author: nooldey 
 * @Date: 2017-11-20 09:36:49 
 * @Last Modified by:   nooldey 
 * @Last Modified time: 2017-11-20 09:36:49 
 * @Description: webpack dev server 配置
 */

const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
// const proxy = require('http-proxy-middleware')
const { dev, pub } = require('./config')

const webpackConfig = require('./webpack.dev')

const port = process.env.PORT || dev.port

const app = express()

// const { proxyTable } = dev

const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
	publicPath: webpackConfig.output.publicPath,
	noInfo: true,
	stats: {
		colors: true,
		chunks: false
	}
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
	heartbeat: 5e3
})

compiler.plugin('compilation', compilation => {
	compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
		hotMiddleware.publish({
			action: 'reload'
		})
		cb()
	})
})

/* Object.keys(proxyTable).forEach(context => {
	let options = proxyTable[context]
	if ('string' === typeof options){
		options = {
			target: options
		}
	}
	app.use(proxy(context, options))
}) */

app.use(require('connect-history-api-fallback')())

app.use(devMiddleware)
app.use(hotMiddleware)

const staticPath = path.posix.join(pub.assetsPublicPath)

app.use(staticPath, express.static('./src/assets'))

const url = `http://localhost:${ port }`

let resolve

const ready = new Promise(r => resolve = r)

console.log('> Starting dev server...')

devMiddleware.waitUntilValid(_ => {
	console.log(`> Listening at ${ url }\n`)
	if (process.env.NODE_ENV !== 'production') {
		opn(url)
	}
	resolve()
})

const server = app.listen(port)

module.exports = {
	ready,
	close: server.close
}
