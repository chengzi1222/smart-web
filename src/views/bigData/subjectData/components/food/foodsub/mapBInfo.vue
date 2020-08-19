<template>
  <bm-overlay ref="overlay"  v-if="isShow"   class="bm-overlay" pane="mapPane" @draw="draw">
    <div class="detail-box"  v-loading="loading"  element-loading-background="rgba(34, 61, 92, 0.8)">
      <a href="javascript:;" @click="close"></a>
        <div class="textBox">
          <el-tooltip effect="dark" :content="point.entityName" placement="top-start">
            <p class="title textell">{{point.entityName}}</p>
          </el-tooltip>
          <el-tooltip effect="dark" :content="point.corpName" placement="top-start">
            <p class=" textell">负责人：
              <span>{{ point.corpName?point.corpName:"暂无" }}</span>
            </p>
          </el-tooltip>
          <el-tooltip effect="dark" :content="point.mobile" placement="top-start">
            <p class=" textell">联系方式：
              <span>{{ point.mobile?point.mobile:"暂无" }}</span>
            </p>
          </el-tooltip>
          <el-tooltip effect="dark" :content="point.detpName" placement="top-start">
            <p class=" textell">所属辖区：
              <span>{{ point.detpName?point.detpName:"暂无" }}</span>
            </p>
          </el-tooltip>
          <el-tooltip effect="dark" :content="point.address" placement="top-start">
            <p class=" textell">实际地址：
              <span>{{ point.address?point.address:"暂无" }}</span>
            </p>
          </el-tooltip>
          <el-tooltip effect="dark" :content="point.patrolTime" placement="top-start">
            <p class=" textell">最后巡查实际：
              <span>{{ point.patrolTime?point.patrolTime:"暂无" }}</span>
            </p>
          </el-tooltip>
        </div>
        <div class="line"></div>
    </div>
  </bm-overlay>
</template>

<script>
import { BmOverlay } from 'vue-baidu-map';
import * as mapApi from "api/sub/map";
export default {
  props: {
    pointObj: Object,
    isShow:{
      type:Boolean,
      default:false,
    },
  },
  data() {
    return {
        id:"",
        point:{},
        loading:false
    };
  },
  mounted() {
   
  },
  methods: {
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
      const { lng, lat } = this.pointObj;
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
      el.style.left = pixel.x+59 + "px";
      el.style.top = pixel.y-66+ "px";
      this.reszieInfoWindow();
    },
    getInfo(){
      this.loading=true;
        mapApi.findEntity(this.pointObj.id, this.pointObj.type).then((data) => {
            if (data.status) {
              this.point = {};
              this.point = data.data;
              this.$nextTick(()=>{
                this.loading=false;
              })
            }
        });
    },
    close(){
      this.$emit("changeIsShow",false);
    }
  },
   watch: {
     id(){
       this.getInfo();
     },
     isShow(val){
       this.isShow=val;
       console.log(this.isShow)
     },
     "pointObj.id":{
       handler(){
          this.id=this.pointObj.id;
       }
     },
    'pointObj': {
      handler() {
        if (this.$refs.overlay && this.$refs.overlay.reload) {
          this.$refs.overlay.reload();
        }
      },
      deep: true
    },
  },
  components: {
    BmOverlay,
  }
};
</script>

<style scoped lang='scss'>
.bm-overlay .detail-box {
  border: 1px solid transparent;
  background: pink;
  height: 234px;
  width: 310px;
  background: url("~@/assets/img/bigData/subjectData/popBg.png") no-repeat center;
  background-size: 100% 100%;
  top: -210px;
  z-index: 2;
  position: absolute;
  color: #fff;
    >a{
      display:block;
      width: 16px;
      height: 16px;
      background:url("~@/assets/img/bigData/subjectData/close.png") no-repeat center;
      background-size: 100% 100%;
      cursor: pointer;
      right: 10px;
      top: 10px;
      position: absolute;
    }
    .line{
      position: absolute;
      width: 62px;
      height: 50px;
      background:url("~@/assets/img/bigData/subjectData/popLine.png") no-repeat center;
      background-size: 100% 100%;
      left: -53px;
      bottom: -40px;
    }
  >div.textBox{
    height: 194px;
    width: 270px;
    margin: 20px auto;
  
    >p{
      width:174px;
      height:30px;
      font-size:12px;
      margin-left: 10px;
      line-height: 30px;
      color:rgba(221,221,221,1);
    }
    .title{
      padding-left: 10px;
      margin-left:0px;
      width: 90%;
      height: 36px;
      line-height: 36px;
      background:#000 url("~@/assets/img/bigData/subjectData/cardTitleBg.png") no-repeat center;
      background-size: 100% 100%;
    }
  }
  
}
</style>

