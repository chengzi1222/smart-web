<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>考核计划</span>
    </div>

    <div class="user-box">
      <div class="mt20 mb20 clear_a">
        <el-input placeholder="考核计划名称" class="w250 mr20 seekIpt" v-model="queryLimit.keyWord"
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
        <el-select class="w200 mr20" v-model="queryLimit.startStatus" :clearable="true" placeholder="考核状态"
          @change="changeSearch">
          <el-option v-for="(item,key) in assessStatus" :key="key" :label="item" :value="key">
          </el-option>
        </el-select>
        <el-button class="floatR mr20" type="primary" @click="add('add',null)"><i
            style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>添加
        </el-button>
        <el-button class="floatR mr20" @click="exportList">
          导出
        </el-button>
      </div>
      <div class="tabOffTop120">
        <el-table v-loading="loading" @selection-change="handleSelectionChange" element-loading-text="数据正在努力加载中"
          :border="true" :resizable="true" :data="tableData" class="table-div">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="name" min-width="120" label="考核计划名称"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="200" label="考核题库">
            <template slot-scope="scope">
              {{scope.row.questionDepotName?scope.row.questionDepotName:'-'}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="year" min-width="80" label="考核年度"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" label="考核季度">
            <template slot-scope="scope">
              {{quarter[scope.row.quarter]}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" label="考核状态">
            <template slot-scope="scope">
              {{assessStatus[scope.row.startStatus]}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="duration" min-width="80" label="考核时长">
            <template slot-scope="scope">
              {{scope.row.duration==-1?'不限时间':scope.row.duration+'分钟'}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" label="启动日期">
            <template slot-scope="scope">
              {{scope.row.startDate?scope.row.startDate:'-'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <a href="javascript:;" class="operate-a" v-if='scope.row.startStatus=="2"'
                @click='accomplish(scope.row,"3","手动完成")'>完成</a>
              <a href="javascript:;" class="operate-a" v-if='scope.row.startStatus=="1"'
                @click='accomplish(scope.row,"2","启动")'>启动</a>
              <a href="javascript:;" class="operate-a" v-if='scope.row.startStatus!="3"'
                @click="add('edit',scope.row)">编辑</a>
              <a href="javascript:;" class="operate-a"
                @click="$router.push({name: 'assess.assessDetail',query:{id:scope.row.id}});">详情</a>
              <!-- <a href="javascript:;" class="operate-a">统计</a> -->
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
  import {
    getPublic,
    getEntityType,
    getYear
  } from "../com.js";
  import {
        downloadFile
    } from "api/common";
  export default {
    data() {
      return {
        tableData: [],
        total: 0,
        loading: false,
        queryLimit: {
          pageNum: 1,
          year: "",
          quarter: "",
          keyWord: "",
          startStatus: '',
          pageSize: 10
        },
        selList: [],
        year: getYear(),
        quarter: getPublic().quarter,
        assessStatus: getPublic().assessStatus,
      };
    },
    mounted() {
      this.searchPage();
    },
    methods: {
      handleSelectionChange(val) {
        this.selList = val.map(obj => obj.id)
      },
      add(t, row) {
        this.$router.push({
          name: "assess.assessAdd",
          query: {
            type: t,
            id: row ? row.id : '',
            status: row ? row.startStatus : '',
          }
        });
      },
      accomplish(row, startStatus, text) {
        this.$confirm("是否确定" + text + "该考核计划?", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = new FormData()
          data.append('id', row.id)
          data.append('startStatus', startStatus)
          data.append('questionDepotId', row.questionDepotId)
          api.assessPlanFinish(data).then(r => {
            if (r.status) {
              this.$message.success("已" + text + "该计划")
              this.changeSearch()
            }
          })
        })
      },
      searchPage() {
        this.loading = true;
        api.assessPlanList(this.queryLimit).then(result => {
          if (result.status) {
            this.tableData = result.data.list;
            this.total = result.data.total;
          } else {
            this.$message.warning("列表数据获取失败！请稍候重试");
          }
          this.loading = false;
        });
      },
      async exportList() {
        if (this.selList.length <= 0) {
          this.$message.error('请至少选择一个')
          return
        }
        let result = await api.assessExport(this.selList);
        if (result.status) {
          downloadFile(result.data,'考核计划导出')
        } else {
          this.$message.warning('导出失败');
        }
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