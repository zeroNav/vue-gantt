 /* 
 * @Author: nooldey 
 * @Author-Email: <nooldey@gmail.com> 
 * @Date: 2017-11-23 17:20:27 
 * @Last Modified by: nooldey
 * @Last Modified time: 2017-11-29 11:15:07
 * @Description: 具体的路由定义
 */

const app = () => import('../views/app')
const layout = () => import('../views/layout')
const collayout = () => import('../views/admin_layout')
const pipe = x => () => import(/* webpackChunkName: [request] */ `~/${x}`)

export default [
    {
        path: '/',
        component: collayout,
        redirect: '/home/gantt',
        children: [
            {
                path: 'home',
                name: 'Home-Page',
                component: app,
                children: [
                    {
                        path: 'gantt',
                        name: '甘特图范例',
                        component: pipe('z_gantt/index')
                    },
                    {
                        path: '1',
                        name: 'page1',
                        component: app,
                        children: [
                            {
                                path: '1-2',
                                name: 'page1-2',
                                component: pipe('blank/index')
                            }
                        ]
                    }
                ]
            },
            {
                path: '404',
                name: 'Error-Page',
                component: pipe('404/index')
            },
        ]
    },
    // {
    //     path: '*',
    //     redirect: '/404'
    // }
]