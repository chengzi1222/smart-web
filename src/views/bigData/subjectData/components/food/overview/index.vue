<template>
  <div class="mapA2 relative">
    <div class="top clear_a">
      <div class="title">天府新区市场监管城市大脑</div>
      <div class="time textR">{{time}}</div>
    </div>
    <ul class="bottom">
      <li class="ass">
        <trace></trace>
        <todayTestData></todayTestData>
      </li>
      <li class="adv"><mapSource></mapSource></li>
      <li class="ass">
        <monitoring></monitoring>
        <regulatoryData></regulatoryData>
      </li>
    </ul>
  </div>
</template>

<script>
  import trace from "./trace.vue";
  import monitoring from "./monitoring.vue";
  import todayTestData from "./todayTestData.vue";
  import regulatoryData from "./regulatoryData.vue";
  import mapSource from "../foodsub/zhouyi/mapSource.vue";
  export default {
    components: {
      trace,mapSource,todayTestData, monitoring, regulatoryData
    },
    data() {
      return {
        time: "",
        timer: null
      }
    },
    mounted() {
      this.timer = setInterval(() => {
        this.timeShow();
      }, 1000);
    },
    beforeDestroy() {
      clearInterval(timer);
    },
    methods: {
      timeShow() {
        let mydate = new Date();
        let str = "" + mydate.getFullYear() + "年";
        let M = mydate.getMonth() + 1;
        if (M < 10) {
          M = "0" + M;
        };
        str += M + "月";
        let D = mydate.getDate();
        if (D < 10) {
          D = "0" + D;
        };
        str += D + "日";
        let h = mydate.getHours();
        if (h < 10) {
          h = "0" + h;
        };
        str += " " + h + " : ";
        let s = mydate.getMinutes();
        if (s < 10) {
          s = "0" + s;
        };
        str += s;
        let se = mydate.getSeconds();
        if (se < 10) {
          se = "0" + se;
        };
        str += " : " + se;
        this.time = str;
      }

    }
  }
</script>
<style lang='scss' scoped>
  .mapA2 {
    height: 100%;
    width: 100%;
    background: url("~assets/img/bigData/subjectData/bigBoxBg.png")
  }
  .top {
    width: 100%;
    height: 90px;
    >div {
      padding: 0 20px;
      width: calc(50% - 42px);
      height: 100%;
      line-height: 90px;
    }
    .title {
      font-size: 36px;
      color: rgba(13, 181, 239, 1);
    }
    .time {
      font-size: 18px;
      color: rgba(221, 221, 221, 1);
    }
  }
  .bottom {
    width: 100%;
    height: calc(100% - 110px);
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
        height: 49%;
        /* border: 1px solid #ccc; */
      }
      div:last-child{
        margin-top: 20px;
      }
    }
  }
</style>