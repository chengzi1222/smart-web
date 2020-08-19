<template>
    <div id="riskTypePie">
       <p>风险类型分布</p>
       <div class="echartBox" id="echartBox"></div>
    </div>

</template>

<script>
import * as echartFun from "./echarts";
import * as api from "api/xcws/warn/warnTwo";
export default {
  data() {
    return {
      data: [
        {
          key: "0101",
          name: "疑是过期食品",
          value: 0,
          url: "/xcwsWarn/food"
        },
        {
          key: "0302",
          name: "健康证",
          value: 0,
          url: "/xcwsWarn/healthCert"
        },
         {
          key: "0303",
          name: "许可证",
          value: 0,
          url: "/xcwsWarn/licence"
        },
        {
          key: "0102",
          name: "溯源异常",
          value: 0,
          url: "/xcwsWarn/trace"
        },
        {
          key: "0201",
          name: "检测异常",
          value: 0,
          url: "/xcwsWarn/check"
        },
        {
          key: "0401",
          name: "投诉建议",
          value: 0,
          url: "/xcwsWarn/complaint"
        },
        {
          key: "0301",
          name: "监管检查",
          value: 0,
          url: "/xcwsWarn/supervise"
        },
        {
          key: "0103",
          name: "后厨管理不规范",
          value: 0,
          url: "/xcwsWarn/kitchen"
        },
        {
          key: "0202",
          name: "AI摄像头预警",
          value: 0,
          url: "/xcwsWarn/AIWarnList"
        }
      ],
      total:0
    };
  },
  mounted() {
    this.ifrShow();
  },
  methods: {
    async ifrShow() {
      let list=[];
      await api.getRiskTypeDtr().then(r => {
        if(r.status){
          this.total=r.data.totalRiskNum;
          let map=r.data.riskMap;
          this.data.map(item=>{
            if(map[item.key]){
              item.value=map[item.key];
              list.push(item)
            }
          })
        }
      });
      echartFun.echartsPie(this.total,list, "echartBox", params => {
        console.log(params);
        if (params.url) {
          this.$emit("ifrShow", params.url);
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
#riskTypePie {
  width: 540px;
  height: 430px;
  position: fixed;
  z-index: 2;
  right: 20px;
  top: 110px;
  background: url("~assets/img/boxBG.png") no-repeat center;
  > p {
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 20px;
    color: #fff;
  }
  .echartBox {
    width: 100%;
    height: calc(100% - 30px);
    color: #fff;
  }
}
</style>
