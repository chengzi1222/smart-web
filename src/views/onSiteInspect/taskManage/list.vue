<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b>
      <span>核查任务管理</span>
    </div>
    <div class="mt20 mb20 clear_a">
      <el-input
        placeholder="经营者, 法人, 许可证, 业务受理号"
        class="w250 seekIpt"
        v-model="queryLimit.search"
        @keyup.enter.native="searchTab"
        :maxlength="30"
      >
        <i slot="suffix" class="el-input__icon el-icon-search" @click="searchTab"></i>
      </el-input>
      <el-select
        class="ml20 w200" 
        v-model="applyTypeSelect"
        multiple
        collapse-tags
        placeholder="申请类型"
        @change="changeSelect"
      >
        <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      <div class="ml20">
        <span class="mr10">申请日期:</span>
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
      <el-upload
        action
        class="mr20 fr" 
        style="display: inline-block"
        :show-file-list="false"
        :http-request="uploadConfig"
        :on-error="fileUploadError"
        :before-upload="beforeAvatarUploadImport"
      >
        <el-button class="w100" type="primary">导入</el-button>
      </el-upload>
      <el-button class="floatR w120 mr20" type="info" @click="downLoadTem">下载导入模板</el-button>
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
        <el-table-column show-overflow-tooltip prop="areaName" min-width="100" label="隶属区县"></el-table-column>
        <el-table-column show-overflow-tooltip prop="applyDate" min-width="120" label="申请日期"></el-table-column>
        <el-table-column show-overflow-tooltip prop="applyType" min-width="100" label="申请类型">
          <template slot-scope="scope">{{applyType[scope.row.applyType]}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="businessType" min-width="100" label="业务状态"></el-table-column>
        <el-table-column show-overflow-tooltip prop="subType" min-width="100" label="主体状态"></el-table-column>
        <el-table-column show-overflow-tooltip prop="legalPerson" min-width="100" label="法人/负责人"></el-table-column>
        <el-table-column show-overflow-tooltip prop="spaceAddr" min-width="100" label="经营场所"></el-table-column>
        <el-table-column show-overflow-tooltip prop="licence" min-width="100" label="许可证编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="no" min-width="100" label="业务受理号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="createTime" min-width="100" label="导入日期"></el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
          <template slot-scope="scope">
            <a
              href="javascript:;"
              class="operate-a"
              @click="go('xchc.taskManage.inspect',scope.row.id)"
            >核查</a>
            <a href="javascript:;" class="operate-a" v-if="scope.row.state !== 'YES'" @click="del(scope.row.id)">删除</a>
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
import {
        downloadFile
    } from "api/common";
export default {
  data() {
    return {
      queryLimit: {
        search: '',
        startDate: null,
        endDate: null,
        month: '',
        applyType: [],
        pageNum: 1,
        pageSize: 10
      },
      applyTypeSelect:[],
      select: [
        {
          name: '新办',
          key: 'NEW'
        },
        {
          name: '变更',
          key: 'CHANGE'
        },
        {
          name: '延续',
          key: 'CONTINUE'
        },
        {
          name: '补证',
          key: 'SUPPLEMENT'
        },
        {
          name: '注销',
          key: 'LOGOUT'
        },
        {
          name: '换证',
          key: 'REPLACE'
        }
      ],
      applyType: {
        'NEW': '新办',
        'CHANGE': '变更',
        'CONTINUE': '延续',
        'SUPPLEMENT': '补证',
        'LOGOUT': '注销',
        'REPLACE': '换证'
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
    go(page,id) {
      this.$router.push({
        name: page,
        query:{
          id:id
        }
      })
    },
    handleClick() {
      if (this.queryLimit.startDate && this.queryLimit.endDate || this.queryLimit.startDate === null && this.queryLimit.endDate === null) {
        this.searchTab();
      }
    },
    changeSelect(){
      this.queryLimit.applyType = this.applyTypeSelect.join(',')
      this.searchTab()
    },
    downLoadTem() {
      location.href = '/api/xchc/task/template'
    },
    async getPageList() {
      this.loading = true
      let result = await api.getTaskList(this.queryLimit)
      if (result.status) {
        this.tableData = result.data.list
        this.total = result.data.total
      }
      this.loading = false
    },
    beforeAvatarUploadImport(file) {
      let type = file.name.substr(file.name.lastIndexOf('.'))
      let flag = true
      if (type !== '.xlsx' && type !== '.xls') {
        flag = false
        this.$message.warning('上传格式错误')
      }
      return flag
    },
    fileUploadError(err, file) {
      this.$message.warning("文件上传失败！");
    },
    uploadConfig(file, callback) {
      this.importLoad = true;
      var formdata = new FormData()
      formdata.append('excelFile', file.file);
      api.uploadTaskFile(formdata).then((r) => {
        this.importLoad = false;
        if (r.status && !r.data) {
          this.$message.success('导入成功!');
          this.searchTab()
        } else if (r.status && r.data) {
          this.$message.error('导入失败!正在下载失败内容');
          downloadFile(r.data, '导入失败内容');
          this.searchTab()
        } else {
          this.$message.error('导入失败!');
        }
      })
    },
    del(id){
      this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let result = await api.delTask(id);
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
