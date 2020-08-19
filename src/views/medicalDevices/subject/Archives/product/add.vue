<template>
	<div style="position: relative;">
		<div v-if="type === 'add'" class="page-tilt">
			<b></b><span>医疗器械生产企业添加</span>
		</div>
        <!-- 左边信息悬浮栏 start-->
		<div class="left-info">
			<div class="head-block">
				<ul class="main-block">
					<li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
						<p class="floatL left">{{item}}</p>
					</li>
				</ul>
			</div>
		</div>
		<!-- 左边信息悬浮栏 end-->
        <!-- 添加start -->
        <div class="ml250" >
            <div v-if="type === 'add'">
                <span>今日已提交生产主体数: {{toDaySubmitEntityCount}}</span>
            </div>
            <!-- 基础信息 -->
            <BasicsInfo @getData="getData" :entityType="entityType"  :initData="form" ref="basics" :outs="out"></BasicsInfo>
            <!-- 经营信息 -->
            <ManageInfo  @getData="getData" :entityType="entityType" @outRegisterAddr="outRegisterAddr" @outOtherAddr="outOtherAddr" :initData="form" ref="principal" :outs="out"></ManageInfo>
            <!-- 许可备案号 -->
            <Permission @getData="getData" :initInfo="cardObj" :registerAddr="registerAddr" :otherAddr="otherAddr" :type="type" :entityType="entityType" :outs="out" :initData="form" ref="card"></Permission>
            <!-- 责任落实 -->
            <Responsibility  @getData="getData" :type="type" :initData="form" ref="duty" :outs="out"></Responsibility>
        </div>
        <!-- 添加end -->
        <div class="foot-btn" style="z-index:998">
            <div>
                <el-button @click="$router.go(-1)">取消并返回</el-button>
                <el-button type="primary" @click="submit">提交审核</el-button>
            </div>
        </div>
    </div>
</template>

<script type="module">
import scroll from "utils/scroll";
import BasicsInfo from '../BasicsInfo';
import ManageInfo from '../ManageInfo';
import Responsibility from '../Responsibility';
import Permission from '../Permission'
import * as entity from 'api/medicalDevices/entity'
import {postRework} from 'api/maai/workflow/workedit'
export default {
    props: {
        type: {
            type: String
        },
        entityId: {
            type: String
        },
        workId:{
            type: String
        }
    },
    components: {
        BasicsInfo,ManageInfo,Responsibility,Permission
    },
    mounted() {
        scroll.call(this, 'slideIndex');
        if (!this.entityId) {
            this.type = 'add'
            entity.getToDaySubmitEntityCount('MAAI_PRODUCT').then(r => {
                this.toDaySubmitEntityCount = r.data.toDaySubmitEntityCount
            })
        } else {
            entity.get(this.entityId).then(r => {
                this.form = r.data
                let licences = []
                Object.keys(this.form.maaiLicenceMap).forEach(key => {
                    licences.push(this.form.maaiLicenceMap[key])
                })
                this.form.licences = licences
            })
        }
    },
    methods: {
        submit(){
            Promise.all(['basics', 'principal', 'duty', 'card'].map(item => (
                this.$refs[item].submitSub()
            ))).then(() => {
                if (this.type === 'add') {
                    entity.checkCreditCode('MAAI_PRODUCT', this.form.creditCode).then(r => {
                        if (r.status) {
                            if (!r.data) {
                                entity.add(this.form).then(r => {
                                    if (r.status) {
                                        this.$message({message: "提交成功", type: "success"})
                                        entity.getToDaySubmitEntityCount('MAAI_PRODUCT').then(r => {
                                            this.toDaySubmitEntityCount = r.data.toDaySubmitEntityCount
                                        })
                                        this.reset()
                                    } else {
                                        this.$message({message: r.message, type: "warning"})
                                    }
                                })
                            } else {
                                this.$refs.basics.creditCodeDisplay = true
                            }
                        } else {
                            this.$message({message: r.message, type: 'warning'})
                        }
                    })
                } else if (this.type === 'CHANGE') {
                    entity.checkCreditCode('MAAI_PRODUCT', this.form.creditCode).then(r => {
                        if (r.status) {
                            if (!r.data || r.data === this.form.id) {
                                entity.edit(this.form).then(r => {
                                    if (r.status) {
                                        this.$message({message: "提交成功", type: "success"})
                                        this.reset()
                                    } else {
                                        this.$message({message: r.message, type: "warning"})
                                    }
                                })
                            } else {
                                this.$refs.basics.creditCodeDisplay = true
                            }
                        } else {
                            this.$message({message: r.message, type: 'warning'})
                        }
                    })
                }else if(this.type == 'REWORK'){
                  postRework(this.workId,this.form).then(r=>{
                    if (r.status) {
                      this.$message({message: "提交成功", type: "success"})
                      this.reset()
                    } else {
                      this.$message({message: r.message, type: "warning"})
                    }
                  })
                }
            })
        },
        getData(componentData) {
            this.form = Object.assign(this.form, componentData);
        },
        reset(out) {
            this.out = out + 1;
        },
        outRegisterAddr (registerAddr) {
            this.registerAddr = registerAddr
        },
        outOtherAddr (otherAddr) {
            this.otherAddr = otherAddr
        }
    },
    data(){
        return{
            entityType:'MAAI_PRODUCT',
            registerAddr: '',
            otherAddr: '',
            progress:['基础信息','经营信息','许可备案信息','责任落实'],
            toDaySubmitEntityCount: 0,
            slideIndex: -1,
            form:{
                entityType: 'MAAI_PRODUCT'
            },
            out:0,
            cardObj:{},//卡片初始化信息
        };
    }
};
</script>

<style scoped lang="scss">
	// 左边悬浮信息栏的样式 start
	$c: #0db5ef;
	.left-info {
        left: 0 !important;
        top:50px !important;
		width: 210px;
		height: 560px;
		background: #fff;
		position: fixed;
		z-index: 2;

		.head-block {
			padding: 14px 20px;
			box-sizing: border-box;
			.num {
				color: $c;
			}
		}
		.main-block {
			margin-top: 20px;
			> li {
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
	.ml250{
		margin-left: 250px;
	}

  .right-info .content {
    width: 870px;
    margin: 20px auto 0;
  }
  .row .el-form-item {
    min-width: 400px;
  }
</style>
