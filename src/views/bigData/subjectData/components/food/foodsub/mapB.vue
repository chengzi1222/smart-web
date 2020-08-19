<template>
  <baidu-map class="bm-view" :theme='arr' :ak="baiduMapAk" @moveend="zoomend" :center="centerComputed" 
  :zoom="zoomComputed" :min-zoom="zoomComputed-2" :map-click="false" :max-zoom="map.maxZoom" 
  :scroll-wheel-zoom="map.scrollWheelZoom" @load="load" @zoomend="zoomend" @ready="handler">
    <!-- <p class="title absolute">{{areaName}}智慧城市主体情况</p> -->
    <p class="title absolute">天府新区市场监管城市大脑</p>

    <!-- 按钮 -->
    <div class="topBtn ">
      <button class="typeBtn" v-for="(item,index) in btnType" @click="btnTypelick(index,item.type)" :key="index" :class="btnTypeActive == index ? 'current':''">
            {{item.name}}
      </button>
    </div>
    <!-- 模式切换按钮-->
    <div class="btn absolute"   @click="switch_">
    </div>
    <!-- 主体详情弹框-->
    <info :pointObj="activeObj" :isShow="infoIsShow" @changeIsShow="changeIsShow_"></info>
    <!-- 区和街道 -->
    <area-overlay v-for="item in overlays" :key="item.areaCode" :area-name="item.areaName" :num="item.num" :lng="item.lng" :lat="item.lat"></area-overlay>
    <!-- 主体海量点 -->
    <bm-point-collection  :points="points" shape="BMAP_POINT_SHAPE_CIRCLE" color="rgba(13,181,239,0.7)" size="BMAP_POINT_SIZE_BIGGER" @click="clickHandler"></bm-point-collection>
    <bm-view style="width: 100%; height:100%; flex: 1"></bm-view>
  </baidu-map>
</template>

<script>
import { BaiduMap, BmView ,BmPointCollection  } from "vue-baidu-map";
import config from "utils/config";
import info from './mapBInfo';
import AreaOverlay from './AreaOverlay';
import {mapStyle,getAreaName} from './china-main-city-map';
import {getCircle,getPoint} from 'api/bigData/subjectData'

export default {
  data() {
    return {
      infoIsShow:false,
      infoId:"",
      arr:mapStyle,
      baiduMapAk: config.baiduMapAk,//百度钥匙
      BMap: null,       // 百度地图
      instance: null,   // 地图实例
      map: {
        zoom: 0,
        maxZoom: 19,
        minZoom: 8, //最小放大解绑
        center: "中国"
      },
      currentLevel: 0,  //级别 参照AreaLevel 的 codeLevel
      points:[],
      initPoints:[],
      overlays:[],
      activeObj:{},
      type:"RESTAURANT",
      btnType: [
        {
          name:'餐饮主体',
          type:'RESTAURANT'
        },{
          name:'三小主体',
          type:'CFDA'
        },{
          name:'生产主体',
          type:'PRODUCT'
        },{
          name:'流通主体',
          type:'CIRCULATION'
        }],
      // '重点监管对象'
      btnTypeActive: 0,
      areaName:'四川'
    };
  },
  mounted() {
    if(this.$store.state.common.user.areaCode.length>=10){
      console.error("当前用户级别不允许访问");
      return;
    }
    this.areaName=getAreaName(this.$store.state.common.user.areaCode)
    if (!document.createElement('canvas').getContext) {
      this.message({ type: 'warning', message: '使用chrome、safari、IE9+以上浏览器才能正常访问此页面' });
    };
    this.point();
  },
  methods: {
    async point(){
      await getPoint({"entityType":this.type}).then(data => {
        if (data.status) {
          this.initPoints=[];
          this.initPoints = data.data;
          this.locationSearch() 
        }
      });
    },
   switch_(){
      this.$emit("switchFun","mapa")
   },
   btnTypelick(i,type){
     this.btnTypeActive=i;
     this.type=type;
     this.infoIsShow=false;
     this.point();
   },
   clickHandler(e){
      if(this.infoId==e.point.id){
        this.infoIsShow=!this.infoIsShow;
      }else{
        this.infoId=e.point.id;
        this.infoIsShow=true;
        this.activeObj={};
        this.activeObj=e.point;
      }
   },
   changeIsShow_(b){
     this.infoIsShow=b;
   },
   createOverlay(data, count) {//生成区和街道覆盖层
      const $this = this;
      const map = this.instance;
      this.overlays = []
      const overlays = [];//每次清零自己的数据盒子
      data.forEach(element => {
        if (element.lat && element.lng && count[element.areaCode]) {
          element.num = count[element.areaCode];
          overlays.push(element);
        }
      });
      this.$nextTick(()=>{
         this.overlays = overlays;
      })
  },
    // 按区域code 搜索
  locationSearch() {
      const level = this.calcLevel(this.instance.getZoom());//当前缩放的位置应该的城市级别
      this.currentLevel = level;
      if (this.currentLevel > 4) {
        this.overlays=[];
        this.points=[];
        this.$nextTick(()=>{
          this.points=this.initPoints;
        })
      } else {
        getCircle({"type":this.type,"codeLevel":this.currentLevel}).then(data => {
          this.points = [];//让街道的数据为空
          if (data.status) {
            this.createOverlay(data.data.location, data.data.count);//经纬度和数量
          }
        });
      }
    },
    initCenter(point, zoom) {
      const BMap = this.BMap;
      const map = this.instance;
      const p = new BMap.Point(point.lng, point.lat);//根据经纬度创建点坐标
      map.centerAndZoom(p, zoom);// 初始化地图，设置中心点坐标和地图级别
    },
    load({ type, target, pixel, point, zoom }) {//加载时的方法，每次加载。吧之前的清零
      this.locationSearch();
    },
    zoomend(type, target) {//每次收缩地图的时候调用
      if (this.map.zoom > 0) {
        this.locationSearch();
      }
      this.map.zoom = this.instance.getZoom();//每次缩放把最当前的缩放倍数赋值给zoom
    },
    calcLevel(zoom) {//根据传进来的缩放倍数来确定当前什么级别，然后return出去
      let codeLevel = 0;
      if (zoom > 14) {
        codeLevel = 5;
      } else if (zoom > 11 && zoom <= 14) {
        codeLevel = 4;
      } else if (zoom <= 11) {
        //11 只显示区
        codeLevel = 3;
      }
      return codeLevel;
    },
    handler({ BMap, map }) {//完成一次组件卸载 / 重新加载的时候把实例重新赋值
      this.BMap = BMap;
      this.instance = map;
      map.enableScrollWheelZoom();//开启鼠标滚轮缩放
      // 解决初始化百度解析不了文字，然后地图初始化空白
      const p = new BMap.Point(this.$store.getters.mapCenter.lng,this.$store.getters.mapCenter.lat);
      map.centerAndZoom(p, this.zoomComputed);
    }
  },
  computed: {
    centerComputed() {
      this.currentLevel = this.$store.getters.mapCenter.level;
    //   let obj={lng: this.$store.getters.mapCenter.lng, lat: this.$store.getters.mapCenter.lat}
      return this.$store.getters.mapCenter.center;
    },
    zoomComputed() {
      return this.$store.getters.mapCenter.zoom;
    }
  },
  components: {
    BaiduMap, BmView,BmPointCollection,info,AreaOverlay
  }
};
</script>

<style scoped lang='scss'>
.bm-view {
  width: 100%;
  height: 100%;
  overflow: hidden;
  // width: calc(100% - 40px);
  // height:  calc(100% - 40px);
  // left: 20px;
  // top: 20px;
  background: #000;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.title{
        width:400px;
        height:30px;
        font-size:30px;
        color:#0DB5EF;
        text-align: center;
        top: 28px;
        left: calc((100% - 400px) / 2);
        z-index: 5;
}
.btn{
    width:270px;
    height:170px;
    box-shadow:2px 2px 5px #0DB5EF;
    right: 40px;
    bottom: 50px;
    z-index: 5;
    border-radius: 2px;
    box-shadow: #2AA3D1 0px 0px 15px 3px;
    background: #223D5C url("~@/assets/img/bigData/subjectData/mapbtn.png") no-repeat center;
    background-size: 166px 133px;
}
.topBtn{
      width: 550px;
      height: 40px;
      z-index: 9;
      top: 30px;
      right: 0;
      position: absolute;
      .typeBtn {
        min-width: 80px;
        max-width: 100px;
        height: 40px;
        background: #223D5C;
        border-radius: 2px;
        border: none;
        color: #eee;
        font-size: 12px;
        margin-right: 20px;
      }
      .typeBtn:last-child {
        margin-right: 0;
      }
      .current {
        background: linear-gradient(to right, #0DB5EF, #0775BA);
      }
}
</style>

<style lang="sass">
.bm-overlay {
  position: absolute;
}
</style>

