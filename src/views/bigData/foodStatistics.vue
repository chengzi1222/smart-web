<template>
  <div class="box">
    
    <ul class="statistics clear_a">
        <li>
            <p>主体总数</p>
            <p class="num">{{ statistics.total }}</p>
        </li>
        <li>
            <p>生产主体</p>
            <p class="num">{{ statistics.PRODUCT }}</p>
        </li>
        <li>
            <p>餐饮主体</p>
            <p class="num">{{ statistics.RESTAURANT }}</p>
        </li>
        <li>
            <p>流通主体</p>
            <p class="num">{{ statistics.CIRCULATION }}</p>
        </li>
        <li>
            <p>三小</p>
            <p class="num">{{ statistics.CFDA }}</p>
        </li>
    </ul>
  </div>
</template>

<script>

import {chartPie} from "api/sub/map";

export default {
  data() {
    return {
      statistics:{
          CIRCULATION:'',
          PRODUCT:'',
          RESTAURANT:'',
          CFDA:'',
          total:''
      }
    };
  },
  mounted() {
    this.statisticsMap();
  },
  methods: {
    statisticsMap(){
        chartPie('ALL').then(r=>{
            this.statistics.total=parseFloat(r.data.total).toLocaleString();
            let list=r.data.list;
            list.forEach(i=>{
                if(i.type=='CIRCULATION'){
                     this.statistics.CIRCULATION=parseFloat(i.num).toLocaleString();
                };
                if(i.type=='PRODUCT'){
                     this.statistics.PRODUCT=parseFloat(i.num).toLocaleString();
                };
                if(i.type=='RESTAURANT'){
                     this.statistics.RESTAURANT=parseFloat(i.num).toLocaleString();
                };
                if(i.type=='CFDA'){
                     this.statistics.CFDA=parseFloat(i.num).toLocaleString();
                };
            });
        })
    },
  },
 
};
</script>

<style scoped lang='scss'>
.box{
    width: 100%;
    height: 100%;
    background:rgba(41,43,45,1);
}
.statistics{
    height: 176px;
    width: calc(100% - 40px);
    background:rgba(65,69,76,.85);
    position: absolute;
    left: 20px;
    z-index: 3;
    top: 20px;
    >li{
        width: 18%;
        padding:0 1%;
        text-align: center;
        p{
            font-size:24px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(162,170,182,1);
            line-height:33px;
            margin-top: 47px;
        }
        .num{
            margin-top:0px;
            font-size:48px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(255,255,255,1);
            line-height:67px;
        }
    }
}
</style>


