<template>
    <div class="warnStatistics">
        <div class="title">
            <p>高新区高风险大数据平台</p>
        </div>
       <mapBox></mapBox>
       <subjectPie ></subjectPie>
       <assessRank @ifrShow='iframe'></assessRank>
       <riskTypePie @ifrShow='iframe'></riskTypePie>
       <riskDispose  @ifrShow='iframe'></riskDispose>
        <div class="ifrBox" v-if="ifrShow">
        <iframe name="myiframe" :src="`${httpName}${hostName}${routerName}`" width="1800" height="800"
            frameborder="0"></iframe>
        <i class="el-icon-error closeP movePoin" @click="ifrShow=false"></i>
        </div>
    </div>
</template>

<script>
import mapBox from "./map";
import subjectPie from "./subjectPie";
import assessRank from "./assessRank";
import riskDispose from "./riskDispose";
import riskTypePie from "./riskTypePie";
export default {
  components: {
    mapBox,
    subjectPie,
    riskTypePie,
    riskDispose,
    assessRank
  },
  data() {
    return {
      routerName: "",
      httpName: "",
      hostName: "",
      ifrShow: false
    };
  },

  async mounted() {
    this.hostName = window.location.host;
    this.httpName = window.location.protocol + "//";
  },
  methods: {
    iframe(url) {
      this.ifrShow = true;
      this.routerName = url;
    }
  }
};
</script>
<style scoped lang="scss">
.warnStatistics {
  width: 100%;
  height: 100%;
  background: #10161b;
  > .title {
    position: fixed;
    z-index: 2;
    left: 0;
    top: 0;
    width: 100%;
    height: 90px;
    background: url("~assets/img/warnTopTitle.png") no-repeat center;
    p {
      text-align: center;
      width: 100%;
      font-size: 48px;
      line-height: 90px;
        color:#27C5D9;
      background: #27C5D9;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
.ifrBox {
  background: #fff;
  width: 1800px;
  height: 800px;
  position: fixed;
  top: 50%;
  margin-top: -400px;
  left: 50%;
  margin-left: -900px;
  z-index: 999;
  .closeP {
    font-size: 80px;
    padding-right: 10px;
    color: #fff;
    position: absolute;
    bottom: -100px;
    left: 50%;
  }
}
</style>
