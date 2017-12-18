 /* 
 * @Author: nooldey 
 * @Author-Email: <nooldey@gmail.com> 
 * @Date: 2017-11-23 15:07:36 
 * @Last Modified by: nooldey
 * @Last Modified time: 2017-11-23 17:58:24
 * @Description: 单页面站点入口文件
 */

/* 修复低版本浏览器对BABEL语法的兼容 */
import 'babel-polyfill'
import Vue from 'vue'
import router from './router'
import App from './views/app'
import initial from './utils/initial'

Vue.use(initial, { router })

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
