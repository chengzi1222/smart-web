<template>
  <bm-overlay ref="overlay" class="bm-overlay" pane="mapPane" @draw="draw" :class="{'point-active':active}">
    <div class="detail-box " v-if="active" ref="detailBox" >
      <div class="main-content">
        <div class="left">
          <div class="left-right">
            <a href="javascript:;" class="close movePoin" @click="show(true)">x</a>
            <p  :title="info.realName"  class="textell">监管人员 ：
              <span >{{ info.realName}}</span>
            </p>
            <p class="textell"  :title="info.deptName">食药所：
              <span >{{ info.deptName}}</span>
            </p>
            <p>今日盒饭检查：
              <span>{{ info.boxNum== 0 ? '暂无' : info.boxNum }}</span>
            </p>
            <p>今日现场检查：
              <span>{{ info.checkNum== 0 ? '暂无' : info.checkNum }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- new   -->
    <div class="detail-box detail-box1 "  v-if='newCheck!=null' ref='detailBox1'>
      <div class="main-content">
         <div class="left">
          <div class="left-right">
            <a href="javascript:;" class="close movePoin" @click="show1()">x</a>
            <p class="title">最新的盒饭检查</p>
            <p :title="newCheck.supplier" class="textell">供应商：
              <span>{{ newCheck.supplier}}</span>
            </p>
            <p >车牌号：
              <span>{{ newCheck.carNum}}</span>
            </p>
            <p  :title="newCheck.supervisor"  class="textell">检查人员：
              <span>{{ newCheck.supervisor}}</span>
            </p>
            <p>处理方式：
              <span class="succeed" :class="{'no': newCheck.processMode=='拒收'}">{{ newCheck.processMode }}</span>
            </p>
            <p class="popBtn clear_a">
              <a href="javascript:;" class="movePoin btnLeft" @click="show1()">关闭</a>
              <a href="javascript:;" class="movePoin" @click="goInfo(newCheck.examId)">查看详情</a>
            </p>
          </div>
        </div>
      </div>

    </div>
    <div class="bm-point" @click="show" >
      <div class='point textell pointActive' :title="point.realName">
        </div>
    </div>
  </bm-overlay>
</template>

<script>
import { BmOverlay } from 'vue-baidu-map';
import * as api from "api/bigData/map";

export default {
  name: 'supervisor-point',
  props: {
    point: Object,
    activeId: {
      type: String,
      default: ""
    },
    taskId:{
      type: String,
      default: ""
    },
     newBox:{
      type:Array,
      default:[]
    }
  },
  mounted() {
    this.isClick = false;
    if (this.activeId === this.point.id) {
      this.toggle(true);
    }
  },
  data() {
    return {
      active: false,
      isClick: false,
      info: {},
      load: false,
      // newCheck:null,
      is:'show',
      newCheckShow:false,
    }
  },
  computed:{
    newCheck(){
      let arr=[];
      let b=this.newBox;
      for(let i=0;i<b.length;i++){
        if(b[i].id==this.point.id){
            arr=b[i];
            this.$nextTick(() => {
              const c = this.$refs.detailBox1;
              const w = c.offsetWidth;
              c.style.left = -(w / 2) + 7 + 'px';
            })
            return arr;
        }else{
          arr=null;
          return arr;
        }
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
    },
  },
  methods: {
    goInfo(id){
      this.$router.push({name: 'boxLunch.info', query: {'examineId': id}})
    },
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
        this.isClick=false;
      
      } else {
        this.$emit("actived", this.point.id);
        this.isClick=true;
      
      }
    },
    show1() {
       let obj={
         type:'box',
         id:this.newCheck.id
       }
       this.$emit('closeNew',obj);
    },
    toggle(active) {
      if (active) {
        if (!this.load) {
          let obj={
            "userId":this.point.id,
            "taskId":this.taskId
          }
          api.getSupervisor(obj).then(r=>{
            if (r.status) {
              this.load = true;
              this.active = active;
              this.info = r.data;
              this.reszieInfoWindow();
            }
          });
        } else {
          this.active = active;
          this.reszieInfoWindow();
          this.isClick=false;
        }
        this.isClick=true;
      } else {
        this.load = false;
        this.active = active;
        this.isClick=false;
      }
    },
    reszieInfoWindow() {
      if (this.active) {
        this.$nextTick(() => {
          const c = this.$refs.detailBox;
          const w = c.offsetWidth;
          c.style.left = -(w / 2) +7 + 'px';
        })
      }
    },
    draw({ el, BMap, map }) {
      const { lng, lat } = this.point;
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
      // const pixel = map.pointToOverlayPixel(new BMap.Point(104.0693664551,30.5545004217));
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

<style lang='scss' scoped>
.bm-overlay .bm-point {
  cursor: pointer;
  z-index: 999;
}
.point-active {
  z-index: 1000;
}

.bm-overlay .detail-box {
  box-sizing: border-box;
  width: 210px;
  height: 157px;
  top: -168px;
  /* left: -72px; */
  z-index: 998;
  position: absolute;
  color: #fff;
  opacity: 1;
  background: transparent url('../../../../assets/img/bigData/bg.png') no-repeat;
  background-size: 100% 100%;
}
.bm-overlay .detail-box1{
  height: 238px;
  width: 232px;
  top: -262px;
}
.bm-overlay .detail-box .main-content {
  border-radius: 5px;
}

.bm-overlay .detail-box .main-content .left {
  overflow: hidden;
  height: 155px;
  width: 209px;
  float: left;
  padding: 20px;
  display: flex;
  flex-wrap: nowrap;

}
.bm-overlay .detail-box1 .main-content .left {
  height: 227px;
  width: 232px;
}
.bm-overlay .detail-box .main-content .right {
  cursor: pointer;
  float: left;
  height: 180px;
  background:rgba(79,86,95,1);
  line-height: 180px;
  font-size: 25px;
  padding: 0 8px;
  margin-right: -41px;

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
  width: 100%;
}
.bm-overlay .detail-box .main-content .left-right p {
  color: #fff;
  font-size: 14px;
  line-height: 28px;
  margin-bottom: 0px;
  white-space: nowrap;
  overflow: hidden;
}
.bm-overlay .detail-box .main-content .left-right p > span {
  margin-left: 5px;
}
.succeed{
  color: #5CB680 !important;
}
.no{
  color: #EAA330 !important;
}
.bm-overlay .detail-box .main-content .left-right .title {
  font-size: 16px;
  color: #37C7FB;
  margin-top: 0px;
}
.point{
  // min-width: 80px;
  // max-width:150px;
  width: 15px;
  // line-height: 15px;
  height: 15px;
  background:url('../../../../assets/img/bigData/jgry.png') no-repeat;
  background-size:100% 100%; 
  font-size:12px;
  color:rgba(55,199,251,1);
  text-align: center;
  // span{
  //   transform: scale(0.9)
  // }
}
.pointActive{
  background:url('../../../../assets/img/bigData/jgry_active.png') no-repeat !important;
  background-size: 100% 100% !important;
  color:rgba(255,255,255,1) !important;
}
.mclzBtn{
  /* background:url('../../../../assets/img/bigData/mclz.png') no-repeat !important;
  background-size: 100% 100%; */
  width: 60px;
  height: 20px;
  position: absolute;
  top: 20px;
  right:50px;
  background:rgba(34,34,34,1);
  border:1px solid rgba(27,150,195,1);
  border-radius:2px;
  font-size:12px;
  color:rgba(55,199,251,1);
  text-align: center;
  line-height: 20px;
}
.close{
  /* background:url('../../../../assets/img/bigData/close.png') no-repeat !important; */
  /* background-size: 100% 100%; */
  color: #fff;
  font-size: 22px;
  width: 16px;
  height: 16px;
  position: absolute;
  top: 20px;
  right: 20px;
  text-align: center;
  line-height: 16px
}
.popBtn{
  margin-top: 17px;
  >a{
    width:80px;
    height:30px;
    background:rgba(12,47,60,1);
    border:1px solid rgba(27,150,195,1);
    border-radius:2px;
    text-align: center;
    line-height: 30px;
    margin-left:27px;
    display: block;
  }
  .btnLeft{
    margin-left: 0
  }
}
</style>

