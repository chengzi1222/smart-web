<template>
    <div id="riskTrendLine" >
       <p>风险趋势</p>
       <div class="clear_a btnBox">
           <div class="floatL" :class="{'active':active=='heiRisk'}" @click="active='heiRisk'">高风险主体数量趋势</div>
           <div class="floatR" :class="{'active':active=='risk_'}"  @click="active='risk_'">风险总数趋势</div>
       </div>
       <div class="echartBox">
            <div class="echart" id="heiRisk" :class="active=='heiRisk'?'echartIndex':''" >高风险主体数量趋势</div>
            <div class="echart" id="risk_" :class="active=='risk_'?'echartIndex':''">风险总数趋势</div>
       </div>
</div>

</template>

<script>
import * as echartFun from "./echarts";
import * as api from "api/xcws/warn/warnTwo";
export default {
  data() {
    return {
      active: "heiRisk"
    };
  },
  async mounted() {
    this.heiRisk();
  },
  methods: {
    heiRisk() {
      api.getHighRiskNum().then(r => {
        if (r.status) {
          let data = {};
          data.line = "#FD4F41";
          data.seriesName = "高风险主体数量";
          data.areaBg = "#0B4A5E";
          data.areaBg2 = "#10799B";
          data.data = [];
          data.xData = [];
          let list =r.data.reverse()
          list.map(item => {
            data.data.push(item.num);
            data.xData.push(item.month);
          });
          echartFun.echartsLine(data, "heiRisk");
        }
      });
      api.getRiskTotalNum().then(r => {
        if (r.status) {
          let data = {};
          data.line = "#FD4F41";
          data.seriesName = "风险总数";
          data.areaBg = "#0B4A5E";
          data.areaBg2 = "#10799B";
          data.data = [];
          data.xData = [];
          let list =r.data.reverse()
          list.map(item => {
            data.data.push(item.num);
            data.xData.push(item.month);
          });
          echartFun.echartsLine(data, "risk_");
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
#riskTrendLine {
  width: 540px;
  height: 500px;
  position: fixed;
  z-index: 2;
  right: 20px;
  bottom: 20px;
  background: url("~assets/img/boxBG500.png") no-repeat center;
  > p {
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
    > div {
      width: 160px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #cccccc;
      font-size: 14px;
      margin-top: 20px;
      transition: all;
      background: url("~assets/img/btnDefault.png") no-repeat center;
    }
    .floatL {
      margin-left: 20px;
    }
    .floatR {
      float: right !important;
      margin-right: 20px;
    }
    .active {
      background: url("~assets/img/btnSelected.png") no-repeat center;
      color: #fff;
    }
  }
  .echartBox {
    width: 100%;
    height: calc(100% - 80px);
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
}
.echartIndex {
  opacity: 1 !important;
  z-index: 6 !important;
}
</style>
