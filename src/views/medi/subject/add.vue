<template>
	<div style="position: relative;">
		<div class="page-tilt">
			<b></b><span>{{title}}录入</span>
		</div>
		<!-- <div class="toLead">
			<el-button @click="">批量导入</el-button>
			<el-button @click="">下载导入模板</el-button>
		</div> -->
		<YuanbenTab :tabs="tabs" label="name" value="tab" :tab="tab" @tab-change="choose" width="120px"></YuanbenTab>
		<InfoEntering :type="type" :entityType="$route.params.type.toUpperCase()" @dataChange="dataChange" :backupId="backupId" @getTab="getTab" v-if="tab == 'entering'"></InfoEntering>
		<Draft :entityType="$route.params.type.toUpperCase()" @getBackupId="getBackupId" @dataChange="dataChange" v-if="tab == 'draft'"></Draft>
	</div>
</template>

<script>
	import YuanbenTab from 'components/common/YuanbenTab';
	import InfoEntering from './enteringModule/InfoEntering'
	import Draft from './enteringModule/Draft'
	import { getTotalCount } from 'api/medi/subject/manageEntity'
	import { getEntityName } from './entityUtils'
	export default {
		mounted() {
			this.title = getEntityName("MEDICINE", this.$route.params.type.toUpperCase())
      this.initCount()
		},
		methods: {
			//切换导航样式
			choose(tab) {
				if (this.tab !== tab) {
					this.tab = tab
				}
        this.backupId = ''
			},
      getBackupId (backupId, type) {
        this.backupId = backupId
				this.type = type
        this.tab = 'entering'
      },
      initCount() {
        getTotalCount('MEDICINE', this.$route.params.type.toUpperCase()).then(r => {
					this.tabs[1].num = r.data.total
        })
      },
      getTab (tab) {
        this.tab = tab
      },
      dataChange () {
        this.initCount()
      }
		},
		data(){
			return{
				title: '' ,
				type: 'add',
        backupId: '',
				tabs:[{
					name: '信息录入',
					tab:'entering'
				},{
					name: '草稿箱',
					tab:'draft',
          num: 0
				}],
				tab:'entering'
			}
		},
		components: {
			YuanbenTab,
			InfoEntering,
			Draft
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
