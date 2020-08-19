<template>
  <bm-overlay ref="overlay" v-if="active" class="detail-box" pane="labelPane" @draw="draw">
    <div class="main-content">
      <div class="left">
        <div class="left-right">
          <p class="title">{{ info.entityName }}</p>
          <p>负责人：
            <span>{{ info.corpName }}</span>
          </p>
          <p>联系方式：
            <span>{{ info.mobile }}</span>
          </p>
          <p>辖区：
            <span>{{ info.detpName }}</span>
          </p>
          <p>实际地址：
            <span>{{ info.address }}</span>
          </p>
          <p>最后巡查时间：
            <span>{{ info.patrolTime }}</span>
          </p>
          <p class="star-box">信用等级：
            <span class="star" id="star"></span>
          </p>
        </div>
      </div>
      <div class="right">
        ＞
      </div>
    </div>
    <span class="triangle"></span>
  </bm-overlay>
</template>

<script>
import { BmOverlay } from 'vue-baidu-map';

export default {
  name: 'entity-info-overlay',
  props: ['info', 'position', 'active'],
  watch: {
    position: {
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
      const { lng, lat } = this.position
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
      el.style.left = pixel.x - (el.offsetWidth / 2) + 12 + "*2px";
      el.style.top = pixel.y - el.offsetHeight + 4 + "*2px";
    }
  },
  components: {
    BmOverlay,
  }
}
</script>

<style lang="sass">
.detail-box {
  height: 220*2px;

  position: absolute;
  color: #fff;
  opacity: 0.7;
}
.detail-box .main-content {
  border-radius: 5*2px;
}

.detail-box .main-content .left {
  overflow: hidden;
  height: 200*2px;
  float: left;
  background: #151920;
  padding: 10*2px;
  display: flex;
  flex-wrap: nowrap;
}
.detail-box .main-content .right {
  float: left;
  height: 200*2px;
  background: #6d6f73;
  line-height: 200*2px;
  font-size: 25*2px;
  margin-right:-25*2px;
}
.detail-box .main-content .left,
.detail-box .main-content .right {
  box-sizing: border-box;
}

.detail-box .main-content .left-left {
  float: left;
}
.detail-box .main-content .left-left > img {
  display: block;
  border-radius: 6*2px;
  width: 80*2px;
  height: 80*2px;
  border: 1*2px solid #ccc;
  margin-right: 10*2px;
}
.detail-box .main-content .left-right {
  float: left;
}
.detail-box .main-content .left-right p {
  margin-top: 8*2px;
  color: #a2aab6;
  font-size: 12*2px;
  margin-bottom: 0*2px;
  white-space:nowrap;
}
.detail-box .main-content .left-right p > span {
  margin-left: 5*2px;
}
.detail-box .main-content .left-right .title {
  font-size: 16*2px;
  color: #ffffff;
  margin-bottom: 10*2px;
  margin-top: 0*2px;
}
.detail-box .main-content .left-right .star-box {
  margin-top: 3*2px;
}
.detail-box .main-content .left-right .star {
  color: #ffb442;
  font-size: 20*2px;
  vertical-align: sub;
}
.detail-box .triangle {
  width: 0*2px;
  height: 0*2px;
  border: 16*2px solid transparent;
  border-top-color: #151920;
  position: absolute;
  left: 50%;
  margin-left: -28*2px;
  bottom: -10*2px;
}
</style>
