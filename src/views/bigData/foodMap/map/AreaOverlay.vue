<template>
  <bm-overlay ref="overlay" class="bm-overlay" pane="mapPane" @draw="draw">
    <div class="bm-entity">
      <div style="padding-top:45px;position:absolute;left:0%;z-index:9999;width:100%;text-align:center">
        <div class="label"> {{ areaName }} </div>
        <div class="label"> {{ num || 0 }} </div>
      </div>
    </div>
  </bm-overlay>
</template>

<script>
import { BmOverlay } from 'vue-baidu-map';

export default {
  name: 'area-overlay',
  props: {
    areaName: String,
    num: Number,
    lat: Number,
    lng: Number,
  },
  watch: {
    lat: {
      handler() {
        if (this.$refs.overlay && this.$refs.overlay.reload) {
          this.$refs.overlay.reload()
        }
      },
      deep: true
    },
    lng: {
      handler() {
        if (this.$refs.overlay && this.$refs.overlay.reload) {
          this.$refs.overlay.reload()
        }
      },
      deep: true
    }
  },
  methods: {
    draw({ el, BMap, map }) {
      const { lng, lat } = this;
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
      el.style.left = pixel.x + "px";
      el.style.top = pixel.y + "px";
    }
  },
  components: {
    BmOverlay,
  }
}
</script>

<style lang="scss" scoped>
.bm-overlay .bm-entity {
  background: url("~@/assets/img/map/overlay_x2.png") center center;
  background-size: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
  font-size: 16px;
  color: #ffffff;
  height: 130px;
  width: 130px;
}

.bm-entity .label {
  line-height: 24px;
}
</style>
