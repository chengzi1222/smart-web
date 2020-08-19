<template>
	<div>
		<div class="page-tilt">
			<b></b>
			<span>自检自查记录--{{title}}</span>
			<back></back>
		</div>
		<div class="user-box">
			<div class="mt20 mb20 clear_a">
				<el-input placeholder="主体名称" class="w250 seekIpt" v-model="queryLimit.entityName" @keyup.enter.native="selectChange">
					<i slot="suffix" class="el-input__icon el-icon-search" @click="selectChange"></i>
				</el-input>
				<el-select class="w150 ml20" v-model="queryLimit.entityType" :clearable="true" placeholder="主体类型" @change="selectChange">
					<el-option v-for="item in subTypeList" :key="item.key" :label="item.name" :value="item.key">
					</el-option>
				</el-select>
				<select-area-grid class="w150 ml20" placeholder="所属辖区" @change="areaChange"></select-area-grid>
				<el-select class="w150 ml20" v-model="queryLimit.rectificationStatus" :clearable="true" placeholder="整改状态" @change="selectChange">
					<el-option v-for="item in rectificationStatusList" :key="item.key" :label="item.name" :value="item.key">
					</el-option>
				</el-select>
				<el-date-picker class="w150 ml20" v-model="queryLimit.planYear" type="year" value-format="yyyy" @change="selectChange"placeholder="年度"></el-date-picker>
			</div>
			<div class="tabOffTop120">
				<el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
					:data="tableData" class="table-div">
					<el-table-column type="index" label="序号" width="50"></el-table-column>
					<el-table-column show-overflow-tooltip prop="buyerName" min-width="190" label="主体名称"></el-table-column>
					<el-table-column show-overflow-tooltip min-width="100" label="主体类型">
						<template slot-scope="scope">{{scope.row.buyerType}}</template>
					</el-table-column>
					<el-table-column show-overflow-tooltip prop="areaName" min-width="100" label="所属区县"></el-table-column>
					<el-table-column show-overflow-tooltip prop="street" min-width="100" label="所属街道"></el-table-column>
					<el-table-column show-overflow-tooltip prop="checkResultStr" min-width="100" label="检查结果"></el-table-column>
					<el-table-column show-overflow-tooltip prop="totalPoint" min-width="120" label="得分"></el-table-column>
					<el-table-column show-overflow-tooltip prop="inspector" min-width="120" label="检查人"></el-table-column>
					<el-table-column show-overflow-tooltip prop="rectificationStatusStr" label="整改状态" min-width="120"></el-table-column>
					<el-table-column show-overflow-tooltip prop="checkTime" min-width="120" label="检查时间"></el-table-column>
					<el-table-column label="操作" min-width="150" fixed="right">
						<template slot-scope="scope">
							<a href="javascript:;" class="operate-a" @click="view('detail',scope.row)">详情</a>
							<a href="javascript:;" class="operate-a" v-if="scope.row.rectificationStatus === 1" @click="view('rectify',scope.row)">整改详情</a>
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination-box">
					<el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
						:current-page="queryLimit.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="queryLimit.pageSize"
						layout="total, sizes, prev, pager, next, jumper" :total="page.total">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
	import EnumSelect from "components/common/EnumSelect";
	import SelectAreaGrid from "components/common/SelectAreaGridTob.vue";
	import Back from "utils/back.vue";
	import { getRecordPaging } from 'api/patrol/checkByMyself'

	export default {
		data() {
			return {
				title: '',
				page: {
					total: 0
				}, 
				subTypeList: [{
					name: '幼儿园食堂',
					key: 'KINDSC'
				}, {
					name: '小学食堂',
					key: 'PRISC'
				}, {
					name: '初中食堂',
					key: 'MIDSC'
				}, {
					name: '高中食堂',
					key: 'HIGSC'
				}, {
					name: '大学食堂',
					key: 'UNVSC'
				}, {
					name: '医院食堂',
					key: 'HSPT'
				}, {
					name: '社会餐饮',
					key: 'RSTNT'
				}, {
					name: '大型酒店',
					key: 'HOTEL'
				}, {
					name: '企事业单位',
					key: 'CORP'
				}, {
					name: '政府机关',
					key: 'GOV'
				}],
				loading: false,
				tableData: [],
				queryLimit: {
					pageNum: 1,
					pageSize: 10,
					planId: '',
					entityType: '',
					areaCode: "",
					rectificationStatus: "",
					entityName: "",
					planYear: ""
				},
				rectificationStatusList: [{
					name: "待整改",
					key: 'NOTRECTIFY'
				},{
					name: "已整改",
					key: 'RECTIFY'
				},{
					name: "无需整改",
					key: 'NORECTIFY'
				}],
			};
		},
		async mounted() {
			this.title = this.$route.query.name;
			this.queryLimit.planId = this.$route.query.id;
			this.queryLimit.areaCode = this.$store.state.common.user.regionCode;
			this.searchPage();
		},
		methods: {
			selectChange() {
				this.queryLimit.pageNum = 1;
				this.searchPage();
			},
			view(page, row) {
				if (page === 'detail') {
					this.$router.push({
					name: 'patrol.checkByMyself.checkRecordDetail',
					query: {
						recordId: row.id,
						areaName: row.areaName
					}})
				} else if (page === 'rectify') {
					this.$router.push({
					name: 'patrol.checkByMyself.rectifyDetail',
					query: {
						entityId: row.id,
						buyerName: row.buyerName,
						areaName: row.areaName
					}})
				}
			},
			searchPage() {
				this.loading = true;
				getRecordPaging(this.queryLimit.pageNum, this.queryLimit.pageSize, this.queryLimit).then(r=>{
					let res = JSON.parse(r.data);
					if(r.status){
						this.tableData = res.data.records;
						this.page.total = res.data.total;
					}
					this.loading = false;
				})
			},
			pagecCurrentChange(num) {
				this.queryLimit.current = num;
				this.searchPage();
			},
			pageSizeChange(size) {
				this.queryLimit.size = size;
				this.searchPage();
			},
			areaChange(val) {
				if (!val || val.length == 0) {
					this.queryLimit.areaCode = this.$store.state.common.user.regionCode;
				} else {
					this.queryLimit.areaCode = val[val.length - 1];
				}
				this.searchPage();
			}
		},
		components: { EnumSelect, SelectAreaGrid, Back }
	};
</script>
<style scoped lang="scss">
	.pagination-box {
		text-align: right;
		margin-top: 20px;
	}
	.table-div {
		width: 100%;
		text-align: center;
	}
	.operate-a {
		color: #1787ad;
	}
</style>