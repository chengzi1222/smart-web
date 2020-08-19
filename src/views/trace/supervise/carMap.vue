<style>
    .amap-marker .marker-route {
			position: absolute;
			width: 40px;
			height: 44px;
			color: #e90000;
			background: url(https://webapi.amap.com/theme/v1.3/images/newpc/poi-1.png) no-repeat;
			cursor: pointer;
			background-position: -334px -180px;
		}
		.amap-marker .marker-routes {
			position: absolute;
			width: 80px;
			height: 40px;
			background: url(https://yuanben-res.ybveg.com/prod/cert/b12308a8-d6aa-43da-acbd-4de1d3833b00.png) no-repeat;
			background-size:100% 100%;
			cursor: pointer;
		}
</style>
<template>
  <div class="bigBox">
    <div class="leftBox floatL">
      <div class="page-tilt">
        <b></b><span>车辆轨迹</span>
      </div>
      <router-link v-if="$route.query.infoBut" :to="{name: 'yb.source', query:{ Orderguid: $route.query.Orderguid }}" target="_blank">
        <el-button class="w100 mr14 mt20">订单详情</el-button>
      </router-link>
      <el-button id="start" class="w100 ml0 mt20" type="primary" :disabled="!datas.distance||datas.distance<=0">路线回放</el-button>
      <p class="row">
        <span class="tit floatL">订单编号：</span>
        <span class="info">{{datas.orderCode}}</span>
      </p>
      <p class="row mt20">
        <span class="tit floatL">配送商：</span>
        <span class="info">{{datas.dlrName}}</span>
      </p>
      <p class="row mt20">
        <span class="tit floatL">采购商：</span>
        <span class="info">{{datas.orderInfo?datas.orderInfo.buyerName:'-'}}</span>
      </p>
      <p class="row mt20">
        <span class="tit floatL">司机：</span>
        <span class="info">{{datas.orderInfo?datas.orderInfo.carDriver:'-'}}</span>
      </p>
      <p class="row mt20">
        <span class="tit floatL">车牌号：</span>
        <span class="info">{{datas.orderInfo?datas.orderInfo.carCode:'-'}}</span>
      </p>
      <p class="row mt20">
        <span class="tit floatL">配送时间：</span>
        <span class="info">{{datas.startTime?datas.startTime:'-'}}</span>
      </p>
      <p class="row mt20">
        <!-- <span class="tit floatL">收车时间：</span> -->
        <span class="tit floatL">收货时间：</span>
        <span class="info">{{datas.receiveTime?datas.receiveTime:'-'}}</span>
      </p>
      <p class="row mt20">
        <span class="tit floatL">耗时：</span>
        <span class="info">{{datas.haoshiS?datas.haoshiS:'0'}}小时{{datas.haoshiF?datas.haoshiF:'0'}}分</span>
      </p>
      <p class="row mt20">
        <span class="tit floatL">品种数：</span>
        <span class="info">{{datas.orderInfo?datas.orderInfo.num:'0'}}</span>
      </p>
      <p class="row mt20">
        <span class="tit floatL">重量：</span>
        <span class="info">{{datas.orderInfo?datas.orderInfo.weight:'0'}}kg</span>
      </p>
      <p class="row mt20">
        <span class="tit floatL">行驶距离：</span>
        <span class="info">{{datas.distance?datas.distance:'-'}}km</span>
      </p>
    </div>
    <div class="rightBox floatL ml20" id="rightBox"></div>
  </div>
</template>
<script>
import AMap from 'AMap';
import { routeOrdergps } from "api/trace/supervise";
export default {
  data() {
    return {
      datas: {}
    }
  },
  mounted() {
    this.initF()
  },
  methods: {
    initF(){
      let _this = this;
      const map = new AMap.Map('rightBox', {//初始化地图
        resizeEnable: true,
        //中心点
        center: [104.072947, 30.492562],
        zoom: 12
      });
      map.plugin(["AMap.ToolBar"], function () { //在地图中添加ToolBar插件
        var toolBar = new AMap.ToolBar();
        map.addControl(toolBar);
      });
      map.on("complete", function () {
        loadLine();
      });
      let loadLine = function () {
        let params = new FormData();
        params.append('orderGuid', _this.$route.query.Orderguid)
        routeOrdergps(params).then(res=>{
          if (res.state&&res.data != null) {
            if(!res.data.list){
              _this.$message.error("该订单暂无溯源轨迹！");
            }
            _this.datas = res.data;
            _this.datas.haoshiS = Math.floor(((new Date(res.data.receiveTime) - new Date(res.data.startTime)))/1000/60/60);
            _this.datas.haoshiF = Math.floor(((new Date(res.data.receiveTime)-new Date(res.data.startTime)))/1000/60) - (_this.datas.haoshiS*60);
            map.clearMap();
            let data = res.data;
            let marker = [];
            //起点
            marker = new AMap.Marker({
              map: map,
              position: [data.startLong, data.startLat],
              autoRotation: true,
              offset: new AMap.Pixel(-17, -42), //相对于基点的偏移位置
              draggable: false,  //是否可拖动
              content: '<div style="position: absolute;width: 40px;height: 44px;color: #e90000;background: url(https://webapi.amap.com/theme/v1.3/images/newpc/poi-1.png) no-repeat;cursor: pointer;background-position: -334px -180px;"></div>'   //自定义点标记覆盖物内容
            });
            let list = data.list;
            //终点(可能在路上，可能完结)
            if (list.length > 0) {
              //终点
              marker = new AMap.Marker({
                map: map,
                position: [list[list.length - 1].longitude, list[list.length - 1].latitude],
                autoRotation: true,
                offset: new AMap.Pixel(-17, -20), //相对于基点的偏移位置
                draggable: false, //是否可拖动
                content: '<div style="position: absolute;width: 80px;height: 40px;background: url(https://yuanben-res.ybveg.com/prod/cert/b12308a8-d6aa-43da-acbd-4de1d3833b00.png) no-repeat;background-size: 100% 100%;cursor: pointer;"></div>'   //自定义点标记覆盖物内容,
              });
              let lineArr = [];
              let pathParam = [];
              lineArr.push(new AMap.LngLat(data.startLong, data.startLat));
              for (let i = 0; i < list.length; i++) {
                lineArr.push(new AMap.LngLat(list[i].longitude, list[i].latitude));
                let arrObj = {};
                arrObj.x = list[i].longitude;
                arrObj.y = list[i].latitude;
                arrObj.sp = 10;
                arrObj.ag = 30;
                arrObj.tm = i + 1;
                pathParam.push(arrObj);
              }
              // 绘制轨迹
              let polyline = new AMap.Polyline({
                map: map,
                path: lineArr,
                l: 0.7,
                strokeColor: 'green',
                showDir: true
              });
              let passedPolyline = new AMap.Polyline({
                map: map,
                strokeColor: "#F00",  //线颜色
                strokeWeight: 3,      //线宽
                showDir: true,
                l: 0.7
              });
              marker.on('moving', function (e) {
                passedPolyline.setPath(e.passedPath);
              })
              map.setFitView();
              AMap.event.addDomListener(document.getElementById('start'), 'click', function () {
                marker.moveAlong(lineArr, 10000);
              }, false);
            }
          } else {
            _this.$message.error("该订单暂无物流！");
          }
        })
      }
    }
  }
}
</script>
<style lang="sass" scoped>
  .bigBox{
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    .leftBox{
      height: 100%;
      border: 1px solid #ccc;
      width: 260px;
      box-sizing: border-box;
      padding: 0 20px;
      .page-tilt{
        padding-top: 20px;
      }
      .mr14{
        margin-right: 14px;
      }
      .ml0{
        margin-left: 0;
      }
      .row{
        margin-top: 25px;
        line-height: 25px;
        font-size: 14px;
        .tit{
          color: #6D7787;
        }
        .info{
          color: #393939;
          display: inline-block;
          max-width: 160px;
        }
      }
    }
    .rightBox{
      width: calc(100% - 280px);
      background: #ccc;
      height: 100%;
    }
  }
</style>