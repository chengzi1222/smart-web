<template>
  <div class="app-wrapper">
    <keep-alive>
      <header-page key="app-header-page"></header-page>
    </keep-alive>
    <section class="app-container">
      <transition name="fade" mode="out-in">
        <router-view :key="$router.path"></router-view>
      </transition>
    </section>
  </div>
</template>

<script>

import HeaderPage from './Header';

export default {
  components: {
    HeaderPage
  }
}
</script>

<style scope lang="scss">
.app-wrapper {
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 2;
  /* 2018.2.6 周诚,修改首页滚动 */
  overflow: auto;
}
</style>

