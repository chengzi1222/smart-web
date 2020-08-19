<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>培训计划</span>
    </div>

    <div class="user-box">
      <div class="mt20 mb20 clear_a">
        <el-input placeholder="培训标题" class="w250 mr20 seekIpt" v-model="queryLimit.keyword"
          @keyup.enter.native="changeSearch">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch"></i>
        </el-input>
        <el-select class="w200 mr20" v-model="queryLimit.year" :clearable="true" placeholder="培训年度"
          @change="changeSearch">
          <el-option v-for="item in year" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
        <el-select class="w200 mr20" v-model="queryLimit.quarter" :clearable="true" placeholder="培训季度"
          @change="changeSearch">
          <el-option v-for="(item,key) in quarter" :key="key" :label="item" :value="key">
          </el-option>
        </el-select>
        <!-- <select-area-grid class="mr20 w200" placeholder="创建部门" @change="areaChange"></select-area-grid> -->
        <el-select class="w200 mr20" v-model="queryLimit.trainingStatus" :clearable="true" placeholder="培训状态"
          @change="changeSearch">
          <el-option v-for="(item,key) in trainingStatus" :key="key" :label="item" :value="key">
          </el-option>
        </el-select>
        <el-select class="w200 mr20" v-model="queryLimit.assessStatus" :clearable="true" placeholder="考核状态"
          @change="changeSearch">
          <el-option v-for="(item,key) in trainingListAssessStatus" :key="key" :label="item" :value="key">
          </el-option>
        </el-select>
        <el-select class="w200 mr20" v-model="queryLimit.isPublic" :clearable="true" placeholder="允许公开报名"
          @change="changeSearch">
          <el-option v-for="(item,key)  in isPublic" :key="key" :label="item" :value="key">
          </el-option>
        </el-select>
        <el-button class="floatR mr20" type="primary" @click="add('add',null)"><i
            style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>添加
        </el-button>
      </div>
      <div class="tabOffTop120">
        <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
          :data="tableData" class="table-div">
          <el-table-column align="center" label="序号" type="index" min-width="50">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="title" min-width="150" label="培训标题"></el-table-column>
          <el-table-column show-overflow-tooltip prop="year" min-width="80" label="培训年度"></el-table-column>
          <el-table-column show-overflow-tooltip prop="quarter" min-width="80" label="培训季度">
            <template slot-scope="scope">
              {{quarter[scope.row.quarter]}}
            </template>
          </el-table-column>
          <!-- <el-table-column show-overflow-tooltip prop="deptName" min-width="150" label="创建部门"></el-table-column> -->
          <el-table-column show-overflow-tooltip prop="totalPeriod" min-width="80" label="总学时"></el-table-column>
          <el-table-column show-overflow-tooltip prop="courseCount" min-width="80" label="课程数"></el-table-column>
          <el-table-column show-overflow-tooltip prop="entityCount" min-width="120" label="培训主体数"></el-table-column>
          <el-table-column show-overflow-tooltip prop="personCount" min-width="120" label="培训人员数"></el-table-column>
          <el-table-column show-overflow-tooltip prop="streetAreaName" min-width="120" label="培训完成进度">
             <template slot-scope="scope">
              {{scope.row.finishCount}}/{{scope.row.personCount}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="isPublic" min-width="120" label="允许公开报名">
            <template slot-scope="scope">
              {{isPublic[scope.row.isPublic]}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="trainingStatus" min-width="80" label="培训状态">
            <template slot-scope="scope">
              <!-- 重启也是算培训中 -->
              {{trainingStatus[scope.row.trainingStatus]}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="startUpTime" min-width="80" label="启动日期">
            <template slot-scope="scope">
              {{scope.row.startUpTime?scope.row.startUpTime:'-'}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="assessStatus" min-width="80" label="考核状态">
            <template slot-scope="scope">
              {{trainingListAssessStatus[scope.row.assessStatus]}}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <a href="javascript:;" class="operate-a" v-if='scope.row.trainingStatus=="3"' @click='startTrainPlan(scope.row)'>启动</a>
              <a href="javascript:;" class="operate-a"  v-if='scope.row.trainingStatus!="2"' @click="add('edit',scope.row)">编辑</a>
              <a href="javascript:;" class="operate-a"
                @click="$router.push({name: 'assess.trainingDetail',query:{id:scope.row.id}});">详情</a>
              <!-- <a href="javascript:;" class="operate-a">统计</a> -->
              <a href="javascript:;" class="operate-a" v-if='scope.row.trainingStatus=="1"'  @click='accomplish(scope.row)'>完成</a>
              <a href="javascript:;"  v-if='scope.row.trainingStatus=="2"&&scope.row.assessStatus=="1"' class="operate-a" @click='assess(scope.row,1)'>创建考核</a>
               <a href="javascript:;"  v-if='scope.row.assessStatus!="1"' class="operate-a" @click='assess(scope.row,2)'>考核计划</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
            :current-page="queryLimit.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="queryLimit.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import * as api from "api/assess/index";
  import SelectAreaGrid from "components/common/SelectAreaGrid.vue";
  import {
    getPublic,
    getEntityType,
    getYear
  } from "../com.js";
  export default {
    data() {
      return {
        total: 0,
        loading: false,
        tableData: [],
        queryLimit: {
          pageNum: 1,
          pageSize: 10,
          areaCode: "",
          year: "",
          quarter: "",
          keyword: "",
          assessStatus: '',
          trainingStatus: ''
        },
        year: getYear(),
        quarter: getPublic().quarter,
        trainingStatus: getPublic().trainingStatus,
        trainingListAssessStatus: getPublic().trainingListAssessStatus,
        isPublic: getPublic().isPublic,
      };
    },
    components: {
      SelectAreaGrid
    },
    mounted() {
      this.searchPage();
    },
    methods: {
      areaChange(val) {
        if (!val || val.length == 0) {
          this.queryLimit.areaCode = "";
        } else {
          this.queryLimit.areaCode = val[val.length - 1];
        }
        this.changeSearch();
      },
      handleSelectionChange(val) {
        console.log(val)
      },
      assess(row,num) {
        if (num == 1) {
          this.$confirm("是否创建考核计划!", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info '
          }).then(() => {
            this.$router.push({
              name: "assess.assessAdd",
              query: {
                trainId: row.id,
                trainName:row.title
              }
            })
          })
        }else{
          // 跳转考核详情
           this.$router.push({name: 'assess.assessDetail',query:{id:row.assessPlanId}})
        }
      },
      accomplish(row) {
        this.$confirm("是否确定手动完成该培训计划?", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = new FormData()
          data.append('id', row.id)
          api.finishTrainPlan(data).then(r => {
            if (r.status) {
              this.$message.success("已手动完成该计划")
              this.changeSearch()
            }
          })
        })
      },
     startTrainPlan(row) {
				this.$confirm("是否确认启动，启动后将立即生效？", '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					const data = new FormData()
					data.append('id', row.id)
					api.trainPlanStartTrainPlan(data).then(r => {
						if (r.status) {
              this.$message.success("启动成功")
              this.changeSearch()
						} else {
							this.$message({
								message: r.message,
								type: 'error'
							});
						}
					})
				})
			},
      add(t, row) {
        this.$router.push({
          name: "assess.trainingAdd",
          query: {
            type: t,
            id: row ? row.id : '',
            status:row ? row.trainingStatus : '',
          }
        });
      },
      searchPage() {
        this.loading = true;
        api.trainPlanBaseList(this.queryLimit).then(result => {
          if (result.status) {
            this.tableData = result.data.list;
            this.total = result.data.total;
          } else {
            this.$message.warning("列表数据获取失败！请稍候重试");
          }
          this.loading = false;
        });
      },
      changeSearch() {
        this.queryLimit.pageNum = 1;
        this.searchPage();
      },
      pagecCurrentChange(num) {
        this.queryLimit.pageNum = num;
        this.searchPage();
      },
      pageSizeChange(size) {
        this.queryLimit.pageSize = size;
        this.changeSearch();
      },
    },
  };
</script>
<style scoped lang="scss">
  .ipt-btn-box {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .table-div {
    width: 100%;
    text-align: center;
  }

  .operate-a {
    color: #1787ad;
  }

  table tr td:last-child .cell a {
    border-right: 1px solid #ccc;
    padding-right: 5px;
  }

  table tr td:last-child .cell a:last-child {
    border-right: none;
    padding-right: 0px;
  }

  .yesTooltip {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFangSC;
    font-weight: 400;
    color: rgba(50, 194, 94, 1);
    line-height: 21px;
    text-align: center;
    width: 44px;
    height: 21px;
    background: rgba(236, 249, 240, 1);
    border-radius: 4px;
    border: 1px solid rgba(185, 231, 199, 1);
    display: inline-block;
  }

  .noTooltip {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFangSC;
    font-weight: 400;
    color: #a2aab6;
    line-height: 21px;
    text-align: center;
    width: 44px;
    height: 21px;
    background: rgba(242, 246, 250, 1);
    border-radius: 4px;
    border: 1px solid rgba(205, 216, 227, 1);
    display: inline-block;
  }
</style>