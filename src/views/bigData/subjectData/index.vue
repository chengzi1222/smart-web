<template>
  <div  class="bigbox">
    <three></three>
    <!-- <four></four> -->
  </div>
</template>

<script type="module">
  import three from './structure/3x5.vue'
  import four from './structure/4x4.vue'
  export default {
    components: {
      three, four
    }
  }
</script>
<style lang='scss' scoped>
.bigbox{
  width: 100%;
  height: 100%;
  background: url("~@/assets/img/bigData/subjectData/bigBoxBg.png") no-repeat center;
  background-size: cover;
}
</style>

