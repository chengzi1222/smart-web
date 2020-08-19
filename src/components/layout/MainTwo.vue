<template>
  <transition name="fade" mode="out-in">
    <router-view :key="$router.path"></router-view>
  </transition>
</template>

<script>

  export default {
    name: 'Main'
  }
</script>
<style scoped lang="sass">
  .app-main {
    position: fixed;
    top: 50px;
    display: flex;
    width: 100%;
    height: calc(100% - 50px);
  }

  .app-main .app-container {
    flex: 1;
    overflow-y: auto;
    padding: 0 20px;
  }
</style>

