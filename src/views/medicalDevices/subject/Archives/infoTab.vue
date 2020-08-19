<template>
	<div style="position: relative;">
		<div class="page-tilt">
			<b></b><span>{{title}}</span>
		</div>
    <div style="font-size: 20px;margin-right: 1px;margin-top:5px;">
      <span>{{entityName}}</span>
      <span style="color:#A2AAB6;margin-right:20px;">
        <qrcode v-if="shows" :url="this.entityUrl" :backImg="this.backImg" :datas="this.entityInfos" v-on:refreshbizlines="downloadImage"></qrcode>
      </span>
    </div>
		<YuanbenTab :tabs="tabs" label="name" value="tab" :tab="tab" @tab-change="choose" width="120px" v-if="tab !== 'rework'"></YuanbenTab>
    <product-add v-if="$route.query.entityType === 'MAAI_PRODUCT' && (tab == 'change'||tab == 'rework')" :type="$route.query.ext" :entityId="$route.query.entityId" :workId="workId"></product-add>
    <manager-add v-if="$route.query.entityType === 'MAAI_MANAGER' && (tab == 'change'||tab == 'rework')" :type="$route.query.ext" :entityId="$route.query.entityId" :workId="workId"></manager-add>
    <employ-add v-if="$route.query.entityType === 'MAAI_EMPLOY' && (tab == 'change'||tab == 'rework')" :type="$route.query.ext" :entityId="$route.query.entityId" :workId="workId"></employ-add>
    <!-- 1.entityType 2. type=‘rework’ 3. entityId 4.supply=‘工单id’-->
    <entity-info @getEntityName="getEntityName" :entityId="entityId" :entityType="$route.query.entityType" v-if="tab=='entityInfo'"></entity-info>
    <backup-edit-record  :entityId="entityId" v-if="tab == 'backupEditRecord'" :Routepush="true" ></backup-edit-record>
  </div>
</template>

<script type="module">
  import YuanbenTab from 'components/common/YuanbenTab';
  import ProductAdd from './product/add'
  import EmployAdd from './employ/add'
  import ManagerAdd from './manager/add'
  import EntityInfo from './infoEntity'
  import BackupEditRecord from './backupEditRecord'
  import { getTitle, getTabs } from './entityUtils'

  import { get } from 'api/medicalDevices/entity'
  import qrcode from 'components/QRcode'
	export default {
		mounted() {
      this.init()
		},
		methods: {
      //切换导航样式
      init () {
        const entityType = this.$route.query.entityType
        const ext = this.$route.query.ext
        this.entityId = this.$route.query.entityId
        this.workId = this.$route.query.workId
        this.title = getTitle(entityType, ext);
        this.tabs = getTabs(entityType, ext);
        this.tab = this.tabs[0].tab;
        if(this.$route.query.type&&this.$route.query.type=='rework'){
          this.type_=this.$route.query.type;
        }else{
          this.getENtityInfo();
        }
      },
			choose(tab) {
				if (this.tab !== tab) {
					this.tab = tab
				}
			},
      getEntityName (entityName) {
        this.entityName = entityName;
      },
      async getENtityInfo(){
        get(this.entityId).then(r => {
          this.entityInfos = r.data;
          //二维码
          this.entityUrl = `${this.$store.getters.base.qrUrl.qrUrl}?t=M_ENTITY&v=1&id=` + this.entityId;
           if(this.$store.state.common.user.areaCode.substring(0,4)=='4419'){//处理东莞环境
              this.backImg = require('assets/img/codeBackDG.png');
            }else{
              this.backImg = require('assets/img/codeBack.png');
            }
          this.shows = true;
          this.entityName = r.data.entityName
        })
      },
      downloadImage() {
        //      downQR(this.entityId);
      }
		},
		data(){
			return{
        type_:'change',
        title: '',
				tabs:[],
				tab: '',
        workId:'',
        entityId: '',
        entityName: '',
        entityUrl: '',
        shows: false,
        backImg: "",
        entityInfos:{}
			}
		},
		components: {
			YuanbenTab,
      EntityInfo,
      ProductAdd,
      EmployAdd,
      ManagerAdd,
      qrcode,
      BackupEditRecord
    },
    watch: {
      '$route' () {
        const _path =  this.$route.path
        if (_path === '/medicalDevices/subject/employ/detail' || 
        _path === '/medicalDevices/subject/manager/detail' || 
        _path === '/medicalDevices/subject/product/detail') {
          this.init()
        }
      }
    }
	}
</script>

<style scoped lang="sass">
	.toLead{
		position: absolute;
		right: 0px;
    z-index: 6;
    margin-top: 5px;
	}
</style>
