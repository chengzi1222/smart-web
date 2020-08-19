<template>
  <bm-overlay ref="overlay" class="bm-overlay" pane="mapPane" @draw="draw" :class="{'point-active':active}">
    <div class="detail-box" v-if="active" ref="detailBox">
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
        defaulticon: require('assets/img/map/bigdata-2.svg'),
        activeIcon: require('assets/img/map/bigdata-1.svg'),
        size: 26,
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
        if (this.point.type === 'CFDA') {
          this.$router.push({
            name: 'cfda.archives.detail',
            query: {
              id: this.point.id,
              back: 'subject.map'
            }
          });
        } if (this.point.type === "ENTITY") {
          const entityType = this.info.entityType.toLocaleLowerCase();
          this.$router.push({
            name: "subject.archives.detail",
            params: {
              type: entityType,
            },
            query: {
              id: this.point.id
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
            mapApi.findEntity(this.point.id, this.point.type).then((data) => {
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
          this.size = 34;
        } else {
          this.active = active;
          this.icon = this.defaulticon;
          this.size = 26;
        }
      },
      reszieInfoWindow() {
        if (this.active) {
          this.$nextTick(() => {
            const c = this.$refs.detailBox;
            const w = c.offsetWidth;
            c.style.left = -(w / 2) + 30 + '*2px';
          })
        }
      },
      draw({ el, BMap, map }) {
        const { lng, lat } = this.point;
        const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
        el.style.left = pixel.x + "*2px";
        el.style.top = pixel.y + "*2px";
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
    height: 180*2px;
    top: -174*2px;
    /* left: -72*2px; */
    z-index: 998;
    position: absolute;
    color: #fff;
    opacity: 1;
  }

  .bm-overlay .detail-box .main-content {
    display: flex;
    border-radius: 5*2px;
  }

  .bm-overlay .detail-box .main-content .left {
    overflow: hidden;
    height: 180*2px;
    float: left;
    background: rgba(71, 74, 83, .85);
    /* opacity:0.85; */
    padding: 10*2px;
    display: flex;
    flex-wrap: nowrap;
    border-top-left-radius: 8*2px;
    border-bottom-left-radius: 8*2px;
  }

  .bm-overlay .detail-box .main-content .right {
    cursor: pointer;
    float: left;
    height: 180*2px;
    background: rgba(79, 86, 95, 1);
    line-height: 180*2px;
    font-size: 25*2px;
    padding: 0 8*2px;
    margin-right: -41*2px;
    border-top-right-radius: 8*2px;
    border-bottom-right-radius: 8*2px;
  }

  .bm-overlay .detail-box .main-content .left,
  .bm-overlay .detail-box .main-content .right {
    box-sizing: border-box;
  }

  .bm-overlay .detail-box .main-content .left-left {
    float: left;
  }

  .bm-overlay .detail-box .main-content .left-left>img {
    display: block;
    border-radius: 6*2px;
    width: 80*2px;
    height: 80*2px;
    border: 1*2px solid #ccc;
    margin-right: 10*2px;
  }

  .bm-overlay .detail-box .main-content .left-right {
    float: left;
  }

  .bm-overlay .detail-box .main-content .left-right p {
    color: #a2aab6;
    font-size: 12*2px;
    margin-bottom: 0*2px;
    white-space: nowrap;
  }

  .bm-overlay .detail-box .main-content .left-right p>span {
    margin-left: 5*2px;
  }

  .bm-overlay .detail-box .main-content .left-right .title {
    font-size: 16*2px;
    color: #ffffff;
    margin-bottom: 10*2px;
    margin-top: 0*2px;
  }

  .bm-overlay .detail-box .main-content .left-right .star-box {
    margin-top: 3*2px;
  }

  .bm-overlay .detail-box .main-content .left-right .star {
    color: #ffb442;
    font-size: 20*2px;
    vertical-align: sub;
  }

  .bm-point .tri {
    color: #151920;
    position: absolute;
    left: 2*2px;
    bottom: 52*2px;
    font-size: 53*2px;
    line-height: 0*2px;
    opacity: 0.7;
    /* z-index: -1; */
  }
</style>