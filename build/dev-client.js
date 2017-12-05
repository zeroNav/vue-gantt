 /* 
 * @Author: nooldey 
 * @Date: 2017-11-20 09:40:04 
 * @Last Modified by: nooldey
 * @Last Modified time: 2017-11-20 09:41:15
 * @Funtion: webpack 客户端热重载设置
 * @Description: webpack热加载中间件配置，热加载客户端订阅了reload事件，当webpack编译完修改后的代码，会发起一个reload事件，从而执行网页的快速重加载
 */

const hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')

hotClient.subscribe(e => {
	if ('reload' === e.action){
		window.location.reload()
	}
})
