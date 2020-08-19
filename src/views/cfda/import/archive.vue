<template>
	<div style="position: relative;">
		<div class="page-tilt">
        <b></b><span>批量导入-三小</span>
    </div>
    <div class="form-item mt20">主体类型:
        <el-button class="ml20" :type="chooseBtn == 0? 'primary':''" @click="toType('WORKSHOP',0)">小作坊</el-button>
        <el-button :type="chooseBtn == 1? 'primary':''" @click="toType('SALE',1)">小经营店(销售)</el-button>
        <el-button :type="chooseBtn == 2? 'primary':''" @click="toType('CFDARESTAURANT',2)">小经营店(餐饮)</el-button>
        <el-button :type="chooseBtn == 3? 'primary':''" @click="toType('VENDORS',3)">小摊贩</el-button>
    </div>
		<YuanbenTab :tabs="tabs" label="name" value="tab" :tab="tab" @tab-change="choose" class="mt20" width="120px"></YuanbenTab>
    <import v-if="tab == 'import'" :entityType="type"></import>
    <review v-if="tab == 'review'" @changeTab="changeTab" :entityType="type"></review>
		<info @back="goBack" v-if="tab === 'info'" :cfda="data"></info>
  </div>
</template>

<script>
  import YuanbenTab from 'components/common/YuanbenTab';
  import Import from './import'
	import Review from './review'
	import info from './info'
	import { getInfo } from 'api/cfda/import'
	export default {
		props: {
			
		},
		watch: {
			
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
			},
			toType (type,choose) {
				this.chooseBtn = choose;
				if (this.type !== type) {
					this.type = type
					if (this.tab !== 'import') {
						this.tabs = [
							{name: '导入', tab: 'import'},
							{name: '审核', tab: 'review'}
						]
						this.tab = 'import'
					}
				}
			}
		},
		data(){
			return{
				tabs:[
          {name: '导入', tab: 'import'},
          {name: '审核', tab: 'review'}
          ],
        tab: 'import',
				title: '',
				data: {},
				refreshState: false,
				type: 'WORKSHOP',
				chooseBtn: 0
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
