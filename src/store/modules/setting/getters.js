import { getStorage } from '@/utils'
const getters = {
    fullScreen: state => {
        return state.fullScreen
    },
    theme: state => {
        return getStorage('THEME') ? getStorage('THEME') : state.theme
    }
}
export default getters
