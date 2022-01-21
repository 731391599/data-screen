import { SET_DATA, SET_AREA_TREE, SET_CHINA_DAY_LIST, SET_CHINA_TOTAL, SET_UPDATE_TIME, SET_PROVINCE, SET_CITY } from './constant'
import { getList } from '@/api'

const actions = {
    [SET_DATA]({ commit, getters }) {
        return new Promise((resolve, reject) => {
            if (getters.areaTree.length) {
                resolve()
            } else {
                getList()
                    .then(res => {
                        if (res.data) {
                            const { areaTree, chinaDayList, chinaTotal, lastUpdateTime } = res.data
                            commit(SET_AREA_TREE, areaTree)
                            commit(SET_CHINA_DAY_LIST, chinaDayList)
                            commit(SET_CHINA_TOTAL, chinaTotal)
                            commit(SET_UPDATE_TIME, lastUpdateTime)
                            resolve(res)
                        } else {
                            reject(e)
                        }
                    })
                    .catch(e => {
                        reject(e)
                    })
            }
        })
    },
    [SET_PROVINCE]({ commit }, provinceId) {
        return new Promise((resolve, reject) => {
            const provinceArea = require(`@/assets/json/province/${provinceId}.json`)
            commit(SET_PROVINCE, {
                provinceId,
                provinceArea
            })
            resolve()
        })
    },
    [SET_CITY]({ commit }, cityId) {
        return new Promise((resolve, reject) => {
            const cityArea = require(`@/assets/json/citys/${cityId}.json`)
            commit(SET_CITY, {
                cityId,
                cityArea
            })
            resolve()
        })
    }
}

export default actions
