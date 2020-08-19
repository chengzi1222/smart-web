<template>
	<div>
		<div style="margin-top:20px;border-left:3px solid  #0DB5EF;">
			<span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;">整改详情</span><Back class="ml20"></Back>
		</div>
		<div class="container">
			<div class="right-info">
				<el-form label-width="130px" class="demo-ruleForm">
					<toggle-form title="整改任务信息">
						<div class="content toggle-form-c">
							<div class="row">
								<el-form-item label="任务来源:" prop="">
									<span>{{basicInfoData.origin}}</span>
									<a href="javascript:;" @click="goInfo">自查记录</a>
								</el-form-item>
							</div>
							<div class="row">
								<el-form-item label="自查时间:" prop="">
									<span>{{basicInfoData.createTime}}</span>
								</el-form-item>
								<el-form-item label="问题项数量:" prop="">
									<span>{{basicInfoData.problemNum}}</span>
								</el-form-item>
							</div>
							<div class="row">
								<el-form-item label="主体名称:" prop="">
									<span>{{$route.query.buyerName}}</span>
								</el-form-item>
							</div>
							<div class="row">
								<el-form-item label="所属辖区:" prop="">
									<span>{{$route.query.areaName}}</span>
								</el-form-item>
							</div>
						</div>
					</toggle-form>

					<toggle-form title="整改任务信息">
						<div class="content">
							<div class="row">
								<el-form-item label="整改人:" prop="">
									<span>{{basicInfoData.inspector}}</span>
								</el-form-item>
								<el-form-item label="整改时间:" prop="">
									<span>{{basicInfoData.rectificationTime}}</span>
								</el-form-item>
							</div>
							<div class="row">
								<el-form-item label="整改内容描述:" prop="">
									<span>{{basicInfoData.content}}</span>
								</el-form-item>
							</div>
							<div class="row mRno">
								<el-form-item label="整改现场图片：" prop="">
									<div v-if="basicInfoData.rectificationUrl.length>0" v-for="(item,index) in basicInfoData.rectificationUrl" @click.stop="ifbigqyFun(index)"
										class="imgdiv" :class="ifbigqy&&index==ifbigindex?'imgbig':''">
										<img :src="pathFile + item" alt="">
										<span>预览</span>
									</div>
								</el-form-item>
							</div>
							<div class="row mRno">
								<el-form-item label="电子签名：" prop="">
									<div v-if="basicInfoData.signUrl" @click.stop="ifbigqFun" class="imgdiv" :class="ifbigq?'imgbig':''">
										<img :src="pathFile + basicInfoData.signUrl" alt="">
										<span>预览</span>
									</div>
								</el-form-item>
							</div>
							<div class="row mRno">
								<el-form-item label="整改人抓拍照片：" prop="">
									<div v-if="basicInfoData.snapshotUrl.length>0" v-for="(item,index) in basicInfoData.snapshotUrl" @click.stop="ifbigqytFun(index)"
										class="imgdiv" :class="ifbigqyt&&index==ifbigindext?'imgbig':''">
										<img :src="pathFile + item" alt="">
										<span>预览</span>
									</div>
								</el-form-item>
							</div>
						</div>
					</toggle-form>
				</el-form>
			</div>
		</div>
		<!-- 底部按钮 -->
		<div class="foot-btn" style="z-index:1">
			<div>
				<el-button class="w100" @click="goBack">返回</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import ToggleForm from "components/ToggleForm.vue";
	import { getRecordRepatrolDetails } from 'api/patrol/checkByMyself'
	import Back from "utils/back.vue";
	export default {
		components: {
			ToggleForm,Back
		},
		data() {
			return {
				pathFile: "",
				ifbigq: false,
				ifbigqy: false,
				ifbigindex: -1,
				ifbigqyt: false,
				ifbigindext: -1,
				basicInfoData: {}
			}
		},
		mounted() {
			this.pathFile = this.$store.getters.filePath;
			getRecordRepatrolDetails({ id: this.$route.query.entityId}).then(r=>{
				if (r.status) {
					let res = JSON.parse(r.data);
					this.basicInfoData = res.data;
				}
			})
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			},
			ifbigqyFun(index) {
				this.ifbigqy = !this.ifbigqy;
				if (this.ifbigindex == -1) {
					this.ifbigindex = index;
				} else {
					this.ifbigindex = -1;
				}
			},
			ifbigqytFun(index) {
				this.ifbigqyt = !this.ifbigqyt;
				if (this.ifbigindext == -1) {
					this.ifbigindext = index;
				} else {
					this.ifbigindext = -1;
				}
			},
			ifbigqFun() {
				this.ifbigq = !this.ifbigq;
			},
			goInfo(){
				this.$router.push({
					name: 'patrol.checkByMyself.checkRecordDetail',
					query: {
						recordId: this.$route.query.entityId,
						areaName: this.$route.query.areaName
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
		margin-bottom: 200px;
	}
	.content {
		margin-top: 20px;
		a {
			background: #F6F7F8;
			border: 1px solid #C2CAD2;
			padding: 5px 19px;
			font-size: 14px;
			color: #393939;
			height: 30px;
			width: 136px;
			box-sizing: border-box;
			margin-left: 10px;
		}
	}
	.mT35 {
		margin-top: 35px;
	}
	.row .el-form-item {
		min-width: 250px;
	}
	.table-div {
		text-align: center;
	}
	.zj {
		border: 1px solid #ebeef5;
		border-top: 0;
		height: 44px;
		line-height: 44px;
		span:first-child {
			margin-left: 36px;
		}
		span:last-child {
			width: 85%;
			display: inline-block;
			text-align: center;
		}
	}
	.emphasisNum {
		margin: 30px 0 20px;
		font-size: 14px;
		color: rgba(109, 119, 135, 1);
		span {
			color: rgba(57, 57, 57, 1);
		}
	}
  .imgdiv {
    float: left;
    width: 130px;
    height: 130px;
    border: 1px solid #C2CAD2;
    border-radius: 6px;
    position: relative;
    margin-right: 20px;
    margin-top: 10px;
    img {
      transition: all 0.5s;
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }
    span {
      display: none;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: rgba(0, 0, 0, 0.40);
      border-radius: 0 0 5px 5px;
      font-size: 14px;
      color: #FFFFFF;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
  .imgdiv:hover {
    span {
      display: inline-block;
    }
  }
  .imgbig {
    position: relative;
    z-index: 999;
    span {
      display: none !important;
    }
    img {
      transform: scale(2);
      border-radius: 0;
    }
  }
</style>