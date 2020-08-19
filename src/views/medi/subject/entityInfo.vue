<template>
	<div style="margin-bottom: 120px;">
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
      <el-form :model="entity" label-width="130px" class="demo-ruleForm labW150 right-info">
        <toggle-form title="基础信息">
          <div class="content">
            <div class="row">
              <el-form-item label="主体名称:">
                <span>{{entity.entityName ? entity.entityName : '暂无'}}</span>
              </el-form-item>

              <el-form-item label="社会统一信用代码:">
                <span>{{entity.creditCode ? entity.creditCode : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="法人姓名:">
                <span>{{entity.legalPerson ? entity.legalPerson : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="许可备案号:">
                <span>{{entity.backupNo ? entity.backupNo : '暂无'}}</span>
              </el-form-item>

              <el-form-item label="许可证状态(主体状态):">
                <span>{{entity.backupStateStr ? entity.backupStateStr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="有效期:">
                <span>{{entity.recordBegin ? entity.recordBegin : '暂无'}}</span>
                -
                <span>{{entity.recordEnd ? entity.recordEnd : '暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <toggle-form title="负责人信息">
          <div class="content">
            <div class="row">
              <el-form-item label="负责人:">
                <span>{{entity.corpName ? entity.corpName : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="手机号:">
                <span>{{entity.corpMobile ? entity.corpMobile : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="身份证号:">
                <span>{{entity.idNo ? entity.idNo : '暂无'}}</span>
              </el-form-item>
              <el-form-item v-if="entity.entityTypeExt === 'MEDICINE_MANAGER'" label="质量负责人:">
                <span>{{entity.qualityPerson ? entity.qualityPerson : '暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <toggle-form title="经营信息">
          <div class="content">
            <div class="row">
              <el-form-item label="风险等级:">
                <span>{{entity.riskRankStr ? entity.riskRankStr : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="量化等级:">
                <span>{{entity.quanLevelStr ? entity.quanLevelStr : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="注册经营地址:">
                <span>{{entity.registerAddr ? entity.registerAddr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="实际经营地址:">
                <span>{{entity.realityAddr ? entity.realityAddr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div v-if="entity.entityTypeExt === 'MEDICINE_MANAGER'" class="row">
              <el-form-item label="机构类型:">
                <span>{{entity.organizationTypeStr ? entity.organizationTypeStr : '暂无'}}</span>
              </el-form-item>

              <el-form-item label="经营方式:">
                <span>{{entity.manageWayStr ? entity.manageWayStr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div v-if="entity.entityTypeExt === 'MEDICINE_MANAGER'" class="row">
              <el-form-item label="药品企业类型:">
                <span>{{entity.enterpriseTypeStr ? entity.enterpriseTypeStr : '暂无'}}</span>
              </el-form-item>

              <el-form-item label="连锁类型:">
                <span>{{entity.chainTypeStr ? entity.chainTypeStr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="营业状态:">
                <span>{{entity.manageStateStr ? entity.manageStateStr : '暂无'}}</span>
              </el-form-item>

              <el-form-item label="企业形态:">
                <span>{{entity.enterpriseFormStr ? entity.enterpriseFormStr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div v-if="entity.entityTypeExt === 'MEDICINE_MANAGER'" class="row">
              <div class="row">
                <el-form-item label="经营类别:" >
                  <span>{{entity.manageTypeStr ? entity.manageTypeStr : '暂无'}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="经营范围:" >
                  <span>{{entity.manageRangeStr ? entity.manageRangeStr : '暂无'}}</span>
                </el-form-item>
              </div>
            </div>
          </div>
        </toggle-form>

        <toggle-form title="责任落实">
          <div class="content">
            <div class="row">
              <el-form-item label="所属食药所:">
                <span>{{entity.syjName ? entity.syjName : '暂无'}}</span>
              </el-form-item>

              <el-form-item label="所在网格:">
                <span>{{entity.gridName ? entity.gridName : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="监管人员:">
                <span>{{entity.soName ? entity.soName : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="监管人员联系方式:">
                <span>{{entity.soMobile ? entity.soMobile : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="网格信息员:">
                <span>{{entity.infoAssiName ? entity.infoAssiName : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="网格信息员联系方式:">
                <span>{{entity.infoAssiMobile ? entity.infoAssiMobile : '暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>
      </el-form>
		</div>
		<!-- 底部按钮 start-->
		<div class="foot-btn" style="z-index:998">
			<div>
				<el-button @click="$router.go(-1)">返回</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import scroll from "utils/scroll"
  import { getInfo } from 'api/medi/subject/manageEntity'
  import ToggleForm from "components/ToggleForm.vue";
	export default {
		mounted() {
			scroll.call(this, 'slideIndex');
      getInfo(this.entityId).then(r => {
        this.entity = r.data
      })
		},
		methods: {

		},
    watch: {
      entity () {
        this.$emit("getEntityName", this.entity.entityName)
      }
    },
    props: {
      entityId: {
        type: String
      }
    },
		data() {
			return {
        entity: {},
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
				]
			}
		},
		components: {
      ToggleForm
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
