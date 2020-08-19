<template>
  <bm-overlay ref="overlay" class="bm-overlay" pane="mapPane" @draw="draw" :class="{'point-active':active}">
    <div class="detail-box" v-show="active" ref="detailBox">
      <div class="main-content">
        <div class="left">

          <div class="left-right">
            <p class="title">{{ info.entity_name }}</p>
            <p>联系人：
              <span>{{ info.real_name }}</span>
            </p>
            <p>联系方式：
              <span>{{ info.phone }}</span>
            </p>
            <p>实际地址：
              <span>{{ info.reality_addr }}</span>
            </p>
            <p>预警短信：
              <span>{{ info.num }}</span>
            </p>
            <p v-show="info.state == 'EXECUTED'">处理方式：
              <span>{{ info.dispose_way }}</span>
            </p>
            <p v-show="info.state == 'EXECUTED'">处理时间：
              <span>{{ info.create_time }}</span>
            </p>
          </div>
        </div>
        <div class="right" @click="toEntity">
          <span class="iconfont icon-arrows"></span>
        </div>
      </div>

    </div>
    <div class="bm-point" @click="show">
      <span class="iconfont icon-triangle tri" v-show="active"></span>
      <img v-bind:src="icon" :width="size" :height="size" />
    </div>
  </bm-overlay>
</template>

<script>
import { BmOverlay } from 'vue-baidu-map';
import * as mapApi from "api/warning/map";

export default {
  name: 'entity-point',
  props: {
    taskId: {
      type: String,
      default: ""
    },
    state: {
      type: String,
      default: ""
    },
    point: Object,
    activeId: {
      type: String,
      default: ""
    },
  },
  mounted() {
    this.iconChange()
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
      defaulticonRed: require('assets/img/map/pointred_default.png'),
      activeIconRed: require('assets/img/map/pointred_click.png'),
      defaulticonYellow: require('assets/img/map/pointyellow_default.png'),
      activeIconYellow: require('assets/img/map/pointyellow_click.png'),
      size: 44,
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
    activeId() {//主体显示与隐藏

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
    iconChange () {
      //（this.icon = this.defaulticon;已处理）（未读=this.defaulticonRed）(待处理=this.defaulticonYellow)
      //首先进来要把icon的状态颜色赋值了。

      if(this.active){
        if(this.state === 'UNREAD'){
          // this.icon = this.defaulticonRed;
           this.icon = this.activeIconRed;
        }else if(this.state === 'TOBEEXECUTE'){
           this.icon = this.activeIconYellow;
          // this.icon = this.defaulticonYellow;
        }else if(this.state === 'EXECUTED'){
          // this.icon = this.defaulticon;
           this.icon = this.activeIcon;
        }
      }else{
        if(this.state === 'TOBEEXECUTE'){
          // this.icon = this.activeIconYellow;
          this.icon = this.defaulticonYellow;
        }else if(this.state === 'UNREAD'){
          // this.icon = this.activeIconRed;
          this.icon = this.defaulticonRed;
        }else if(this.state === 'EXECUTED'){
          // this.icon = this.activeIcon;
           this.icon = this.defaulticon;
        }
      }
    },
    toEntity() {//点击右键带上参数跳页面
        this.$router.push({
          path: '/medi/subject/' + this.info.entityTypeExt.toLowerCase() + '/detail',
          query: {
            entityType: this.info.entityType,
            entityTypeExt: this.info.entityTypeExt,
            ext: 'INFO',
            entityId: this.info.id
          }
        });
      },

    show() {//点击的时候传id出去
      if (this.active) {
        this.$emit("actived", "");
      } else {
        this.$emit("actived", this.point.id);
      }
    },
    toggle(active) {
      if (active) {
        if (!this.load) {//请求得到主体详情的数据
          mapApi.findEntity(this.taskId,this.point.id).then((data) => {
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
        this.iconChange()
        this.size = 58;
      } else {
        this.active = active;
        //这里来判断显示小图标状态颜色》》》取消后
        this.iconChange()
        this.size = 44;
      }
    },
    reszieInfoWindow() {//定位详情部分的具体位置
      if (this.active) {
        this.$nextTick(() => {
          const c = this.$refs.detailBox;
          const w = c.offsetWidth;
          console.log(w)
          c.style.left = -(w / 2) + 30 + 'px';
        })
      }
    },
    draw({ el, BMap, map }) {//主体图标的位置
      const { lng, lat } = this.point;
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat)); //换成当前像素
      el.style.left = pixel.x + "px";
      el.style.top = pixel.y + "px";
      // console.log(pixel)
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
  height: 180px;
  top: -174px;
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
  height: 180px;
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

