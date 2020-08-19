<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>生产使用单位档案</span>
    </div>
    <h2 class="mt20 nameH2">
      {{$route.query.name}}
      <!-- <qrcode :url="entityUrl" :backImg="this.backImg" :datas="this.entityInfos"></qrcode> -->
    </h2>
    <YuanbenTab class="mt10" :tabs="tabs" label="name" value="tab" :tab="tab" @tab-change="choose" width="120px"></YuanbenTab>
    <info v-if="tab == 'info'"></info>
    <!-- <equipment v-if="tab == 'equipment'"></equipment> -->
  </div>
</template>

<script>
  import qrcode from 'components/QRcode';  
  import YuanbenTab from 'components/common/YuanbenTab';
  import info from './info.vue'
  import equipment from './equipment.vue'
  export default {
    data() {
      return {
        entityUrl: "http://tog-test.ybveg.com/qrv1?t=M_ENTITY&v=1&id=59d1a17a13d311e99815000c296fc49a",
        backImg: "/static/img/codeBack.0b8b45c.png",
        entityInfos: { "backupStateStr": "有效", "riskRankStr": null, "manageTypeStr": "", "gridName": "白莲社区", "infoAssi": "0b156ec254e911e8b1eb7cd30ae07f60", "syj": "fe460edd54e311e8b1eb7cd30ae07f60", "infoAssiMobile": "13100000011", "realityAddr": "fsdfsdf ", "optState": "ALREADY_FILE", "manageWay": "", "quanLevelStr": null, "chainType": "", "enterpriseForm": "OTHER_MANAGER", "idNo": "", "syjName": "白莲池街道食品药品监督管理所", "infoAssiName": "张新国", "creditCode": "354tgfb", "entityName": "sdgsdg ", "legalPerson": "dg ", "backupNo": "354trgfgh", "registerAddr": "fdsfsd ", "id": "59d1a17a13d311e99815000c296fc49a", "manageState": "NORMAL", "so": "a252d7e9eeef11e89815000c296fc49a", "quanLevel": null, "organizationTypeStr": "", "entityType": "MEDICINE", "riskRank": null, "corpName": "df ", "qualityPerson": "", "manageStateStr": "正常营业", "enterpriseTypeStr": "", "corpMobile": "18923001230", "enterpriseType": "", "organizationType": "", "manageRangeStr": "", "areaCode": "51010800010001", "entityTypeExt": "MEDICINE_MANAGER", "soMobile": "13100000001", "grid": "a07827b854e411e8b1eb7cd30ae07f60", "chainTypeStr": "", "soName": "路人甲", "backupState": "EFFECTIVE", "manageWayStr": "", "recordEnd": "2019-01-31", "enterpriseFormStr": "其他经营主体", "recordBegin": "2019-01-09" },
        tabs: [{
          name: '基本信息',
          tab: 'info'
        // },{
        //   name: '设备档案',
        //   tab: 'equipment'
        }],
        tab: 'info'
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
      qrcode, YuanbenTab,
      info, equipment
    }
  }
</script>

<style scoped lang="sass">
  .nameH2{
    font-weight: normal;
    font-size: 20px;
  }
</style>