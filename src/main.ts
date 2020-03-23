import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design'
import VueLazyLoad from 'vue-lazyload'
import './assets/styles/index.scss'
import './assets/styles/theme.less'
import './mock/index'

Vue.config.productionTip = false
Vue.use(ViewUI)
Vue.use(VueLazyLoad)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
