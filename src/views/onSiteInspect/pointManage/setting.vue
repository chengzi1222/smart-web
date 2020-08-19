<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b>
      <span>配置核查项目</span>
    </div>
    <div class="mt20 mb20 clear_a">
      <el-input
        placeholder="检查项目名称"
        class="w250 seekIpt"
        v-model="queryLimit.name"
        @keyup.enter.native="searchTab"
      >
        <i slot="suffix" class="el-input__icon el-icon-search" @click="searchTab"></i>
      </el-input>
      <el-button
        class="floatR w150"
        type="primary"
        icon="el-icon-plus"
        @click="dialogVisible = true"
      >添加核查项目</el-button>
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
        <el-table-column show-overflow-tooltip prop="no" min-width="80" label="核查项目编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="name" min-width="120" label="检查项目"></el-table-column>
        <el-table-column show-overflow-tooltip prop="remark" min-width="100" label="核查项目备注"></el-table-column>
        <el-table-column show-overflow-tooltip prop="status" min-width="100" label="状态">
          <template slot-scope="scope">{{scope.row.status === 'YES'? '启用':'禁用'}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" class="operate-a" @click="edit(scope.row)">编辑</a>
            <a href="javascript:;" class="operate-a" @click="operate(scope.row)">{{scope.row.status === 'YES'?'禁用':'启用'}}</a>
            <a href="javascript:;" class="operate-a" v-if="scope.row.status === 'NO'" @click="del(scope.row.id)">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box mb300">
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
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button @click="$router.go(-1)" style="width:120px;">返回</el-button>
      </div>
    </div>
    <el-dialog
      title="添加核查项目"
      :visible.sync="dialogVisible"
      width="30%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="核查项目" prop="name">
          <el-input class="w300" :maxlength="20" v-model="form.name" placeholder="请输入,20字以内"></el-input>
        </el-form-item>
        <el-form-item label="核查项目备注">
          <el-input
            type="textarea"
            class="w300"
            :maxlength="200"
            placeholder="请输入核查项目备注, 200字以内"
            :autosize="{minRows:6}"
            v-model="form.remark"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="启用" value="YES"></el-option>
            <el-option label="禁用" value="NO"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="floatR" type="primary" @click="addPro">确认</el-button>
          <el-button class="floatR mr20" @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import * as api from '../../../api/xchc/index'
export default {
  data() {
    return {
      queryLimit: {
        name: '',
        pageNum: 1,
        pageSize: 10,
        tableId: ''
      },
      dialogVisible: false,
      total: 0,
      loading: false,
      tableData: [],
      form: {
        tableId: '',
        id: '',
        name: '',
        remark: '',
        status: 'YES'
      },
      rules: {
        name: [
          { required: true, message: '请输入检查项目', trigger: 'blur' },
           { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' },
        ]
      }
    }
  },
  methods: {
    pageSizeChange(size) {
      this.queryLimit.pageSize = size
      this.getList()
    },
    pageCurrentChange(num) {
      this.queryLimit.pageNum = num
      this.getList()
    },
    searchTab() {
      this.queryLimit.pageNum = 1
      this.getList()
    },
    async getList() {
      this.loading = true
      let result = await api.getSettingList(this.queryLimit)
      this.tableData = result.data.list
      this.total = result.data.total
      this.loading = false
    },
    handleClose(){
      this.dialogVisible = false
      this.form = {
        tableId: this.queryLimit.tableId,
        id: '',
        name: '',
        remark: '',
        status: 'YES'
      }
    },
    edit(row){
      this.form = JSON.parse(JSON.stringify(row))
      this.form.tableId = this.queryLimit.tableId
      this.dialogVisible = true
    },
    async addPro() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let result = await api.addProject(this.form)
          if (result.status  === true) {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.searchTab()
            this.handleClose()
          }
        } else {
          return false;
        }
      });
    },
     async operate(row){
        let text = ''
        let status = ''
        row.status === 'YES'? text='禁用':text ='启用'
        row.status === 'YES'? status='NO':status ='YES'
       this.$confirm(`是否确认${text}该核查项目?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let result = await api.postStatus({
            projectId:row.id,
            status:status
          });
          if(result.status){
            this.$message({
            type: 'success',
            message: `${text}成功`
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
       this.$confirm('删除该巡查项目，则该巡查项目下所有的巡查内容项都会删除，是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let result = await api.delProject({
            projectId:id,
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
    this.queryLimit.tableId = this.$route.query.id
    this.form.tableId = this.$route.query.id
    this.getList()
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
    .mb300{
      margin-bottom: 300px;
    }
</style>
