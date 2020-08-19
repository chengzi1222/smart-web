<template>
	<div class="user-box" ref="loadingDiv">
		<div class="page-tilt">
			<b></b><span>自检自查详情</span>
			<back></back>
		</div>
		<el-form label-width="120px">
			<toggle-form title="基础配置">
				<div class="addForm">
					<div class="row">
						<el-form-item class="vaT" label="计划名称:">
							<span>{{datas.planName}}</span>
						</el-form-item>
						<el-form-item class="vaT" label="制定日期:">
							<span>{{datas.planName}}</span>
						</el-form-item>
					</div>
					<div class="row">
						<el-form-item class="vaT" label="主体类型:">
							<span>{{datas.entityTypeStr}}</span>
						</el-form-item>
						<el-form-item class="vaT" label="自检自查要点表:">
							<span>{{datas.tableName}}</span>
						</el-form-item>
					</div>
					<div class="row">
						<el-form-item class="vaT" label="检查频次:" >
							<span>{{datas.frequency}}</span>
						</el-form-item>
						<el-form-item class="vaT" label="计划描述:">
							<span>{{datas.planDescribe?datas.planDescribe:'暂无'}}</span>
						</el-form-item>
					</div>
					<div class="row">
						<el-form-item label="相关文件:">
							<span v-if="!datas.fileIds||datas.fileIds.length<=0">暂无</span>
							<a v-for="item in datas.fileIds"  target="_blank" class="movePoin"
								 @click="downloadFile(item.fileId.replace($store.getters.filePath,''),item.fileName.lastIndexOf('.')===-1?item.fileName:item.fileName.substring(0,item.fileName.lastIndexOf('.')))">
								 {{item.fileName}}
								 <br>
							</a>
						</el-form-item>
					</div>
				</div>
			</toggle-form>
			<toggle-form title="检查项及合格标准配置">
				<div>
					<p class="tip">当前自检自查要点表总分: {{allScore}}分, 重点项: {{importantNum}}项, 一般项: {{importantNoNum}}项</p>
					<div class="clear_a">
						<div class="module">
							<el-table :data="addForm">
								<el-table-column label="合格分数线">
									<template slot-scope="scope">
										≥{{scope.row.qualifiedScore}}
									</template>
								</el-table-column>
								<el-table-column label="不合格重点项">
									<template slot-scope="scope">
										≤{{scope.row.unqualifiedImportantContext}}
									</template>
								</el-table-column>
								<el-table-column label="不合格一般项">
									<template slot-scope="scope">
										≤{{scope.row.unqualifiedCommonlyContext}}
									</template>
								</el-table-column>
							</el-table>
						</div>
						<div class="module">
							<el-table :data="addForm">
								<el-table-column label="最少检查重点项占比(%)">
									<template slot-scope="scope">
										{{scope.row.minImportantContext}}
									</template>
								</el-table-column>
								<el-table-column prop="disqualificationPoint" label="最少检查一般项占比(%)">
									<template slot-scope="scope">
										{{scope.row.minCommonlyContext}}
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</div>
			</toggle-form>
		</el-form>
		<toggle-form title="检查内容预览">
			<div class="tabOffTop120 mt20" style="display: block;">
				<el-table :key="index" v-for="(item,index) in formData" :class="index==0?'firsTeit':''" :data="item.children"
					:span-method="objectSpanMethod" border class="table-div brN">
					<el-table-column show-overflow-tooltip label="检查项编号" min-width="100">
						<template slot-scope="scope">
							<span>{{formData[index].no}}</span>
						</template>
					</el-table-column>
					<el-table-column show-overflow-tooltip label="检查项目" min-width="120">
						<template slot-scope="scope">
							<span>{{formData[index].name}}</span>
						</template>
					</el-table-column>
					<el-table-column show-overflow-tooltip label="检查内容编号" min-width="120">
						<template slot-scope="scope">
							<span>{{formData[index].no}}.{{formData[index].children[scope.$index].no}}</span>
						</template>
					</el-table-column>
					<el-table-column show-overflow-tooltip prop="context" label="检查内容" min-width="250"></el-table-column>
					<el-table-column show-overflow-tooltip prop="importantLabel" label="是否重点项" min-width="80"></el-table-column>
					<el-table-column show-overflow-tooltip prop="score" label="分值" min-width="50"></el-table-column>
					<el-table-column show-overflow-tooltip label="状态" min-width="120">
						<template slot-scope="scope">
							{{scope.row.enable==='YES'?'启用':'禁用'}}
						</template>
					</el-table-column>
				</el-table>
				<p class="allscoreP">总计<span class="ml20">{{allScore}}</span></p>
			</div>
		</toggle-form>
		<div class="foot-btn" style="z-index:998">
			<div>
				<el-button type="primary" @click="goBack">返回</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import ToggleForm from "components/ToggleForm";
	import Back from "utils/back.vue";
	import { downloadFile } from 'api/common';
	import { getPlanDDetails } from 'api/patrol/checkByMyself'

	export default {
		name: "checkSetting",
		components: {
			ToggleForm,
			Back
		},
		data() {
			return {
				allScore:0,
				type: '',
				addForm: [],
				previewForm: {
					total: 2,
				},
				formData: [],
				subTypeList: [
					{
						name: '生产主体',
						key: 'all'
					},
					{
						name: '流通主体',
						key: 'river'
					}
				],
				configDisabled: false,
				uploadFile: [],
				queryLimit: {
					pageNum: 1,
					pageSize: 10
				},
				datas:{},
				importantNum: 0,
				importantNoNum: 0
			}
		},
		methods: {
			pageCurrentChange(num) {
				this.queryLimit.pageNum = num;
			},
			pageSizeChange(size) {
				this.queryLimit.pageSize = size;
			},
			objectSpanMethod({ row, column, rowIndex, columnIndex }) {
				let rownum = 0;
				for (var i = 0; i < this.formData.length; i++) {
					if (this.formData[i].children.indexOf(row) >= 0) {
						rownum = this.formData[i].children.length;
						break;
					}
				}
				if (columnIndex === 0 || columnIndex === 1) {
					if (rowIndex % rownum == 0) {
						return {
							rowspan: rownum,
							colspan: 1
						};
					} else {
						return {
							rowspan: 0,
							colspan: 0
						};
					}
				}
			},
			goBack() {
				this.$router.go(-1);
			},
			downloadFile (fileId, fileName) {
				downloadFile(fileId, fileName)
			}
		},
		mounted() {
			getPlanDDetails({ id: this.$route.query.id}).then(r=>{
				if(r.status){
					this.datas = r.data;
					this.addForm = [];
					this.addForm.push({
						minCommonlyContext: r.data.minCommonlyContext,
						minImportantContext: r.data.minImportantContext,
						unqualifiedCommonlyContext: r.data.unqualifiedCommonlyContext,
						unqualifiedImportantContext: r.data.unqualifiedImportantContext,
						qualifiedScore: r.data.qualifiedScore,
					})
					this.formData = r.data.projectMapPos;
					for(let i=0; i<r.data.projectMapPos.length;i++){
						for(let j=0;j<r.data.projectMapPos[i].children.length;j++){
							this.allScore += r.data.projectMapPos[i].children[j].score;
							if(r.data.projectMapPos[i].children[j].important =='YES'){
								this.importantNum++;
							} else {
								this.importantNoNum++;
							}
						}
					}
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.user-box {
		margin-bottom: 150px;
	}
	.addForm {
		width: 830px;
		margin: 30px auto 0;
	}
	.w240 {
		width: 240px !important;
	}
	.w550 {
		width: 550px !important;
	}
	.module {
		width: 49%;
	}
	.module:last-child {
		margin-left: 20px;
	}
	.tip {
		margin: 30px 0;
		font-size: 13px;
		font-family: AlibabaPuHuiTiR;
		color: rgba(57, 57, 57, 1);
		line-height: 18px;
	}
	.childBox {
		margin-top: 30px;
	}
	.brN .is-leaf {
		border-right: 0;
	}
	.brN tr td {
		border-right: 0;
	}
	.brN tr td[colspan="1"] {
		border-right: 1px solid #ebeef5;
	}
	.brN .el-table__header-wrapper {
		display: none;
	}
	.firsTeit .el-table__header-wrapper {
		display: block;
	}
	.mT35 .firsTeit {
		border-top: 1px solid #ebeef5 !important;
	}
	.mT35 .el-table {
		border-top: none !important;
	}
	.vaT{
		vertical-align: top;
	}
	.allscoreP{
		height: 45px;
		line-height: 45px;
		text-align: center;
		border: 1.5px solid #EBEEF5;
		border-top: none;
	}
</style>