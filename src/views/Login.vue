<template>
  <div class="login-container_" :class="{'login-container':is}">
    <div class="backcolor">
      <img :src="img" class="bg">
      <div v-if="isGaoxin" class="clear_a gxLogo">
        <img :src="gxLogo">
        <div class="line"></div>
        <div class="title">高新智慧食安</div>
      </div>
    </div>
    <div style="position: relative;z-index: 9;">
      <div class="headtxt" v-if="!isGaoxin">
        <span>{{$store.state.common.simpleName}}</span>
      </div>
      <div class="textbox" v-if="!isGaoxin">
        <h2>欢迎登录</h2>
        <p>欢迎来到{{$store.state.common.name}}，请输入手机号或用户名登录</p>
      </div>
      <div class="ipubox" :class="{'gaoxinClass':isGaoxin}">
        <p class="gxTitle" v-if="isGaoxin">欢迎登录</p>
        <el-form autoComplete="on" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
          <el-form-item prop="email">
            <el-input name="email" type="text" autoComplete="on" v-model="loginForm.login" placeholder="请输入手机号或用户名"
              @keyup.enter.native="submit();"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input name="password" type="password" autoComplete="on" v-model="loginForm.password" placeholder="请输入密码"
              @keyup.enter.native="submit();"></el-input>
          </el-form-item>
          <div class="gxBtn" v-if="isGaoxin">
            <el-button type="primary" style="width:100%;" @click="submit()">
              登录
            </el-button>
            <a href="javascript:;" @click="forgetPassword"><span class="wjpass">忘记登录密码了？</span></a>
          </div>
          <el-form-item v-if="!isGaoxin" class="loading_btn btn">
            <el-button type="primary" @click="submit()">
              登录
            </el-button>
            <a href="javascript:;" @click="forgetPassword"><span class="wjpass">忘记登录密码了？</span></a>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="bottxt">
      <p>Copyright&copy;-{{currentYear}} 成都顺点科技有限公司 All Rights Reserved.</p>
      <p class="movePoin" @click="go">蜀ICP备14030915号-1</p>
    </div>
  </div>
</template>

<script>
  import * as storage from "utils/sessionStorage";
  import * as $ from "static/dhplayer/js/jquery-1.11.3.min.js"
  import {
    setLogin
  } from '../router';
  export default {
    created() {
       console.log(this.$store.getters.loginBackground,storage.getCookie('loginBackground'))
      // if (this.$store.getters.loginBackground) {
      //   this.img =this.$store.getters.loginBackground;
      // }else {
      //   this.is = true;
      // }
      console.log(window.location.host)
      if (window.location.host=='smart-sccdgx.ybveg.com') {
        this.isGaoxin = true
      }
    },
    computed:{
      is(){
        return this.$store.getters.loginBackground?false:true
      },
      img(){
        return this.$store.getters.loginBackground?this.$store.getters.loginBackground:require('assets/img/image.jpg')
      }
    },
    mounted() {

      this.currentYear = new Date().getFullYear();
      if (this.$route.name == 'login') {
        storage.setData("isKashiLogin", "false");
      }
      this.getToken();
    },
    data() {
      return {
        isGaoxin: false,
        currentYear: '',
        // is: false,
        // img: require('assets/img/image.jpg'),
        gxLogo: require('assets/img/gxlogo.png'),
        loginForm: {
          login: "",
          password: ""
        },
        ssoLoginForm: {
          tokenId: "",
          ssofrom: ""
        }
      };
    },
    methods: {
      go() {
        window.open('http://www.beian.miit.gov.cn')
      },
      submit() {
        if (this.loginForm.login == "13402874534") {
          this.$store.dispatch("login", this.loginForm).then(
            result => {
              storage.setCookie("system", 'FOOD');
              this.$store.dispatch('getMenus', 'FOOD');
              this.$router.push('/dashboard');
            },
            result => {}
          );
        } else {
          let params = this.$route.params;
          let to = {
            path: "/"
          };
          if (params.name) {
            to = {
              path: params.path,
              name: params.name,
              params: params.params
            };
          }
          this.$store.dispatch("login", this.loginForm).then(
            result => {
              if (this.$store.getters.user.deptType == "JYJ") {
                this.$router.push({
                  path: '/camera'
                });
              } else {
                this.$router.push(to);
              }

            },
            result => {}
          );
        }
      },
      // 忘记密码页面
      forgetPassword() {
        this.$router.push({
          name: "sys.password",
          query: {
            type: "reset",
            step: 1
          }
        });
      },
      successCallback(data) {
        console.log("data------------>", data)
        alert(data)
        /*$.ajax({
          url: '应用接收tokenURL',
          type: 'post',
          data: {
            token: tokenId
          },
          success: function(data) {
            window.location.href = '应用实际内容页URL';
          },
        })*/
      },
      getToken() {
        let ssofrom = this.$route.query.ssofrom;
        if (this.$route.query.ssofrom !== "chengdu") {
          return;
        }
        var that = this
        this.ssoLoginForm.ssofrom = "chengdu"
        $.ajax({
          // url: 'http://110.188.70.244:8090/idp/restful/getIDPToken',
          url: 'http://10.1.239.214:8080/idp/restful/getIDPToken',
          type: 'GET',
          dataType: 'jsonp',
          data: {
            appId: 'zhjg',
            remoteIp: '127.0.0.1'
          },
          jsonp: 'jsonpCallback',
          jsonpCallback: 'successCallback',
          success: function (result) {
            if (JSON.stringify(result) == '{}') {
              return
            }
            if (result && result.data && result.data.isValid == true) {
              $.ajax({
                url: '/api/ssoLogin',
                type: 'post',
                data: {
                  tokenId: result.data.tokenid,
                  ssofrom: "chengdu"
                },
                success: function (data) {
                  if (data.status) {
                    setLogin(true);
                    that.$store.dispatch('getInfo');
                    that.$router.push({name:'index.welcome'});
                  }
                  // if (that.$store.getters.user.deptType == "JYJ") {
                  //   that.$router.push('/dashboard');
                  // }else{
                  //   that.$router.push(to);
                  // }
                },
              })

            }
          }
        });
      },
    },
    watch: {
      '$store.state.common.simpleName': function () {
        if (this.$store.state.common.simpleName) {
          document.title = this.$store.state.common.simpleName;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  body,
  html {
    height: 100%;
  }

  .login-container_ {
    height: 100%;
    position: relative;

    .backcolor {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;

      img.bg {
        width: 100%;
        height: 100%;
        display: block;
      }

      .gxLogo {
        position: absolute;
        top: 40px;
        left: 80px;
        width: 410px;
        height: 60px;

        img {
          width: 94px;
          height: 60px;
          display: block;
        }

        .line {
          height: 50px;
          border-right: 1px solid #FFFFFF;
          width: 30px;
          margin-top: 5px;
          margin-right: 30px;
        }

        .title {
          font-size: 42px;
          font-family: AlibabaPuHuiTiM;
          color: rgba(255, 255, 255, 1);
          line-height: 60px;
          color: #FFFFFF;
        }
      }
    }
  }

  .login-container {
    height: 100%;
    position: relative;
    background-image: url(../assets/img/image.jpg);
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .backcolor {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      // opacity: 0.4;
      background: #2e3034;

      img {
        display: none;
      }
    }
  }

  .headtxt {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #394145;
    font-size: 16px;
    color: #ffffff;

    span {
      margin-left: 240px;
    }
  }

  .textbox {
    width: 240px;
    color: #fff;
    margin: 6vh auto 0;

    h2 {
      font-size: 36px;
      margin-bottom: 20px;
      margin-left: -80px;
    }

    p {
      font-size: 16px;
      line-height: 24px;
      margin-left: -80px;
      width: 420px;
    }
  }

  .ipubox {
    width: 400px;
    margin: 50px auto 40px;
    padding: 5vh 30px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 8px 16px 0 rgba(36, 37, 40, 0.16);
    border-radius: 10px;

    input {
      width: 340px;
      height: 48px;
      background: rgba(138, 141, 146, 0.12);
      border-radius: 4px;
      border: none;
    }

    .btn {
      margin-top: 40px;
      margin-bottom: 0;

      button {
        background-image: linear-gradient(-53deg, #1099f2 0%, #1ec5f6 97%);
        box-shadow: 0 4px 12px 0 rgba(26, 183, 237, 0.53);
        border-radius: 100px !important;
        width: 130px;
        height: 48px !important;
        font-size: 20px;
        color: #fff;
      }

      .wjpass {
        font-size: 14px;
        color: #6d7787;
        float: right;
        line-height: 48px;
      }
    }
  }

  .bottxt {
    position: absolute;
    bottom: 20px;
    opacity: 0.8;
    text-align: center;
    font-size: 12px;
    color: #ffffff;
    line-height: 18px;
    width: 100%;
    z-index: 9;
  }

  .loading_btn {
    width: 342px !important;
  }

  .gaoxinClass {
    position: absolute;
    top: 140px;
    right: 220px;
    width: 400px !important;
    background: linear-gradient(to bottom, rgba(71, 83, 93, 0.8) 0%, rgba(35, 43, 50, 0.8) 100%) !important;

    .gxTitle {
      height: 38px;
      font-size: 26px;
      font-family: PingFangSC-Semibold, PingFang SC;
      color: #fff;
      line-height: 38px;
      margin-bottom: 30px;
      text-align: center;
    }



    .el-form-item {
      margin-bottom: 30px !important;
    }

    .gxBtn {
      button {
        box-shadow: 0 4px 12px 0 rgba(26, 183, 237, 0.53);
        border-radius: 6px !important;
        width: 100% !important;
        height: 42px !important;
        line-height: 42px !important;
        font-size: 16px !important;
        color: #fff;
        padding: 0 !important;
        background: linear-gradient(53deg, rgba(16, 153, 242, 1) 0%, rgba(30, 197, 246, 1) 100%) !important;
      }

      .wjpass {
        font-size: 14px;
        color: #C3CAD5;
        float: right;
        margin-top: 20px;
      }

    }


  }
</style>
<style lang="scss">
 .ipubox .el-input__inner  {
    border: transparent !important;
    box-shadow: 0 0 0px 1000px rgba(138,141,146,0.12) inset !important;
    -webkit-box-shadow: 0 0 0px 1000px rgba(138,141,146,0.12) inset !important;
    outline: none !important;
    height: 48px !important;
    line-height: 48px !important;
    font-size: 14px !important;
    border-radius: 6px !important;
  }
  .gaoxinClass .el-input__inner {
    height: 42px !important;
    line-height: 42px !important;
    border-radius: 6px !important;
    background: #4F5A63 !important;
    font-size: 14px !important;
    box-shadow: 0 0 0px 1000px #4F5A63 inset !important;
    -webkit-box-shadow: 0 0 0px 1000px #4F5A63 inset !important;
    -webkit-text-fill-color: #ffffff !important;
    color: #EEEEEE !important;
    border: transparent !important;
    outline: none !important;
  }

</style>