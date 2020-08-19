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
              <el-form-item label="统一社会信用代码:" title="(组织机构代码证)">
                <span>{{entity.creditCode ? entity.creditCode : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="entityType=='MAAI_EMPLOY'">
              <el-form-item label="医疗机构执业许可证:">
                <span>{{entity.employNo ? entity.employNo : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
                <el-form-item label="法人姓名:">
                  <span>{{entity.legalPerson ? entity.legalPerson : '暂无'}}</span>
                </el-form-item>
                <el-form-item label="法人身份证:">
                  <span>{{entity.legalNo ? entity.legalNo : '暂无'}}</span>
                </el-form-item>
            </div>
            <div class="row">
                <el-form-item label="法人电话:">
                  <span>{{entity.legalMobile ? entity.legalMobile : '暂无'}}</span>
                </el-form-item>
                <el-form-item label="负责人:">
                  <span>{{entity.corpPerson ? entity.corpPerson : '暂无'}}</span>
                </el-form-item>
            </div>
            <div class="row">
                <el-form-item label="联系人:">
                  <span>{{entity.contactPerson ? entity.contactPerson : '暂无'}}</span>
                </el-form-item>
                <el-form-item label="联系电话:">
                  <span>{{entity.contactMobile ? entity.contactMobile : '暂无'}}</span>
                </el-form-item>
            </div>
        </div>
        </toggle-form>

        <toggle-form title="经营信息">
          <div class="content">
            <div class="row red">
              <el-form-item label="注册经营地址">
                <span>{{entity.registerAddr ? entity.registerAddr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="实际经营地址:">
                <span>{{entity.realityAddr ? entity.realityAddr : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="生产地址:" v-if="entityType=='MAAI_PRODUCT'">
                <span>{{entity.otherAddr ? entity.otherAddr : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="仓库地址:" v-else>
                <span>{{entity.otherAddr ? entity.otherAddr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="营业状态:">
                <span>{{entity.manageStateStr ? entity.manageStateStr : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="营业方式:"  v-if="entityType=='MAAI_MANAGER'">
                <span>{{entity.manageTypeStr ? entity.manageTypeStr : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="企业形态:"  v-if="entityType!=='MAAI_PRODUCT'">
                <span>{{entity.enterpriseFormStr ? entity.enterpriseFormStr : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="是否网络经营:"  v-if="entityType=='MAAI_MANAGER'">
                <span>{{entity.onlineStr ? entity.onlineStr : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="entityType=='MAAI_MANAGER' && entity.online === 'YES'">
              <el-form-item label="网络经营备注:">
                <span>{{entity.onlineRemark ? entity.onlineRemark : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="使用类别：" v-if="entityType === 'MAAI_EMPLOY'">
                <span>{{entity.categoryStr ? entity.categoryStr : '暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <toggle-form v-if="entityType !== 'MAAI_EMPLOY'" title="许可备案信息">
          <div class="content">
            <div class="row">
            <el-form-item label="是否多证合一:" v-if="entityType == 'MAAI_MANAGER'" >
              <span>{{entity.multInOneStr ? entity.multInOneStr : '暂无'}}</span>
            </el-form-item>
            </div>
            <div class="row">
              <el-form-item :label="entityType === 'MAAI_MANAGER' ? '经营类别：' : '生产类别：'">
                <span>{{entity.categoryStr ? entity.categoryStr : '暂无'}}</span>
              </el-form-item>
            </div>
            <Card v-if="entityType === 'MAAI_PRODUCT'" v-for="(value, key, index) in entity.maaiLicenceMap" :key="index" :licence="value" :showType="'info'"></Card>
            <manager-card v-if="entityType === 'MAAI_MANAGER' && entity.multInOne === 'NO'" v-for="(value, key, index) in entity.maaiLicenceMap" :key="index" :licence="value" :showType="'info'"></manager-card>
            <mult-in-one-card v-if="entityType === 'MAAI_MANAGER' && entity.multInOne === 'YES'" v-for="(value, key, index) in entity.maaiLicenceMap" :key="index" :licence="value" :showType="'info'"></mult-in-one-card>
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
                <span>{{entity.soPhoneNumber ? entity.soPhoneNumber : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="网格信息员:">
                <span>{{entity.infoAssiName ? entity.infoAssiName : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="网格信息员联系方式:">
                <span>{{entity.infoAssiPhoneNumber ? entity.infoAssiPhoneNumber : '暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>
      </el-form>
		</div>
		<!-- 底部按钮 start-->
		<div class="foot-btn" style="z-index:998">
			<div>
				<el-button @click="back">返回</el-button>
			</div>
		</div>
	</div>
</template>

<script type="module">
	import scroll from "utils/scroll"
  import * as entity from 'api/medicalDevices/entity';
  import ToggleForm from "components/ToggleForm.vue";
  import * as common from "api/common";
import ManagerCard from './managerCard'
import multInOneCard from './multInOneCard'
import Card from './card'
	export default {
		mounted() {
      scroll.call(this, 'slideIndex');
      if(this.entityType=="MAAI_PRODUCT"){
        this.registerAddrLabel='注册场所：';
        this.registerAddrPlaceholder='请输入注册场所'
      } else if (this.entityType === 'MAAI_MANAGER') {

      } else if (this.entityType === 'MAAI_EMPLOY') {

      }

      if (this.entityType !== 'MAAI_EMPLOY') {
        this.progress = [{
						title: '基础信息',
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
					}]
      } else {
        this.progress = [{
						title: '基础信息',
						successNum: 0,
						totalNum: 0
					},
					{
						title: '经营信息',
						successNum: 0,
						totalNum: 0
					},
					{
						title: '许可备案信息',
						successNum: 0,
						totalNum: 0
					},
					{
						title: '责任落实',
						successNum: 0,
						totalNum: 0
					}]
      }
      
      entity.get(this.entityId).then(r => {
        this.entity = r.data;
      });
		},
		methods: {
        back(){
          if(this.$route.query.ratingIndexRisk||this.$route.query.ratingIndexQuantity){//风险分级跳过来
              if(this.$route.query.ratingIndexRisk){
                // this.$router.push({name: "cosmetics.rating.riskLevel", query: {index: this.$route.query.ratingIndexRisk}});
              }else{
                // this.$router.push({name: "cosmetics.rating.quantifyLevel", query: {index: this.$route.query.ratingIndexQuantity}});
              }
          }else{
              this.$router.go(-1)
          }
        },
        recursion(arr,arr2){
          for (let item in arr) {
                if (
                  Object.prototype.toString
                    .call(arr[item])
                    .slice(8, -1)
                    .toLowerCase() === "function"
                ) {
                  continue;
                }
            for(let v in arr2 ){
              if (
                  Object.prototype.toString
                    .call(arr2[v])
                    .slice(8, -1)
                    .toLowerCase() === "function"
                ) {
                  continue;
                }
              if(arr2[v]==arr[item].code){
                this.entity.detailedEngageStr+=arr[item].name+',';
              }
            }
          }
        },
		},
    watch: {
      entity () {
        this.$emit("getEntityName", this.entity.entityName)
      }
    },
    props: {
      entityId: {
        type: String
      },
      entityType: {
        type: String
      }
    },
		data() {
			return {
        detailedEngageItem:[],
        detailedEngageText:'',
        manageRangeText:'',
        entity: {},
				slideIndex: -1,
				progress: [

				]
			}
		},
		components: {
      ToggleForm,
      ManagerCard,
      multInOneCard,
      Card
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
