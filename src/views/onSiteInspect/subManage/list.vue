<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b>
      <span>核查主体管理</span>
    </div>
    <div class="mt20 mb20 clear_a">
      <el-input
        placeholder="经营者,法人,许可证,账号"
        class="w250 seekIpt"
        v-model="queryLimit.search"
        @keyup.enter.native="searchTab"
        :maxlength=30
      >
        <i slot="suffix" class="el-input__icon el-icon-search" @click="searchTab"></i>
      </el-input>
      <div class="ml20">
        <span class="mr10">选择日期:</span>
        <el-date-picker
          @change="handleClick"
          value-format="yyyy-MM-dd"
          class="w140 mr10"
          type="date"
          v-model="queryLimit.startDate"
          clearable
          placeholder="选择开始日期"
          :picker-options="beforeDate"
        ></el-date-picker>
        <span>至</span>
        <el-date-picker
          @change="handleClick"
          value-format="yyyy-MM-dd"
          v-model="queryLimit.endDate"
          class="w140 ml10 mr20"
          type="date"
          clearable
          placeholder="选择截止日期"
          :picker-options="afterDate"
        ></el-date-picker>
      </div>
    </div>
    <div>
      <el-table
        v-loading="loading"
        element-loading-text="数据正在努力加载中"
        :border="true"
        :resizable="true"
        :data="tableData"
        class="table-div"
      >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="190" label="经营者名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="userName" min-width="120" label="账号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="areaName" min-width="100" label="隶属区县"></el-table-column>
        <el-table-column show-overflow-tooltip prop="subType" min-width="100" label="主体状态"></el-table-column>
        <el-table-column show-overflow-tooltip prop="legalPerson" min-width="100" label="经营者/负责人"></el-table-column>
        <el-table-column show-overflow-tooltip prop="spaceAddr" min-width="100" label="经营场所"></el-table-column>
        <el-table-column show-overflow-tooltip prop="licence" min-width="100" label="许可证编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="createTime" min-width="100" label="创建日期"></el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
          <template slot-scope="scope">
            <a
              href="javascript:;"
              class="operate-a"
              @click="go('xchc.subManage.checkRecord',scope.row.id)"
            >检查记录</a>
            <a href="javascript:;" class="operate-a" @click="reset(scope.row.id)">重置密码</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          background
          @size-change="pageSizeChange"
          @current-change="pageCurrentChange"
          :current-page="queryLimit.pageNum"
          :page-sizes="[10, 20, 30, 40,50]"
          :page-size="queryLimit.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from '../../../api/xchc/index'
export default {
  data() {
    return {
      queryLimit: {
        search: '',
        startDate: null,
        endDate: null,
        pageNum: 1,
        pageSize: 10 
      },
      total: 0,
      loading: false,
      tableData: [],
      beforeDate: {
        disabledDate: (time) => {
          let endDate = new Date(this.queryLimit.endDate);
          let date = new Date('2017-12-31');
          if (this.queryLimit.endDate) {
            return time.getTime() > endDate || time.getTime() < date || time.getTime() > Date.now() - 8.64e6
          } else {
            return time.getTime() < date || time.getTime() > Date.now() - 8.64e6
          }
        }
      },
      afterDate: {
        disabledDate: (time) => {
          let startDate = new Date(this.queryLimit.startDate);
          let date = new Date('2017-12-31');
          if (this.queryLimit.startDate) {
            return time.getTime() < startDate - 8.64e7 || time.getTime() < date || time.getTime() > Date.now() - 8.64e6;
          } else {
            return time.getTime() < date || time.getTime() > Date.now() - 8.64e6
          }
        }
      },
    }
  },
  methods: {
    handleClick() {
      if (this.queryLimit.startDate && this.queryLimit.endDate || this.queryLimit.startDate === null && this.queryLimit.endDate === null) {
        this.searchTab();
      }
    },
    searchTab() {
      this.queryLimit.pageNum = 1
      this.getPageList()
    },
    pageSizeChange(size) {
      this.queryLimit.pageSize = size
      this.getPageList()
    },
    pageCurrentChange(num) {
      this.queryLimit.pageNum = num
      this.getPageList()
    },
    go(page, id) {
      this.$router.push({
        name: page,
        query: {
          id: id
        }
      })
    },
    async getPageList() {
      this.loading = true
      let result = await api.getSubList(this.queryLimit)
      if(result.status){
        this.tableData = result.data.list
        this.total = result.data.total
      }
      this.loading = false
    },
    async reset(id){
      this.$confirm('是否确认重置密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let result = await api.resetPw({
            entityId:id,
          });
          if(result.status){
            this.$message({
            type: 'success',
            message: '重置成功,初始密码为111111'
          });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    }
  },
  mounted() {
    this.getPageList()
  }
}
</script>
<style lang="scss" scoped>
    .bigbox {
        width: 100%;
        position: relative;
    }
    .table-div {
        margin: 20px 0;
        text-align: center;
    }

    .pagination-box {
        text-align: right;
        margin-top: 20px;
    }
</style>
