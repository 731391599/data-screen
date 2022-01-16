import { SET_DATA, SET_AREA_TREE, SET_CHINA_DAY_LIST, SET_CHINA_TOTAL, SET_UPDATE_TIME } from './constant'
import { getList } from '@/api'

const actions = {
    [SET_DATA]({ commit }) {
        return new Promise((resolve, reject) => {
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
        })
    }
}

export default actions
