import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// env condition
const ENV_PROD = location.port == ''
const ENV_DEV = location.hostname === 'localhost'
const ENV_TEST = !ENV_DEV && !ENV_PROD

// style
import '@/assets/css/fck.scss'

// core
import core from '@/js/core'
Vue.use(core, { env: { DEV: ENV_DEV, PROD: ENV_PROD, TEST: ENV_TEST } })

// filters
import filters from '@/js/filters.js'
Object.keys(filters).forEach(filter => {
    Vue.filter(filter, filters[filter])
})

// web3
import Web3 from 'web3'
Vue.use({
    install(Vue) {
        Vue.prototype.web3 = this.getWeb3()
    },

    getWeb3() {
        switch (true) {
            case ENV_PROD:
                return this.getProdWeb3()
            case ENV_DEV:
                return this.getDevWeb3()
            default:
                return this.getTestWeb3()
        }
    },

    // 产品环境
    getProdWeb3() {
        if (window.web3) {
            return new Web3(web3.currentProvider) // eslint-disable-line
        }

        const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/f94ab59b4d304c1bb2617d2aedd13db3')
        return new Web3(provider)
    },

    // 开发环境
    getDevWeb3() {
        return this.getTestWeb3()
    },

    // 测试环境
    getTestWeb3() {
        if (window.web3) {
            return new Web3(web3.currentProvider) // eslint-disable-line
        }

        const provider = new Web3.providers.HttpProvider('http://192.168.1.171:8080')
        return new Web3(provider)
    }
})

// Vue-resource
import VueResource from 'vue-resource'
Vue.use(VueResource)

// Vue-translator
import VueTranslator from 'vue-translator'
import LOCALE_CN from '@/locale/zh-CN.js'
import LOCALE_EN from '@/locale/en.js'
import LOCALE_RU from '@/locale/ru.js'
import LOCALE_JP from '@/locale/jp.js'
import LOCALE_KR from '@/locale/kr.js'

Vue.use(VueTranslator, {
    defaultLocale: 'en',
    locale: 'en',
    translations: {
        'zh-CN': LOCALE_CN,
        en: LOCALE_EN,
        ru: LOCALE_RU,
        jp: LOCALE_JP,
        kr: LOCALE_KR,
    }
})

// Modal
import Modal from '@/plugins/Modal'
Vue.component('Modal', Modal)

// scrollbar
import GeminiScrollbar from 'vue-gemini-scrollbar'
Vue.use(GeminiScrollbar)

Vue.config.productionTip = false

import { mapState } from 'vuex'

// 注册一个全局守卫，更新 currentGame 状态
router.beforeEach(({ name }, from, next) => {
    core.log('Main/route:', name)
    if (name) {
        store.dispatch('setCurrentGame', name)
    }
    next()
})

new Vue({
    el: '#app',

    data() {
        return {}
    },

    created() {
        // 设置环境状态
        this.setEnv()

        const { web3 } = this
        this.initContractParams(({ abi, contract, address, http }) => {
            store.dispatch('checkAndUpdateMetaMaskStatus', web3)
            store.dispatch('setContract', { contract: address, abi })
            store.dispatch('updateJackpotSize', { http, contract, web3 })
            store.dispatch('update_HOUSE_EDGE_MINIMUM_AMOUNT', { contract, web3 })
            store.dispatch('updateMaxProfit', { contract, web3 })
            store.dispatch('updateLockedInBets', { contract, web3 })
            store.dispatch('update_HOUSE_EDGE_PERCENT', { contract, web3 })
            store.dispatch('updateContractBalance', { contract, web3 })
        })
        store.dispatch('checkAndUpdateMetaMaskStatus', web3)
    },

    router,

    store,

    render: h => h(App),

    computed: {
        ...mapState(['env', 'config', 'isMetaMaskInstalled', 'isMetaMaskUnlocked', 'defaultAccount'])
    },

    watch: {
        isMetaMaskInstalled() {
            const { $store: store, web3, core } = this

            store.dispatch('updateWeb3', { web3: web3.version.api })
            core.log('web3/api:', web3.version.api)
        },

        isMetaMaskUnlocked() {
            const { web3 } = this
            this.$store.dispatch('checkAndUpdateAccount', { web3 })
        },

        '$route.query': {
            handler(query) {
                this.$store.dispatch('setRid', this.core.getParams({ query }))
            },
            immediate: true
        }
    },

    methods: {
        setEnv() {
            let env = '',
                baseApiUrl = `${location.protocol}//`

            switch (true) {
                case ENV_PROD:
                    env = 'PROD'
                    baseApiUrl += `${location.hostname}`
                    break
                case ENV_DEV:
                case ENV_TEST:
                default:
                    env = 'TEST'
                    baseApiUrl += '139.162.8.12:13030'
                    // baseApiUrl += `${location.hostname}:${location.port}`
            }

            this.$store.dispatch('setEnv', { env, baseApiUrl })
        },

        initContractParams(fn) {
            const { baseApiUrl } = this.config
            const { $http: http, web3, core, env } = this

            core.getContractInfo({ http, baseApiUrl, env }, ({ abi, address }) => {
                const contract = Vue.prototype.contract = web3 && web3.eth.contract(abi).at(address) || {}
                fn({ abi, contract, address, http })
                core.log('Main/getContract', { address, abi })
            })
        },
    }
})
