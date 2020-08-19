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
		<YuanbenTab :tabs="tabs" label="name" value="tab" :tab="tab" @tab-change="choose" width="120px"></YuanbenTab>
    <info-entering :entityType="this.$route.query.entityType" :type="type_" :supply='this.$route.query.supply'
                    @getEntityName="getEntityName" :entityId="entityId" v-if="tab == 'change'||tab == 'rework'">
    </info-entering>
    <!-- 1.entityType 2. type=‘rework’ 3. entityId 4.supply=‘工单id’-->
    <entity-info :entityId="entityId" :entityType="this.$route.query.entityType" v-if="tab=='entityInfo'"></entity-info>
		<backup-edit-record :Routepush="true" :entityId="entityId" v-if="tab == 'backupEditRecord'" style="margin-left:0px;"></backup-edit-record>
		<entity-patrol-record :entityId="entityId" v-if="tab == 'patrolRecord'"></entity-patrol-record>
  </div>
</template>

<script>
  import YuanbenTab from 'components/common/YuanbenTab';
  import InfoEntering from './addEntering';
  import EntityInfo from './infoEntity'
  import EntityPatrolRecord from 'views/medi/patrol/record/entityPatrolRecord'
  import { getTitle, getTabs } from './entityUtils'

  import { getInfo } from 'api/cosmetics/subject'
  import BackupEditRecord from './backupEditRecord'
  import qrcode from 'components/QRcode';
	export default {
		mounted() {
      const entityType = this.$route.query.entityType
      const ext = this.$route.query.ext
      this.entityId = this.$route.query.entityId
      this.title = getTitle(entityType, ext);
      this.tabs = getTabs(entityType, ext);
      this.tab = this.tabs[0].tab;
      if(this.$route.query.type&&this.$route.query.type=='rework'){
        this.type_=this.$route.query.type;
      }else{
        this.getENtityInfo();
      }
      
		},
		methods: {
			//切换导航样式
			choose(tab) {
				if (this.tab !== tab) {
					this.tab = tab
				}
			},
      getEntityName (entityName) {
        this.entityName = entityName;
      },
      async getENtityInfo(){
        getInfo(this.entityId).then(r => {
          this.entityInfos = r.data;
          //二维码
          this.entityUrl = `${this.$store.getters.base.qrUrl.qrUrl}?t=M_ENTITY&v=1&id=` + this.entityId;
           if(this.$store.state.common.user.areaCode.substring(0,4)=='4419'){//处理东莞环境
              this.backImg = require('assets/img/codeBackDG.png');
            }else{
              this.backImg = require('assets/img/codeBack.png');
            }
          this.shows = true;
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
			InfoEntering,
			BackupEditRecord,
			EntityPatrolRecord,
      qrcode
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
