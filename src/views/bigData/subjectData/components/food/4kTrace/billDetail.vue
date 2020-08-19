<template>
  <div class="box">
    <h3>账单明细</h3>
    <div class="numDiv floatL movePoin" @click="routerChange">
      订单总数<span>{{orderNum}}</span>单
    </div>
    <div class="numDiv floatL movePoin" @click="routerChange">
      订单总金额<span>{{(rankTotal / 10000).toFixed(2)}}</span>万元
    </div>
    <div class="headDiv">
      <span class="no">序号</span>
      <span class="name">配送商</span>
      <span class="code">品种数</span>
      <span class="shoop">成交总金额</span>
      <span class="time">配送日期</span>
    </div>
    <div class="tabDiv" @mouseenter="enterFun" @mouseleave="leaveFun">
      <ul class="tabUl" :style="{top: ulTop+'px'}">
        <li v-for="(item,index) in tabDatas">
          <span class="no">{{index+1}}</span>
          <span class="name">{{item.dlrName}}</span>
          <span class="code">{{item.pdtNum}}种</span>
          <span class="shoop">{{item.orderAmount}}元</span>
          <span class="time">{{item.date}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { odpage } from "api/trace/bill.js"
  export default {
    props: {
      schoolCode: {
        default: function () {
          return ''
        }
      },
      schoolName: {
        default: function () {
          return ''
        }
      },
      rankTotal: {
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
        orderNum:0,
        tabDatas: [],
        ulTop: 0,
        Interval: null,
        pageNumber: 0
      }
    },
    watch: {
      schoolCode: function(){
        this.tabDatas = [];
        this.pageNumber = 0;
        this.postList();
        console.log('this.pageNumber', this.pageNumber)
      }
    },
    mounted() {
      this.postList()
      console.log('this.pageNumber---mounted', this.pageNumber)
    },
    methods: {
      routerChange() {
        let dates = new Date();
        let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        let transferData = dates.getFullYear() + "-" + mon;
        this.$emit('routerChange', `/yb/bill/detail?source=4k&guid=${this.schoolCode}&date=${transferData}&areaId=5101&buyerName=${this.schoolName}`)
      },
      postList() {
        this.pageNumber++;
        let dates = new Date();
        let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        let form = new FormData();
        form.append('guid', this.schoolCode);
        form.append('type', 'order');
        form.append('sDate', dates.getFullYear() + "-" + mon + "-01");
        form.append('eDate', dates.getFullYear() + "-" + mon + "-31");
        form.append('pageSize', 20);
        form.append('pageNumber', this.pageNumber);
        clearInterval(this.Interval)
        odpage(form).then(d => {
          this.tabDatas = this.tabDatas.concat(d.data);
          this.orderNum = d.pageObj.totalRecords;
          this.$emit('orderNum', d.pageObj.totalRecords)
          this.Interval = setInterval(() => {
            if (this.ulTop < -(this.tabDatas.length-8) * 70) {
              this.ulTop = 0;
            } else {
              this.ulTop--;
            }
          }, 30);
          if(this.tabDatas.length < d.pageObj.totalRecords){
            setTimeout(() => {
              this.postList()
            }, 50000);
          }
        })
      },
      enterFun() {
        clearInterval(this.Interval);
      },
      leaveFun() {
        this.Interval = setInterval(() => {
          if (this.ulTop < -(this.tabDatas.length - 8) * 70) {
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
    .numDiv{
      background: url('~assets/img/subjectData/4kTrace/numDivBg.png');
      background-size: 100% 100%;
      height:80px;
      width: 400px;
      line-height: 80px;
      margin-left: 40px;
      margin-top: 90px;
      color: #fff;
      font-size: 24px;
      padding-left: 40px;
      box-sizing: border-box;
      span{
        color:#FDA947;
        margin-left: 40px;
        font-size: 40px;
        margin-right: 20px;
      }
    }
    .tabDiv{
      height: 560px;
      overflow: hidden;
      position: relative;
    }
    .headDiv{
      margin-top: 210px;
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
        width: 60px;
        text-align: center;
      }
      .name{
        width: 170px;
      }
      .code {
        width: 110px;
      }
      .shoop {
        width: 240px;
      }
      .time {
        width: 120px;
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
          width: 60px;
          text-align: center;
        }
        .name{
          width: 170px;
        }
        .code {
          width: 110px;
        }
        .shoop {
          width: 240px;
        }
        .time {
          width: 120px;
        }
      }
      li:nth-of-type(odd){ 
        background:rgba(18,49,57,.8);
      }
    }
  }
</style>