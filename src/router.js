import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'

Vue.use(Router)

// 根据域名映射对应的路由
const redirects = {
    dice: '/dice',
    coin: '/coin',
    dice2: '/dice2',
    roll: '/roll',
}
const domain = location.hostname.split('.')[0]
export default new Router({
    routes: [
        {
            path: '/',
            redirect: redirects[domain] || '/404'
        },
        {
            path: '/coin',
            name: 'coin',
            component: Home,
        },
        {
            path: '/dice',
            name: 'dice',
            component: Home,
        },
        {
            path: '/dice2',
            name: 'dice2',
            component: Home,
        },
        {
            path: '/roll',
            name: 'roll',
            component: Home,
        },
        {
            path: '/question',
            name: 'question',
            component: () =>
                import( /* webpackChunkName: "Question" */ '@/views/Question.vue')
        },
        {
            path: '*',
            redirect: '/dice',
            // component: () =>
            // import(/* webpackChunkName: "NotFound" */ '@/views/NotFound.vue')
        },
    ],
})
