<template>
  <div  class="foosub">
    <mapA v-if="selcted=='mapa'" @switchFun="switch_"></mapA>
    <mapB  v-if="selcted=='mapb'" @switchFun="switch_"></mapB>
  </div>
</template>

<script type="module">
  import mapA from './zhouyi/mapA';
  import mapB from './mapB'
  export default {
    components: {
      mapA,mapB
    },
    data(){
      return{
        selcted:'mapa'
      }
    },
    mounted(){

    },
    methods:{
      switch_(i){
        if(i!=this.selcted){
          this.selcted=i;
        }else{
          return false;
        }
      }
    }
  }
</script>
<style lang='scss' scoped>
.foosub{
  width: 100%;
  height: 100%;
}
</style>

