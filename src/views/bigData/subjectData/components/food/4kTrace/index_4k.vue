<template>
  <div class="mapA2 relative">
    <div class="top">
      <div class="title">{{titName}}</div>
    </div>
    <ul class="bottom">
      <li class="ass">
        <regulatoryData v-show="type == 'all'" :dataAllsAll="dataAlls.schoolData.all" :dataAllsRests="dataAlls.schoolData.rests" 
                        :total="dataAlls.schoolData.total"></regulatoryData>
        <assessData v-show="type == 'all'" @routerChange="routerChange" :assessDataNum="dataAlls.assessDataNum" 
                    :assessData="dataAlls.assessData"></assessData>
        <billSummariz v-if="type == 'scholl'" @rankNum="rankNum" :schoolCode="schoolCode" :schoolName="titName"></billSummariz>
        <billDetail v-if="type == 'scholl'"  @routerChange="routerChange" @orderNum="orderNum" :rankTotal="dataAlls.rankTotal"
                   :schoolCode="schoolCode" :schoolName="titName"></billDetail>
      </li>
      <li class="adv">
        <mapSource @changeAll="changeAll" @routerChange="routerChange" :schoolAllNum="dataAlls.schoolData.total" 
                  :restsNum="dataAlls.assessData.AllNum" :warningNum="dataAlls.warningNum" :unPassNum="dataAlls.unPassNum"
                  :rankNum="dataAlls.rankNum" :rankTotal="dataAlls.rankTotal" :orderNum="dataAlls.orderNum"></mapSource>
      </li>
      <li class="ass">
        <suspectedPast v-show="type == 'all'" @routerChange="routerChange" :warningNum="dataAlls.warningNum"></suspectedPast>
        <todayTestData v-show="type == 'all'" @routerChange="routerChange" @SumUnPassNum="SumUnPassNum"></todayTestData>
        <monitoringSass v-if="type == 'scholl' && sassShow" :schoolCode="schoolCode" @sassShowFun="sassShowFun"></monitoringSass>
        <schoolInfo v-if="type == 'scholl' && !sassShow" :buyerCode="schoolCode"></schoolInfo>
        <!-- <trace v-if="type == 'scholl' && !sassShow" :buyerCode="schoolValue"></trace> -->
        <closedLoop v-if="type == 'scholl'" :schoolCode="schoolCode" :schoolValue="schoolValue"></closedLoop>
      </li>
    </ul> 
    <div class="ifrBox" v-show="ifrShow">
      <iframe name="myiframe" :src="`${httpName}${hostName}${routerName}`" width="1920" height="1040"
        frameborder="0"></iframe>
      <i class="el-icon-error closeP movePoin" @click="ifrShow=false"></i>
    </div>
  </div>
</template>

<script>
  import suspectedPast from "./suspectedPast.vue";//疑似过期
  import monitoringSass from "./monitoringSass.vue";//阳光厨房
  import todayTestData from "./todayTestData.vue";//检测数据
  import mapSource from "./mapSource.vue";//地图
  import closedLoop from "./closedLoop.vue";//应急追溯
  import regulatoryData from "./regulatoryData.vue";//学校汇总
  import assessData from "./assessData.vue";//考核分析
  import billSummariz from "./billSummariz.vue";//本月账单汇总
  import billDetail from "./billDetail.vue";//账单明细
  import schoolInfo from "./schoolInfo.vue";//学校概况
  import trace from "./trace.vue";//检测

  import { postRate } from "api/trace/supervise"
  import { postTotal } from "api/trace/pastFood"

  export default {
    components: {
      mapSource,todayTestData, monitoringSass, closedLoop, regulatoryData, assessData, suspectedPast, billSummariz, billDetail, trace, schoolInfo
    },
    data() {
      return {
        type: 'all',
        titName: '源本校餐卫士',
        schoolCode: '',
        schoolValue: '',
        schoolId: '',
        routerName: '',
        httpName: '',
        hostName: '',
        ifrShow: false,
        sassShow: true,
        dataAlls:{
          schoolData: {
            all: [],
            rests: [],
            total: 0
          },
          assessData: {},
          assessDataNum:0,
          warningNum: 0,
          unPassNum: 0,
          rankNum: 0,
          rankTotal: 0,
          orderNum: 0
        }
      }
    },
    mounted() {
      this.hostName = window.location.host;
      this.httpName = window.location.protocol + '//';
      this.dataAll();
    },
    methods: {
      sassShowFun(state){
        this.sassShow = state;
      },
      changeAll(type,name,code,id,value){
        this.type = type;
        this.titName = name;
        this.schoolCode = code;
        this.schoolValue = value;
        this.schoolId = id;
      },
      routerChange(name) {
        this.ifrShow = true;
        this.routerName = name;
      },
      //数据请求
      dataAll(){
        //学校概况+考核分析使用率
        let dates = new Date();
        let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        let transferData = dates.getFullYear() + "-" + mon;
        let form = new FormData();
        form.append('areaId', '5101');
        form.append('date', transferData);
        postRate(form).then(d => {  //全部学校
          if (d.data.length > 0) {
            for (let i = 0; i < d.data.length; i++) {
              switch (d.data[i].buyerType) {
                case 'ALL':
                  this.dataAlls.assessData.AllNum = d.data[i].rate + '%';
                  this.dataAlls.assessData.schoolNum = d.data[i].buyerNum - d.data[i].num;
                  this.dataAlls.assessDataNum++;
                  this.dataAlls.schoolData.total = d.data[i].buyerNum
                  break;
                case 'KINDSC':
                  this.dataAlls.schoolData.all.push({ num: d.data[i].buyerNum, type: '幼儿园' });
                  break;
                case 'MIDSC':
                  this.dataAlls.schoolData.all.push({ num: d.data[i].buyerNum, type: '中学' });
                  break;
                case 'PRISC':
                  this.dataAlls.schoolData.all.push({ num: d.data[i].buyerNum, type: '小学' });
                  break;
                case 'UNVSC':
                  this.dataAlls.schoolData.all.push({ num: d.data[i].buyerNum, type: '大学' });
                  break;
                case 'KINDSC':
                  this.dataAlls.schoolData.all.push({ num: d.data[i].buyerNum, type: '幼儿园' });
                  break;
              }
            }
          }
        })
        let formt = new FormData();
        formt.append('areaId', '5101');
        formt.append('type', 'PUBLIC');
        formt.append('date', transferData);
        postRate(formt).then(d => { //公立
          if (d.data.length > 0) {
            for (let i = 0; i < d.data.length; i++) {
              switch (d.data[i].buyerType) {
                case 'ALL':
                  this.dataAlls.assessData.PUBLIC = d.data[i].rate + '%';
                  this.dataAlls.assessDataNum++;
                  this.dataAlls.schoolData.rests.push({ value: d.data[i].buyerNum, name: '公立学校' });
                  break;
              }
            }
          }
        })
        let formh = new FormData();
        formh.append('areaId', '5101');
        formh.append('type', 'PRIVATE');
        formh.append('date', transferData);
        postRate(formh).then(d => { //私立
          if (d.data.length > 0) {
            for (let i = 0; i < d.data.length; i++) {
              switch (d.data[i].buyerType) {
                case 'ALL':
                  this.dataAlls.assessData.PRIVATE = d.data[i].rate + '%';
                  this.dataAlls.assessDataNum++;
                  this.dataAlls.schoolData.rests.push({ value: d.data[i].buyerNum, name: '私立学校' });
                  break;
              }
            }
          }
        })
        let params = new FormData();
        params.append('status', 'WARING');
        params.append('areaId', '5101');
        postTotal(params).then(r => {//预警数量
          this.dataAlls.warningNum = r.data;
        })
      },
      SumUnPassNum(num) {
        this.dataAlls.unPassNum = num;
      },
      rankNum(num, rankTotal) {
        this.dataAlls.rankNum = num;
        this.dataAlls.rankTotal = rankTotal;
      },
      orderNum(num) {
        this.dataAlls.orderNum = num;
      }
    },
  }
</script>
<style lang='scss' scoped>
  .mapA2 {
    width: 3840px;
    height: 2160px;
    margin: 0 auto;
    background: url("~assets/img/subjectData/4kTrace/bg.png")
  }
  .top {
    width: 100%;
    height: 170px;
    margin-bottom: 30px;
    .title {
      font-size: 64px;
      color: #74FAFD;
      text-align: center;
      background: url("~assets/img/subjectData/4kTrace/titlebg.png");
      width: 1210px;
      height: 170px;
      line-height: 140px;
      margin: 0 auto;
    }
  }
  .bottom {
    width: 100%;
    height: calc(100% - 220px);
    display: flex;
    justify-content: space-around;
    .ass{
      width: 24%;
    }
    .adv{
      width: 48%;
    }
    >li {
      height: 100%;
      div{
        height: 49.5%;
      }
      div:last-child{
        margin-top: 39px;
      }
    }
  }
  .ifrBox{
    background: #fff;
    width: 1920px;
    height: 1040px;
    position: fixed;
    top: 50%;
    margin-top: -540px;
    left: 50%;
    margin-left: -960px;
    z-index: 999;
    .closeP{
      font-size: 80px;
      padding-right: 10px;
      color: #fff;
      position: absolute;
      bottom: -100px;
      left: 50%;
    }
  }
</style>