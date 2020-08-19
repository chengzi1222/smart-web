<template>
  <div class="box">
    <h3>溯源数据</h3>
    <ul class="infoBox" :class="next? 'next':''" v-if="datas.length">
      <li class="one">
        <h3>溯源信息</h3>
        <h2 class="spaceNowrap" style="max-width: 300px;">{{datas[indexs].pdtName}}</h2>
        <p class="status">{{datas[indexs].detecResultStr}}</p>
        <img src="~assets/img/subjectData/4kTrace/traceLeftB.png" alt="">
        <div class="titInfo">
          <p class="tit">种养殖/生产环节</p>
          <p class="info">{{datas[indexs].seller}}</p>
        </div>
        <div class="titInfo">
          <p class="tit">流通环节</p>
          <p class="info">{{datas[indexs].sourceName}}</p>
        </div>
        <div class="titInfo">
          <p class="tit">消费环节</p>
          <p class="info">{{datas[indexs].buyer}}</p>
        </div>
        <div class="detectionInfo">
          <h4>检测信息</h4>
          <p><span>检测人：</span>{{datas[indexs].detecPerson}}</p>
          <p><span>抑制率：</span>{{datas[indexs].actualVal}}</p>
          <p><span>检测时间：</span>{{datas[indexs].detecTime}}</p>
        </div>
      </li>
      <li class="two">
        <h3>溯源信息</h3>
        <h2 class="spaceNowrap" style="max-width: 300px;">{{datas[indexs+1].pdtName}}</h2>
        <p class="status">{{datas[indexs+1].detecResultStr}}</p>
        <img src="~assets/img/subjectData/screen2line.png" alt="">
        <div class="titInfo">
          <p class="tit">种养殖/生产环节</p>
          <p class="info">{{datas[indexs+1].seller}}</p>
        </div>
        <div class="titInfo">
          <p class="tit">流通环节</p>
          <p class="info">{{datas[indexs+1].sourceName}}</p>
        </div>
        <div class="titInfo">
          <p class="tit">消费环节</p>
          <p class="info">{{datas[indexs+1].buyer}}</p>
        </div>
        <div class="detectionInfo">
          <h4>检测信息</h4>
          <p><span>检测人：</span>{{datas[indexs+1].detecPerson}}</p>
          <p><span>抑制率：</span>{{datas[indexs+1].actualVal}}</p>
          <p><span>检测时间：</span>{{datas[indexs+1].detecTime}}</p>
        </div>
      </li>
      <li class="three">
        <h3>溯源信息</h3>
        <h2>{{datas[indexs+2].pdtName}}</h2>
        <p class="status">{{datas[indexs+2].detecResultStr}}</p>
        <img src="~assets/img/subjectData/screen2line.png" alt="">
        <div class="titInfo">
          <p class="tit">种养殖/生产环节</p>
          <p class="info">{{datas[indexs+2].seller}}</p>
        </div>
        <div class="titInfo">
          <p class="tit">流通环节</p>
          <p class="info">{{datas[indexs+2].sourceName}}</p>
        </div>
        <div class="titInfo">
          <p class="tit">消费环节</p>
          <p class="info">{{datas[indexs+2].buyer}}</p>
        </div>
        <div class="detectionInfo">
          <h4>检测信息</h4>
          <p><span>检测人：</span>{{datas[indexs+2].detecPerson}}</p>
          <p><span>抑制率：</span>{{datas[indexs+2].actualVal}}</p>
          <p><span>检测时间：</span>{{datas[indexs+2].detecTime}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { getUnquaPdt } from "api/trace/supervise.js";
  export default {
    props: {
      buyerCode: {
        default: function () {
          return ''
        }
      }
    },
    data() {
      return {
        items: null,
        next: false,
        datas:[],
        indexs: 0
      }
    },
    mounted() {
      this.items = setInterval(() => {
        this.next = true;
        setTimeout(() => {
          this.next = false;
          this.indexs++;
          if(this.indexs >= this.datas.length-2){
            this.indexs = 0;
          }
        }, 800);
      }, 10000);
      this.postDatas()
    },
    methods: {
      postDatas() {
        getUnquaPdt({ buyerCode: this.buyerCode}).then(r => {
          this.datas = r.data;
        })
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
      position: relative;
      margin-top: 80px;
      height: 410px;
      height: calc(100% - 170px);
      overflow: hidden;
      li{
        position: absolute;
        height: 720px;
        background: url('~assets/img/subjectData/4kTrace/traceB.png');
        background-repeat: no-repeat;
        transition: all 0s;
        left: 50%;
        top: 0;
        padding: 40px 60px;
        box-sizing: border-box;
        h3{
          font-size: 32px;
          color: #eee;
          font-weight: normal;
          margin-left: 20px;
          padding-top: 0px;
        }
        h2{
          font-size: 48px;
          color: #eee;
          font-weight: normal;
          position: absolute;
          right: 60px;
          top: 40px;
        }
        .status{
          font-size: 48px;
          color: #59AC67;
          font-weight: normal;
          position: absolute;
          right: 60px;
          bottom: 40px;
        }
        img{
          width: 18px;
          height: 242px;
          position: absolute;
          top: 122px;
          left: 40px;
        }
        .titInfo{
          margin-top: 32px;
          margin-left: 20px;
          .tit{
            color: #ddd;
            font-size: 24px;
          }
          .info{
            color: #eee;
            font-size: 28px;
            margin-top: 10px;
          }
        }
        .detectionInfo{
          position: absolute;
          bottom: 40px;
          left: 80px;
          color: #eee;
          h4{
            font-size: 32px;
            margin-bottom: 40px;
          }
          p{
            font-size: 24px;
            margin-top: 20px;
          }
        }
      }
      .one{
        width: 660px;
        top: 40px;
        margin-left: -330px;
        z-index: 1;
      }
      .two{
        width: 560px;
        top: 20px;
        margin-left: -280px;
        opacity: .4;
      }
      .three{
        width: 440px;
        top: 0;
        margin-left: -220px;
        opacity: .4;
      }
    }
    .next{
      li{
        transition: all .8s !important;
      }
      .one{
        width: 660px;
        top: 360px;
        margin-left: -330px;
        opacity: 0;
      }
      .two{
        width: 660px;
        top: 40px;
        margin-left: -330px;
        opacity: 1;
        z-index: 2;
      }
      .three{
        width: 560px;
        top: 20px;
        margin-left: -280px;
        opacity: .4;
      }
    }
  }
</style>