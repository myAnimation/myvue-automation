import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import gojs from 'gojs'
import '@/icons' // icon
import '@/permission' // permission control
import vcolorpicker from 'vcolorpicker'

import 'font-awesome/css/font-awesome.min.css'
import * as echarts from 'echarts';
// main.js
import VScaleScreen from 'v-scale-screen'
Vue.use(VScaleScreen)

Vue.use(ElementUI)
Vue.use(vcolorpicker)
window.go = gojs
Vue.prototype.$echarts = echarts
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.directive('loadmore', {
  bind(el, binding) {
    const selectWrap = el.querySelector('.el-table__body-wrapper');
    selectWrap.addEventListener('scroll', function () {
      if (this.scrollHeight - this.scrollTop <= this.clientHeight) {
        binding.value();
      }
    })
  }
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
