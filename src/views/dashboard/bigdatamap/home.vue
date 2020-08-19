<template>
  <div>
    <pic-index></pic-index>
  </div>
</template>

<script>
import PicIndex from '../PicIndex.vue'
export default {
  mounted() {
    this.$router.push({name :'bigData.index'})
  },
  components: {
    PicIndex
  }
}
</script>