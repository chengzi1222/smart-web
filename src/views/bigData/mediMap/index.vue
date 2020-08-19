<template>
  <baidu-map class="bm-view" :theme='arr' :ak="baiduMapAk" @moveend="zoomend" :center="centerComputed" :zoom="zoomComputed" :min-zoom="zoomComputed-2" :map-click="false" :max-zoom="map.maxZoom" :scroll-wheel-zoom="map.scrollWheelZoom" @load="load" @zoomend="zoomend" @ready="handler">
    <reception-point  v-for="item in receptionList" @messFUn='messFUn_1' @closeNew='closeNew_' :new-recep='newRecep' :key="item.id" :taskId='userConfig.taskId' :active-id="activeId" @actived="entityActived" :point="item"></reception-point>
    <supervisor-point v-for="item in supervisorList"  @closeNew='closeNew_' :new-box='newBox' :key="item.id" :taskId='userConfig.taskId' :active-id="activeId_supervisor" @actived="actived_supervisor" :point="item"></supervisor-point>
    <!-- <el-button >配置</el-button> -->
    <!-- @click="configPop" -->
    <config-pop :isShow='popConfigShow' @closePop='closePop_' @succeed='succeedPop'></config-pop>
    <ul class="nonmatched">
      <li class="box" v-for="(item,index) in noNewBox">
        <a href="javascript:;" class="close movePoin"  @click="noDataClose('box',index)">x</a>
        <p class="title">最新盒饭检查</p>
        <p :title="item.supplier" class="textell">供应商 ：{{item.supplier}}</p>
        <p :title="item.carNum"  class="textell">车牌号 ：{{item.carNum}}</p>
        <p :title="item.supervisor"  class="textell">检查人员：{{item.supervisor}}</p>
        <p>处理方式：<span class="succeed" :class="{'no': item.processMode=='拒收'}">{{ item.processMode }}</span></p>
        <p class="popBtn clear_a">
              <a href="javascript:;" class="movePoin btnLeft" @click="noDataClose('box',index)">关闭</a>
              <a href="javascript:;" class="movePoin"  @click="goInfo(item.examId,'box')">查看详情</a>
        </p>
      </li>
      <li class="xianc" v-for="(item,index) in noNewRecep">
        <a href="javascript:;" class="close movePoin" @click="noDataClose('xianc',index)">x</a>
        <p  class="title">最新现场检查</p>
        <p :title="item.entityName"  class="textell">接待单位：{{ item.entityName }}</p>
        <p :title="item.realName"  class="textell">检查人员：{{ item.realName }}</p>
        <p>处理方式：<span class="succeed" :class="{'no': item.treat=='责令整改'}">{{ item.treat }}</span></p>
        <p class="popBtn clear_a">
              <a href="javascript:;" class="movePoin btnLeft" @click="noDataClose('xianc',index)">关闭</a>
              <a href="javascript:;" class="movePoin" @click="goInfo(item.examId,'xianc')">查看详情</a>
        </p>
      </li>
    </ul>
    <bm-view style="width: 100%; height:100%; flex: 1"></bm-view>
  </baidu-map>
</template>

<script>
import { BaiduMap, BmView } from "vue-baidu-map";
import config from "utils/config";
import * as mapApi from "api/sub/map";
import * as api from "api/bigData/map";
import receptionPoint from "./mapCom/receptionPoint";
import supervisorPoint from "./mapCom/supervisorPoint";
import configPop from "./mapCom/config";


export default {
  props:{
    id:{
      type: String,
      default: ""
    },
    popActive:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      arr:[
          {
                    "featureType": "background",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#222222ff"
                    }
          },
          {
                    "featureType": "land",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#232323ff",
                              "lightness": -20
                    }
          },
          {
                    "featureType": "water",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#2c353cff"
                    }
          },
          {
                    "featureType": "highway",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "lightness": -40,
                              "saturation": -90
                    }
          },
          {
                    "featureType": "arterial",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#888888ff"
                    }
          },
          {
                    "featureType": "arterial",
                    "elementType": "geometry.stroke",
                    "stylers": {
                              "color": "#888888ff",
                              "weight": "0.1"
                    }
          },
          {
                    "featureType": "subway",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#54a6bcff",
                              "weight": "1.5",
                              "lightness": -50
                    }
          },
          {
                    "featureType": "local",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#888888ff",
                              "lightness": -72,
                              "saturation": -90
                    }
          },
          {
                    "featureType": "railway",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#444444ff",
                              "visibility": "off"
                    }
          },
          {
                    "featureType": "all",
                    "elementType": "labels",
                    "stylers": {
                              "color": "#00000000"
                    }
          },
          {
                    "featureType": "highway",
                    "elementType": "labels.text.fill",
                    "stylers": {
                              "color": "#bbbbbbff"
                    }
          },
          {
                    "featureType": "arterial",
                    "elementType": "labels.text.fill",
                    "stylers": {
                              "color": "#999999ff"
                    }
          },
          {
                    "featureType": "local",
                    "elementType": "labels.text.fill",
                    "stylers": {
                              "color": "#999999ff"
                    }
          },
          {
                    "featureType": "subway",
                    "elementType": "labels.text.fill",
                    "stylers": {
                              "color": "#aaaaaaff"
                    }
          },
          {
                    "featureType": "educationlabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                              "color": "#aaaaaaff"
                    }
          },
          {
                    "featureType": "airportlabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                              "color": "#aaaaaaff"
                    }
          },
          {
                    "featureType": "district",
                    "elementType": "labels.text.fill",
                    "stylers": {
                              "color": "#999999ff"
                    }
          },
          {
                    "featureType": "highway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                              "weight": "0.5",
                              "lightness": -40,
                              "saturation": -90
                    }
          },
          {
                    "featureType": "scenicspotslabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                              "color": "#aaaaaaff"
                    }
          },
          {
                    "featureType": "subway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                              "color": "#333333ff",
                              "weight": "1"
                    }
          },
          {
                    "featureType": "railway",
                    "elementType": "labels.text.fill",
                    "stylers": {
                              "color": "#999999ff"
                    }
          },
          {
                    "featureType": "medicallabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                              "color": "#999999ff"
                    }
          },
          {
                    "featureType": "local",
                    "elementType": "geometry.stroke",
                    "stylers": {
                              "color": "#999999ff"
                    }
          },
          {
                    "featureType": "district",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                              "color": "#333333ff"
                    }
          },
          {
                    "featureType": "building",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#343434ff"
                    }
          },
          {
                    "featureType": "local",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                              "color": "#333333ff"
                    }
          },
          {
                    "featureType": "arterial",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                              "color": "#333333ff"
                    }
          },
          {
                    "featureType": "subway",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                              "color": "#444444ff"
                    }
          }
      ],
      baiduMapAk: config.baiduMapAk,//百度钥匙
      BMap: null,       // 百度地图
      instance: null,   // 地图实例
      activeId: "",//接待商点击id
      activeId_supervisor:"",//监管人员点击id
      map: {
        zoom: 0,
        maxZoom: 19,
        minZoom: 8, //最小放大解绑
        center: "中国"
      },
      currentLevel: 0,  //级别 参照AreaLevel 的 codeLevel
      userConfig:{
        taskId:'d7480c6ed0ea4c45b9ff89f7b5fe515f',
        lat:null,
        lng:null,
        range:null
      },
      supervisorList:[],//监管人员
      receptionList:[],//接待商
      popConfigShow:false,//弹框显示
      willDestroy:false,//定时器清除
      newBox:[],//最新的盒饭检查
      newRecep:[],//最新的现场检查检查
      noNewBox:[],
      noNewRecep:[],
    };
  },
  mounted() {
    if (!document.createElement('canvas').getContext) {
      this.$message({ type: 'warning', message: '使用chrome、safari、IE9+以上浏览器才能正常访问此页面' });
    };
     this.userConfig.taskId = this.id
  },
  beforeDestroy(){
    this.willDestroy=true;
  },
  methods: {
    messFUn_1(num){
      this.$emit('messFUn',num)
    },
    show1() {
       let obj={
         type:'xianc',
         id:this.newCheck.id
       }
       this.$emit('closeNew',obj);
    },
    noDataClose(type,index){
      if(type=='box'){
        this.noNewBox.splice(index,1);
      }else{
        this.noNewRecep.splice(index,1);
      }
    },
    closeNew_(obj){
      if(obj.type=='box'){
        for(let i=0;i<this.newBox.length;i++){
            if(this.newBox[i].id == obj.id){
              this.newBox.splice(i,1);
              return;
            }
        };
      }else{
        for(let i=0;i<this.newRecep.length;i++){
            if(this.newRecep[i].id == obj.id){
              this.newRecep.splice(i,1);
              return;
            }
        };
      }
    },
    goInfo(id,type){
      if(type=='box'){
        this.$router.push({name: 'boxLunch.info', query: {'examineId': id}})
      }else{
        this.$router.push({ name: "record.everydayDetail", query:{id: id} });
      }
    },
    clear_data(t){
      let time=setTimeout(()=>{
        if (this.willDestroy){clearTimeout(time);return;} 
          this.newBox=[];
          this.noNewBox=[];
          this.newRecep=[];
          this.noNewRecep=[];
      },t);
    },
    async setInterval_(t){//t以分钟计数
      let time=setInterval(()=>{
        if (this.willDestroy){clearInterval(time);return;}
          this.newBox=[];
          this.noNewBox=[];
          this.newRecep=[];
          this.noNewRecep=[];
          this.setInterval_load();
          this.$emit('open_setInterval');//统一定时器
      },t*60000);
    },
    async setInterval_load(){
      api.getLocation(this.userConfig).then(r=>{
        this.receptionList=r.data[0];
        this.supervisorList=r.data[1];
        this.NewBoxRecord();
      });
    },
    async NewBoxRecord(){
      api.getNewBoxRecord({taskId:this.userConfig.taskId}).then(r=>{
        if(r.status){
          let b=[]
          r.data.forEach(el => {
            b.splice(0,0,el);
          });
          this.newBox=b;
          let c=[];
          for(let i=0;i<this.newBox.length;i++){
            let f=true;
            for(let v=0;v<this.supervisorList.length;v++){
                if(this.newBox[i].id != this.supervisorList[v].id){
                  f=false;
                }else{
                  f=true;
                  break;
                }
            };
            if(this.supervisorList.length==0){c.splice(0,0,this.newRecep[i]);}
            if(!f){
                  c.splice(0,0,this.newBox[i]);
              }
          }
           this.noNewBox=c;
        }
      });
      api.getNewSceneRecode({taskId:this.userConfig.taskId}).then(r=>{
         if(r.status){
          let b=[]
          r.data.forEach(el => {
            b.splice(0,0,el);
          });
          this.newRecep=b;
          let c=[];
          for(let i=0;i<this.newRecep.length;i++){
            let f=true;
            for(let v=0;v<this.receptionList.length;v++){
                if(this.newRecep[i].id != this.receptionList[v].id){
                  f=false;
                }else{
                  f=true;
                  break;
                }
            }
            if(this.receptionList.length==0){c.splice(0,0,this.newRecep[i]);}
            if(!f){
                  c.splice(0,0,this.newRecep[i]);
            }
          }
          this.noNewRecep=c;
        }
      });
      this.$nextTick(()=>{
          this.clear_data(50000);
      });
    },
    succeedPop(obj){
      console.log(obj);
      this.popConfigShow=false;
      this.userConfig.lat=obj.lat;
      this.userConfig.lng=obj.lng;
      this.userConfig.range=obj.range;
      this.load();
    },
    closePop_(){
      this.popConfigShow=false;
      this.$emit('popIsShow_map')
    },
    async load() {//加载时的方法，每次加载。吧之前的清零{ type, target, pixel, point, zoom }
      this.receptionList=[];
      this.supervisorList=[];
      api.getLocation(this.userConfig).then(r=>{
        this.receptionList=r.data[0];
        this.supervisorList=r.data[1];
        this.$nextTick(()=>{
          if(this.userConfig.lat && this.userConfig.lng){
             this.initCenter(this.userConfig, 16);//收缩地图zoom基数位置
          }else if(this.receptionList || this.supervisorList){
            let b=this.receptionList || this.supervisorList
            this.initCenter( b[0],16);//收缩地图zoom基数位置
          }
        })
      });
    },
    zoomend(type, target) {//每次收缩地图的时候调用
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
      
      this.userConfig.taskId = this.id
      api.getLocation(this.userConfig).then(r=>{
          this.receptionList=r.data[0];
          this.supervisorList=r.data[1];
          this.setInterval_(0.5);
      });
    },
    initCenter(point, zoom) {
      const BMap = this.BMap;
      const map = this.instance;
      // if(point.lng && point.lat){
        const p = new BMap.Point(point.lng, point.lat);//根据经纬度创建点坐标
        map.centerAndZoom(p, zoom);// 初始化地图，设置中心点坐标和地图级别
      // }
    },
     entityActived(id) {//传出点击的id
      this.activeId = id;
    },
    actived_supervisor(id){//监管人员传出点击的id
      this.activeId_supervisor = id;
    }
  },
  computed: {
    centerComputed() {
      this.currentLevel = this.$store.getters.mapCenter.level;
      return this.$store.getters.mapCenter.center;
    },
    zoomComputed() {
      return this.$store.getters.mapCenter.zoom;
    }
  },
  components: {
    BaiduMap, BmView,receptionPoint,supervisorPoint,configPop
  },
  watch:{
    popActive(val) {
      this.popActive=val;
      if(this.popActive){
        this.popConfigShow = true;
      }
    },
  }
};
</script>

<style scoped lang='scss'>
.bm-view {
  width: 100%;
  height: 100%;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.nonmatched{
  min-width:248px;
  max-width: 520px;
  max-height: 100%;
  min-height: 1px;
  position: fixed;
  left: 10%;
  top: 6.2vw;
  z-index:999;
  li{
    padding: 20px;
    width: 208px;
    min-height: 202px;
    max-height: 236px;
    background:url('../../../assets/img/bigData/bg2.png') no-repeat !important;
    background-size: 100% 100%;
    margin-right: 15px;
    position: relative;
    >.close{
      color: #fff;
      font-size: 22px;
      width: 16px;
      height: 16px;
      position: absolute;
      top: 20px;
      right: 30px;
      text-align: center;
      line-height: 16px
    }
    >p{
      font-size:14px;
      line-height: 28px;
      color: #fff;
      .succeed{
        color: #5CB680 !important;
      }
      .no{
        color:#EAA330 !important;
      }
    }
    .title{
      color:rgba(55,199,251,1);
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
  }
  .box{
    height: 205px;
  }
  .xianc{
    height: 202px;
  }
}
</style>

<style lang="sass">
.bm-overlay {
  position: absolute;
}
</style>