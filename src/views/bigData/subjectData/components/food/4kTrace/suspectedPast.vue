<template>
  <div class="box">
    <h3>疑似过期食品预警</h3>
    <div class="numDiv movePoin" @click="routerChange">
      预警数量<span>{{warningNum}}</span>
    </div>
    <div class="headDiv">
      <span class="no">序号</span>
      <span class="name">采购单位</span>
      <span class="code">所属区域</span>
      <span class="shoop">预警商品</span>
      <span class="time">预警时间</span>
    </div>
    <div class="tabDiv" @mouseenter="enterFun" @mouseleave="leaveFun">
      <ul class="tabUl" :style="{top: ulTop+'px'}">
        <li v-for="(item,index) in tabDatas" class="movePoin" @click="routerChangeLi(item)">
          <span class="no">{{index+1}}</span>
          <span class="name">{{item.buyerName}}</span>
          <span class="code">{{item.areaName}}</span>
          <span class="shoop">{{item.pdts}}</span>
          <span class="time">{{item.waringDate}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import { postList } from "api/trace/pastFood"
  export default {
    beforeDestroy: function () {
      clearInterval(this.Interval)
    },
    props: {
      warningNum:{
        default: function() {
          return ''
        }
      }
    },
    data() {
      return {
        tabDatas: [],
        ulTop: 0,
        Interval: null,
        pageNumber: 0
      }
    },
    mounted() {
      this.postList()
    },
    methods: {
      routerChange() {
        this.$emit('routerChange', '/yb/pastFoodIndex/pastFood?source=4k')
      },
      routerChangeLi(item) {
        this.$emit('routerChange', `/yb/pastFoodIndex/list?deptCode=${item.deptCode}&buyerName=${item.buyerName}&person=${item.person}&tel=${item.tel}&scType=${item.scType}&areaName=${item.areaName}&waring=${item.waring}&waringDate=${item.waringDate}&source=4k`)
      },
      postList() {
        this.pageNumber++;
        let form = new FormData();
        form.append('areaId', '5101');
        form.append('status', 'WARING');
        form.append('pageSize', 20);
        form.append('pageNumber', this.pageNumber);
        clearInterval(this.Interval)
        postList(form).then(d => {
          this.tabDatas = this.tabDatas.concat(d.data)
          this.Interval = setInterval(() => {
            if(this.ulTop< -(this.tabDatas.length-8)*70){
              this.ulTop=0;
            }else {
              this.ulTop--;
            }
          }, 30);
          if(this.tabDatas.length < d.pageObj.totalRecords) {
            setTimeout(() => {
              this.postList()
            }, 50000);
          }
        })
      },
      enterFun(){
        clearInterval(this.Interval);
      },
      leaveFun(){
        this.Interval = setInterval(() => {
          if (this.ulTop < -(this.tabDatas.length-8) * 70) {
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
      width:260px;
      height:75px;
      line-height: 75px;
      margin-left: 40px;
      margin-top: 90px;
      color: #fff;
      font-size: 24px;
      padding-left: 40px;
      span{
        color:#FDA947;
        margin-left: 40px;
        font-size: 40px;
      }
    }
    .tabDiv{
      height: 560px;
      overflow: hidden;
      position: relative;
    }
    .headDiv{
      margin-top: 40px;
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