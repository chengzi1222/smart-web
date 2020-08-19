<template>
  <div>
    <pic-index></pic-index>
  </div>
</template>

<script>
import PicIndex from '../PicIndex.vue'
export default {
  mounted() {
    setTimeout(() => {
      this.$router.push({name :'news.list'})
    }, 0);
  },
  components: {
    PicIndex
  }
}
</script>

