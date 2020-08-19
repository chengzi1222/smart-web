<template>
	<div class="user-box" ref="loadingDiv">
		<div class="page-tilt">
			<b></b><span>自检自查</span>
		</div>
		<toggle-form title="配置模式选择">
			<div class="childBox">
				<span>配置模式：</span>
				<el-input v-model="modeData.modeStr" class="w150" disabled style="font-size: 14px;"></el-input>
				<el-button class="w80 ml10" type="primary" @click="dialogSetting=true" v-auth="'food.zjzc.plan|func.edit'">配置</el-button>
				<p v-if="(modeData.mode == 'CITY_MODE' && $store.state.common.user.areaCode.length==4)||(modeData.mode == 'COUNTY_MODE' && $store.state.common.user.areaCode.length==6)"><span>提示：请根据不同主体类型配置对应的自检自查计划</span></p>
				<p v-if="modeData.mode == 'CITY_MODE'&&$store.state.common.user.areaCode.length>4">
					<span>提示：当前模式为市级模式，区级无权限配置自检自查计划</span>
				</p>
				<p v-if="modeData.mode=='COUNTY_MODE'&&$store.state.common.user.areaCode.length==4">
					<span>提示：当前模式为区级模式，市级部门不能创建或查看自检自查任务。</span>
				</p>
			</div>
		</toggle-form>
		<toggle-form title="自检自查计划" v-if="!(modeData.mode=='COUNTY_MODE'&&$store.getters.user.areaCode.length==4)">
			<div>
				<div class="mt20 mb20">
					<el-select class="w150" clearable v-model="queryLimit.type" placeholder="主体类型" @change="opSearch">
						<el-option v-for="item in subTypeList" :key="item.key" :label="item.name" :value="item.key"></el-option>
					</el-select>
					<el-select class="w150 ml20" clearable v-model="queryLimit.status" placeholder="状态" @change="opSearch" v-if="modeData.mode !== 'CITY_MODE' || $store.getters.user.areaCode.length !== 6">
						<el-option label="启用" value="YES"></el-option>
						<el-option label="禁用" value="NO"></el-option>
					</el-select>
					<el-button class="fr" type="primary" @click="addPlan" v-if="(modeData.mode=='CITY_MODE'&&$store.state.common.user.areaCode.length==4)||(modeData.mode == 'COUNTY_MODE'&&$store.state.common.user.areaCode.length==6)">添加计划</el-button>
				</div>
				<div class="tabOffTop170">
					<el-table :data="page.tableData" :border="true" :resizable="true" class="table-div" v-loading="loading">
						<el-table-column type="index" min-width="50" label="序号"></el-table-column>
						<el-table-column show-overflow-tooltip prop="planName" min-width="180" label="自检自查计划名称"></el-table-column>
						<el-table-column show-overflow-tooltip prop="frequency" label="检查频次" min-width="120"></el-table-column>
						<el-table-column show-overflow-tooltip prop="deptName" min-width="180" label="制定部门"></el-table-column>
						<el-table-column show-overflow-tooltip prop="entityType" min-width="100" label="主体类型"></el-table-column>
						<el-table-column show-overflow-tooltip prop="createDate" min-width="100" label="制定日期"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="100" label="状态">
							<template slot-scope="scope">
								<el-tag :type="scope.row.state === 'on' ? 'success' : 'info'" disable-transitions>
									{{scope.row.state == '是'? '启用':'禁用'}}
								</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="操作" min-width="200">
							<template slot-scope="scope">
								<a href="javascript:;" @click="go('detail',scope.row.id)" class="operate-a">详情</a>
								<a href="javascript:;" @click="go('setting',scope.row.id)" v-if="scope.row.areaCode==$store.state.common.user.areaCode" class="operate-a">配置</a>
								<a href="javascript:;" @click="getPlanEnable(scope.row.id)" class="operate-a" v-if="scope.row.areaCode==$store.state.common.user.areaCode">
									{{scope.row.state == '是'? '禁用':'启用'}}
								</a>
								<a href="javascript:;" @click="go('record',scope.row.id, scope.row.planName)" class="operate-a">自查记录</a>
								<!-- <a href="javascript:;" class="operate-a">整改</a> -->
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination-box">
						<el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange"
							:current-page="queryLimit.pageNum" :page-sizes="[5,8,10,15,20,25,30]" :page-size="queryLimit.pageSize"
							layout="total, sizes, prev, pager, next, jumper" :total="page.total">
						</el-pagination>
					</div>
				</div>
			</div>
		</toggle-form>

		<el-dialog :visible.sync="dialogSetting" width="30%" title="配置模式选择" :modal-append-to-body="false" :close-on-click-modal="false"
			:before-close="getPlanModeGetBe">
			<div>
				<span>配置模式选择：</span>
				<el-radio v-model="editMode" label="CITY_MODE">市级模式</el-radio>
				<el-radio v-model="editMode" label="COUNTY_MODE">区级模式</el-radio>
			</div>
			<p class="describe mt10">#选择{{editMode=='CITY_MODE'?'市级':'区级'}}模式后, 所有{{editMode=='CITY_MODE'?'区级':'市级'}}自检自查计划即将失效!</p>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogSetting=false;getPlanModeGet()">取 消</el-button>
				<el-button type="primary" @click="modelEdit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import ToggleForm from "components/ToggleForm";
	import { getPlanPaging, getPlanEnable, getPlanModeGet, postPlanModeEdit } from 'api/patrol/checkByMyself'

	export default {
		name: "index",
		components: {
			ToggleForm
		},
		data() {
			return {
				editMode: "",
				modeData: {
					cityCode: "",
					mode: "",
					modeStr: ""
				},
				loading: false,
				dialogSetting: false,
				setting: [{
					label: '市级模式',
					key: 'city'
				},{
					label: '区级模式',
					key: 'area'
				}],
				subTypeList: [{
					name: '幼儿园食堂',
					key: 'KINDSC'
				},{
					name: '小学食堂',
					key: 'PRISC'
				},{
					name: '初中食堂',
					key: 'MIDSC'
				},{
					name: '高中食堂',
					key: 'HIGSC'
				},{
					name: '大学食堂',
					key: 'UNVSC'
				},{
					name: '医院食堂',
					key: 'HSPT'
				},{
					name: '社会餐饮',
					key: 'RSTNT'
				},{
					name: '大型酒店',
					key: 'HOTEL'
				},{
					name: '企事业单位',
					key: 'CORP'
				},{
					name: '政府机关',
					key: 'GOV'
				}],
				queryLimit: {
					pageNum: 1,
					pageSize: 10,
					type: '',
					year: '',
					status: '',
					deptId: ''
				},
				page: {
					total: 3,
					tableData: []
				},
				deptAll: []
			}
		},
		methods: {
			getPlanModeGetBe(done){
				this.getPlanModeGet();
				done();
			},
			modelEdit(){
				if (this.modeData.mode === this.editMode) {
					this.dialogSetting = false;
				} else {
					postPlanModeEdit({ mode: this.editMode}).then(r=>{
						if(r.status){
							this.dialogSetting = false;
							this.getPlanPaging();
							this.getPlanModeGet()
						}
					})
				}
			},
			getPlanModeGet(){
				getPlanModeGet().then(r => {
					if (r.status) {
						this.modeData = r.data;
						this.editMode = this.modeData.mode
						if (this.modeData.mode !== 'COUNTY_MODE' || this.$store.getters.user.areaCode.length !== 4) {
							this.getPlanPaging()
						}
					}
				})
			},
			pageCurrentChange(num) {
				this.queryLimit.pageNum = num;
				this.getPlanPaging();
			},
			pageSizeChange(size) {
				this.queryLimit.pageSize = size;
				this.getPlanPaging();
			},
			opSearch() {
				this.queryLimit.pageNum = 1;
				this.getPlanPaging();
			},
			getPlanEnable(id){
				this.loading = true;
				getPlanEnable({id: id}).then(r=>{
					this.loading = false;
					if(r.status){
						this.$message.success('更改成功');
						this.getPlanPaging();
					}
				})
			},
			addPlan() {
				this.$router.push({
					name: "patrol.checkByMyself.setting",
					query: {
						type: 'add'
					}
				});
			},
			go(to, id, name) {
				if (to === 'detail') {
					this.$router.push({
						name: "patrol.checkByMyself.detail",
						query: {
							id: id
						}
					});
				} else if (to === 'setting') {
					this.$router.push({
						name: "patrol.checkByMyself.setting",
						query: {
							id: id,
							type: 'setting'
						}
					});
				} else if (to === 'record') {
					this.$router.push({
						name: "patrol.checkByMyself.checkRecord",
						query: {
							id: id,
							name: name
						}
					});
				}
			},
			getPlanPaging(){
				let params = {
					areaCodes: '',
					entityType: this.queryLimit.type,
					year: this.queryLimit.year,
					state: this.queryLimit.status,
					deptId: this.queryLimit.deptId,
				}
				this.loading = true;
				getPlanPaging(this.queryLimit.pageNum, this.queryLimit.pageSize, params).then(r=>{
					this.page.tableData = [];
					this.loading = false;
					if(r.status){
						this.page.tableData = r.data.list;
						this.page.total = r.data.total;
					}
				})
			}
		},
		mounted() {
			// this.getPlanPaging();
			this.getPlanModeGet();
		},
	}
</script>

<style lang="scss" scoped>
	.user-box {
		margin-bottom: 150px;
		.childBox {
			width: 600px;
			line-height: 34px;
			margin: 34px auto;
		}
		.childBox span {
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(57, 57, 57, 1);
			line-height: 20px;
		}

		.childBox span:last-child {
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(162, 170, 182, 1);
			line-height: 18px;
			margin: 10px 0 0 10px;
		}
	}
	.title {
		font-size: 18px;
		height: 40px;
		line-height: 40px;
	}
	.describe {
		font-size: 14px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(162, 170, 182, 1);
		line-height: 20px;
	}
	.w180 {
		width: 180px;
	}
</style>