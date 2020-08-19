import Vue from "vue";
import Router from "vue-router";
import routerMap from "./router";
import * as storage from "utils/sessionStorage";
import store from "../store";

import whiteList from "./whitelist"; // 登白名单

Vue.use(Router);
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
  // mode: 'history', //后端支持可开
  routes: routerMap,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
});
const LOGIN_KEY = 'is-login';
let isLogin = storage.getCookie(LOGIN_KEY) === 'true';
 router.beforeEach((to, from, next) => {
  
  clearHttpRequestingList()
  console.log(to.path,from.path)
  /* 路由发生变化修改页面title */
  // if (to.meta.title) {
  //   document.title = to.meta.title;
  // }else{
	// 	document.title ='农产品溯源监管平台';
  // }
  
  next();

  const data = storage.getData(to.path);
  if (data) {
    let params = JSON.parse(data);
    storage.removeData(to.path);
    next({ path: to.path, name: to.name, params: params, query: to.query })
  }
  if (isLogin === true) { // 判断是否登录
    if (to.name === 'login'||to.name === 'kashiLogin') {
      next({ path: '/' });
    } else  if (to.name === 'welcome'&&store.getters.user.userType != "ADMIN" && store.getters.user.areaCode.slice(0,6) == "510109"&&window.location.host=='smart-sccdgx.ybveg.com') {
      next({ path: '/gaoxinHome' });
    }else{
      if (!store.getters.user.id){
        (async function name(params) {
          await store.dispatch('getInfo', storage.getCookie('system'), to.name).then(() => {
            if(store.getters.user.simpleName) { // 获取user后改变页面(除登录页外)title
              document.title = store.getters.user.simpleName
            }
            next();
          })
        }())
      }else {
        next();
      }
      // if (store.getters.menus.length === 0 && to.name !== 'index.welcome') {
      //   console.log("进入menus")
      //   store.dispatch('getMenus', storage.getCookie('system'));
      //     if(!storage.getCookie('system')){
      //       next({ name: 'index.welcome' });
      //     }
      // }
    }
  } else if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
    if (to.name === 'login'||to.name === 'kashiLogin') {
      store.dispatch('getHome_')
      next();
    } else{
      next();
    }

  } else {
    store.dispatch('logout', to)
    // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
  }
});

router.afterEach((route) => {
  window.scrollTo(0, 0);//跳转另一页面是回到顶部
});
export function setLogin(flag) {
  isLogin = flag;
  storage.setCookie(LOGIN_KEY, flag);
}

export const clearHttpRequestingList = () => {
  if (Vue.prototype.$httpRequestList.length > 0) {
      Vue.prototype.$httpRequestList.forEach((item) => {
          item()
      })
      Vue.prototype.$httpRequestList = []
  }
}
export default router;
