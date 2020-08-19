<template>
    <div class="mapbox">
        <div class="tab_map clear_a">
            <div class="tab_left bor8" :class="{'active':'subMap'==tab_type}" @click="tapChange('subMap')"></div>
            <div  class="tab_right bor8"  :class="{'active':'repatrol'==tab_type}"  @click="tapChange('repatrol')"></div>
        </div>
        <subMap  v-if="'subMap'==tab_type"></subMap>
        <repatrolMap v-if="'repatrol'==tab_type"></repatrolMap>
    </div>
</template>

<script>
import subMap from './map';
import repatrolMap from './repatrolMap';


export default {
  data() {
    return {
        tab_type:'subMap'
    };
  },
  mounted() {

  },
  methods: {
      tapChange(type){
          this.tab_type=type;
      }
  },
  components: {
      subMap,repatrolMap
  }
};
</script>

<style scoped lang='scss'>
.mapbox{
    width: calc(100% + 40px);
    height: 100%;
    margin-left: -20px;
    .tab_map{
        z-index: 9999;
        width: 210px;
        height: 82px;
        box-sizing: border-box;
        background:rgba(21,25,32,0.8);
        right: 30px;
        position: fixed;
        bottom: 30px;
        cursor: pointer;
        .tab_left{
            background: url("~@/assets/img/map/Bitmap_defauilt.png") no-repeat center center;
        }
        .tab_right{
            background: url("~@/assets/img/map/Bitmap.png") no-repeat center center;
        }
        div{
            border: 1px solid transparent;
            width: 83px;
            height: 60px;
            margin: 10px;
            background-size: 100%;
            // &:hover{
            //      border: 1px solid #0db5ef;
            // }
        }
        .active{
            border: 1px solid #0db5ef;
        }

    }
}
</style>

