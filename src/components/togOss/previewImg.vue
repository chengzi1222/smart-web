<template>
  <div class="imgBox_" v-if="showImg">
    <p class="imgTitle">{{title}}( {{index+1}}/{{imgList.length}} )</p>
    <div class='big-img relative'>
      <i @click="close" class="close el-icon-close"></i>
      <div class="opreBtn prev" @click="preImg" v-if="imgList.length>1 && index+1>1"><i class="el-icon-arrow-left"></i>
      </div>
      <div class="opreBtn next fr" @click="nextImg" v-if="imgList.length>1 && index+1<imgList.length"><i
          class="el-icon-arrow-right"></i></div>
      <img class="img_" :src="imgList[index]">
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      showImg: { //是否打开图片预览
        type: Boolean,
        default: false
      },
      title: { //是否传入特定标题,不传则默认
        type: String,
        default: "查看图片附件"
      },
      imgList: { //传入图片链接数组
        type: Array,
        default: []
      },
      currentIndex: { //当前默认第几张
        type: Number,
        default: 0
      },
    },
    data() {
      return {
        index: 0
      };
    },
    watch: {
      currentIndex(val){
        this.index = val
      }
    },
    methods: {
      close() {
        this.index = 0;
        this.$emit("close");
      },
      preImg() {
        this.index--
      },
      nextImg() {
        this.index++
      }
    }
  };
</script>
<style lang="scss" scoped>
  .imgBox_ {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    z-index: 1999;
    background: rgba(0, 0, 0, 0.3);

    .imgTitle {
      font-size: 20px;
      font-family: AlibabaPuHuiTiR;
      color: #fff;
      line-height: 24px;
      text-align: center;
      margin-top: 50px;
    }

    .close {
      font-size: 30px;
      color: #ccc;
      top: 50px;
      right: 50px;
      position: absolute;
      cursor: pointer;
    }

    .big-img {
      height: 100%;
      width: 100%;
      position: fixed;
      left: 0px;
      top: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999;

      >.img_ {
        display: block;
        max-height: 700px;
      }

      .opreBtn {
        width: 60px;
        height: 60px;
        border-radius: 100%;
        position: absolute;
        top: 50%;
        transform: translate(-50%);
        background: rgba(0, 0, 0, 0.7);
        text-align: center;
        line-height: 76px;
        cursor: pointer;

        >i {
          font-size: 36px;
          color: #ccc;
        }
      }

      .prev {
        left: 60px;
      }

      .next {
        right: 10px;
      }

      .previewImg {
        position: absolute;
        width: 500px;
        height: 500px;
        top: 76px;
        left: 200px;
      }
    }
  }
</style>
