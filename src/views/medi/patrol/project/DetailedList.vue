<template>
	<div>
		<div style="margin-top:20px;border-left:3px solid  #0DB5EF;">
			<span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;">要点详情</span>
		</div>
		<div class="container">
			<div class="right-info">
				<el-form label-width="110px" class="demo-ruleForm">
					<!-- 基本信息 -->
					<toggle-form title="基本信息">
						<div class="content toggle-form-c">
							<div class="row">
								<el-form-item label="名称:" prop="">
									<span>{{patrolTable.name}}</span>
								</el-form-item>
								<el-form-item label="主体类型:" prop="">
									<span>{{patrolTable.entityTypeLabel}}</span>
								</el-form-item>
							</div>

						</div>
					</toggle-form>

					<!-- 巡查项 -->
					<toggle-form title="抽检内容">
						<p class="emphasisNum">最少巡查重点项个数：<span>{{patrolTable.minImportant}}</span></p>
						<div class="toggle-form-c">
									<yb-table :tableData = "tableData"
                      :column = "column"
                      statusField = 'enable'
                      style="clear:both;"
                      listField='children'
                      scoreField="score"
                      entryTypeField="detail"
									>
									</yb-table>
						</div>

					</toggle-form>
				</el-form>
			</div>
		</div>
		<!-- 底部按钮 -->
		<div class="foot-btn" style="z-index:1">
			<div>
				<el-button class="w100" @click="goBack">返回</el-button>
				<el-button class="w100" @click="goContext">配置</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import ToggleForm from "components/ToggleForm.vue";
  import YbTable from "components/ybtable/YbTable"
  import { listContext, getPatrolTable } from 'api/medi/patrol/project';

	export default {
		components: {
			ToggleForm, YbTable
		},
    async mounted() {
      this.patrolTableId = this.$route.query.patrolTableId;

      await listContext(this.patrolTableId).then((result) => {
        if(result && result.status) {
          this.tableData = result.data.filter(function (data) {
            return data.children.length != 0;
          });
        }
      }),

      await getPatrolTable(this.patrolTableId).then((result) => {
        if(result && result.status) {
          this.patrolTable = result.data;
        }
      })
		},
		methods: {
      goContext() {
        this.$router.push({name: "mediPatrolContextList", query: {"patrolTableId": this.patrolTableId}})
      },

      goBack(){
        this.$router.push({name: 'mediPatrolTableList'});
      },
		},
		data() {
			return {
				gross: 0,
        patrolTable: {},
        column: [
          {
            prop: "no",
            label: "检查项编号"
          },
          {
            prop: "name",
            label: "抽查项目"
          },
          {
            prop: "children",
            subColumn: [
              {
                prop: "completeNo",
                label: "抽查内容编号",
              },
              {
                prop: "context",
                label: "抽查内容",
              },
              {
                prop: "importantLabel",
                label: "是否重点项",
              },
              {
                prop: "score",
                label: "分值",
              },
              {
                prop: "enable",
                label: "enable",
              },
              {
                prop: "enableLabel",
                label: "状态",
              },
            ],
          },
        ],
        tableData: [],
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
	.emphasisNum{
		margin: 30px 0 20px;
		font-size:14px;
		color:rgba(109,119,135,1);
		 span{
			color:rgba(57,57,57,1);
		 }
	}
</style>
