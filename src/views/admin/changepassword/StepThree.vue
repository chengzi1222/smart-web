<template>
    <div class="clearfix">
        <div class="floatL" style="margin-right:40px;">
            <img class="pic" :src="require('assets/img/lock.png')">
        </div>
        <div class="floatL">
            <p style="font-size: 24px;color: #393939;">已完成密码重置！</p>
            <p style="font-size: 16px;color: #939DAD;margin:10px 0;">请牢记您新设置的密码</p>
            <el-button type="primary" @click="toLogin">返回登录</el-button>
        </div>
    </div>
</template>

<script>
import { logout } from "api/login.js";
export default {
  methods: {
    toLogin() {
      this.$store.dispatch('logout');
    }
  }
};
</script>

<style lang="scss" scoped>
.pic {
  width: 80px;
}
</style>

