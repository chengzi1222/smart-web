// 文件说明
// 公共请求common.js
import http from "../utils/http";
import qs from "qs";

/**
 * 用户登录
 * @param {string} usernam
 * @param {string} password
 */
export function login(loginDto) {
  let data = qs.stringify(loginDto);
  return http({
    loading: true,  // 可以没有 默认是开启的
    loadOption: {    // 具体设置参考 上面传送门
      text: "登录中……"
    },
    method: 'post',
    url: '/login',
    data
  })
}

/**
 * 用户登录
 * @param {string} usernam
 * @param {string} password
 */
export function ssologin(loginDto) {
  let data = qs.stringify(loginDto);
  return http({
    loading: true,  // 可以没有 默认是开启的
    loadOption: {    // 具体设置参考 上面传送门
      text: "登录中……"
    },
    method: 'post',
    url: '/ssoLogin',
    data
  })
}
/**
 * 用户登出
 */
export function logout() {
  return http({
    method: 'post',
    url: '/logout'
  })
}

export function getInfo() {
  return http({
    method: 'get',
    url: '/env/base/user'
  })
}

export function getAuths() {
  return http({
    method: 'get',
    url: '/env/base/auths'
  })
}

/**
 * 查菜单数据
 */
export function getMenus(label) {
  return http({
    method: 'get',
    url: '/env/base/menus/' + label,
  })
}

/**
 * 查菜单数据
 */
export function getMenus_optimize(label) {
  return http({
    method: 'get',
    url: '/env/base/menus/optimize/' + label,
  })
}

/**
* 查菜单数据
*/
export function getLabelAuth() {
  return http({
    method: 'post',
    url: 'env/base/labels',
  })
}

export function getBase() {
  return http({
    method: 'get',
    url: '/env/base'
  })
}

export function changePassword(oldPassword) {
  var data = qs.stringify({ 'oldPassword': oldPassword })
  return http({
    method: 'POST',
    url: '/changePassword',
    data
  })
}

export function updateNewPassword(user) {
  var data = qs.stringify(user)
  return http({
    method: 'POST',
    url: '/updateNewPassword',
    data
  })
}

export function send(tel) {
  return http({
    method: 'post',
    url: '/send/' + tel
  })
}

export function checkCode(checkMessage) {
  let data = qs.stringify(checkMessage)
  return http({
    method: 'post',
    url: '/checkCode',
    data
  })
}

export function getHome() {
  return http({
    method: 'get',
    url: '/home'
  })
}
