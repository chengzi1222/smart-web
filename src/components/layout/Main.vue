<template>
  <div class="app-main">
    <side-bar></side-bar>
    <section class="app-container">
      <transition name="fade" mode="out-in">
        <router-view :key="$route.path"></router-view>
      </transition>
    </section>
  </div>
</template>

<script>

import SideBar from './SideBar';
export default {
  name: 'Main',
  components: { SideBar },
  computed:{}
}
</script>
<style scoped lang="sass">
.app-main {
  position: fixed;
  top: 50px;
  display: flex;
  width: 100%;
  height: calc(100% - 50px);
  z-index:-1;
}

.app-main .app-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 20px;
}
</style>

