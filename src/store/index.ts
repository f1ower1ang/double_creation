import Vue from 'vue'
import Vuex from 'vuex'
import getters from '@/store/getters'
import user from './modules/user'
import course from './modules/course'
import CreateLogger from 'vuex/dist/logger'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    course
  },
  strict: debug,
  plugins: debug ? [CreateLogger()] : [],
  getters
})
