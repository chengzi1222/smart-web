<template>
  <div>
    <div class="page-tilt">
      <b></b><span>统计分析 - {{subType}}</span>
    </div>
    <ul class="tab-box">
      <li class="tabLi" v-for="(item,index) in patternLis" :data-index="index" :class="index==chooseNum?'li-bott':''"
          @click="choose(index)">
        <div :data-index='index'>{{item.type}}</div>
      </li>
      <li class="tab-bott"></li>
    </ul>
    <Chart v-if="chooseNum == 0" :subType='subTypeKey'></Chart>
    <Statement v-if="chooseNum == 1" :subType='subTypeKey'></Statement>
  </div>
</template>

<script type="module">
  import Chart from "./chart.vue";
  import Statement from "../subForm/subformType.vue";
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
    },
    computed: {
      subType() {
        if (this.$route.name == 'medicalDevices_subject_statistic.production') {
          return '生产主体'
        }else if (this.$route.name == 'medicalDevices_subject_statistic.manager') {
          return '经营主体'
        }else if (this.$route.name == 'medicalDevices_subject_statistic.employ') {
          return '使用主体'
        }
      },
      subTypeKey() {
        if (this.$route.name == 'medicalDevices_subject_statistic.production') {
          return 'MAAI_PRODUCT'
        } else if (this.$route.name == 'medicalDevices_subject_statistic.manager') {
          return 'MAAI_MANAGER'
        } else if (this.$route.name == 'medicalDevices_subject_statistic.employ') {
          return 'MAAI_EMPLOY'
        }
      }
    },
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