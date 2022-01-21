import Vue from 'vue'
import VueRouter from 'vue-router'

const Layout = () => import('@/layouts')
const Home = () => import('@/views/home/index.vue')
const Province = () => import('@/views/province/index.vue')
const City = () => import('@/views/city/index.vue')
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/home',
        component: Layout,
        name: 'Layout',
        children: [
            {
                path: '/home',
                component: Home,
                name: 'Home'
            },
            {
                path: '/province',
                component: Province,
                name: 'Province'
            },
            {
                path: '/city',
                component: City,
                name: 'city'
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router
