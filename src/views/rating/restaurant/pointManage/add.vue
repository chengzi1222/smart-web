<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b>
      <span>添加核查要点表</span>
      <back></back>
    </div>
    <el-alert
      class="mt20"
      title="重要提示：静态风险表检查项目分值之和等于40分，动态风险表检查项目分值之和等于60分。"
      type="warning"
      v-if="active == 2"
    ></el-alert>
    <div class="content mt30">
      <step :current="active"></step>
    </div>

    <div class="content" v-if="active == 1">
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
          <el-form-item label="表类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择">
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
          <el-form-item label="适用类型" prop="businessType">
            <el-select v-model="form.businessType" placeholder="请选择">
              <el-option
                v-for="item in businessType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="分数统计选项" prop="statisticsOptions">
            <el-select v-model="form.statisticsOptions" placeholder="请选择">
              <el-option label="是" value="ENABLE"></el-option>
              <el-option label="否" value="DISABLE"></el-option>
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

    <div v-if="active == 2">
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
        <el-table-column prop="projectNo" label="检查项目编号" width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="value" min-width="120" label="检查项目"></el-table-column>
        <el-table-column show-overflow-tooltip prop="score" min-width="100" label="分值"></el-table-column>
        <el-table-column show-overflow-tooltip prop="status" min-width="100" label="分值统计">
          <template slot-scope="scope">{{scope.row.status === 'ENABLE'? '启用':'禁用'}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" class="operate-a" @click="edit(scope.row,scope.$index)">编辑</a>
            <a
              href="javascript:;"
              class="operate-a"
              @click="operate(scope.row,scope.$index)"
            >{{scope.row.status === 'ENABLE'?'禁用':'启用'}}</a>
            <a
              href="javascript:;"
              class="operate-a"
              v-if="scope.row.status === 'DISABLE'"
              @click="del(scope.$index)"
            >删除</a>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="active == 3">
      <div class="mt20 mb20">
        <el-button class="w130 mr20" type="primary" @click="contentShow = true">添加检查内容</el-button>
      </div>
      <div v-if="tableList.length > 0">
        <el-table
          :key="item.id"
          v-for="(item,index) in tableList"
          :class="index==0?'firsTeit':''"
          :data="item"
          :span-method="objectSpanMethod"
          border
          class="table-div brN mT0"
        >
          <el-table-column show-overflow-tooltip prop="projectNo" label="核查项编号" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="核查项目" min-width="120"></el-table-column>
          <el-table-column show-overflow-tooltip prop="contextNo" label="核查内容编号" min-width="120"></el-table-column>
          <el-table-column show-overflow-tooltip prop="content" label="核查内容" min-width="250"></el-table-column>
          <el-table-column show-overflow-tooltip prop="score" label="分值" min-width="80"></el-table-column>
          <el-table-column align="center" label="状态" min-width="185">
            <template slot-scope="scope">{{scope.row.status === 'ENABLE'?'启用':'禁用'}}</template>
          </el-table-column>
          <el-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <a
                href="javascript:;"
                class="operate-a"
                @click="editContent(scope.row,index,scope.$index)"
              >编辑</a>
              <a
                href="javascript:;"
                class="operate-a"
                @click="contentOpera(scope.row,index,scope.$index)"
              >{{scope.row.status === 'ENABLE'?'禁用':'启用'}}</a>
              <a
                href="javascript:;"
                class="operate-a"
                v-if="scope.row.status === 'DISABLE'"
                @click="delContent(index,scope.$index)"
              >删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="foot-btn" style="z-index:1">
      <div class="fixl">
        <el-button type="primary" style="width:120px;" v-if="active != 1" @click="prev">上一步</el-button>
      </div>
      <div>
        <el-button @click="cancelConfirm" style="width:120px;">取消</el-button>
        <el-button type="primary" @click="next" v-if="active != 3">下一步</el-button>
        <el-button type="primary" @click="next" v-if="active == 3">保存</el-button>
      </div>
    </div>

    <project-dialog
      :title="addIndex ==''? '添加检查项目':'编辑检查项目'"
      :index="addIndex"
      :projectData="projectData"
      :showTip="showTip"
      v-if="showTip"
      @cancel="showTip = false"
      @success="addProjectData"
    ></project-dialog>
    <content-dialog
      title="添加核查内容"
      :showTip="contentShow"
      :projectData="tableData"
      :tableList="tableList"
      v-if="contentShow"
      @cancel="contentShow = false"
      @success="addContentData"
    ></content-dialog>
    <edit-dialog
      title="编辑核查内容"
      v-if="editShow"
      :editData="editData"
      :showTip="editShow"
      :tableList="tableList"
      :projectData="tableData"
      @cancel="editShow = false"
      @success="editSuccess"
    ></edit-dialog>
  </div>
</template>
<script>
import Back from 'utils/back.vue'
import Step from './step'
import ProjectDialog from './projectDialog'
import ContentDialog from './contentDialog'
import EditDialog from './editDialog'
export default {
  components: {
    Back,
    Step,
    ProjectDialog,
    ContentDialog,
    EditDialog
  },
  data() {
    return {
      active: 3,
      form: {
        name: '测试',
        type: 'static',
        businessType: 'CFDARESTAURANT',
        statisticsOptions: 'ENABLE',
        remark: ''
      },
      formRule: {
        name: [
          { required: true, message: '请输入要点表名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择表类型', trigger: 'change' }
        ],
        businessType: [
          { required: true, message: '请选择适用类型', trigger: 'change' }
        ],
        statisticsOptions: [
          { required: true, message: '请选择分数统计选项', trigger: 'change' }
        ]
      },
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
      businessType: [
        {
          label: '小经营店(餐饮)',
          value: 'CFDARESTAURANT'
        },
        {
          label: '餐饮主体',
          value: 'RESTAURANT'
        }
      ],
      loading: false,
      tableData: [
        {
          projectNo: 1,
          score: "20",
          rule: "MULTIPLE",
          status: "ENABLE",
          value: "方法1",
          id: '233'
        },
        {
          projectNo: 2,
          score: "12",
          rule: "SINGLE",
          status: "ENABLE",
          value: "方法2",
          id: '345'
        },
        {
          projectNo: 3,
          score: "8",
          rule: "SINGLE",
          status: "ENABLE",
          value: "方法3",
          id: '3465'
        }
      ],
      tableList: [],
      showTip: false,
      contentShow: false,
      editShow: false,
      addIndex: '',
      projectData: {},
      projectAddDto: [],
      editData: {},
      indexI: 0,
      indexJ: 0
    }
  },
  methods: {
    next() {
      if (this.active == 1) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.active++
          }
        });
      } else if (this.active == 2) {
        let total = 0
        let setting = 0
        this.form.type == 'static' ? total = 40 : total = 60
        this.tableData.forEach(item => {
          item.status == 'ENABLE' ? setting = setting + Number(item.score) : ''
        })
        if (setting != total) {
          this.$message({
            message: `检查项目分值之和应等于${total}`,
            type: 'warning'
          });
        } else {
          this.active++
        }
      }

    },
    prev() {
      this.active--
    },
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
    cancelConfirm() {
      this.$confirm('取消后当前内容不会被保存，是否取消？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({ name: 'restaurantRating.pointManage.list' })
      })
    },
    addProjectData(data, i) {
      let text = ''
      if (i === '') {
        this.tableData.push(data)
        text = '添加'
        this.tableData.forEach((item, index) => { item.projectNo = index + 1 })
      } else {
        let newValue = Object.assign(this.tableData[i], this.tableData[i] = data)
        this.$set(this.tableData, i, newValue)
        text = '编辑'
      }
      this.$message({
        message: `${text}成功`,
        type: 'success'
      });
      this.showTip = false
    },
    addContentData(data) {
      let result = {
        absent: data.absent,
        content: data.content,
        score: data.score,
        status: data.status,
        quickCheck: data.quickCheck
      }
      let dataArr = {
        name: data.name,
        no: data.projectNo,
        rule: data.rule,
        score: data.projectScore,
        status: data.projectStatus,
        contentList: [result]
      }

      this.tableList = []
      let ids = []
      this.projectAddDto.forEach(item => { ids.push(item.no) })
      if (ids.includes(data.projectNo)) {
        this.projectAddDto.forEach(item => { item.no == data.projectNo ? item.contentList.push(result) : '' })
      } else {
        this.projectAddDto.push(dataArr)
      }
      if (this.projectAddDto.length <= 0) {
        this.projectAddDto.push(dataArr)
      }
      let d = this.projectAddDto;
      for (let i = 0; i < d.length; i++) {
        let list = [];
        for (let j = 0; j < d[i].contentList.length; j++) {
          let obj = {}
          obj.projectNo = d[i].no;
          obj.absent = d[i].contentList[j].absent
          obj.name = d[i].name;
          obj.rule = d[i].rule
          obj.content = d[i].contentList[j].content;
          obj.score = d[i].contentList[j].score;
          obj.projectScore = d[i].projectScore;
          obj.contextNo = `${d[i].no}.${j + 1}`;
          obj.status = d[i].contentList[j].status
          obj.quickCheck = d[i].contentList[j].quickCheck
          list.push(obj);
        }
        this.tableList.push(list);
        this.tableList.sort((a,b)=>{
          return a[0].projectNo - b[0].projectNo
        })
      }
      this.contentShow = false
    },
    edit(data, i) {
      this.addIndex = i;
      this.projectData = data;
      this.showTip = true
    },
    del(i) {
      this.$confirm('删除该检查项目，则该检查项目下所有的检查内容项都会删除，是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(i, 1);
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    delContent(i, j) {
      this.$confirm('删除后可能会影响检查结果，请谨慎操作!是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableList[i].length == 1 ? this.tableList.splice(i, 1) : this.tableList[i].splice(j, 1)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    operate(row, i) {
      let text = ''
      let status = ''
      row.status === 'ENABLE' ? text = '禁用' : text = '启用'
      row.status === 'ENABLE' ? status = 'DISABLE' : status = 'ENABLE'
      this.$confirm(`是否确认${text}该检查项目`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let newValue = Object.assign(this.tableData[i], this.tableData[i].status = status)
        this.$set(this.tableData, i, newValue)
        this.$message({
          type: 'success',
          message: `操作成功`
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    contentOpera(row, i, j) {
      let text = ''
      let status = ''
      row.status === 'ENABLE' ? text = '禁用后可能会影响检查结果，请谨慎操作!是否确认禁用' : text = '是否启用该项目'
      row.status === 'ENABLE' ? status = 'DISABLE' : status = 'ENABLE'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let newValue = Object.assign(this.tableList[i][j], this.tableList[i][j].status = status)
        this.$set(this.tableList[i], j, newValue)
        this.$message({
          type: 'success',
          message: `操作成功`
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    editContent(row, i, j) {
      this.editData = row;
      this.indexI = i;
      this.indexJ = j;
      this.editShow = true;
    },
    editSuccess(data) {
      let newValue = Object.assign(this.tableList[this.indexI][this.indexJ], this.tableList[this.indexI][this.indexJ] = data)
      this.$set(this.tableList[this.indexI], this.indexJ, newValue)
      this.$message({
        type: 'success',
        message: `操作成功`
      });
      this.editShow = false
    }
  },
  mounted() { }
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
.content {
  margin: 20px auto 0px;
  width: 750px;
}
.mt30 {
  margin-top: 30px;
}
.fixl {
  position: fixed;
  bottom: 12px;
  left: 190px;
}
.mT0 {
  margin: 0;
}
</style>
