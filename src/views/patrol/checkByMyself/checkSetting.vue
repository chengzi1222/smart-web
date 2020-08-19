<template>
	<div class="user-box" ref="loadingDiv">
		<div class="page-tilt">
			<b></b><span>自检自查{{type === 'add'? '添加':'配置'}}</span>
			<back></back>
		</div>
		<el-form ref="form" :model="form" label-width="120px">
			<toggle-form title="基础配置">
				<div class="addForm row">
					<div>
						<span class="mr10 textR" style="display: inline-block;width: 108px;"><i style="color:red;">*</i>计划名称:</span>
						<el-form-item label="">
							<el-input v-model="form.planName" maxlength="100" class="w240" placeholder="请输入计划名称"></el-input>
						</el-form-item>
					</div>
					<div>
						<span class="mr10 textR" style="display: inline-block;width: 108px;"><i style="color:red;">*</i>行业类型:</span>
						<el-form-item label="">
							<el-checkbox-group v-if="type!=='setting'" v-model="form.entityTypes" size="large">
								<el-checkbox-button v-for="item in subTypeList" :label="item.key" :key="item.key">
									{{item.name}}
								</el-checkbox-button>
							</el-checkbox-group>
							<el-button v-else v-for="item in entityTypeList" :key="item" type="primary" class="mr10" disabled>{{item}}</el-button>
						</el-form-item>
					</div>
					<el-form-item label="自查自检要点表:">
						<el-select v-model="form.tableId" :disabled="type=='setting'" @change="getContontList" placeholder="请选择自查自检要点表">
							<el-option v-for="item in tableIdList" :label="item.name" :key="item.id" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<div>
						<span class="mr10 textR" style="display: inline-block;width: 108px;"><i style="color:red;">*</i>检查频次:</span>
						<el-form-item label="">
							<el-select v-model="form.frequency" placeholder="请选择检查频次">
								<el-option v-for="item in frequencyList" :label="item.name" :key="item.key" :value="item.key"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<el-form-item label="计划描述:">
						<el-input placeholder="请输入任务描述, 300字以内" class="w240" :rows="5" type="textarea" v-model="form.planDescribe"
							maxlength="300">
						</el-input>
						<span style="color: #A2AAB6;font-size:12px;margin-left:5px;">(选填)</span>
					</el-form-item>
					<el-form-item label="相关文件:">
						<el-upload class="avatar-uploader" action="/api/upload" :disabled="uploadFile.length>=5" :on-success="uploadConfig"
							:show-file-list="false" :on-error="fileUploadError" :before-upload="beforeAvatarUpload" :data="{type: 'TEMPLATE'}">
							<el-button :disabled="uploadFile.length>=5" style="margin-right:20px;">点击上传</el-button>
						</el-upload>
						<span
							style="white-space:nowrap;position:absolute;left:100px;top:-8px;max-width:316px;color: #A2AAB6;font-size:12px;margin-top: 10px;">最多上传5个文件,文件格式：jpg,
							png, doc, pdf (选填)</span>
						<div class="show-success-file">
							<div class="file-item movePoin" v-for="(item,index) in uploadFile" :key="index">
								<span class="file-name not-pic">{{item.fileName}}</span>
								<span v-if="!configDisabled" style="color:#0db5ef" @click="removeFile(index,item)">删除</span>
							</div>
						</div>
					</el-form-item>
				</div>
			</toggle-form>

			<toggle-form title="检查项及合格标准配置">
				<div>
					<p class="tip">当前自检自查要点表总分: {{allScore}}分, 重点项: {{importantNum}}项, 一般项: {{importantNoNum}}项</p>
					<div class="clear_a">
						<div class="module">
							<el-table :data="[1]" style="width: 100%">
								<el-table-column label="合格分数线">
									<template slot-scope="scope">
										<i style="color:red;">*</i> ≥
										<el-input v-model="form.qualifiedScore" class="w65 ml10" @input="form.qualifiedScore=form.qualifiedScore.replace(/[^\d+(\.\d+)?$]/g,'')"></el-input>
									</template>
								</el-table-column>
								<el-table-column label="不合格重点项">
									<template slot-scope="scope">
										<i style="color:red;">*</i> ≤
										<el-input v-model="form.unqualifiedImportantContext" class="w65 ml10" @input="form.unqualifiedImportantContext=form.unqualifiedImportantContext.replace(/[^\d]/g,'')"></el-input>
									</template>
								</el-table-column>
								<el-table-column label="不合格一般项">
									<template slot-scope="scope">
										<i style="color:red;">*</i> ≤
										<el-input v-model="form.unqualifiedCommonlyContext" class="w65 ml10" @input="form.unqualifiedCommonlyContext=form.unqualifiedCommonlyContext.replace(/[^\d]/g,'')"></el-input>
									</template>
								</el-table-column>
							</el-table>
						</div>
						<div class="module">
							<el-table :data="[1]" style="width: 100%">
								<el-table-column label="最少检查重点项占比(%)">
									<template slot-scope="scope">
										<i style="color:red;">*</i>
										<el-input v-model="form.minImportantContext" class="w65 ml10" @input="form.minImportantContext=form.minImportantContext.replace(/[^\d+(\.\d+)?$]/g,'')"></el-input>
									</template>
								</el-table-column>
								<el-table-column label="最少检查一般项占比(%)">
									<template slot-scope="scope">
										<i style="color:red;">*</i>
										<el-input v-model="form.minCommonlyContext" class="w65 ml10" @input="form.minCommonlyContext=form.minCommonlyContext.replace(/[^\d+(\.\d+)?$]/g,'')"></el-input>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</div>
			</toggle-form>
		</el-form>
		<toggle-form title="检查内容预览">
			<div class="tabOffTop120  mt20" style="display: block">
				<el-table :key="index" v-for="(item,index) in formData" :class="index==0?'firsTeit':''" :data="item.children.length>0?item.children:[0]"
					:span-method="item.children.length>0?objectSpanMethod:function(){}" border class="table-div brN">
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
							<span v-if="item.children.length<=0">暂无</span>
							<span v-else>{{formData[index].no}}.{{formData[index].children[scope.$index].no}}</span>
						</template>
					</el-table-column>
					<el-table-column show-overflow-tooltip label="检查内容" min-width="250">
						<template slot-scope="scope">
							<span v-if="item.children.length<=0">暂无</span>
							<span v-else>{{scope.row.context}}</span>
						</template>
					</el-table-column>
					<el-table-column show-overflow-tooltip label="是否重点项" min-width="80">
						<template slot-scope="scope">
							<span v-if="item.children.length<=0">暂无</span>
							<span v-else>{{scope.row.importantLabel}}</span>
						</template>
					</el-table-column>
					<el-table-column show-overflow-tooltip label="分值" min-width="50">
						<template slot-scope="scope">
							<span v-if="item.children.length<=0">暂无</span>
							<span v-else>{{scope.row.score}}</span>
						</template>
					</el-table-column>
					<el-table-column show-overflow-tooltip label="状态" min-width="120">
						<template slot-scope="scope">
							<span v-if="item.children.length<=0">暂无</span>
							<span v-else>{{scope.row.enable==='YES'?'启用':'禁用'}}</span>
						</template>
					</el-table-column>
				</el-table>
				<p class="allscoreP" v-if="formData.length>0">总计<span class="ml20">{{allScore}}</span></p>
			</div>
		</toggle-form>
		<div class="foot-btn" style="z-index:998">
			<div>
				<el-button @click="goBack">返回</el-button>
				<el-button type="primary" @click="save">保存</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import ToggleForm from "components/ToggleForm";
	import Back from "utils/back.vue";
	import { getPlanDDetails, postPlanSave, postPlanEdit, getPlanTableDetails } from 'api/patrol/checkByMyself';
	import { listTableByType } from 'api/patrol/project';

	export default {
		name: "checkSetting",
		components: {
			ToggleForm,Back
		},
		data() {
			return {
				type: '',
				allScore: 0,
				frequencyList: [{
					name: '一年3次',
					key: '3'
				},{
					name: '一年4次',
					key: '4'
				},{
					name: '一年6次',
					key: '6'
				}],
				tableIdList: [],
				fileList: [],
				form:{
					entityTypes: [],
					frequency: '',
					minCommonlyContext: '',
					minImportantContext: '',
					planName: '',
					qualifiedScore: '',
					tableId: '',
					unqualifiedCommonlyContext: '',
					unqualifiedImportantContext: '',
					fileIds: [],
					id: '',
					planDescribe: '',
				},
				previewForm: {
					total: 2,
				},
				formData: [],
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
				configDisabled: false,
				uploadFile: [],
				queryLimit: {
					pageNum: 1,
					pageSize: 10
				},
				spanArr: [],
				position: 0,
				importantNoNum: 0,
				importantNum: 0,
				entityTypeList: []
			}
		},
		methods: {
			getContontList(){
				getPlanTableDetails(this.form.tableId).then(r=>{
					if(r.status){
						this.formData = r.data.projectMapPos;
						this.importantNum=0;
						this.importantNoNum = 0;
						for (let i = 0; i < r.data.projectMapPos.length; i++) {
							for (let j = 0; j < r.data.projectMapPos[i].children.length; j++) {
								this.allScore += r.data.projectMapPos[i].children[j].score;
								if (r.data.projectMapPos[i].children[j].important == 'YES') {
									this.importantNum++;
								} else {
									this.importantNoNum++;
								}
							}
						}
					}
				})
			},
			save(){
				if(!this.form.planName){
					this.$message.error('请输入计划名称');
					return
				}
				if (this.form.entityTypes.length<=0) {
					this.$message.error('请选择行业类型');
					return
				}
				if(!this.form.tableId){
					this.$message.error('请选择自查自检要点表');
					return
				}
				if(!this.form.frequency){
					this.$message.error('请选择检查频次');
					return
				}
				if(this.form.qualifiedScore === ''){
					this.$message.error('请输入合格分数线');
					return
				}
				if(this.form.unqualifiedImportantContext===''){
					this.$message.error('请输入不合格重点项');
					return
				}
				if(this.form.unqualifiedCommonlyContext===''){
					this.$message.error('请输入不合格一般项');
					return
				}
				if(this.form.minImportantContext===''){
					this.$message.error('请输入最少检查重点项占比');
					return
				}
				if(this.form.minCommonlyContext===''){
					this.$message.error('请输入最少检查一般项占比');
					return
				}
				if(this.type=='setting'){
					postPlanEdit(this.form).then(r => {
						if (r.status) {
							this.$message.success('配置成功');
							this.goBack();
						}
					})
				} else {
					postPlanSave(this.form).then(r=>{
						if(r.status){
							this.$message.success('添加成功');
							this.goBack();
						}
					})
				}
			},
			beforeAvatarUpload(file) {
				let type = file.name.substr(file.name.lastIndexOf('.'))
				let flag = true
				if (type !== '.png'&&type !== '.jpg'&&type !== '.doc'&&type !== '.pdf') {
					flag = false
					this.$message.warning('上传格式错误')
				}
				return flag
			},
			fileUploadError(err, file) {
				this.$message.warning("文件上传失败！");
			},
			// 删除上传的文件
			removeFile(index, file) {
				this.$confirm('是否确认删除该文件吗？', '提示', {
				    confirmButtonText: '确定',
				    cancelButtonText: '取消',
				}).then(() => {
					this.uploadFile.splice(index, 1);
					this.form.fileIds.splice(index, 1);
				})
			},
			uploadConfig(file) {
				if(file.status){
					this.uploadFile.push(file.data);
					this.form.fileIds.push(file.data.id);
					this.$message.success('图片上传成功！');
				} else {
					this.$message.success('图片上传失败！');
				}
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
			settingGetPlanDDetails(){
				getPlanDDetails({ id: this.$route.query.id }).then(r => {
					if (r.status) {
						this.uploadFile = JSON.parse(JSON.stringify(r.data.fileIds));
						this.form = r.data;
						let _datas = [];
						for(let i=0; i<r.data.fileIds.length;i++){
							_datas.push(r.data.fileIds[i].id)
						}
						for(let i=0; i<r.data.entityTypes.length;i++){
							for(let j=0; j<this.subTypeList.length;j++){
								if(r.data.entityTypes[i]== this.subTypeList[j].key){
									this.entityTypeList.push(this.subTypeList[j].name)
								}
							}
						}
						this.form.fileIds = _datas;
						this.formData = r.data.projectMapPos;
						for (let i = 0; i < r.data.projectMapPos.length; i++) {
							for (let j = 0; j < r.data.projectMapPos[i].children.length; j++) {
								this.allScore += r.data.projectMapPos[i].children[j].score;
								if (r.data.projectMapPos[i].children[j].important == 'YES') {
									this.importantNum++;
								} else {
									this.importantNoNum++;
								}
							}
						}
					}
				})
			}
		},
		mounted() {
			this.type = this.$route.query.type;
			if(this.type == 'setting'){
				this.form.id = this.$route.query.id;
				this.settingGetPlanDDetails();
			}
			listTableByType('RESTAURANT').then(r=>{
				if(r.status){
					this.tableIdList = r.data;
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
		width: 630px;
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
	.allscoreP{
		height: 45px;
		line-height: 45px;
		text-align: center;
		border: 1.5px solid #EBEEF5;
		border-top: none;
	}
</style>