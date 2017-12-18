 /* 
 * @Author: nooldey 
 * @Author-Email: <nooldey@gmail.com> 
 * @Date: 2017-11-23 15:11:29 
 * @Last Modified by: nooldey
 * @Last Modified time: 2017-12-18 16:49:55
 * @Description: 初始化脚本
 */

import ProgressBar from '@/progress-bar'
import filter from './filter'

export default {
    /* 注册插件 */
    install(Vue, { router }) {
        /* 加载进度条 */
        const $bar = new Vue(ProgressBar).$mount()
        document.body.appendChild($bar.$el)
        Object.assign(Vue.prototype, { $bar })

        /* 路由设置 */
        router.beforeEach((to, from, next) => {
            /* 开始进度条 */
            $bar.start()
            next()
        })
        router.afterEach(() => {
            /* 关闭进度条 */
            $bar.finish()
        })

        /* 添加过滤器 */
        Object.entries(filter).forEach(f => Vue.filter(...f))

        /* 添加自定义属性/方法 */
        Object.assign(Vue.prototype, { $me: "Nooldey" })
    }
}