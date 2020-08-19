<template>
  <bm-overlay ref="overlay" class="bm-overlay" pane="mapPane" @draw="draw" :class="{'point-active':active}">
    <div class="detail-box" v-if="active" ref="detailBox">
      <div class="main-content">
        <div class="left">
          <div class="left-right">
            <p class="title">{{ info.entityName }}</p>
            <p v-if='info.corpName'>负责人：
              <span>{{ info.corpName }}</span>
            </p>
            <p>联系方式：
              <span>{{ info.mobile?info.mobile:"暂无" }}</span>
            </p>
            <p>所属街道：
              <span>{{ info.syjName?info.syjName:"暂无"  }}</span>
            </p>
            <p>地址：
              <span>{{ info.realityAddr?info.realityAddr:"暂无"  }}</span>
            </p>
            <p>告警时间：
              <span>{{ info.sourceTime?info.sourceTime:"暂无"  }}</span>
            </p>
            <p>主体类型：
              <span>{{ info.entityType?info.entityType:"暂无"  }}</span>
            </p>
             <p>问题数量：
              <span>{{ info.errorCount?info.errorCount:"暂无"  }}</span>
            </p>
          </div>
        </div>
        <div class="right" @click="toEntity">
          <span class="iconfont icon-arrows"></span>
        </div>
      </div>

    </div>
    <div class="bm-point" @click="show">
      <span class="iconfont icon-triangle tri" v-if="active"></span>
      <img v-bind:src="icon" :width="size" :height="size" />
    </div>
  </bm-overlay>
</template>

<script>
import { BmOverlay } from 'vue-baidu-map';
import * as mapApi from "api/sub/map";

export default {
  name: 'entity-point',
  props: {
    point: Object,
    activeId: {
      type: String,
      default: ""
    },
  },
  mounted() {
    this.icon = this.defaulticon;
    if (this.activeId === this.point.id) {
      this.toggle(true);
    }
  },
  data() {
    return {
      active: false,
      icon: null,
      defaulticon: require('assets/img/map/point_default.png'),
      activeIcon: require('assets/img/map/point_.png'),
      size: 30,
      info: {},
      load: false,
    }
  },
  watch: {
    'point': {
      handler() {
        if (this.$refs.overlay && this.$refs.overlay.reload) {
          this.$refs.overlay.reload()
        }
      },
      deep: true
    },
    activeId() {
      if (this.activeId === this.point.id) {
        if (!this.active) {
          this.toggle(true);
        }
      } else {
        if (this.active) {
          this.toggle(false);
        }
      }
    }
  },
  methods: {
    toEntity() {
      if (this.point.sourceType === 'REPATROL') {
        this.$router.push({
          path: '/biz/patrol/repatrol/detail/'+this.point.sourceId,
        });
      } 
      if (this.point.sourceType === "DAILY") {
        this.$router.push({
          path: "/biz/patrol/record/daily/detail",
          query: {
            recordId: this.point.sourceId,
            patrolType:'DAILY'
          }
        })
      }
       if (this.point.sourceType === "SPECIAL") {
        this.$router.push({
          path: "/biz/patrol/record/special/detail",
          query: {
            recordId: this.point.sourceId,
            patrolType:'SPECIAL'
          }
        })
      }
    },
    show() {
      if (this.active) {
        this.$emit("actived", "");
      } else {
        this.$emit("actived", this.point.id);
      }
    },
    toggle(active) {
      if (active) {
        if (!this.load) {
              this.load = true;
              this.active = active;
              this.info = this.point;
              this.reszieInfoWindow();
        } else {
          this.active = active;
          this.reszieInfoWindow();
        }
        this.icon = this.activeIcon;
        this.size = 44;
      } else {
        this.active = active;
        this.icon = this.defaulticon;
        this.size = 30;
      }
    },
    reszieInfoWindow() {
      if (this.active) {
        this.$nextTick(() => {
          const c = this.$refs.detailBox;
          const w = c.offsetWidth;
          c.style.left = -(w / 2) + 30 + 'px';
        })
      }
    },
    draw({ el, BMap, map }) {
      const { lng, lat } = this.point;
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
      el.style.left = pixel.x + "px";
      el.style.top = pixel.y + "px";
      this.reszieInfoWindow();
    }
  },
  components: {
    BmOverlay,
  }
}
</script>

<style scoped lang="sass">
.bm-overlay .bm-point {
  cursor: pointer;
  z-index: 999;
}
.point-active {
  z-index: 1000;
}

.bm-overlay .detail-box {
  height: 180px;
  top: -174px;
  /* left: -72px; */
  z-index: 998;
  position: absolute;
  color: #fff;
  opacity: 0.9;
}
.bm-overlay .detail-box .main-content {
  border-radius: 5px;
}

.bm-overlay .detail-box .main-content .left {
  overflow: hidden;
  height: 180px;
  float: left;
  background: #474A53;
  padding: 10px;
  display: flex;
  flex-wrap: nowrap;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}
.bm-overlay .detail-box .main-content .right {
  cursor: pointer;
  float: left;
  height: 180px;
  background: #6d6f73;
  line-height: 180px;
  font-size: 25px;
  margin-right: -25px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}
.bm-overlay .detail-box .main-content .left,
.bm-overlay .detail-box .main-content .right {
  box-sizing: border-box;
}

.bm-overlay .detail-box .main-content .left-left {
  float: left;
}
.bm-overlay .detail-box .main-content .left-left > img {
  display: block;
  border-radius: 6px;
  width: 80px;
  height: 80px;
  border: 1px solid #ccc;
  margin-right: 10px;
}
.bm-overlay .detail-box .main-content .left-right {
  float: left;
}
.bm-overlay .detail-box .main-content .left-right p {
  color: #a2aab6;
  font-size: 12px;
  margin-bottom: 0px;
  white-space: nowrap;
  margin-top: 0px !important;
}
.bm-overlay .detail-box .main-content .left-right p > span {
  margin-left: 5px;
}
.bm-overlay .detail-box .main-content .left-right .title {
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 10px;
  margin-top: 0px;
}
.bm-overlay .detail-box .main-content .left-right .star-box {
  margin-top: 3px;
}
.bm-overlay .detail-box .main-content .left-right .star {
  color: #ffb442;
  font-size: 20px;
  vertical-align: sub;
}
.bm-point .tri {
  color: #151920;
  position: absolute;
  left: 2px;
  bottom: 52px;
  font-size: 53px;
  line-height: 0px;
  opacity: 0.7;
}
</style>

