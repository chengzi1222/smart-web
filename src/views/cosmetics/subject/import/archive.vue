<template>
	<div style="position: relative;">
		<div class="page-tilt">
			<b></b><span>批量导入-{{title}}</span>
		</div>
		<YuanbenTab :tabs="tabs" label="name" value="tab" :tab="tab" @tab-change="choose" width="120px"></YuanbenTab>
    <import v-if="tab == 'import'" :entityType="$route.params.type"></import>
    <review v-if="tab == 'review'" @changeTab="changeTab" :entityType="$route.params.type"></review>
		<info @back="goBack" v-if="tab === 'info'" :data="data"></info>
  </div>
</template>

<script>
  import YuanbenTab from 'components/common/YuanbenTab';
  import Import from './import'
	import Review from './review'
	import { getTitle } from 'views/subject/import/importUtils'
	import info from './info'
	import { getInfo } from 'api/cosmetics/importentity'
	export default {
		mounted() {
      this.type = this.$route.params.type
      if (!this.type) {
        return
			}
			this.title = getTitle('cosmetic', this.type)
		},
		methods: {
			//切换导航样式
			choose(tab) {
				if (this.tab !== tab) {
					this.tab = tab
				}
			},
			changeTab (method, entityId) {
				if (method === 'info') {
					this.tabs = [{name: '主体详情', tab: method}]
					this.tab = method
					getInfo(entityId).then(r => {
						this.data = r.data
					})
				} else if (method === 'edit') {
					this.tab = method
					this.tabs = [{name: '编辑', tab: method}]
				}
			},
			goBack() {
				this.tabs = [
          {name: '导入', tab: 'import'},
          {name: '审核', tab: 'review'}
					]
				this.tab = 'review'
			}
		},
		data(){
			return{
				tabs:[
          {name: '导入', tab: 'import'},
          {name: '审核', tab: 'review'}
          ],
        tab: 'import',
				type: '',
				title: '',
				data: {}
			}
		},
		components: {
      YuanbenTab,
      Import,
			Review,
			info
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
