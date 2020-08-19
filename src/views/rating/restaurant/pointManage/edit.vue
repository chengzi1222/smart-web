<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b>
      <span>编辑检查要点表</span>
    </div>

    <toggle-form title="基本信息">
      <div class="content">
        <el-form ref="form" :model="form" :rules="formRule" label-width="200px">
          <div class="row">
            <el-form-item label="要点表名称" prop="name">
              <el-input
                v-model="form.name"
                :maxlength="30"
                placeholder="请输入要点表名称, 30字以内"
                class="w300"
              ></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="表类型" prop="tableType">
              <el-select v-model="form.tableType" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="适用类型" prop="tableType">
              <el-select v-model="form.tableType" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="分数统计选项" prop="statistics">
              <el-select v-model="form.statistics" placeholder="请选择">
                <el-option label="是" value="YES"></el-option>
                <el-option label="否" value="NO"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="备注">
              <el-input
                type="textarea"
                class="w300"
                :maxlength="1000"
                :autosize="{minRows:6}"
                placeholder="请输入备注, 1000字以内"
                v-model="form.remark"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </toggle-form>

    <toggle-form title="要点表信息">
      <el-alert class="mt20" :title="tip" type="warning"></el-alert>
      <el-tabs v-model="activeName" class="mb20 mt20" @tab-click="tabChange">
        <el-tab-pane label="检查项目" name="project">
          <div class="mt20 mb20">
            <el-button class="w130 mr20" type="primary" @click="showTip = true">添加检查项目</el-button>
          </div>
          <el-table
            v-loading="loading"
            element-loading-text="数据正在努力加载中"
            :border="true"
            :resizable="true"
            :data="tableData"
            class="table-div"
          >
            <el-table-column type="index" label="检查项目编号" width="100"></el-table-column>
            <el-table-column show-overflow-tooltip prop="name" min-width="120" label="检查项目"></el-table-column>
            <el-table-column show-overflow-tooltip prop="remark" min-width="100" label="分值"></el-table-column>
            <el-table-column show-overflow-tooltip prop="status" min-width="100" label="分值统计">
              <template slot-scope="scope">{{scope.row.status === 'YES'? '启用':'禁用'}}</template>
            </el-table-column>
            <el-table-column label="操作" min-width="150" fixed="right">
              <template slot-scope="scope">
                <a href="javascript:;" class="operate-a" @click="edit(scope.row)">编辑</a>
                <a
                  href="javascript:;"
                  class="operate-a"
                  @click="operate(scope.row)"
                >{{scope.row.status === 'YES'?'禁用':'启用'}}</a>
                <a
                  href="javascript:;"
                  class="operate-a"
                  v-if="scope.row.status === 'NO'"
                  @click="del(scope.row.id)"
                >删除</a>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="检查内容" name="content">
          <div class="mt20 mb20">
            <el-button class="w130 mr20" type="primary" @click="contentShow = true">添加检查内容</el-button>
          </div>
          <div v-if="tableList.length > 0">
            <el-table
              v-for="(item,index) in tableList"
              :key="item.id"
              :class="index==0?'firsTeit':''"
              :data="item"
              :span-method="objectSpanMethod"
              border
              class="table-div brN mT0"
            >
              <el-table-column show-overflow-tooltip prop="projectNo" label="核查项编号" min-width="100"></el-table-column>
              <el-table-column show-overflow-tooltip prop="name" label="核查项目" min-width="120"></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="contextNo"
                label="核查内容编号"
                min-width="120"
              ></el-table-column>
              <el-table-column show-overflow-tooltip prop="content" label="核查内容" min-width="250"></el-table-column>
              <el-table-column show-overflow-tooltip label="重要性" min-width="80">
                <template slot-scope="scope">{{importance[scope.row.importance]}}</template>
              </el-table-column>
              <el-table-column align="center" label="状态" min-width="185">
                <template slot-scope="scope">{{scope.row.status === 'YES'?'启用':'禁用'}}</template>
              </el-table-column>
              <el-table-column label="操作" min-width="150" fixed="right">
                <template slot-scope="scope">
                  <a href="javascript:;" class="operate-a" @click="editContent(scope.row)">编辑</a>
                  <a
                    href="javascript:;"
                    class="operate-a"
                    @click="operate(scope.row)"
                  >{{scope.row.status === 'YES'?'禁用':'启用'}}</a>
                  <a
                    href="javascript:;"
                    class="operate-a"
                    v-if="scope.row.status === 'NO'"
                    @click="del(scope.row.contentId,scope.row.importance)"
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
        </el-tab-pane>
      </el-tabs>
    </toggle-form>

    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button @click="$router.go(-1)" style="width:120px;">返回</el-button>
        <el-button type="primary">保存</el-button>
      </div>
    </div>
    <project-dialog title="添加检查项目" :showTip="showTip" v-if="showTip" @cancel="showTip = false"></project-dialog>
    <content-dialog
      title="添加核查内容"
      :showTip="contentShow"
      v-if="contentShow"
      @cancel="contentShow = false"
    ></content-dialog>
  </div>
</template>
<script>
import ToggleForm from "components/ToggleForm.vue";
import ProjectDialog from './projectDialog'
import ContentDialog from './contentDialog'
export default {
  components: {
    ToggleForm,
    ProjectDialog,
    ContentDialog
  },
  data() {
    return {
      form: {
        name: '',
        tableType: '',
        statistics: ''
      },
      formRule: {
        name: [
          { required: true, message: '请输入要点表名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        tableType: [
          { required: true, message: '请选择表类型', trigger: 'change' }
        ],
        statistics: [
          { required: true, message: '请选择分数统计选项', trigger: 'change' }
        ]
      },
      tip: '重要提示：静态风险表检查项目分值之和等于40分，动态风险表检查项目分值之和等于60分。',
      activeName: 'project',
      loading: false,
      tableData: [],
      tableList: [],
      options: [
        {
          label: '静态风险表',
          value: 'static'
        },
        {
          label: '动态风险表',
          value: 'dynamic'
        }
      ],
      showTip: false,
      contentShow: false
    }
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {

      let rownum = 0;
      for (var i = 0; i < this.tableList.length; i++) {
        if (this.tableList[i].indexOf(row) >= 0) {
          rownum = this.tableList[i].length;
          break;
        }
      }
      if (columnIndex === 0 || columnIndex === 1) {
        if (rowIndex % rownum == 0) {
          return {
            rowspan: rownum,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    tabChange(tab){
        tab.name == 'project'? this.tip = '重要提示：静态风险表检查项目分值之和等于40分，动态风险表检查项目分值之和等于60分。':this.tip='重要提示：每个检查项目至少填写一条检查内容；多选计分项目分值等于其检查内容分值之和。'
    }
  },
  mounted() {

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
.mT0 {
  margin: 0;
}
.content {
  margin: 20px auto 0px;
  width: 750px;
}
</style>
