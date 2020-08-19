<template>
  <div class="boxDiv">
    <div class="leftDiv">
      <div style="height:33.33%;padding: 40px;box-sizing: border-box;">
        <component class="assistant" :is="data[0].name"></component>
      </div>
      <div style="height:33.33%;padding: 40px;box-sizing: border-box;">
        <component class="assistant" :is="data[1].name"></component>
      </div>
      <div style="height:33.33%;padding: 40px;box-sizing: border-box;">
        <component class="assistant" :is="data[2].name"></component>
      </div>
    </div>
    <div class="contentDiv">
      <component style="width:33.33%;height:33.33%;transform: scale(3);transform-origin: 0 0;" :is="data[3].name"></component>
    </div>
    <div class="rightDiv">
      <div style="height:33.33%;padding: 40px;box-sizing: border-box;">
        <component class="assistant" :is="data[4].name"></component>
      </div>
      <div style="height:33.33%;padding: 40px;box-sizing: border-box;">
        <component class="assistant" :is="data[5].name"></component>
      </div>
      <div style="height:33.33%;padding: 40px;box-sizing: border-box;">
        <component class="assistant" :is="data[6].name"></component>
      </div>
    </div>
  </div>
</template>

<script> 
  import one from '../components/food/typeDistribution.vue';
  import two from '../components/food/growthTrend.vue';
  import three from '../components/food/subjectDistribution.vue';
  import four from '../components/food/center.vue';
  import five from '../components/food/dataDistribution.vue';
  import six from '../components/food/Sudoku.vue';
  import seven from '../components/food/Unit.vue';
  export default {
    data() {
      return {
        data:[{
          name:'one'
        },{
          name:'two'
        },{
          name:'three'
        },{
          name:'four'
        },{
          name:'five'
        },{
          name:'six'
        },{
          name:'seven'
        }]
      }
    },
    components: {
      one, two, three, four, five, six, seven
    }
  }
</script>

<style scoped lang="sass">
  .boxDiv{
    width: 100%;
    height: 100%;
    display: flex;
  }
  .leftDiv,
  .rightDiv{
    width: 20%;
    height: 100%;
  }
  .contentDiv{
    height: 100%;
    width: 60%;
    padding: 40px 0;
    box-sizing: border-box;
  }
  
  .assistant{
    height: 100%;
  }
</style>