<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b>
      <span>核查要点表</span>
    </div>
    <div class="mt20 mb20 clear_a">
      <el-input
        placeholder="要点表名称"
        class="w250 seekIpt"
        v-model="queryLimit.name"
        maxlength=30
        @keyup.enter.native="searchTab"
      >
        <i slot="suffix" class="el-input__icon el-icon-search" @click="searchTab"></i>
      </el-input>
      <el-select
        class="selectHeight"
        v-model="queryLimit.status"
        :clearable="true"
        placeholder="状态"
        @change="searchTab"
      >
        <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      <div class="ml20">
        <span class="mr10">截止时间:</span>
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

      <el-button
        class="floatR w100"
        type="primary"
        icon="el-icon-plus"
        @click="go('xchc.pointManage.add')"
      >添加</el-button>
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
        <el-table-column show-overflow-tooltip prop="name" min-width="190" label="要点表名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="projectNum" min-width="120" label="核查项目个数"></el-table-column>
        <el-table-column show-overflow-tooltip prop="contentNum" min-width="100" label="核查内容个数"></el-table-column>
        <el-table-column show-overflow-tooltip prop="businessType" min-width="100" label="适用类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="createTime" min-width="100" label="创建日期"></el-table-column>
        <el-table-column show-overflow-tooltip prop="status" min-width="100" label="状态">
            <template slot-scope="scope">
                {{scope.row.status === 'YES'?'启用':'禁用'}}
            </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" class="operate-a" @click="go('xchc.pointManage.edit',scope.row.id)">编辑</a>
            <a href="javascript:;" class="operate-a" @click="go('xchc.pointManage.detail',scope.row.id)">详情</a>
            <a href="javascript:;" class="operate-a" @click="operate(scope.row)">{{scope.row.status === 'YES'? '禁用':'启用'}}</a>
            <a href="javascript:;" class="operate-a" v-if="scope.row.status === 'NO'" @click="del(scope.row.id)">删除</a>
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
        name: '',
        status: '',
        startDate: null,
        endDate: null,
        pageSize: 10,
        pageNum: 1
      },
      select: [
        {
          name: '全部',
          key: ''
        },
        {
          name: '启用',
          key: 'YES'
        },
        {
          name: '禁用',
          key: 'NO'
        }
      ],
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
        this.queryLimit.pageNum =1 
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
    go(page,id) {
      this.$router.push({
        name: page,
        query:{
            id:id
        }
      })
    },
    async getPageList() {
        this.loading = true
        let result = await api.manageList(this.queryLimit)
        this.tableData = result.data.list
        this.total = result.data.total
        this.loading = false
    },
    async operate(row){
        let text = ''
        let status = ''
        row.status === 'YES'? text='是否确认禁用该巡查要点表,禁用后无法使用，请谨慎操作！':text ='是否确认启用该分类'
        row.status === 'YES'? status='NO':status ='YES'
       this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let result = await api.tableStatus({
            id:row.id,
            status:status
          });
          if(result.status){
            this.$message({
            type: 'success',
            message: `操作成功`
          });
          this.searchTab()
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    async del(id){
       this.$confirm('是否确认删除该表，删除后无法使用，请谨慎操作！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let result = await api.delTable({
            tableId:id,
          });
          if(result.status){
            this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.searchTab()
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
