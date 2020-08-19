import 'babel-polyfill';
import 'utils/el_form_validate.js';

import Vue from 'vue';
import ElementUI from 'element-ui';
import Vuebar from 'vuebar';
import App from './App';
import router from './router';
import store from './store';
import './directive/auth';

Vue.use(ElementUI);
Vue.use(Vuebar);

if (process.env.NODE_ENV != 'production') {
  Vue.config.productionTip = true;
  Vue.config.devtools = true;
}
Vue.prototype.$httpRequestList = []
// 防止自己网页内容被别人iframe
// try{
// 　　top.location.hostname;
// 　　if (top.location.hostname != window.location.hostname) {
// 　　　　top.location.href =window.location.href;
// 　　}
// }
// catch(e){
// 　　top.location.href = window.location.href;
// }

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  },
  render: h => h(App)
}).$mount("#app");