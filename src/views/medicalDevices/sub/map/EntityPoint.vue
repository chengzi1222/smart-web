<template>
  <bm-overlay ref="overlay" class="bm-overlay" pane="mapPane" @draw="draw" :class="{'point-active':active}">
    <div class="detail-box" v-if="active" ref="detailBox">
      <div class="main-content">
        <div class="left">
          <!-- <div class="left-left">
            <img src="" alt="" />
          </div> -->
          <div class="left-right">
            <p class="title">主体名：{{ info.entityName }}</p>
            <p>负责人：
              <span>{{ info.corpName }}</span>
            </p>
            <p>联系方式：
              <span>{{ info.mobile }}</span>
            </p>
            <p>辖区：
              <span>{{ info.deptName }}</span>
            </p>
            <p>实际地址：
              <span>{{ info.address }}</span>
            </p>
            <p>最后巡查时间：
              <span>{{ info.patrolTime }}</span>
            </p>
            <p>企业形态：
              <span>{{ info.entityType}}</span>
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

<script type="module">
import { BmOverlay } from 'vue-baidu-map';
import { getShowFind } from 'api/medicalDevices/subMap'

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
      defaulticon: require('assets/img/map/point_default_x2.png'),
      activeIcon: require('assets/img/map/point_click_x2.png'),
      size: 44,
      info: {},
      load: false,
      type:{
        CES_BAB: "理发店",
        CES_BS: "美容院",
        CES_CSH: "整容医院",
        CES_NS: "美甲店",
        CMS_SPM: "商场",
        CMS_DS: "药店",
        CMS_SM: "超市",
        OTHER_MANAGER:'其他经营主体',
        OTHER_EMPLOY:'其他使用主体',
        CPS_PE:'生产企业',
      }
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
        let entityId = this.point.id;
        let strType= this.info.entityTypeExt.substring( this.info.entityTypeExt.indexOf("_")+1)
        this.$router.push({path: '/medicalDevices/subject/' + strType.toLowerCase() + '/detail',
          query: {
            entityType:this.info.entityTypeExt,
            ext: 'INFO',
            entityId: entityId,
        }})
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
          getShowFind(this.point.id).then((data) => {
            if (data.status) {
              this.load = true;
              this.active = active;
              this.info = data.data;
              this.reszieInfoWindow();
            }
          });
        } else {
          this.active = active;
          this.reszieInfoWindow();
        }
        this.icon = this.activeIcon;
        this.size = 58;
      } else {
        this.active = active;
        this.icon = this.defaulticon;
        this.size = 44;
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

<style lang="sass">
.bm-overlay .bm-point {
  cursor: pointer;
  z-index: 999;
}
.point-active {
  z-index: 1000;
}

.bm-overlay .detail-box {
  height: 200px;
  top: -194px;
  /* left: -72px; */
  z-index: 998;
  position: absolute;
  color: #fff;
  opacity: 0.7;
}
.bm-overlay .detail-box .main-content {
  border-radius: 5px;
}

.bm-overlay .detail-box .main-content .left {
  overflow: hidden;
  height: 200px;
  float: left;
  background: #151920;
  padding: 10px;
  display: flex;
  flex-wrap: nowrap;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}
.bm-overlay .detail-box .main-content .right {
  cursor: pointer;
  float: left;
  height: 200px;
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
  /* z-index: -1; */
}
</style>

