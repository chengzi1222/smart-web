<template>
	<div>
		<div class="page-tilt mb20">
			<b></b><span>公开培训计划添加</span>
		</div>
		<div style="margin-bottom: 120px;position: relative;">
			<!-- 左边信息悬浮栏 start-->
			<div class="left-info">
				<div class="head-block">
					<ul class="main-block">
						<li class="clearfix " :class="slideIndex==index?'activePosition':''"
							v-for="(item,index) in progress" :key="index">
							<p class="floatL left">{{item.title}}</p>
							<p class="floatR right">
								<span>{{item.total}}</span>
							</p>
						</li>
					</ul>
				</div>
			</div>
			<!-- 左边信息悬浮栏 end-->
			<div class="ml210">
				<Base></Base>
				<Curriculum></Curriculum>
				<Type></Type>
			</div>
			<!-- 底部按钮 start-->
			<div class="foot-btn" style="z-index:998">
				<div>
					<el-button class="w100 mr10">取消</el-button>
					<el-button type="primary w100">保存</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import scroll from "utils/scroll"
	import {
		getInfo
	} from 'api/cosmetics/subject';

	import Base from "./com/base.vue";
	import Curriculum from "./com/curriculum.vue";
	import Type from "./com/type.vue";

	import * as common from "api/common";
	export default {
		data() {
			return {
				slideIndex: -1,
				progress: [{
						title: '基础信息',
						total: ''
					},
					{
						title: '培训课程管理',
						total: '0'
					},
					{
						title: '培训类型管理',
						total: '0'
					}
				]
			}
		},
		components: {
			Base,
			Curriculum,
			Type,
		},
		mounted() {
			scroll.call(this, 'slideIndex');
		},
		methods: {},
		watch: {

		},
	}
</script>

<style scoped lang="scss">
	// 左边悬浮信息栏的样式 start
	$c: #0db5ef;

	.left-info {
		width: 210px;
		height: 560px;
		background: #fff;
		position: fixed;
		margin-left: -230px;
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