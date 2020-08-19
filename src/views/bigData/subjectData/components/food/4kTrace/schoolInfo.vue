<template>
  <div class="box">
    <h3>学校概况</h3>
    <div class="infoBox">
      <img class="floatL" :src="require('assets/img/subjectData/4kTrace/schoolImg.png')" alt="">
      <div>
        <h4>{{schoolInfo.buyerName}}</h4>
        <p>学校地址：{{schoolInfo.address}}</p>
        <p>学校类型：{{schoolInfo.scTypeName}}</p>
        <p>法人/负责人：{{schoolInfo.legalPerson}}</p>
        <p>联系方式：{{schoolInfo.tel}}</p>
      </div>
    </div>
    <div class="headDiv">
      <span class="no">序号</span>
      <span class="name">食材供应商</span>
      <span class="code">负责人</span>
      <span class="time">联系方式</span>
    </div>
    <div class="tabDiv" @mouseenter="enterFun" @mouseleave="leaveFun" v-if="datas.length>0">
      <ul class="tabUl" :style="{top: ulTop+'px'}">
        <li v-for="(item,index) in datas">
          <span class="no">{{index+1}}</span>
          <span class="name">{{item.supplierName}}</span>
          <span class="code">{{item.legalPerson}}</span>
          <span class="time">{{item.tel}}</span>
        </li>
      </ul>
    </div>
    <p v-if="datas.length==0" style="font-size: 28px;text-align: center;color: #fff;line-height: 280px;">暂无数据</p>
  </div>
</template>

<script>
  import { getSchoolInfo } from 'api/trace/supervise.js'
  export default {
    props: {
      buyerCode: {
        default: function () {
          return ''
        }
      }
    },
    beforeDestroy: function () {
      clearInterval(this.Interval)
    },
    data() {
      return {
        items: null,
        next: false, 
        ulTop: 0,
        Interval: null,
        schoolInfo:{},
        datas:[],
        indexs: 0
      }
    },
    mounted() {
      this.getSchoolInfo()
    },
    methods: {
      getSchoolInfo() {
        getSchoolInfo(this.buyerCode).then(r => {
          console.log('getSchoolInfo', r)
          this.schoolInfo = r.data.schoolInfo;
          this.datas = r.data.supplierList;    
          this.Interval = setInterval(() => {
            if (this.ulTop < -(this.datas.length - 5) * 70) {
              this.ulTop = 0;
            } else {
              this.ulTop--;
            }
          }, 30);
        })
      },
      enterFun() {
        clearInterval(this.Interval);
      },
      leaveFun() {
        this.Interval = setInterval(() => {
          if (this.ulTop < -(this.datas.length - 5) * 70) {
            this.ulTop = 0;
          } else {
            this.ulTop--;
          }
        }, 30);
      }
    }
  }
</script>
<style lang='scss' scoped>
  .box{
    background: url('~assets/img/subjectData/4kTrace/allLiB.png');
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100%;
    h3{
      font-weight: normal;
      color: #eee;
      font-size: 40px;
      color:#EEEEEE;
      padding-top: 20px;
      margin-left: calc(17%);
    }
    .infoBox{
      margin-top: 75px;
      padding: 0 40px;
      color: #fff;
      >div{
        margin-left: 300px;
      }
      img {
        width: 260px;
        height: 260px;
        border-radius: 50%; 
        margin-right: 40px;
      }
      h4{
        font-size: 40px;
        margin-bottom: 5px;
      }
      p{
        font-size: 24px;
        margin-top: 25px;
      }
    }
    .tabDiv{
      height: 360px;
      overflow: hidden;
      position: relative;
    }
    .headDiv{
      margin-top: 80px;
      height: 80px;
      line-height: 80px;
      font-size: 26px;
      font-weight: 700;
      color: #fff;
      span{
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-left: 35px;
        text-align: center;
      }
      .no{
        width: 80px;
        text-align: center;
      }
      .name{
        width: 340px;
        text-align: left;
      }
      .code {
        width: 130px;
      }
      .time {
        width: 200px;
      }
    }
    .tabUl{
      padding: 0 1px;
      position:absolute;
      li{
        color: #fff;
        height: 70px;
        line-height: 70px;
        font-size: 20px;
        text-align: center;
        span{
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-left: 35px;
        }
        .no{
          width: 80px;
          text-align: center;
        }
        .name{
          width: 340px;
          text-align: left;
        }
        .code {
          width: 130px;
        }
        .time {
          width: 200px;
        }
      }
      li:nth-of-type(odd){ 
        background:rgba(18,49,57,.8);
      }
    }
  }
</style>