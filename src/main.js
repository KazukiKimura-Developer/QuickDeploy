import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/ja'
import ElementUI from 'element-ui'

Vue.config.productionTip = false
Vue.use(ElementUI,{locale})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
