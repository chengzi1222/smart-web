<template>
  <div :id="pieId" style="width: 100%;height:100%;"></div>
</template>

<script>
  // 引入echarts图表
  import pie from '../echarts/pie_echarts';

  export default {
    props:{
      pieId: {
        type: String,
      },
      pieData:{
        type:Object,
      }
    },
    mounted(){
      pie(this.pieData,this.pieId);
    },
    watch:{
      pieData(val){
        pie(val,this.pieId)
      }
    },
    components:{
    },
    methods: {

    },
    data() {
      return {

      };
    }
  };
</script>

<style scoped lang='scss'>

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9a9a9a;
    text-align: center;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0db5ef;
    z-index: 666;
    position: relative;
  }

  .li-bott span {
    color: #393939;
  }

  .tab-box .tab-bott {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 2px;
    background: #ebf1f5;
  }

  .main-body {
    padding: 20px;
    position: relative;
    background: #edf0f3;
  }

  .state .state-item {
    text-align: center;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .state .state-item .state-item-num {
    font-size: 36px;
    color: #333;
  }
  .state .state-item .state-item-name {
    font-size: 16px;
    color: #a2aab6;
  }

  section.select .el-select {
    margin-top: 20px;
    margin-right: 20px;
    width: 150px;
  }

  .charts {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .charts .charts-item {
    box-sizing: border-box;
    padding: 10px;
    background: #fff;
    height: 340px;
    margin-top: 20px;
  }
  .charts .charts-item .title {
    font-size: 15px;
    color: #393939;
  }

  .main-body{
    margin-left: -20px;
    width: 100%;
  }
</style>