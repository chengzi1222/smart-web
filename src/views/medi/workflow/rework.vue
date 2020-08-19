<template>
	<div style="position: relative;">
		<div class="page-tilt">
			<b></b><span>{{title}}</span>
		</div>
    <div style="font-size: 18px;margin-right: 1px;margin-top:7px;padding-left:20px">
      <span>主体名称：{{entityName}}</span>
    </div>
		<YuanbenTab :tabs="tabs" label="name" value="tab" :tab="tab" @tab-change="choose" width="120px"></YuanbenTab>
    <info-entering :entityType="this.$route.query.entityTypeExt" :type="'rework'" @getEntityName="getEntityName" :entityId="this.$route.query.entityId" v-if="tab == 'change' || 'rework'" :supply="this.$route.query.workId"></info-entering>
    <entity-info :entityId="this.$route.query.entityId" v-if="tab=='entityInfo'"></entity-info>
  </div>
</template>

<script>
	import YuanbenTab from 'components/common/YuanbenTab';
	import InfoEntering from 'views/medi/subject/enteringModule/InfoEntering';
  import { getTitle, getTabs } from 'views/medi/subject/entityUtils'
  import EntityInfo from 'views/medi/subject/entityInfo'
	export default {
		mounted() {
      const entityType = this.$route.query.entityType
      const entityTypeExt = this.$route.query.entityTypeExt;
      const ext = this.$route.query.ext
      this.title = getTitle(entityType, entityTypeExt, ext)
      this.tabs = getTabs(entityType, entityTypeExt, ext)
      this.tab = this.tabs[0].tab
		},
		methods: {
			//切换导航样式
			choose(tab) {
				if (this.tab !== tab) {
					this.tab = tab
				}
			},
      getEntityName (entityName) {
        this.entityName = entityName
      }
		},
		data(){
			return{
        title: '',
				tabs:[],
				tab: '',
        entityName: '',
        entityTypeExt:'',
			}
		},
		components: {
			YuanbenTab,
      EntityInfo,
      InfoEntering
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
