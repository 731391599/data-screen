import { setStorage, getStorage, request } from '@/utils'
const ChinaJson = require('@/assets/json/China.json')
const url = {
    list: '/wangyi/api/wuhan/app/data/list-total',
    province: '/aliyun/areas_v3/bound/geojson'
}
//
export function getList() {
    return request({
        url: url.list,
        method: 'get'
    })
}
export function getProvince(code) {
    return request({
        url: url.province,
        method: 'get',
        params: {
            code: '150000_full'
        }
    })
}
