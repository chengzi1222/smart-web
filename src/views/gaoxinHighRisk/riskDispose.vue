<template>
  <div id="AssessRank">
    <p>风险处理情况</p>
    <div class="echartBox">
      <div class="echart echartIndex" id="number" >风险处理总数</div>
    </div>
    <div class="more-btn">
      <span @click="checkMore">查看更多</span>
    </div>
  </div>
</template>
<script>
  import {
    riskTreatment,
  } from 'api/xcws/warnStatistics/subjectProfile';
  import * as echartFun from "./echarts.js";

  export default {
    data() {
      return {
        areaAssessData: [],
      }
    },
    methods: {
      getAssessRankData() {
        let dateNow = new Date();
        let year = dateNow.getFullYear();
        let mon = (dateNow.getMonth() + 1);
        let month
        if (mon < 10) {
          month = year + '-0' + mon; // 当前月 1-9
        } else {
          month = year + '-' + mon; // 当前月 10-12
        }
        riskTreatment().then(r => {
          if (r.status == true) {
            this.areaAssessData = r.data;
            echartFun.echartsBar(this.areaAssessData, 'number');
          }
        }).catch(e => {
          console.log(e)
        })
      },
      checkMore() {
        this.$emit("ifrShow", '/xcws/subjectAssess')
      }
    },
    mounted() {
      this.getAssessRankData();
    }
  }
</script>
<style scoped lang="scss">
  #AssessRank {
    width: 540px;
    height: 500px;
    position: fixed;
    z-index: 2;
    right: 20px;
    bottom: 20px;
    background: url('~assets/img/boxBG500.png') no-repeat center;

    >p {
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 20px;
      color: #fff;
    }

    .btnBox {
      height: 50px;
      width: 100%;

      >div {
        width: 160px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #CCCCCC;
        font-size: 14px;
        margin-top: 20px;
        transition: all;
        background: url('~assets/img/btnDefault.png') no-repeat center;
      }

      .floatL {
        margin-left: 20px;
      }

      .floatR {
        float: right !important;
        margin-right: 20px;
      }

      .active {
        background: url('~assets/img/btnSelected.png') no-repeat center;
        color: #fff;
      }
    }

    .echartBox {
      width: 100%;
      height: calc(100% - 50px);
      position: relative;

      .echart {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        z-index: -1;
      }
    }

    .more-btn {
      z-index: 9;
      width: 500px;
      height: 30px;
      margin-left: 20px;
      position: absolute;
      bottom: 18px;
      background-color: #142128;
      opacity: 0.6;
      text-align: center;

      span {
        cursor: pointer;
        line-height: 30px;
        color: #CCCCCC;
        font-size: 14px;
      }
    }
  }

  .echartIndex {
    opacity: 1 !important;
    z-index: 6 !important;
  }
</style>