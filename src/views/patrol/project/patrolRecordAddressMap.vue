<template>
  <baidu-map class="bm-view" :ak="baiduMapAk" :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom="true">
    <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
  </baidu-map>
</template>

<script>
  import { BaiduMap, BmMarker } from "vue-baidu-map";
  import config from "utils/config";

  export default {
    props: {
      lng: {
        type: Number
      },
      lat: {
        type: Number
      }
    },
    components: {
      BaiduMap,
      BmMarker
    },
    data() {
      return {
        baiduMapAk: config.baiduMapAk,
        center: { lng: 0, lat: 0 },
        zoom: 15
      };
    },
    mounted() {
      if (!document.createElement('canvas').getContext) {
        this.$message({ type: 'warning', message: '使用chrome、safari、IE9+以上浏览器才能正常访问此页面' });
      }
    },
    methods: {
      handler({ BMap, map }) {
        this.center.lng = this.lng
        this.center.lat = this.lat
      }
    },
  };
</script>

<style scoped lang="sass">
  .bm-view {
    width: 100%;
    height: 100%;
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>

<style lang="sass">
  .bm-overlay {
    position: absolute;
  }
</style>