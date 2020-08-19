<template>
  <div>
    <ul class="verifyStep relative">
      <li class="step">
        <div class="content stepOne relative">
          <img
            src="../../../../assets/img/success.png"
            v-if="current == 2 || current == 3"
            class="iconImg"
          />
          <div class="icon iconActive" v-if="current == 1">1</div>
          <p class="title" :class="current == 1?' titleActive':''">填写基本信息</p>
        </div>
        <div class="stepLine one" :class="current == 2?'stepActive':''"></div>
      </li>
      <li class="step">
        <div class="content stepTwo">
          <img src="../../../../assets/img/success.png" v-if="current == 3" class="iconImg" />
          <div
            class="icon"
            :class="current == 2?'iconActive':''"
            v-if="current == 2 || current == 1"
          >2</div>
          <p class="title" :class="current == 2?' titleActive':''">添加检查项目</p>
        </div>
        <div class="stepLine two" :class="current == 3?'stepActive':''"></div>
      </li>
      <li class="step">
        <div class="content stepThree">
          <div class="icon" :class="current == 3?'iconActive':''">3</div>
          <p class="title" :class="current == 3?' titleActive':''">添加检查内容</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    current: {
      type: Number,
      default:1
    }
  },
  data() {
      return{}
  }

}
</script>
<style lang="scss" scoped>
.verifyStep {
  width: 100%;
  height: 142px;
  list-style: none;
  .step {
    display: inline-block;
    .content {
      text-align: center;
      .icon {
        width: 30px;
        height: 30px;
        background-color: #EFF2F5;
        border-radius: 50%;
        color: #A2AAB6;
        text-align: center;
        display: inline-block;
        font-size: 16px;
        line-height: 28px;
        margin-top: 18px;
        border:1px solid rgba(194,202,210,1);
      }
      .iconImg {
        @extend .icon;
        border:none;
        margin-bottom: -7px;
      }
      .iconActive {
        background-color: #0db5ef;
        color:#fff;
        border:none;
      }
      .title {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #a2aab6;
        margin-top: 16px;
      }
      .titleActive {
        color: #0db5ef;
      }
    }
    .stepOne {
      position: absolute;
      top: 15px;
      left: 20px;
    }
    .stepTwo {
      position: absolute;
      top: 15px;
      left: 330px;
    }
    .stepThree {
      position: absolute;
      top: 15px;
      left: 655px;
    }
    .stepLine {
      width: 214px;
      height: 2px;
      background-color: #c2cad2;
      position: absolute;
    }
    .stepActive {
      background-color: #0db5ef;
    }
    .one {
      top: 47px;
      left: 113px;
    }
    .two {
      top: 47px;
      left: 423px;
    }
  }
}
</style>

