<template>
  <div class="app-wrapper">
    <keep-alive>
      <header-page key="app-header-page"></header-page>
    </keep-alive>
    <section class="app-container">
      <div class="content">
        <h2>您好，欢迎使用{{$store.state.common.user.persoName ? $store.state.common.user.persoName :
      $store.state.common.name}}</h2>
        <h3>请选择你要进入的系统:</h3>
        <div class="select-box">
          <div @click="handleClick(item,index)" class="select-item" v-for="(item,index) in labels"
            :class="{'disabled':item.isDisabled,'active':item.value===currentSys}" :key="item.value">
            <i class="icon iconfont" :class="item.icon"></i>
            <span>{{item.label}}</span>
          </div>
        </div>
        <div class="welcomeBackground" v-if='!is'>
          <img :src="img" />
        </div>
        <img class="imgo" v-if='is' src="../../assets/img/welcomeBg.png" alt="" />
        <img class="imgt" v-if='is' src="../../assets/img/texture_x2.png" alt="" />
      </div>
    </section>
  </div>
</template>

<script>
  import {
    getEnums
  } from 'api/common.js';
  import HeaderPage from 'components/layout/Header';
  import * as base from 'api/login.js';
  import * as storage from "utils/sessionStorage";
  import bus from 'utils/eventBus';

  export default {
    created() {
      if (this.$store.getters.welcomeBackground) {
        this.img = this.$store.getters.welcomeBackground
      } else {
        this.is = true;
      }
      let areaCode = ''
      areaCode = this.$store.getters.user.areaCode
      if (this.$store.getters.user.userType != "ADMIN" && areaCode.slice(0, 6) == "510109" &&
        window.location.host == 'smart-sccdgx.ybveg.com') {
        // 高新
        storage.setCookie("system", 'FOOD');
        this.$router.replace({
          path: '/gaoxinHome'
        })
      }
    },
    async mounted() {
      if (storage.getCookie('is-login') === 'true') {
        let {
          data
        } = await base.getLabelAuth();

        getEnums(['com.ybveg.govx.enums.LabelEnum'], false).then(res => {
          const d = res.data;
          // 清空labels
          this.labels.splice(0, this.labels.length);

          for (let item of d) {
            let obj = {
              label: item.name,
              value: item.key,
              icon: this.config[item.key].icon,
              isDisabled: !data.includes(item.key)
            };

            this.labels.push(obj);
          }
        });
        if (this.$store.getters.user.realName == "顺点-曹建") {
          this.$router.push({
            name: 'yb.monitoring',
            query: {
              only: 1
            }
          })
        }
        if (this.$store.getters.user.deptType == "JYJ") {
          storage.setCookie("system", 'FOOD');
          this.$router.push({
            path: '/camera'
          })
        }
        //如果有选中的设置改选中项为激活状态
        const label = storage.getCookie("system");
        if (label) {
          this.currentSys = label;
        }

        storage.setCookie("system", 'INDEX')
      }

    },
    data() {
      return {
        img: '',
        is: false,
        config: {
          FOOD: {
            icon: "icon-food"
          },
          MEDICINE: {
            icon: "icon-drug"
          },
          MEDICAL_EQUIPMENT: {
            icon: "icon-medical"
          },
          COSMETIC: {
            icon: "icon-cosmetic"
          },
          SPECIAL_EQUIPMENT: {
            icon: "icon-devices"
          },
          BIG_DATA: {
            icon: "icon-transaction"
          },
          NEWS: {
            icon: "icon-devices"
          },
          SYSTEM: {
            icon: "icon-system"
          },
          GUARD: {
            icon: "icon-system"
          }
        },
        currentSys: '', //当前系统
        labels: []
      }
    },
    methods: {
      handleClick(item, index) {
        //如果当前为禁用，点击不做任何操作
        if (item.isDisabled) {
          return
        }
        this.currentSys = item.value;
        storage.setCookie("system", item.value);
        this.$store.dispatch('getMenus', item.value);
        //点击加载菜单
        if (item.value == "GUARD") {
          this.$router.push('/guard/list');
        } else {
          this.$router.push('/dashboard');
        }
      }
    },
    components: {
      HeaderPage
    }
  }
</script>

<style lang="scss" scoped>

  .welcomeBackground {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: -3;

    >img {
      width: 100%;
      height: 100%;
    }
  }

  $disabled_color: #d1d3d6;
  $normal_color: #767778;
  $active_color: #0db5ef;

  .content {
    text-align: center;
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    z-index: -1;

    .select-box {
      font-size: 20px;
      width: 520px;
      margin: 0 auto;
      margin-top: 50px;
      text-align: left;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

      .select-item {
        margin-bottom: 20px;
        margin-right: 13px;
        cursor: pointer;
        width: 160px;
        height: 80px;
        line-height: 80px;
        box-sizing: border-box;
        background: transparent;
        border: 1px solid $normal_color;
        color: $normal_color;

        &:hover {
          border: 1px solid $active_color;

          // color: $active_color;
          .icon {
            color: $active_color;
          }
        }

        .icon {
          margin: 0 18px;
          color: $normal_color;
          font-size: 20px;
        }
      }

      .disabled {
        cursor: not-allowed;
        border: 1px solid $disabled_color !important;
        color: $disabled_color !important;

        .icon {
          color: $disabled_color !important;
        }
      }

      .active {
        border: 1px solid $active_color;
        color: $normal_color;

        .icon {
          color: $active_color;
        }
      }
    }

    h2 {
      font-size: 48px;
      color: #393939;
      font-weight: normal;
      margin-top: 110px;
    }

    h3 {
      font-size: 24px;
      color: #a2aab6;
      font-weight: normal;
      margin-top: 20px;
    }

    .imgo {
      position: absolute;
      width: 1200px;
      height: 450px;
      bottom: 0px;
      left: 50%;
      margin-left: -600px;
      z-index: -1;
    }

    .imgt {
      position: absolute;
      width: 100%;
      height: 626px;
      bottom: 0;
      left: 0;
      z-index: -2;
    }
  }
  
  .app-wrapper {
    position: fixed;
    height: 100%;
    width: 100%;
    z-index: 2;
    overflow: auto;
  }
</style>