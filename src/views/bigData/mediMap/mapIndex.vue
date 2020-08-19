<template>
  <div class="box" id="dataBigBox">
    <header>
      <p>
        <span class="tit">{{$route.query.taskName}}执行情况</span>
        <span class="tim">{{$route.query.starTime}} - {{$route.query.endTime}}</span>
      </p>
      <ul>
        <li @click="clickUnfold" v-if="!unfold">展开数据</li>
        <li @click="clickFold" v-else>折叠数据</li>
        <li @click='popIsShow'>设置</li>
        <li @click="fullScreen" v-if="screen">全屏</li>
        <li @click="exitScreen" v-else>退出全屏</li>
      </ul>
    </header>
    <div class="cont">
      <div class="mapBox">
        <Map :id="$route.query.taskId" @open_setInterval='getAllFun' @messFUn='messFUn_2' :popActive='popShow' @popIsShow_map='popIsShow'></Map>
      </div>
      <div class="echartsBox" :class="unfold?'mr20':''">
        <div class="backImg w48 h46">
          <ul>
            <li @click="peiIndexChange(0)" :class="peiIndex == 0?'indexNum2':''">盒饭检查</li>
            <li @click="peiIndexChange(1)" :class="peiIndex == 1?'indexNum2':''">每日检查</li>
            <li @click="peiIndexChange(2)" :class="peiIndex == 2?'indexNum2':''">整改状况</li>
          </ul>
          <div id="boxStatus" class="peiBox"></div>
          <!-- <div id="dayStatus" class="peiBox" :class="peiIndex == 1?'echartIndex':''"></div>
          <div id="abarbeitungStatus" class="peiBox" :class="peiIndex == 2?'echartIndex':''"></div> -->
        </div>
        <div class="backImg w50 h46 opctiyAll">
          <h2>盒饭检查动态</h2>
          <el-table :data="tableData" :class="tableDataNew?'opcityNew':''">
            <el-table-column label="供应商" min-width="9">
              <template slot-scope="scope">
                <span class="spaceNowrap" :title="scope.row.entityName">{{scope.row.entityName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="检查人员" min-width="9">
              <template slot-scope="scope">
                <span class="spaceNowrap" :title="scope.row.names">{{scope.row.names}}</span>
              </template>
            </el-table-column>
            <el-table-column label="结果" min-width="8">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.treatStr == '通过'" size="mini" type="success" class="spaceNowrap" :title="scope.row.treatStr">{{scope.row.treatStr}}</el-tag>
                <el-tag v-if="scope.row.treatStr == '拒收'" size="mini" type="danger" class="spaceNowrap" :title="scope.row.treatStr">{{scope.row.treatStr}}</el-tag>
                <span v-if="!scope.row.treatStr">暂无</span>
              </template>
            </el-table-column>
            <el-table-column label="检查时间" min-width="12">
              <template slot-scope="scope">
                <span class="spaceNowrap" :title="scope.row.examineTime">{{scope.row.examineTime}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="backImg w48 h48 dataBox">
          <ul>
            <li @click="dataIndexChange(0)" :class="dataIndex == 0?'indexNum':''">今日实时数据</li>
            <li @click="dataIndexChange(1)" :class="dataIndex == 1?'indexNum':''">累计数据统计</li>
          </ul>
          <div class="dataSBox" v-if="dataLis && dataIndex == 0">
            <div>
              <span class="name">盒饭通过总数</span>
              <span class="num">{{dataLis.today.boxPass}}</span>
            </div>
            <div>
              <span class="name">盒饭实际供应</span>
              <span class="num">{{dataLis.today.boxSupplyTotal}}</span>
            </div>
            <div>
              <span class="name">堂食就餐人次</span>
              <span class="num">{{dataLis.today.mealspersons}}</span>
            </div>
            <div>
              <span class="name">出动监管人员</span>
              <span class="num">{{dataLis.today.boxPerson}}</span>
            </div>
            <div>
              <span class="name">盒饭检查次数</span>
              <span class="num">{{dataLis.today.boxCheck}}</span>
            </div>
            <div>
              <span class="name">现场检查次数</span>
              <span class="num">{{dataLis.today.patrolDay}}</span>
            </div>
          </div>

          <div class="dataSBox" v-if="dataLis && dataIndex == 1">
            <div>
              <span class="name">保障餐饮人次</span>
              <span class="num">{{dataLis.total.boxpersonAll}}</span>
            </div>
            <div>
              <span class="name">堂食人次</span>
              <span class="num">{{dataLis.total.mealspersonsALL}}</span>
            </div>
            <div>
              <span class="name">盒饭供应人次</span>
              <span class="num">{{dataLis.total.boxSupplyTotalAll}}</span>
            </div>
            <div>
              <span class="name">盒饭检查次数</span>
              <span class="num">{{dataLis.total.boxCheckAll}}</span>
            </div>
            <div>
              <span class="name">现场检查次数</span>
              <span class="num">{{dataLis.total.patrolDayAll}}</span>
            </div>
            <div>
              <span class="name">风险评估检查</span>
              <span class="num">{{dataLis.total.patrolRiskAll}}</span>
            </div>
          </div>
        </div>
        <div class="backImg w50 h48 opctiyAll" style="right:0;">
          <h2>现场检查动态</h2>
          <el-table :data="tableDayData" :class="tableDayDataNew?'opcityNew':''">
            <el-table-column label="接待单位" min-width="9" prop="entityName">
              <template slot-scope="scope">
                <span class="spaceNowrap" :title="scope.row.entityName">{{scope.row.entityName}}</span>
              </template></el-table-column>
            <el-table-column label="检查人员" min-width="9">
              <template slot-scope="scope">
                <span class="spaceNowrap" :title="scope.row.names">{{scope.row.names}}</span>
              </template>
            </el-table-column>
            <el-table-column label="结果" min-width="8">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.treat == 'NORMAL'" size="mini" type="success" class="spaceNowrap" :title="scope.row.treatStr">{{scope.row.treatStr}}</el-tag>
                <el-tag v-if="scope.row.treat == 'RECTIFY'" size="mini" type="danger" class="spaceNowrap" :title="scope.row.treatStr">{{scope.row.treatStr}}</el-tag>
                <span v-if="!scope.row.treatStr">暂无</span>
              </template>
            </el-table-column>
            <el-table-column label="检查时间" min-width="10">
              <template slot-scope="scope">
                <span class="spaceNowrap" :title="scope.row.patrolTime">{{scope.row.patrolTime}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as plan from 'api/activity/anaylze'
  import echarts from "echarts";
  import Map from './index.vue'
  export default {
    props: {
      id: {
        type: String
      }
    },
    data() {
      return {
        popShow:false,
        screen:true,
        unfold:true,
        pieData: {
          boxCheckMap: {
            data: [],
            name: ['通过', '拒收']
          },
          dayCheckMap: {
            data: [],
            name: ['正常', '责令整改']
          },
          rectifyMap: {
            data: [],
            name: ['已整改', '整改中']
          }
        },
        peiIndex:0,
        dataIndex:0,
        tableData: [],
        tableDayData:[],
        dataLis: {
          total: {},
          today: {}
        },
        willDestroy:false,
        TabNum: 0,
        tableDataNew:false,
        tableDayDataNew: false,
        setTime: null,
        myChart:null
      };
    },
    beforeDestroy() {
      this.willDestroy = true;
    },
    components:{
      Map
    },
    mounted() {      
      this.myChart = echarts.init(document.getElementById('boxStatus'));
      var _this = this;
      
      window.onresize = function () {//判断是否全屏
        if (!checkFull()) {
          _this.screen = true
        }
        _this.TabNum = 0;
        _this.getAllFun()
      }
      function checkFull() {//判断是否全屏
        var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;

        if (isFull === undefined) isFull = false;
        return isFull;
      }

      this.getAllFun()
    },
    methods: {
      messFUn_2(num){
        this.$emit('messFUn',num);
      },
      popIsShow(){
        this.popShow = !this.popShow;
      },
      fullScreen() {  //全屏
        var el = document.getElementById('dataBigBox');
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (typeof rfs != "undefined" && rfs) {
          rfs.call(el);
          this.screen = false
        };
        return;
      },
      exitScreen(){ //退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen();
          this.screen = true
        }
        else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
          this.screen = true
        }
        else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
          this.screen = true
        }
        else if (document.msExitFullscreen) {
          document.msExitFullscreen();
          this.screen = true
        }
        if (typeof cfs != "undefined" && cfs) {
          cfs.call(el);
          this.screen = true
        }
      },
      clickUnfold(){  //展开数据
        this.unfold = true
        this.getAllFun();
      },
      clickFold() { //折叠数据
        this.unfold = false
      },
      getPie() {  //请求饼状图
        plan.getPie(this.id).then((r) => {
          if (this.peiIndex == 0) {
            this.pieData.boxCheckMap.data = [];
            this.pieData.boxCheckMap.data.push({ value: r.data.boxCheckMap.inpass, name: '通过' });
            this.pieData.boxCheckMap.data.push({ value: r.data.boxCheckMap.rejected, name: '拒收' });
            this.draw(this.pieData.boxCheckMap.data, this.pieData.boxCheckMap.name)
          } else if (this.peiIndex == 1) {
            this.pieData.dayCheckMap.data = []
            this.pieData.dayCheckMap.data.push({ value: r.data.dayCheckMap.patrolNomal, name: '正常' });
            this.pieData.dayCheckMap.data.push({ value: r.data.dayCheckMap.patrolRectify, name: '责令整改' });
            this.draw(this.pieData.dayCheckMap.data, this.pieData.dayCheckMap.name)
          }else if(this.peiIndex == 2){
            this.pieData.rectifyMap.data = []
            this.pieData.rectifyMap.data.push({ value: r.data.rectifyMap.rectifyDone, name: '已整改' });
            this.pieData.rectifyMap.data.push({ value: r.data.rectifyMap.rectifyDodo, name: '整改中' });
            this.draw(this.pieData.rectifyMap.data, this.pieData.rectifyMap.name)
          }
        })
      },
      getTabData() {  //请求盒饭检查动态,现场检查动态 
        this.tableDataNew = true;
        this.tableDayDataNew = true;
        this.TabNum++;
        let tabSize = 5;
        if (document.getElementsByClassName('opctiyAll')[0].offsetHeight >= 430) {
          tabSize = 7
        }else if (document.getElementsByClassName('opctiyAll')[0].offsetHeight >= 370) {
          tabSize = 6
        } else if (document.getElementsByClassName('opctiyAll')[0].offsetHeight >= 330) {
          tabSize = 5
        } else if (document.getElementsByClassName('opctiyAll')[0].offsetHeight >= 290) {
          tabSize = 4
        } else if (document.getElementsByClassName('opctiyAll')[0].offsetHeight >= 240) {
          tabSize = 3
        }
        plan.getTabData(this.id, this.TabNum, tabSize).then((r) => {
          this.tableData = r.data.list;
          this.tableDataNew = false;
          if (r.data.total / this.TabNum <= tabSize) {
            this.TabNum = 0;
          }
        })
        plan.getDaycheckList(this.id, this.TabNum, tabSize).then((r) => {
          this.tableDayData = r.data.list;
          this.tableDayDataNew = false;
        })
      },
      getAllData() {  //请求累计数据
        plan.getAllData(this.id).then((r) => {
          this.dataLis.total = r.data;
        })
      }, 
      getdate() { //请求今日数据
        let dates = new Date();
        let mon = dates.getMonth() + 1;
        let day = dates.getDate();
        let hours = dates.getHours();
        let min = dates.getMinutes();

        if (mon <= 9) mon = "0" + mon;
        if (day <= 9) day = "0" + day;
        if (hours <= 9) hours = "0" + hours;
        if (min <= 9) min = "0" + min;

        this.day = dates.getFullYear() + "-" + mon + "-" + day + ' ' + hours + ':' + min;
        let dateNum = dates.getFullYear() + "-" + mon + "-" + day;
        plan.getTodayData(this.id, { 'startDate': dateNum, 'endDate': dateNum }).then((r) => {
          this.dataLis.today = r.data;
        })
      },
      peiIndexChange(index){ //切换饼图
        this.peiIndex = index;
        this.getPie()
      },
      dataIndexChange(index){ //切换数据展示
        this.dataIndex = index;
      },
      getAllFun(){
        if (this.willDestroy || !this.unfold) return
        this.getPie();
        this.getTabData();
        this.getAllData();
        this.getdate();
        clearTimeout(this.setTime);
        // this.setTime = setTimeout(() => {
        //   this.getAllFun();
        // }, 30000);
      },
      draw(data, nameData) {
        this.myChart.clear();
        let colors = ['#0DB5EF', '#FFCF69',
          '#66D6A2', '#FFCF69',
          '#9C9C9C', '#BF3EFF',
          '#CD3700', '#7A67EE',
          '#698B22', '#00CD00',
          '#FFB90F', '#FFB6C1'];
        let color = [];
        if (data) {
          color = colors.slice(0, data.length);
        }

        let option = {
          tooltip: {
            trigger: 'item',
            formatter: (r) => {
              return r.marker + r.data.name + "：" + r.data.value
            }
          },
          legend: {
            icon: 'square',
            orient: 'vertical',
            right: '10%',
            y: '5%',
            textStyle: {
              color: '#fff'
            },
            data: nameData
          },
          series: [
            {
              type: 'pie',
              radius: ['30%', '60%'],
              avoidLabelOverlap: false,
              center: ['50%', '50%'],
              color: color,
              label: {
                normal: {
                  show: false
                }
              },
              data: data
            }
          ]
        };
        this.myChart.setOption(option);
        // 窗口变化，重绘图像
        // window.addEventListener('resize', function () {
          this.myChart.resize();
        // }, false)
      }
    },
  };
</script>

<style scoped lang='scss'>
  .box{
    width: 100%;
    height: 100%;
    background-image: url('../../../assets/img/bigData/background.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    header{
      width: 100%;
      height: 6.2vw;
      background-image: url('../../../assets/img/bigData/top.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: relative;
      p{
        position: absolute;
        line-height: 40px;
        top: 50%;
        margin-top: -20px;
        margin-left: 4.5vw;
        .tit{
          background: linear-gradient(to bottom, #3CC9FC, #1B96C3);
          -webkit-background-clip: text;
          color: transparent;
          font-size: 1.5vw;
        }
        .tim{
          color: #1B96C3;
          margin-left: 29px;
          font-size: 0.9vw;
        }
      }
      ul{
        position: absolute;
        bottom: 0;
        right: 2.1vw;
        display: flex;
        li{
          background-image: url('../../../assets/img/bigData/btn-default.png');
          width: 4vw;
          text-align: center;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          line-height: 2.5vw;
          width: 6.8vw;
          margin-right: 30px;
          color:#DDD;
          cursor: pointer;
          font-size: 0.9vw;
        }
        li:hover{
          color: #37C7FB;
          background-image: url('../../../assets/img/bigData/but-click.png');
        }
      }
    }
    .cont{
      height: calc(100% - 6.2vw - 60px);
      margin-top: 30px;
      margin-bottom: 30px;
      display: flex;
      .mapBox{
        max-width: calc(100% - 40px);
        flex: 1;
        margin-left: 20px;
      }
      .echartsBox{
        width: 50%;
        margin-left: 20px;
        margin-right: -1500px;
        transition: all 1s;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        position: relative;
        .backImg{
          background-image: url('../../../assets/img/bigData/backImg.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          position: relative;
        }
        .w48{
          width: 48%;
        }
        .w50{
          width: 50%;
          padding: 20px;
          box-sizing: border-box;
          overflow: hidden;
          h2{
            background: #2d97c6;
            color:#fff;
            line-height: 2.5vw;
            padding-left: 20px;
          }
        }
        .h46{
          height: 46.6%;
        }
        .h48{
          height: 48.8%;
          position: absolute;
          bottom: 0;
        }
        .dataBox{
          ul{
            li{
              width: 42.5%;
              line-height: 2.5vw;
              background-image: url('../../../assets/img/bigData/btn2-default.png');
            }  
            .indexNum{
              color: #37C7FB;
              background-image: url('../../../assets/img/bigData/btn2-click.png');
            }
          }
          .dataSBox{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            margin-top: 30px;
            height: calc(100% - 2.5vw - 40px);
            div{
              width: 42.5%;
              height: 18%;
              background-image: url('../../../assets/img/bigData/dataBack.png');
              background-repeat: no-repeat;
              background-size: 100% 100%;
              position: relative;
              span{
                position: absolute;
                display: inline-block;
                height: 14px;
                top: 50%;
                margin-top: -7px;
                /* font-size:14px; */
                font-size: 0.7vw;
                display: inline-block;
                text-align: center;
              }
              .name{
                color: #fff;
                left: 0;
                width: 57%;
              }
              .num{
                color: #EAA330;
                right: 0;
                width: 43%;
              }
            }
          }
        }
        ul{
          display: flex;
          justify-content: space-evenly;
          margin-top: 20px;
          li{
            background-image: url('../../../assets/img/bigData/btn-default.png');
            width: 4vw;
            text-align: center;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            line-height: 2.5vw;
            width: 6.5vw;
            color:#DDD;
            cursor: pointer;
            font-size: 0.9vw;
          }
          .indexNum2{
            color: #37C7FB;
            background-image: url('../../../assets/img/bigData/btn-click.png');
          }
        }
        .peiBox{
          height: calc(100% - 2.5vw - 40px);
          position: absolute;
          top: calc(2.5vw + 25px);
          left: 0;
          bottom: 0;
          right: 0;
          /* opacity: 0;
          z-index: -1; */
        }
        .echartIndex{
          opacity: 1 !important;
          z-index: 6;
        }
      }
      .mr20{
        margin-right: 20px !important;
      }
    }
  }
</style>