// 注册全局指令 验证权限
import Vue from "vue";
import hasAuth from 'utils/checkAuth'

Vue.directive('auth', {
  // 当绑定元素插入到 DOM 中。
  inserted: function (el, binding) {
    if (binding.value) {
      const flag = hasAuth(binding.value);
      if (!flag) {
        el.outerHTML = '<!-- no auth -->'
      }
    }
  }
})
