import { SET_FULLSCREEN, SET_THEME } from './constant'
import { setStorage } from '@/utils'
import screenfull from 'screenfull'
const mutations = {
    [SET_FULLSCREEN](state) {
        if (!state.fullScreen) {
            screenfull.toggle()
        } else {
            screenfull.exit()
        }
        state.fullScreen = !state.fullScreen
    },
    [SET_THEME](state, theme) {
        state.theme = theme
        setStorage('THEME', theme)
        // 刷新页面
        // 问题 state中的值是写死的light
        location.reload()
    }
}

export default mutations
