 /* 
 * @Author: nooldey 
 * @Author-Email: <nooldey@gmail.com> 
 * @Date: 2017-11-23 17:20:27 
 * @Last Modified by: nooldey
 * @Last Modified time: 2017-12-18 16:48:08
 * @Description: 具体的路由定义
 */

const view = () => import('../views/view')
const layout = () => import('../views/layout')
const pipe = x => () => import(/* webpackChunkName: [request] */ `~/${x}`)

export default [
    {
        path: '/',
        component: layout,
        redirect: '/gantt',
        children: [
            {
                path: 'gantt',
                name: '甘特图范例',
                component: pipe('z_gantt/index')
            },
            {
                path: '404',
                name: 'Error-Page',
                hidden: true,
                component: pipe('404/index')
            },
        ]
    },
    {
        path: '*',
        redirect: '/404'
    }
]