<template>
<div class="ipadBg">
    <router-view></router-view>
</div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {}
  };
</script>
<style lang='scss' scoped>
.ipadBg{
  width: 1920px;
  height: 1080px;
  background: url("~@/assets/img/schoolTrace/ipadBgNew.png") center center;
  .wrap_ipadBg {
    width: 1792px;
    height: 1008px;
    position: relative;
    left: 64px;
    top: 36px;
    background-color: #f5f5f5;

    }
  }
</style>

