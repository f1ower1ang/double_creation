import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design'
import './assets/styles/index.scss'
import './assets/styles/theme.less'
import './mock/index'

Vue.config.productionTip = false
Vue.use(ViewUI)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
