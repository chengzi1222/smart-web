<template>
  <div class="mapSource">
    <div class="searchBox">
      <div v-if="mpaIf" style="font-size: 50px;color: #fff;margin: 25px 0 60px;text-align: center;">成都校餐实时溯源轨迹图</div>
      <div class="iptBox" @mouseleave="ulShow=false">
        <i class="el-icon-close movePoin" @click="colseSchollNmae" v-if="schollName != ''"></i>
        <input @keyup="inputChange" :disabled="iptDis" type="text" @focus="ulShow=true" @blur="" v-model="schollName" placeholder="请输入学校名称">
        <ul v-if="ulShow && schollDatas.length>0">
          <li v-for="(item, index) in schollDatas" @click="changeAll(item)">{{item.name}}</li>
        </ul>
      </div>
    </div>
    <div id="mapSource">
      <div v-show="mpaIf" style="height:102%;width:100%;background: #090a0a" id="mapSource1"></div>
      <div v-if="!mpaIf" style="height:102%;width:100%;background: #090a0a" id="mapSourceBox"></div>
    </div>
    <ul class="mapSource_dataBox clear_a">
      <li v-if="!allOrSchool" class="movePoin" v-for="(item,index) in data.all" :key="item.path+index+keyNum+'all'" @click="routerChange(item)">
        <p>{{item.name}}</p>
        <p class="pB">{{item.num}}</p>
      </li>
      <li v-if="allOrSchool" class="movePoin" v-for="(item,index) in data.school" :key="item.path+index+keyNum+'school'" @click="routerChange(item,index)">
        <p>{{item.name}}</p>
        <p class="pB">{{item.num}}</p>
      </li>
    </ul>
  </div>
</template>
<script>
  import echarts from 'echarts';
  import echartsGl from 'echarts-gl';
  import axios from 'axios'
  import { postSubAutoSchool, getLine, getLineBuyer } from 'api/trace/supervise.js'
  import { postList } from "api/trace/pastFood"
  import { daySuyNum,daySuyPage } from 'api/trace/daysItem'
  import { postMain, postDetail, odpage } from "api/trace/bill.js";
  import { postdlrli } from "api/trace/closedLoop.js";
  export default {
    props: {
      schoolAllNum:{
        default: function() {return ''}
      },
      restsNum: {
        default: function () { return '' }
      },
      warningNum: {
        default: function () {
          return ''
        }
      },
      unPassNum: {
        default: function () {
          return ''
        }
      },
      rankNum: {
        default: function () {
          return ''
        }
      },
      rankTotal: {
        default: function () {
          return ''
        }
      },
      orderNum: {
        default: function () {
          return ''
        }
      }
    },
    watch: {
      schoolAllNum: function() {
        this.data.all[4].num = this.schoolAllNum;
        this.keyNum++;
      },
      restsNum: function () {
        this.data.all[3].num = this.restsNum;
        this.keyNum++;
      },
      warningNum: function () {
        this.data.all[2].num = this.warningNum;
        this.keyNum++;
      },
      unPassNum: function () {
        this.data.all[5].num = this.unPassNum;
        this.keyNum++;
      },
      rankNum: function () {
        this.data.school[0].num = this.rankNum;
        this.data.school[2].num = (this.rankTotal/ 10000).toFixed(2) + '万元';
        this.keyNum++;
      },
      orderNum: function () {
        this.data.school[1].num = this.orderNum;
        this.keyNum++;
      },
    },
    methods: {
      routerChange(item,index) {
        if(index && index == 4){return}
        this.$emit('routerChange',item.path,item.query)
      },
      map() {
        let myChart;
        let container = document.getElementById("mapSourceBox");
        myChart = echarts.init(container);
        myChart.clear()
        let taxiRoutes = [];
        let data = this.szRoad.data.lineList;
        let hStep = 300 / (data.length - 1);
        let i = 0;
        for (var x in data) {
          var line = data[x];
          if (Object.prototype.toString.call(data[x]).slice(8, -1).toLowerCase() === "function") {
            continue;
          }
          var pointString = line.sampLine;
          var pointArr = pointString.split(';');
          var lnglats = [];
          for (var j in pointArr) {
            if (Object.prototype.toString.call(pointArr[j]).slice(8, -1).toLowerCase() === "function") {
              continue;
            }
            lnglats.push(pointArr[j].split(','))
          }
          taxiRoutes.push({
            coords: lnglats,
            lineStyle: {
              color: echarts.color.modifyHSL('#5A94DF', Math.round(hStep * x))
            }
          })
        }
        var dataAll = [];
        var geoCoordMap = {};
        for(let i=0; i<this.szRoad.data.dlrInfoList.length; i++) {
          dataAll.push({
            name: this.szRoad.data.dlrInfoList[i].dlrName,
            value: 120,
            icon: 'circle',
            color: '#845FFE',
            position: 'top'
          })
          geoCoordMap[this.szRoad.data.dlrInfoList[i].dlrName] = [this.szRoad.data.dlrInfoList[i].lng, this.szRoad.data.dlrInfoList[i].lat]
        }
        dataAll.push({
          name: this.szRoad.data.buyerInfo.buyerName,
          value: 120,
          icon: 'circle',
          color: '#F0D748',
          position: 'bottom'
        })
        geoCoordMap[this.szRoad.data.buyerInfo.buyerName] = [this.szRoad.data.buyerInfo.lng, this.szRoad.data.buyerInfo.lat]
        var convertData = function (data) {
          var res = [];
          for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
              let obj = {
                type: 'scatter3D',
                coordinateSystem: 'maptalks3D',
                data: [{
                  name: data[i].name,
                  value: geoCoord.concat(data[i].value)
                }],
                symbol: data[i].icon,
                symbolSize: function (val) {
                  return val[2] / 5;
                },
                label: {
                  show: true,
                  distance: 10,
                  position: data[i].position,
                  formatter: '{b}',
                  textStyle: {
                    color: '#000',
                    borderWidth: 3,
                    fontWeight: 'bold',
                    borderColor: '#000',
                    fontSize: 30
                  }
                },
                emphasis: {
                  itemStyle: {
                    color: '#fff',
                    borderWidth: 2,
                  },
                  label: {
                    show: true,
                    formatter: '{b}',

                  }
                },
                itemStyle: {
                  normal: {
                    color: data[i].color
                  }
                },
                zlevel: 1 + i
              }
              res.push(obj);
            }
          }
          return res;
        };
        var all = convertData(dataAll);
        var series = {
          type: 'lines3D',
          coordinateSystem: 'maptalks3D',
          effect: {
            show: true,
            constantSpeed: 5,
            trailWidth: 2,
            trailLength: 0.4,
            trailOpacity: 1,
            spotIntensity: 10
          },
          blendMode: 'lighter',
          polyline: true,
          lineStyle: {
            width: 0.5,
            color: 'rgb(200, 40, 0)',
            opacity: 0.8
          },
          data: taxiRoutes,
          zlevel: -10
        }
        all.push(series)
        function init(seep) {
          var option = {
            maptalks3D: {
              style: {
                backgroundColor: '#fff'
              },
              center: [104.091, 30.639],
              zoom: 11.5,
              urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              altitudeScale: 2,
              postEffect: {
                enable: true,
                FXAA: {
                  enable: true
                }
              },
              light: {
                main: {
                  intensity: 1,
                  shadow: true,
                  shadowQuality: 'high'
                },
                ambient: {
                  intensity: 0.
                },
                ambientCubemap: {
                  texture: '/asset/get/s/data-1491838644249-ry33I7YTe.hdr',
                  exposure: 1,
                  diffuseIntensity: 0.5,
                  specularIntensity: 2
                }
              }
            },
            series: all
          }
          myChart.setOption(option);
          window.addEventListener('resize', function () {
            myChart.resize();
          }, false);
        }
        init()
      }, 
      mapT() {
        let myChart;
        let container = document.getElementById("mapSource1");
        myChart = echarts.init(container);
        myChart.clear()
        let taxiRoutes = [];
        let data = this.szRoad.data.lineList;
        let hStep = 300 / (data.length - 1);
        let i = 0;
        for (var x in data) {
          var line = data[x];
          if (Object.prototype.toString.call(data[x]).slice(8, -1).toLowerCase() === "function") {
            continue;
          }
          var pointString = line.sampLine;
          var pointArr = pointString.split(';');
          var lnglats = [];
          for (var j in pointArr) {
            if (Object.prototype.toString.call(pointArr[j]).slice(8, -1).toLowerCase() === "function") {
              continue;
            }
            lnglats.push(pointArr[j].split(','))
          }
          taxiRoutes.push({
            coords: lnglats,
            lineStyle: {
              color: echarts.color.modifyHSL('#5A94DF', Math.round(hStep * x))
            }
          })
        }
        function init(seep) {
          var option = {
            maptalks3D: {
              style: {
                backgroundColor: '#fff'
              },
              center: [104.091, 30.639],
              zoom: 12,
              urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              altitudeScale: 2,
              postEffect: {
                enable: true,
                FXAA: {
                  enable: true
                }
              },
              light: {
                main: {
                  intensity: 1,
                  shadow: true,
                  shadowQuality: 'high'
                },
                ambient: {
                  intensity: 0.
                },
                ambientCubemap: {
                  texture: '/asset/get/s/data-1491838644249-ry33I7YTe.hdr',
                  exposure: 1,
                  diffuseIntensity: 0.5,
                  specularIntensity: 2
                }
              }
            },
            series: [{
              type: 'lines3D',
              coordinateSystem: 'maptalks3D',
              effect: {
                show: true,
                constantSpeed: 10,
                trailWidth: 2,
                trailLength: 0.4,
                trailOpacity: 1,
                spotIntensity: 10
              },
              blendMode: 'lighter',
              polyline: true,
              lineStyle: {
                width: 0.5,
                color: 'rgb(200, 40, 0)',
                opacity: 0.8
              },
              data: taxiRoutes,
              zlevel: -10
            }]
          }
          myChart.setOption(option);
          window.addEventListener('resize', function () {
            myChart.resize();
          }, false);
        }
        init()
      },
      colseSchollNmae(){
        this.schollName = '';
        this.iptDis = false;
        this.ulShow = false;
        this.$emit('changeAll','all','校餐卫士','','')
        this.mpaIf = true;
        this.allOrSchool = false;
        this.schollDatas = [{
          areaId: "510108",
          buyerGuid: "8160DE852E894F81A6F92FCE6046BB3E",
          buyerType: "PRISC",
          name: "成都市成华小学校（锦绣校区）",
          value: "3051010800040"
        }, {
          areaId: "510185",
          buyerGuid: "686E2113D5F645AE999FBA2AF6B0B29C",
          buyerType: "KINDSC",
          name: "成都高新区国华盛泰幼儿园",
          value: "3051018500395"
        }]
      },
      changeAll(item){
        this.iptDis = true;
        this.schoolItem = item;
        this.ulShow = false;
        this.schollName = item.name;
        this.$emit('changeAll', 'scholl', item.name, item.buyerGuid, item.areaId, item.value);
        this.getLineBuyer(item.buyerGuid)
        this.schoolDatas(item);
        let dates = new Date();
        let mon = dates.getMonth() + 1; //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {
          mon = "0" + mon;//如果小于9的话，则需要加上0
        }
        let dateMon = dates.getFullYear() + "-" + mon;
        this.data.school[0].path = `/yb/bill/detail/?source=4k&guid=${item.buyerGuid}&date=${dateMon}&areaId=${item.areaId}&buyerName=${item.name}`;
        this.data.school[1].path = `/yb/bill/detail/?source=4k&guid=${item.buyerGuid}&date=${dateMon}&areaId=${item.areaId}&buyerName=${item.name}`;
        this.data.school[2].path = `/yb/bill/detail/?source=4k&guid=${item.buyerGuid}&date=${dateMon}&areaId=${item.areaId}&buyerName=${item.name}`;
        this.data.school[3].path = `/yb/daysItem?source=4k&buyerCode=${item.value}&name=${item.name}`;
        this.data.school[5].path = `/yb/pastFoodIndex/pastFood?source=4k&buyerName=${item.name}`;
        this.allOrSchool = true;
      },
      inputChange(){
        clearTimeout(this.Timeout)
        this.ulShow = false;
        this.Timeout = setTimeout(() => {
          let from = new FormData();
          from.append('name', this.schollName);
          from.append('areaId', '5101');
          postSubAutoSchool(from).then(r => {
            this.schollDatas = r.data.slice(0,10);
            this.ulShow = true;
          })
        }, 500);
      },
      getLine() {
        this.mpaIf = true;
        axios.get('http://stg.cdn.ybveg.com//save/stg/4k/trace_row_line_daily.json').then(r => {
            this.szRoad.data = r.data.data;
            this.mapT();
        })
      },
      getLineBuyer(id) {
        let buyerGuid = id ? id : '';
        // this.mpaIf = true;
        // setTimeout(()=>{
          this.mpaIf = false;
          getLineBuyer({ 'limit': 100, 'buyerGuid': buyerGuid }).then(r => {
            if (r.data.lineList && r.data.lineList.length > 0) {
              this.szRoad.data = r.data;
              this.map();
            } else {
              this.mpaIf = true;
              this.$message.warning('该学校缺乏地理位置信息或暂无溯源信息')
            }
          })
        // },30)
      },
      allDatas(){
        this.keyNum++;
        let dates = new Date();
        let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        let day = dates.getDate();                   //getdate()返回的是1-31，则不需要加1
        if (day <= 9) {                                     //如果小于9的话，则需要加上0
          day = "0" + day;
        }
        //今日累计溯源
        let paramsSuy = new FormData();
        paramsSuy.append('areaId', '5101');
        paramsSuy.append('date', dates.getFullYear() + "-" + mon + "-" + day);
        daySuyNum(paramsSuy).then(r => {
          if (r.data) {
            this.data.all[0].num = r.data
          }
        })
        //本月订单金额
        let formMain = new FormData();
        formMain.append("areaId", '5101');
        formMain.append("date", dates.getFullYear() + "-" + mon);
        postMain(formMain).then(d => {
          this.data.all[1].num = d.data.all + '万元';
        });
      },
      schoolDatas(item) {
        this.keyNum++;
        let dates = new Date();
        let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        let day = dates.getDate();                   //getdate()返回的是1-31，则不需要加1
        if (day <= 9) {                                     //如果小于9的话，则需要加上0
          day = "0" + day;
        }
        //溯源数据
        let formSuy = new FormData();
        formSuy.append('buyerCode', item.value);
        formSuy.append('areaId', '5101');
        formSuy.append('date', dates.getFullYear() + "-" + mon + "-" + day);
        formSuy.append('pageSize', 1);
        formSuy.append('pageNumber', 1);
        daySuyPage(formSuy).then(r => {
          if (r.data) {
            this.data.school[3].num = r.pageObj.totalRecords;
          }
        })
        //配送商数量
        let fromDlr = new FormData();
        fromDlr.append('guid', item.buyerGuid)
        postdlrli(fromDlr).then(r => {
          this.data.school[4].num = r.data.sellerLi.length;
        })
        //预警数量
        let formList = new FormData();
        formList.append('buyerName', item.name);
        formList.append('areaId', '5101');
        formList.append('status', 'WARING');
        formList.append('pageSize', 1);
        formList.append('pageNumber', 1);
        postList(formList).then(d => {
          this.data.school[5].num = d.pageObj.totalRecords;
        })
      }
    },
    data() {
      return {
        iptDis:false,
        Timeout: null,
        keyNum: 0,
        schoolItem: {},
        mpaIf: true,
        data: {
          all: [{
            name: '今日累计溯源',
            num: '0',
            path: '/yb/daysItem?source=4k'
          }, {
            name: '本月订单金额',
            num: '0',
            path: '/yb/bill/main?source=4k'
          }, {
            name: '疑似过期预警',
            num: '0',
            path: '/yb/pastFoodIndex/pastFood?source=4k'
          }, {
            name: '溯源使用率',
            num: '0',
            path: '/yb/analyzemain/analyze?source=4k'
          }, {
            name: '学校总数',
            num: '0',
            path: '/yb/analyzemain/analyze?source=4k'
          }, {
            name: '不合格批次',
            num: "0",
            path: '/yb/gathermain/gather?source=4k&type=unPass'
          }],
          school: [{
            name: '本月采购品类',
            num: '0',
            path: ''
          }, {
            name: '订单数量',
            num: '0',
            path: ''
          }, {
            name: '订单金额',
            num: '0',
            path: ''
          }, {
            name: '溯源数据',
            num: '0',
            path: ''
          }, {
            name: '配送商数量',
            num: '0',
            path: ''
          }, {
            name: '预警数量',
            num: '0',
            path: ''
          }]
        },
        szRoad: {
          success: true,
          errorCode: 0,
          errorMsg: "成功",
          data: {}
        },
        schollName: '',
        ulShow: false,
        schollDatas: [{
          areaId: "510108",
          buyerGuid: "8160DE852E894F81A6F92FCE6046BB3E",
          buyerType: "PRISC",
          name: "成都市成华小学校（锦绣校区）",
          value: "3051010800040"
        },{
          areaId: "510185",
          buyerGuid: "686E2113D5F645AE999FBA2AF6B0B29C",
          buyerType: "KINDSC",
          name: "成都高新区国华盛泰幼儿园",
          value: "3051018500395"
        }],
        allOrSchool: false
      }
    },
    mounted() {
      this.getLine();
      this.allDatas()
    }
  }
</script>
<style lang='scss' scoped>
  input::-webkit-input-placeholder {
    color: rgba(116,250,253,1);
  }
  .mapSource {
    height: 100% !important;
    width: 100%;
    margin-top: 0 !important;
    position: relative;
  }
  #mapSource {
    height: 87%;
    width: 100%;
    margin-bottom: 40px;
    border: 1px solid rgba(21, 61, 84, 1);
    box-sizing: border-box;
    overflow: hidden;
  }
  .mapSource_dataBox {
    height: calc(100% - 87% - 40px);
    width: 100%;
    box-sizing: border-box;
    background: url("~@/assets/img/subjectData/4kTrace/mapNumB.png") no-repeat center;
    background-size: 100% 100%;
    text-align: center;
    >li {
      width: calc(100% / 5 - 50px);
      height: 100%;
      p {
        color: #ffffff;
        font-size: 32px;
        margin-top: 44px;
      }
      .pB {
        margin-top: 30px;
        font-size: 44px;
        color: #74FAFD;
      }
    }
    li:last-child{
      width: 250px;
    }
  }
  .searchBox{
    position: absolute;
    z-index: 999;
    top: 35px;
    width: 100%;
    .iptBox{
      width: 810px;
      height: 90px;
      margin: 0 auto;
      position: relative;
      background: url("~@/assets/img/subjectData/4kTrace/searchIpt.png");
      input{
        border: none;
        background: none;
        height: 100%;
        width: 100%;
        padding: 0 45px;
        box-sizing: border-box;
        color:rgba(116,250,253,1);
        font-size:30px;
        outline:none
      }
      i{
        color: #73fbfd;
        position: absolute;
        right: 35px;
        top: 35px;
        font-size: 30px;
      }
      ul{
        position: absolute;
        width: 800px;
        padding: 20px 0;
        background: url("~@/assets/img/subjectData/4kTrace/searchDataBg.png");
        background-size: 100% 100%;
        margin-left: 4px;
        li{
          line-height: 60px;
          height: 60px;
          font-size:28px;
          color:rgba(116,250,253,1);
          padding: 0 40px;
          cursor: pointer;
        }
        li:hover{
          background: url("~@/assets/img/subjectData/4kTrace/searchDataSelected.png");
        }
      }
    }
  }
</style>