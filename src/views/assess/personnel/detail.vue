<template>
  <div >
    <div class="page-tilt">
      <b></b><span>人员档案详情</span>
    </div>
    <yuanben-tab style="padding-left:0" :tabs="tabs" label="name" value="tab" :tab="active" @tab-change="choose"></yuanben-tab>
    <baseDetail v-if='active=="base"'></baseDetail>
  </div>
</template>

<script>
import YuanbenTab from 'components/common/YuanbenTab'
import baseDetail from './detailCom/detail'
  export default {
    data() {
      return {
          active:'base',
          tabs:[{tab: "base", name: "基础信息"},{tab: "train", name: "培训记录"},{tab: "assess", name: "考核记录"}]
      }
    },
    components:{
        YuanbenTab,baseDetail
    },
    mounted() {
    },
    methods: {
        choose(tab){
            this.active=tab;
        }
    },
    watch: {}
  };
</script>

<style scoped lang="scss">
  
</style>