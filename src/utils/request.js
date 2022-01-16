import axios from 'axios'
import { Message } from 'element-ui'
// 创建 axios 实例
const baseURL = '/api'
const request = axios.create({
    baseURL,
    timeout: 6000 // 请求超时时间
})
const errorHandler = error => {
    if (error.response) {
        const data = error.response.data
        Message.error({
            message: 'Forbidden',
            description: data.message
        })
    }
    return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
    return config
}, errorHandler)

// response interceptor
request.interceptors.response.use(response => {
    const res = response.data
    if (res.code !== 10000) {
        Message.error({
            message: res.message
        })
        return Promise.reject(res.message || 'error')
    } else {
        return res
    }
}, errorHandler)

export default request

export { request }
