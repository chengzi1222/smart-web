<template>
  <baidu-map class="bm-view" :ak="baiduMapAk" @moveend="zoomend" :center="centerComputed" :zoom="zoomComputed" :min-zoom="zoomComputed-2" :map-click="false" :max-zoom="map.maxZoom" :scroll-wheel-zoom="map.scrollWheelZoom" @load="load" @zoomend="zoomend" @ready="handler">
    <charts-box :index='$route.query.index*1'></charts-box>
    <search-box @show="searchShow"></search-box>
    <!-- 区和街道 -->
    <area-overlay v-for="item in overlays" :key="item.areaCode" :area-name="item.areaName" :num="item.num" :lng="item.lng" :lat="item.lat"></area-overlay>
    <!-- 主体详情 -->
    <!-- <entity-point  :isShow="isShowPonitInfo" :point="activeObj"></entity-point> -->
    <info :entityObj='activeObj' :isShow='isShowPonitInfo'></info>
    <!-- 主体海量点 -->
    <bm-point-collection  :points="points" shape="BMAP_POINT_SHAPE_CIRCLE" color="rgba(13,181,239,0.7)" size="BMAP_POINT_SIZE_BIGGER" @click="clickHandler"></bm-point-collection>
    <bm-view style="width: 100%; height:100%; flex: 1"></bm-view>
  </baidu-map>
</template>

<script>
import { BaiduMap, BmView ,BmPointCollection  } from "vue-baidu-map";
import config from "../../utils/config";
import EntityInfoOverlay from './map/EntityInfoOverlay';
import EntityPoint from './map/EntityPoint';
import AreaOverlay from './map/AreaOverlay';
import * as mapApi from "../../api/sub/map";
import ChartsBox from "./map/ChartsBox";
import SearchBox from './map/SearchBox';
import info from './map/info'

export default {
  data() {
    return {
      baiduMapAk: config.baiduMapAk,//百度钥匙
      BMap: null,       // 百度地图
      instance: null,   // 地图实例
      overlays: [],  //区和街道的数据盒子
      points: [],//主体的数据盒子
      activeId: "",
      activePoint: null,
      map: {
        zoom: 0,
        maxZoom: 19,
        minZoom: 8, //最小放大解绑
        center: "中国"
      },
      currentLevel: 0,  //级别 参照AreaLevel 的 codeLevel
      cache:[],//缓存级别为5的街道数据
      isShowPonitInfo:false,
      activeObj:{}
    };
  },
  mounted() {
    window.onload = function () {
      resolve(this.BMap)
    }
    if (!document.createElement('canvas').getContext) {
      this.message({ type: 'warning', message: '使用chrome、safari、IE9+以上浏览器才能正常访问此页面' });
    };
    mapApi.mapPoint(null, {}).then(data => {
      if (data.status) {
        this.cache = data.data;
      }
    });
  },
  methods: {
   clickHandler(e){
      if(this.activeObj.id!=e.point.id){
         this.isShowPonitInfo=false;
         this.isShowPonitInfo=true;
      }else{
        this.isShowPonitInfo=!this.isShowPonitInfo;
      }
      this.activeObj={};
      this.activeObj=e.point;
      console.log(this.isShowPonitInfo,this.activeObj)
   },
    moveendFUN(){//计算可视范围的数据
      let cp = this.instance.getBounds(); // 返回map可视区域，以地理坐标表示
      let sw = cp.getSouthWest(); // 返回矩形区域的西南角
      let ne = cp.getNorthEast(); // 返回矩形区域的东北角

      let zoom = this.instance.getZoom();
      // if (zoom < defaultShowLampZoom) {
      //     // 放大级数小于17后，清除所有覆盖物，但百度覆盖物不能删除
      //     // 以后做成清除非网关控制器 TODO
      //     var markers = getCurrentMarkers();
      //     for (var i=0; i<markers.length; i++) {
      //         map.removeOverlay(markers[i]);
      //     }
      //     return;
      // }
      //如果放大到17级别，则取屏幕范围内的标注
      let param = {
          swlng : sw.lng,
          swlat : sw.lat,
          nelng : ne.lng,
          nelat : ne.lat
      };
      console.log(param);
      let list=[];
      this.cache.forEach(element => {
        if (element.lat>param.swlat && element.lat<param.nelat && element.lng>param.swlng && element.lng<param.nelng && element.precise=="1") {
           list.push(element);
        };
      });
      this.points=[];
      this.$nextTick(()=>{
          this.points = list;
      });
      console.log(this.points)
    },
    createOverlay(data, count) {//生成区和街道覆盖层
      const $this = this;
      const map = this.instance;
      const overlays = [];//每次清零自己的数据盒子
      data.forEach(element => {
        if (element.lat && element.lng && count[element.areaCode]) {
          element.num = count[element.areaCode];
          overlays.push(element);
        }
      });
      this.overlays = overlays;
    },
    searchShow(point) {//条件筛选》》然后传递点击主体的id和经纬度出来 定位
      // this.activeId = point.id;//赋值详情覆盖层的id
      this.activeObj={};
      this.isShowPonitInfo=false;
      this.isShowPonitInfo=true;
      this.activeObj=point;
      this.initCenter(point, 15);//15是主体的缩放程度
    },
    entityActived(id) {//传出点击的id
      this.activeId = id;
    },
    // 按区域code 搜索
    locationSearch(dataCode) {
      const level = this.calcLevel(this.instance.getZoom());//当前缩放的位置应该的城市级别
      this.currentLevel = level;
      if (this.currentLevel > 4) {
          // mapApi.mapPoint(dataCode, {}).then(data => {
            this.overlays = []
          //   if (data.status) {
          //     this.points = data.data;
          //   }
          // });
          this.points =this.cache;
      } else {
        mapApi.mapCircle(level, dataCode).then(data => {
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
      this.locationSearch(null, {});
    },
    zoomend(type, target) {//每次收缩地图的时候调用
      if (this.map.zoom > 0) {
        this.locationSearch(null, {});
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
      // let obj={lng: this.$store.getters.mapCenter.lng, lat: this.$store.getters.mapCenter.lat}
      return this.$store.getters.mapCenter.center;
    },
    zoomComputed() {
      return this.$store.getters.mapCenter.zoom;
    }
  },
  components: {
    BaiduMap, BmView, ChartsBox, SearchBox, EntityInfoOverlay,
    AreaOverlay, EntityPoint,BmPointCollection,info
  }
};
</script>

<style scoped lang="sass">
.bm-view {
  width: 100%;
  height: 100%;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>

<style lang="sass">
.bm-overlay {
  position: absolute;
}
</style>

