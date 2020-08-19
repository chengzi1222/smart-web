<template>
  <div>
    <ChartIndex></ChartIndex>
  </div>
</template>

<script type="module">
import ChartIndex from './ChartIndex'
export default {
  mounted() {
    // setTimeout(() => {
    //   this.$router.push({path :'/medicalDevices/fileAudit/mywork'})
    // }, 1000);
  },
  components: {
    ChartIndex
  }
}
</script>

