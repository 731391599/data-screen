import Vue from 'vue'
import Vuex from 'vuex'
import setting from './modules/setting'
import data from './modules/data'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        setting,
        data
    }
})
