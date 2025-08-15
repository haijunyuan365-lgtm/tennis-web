import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';  // 引入样式
import store from './store'


Vue.config.productionTip = false
Vue.use(ElementUI)
// 配置全局消息默认选项
// Vue.use(ElementUI, {
//   message: {
//     duration: 1500, 
//     showClose: true 
//   }
// })
Vue.use(router)
 new Vue({
  store,
  router,
  render: h => h(App),
   beforeCreate() {
     Vue.prototype.$bus = this;
   }
}).$mount('#app')
