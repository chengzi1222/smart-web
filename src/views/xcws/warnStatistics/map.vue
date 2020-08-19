<template>
    <baidu-map id="map" :mapStyle='arr' :ak="baiduMapAk" :center="centerComputed"
               :zoom="zoomComputed" :min-zoom="zoomComputed-2" @moveend="zoomend"  :map-click="false" :max-zoom="map.maxZoom"
               :scroll-wheel-zoom="map.scrollWheelZoom" @ready="handler" @load="load" @zoomend="zoomend"
               @dragend="dragend"
    >
        <ul class="operate absolute clear_a">
            <li :disabled="btn" @click="select('high')"><span  class="circle" :class="{ 'redC':highSelect === true}"
            ></span><span>高风险</span></li>
            <li :disabled="btn" @click="select('middle')"><span class="circle" :class="{'yellowC':middleSelect === true}"
            ></span><span>中风险</span></li>
            <li  :disabled="btn" @click="select('low')"><span class="circle" :class="{ 'blueC': lowSelect === true}"
            ></span><span>低风险</span></li>
            <li :disabled="btn" @click="select('not')"><span class="circle" :class="{'greenC':not === true}"
            ></span><span>暂无风险</span></li>
        </ul>
        <select-point v-for="item in points" :key="item.entityId" :zoom="zoomNum" :active-item="activeItem"
                      @actived="entityActived(item)"
                      @close="closePoint"
                      :point="item"></select-point>
        <bm-view style="width: 100%; height:100%; flex: 1"></bm-view>
    </baidu-map>

</template>

<script>
    import {BaiduMap, BmView, BmOverlay} from "vue-baidu-map";
    import SelectPoint from './SelectPoint'
    import config from "utils/config";
    import * as mapApi from "api/sub/map";
    import * as map from 'api/xcws/warnStatistics/map'
    import {getTheme} from "@/views/xcws/warnStatistics/getTheme";

    export default {
        components: {
            BaiduMap, BmView, SelectPoint
        },
        data() {
            return {
                active: true,
                zoom: 15,
                highSelect: true,
                middleSelect: true,
                lowSelect: true,
                not: true,
                is: false,
                arr: getTheme(),
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
                queryLimit: {
                    lat: '',
                    lng: '',
                    maxDistance: "5000",
                    riskRateList: "01,02,03,04",
                    size: 100
                },
                activeItem: {},
                activePoint: null,
                map: {
                    zoom: 0,
                    maxZoom: 20,
                    minZoom: 14, //最小放大解绑
                    center: "中国"
                },
                currentLevel: 0,  //级别 参照AreaLevel 的 codeLevel
                riskRateArr: ["01", "02", "03", "04"],
                zoomNum:14,
                isEmpty:false,
                btn:false
            }
        },

        async mounted() {
            if (!document.createElement('canvas').getContext) {
                this.$message({type: 'warning', message: '使用chrome、safari、IE9+以上浏览器才能正常访问此页面'});
            }
            await this.getCenter()
            this.getData()
        },
        methods: {
            async handler({BMap, map}) {//完成一次组件卸载 / 重新加载的时候把实例重新赋值
                this.BMap = BMap;
                this.instance = map;
                map.enableScrollWheelZoom();//开启鼠标滚轮缩放

                // 解决初始化百度解析不了文字，然后地图初始化空白
                // await this.getCenter()
                const p = new BMap.Point(this.$store.getters.mapCenter.lng,this.$store.getters.mapCenter.lat);
                map.centerAndZoom(p, this.zoomComputed);
            },
            entityActived(item) {//传出点击的item
                this.activeItem = item;
            },
            closePoint(item){
                this.activeItem = item;
            },
            async  comfirmType(code) {
                this.points = []
                if (this.riskRateArr.includes(code)) {
                    this.riskRateArr.map((item, i) => {
                        if (item == code) {
                            this.riskRateArr.splice(i, 1)
                        }
                    })

                } else {
                    this.riskRateArr.push(code)
                }
                if(this.riskRateArr.length <=1){

                }
                this.queryLimit.riskRateList = this.riskRateArr.join(',');
                const m = this.$message({
                    duration:0,
                    message: '数据加载中, 加载完成前请不要再次点击',
                    type: 'warning'
                });
                map.getMapList(this.queryLimit).then(d => {
                    if (d.status) {
                        this.cache = d.data;
                        this.points = d.data;
                    }
                    m.close()
                });
            },
            select(type) {
                if(type == 'high'){
                        this.highSelect = !this.highSelect;
                        this.comfirmType('04');
                }else if(type == 'middle'){
                        this.middleSelect = !this.middleSelect;
                        this.comfirmType('03');
                }else if(type == 'low'){
                        this.lowSelect = !this.lowSelect;
                        this.comfirmType('02');
                }else if(type == 'not'){
                        this.not = !this.not;
                        this.comfirmType('01');
                }
            },
            async getCenter() {
                let data = await mapApi.mapCenter()
                this.queryLimit.lat = data.data.lat;
                this.queryLimit.lng = data.data.lng;
            },
            async getData() {
                map.getMapList(this.queryLimit).then(d => {
                    if (d.status) {
                        this.cache = d.data;
                        this.points = d.data;
                    }
                });
            },

            load({type, target, pixel, point, zoom}) {//加载时的方法，每次加载。把之前的清零
                // this.locationSearch(null,target);
            },
            // locationSearch(dataCode,map) {
            //     const level = this.calcLevel(map.getZoom());//当前缩放的位置应该的城市级别
            //     this.currentLevel = level;
            //     // if (this.currentLevel > 4) {
            //     //     // this.overlays = []
            //     //     // this.is = true;
            //     //     // this.points = [];
            //     //     // this.getData();
            //     // } else {
            //     //     // this.points = [];
            //     //     // this.getData()
            //     // }
            // },
            zoomend({type, target}) {//每次收缩地图的时候调用
                // if (this.map.zoom > 0) {
                //     this.locationSearch(null,{});
                // }
                let data = target.getCenter()
                let distance =  this.calcDistance(data.lng, data.lat)
                if(distance > 5000){
                    this.queryLimit.lng = data.lng;
                    this.queryLimit.lat = data.lat;
                    this.points = [];
                    this.getData();
                }
                this.zoomNum = target.getZoom();
                this.map.zoom = target.getZoom();//每次缩放把最当前的缩放倍数赋值给zoom

            },
            rad(d){
                return d * Math.PI / 180.0;
            },
            calcDistance(lng,lat){  //做移动距离计算, 计算距离上一个请求数据的中心点的距离
                    let EARTH_RADIUS = 6378.137;
                    let radLat1 = this.rad(lat);
                    let radLat2 = this.rad(this.queryLimit.lat);
                    let a = radLat1 - radLat2;
                    let b = this.rad(lng) - this.rad(this.queryLimit.lng);
                    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
                        + Math.cos(radLat1) * Math.cos(radLat2)
                        * Math.pow(Math.sin(b / 2), 2)));
                    s = s * EARTH_RADIUS;
                    s = Math.round(s * 10000) / 10000;
                    s = s * 1000;    //乘以1000是换算成米
                    return s;
            },
            dragend({type, target, pixel, point}) {
                let centerPoint  = target.getCenter()
                let distance =  this.calcDistance(centerPoint.lng, centerPoint.lat)
                if(distance > 5000){
                    this.queryLimit.lng = centerPoint.lng;
                    this.queryLimit.lat = centerPoint.lat;
                    this.points = [];
                    this.getData();
                }
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
        },
        computed: {
         centerComputed() {
                this.currentLevel = this.$store.getters.mapCenter.level;
                return this.$store.getters.mapCenter.center;
            },
            zoomComputed() {
                let  data =  this.$store.getters.mapCenter.zoom > 15? this.$store.getters.mapCenter.zoom: 15
                return data;
            }
        },
    }
</script>
<style scoped lang="scss">
    #map {
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        .operate {
            top: 110px;
            left: 33%;
            width: 500px;
            height: 30px;
            z-index: 99;
            > li {
                width: 106px;
                height: 30px;
                background: rgba(16, 45, 51, 1);
                margin-right: 20px;
            }
            > li:last-child {
                width: 120px;
                margin-right: 0;
            }
            span {
                font-size: 14px;
                font-weight: 400;
                color: #fff;
                line-height: 28px;
            }
            .gray {
                color: #777777;
            }
            .circle {
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin: 0 10px 0 20px;
                vertical-align: -3%;
                background: #777777;
            }
            .redC {
                @extend .circle;
                background: #FD4F41;
            }
            .yellowC {
                @extend .circle;
                background: #FCE233;
            }
            .blueC {
                @extend .circle;
                background: #3AC8E1;
            }
            .greenC {
                @extend .circle;
                background: #5BDA9D;
            }

        }
    }
</style>
