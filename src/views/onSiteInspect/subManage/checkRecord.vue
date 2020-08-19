<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>主体核查记录</span>
    </div>
    <toggle-form title="核查任务信息">
      <div class="content">
        <el-form ref="form" :model="form" label-width="110px" class="demo-ruleForm">
          <div class="row">
            <el-form-item label="经营者名称">
              <span>{{form.entityName}}</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="账号">
              <span>{{form.userName}}</span>
            </el-form-item>
            <el-form-item label="隶属区县">
              <span>{{form.areaName}}</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="法人/负责人">
              <span>{{form.legalPerson}}</span>
            </el-form-item>
            <el-form-item label="主体状态">
              <span>{{form.subType}}</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="经营场所">
              <span>{{form.spaceAddr}}</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="许可证编号">
              <span>{{form.licence}}</span>
            </el-form-item>
            <el-form-item label="手机号">
              <span>{{form.sendTel ===''?'暂无':form.sendTel}}</span>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </toggle-form>
    <toggle-form title="核查记录" style="height:100%;margin-bottom:350px">
      <div class="tabOffTop120 mt20">
        <el-table
          v-loading="loading"
          element-loading-text="数据正在努力加载中"
          :border="true"
          :resizable="true"
          :data="tableData"
          class="table-div"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column show-overflow-tooltip prop="no" min-width="190" label="业务受理号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="applyDate" min-width="120" label="申请日期"></el-table-column>
          <el-table-column show-overflow-tooltip prop="applyType" min-width="100" label="申办类型">
            <template slot-scope="scope">{{applyType[scope.row.applyType]}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="businessType" min-width="100" label="业务状态"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" label="核查人">
            <template slot-scope="scope">{{scope.row.inspector? scope.row.inspector:'-'}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" label="核查日期">
            <template slot-scope="scope">{{scope.row.inspectDate? scope.row.inspectDate:'-'}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" label="核查结果">
            <template slot-scope="scope">
              <span v-if="scope.row.result">{{scope.row.result === 'YES'? '符合规定':'不符合规定'}}</span>
              <span v-if="!scope.row.result">-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <a
                href="javascript:;"
                class="operate-a"
                @click="goCheck(scope.row.taskId)"
                v-if="scope.row.state === 'NO'"
              >去核查</a>
              <a
                href="javascript:;"
                class="operate-a"
                @click="go(scope.row.recordId)"
                v-if="scope.row.state === 'YES'"
              >详情</a>
              <a
                href="javascript:;"
                class="operate-a"
                v-if="!scope.row.recordId"
                @click="delTask(scope.row.taskId)"
              >删除</a>
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
    </toggle-form>
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button @click="$router.go(-1)" style="width:120px;">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import ToggleForm from "components/ToggleForm.vue";
import * as api from '../../../api/xchc/index'
export default {
  components: {
    ToggleForm
  },
  data() {
    return {
      form: {},
      total: 0,
      tableData: [],
      queryLimit: {
        pageSize: 10,
        pageNum: 1,
        entityId: ''
      },
      applyType: {
        'NEW': '新办',
        'CHANGE': '变更',
        'CONTINUE': '延续',
        'SUPPLEMENT': '补证',
        'LOGOUT': '注销',
        'REPLACE': '换证'
      },
      loading: false
    }
  },
  methods: {
    pageSizeChange(size) {
      this.queryLimit.pageSize = size
      this.getPageList()
    },
    pageCurrentChange(num) {
      this.queryLimit.pageNum = num
      this.getPageList()
    },
    async getPageList() {
      this.loading = true
      let result = await api.getSubRecord(this.queryLimit)
      this.loading = false
      this.tableData = result.data.list
      this.total = result.data.total
    },
    async getBaseData() {
      let result = await api.getSubBaseData({ entityId: this.queryLimit.entityId })
      this.form = result.data
    },
    async delTask(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await api.delTask(id);
        if (result.status) {
          this.$message({
            type: 'success',
            message: '删除成功'
          }); 
          this.queryLimit.pageNum = 1
          this.getPageList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        }); 
      });
    },
    go(id) { 
      this.$router.push({
        name: 'xchc.allDetails.subManage',
        query: {
          'id': id,
          'count': 0,
          'subOrSite': 'sub'
        }
      })
    },
    goCheck(id){
     this.$router.push({
        name: 'xchc.taskManage.inspect',
        query: {
          'id': id,
        }
      })
    }
  },
  mounted() {
    this.queryLimit.entityId = this.$route.query.id
    this.getBaseData()
    this.getPageList()
  }
}
</script>
<style lang="scss" scoped>
.content {
  margin: 20px auto 0px;
  width: 750px;
}
</style>
