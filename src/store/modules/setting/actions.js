import { SET_FULLSCREEN, SET_THEME } from './constant'
const actions = {
    [SET_FULLSCREEN]({ commit }) {
        commit(SET_FULLSCREEN)
    },
    [SET_THEME]({ getters, commit }) {
        let theme = ''
        switch (getters.theme) {
            case 'dark':
                theme = 'light'
                break
            case 'light':
                theme = 'dark'
                break
            default:
                break
        }
        commit(SET_THEME, theme)
    }
}

export default actions
