<template>
  <div>
    <div class="page-tilt">
      <b></b><span>统计分析 - {{$route.name == 'index_employ'?'使用主体':'经营主体'}}</span>
    </div>
    <ul class="tab-box">
      <li class="tabLi" v-for="(item,index) in patternLis" :data-index="index" :class="index==chooseNum?'li-bott':''"
          @click="choose(index)">
        <div :data-index='index'>{{item.type}}</div>
      </li>
      <li class="tab-bott"></li>
    </ul>
    <Chart v-if="chooseNum == 0"></Chart>
    <Statement v-if="chooseNum == 1"></Statement>
  </div>
</template>

<script>
  import Chart from "./chart.vue";
  import Statement from "./statement.vue";
  export default {
    mounted() {
      
    },
    methods: {
      choose(index){
        this.chooseNum = index;
      }
    },
    data() {
      return {
        chooseNum: 0,
        patternLis: [{
          type: '主体概况'
        }, {
          type: '统计报表'
        }],
      }
    },
    components:{
      Chart,
      Statement
    }
  }
</script>

<style scoped lang="sass">
  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
  }
  .tab-box .tabLi {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9A9A9A;
    text-align: center;
  }
  .tab-box .li-bott {
    border-bottom: 2px solid #0DB5EF;
    z-index: 666;
    position: relative;
  }
</style>