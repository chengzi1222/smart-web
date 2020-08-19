<template>
  <div class="mainbox">
    <header class="app-header">
      <div class="app-logo">
        智慧食安云平台
      </div>
    </header>
    <div class="innerbox">
      <div>
        <span class="handle">{{ typeName }}密码</span>
        <span v-if="step == 1">
          &nbsp;&nbsp;<back></back>
        </span>
      </div>
      <div class="step-box">
        <div class="item green">
          <div class="sub-item-num">1</div>
          <div class="sub-item-title">验证{{step1name}}</div>
        </div>
        <div class="item-line" :class="[{green:step==2 || step==3},{'update-left-one': type == 'update'}, {'reset-left-one': type == 'reset'}]">
          <div class="line1 line"></div>
        </div>

        <div class="item" :class="{green:step==2 || step==3}">
          <div class="sub-item-num">2</div>
          <div class="sub-item-title">设置新密码</div>
        </div>

        <div class="item-line" :class="[{green:step==3}, {'update-left-two':type=='update'}, {'reset-left-two':type=='reset'}]">
          <div class="line2 line" :class="[{'update-width-two':type=='update'}, {'reset-width-two':type=='reset'}]"></div>
        </div>

        <div class="item" :class="{green:step==3}">
          <div class="sub-item-num">3</div>
          <div class="sub-item-title">完成</div>
        </div>
      </div>

      <div style="width:320px;margin:0 auto">
        <template v-if="step ==1">
          <step-one-old-psd @getToken="getToken" v-if="type == 'update'"></step-one-old-psd>
          <step-one-tel @getToken="getToken" v-if="type == 'reset'"></step-one-tel>
        </template>
        <step-two :token="token" v-if="step==2"></step-two>
        <step-three v-if="step==3"></step-three>
      </div>

    </div>
  </div>

</template>

<script>
  import StepOneOldPsd from "./StepOneOldPsd";
  import StepOneTel from "./StepOneTel";
  import StepTwo from "./StepTwo";
  import StepThree from "./StepThree";

  const tpyes = {
    update: "修改",
    reset: "忘记"
  };

  export default {
    mounted() {
      this.step = this.$route.query.step || 1;
      this.type = this.$route.query.type || "reset";
      this.token = this.$route.query.token || "";
      this.typeName = tpyes[this.type];
      if (this.type == 'update') {
        this.step1name = '原密码'
      } else {
        this.step1name = '手机'
      }
    },
    components: {
      StepOneOldPsd,
      StepOneTel,
      StepTwo,
      StepThree
    },
    data() {
      return {
        type: "",
        typeName: "",
        step1name: "手机",
        token: "",
        step: 0
      };
    },
    methods: {
      getToken(token) {
        this.token = token;
      }
    },
    watch: {
      "$route.query.step": {
        handler() {
          this.step = this.$route.query.step;
          this.token = this.$route.query.token;
        },
        deep: true
      }
    }
  };
</script>

<style lang="sass">
  html,
  body,
  #app,
  .mainbox {
    width: 100%;
    height: 100%;
  }
</style>

<style lang="scss" scoped>
  .app-header {
    background-color: #394145;
    color: #fff;
    font-size: 16px;
    height: 50px;
    line-height: 50px;
  }

  .update-left-one {
    left: 47px !important;
  }

  .reset-left-one {
    left: 40px !important;
  }

  .reset-left-two {
    left: 326px !important;
  }

  .reset-width-two {
    width: 249px !important;
  }

  .update-left-two {
    left: 331px !important;
  }

  .update-width-two {
    width: 245px !important;
  }

  .app-header .app-logo {
    width: 12.5%;
    text-align: center;
  }

  .mainbox {
    display: flex;
    flex-direction: column;
  }

  .innerbox {
    flex: 1;
    width: 980px;
    margin: 20px auto 0;
    .handle {
      font-weight: bold;
      padding-left: 5px;
      font-size: 16px;
      color: #393939;
      border-left: 3px solid #0db5ef;
    }
  }

  .step-box {
    display: flex;
    position: relative;
    width: 600px;
    margin: 60px auto;
    justify-content: space-between;
    .line {
      background-color: #989a9c;
      height: 4px;
      width: 263px;
    }
    .item-line {
      position: absolute;
      top: 10px;
    }
    .item {
      color: #6d7787;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .sub-item-num {
        height: 20px;
        width: 20px;
        line-height: 20px;
        text-align: center;
        border: 2px solid #c2cad2;
        border-radius: 50%;
        margin-bottom: 5px;
      }
    }
  }

  .green {
    color: #32c25e !important;
    .sub-item-num {
      border-color: #32c25e !important;
    }
    .line {
      background-color: #32c25e !important;
    }
  }
</style>