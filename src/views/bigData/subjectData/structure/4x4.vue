<template>
  <div class="layout_4x4">
   <ul class="top clear_a">
     <li class="index4">
       <component :is='data[3].name'></component>
     </li>
     <li class="index5">
        <component :is='data[4].name'></component>
     </li>
     <li class="index6">
        <component :is='data[5].name'></component>
     </li>
     <li class="index7">
        <component :is='data[6].name'></component>
     </li>
   </ul>
   <ul class="bottom clear_a">
     <li class="index1">
        <component :is='data[0].name'></component>
     </li>
     <li class="index2">
        <component :is='data[1].name'></component>
     </li>
     <li class="index3">
        <component :is='data[2].name'></component>
     </li>
     <li class="index8">
        <component :is='data[7].name'></component>
     </li>
   </ul>
  </div>
</template>

<script>
  import console from '../components/food/console.vue';
  import foodsub from '../components/food/foodsub/index.vue';
  import one from '../components/food/typeDistribution.vue';
  import two from '../components/food/growthTrend.vue';
  import three from '../components/food/subjectDistribution.vue';
  import four from '../components/food/center.vue';
  import five from '../components/food/dataDistribution.vue';
  import six from '../components/food/Sudoku.vue';
  import seven from '../components/food/Unit.vue';
  export default {
    components: {
     console,foodsub,one,two,three,four,five,six,seven
    },
    data() {
      return {
        data:[{
          name:'seven',
          index:0
        },{
          name:'four',
          index:1
        },{
          name:'five',
          index:2
        },{
          name:'console',
          index:3
        },{
          name:'three',
          index:4
        },{
          name:'six',
          index:5
        },{
          name:'two',
          index:6
        },{
          name:'one',
          index:7
        }]
      }
    },
    methods:{
      dataFun(){
        let data=[];
        // this.data.forEach((item,idx) => {
        //   if(item.index!=idx){
        //     let num=
        //   }else{
        //     data.push(item);
        //   }
        // });
      }
    }
  }
</script>
<style scoped lang='scss'>
.layout_4x4{
  // width: 100%;
  // height: 100%;
  width:4096px;
  height:2304px;
  overflow: hidden;
  // background: transparent;
  box-sizing: border-box;
  background: url("~@/assets/img/bigData/subjectData/bigBoxBg.png") no-repeat center;
  background-size: 100% 100%;
  .top{
    height: 75%;
    width: 100%;
    li{
       width: 25%;
       height:calc(100% / 3);
       background:transparent;
       box-sizing: border-box;
    }
    .index4{
       width:75%;
       height: 100%;
    }
  }
  .bottom{
    height: 25%;
    width: 100%;
    li{
       width: 25%;
       height: 100%;
       background: transparent;
       box-sizing: border-box;
    }
  }
}
</style>
