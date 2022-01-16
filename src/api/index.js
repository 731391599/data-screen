import { setStorage, getStorage, request } from '@/utils'
const ChinaJson = require('@/assets/json/China.json')
const url = {
    list: '/wuhan/app/data/list-total'
}

export function getList() {
    return request({
        url: url.list,
        method: 'get'
    })
}
