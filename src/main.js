import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/plugins/elementUI'
import { setDomFontSize } from '@/plugins/setRem'
import axios from 'axios'

setDomFontSize()
Vue.prototype.$axios = axios
Vue.config.productionTip = false

// 全局组件
import CountTo from 'vue-count-to'
Vue.component('CountTo', CountTo)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
