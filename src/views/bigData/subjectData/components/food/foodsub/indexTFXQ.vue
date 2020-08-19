<template>
  <div  class="foosub">
    <mapATFXQ v-if="selcted=='mapa'" @switchFun="switch_"></mapATFXQ>
    <mapB  v-if="selcted=='mapb'" @switchFun="switch_"></mapB>
  </div>
</template>

<script type="module">
  import mapATFXQ from './zhouyiTFXQ/mapA';
  import mapB from './mapB'
  export default {
    components: {
      mapB,mapATFXQ
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

