import { SET_AREA_TREE, SET_CHINA_DAY_LIST, SET_CHINA_TOTAL, SET_UPDATE_TIME } from './constant'
const ChinaJson = require('@/assets/json/China.json')
const mutations = {
    [SET_AREA_TREE](state, data) {
        let China = null
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === '0') {
                China = data[i]
                break
            }
        }
        // 中国省份处理数据
        const ChinaChildren = China.children
        const ChinaJsonCHildren = ChinaJson.features
        for (let i = 0; i < ChinaChildren.length; i++) {
            const leftAdcode = ChinaChildren[i].id
            for (let j = 0; j < ChinaJsonCHildren.length; j++) {
                const rightAdcode = ChinaJsonCHildren[j].properties.adcode
                if (rightAdcode === leftAdcode) {
                    ChinaJsonCHildren[j].properties.data = ChinaChildren[i]
                }
            }
        }
        state.areaTree = ChinaJsonCHildren
    },
    [SET_CHINA_DAY_LIST](state, data) {
        state.chinaDayList = data
    },
    [SET_CHINA_TOTAL](state, data) {
        state.chinaTotal = data
    },
    [SET_UPDATE_TIME](state, data) {
        state.updateTime = data
    }
}

export default mutations
