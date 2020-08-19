<template>
  <div class="back" @click="goBack"><i class="icon iconfont icon-back"></i></div>
</template>

<script>
  export default{
    props: {
      assignURL: {
        type: String,
        default: ""
      },
    },
    mounted() {
   
    },
    methods:{
      goBack(){
        if(this.assignURL==""){
          history.back();
        }else{
           this.$router.push({name: this.assignURL});
        }
        
      }
    }
  }
</script>

<style scoped lang="sass">
  .back{
    cursor: pointer; 
    display: inline-block;
    color: #606979;
    height: 22px;
    width: 22px;
    line-height: 22px;
  }
  .back i{
    font-size: 22px !important;
  }
</style>