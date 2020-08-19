<template>
  <div id="app" :class="{'userAgentBox':userAgentClass,'userAgentIE10':userAgent}">
    <div v-if="userAgent" class="userAgent">您的IE浏览器内核版本过低，建议您使用使用IE10以上的浏览器或谷歌浏览器！
      <a href="https://sm.myapp.com/original/Browser/66.0.3359.139_chrome_installer_x64.exe">点击下载谷歌浏览器</a>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import { setData } from './utils/sessionStorage';
 
  export default {
    data() {
      return {
        userAgent: false,
        userAgentClass: false
      }
    },
    created() {
      this.$store.dispatch('getHome_');
      const $this = this;
      window.onbeforeunload = () => {
        let data = JSON.stringify($this.$route.params)
        if (data != "{}") {
          setData($this.$route.path, data)
        }
      }
    },
    methods: {
      isSupportPlaceholder() {
        var input = document.createElement('input');
        return 'placeholder' in input;
      }
    },
    mounted() {
      const $this = this;
      if (window.location.pathname == "/subjectData/4k") {
          $this.$store.dispatch("login", { login: "15600355194", password: "111111" }).then(r => {
            $this.$router.push({ name: 'subjectData.4k' })
          })
      }
      // 获取服务器时间
      window.onresize = () => {
        let clientHeight = 0;
        let clientWidth = 0;
        if (document.getElementsByClassName("app-main").length > 0) {
          clientHeight = document.getElementsByClassName("app-main")[0].clientHeight;
          clientWidth = document.getElementsByClassName("app-main")[0].clientWidth;
        }
        $this.$store.dispatch("setClientHeight", clientHeight);
        $this.$store.dispatch("setClientWidth", clientWidth);
      }

      var userAgent = navigator.userAgent;
      //判断是否为ie浏览器
      if (userAgent.indexOf('Trident') != -1) {
        this.userAgentClass = true;
      }
      //判断是否为ie10以上
      if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion < 10 || !this.isSupportPlaceholder()) {
          this.userAgent = true;
        }
      }
    },
    name: 'app',
  }
</script>

<style scoped lang="scss">
  @import './assets/css/com.css';
  @import './assets/css/theme-chalk/index.css';
  @import './assets/css/fontCss/demo.css';
  @import './assets/css/fontCss/iconfont.css';
  @import './assets/css/ieStyle.css';
  @import './assets/css/element-ui-style.css';
  #app {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    height: 100%;
  }

  body {
    margin: 0px;
  }

  /* 滚动条样式  */

  .vb>.vb-dragger {
    z-index: 5;
    width: 12px;
    right: 0;
  }

  .vb>.vb-dragger>.vb-dragger-styler {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: rotate3d(0, 0, 0, 0);
    transform: rotate3d(0, 0, 0, 0);
    -webkit-transition: background-color 100ms ease-out, margin 100ms ease-out,
    height 100ms ease-out;
    transition: background-color 100ms ease-out, margin 100ms ease-out,
    height 100ms ease-out;
    background-color: rgba(48, 121, 244, 0.1);
    margin: 5px 5px 5px 0;
    border-radius: 20px;
    height: calc(100% - 10px);
    display: block;
  }

  .vb.vb-scrolling-phantom>.vb-dragger>.vb-dragger-styler {
    background-color: rgba(48, 121, 244, 0.3);
  }

  .vb>.vb-dragger:hover>.vb-dragger-styler {
    background-color: rgba(48, 121, 244, 0.5);
    margin: 0px;
    height: 100%;
  }

  .vb.vb-dragging>.vb-dragger>.vb-dragger-styler {
    background-color: rgba(48, 121, 244, 0.5);
    margin: 0px;
    height: 100%;
  }

  .vb.vb-dragging-phantom>.vb-dragger>.vb-dragger-styler {
    background-color: rgba(48, 121, 244, 0.5);
  }
</style>