<template>
	<div>
		<div class="page-tilt">
			<b></b><span>题库{{type=='add'?"添加":'编辑'}}</span>
			<!-- <back></back> -->
		</div>
		<div style="margin-bottom: 120px;position: relative;">
			<!-- 左边信息悬浮栏 start-->
			<div class="left-info" :class="{'ml_230':id!=''}">
				<div class="head-block">
					<ul class="main-block">
						<li class="clearfix " :class="slideIndex==index?'activePosition':''"
							v-for="(item,index) in progress" :key="index">
							<p class="floatL left">{{item}}</p>
							<p class="floatR right" v-if='item=="单选题"'>（{{number.singleChoiceCount}}）</p>
							<p class="floatR right" v-if='item=="多选题"'>（{{number.multipleChoiceCount}}）</p>
							<p class="floatR right" v-if='item=="判断题"'>（{{number.judgeCount}}）</p>
						</li>
					</ul>
				</div>
			</div>
			<!-- 左边信息悬浮栏 end-->
			<div class="ml210 mb200">
				<baseInfo :id='id' @ok='baseInfoOk'></baseInfo>
				<Single v-if='show' :id='id' @questionDepotCount='count' :num='number.judgeCount'></Single>
				<Multiple v-if='show' :id='id' @questionDepotCount='count' :num='number.multipleChoiceCount'></Multiple>
				<Judge v-if='show' :id='id' @questionDepotCount='count' :num='number.singleChoiceCount'></Judge>
			</div>
			<!-- 底部按钮 start-->
			<div class="foot-btn" style="z-index:998">
				<div>
					<el-button class="w100 mr10" @click="$router.go(-1)">返回</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import scroll from "utils/scroll"
	import Back from 'utils/back.vue'
	import baseInfo from "./com/base.vue";
	import Single from "./com/single.vue";
	import Multiple from "./com/multiple.vue";
	import Judge from "./com/judge.vue";
	import * as api from "api/assess/index";
	export default {
		data() {
			return {
				type: 'add',
				id: '',
				show: false,
				slideIndex: -1,
				progress: ['基础信息'],
				progress1: ['基础信息', '单选题', '多选题', '判断题'],
				number: {
					judgeCount: 0,
					multipleChoiceCount: 0,
					singleChoiceCount: 0,
				}
			}
		},
		components: {
			Back,
			baseInfo,
			Single,
			Multiple,
			Judge
		},
		mounted() {
			if (this.$route.query.type) {
				this.type = this.$route.query.type;
			}
			if (this.$route.query.id) {
				this.id = this.$route.query.id;
				this.progress = this.progress1;
				this.count()
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
				this.count()
				this.$nextTick(() => {
					scroll.call(this, 'slideIndex');
				})
			},
			count() {
				api.questionDepotCount(this.id).then((r) => {
					if (r.status) {
						this.number = r.data
					}
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