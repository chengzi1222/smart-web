<template>
	<div>
		<div class="page-tilt mb20">
			<b></b><span>培训计划{{type=='add'?'添加':'编辑'}}</span>
		</div>
		<div style="margin-bottom: 120px;position: relative;">
			<!-- 左边信息悬浮栏 start-->
			<div class="left-info" :class="{'ml_230':id!=''}">
				<div class="head-block">
					<ul class="main-block">
						<li class="clearfix " :class="slideIndex==index?'activePosition':''"
							v-for="(item,index) in progress" :key="index">
							<p class="floatL left">{{item}}</p>
						</li>
					</ul>
				</div>
			</div>
			<!-- 左边信息悬浮栏 end-->
			<div class="ml210">
				<baseInfo :id='id' @ok='baseInfoOk'></baseInfo>
				<Curriculum v-if='show' :id='id'></Curriculum>
				<Personnel v-if='show' :id='id'></Personnel>
			</div>
			<!-- 底部按钮 start-->
			<div class="foot-btn" style="z-index:980" v-if="type=='add'">
				<div>
					<el-button class="w100 mr10" @click="back">返回</el-button>
					<el-button class="w100 mr10" :disabled='!show' type="primary" @click="startTrainPlan">启动并返回
					</el-button>
				</div>
			</div>
			<div class="foot-btn" style="z-index:980" v-else>
				<div>
					<el-button class="w100 mr10" @click="$router.go(-1)">返回</el-button>
					<el-button class="w100 mr10" v-if="status=='3'" type="primary" @click="startTrainPlan">启动并返回
					</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import * as api from "api/assess/index";
	import scroll from "utils/scroll"
	import {
		getInfo
	} from 'api/cosmetics/subject';

	import baseInfo from "./com/base.vue";
	import Curriculum from "./com/curriculum.vue";
	import Personnel from "./com/personnel.vue";

	import * as common from "api/common";
	export default {
		data() {
			return {
				status: '3',
				type: 'add',
				id: '',
				show: false,
				slideIndex: -1,
				progress: ['基础信息'],
				progress1: ['基础信息', '培训课程管理', '培训人员管理']
			}
		},
		components: {
			baseInfo,
			Curriculum,
			Personnel,
		},

		mounted() {
			if (this.$route.query.type) {
				this.type = this.$route.query.type;
			}
			if (this.$route.query.id) {
				this.id = this.$route.query.id;
				this.status = this.$route.query.status;
				this.progress = this.progress1
			}
			this.show = this.type == 'edit' ? true : false;
			this.$nextTick(() => {
				scroll.call(this, 'slideIndex');
			})

		},
		methods: {
			baseInfoOk(id) {
				this.id = id;
				this.show = true;
				this.progress = this.progress1;
				this.$nextTick(() => {
					scroll.call(this, 'slideIndex');
				})
			},
			back() {
				if (this.id == "") {
					this.$router.go(-1)
					return
				}
				this.$confirm("正在返回培训列表，你当前的操作将默认待启动状态！", '提示', {
					confirmButtonText: '确定',
					type: 'success'
				}).then(() => {
					setTimeout(() => {
						this.$router.push('/assess/training/list')
					}, 1500)
				})
			},
			startTrainPlan() {
				this.$confirm("是否确认启动，启动后将立即生效？", '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					const data = new FormData()
					data.append('id', this.id)
					api.trainPlanStartTrainPlan(data).then(r => {
						if (r.status) {
							this.$message.success("启动成功,正在返回列表页")
							setTimeout(() => {
								this.$router.push('/assess/training/list')
							}, 1500)
						} else {
							this.$message({
								message: r.message,
								type: 'error'
							});
						}
					})
				})
			}
		},
		watch: {

		},
	}
</script>

<style scoped lang="scss">
	// 左边悬浮信息栏的样式 start
	$c: #0db5ef;

	.ml_230 {
		margin-left: -230px !important;
	}

	.left-info {
		width: 210px;
		height: 560px;
		background: #fff;
		position: absolute;

		z-index: 2;
		top: 0 !important;

		.head-block {
			padding: 0 20px;
			box-sizing: border-box;

			.num {
				color: $c;
			}
		}

		.main-block {
			>li {
				border-right: 2px solid #ebf1f5;
				padding: 0 20px;
				height: 50px;
				line-height: 50px;
				cursor: default;

				&:hover {
					background: #f2f5f8;
				}

				.right {
					color: #a2aab6;
				}
			}

			.activePosition {
				border-right: 2px solid $c;

				.left {
					color: $c;
				}
			}
		}
	}

	.ml210 {
		margin-left: 210px;
	}
</style>