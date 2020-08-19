<template>
  <div class="popup-box" v-show='isShow'>
    <div class="popup-div" ref="popup" :style="{width:width+'px'}">
      <div class="head clearfix mb20">
        <span class="title">{{title}}</span>
        <i class="el-icon-close icon" @click="handleClick" v-if="ischoose"></i>
      </div>
      <div class="body">
        <slot name="body"></slot>
      </div>

      <div class="foot">
        <slot name="foot"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props:{
      ischoose:{
        type:Boolean,
        default:true
      },//右上角叉叉
      isShow:{},
      title:{
        type:String
      },
      width:{
        type:String,
        default:function(){
          return "690"
        }
      }
    },
    data(){
      return{

      }
    },

    methods:{
      handleClick(){
        this.$emit("close")
      }
    }
  }
</script>


<style scoped lang="scss">
  .popup-box{
    position: fixed;
    background: rgba(0,0,0,.5);
    top: 0px;
    bottom:0;
    left:0;
    right:0;
    z-index: 3000;
  }
  .popup-div{
    /* border: 1px solid #ccc; */
    background: #fff;
    width: 690px;
    padding-bottom: 20px;
    box-sizing: border-box;
    margin:5% auto 0;
  .head{
    height:40px;
    line-height: 40px;
    background: #F2F5F8;
    font-size: 16px;
    position: relative;
  .title{
    position: absolute;
    left: 20px;
    top: 0px;
    color: #393939;
    font-size: 14px;
  }
  .icon{
    position: absolute;
    right: 20px;
    top: 12px;
    cursor: pointer;
    color: #9A9A9A;
  }
  }
  .body{
  .form-item{
    text-align: center;
    margin: 20px 0;
  }
  }
  .foot{
    text-align: right;
    // height: 20px;
    // line-height: 20px;
    padding: 0 20px;
  }
  }
</style>
