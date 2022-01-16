import Vue from 'vue'
import VueRouter from 'vue-router'

const Layout = () => import('@/layouts')
const Home = () => import('@/views/home/index.vue')
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
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router
