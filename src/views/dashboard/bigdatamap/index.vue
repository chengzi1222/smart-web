<template>
  <baidu-map class="bm-view" :theme='arr' :ak="baiduMapAk" @moveend="zoomend" :center="centerComputed" :zoom="zoomComputed" :min-zoom="zoomComputed-2" :map-click="false" :max-zoom="map.maxZoom" :scroll-wheel-zoom="map.scrollWheelZoom" @load="load" @zoomend="zoomend" @ready="handler">
    <entity-info-overlay :position="entityInfo.position" :active="entityInfo.active" :info="entityInfo.data" @mouseover.native="active = true" @mouseleave.native="active = false">
    </entity-info-overlay>

    <charts-box></charts-box>
    <search-box @show="searchShow"></search-box>

    <area-overlay v-for="item in overlays" :key="item.areaCode" :area-name="item.areaName" :num="item.num" :lng="item.lng" :lat="item.lat"></area-overlay>
    <div v-if='is'>
      <entity-point  v-for="item in points" :key="item.id" :active-id="activeId" @actived="entityActived" :point="item"></entity-point>
    </div>
    <bm-view style="width: 100%; height:100%; flex: 1"></bm-view>
  </baidu-map>
</template>

<script>
import { BaiduMap, BmView } from "vue-baidu-map";
import config from "utils/config";
import EntityInfoOverlay from './map/EntityInfoOverlay';
import EntityPoint from './map/EntityPoint';
import AreaOverlay from './map/AreaOverlay';
import * as mapApi from "api/sub/map";
import ChartsBox from "./map/ChartsBox";
import SearchBox from './map/SearchBox';

export default {
  data() {
    return {
      arr:[
          {
                    "featureType": "land",
                    "elementType": "all",
                    "stylers": {
                              "color": "#0b1217ff"
                    }
          },
          {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": {
                              "color": "#3b75a4ff"
                    }
          },
          {
                    "featureType": "green",
                    "elementType": "all",
                    "stylers": {
                              "color": "#1f3c53ff"
                    }
          },
          {
                    "featureType": "manmade",
                    "elementType": "all",
                    "stylers": {
                              "color": "#0d1321ff"
                    }
          },
          {
                    "featureType": "building",
                    "elementType": "all",
                    "stylers": {
                              "color": "#131e27ff"
                    }
          },
          {
                    "featureType": "highway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                              "color": "#2b74b4ff"
                    }
          },
          {
                    "featureType": "highway",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#15293aff"
                    }
          },
          {
                    "featureType": "arterial",
                    "elementType": "all",
                    "stylers": {
                              "color": "#142533ff"
                    }
          },
          {
                    "featureType": "arterial",
                    "elementType": "geometry.stroke",
                    "stylers": {
                              "color": "#203d57ff"
                    }
          },
          {
                    "featureType": "local",
                    "elementType": "all",
                    "stylers": {
                              "color": "#2e3c48ff"
                    }
          },
          {
                    "featureType": "railway",
                    "elementType": "all",
                    "stylers": {
                              "color": "#636363ff"
                    }
          },
          {
                    "featureType": "subway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                              "color": "#2d98bdff"
                    }
          },
          {
                    "featureType": "poilabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                              "color": "#6b9cdfff"
                    }
          },
          {
                    "featureType": "poilabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                              "color": "#080c11ff"
                    }
          },
          {
                    "featureType": "boundary",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#467ecbff"
                    }
          },
          {
                    "featureType": "boundary",
                    "elementType": "geometry.stroke",
                    "stylers": {
                              "color": "#7aa7e4ff"
                    }
          },
          {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": {
                              "color": "#6b9cdfff"
                    }
          },
          {
                    "featureType": "road",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                              "color": "#080c11ff"
                    }
          },
          {
                    "featureType": "manmade",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                              "color": "#080c11ff"
                    }
          },
          {
                    "featureType": "manmade",
                    "elementType": "labels.text.fill",
                    "stylers": {
                              "color": "#6b9cdfff"
                    }
          },
          {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": {
                              "color": "#6b9cdfff"
                    }
          },
          {
                    "featureType": "administrative",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                              "color": "#080c11ff"
                    }
          },
          {
                    "featureType": "subway",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#176391ff"
                    }
          }
],
      baiduMapAk: config.baiduMapAk,//百度钥匙
      BMap: null,       // 百度地图
      instance: null,   // 地图实例
      overlays: [],  //区和街道的数据盒子
      points: [],//主体的数据盒子
      entityInfo: {
        active: false,
        position: {},
        data: {},
      },
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
      is:false,
    };
  },
  mounted() {
    if (!document.createElement('canvas').getContext) {
      this.$message({ type: 'warning', message: '使用chrome、safari、IE9+以上浏览器才能正常访问此页面' });
    };
    mapApi.mapPoint(null, {}).then(data => {
      if (data.status) {
        this.cache = data.data;
      }
    });
  },
  methods: {
    moveendFUN(){//计算可视范围的数据
      let cp = this.instance.getBounds(); // 返回map可视区域，以地理坐标表示  
      let sw = cp.getSouthWest(); // 返回矩形区域的西南角  
      let ne = cp.getNorthEast(); // 返回矩形区域的东北角  
    
      let zoom = this.instance.getZoom(); 
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
      this.is=false;
      this.points=[];
      this.$nextTick(()=>{
        if(this.is===false){
          this.points = list;
          this.is=true;
        }
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
      this.activeId = point.id;//赋值详情覆盖层的id
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
          this.is=true;
          this.points = [];
          this.moveendFUN();
      } else {
        this.is=false;
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
    BaiduMap, BmView, ChartsBox, SearchBox, EntityInfoOverlay,
    AreaOverlay, EntityPoint
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

