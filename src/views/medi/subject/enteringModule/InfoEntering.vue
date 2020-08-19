<template>
	<div>
		<!-- 左边信息悬浮栏 start-->
		<div class="left-info">
			<div class="head-block">
				<ul class="main-block">
					<li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
						<p class="floatL left">{{item.title}}</p>
					</li>
				</ul>
			</div>
		</div>
		<!-- 左边信息悬浮栏 end-->
		<div class="ml250">
      <div v-if="type !== 'change' && type !== 'rework'">
        <span>今日已提交{{title}}数: {{toDaySubmitEntityCount}}</span>
      </div>
			<!-- 基础信息 -->
			<BasicsInfo @getData="getData" :initData="form" ref="basics" :outs="out"></BasicsInfo>
			<!-- 负责人信息 -->
			<PrincipalInfo :entityType="entityType" @getData="getData" :initData="form" ref="principal" :outs="out"></PrincipalInfo>
			<!-- 经营信息 -->
			<ManageInfo :entityType="entityType" @getData="getData" :initData="form" ref="manage" :outs="out"></ManageInfo>
			<!-- 责任落实 -->
			<Responsibility @getData="getData" :initData="form" ref="duty" :type="type" :outs="out"></Responsibility>
		</div>
		<!-- 底部按钮 start-->
		<div class="foot-btn" style="z-index:998">
			<div>
				<el-button v-if="type !== 'change' && type !== 'rework'" style="width:120px;" @click="addBackup">保存到草稿箱</el-button>
				<el-button v-auth="'medi.biz.mb|func.add,medi.biz.eb|func.add'" type="primary" @click="submitSub">提交审核</el-button>
				<el-button v-if="type === 'change' || type === 'rework'"  @click="$router.go(-1)">返回</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import scroll from "utils/scroll";
	import BasicsInfo from './module/BasicsInfo';
	import PrincipalInfo from './module/PrincipalInfo';
	import ManageInfo from './module/ManageInfo';
	import Responsibility from './module/Responsibility';
  import { addEntity, toDaySubmitEntityCount, addBackup, getBackup, getInfo, submitChange} from 'api/medi/subject/manageEntity';
  import {rework,getReInfo} from "api/medi/workflow/workflow";
import { getEntityName } from '../entityUtils';

	export default {
		mounted() {
      this.title = getEntityName("MEDICINE",  this.entityType)
      this.form.entityTypeExt = this.entityType
			scroll.call(this, 'slideIndex');
      if (this.backupId) {
        // 草稿箱
        getBackup(this.backupId).then(r => {
          this.form = r.data
        })
      } else {
        if(this.type == 'rework'){
          //重新申请
          if (this.entityId) {
            getReInfo({"entityId":this.entityId,"workId":this.supply}).then(r => {
              this.form = r.data
            })
          }
        }else{
          // 编辑
          if (this.entityId) {
            getInfo(this.entityId).then(r => {
              this.form = r.data
            })
          }
        }
      }
      if (this.type !== 'change') {
        this.initCount()
      }
		},
    watch: {
      form () {
        this.$emit("getEntityName", this.form.entityName)
      }
    },
		methods: {
      submitSub() {
        Promise.all(['basics', 'principal', 'manage', 'duty'].map(item => (
          this.$refs[item].submitSub()
        )))
          .then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'Loading'
            })
            //全部验证通过
            if (this.type === 'change') {
              // 编辑
              submitChange (this.form).then(r => {
                if (r.status) {
                  loading.close()
                  this.$message({
                    message: '提交审核成功!',
                    type: 'success'
                  })
                  this.$router.push({name: 'medi.subject.list'})
                  return
                }
                loading.close()
                this.$message({
                  message: r.message,
                  type: 'warning'
                })
              })
            }else if(this.type === 'rework'){
              // 重新申请
              this.form["workId"] = this.supply;
              rework (this.form).then(r => {
                if (r.status) {
                  loading.close()
                  this.$message({
                    message: '提交审核成功!',
                    type: 'success'
                  })
                  this.$router.go(-1);
                  return
                }
                loading.close()
                this.$message({
                  message: r.message,
                  type: 'warning'
                })
              })
            }else { // 录入
              addEntity(this.form).then((r) => {
                if (r.status) {
                  // 清空表单
                  this.reset(this.out)
                  this.initCount()
                  this.$emit('dataChange')
                  loading.close();
                  this.$message({
                    message: '提交审核成功!',
                    type: 'success'
                  });
                  this.form={}
                  this.form.entityType='MEDICINE';
                  this.form.entityTypeExt = this.entityType
                  return;
                }
                loading.close();
                this.$message({
                  message: r.message,
                  type: 'warning'
                });
              });
            }
          })
          .catch((err) => {
            //至少有一项没有通过
            this.$message({
              message: '请输入必填字段!',
              type: 'warning'
            });
          })
      },
      reset(out) {
        console.log(out)
        this.out = out + 1;
      },
      //获得组件里的数据
      getData(componentData) {
        this.form = Object.assign(this.form, componentData);
      },
      addBackup () {
        addBackup(this.form).then(r => {
          if (r.status) {
            this.$message({
              message: '提交草稿箱成功!',
              type: 'success'
            })
            this.$emit("getTab", 'draft')
            return
          }
          this.$message({
            message: r.message,
            type: 'warning'
          })
        })
      },
      initCount () {
        toDaySubmitEntityCount ('MEDICINE', this.entityType).then(r => {
          this.toDaySubmitEntityCount = r.data.count
        })
      }
		},
		data() {
			return {
        title: '',
        toDaySubmitEntityCount: '',
        form: {
          entityType: 'MEDICINE',
          entityTypeExt: ''
        },
				slideIndex: -1,
				progress: [
					{
						title: '基础信息',
						successNum: 0,
						totalNum: 0
					},
					{
						title: '负责人信息',
						successNum: 0,
						totalNum: 0
					},
					{
						title: '经营信息',
						successNum: 0,
						totalNum: 0
					},
					{
						title: '责任落实',
						successNum: 0,
						totalNum: 0
					},
				],
        out:0
			}
		},
		components: {
			BasicsInfo,
			PrincipalInfo,
			ManageInfo,
			Responsibility
		},
    props: {
      backupId: {
        type: String
      },
      entityId: {
        type: String
      },
      type: {
        type: String
      },
      supply:{
        type:String
      },
      entityType: {
        type: String
      }
    }
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
		margin-top: 27px;
		z-index: 2;

		.head-block {
			// background: #f2f5f8;
			// height: 70px;
			padding: 14px 20px;
			box-sizing: border-box;
			.num {
				color: $c;
			}
		}
		.main-block {
			margin-top: 20px; // border-right: 2px solid #EBF1F5;
			// min-height: 470px;
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
