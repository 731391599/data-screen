import { SET_AREA_TREE, SET_CHINA_DAY_LIST, SET_CHINA_TOTAL, SET_UPDATE_TIME, SET_PROVINCE, SET_CITY } from './constant'
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
                if (rightAdcode == leftAdcode) {
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
    },
    [SET_PROVINCE](state, data) {
        let { provinceId, provinceArea } = data
        let provinceJson = state.areaTree.find(item => item.properties.adcode == provinceId)
        if (provinceJson?.properties?.data?.children?.length) {
            provinceJson = provinceJson.properties.data.children
            provinceArea = provinceArea.features
            for (let i = 0; i < provinceJson.length; i++) {
                const leftAdcode = provinceJson[i].id
                for (let j = 0; j < provinceArea.length; j++) {
                    const rightAdcode = provinceArea[j].properties.adcode
                    if (rightAdcode == leftAdcode) {
                        provinceArea[j].properties.data = provinceJson[i]
                    }
                }
            }
            state.provinceAreaTree[provinceId] = provinceArea
        }
    },
    [SET_CITY](state, data) {
        let { cityId, cityArea } = data
        console.log(cityArea)
        console.log(cityId)
        state.cityAreaTree[cityId] = cityArea
    }
}

export default mutations
