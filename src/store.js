import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import state from './stores/state'
import actions from './stores/actions'
import mutations from './stores/mutations'

export default new Vuex.Store({
    state,
    mutations,
    actions
})
