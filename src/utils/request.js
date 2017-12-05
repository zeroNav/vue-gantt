 /* 
 * @Author: nooldey 
 * @Author-Email: <nooldey@gmail.com> 
 * @Date: 2017-11-23 15:35:42 
 * @Last Modified by: nooldey
 * @Last Modified time: 2017-11-23 16:50:06
 * @Description: API请求封装
 * @Arguments: 
 *  - cancel 中断axios请求
 *  - axios_config 配置axios详细内容
 */

import axios from "axios"
import qs from "qs"
import { uri } from "$config"

/* 发送请求前校验 */
const beforeSend = o => {
    // console.log('request body -->',o)
    /* NOTE: 根据具体规则进行请求校验 */
    if (o.url) {
        o.headers.common = {
            ...o.headers.common,
            Authorization: 'Nooldey-Site'
        }
    } else {
        cancel && cancel('request paused')
    }
}

/* 请求成功时 */
const onsuccess = (resolve, reject) => o => {
    // console.log('请求成功，响应：',JSON.parse(o.request.response))
    if (o.status != 200) {
        return reject(o.error)
    }
    const { code, data, msg, subMsg } = o.data || {};
    if (code == 1000) {
        resolve(data)
    } else {
        // console.warning('返回错误 ->', msg, subMsg)
        reject(code)
    }
}
/* 请求失败时 */
const onfail = reject => err => {
    let tip = 'request fail'
    const e = err.toString()
    if (e.includes('timeout of')) {
        tip = 'request timeout'
    } else if (e.includes('request paused')) {
        tip = 'request paused'
    }
    console.error(tip, e)
    reject(tip)
}

/* 配置请求 */
let cancel;
const axios_config = {
    baseURL: uri,
    timeout: 6e4, //超时60000ms一分钟
    transformRequest(arg) {
        /* Array.isArray(arg) && arg.length这一句仅仅是用于区分post和postform请求的标志，与实际参数无关 */
        if (Array.isArray(arg) && arg.length) {
            /* postform表单提交，对应传入参数应以数组包起来，如传入的实际参数对象为args，在post中传入到axios应为[args] */
            const form = new FormData()
            Object.entries(arg[0]).forEach(r => {
                /* 将数组格式的值拆分来进行form提交 */
                if (Array.isArray(r[1])) {
                    r[1].forEach(x => form.append(r[0], x))
                } else {
                    form.append(...r)
                }
            })
            return form
        }
        return qs.stringify(arg)
    },
    validateStatus(status) {
        return status >= 200 && status < 500;
    },
    cancelToken: new axios.CancelToken(c => cancel = c)
}

const service = axios.create(axios_config)

/* 发送请求拦截器 */
service.interceptors.request.use(beforeSend)

/* 获取响应拦截器 */
// service.interceptors.response.use()

/* 用Promise封装请求 */
const pipe = p => new Promise((rs,rj) => p.then(onsuccess(rs,rj)).catch(onfail(rj)))

const $fetch = {
    get: (url, o) => pipe(service.get(url,{ o })),
    post: (url, o) => pipe(service.post(url, o)),
    form: (url, o) => pipe(service.post(url, [ o ]))
}

export default $fetch