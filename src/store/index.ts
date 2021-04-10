import Vue from 'vue'
import Vuex from 'vuex'

import appStore from './module/appStore'

Vue.use(Vuex)

export default new Vuex.Store(appStore)
