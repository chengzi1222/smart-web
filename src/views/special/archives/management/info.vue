<template>
  <div class="bigbox">
    <div class="page-tilt" style="position:fixed;top:50px;background: #fff;z-index: 99;">
      <b></b><span>设备档案详情</span>
    </div>
    <h2 class="nameH2" style="position:fixed;top:86px;background: #fff;z-index: 99;padding-top: 10px;">
      <span class="tit">注册代码：</span>{{$route.query.code}}
      <span></span>
    </h2>
    <YuanbenTab style="position:fixed;top:122px;background: #fff;z-index: 99;" :tabs="tabs" label="name" value="tab" :tab="tab" @tab-change="choose" width="120px"></YuanbenTab>
    <equipment style="margin-top: 160px;" v-if="tab == 'equipment'"></equipment>
    <verify style="padding-top: 130px;" v-if="tab == 'verify'"></verify>
    <edit style="padding-top: 130px;" v-if="tab == 'edit'"></edit>
  </div>
</template>

<script>
  import YuanbenTab from 'components/common/YuanbenTab';
  import equipment from './infoComm/equipment.vue';
  import verify from './infoComm/inspectionRecord.vue';
  import edit from './infoComm/editList.vue';
  export default {
    data() {
      return {
        tabs: [{
          name: '设备档案',
          tab: 'equipment'
        },{
        //   name: '检查记录',
        //   tab: 'examine'
        // },{
          name: '检验记录',
          tab: 'verify'
        },{
          name: '编辑记录',
          tab: 'edit'
        }],
        tab: 'equipment'
      }
    },
    mounted() {
    },
    methods: {
      //切换导航样式
      choose(tab) {
        if (this.tab !== tab) {
          this.tab = tab
        }
      },
    },
    components: {
      YuanbenTab,
      equipment , verify, edit
    }
  }
</script>

<style scoped lang="sass">
  .nameH2{
    font-weight: normal;
    font-size: 20px;
    width: 100%;
    color: #393939;
    .tit{
      color: #A2AAB6;
      font-size:15px;
    }
  }
</style>