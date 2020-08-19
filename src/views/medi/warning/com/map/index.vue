<template>
  <div class="map">
    <baidu-map class="bm-view" :ak="baiduMapAk" :center="centerComputed" :zoom="zoomComputed" :min-zoom="zoomComputed-2" :map-click="false"
      :max-zoom="map.maxZoom" :scroll-wheel-zoom="map.scrollWheelZoom" @load="load" @zoomend="zoomend" @ready="handler">
      <!-- 点击出现的主体详情覆盖层和小图标 -->
      <entity-point v-for="item in points" :taskId="taskId" :state="item.state" :key="item.id" :active-id="activeId" @actived="entityActived"
        :point="item"></entity-point>
      <area-overlay v-for="item in overlays" :key="item.areaCode" :area-name="item.areaName" :num="item.num" :lng="item.lng" :lat="item.lat"></area-overlay>

      <!--饼图-->
      <charts-box :taskId="taskId"></charts-box>

      <!-- 条件筛选》》然后传递点击主体的id和经纬度出来 -->
      <search-box @show="searchShow" @reloadmap="reloadmap" :taskId="taskId"></search-box>

      <bm-view style="width: 100%; height:100%; flex: 1"></bm-view>
      <!--没有业务作用 -->
    </baidu-map>
  </div>
</template>

<script>
  import { BaiduMap, BmView } from "vue-baidu-map";
  import config from "src/utils/config";
  import * as mapApi from "api/warning/map";
  import EntityPoint from './EntityPoint';
  import AreaOverlay from './AreaOverlay';
  import ChartsBox from "./ChartsBox";
  import SearchBox from './SearchBox';


  export default {
    props: {
      taskId: {
        type: String,
      }
    },
    data() {
      return {
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
        searchMap: {
          keysWord: '',
          state: '',
          areaCode: '',
          enterpriseForm: ''
        },
        activeId: "",
        activePoint: null,
        map: {
          zoom: 0,
          maxZoom: 19,
          minZoom: 8, //最小放大解绑
          center: "中国"
        },
        currentLevel: 0  //级别 参照AreaLevel 的 codeLevel
      };
    },
    mounted() {
      if (!document.createElement('canvas').getContext) {
        this.$message({ type: 'warning', message: '使用chrome、safari、IE9+以上浏览器才能正常访问此页面' });
      }
    },
    methods: {
      //生成区和街道覆盖层
      createOverlay(data, count) {
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
        this.initCenter(point, 14);//14是主体的缩放程度
      },
      entityActived(id) {//传出点击的id
        this.activeId = id;
      },
      reloadmap(map) {
        this.searchMap = map.searchMap;
        if (map.searchMap.areaCode != '') {
          mapApi.getByAreaCode(map.searchMap.areaCode).then((r) => {
            console.log(r)
            this.initCenter(r.data, 14);
          });
        }
        this.locationSearch(null, {});
      },
      // 按区域code 搜索
      locationSearch(dataCode) {
        if (this.instance === null) {
          return
        }
        const level = this.calcLevel(this.instance.getZoom());//当前缩放的位置应该的城市级别
        this.currentLevel = level;
        if (this.currentLevel > 4) {
          //级别》4的时候，显示小图标、、数字越大城市级别越小
          //这个时候返回的所有主体的经纬度，
          mapApi.mapPoint(dataCode, this.taskId, this.searchMap).then(data => {
            this.overlays = []//让区和街道的数据为空
            this.points = []
            if (data.status) {
              this.$nextTick(() => {
                this.points = data.data;
              });
            }
          });
        } else {
          mapApi.mapCircle(level, this.taskId, dataCode, this.searchMap).then(data => {
            this.points = [];//让街道的数据为空
            this.overlays = []//让区和街道的数据为空
            if (data.status) {
              this.$nextTick(() => {
                this.createOverlay(data.data.location, data.data.count);//经纬度和数量
              });
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
        if (zoom > 13) {
          codeLevel = 5;
        } else if (zoom > 11 && zoom <= 13) {
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
      centerComputed() {//随时监测自己账号的地区级别和地区
        this.currentLevel = this.$store.getters.mapCenter.level;
        return this.$store.getters.mapCenter.center;
      },
      zoomComputed() {//随时监测当前地区所在的缩放倍数
        return this.$store.getters.mapCenter.zoom;
      }
    },
    components: {
      BaiduMap, BmView, ChartsBox, SearchBox, AreaOverlay, EntityPoint
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

  .map {
    height: 100%;
  }
</style>