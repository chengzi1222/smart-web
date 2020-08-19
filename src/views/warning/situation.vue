<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>任务管理</span>
    </div>
    <div style="margin-bottom:10px;overflow:hidden;">
      <el-input placeholder="主体名称、许可号、姓名、手机号" class="w260 seekIpt" v-model="searchMap.keysWord" style="float:left;">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getPageData"></i>
      </el-input>
      <div style="float:left;">
        <enum-select v-model="searchMap.state" @change="getPageData" enum="com.ybveg.govx.enums.medi.WarningTaskRecordSEnum" placeholder="预警状态(全部)"></enum-select>
        <enum-select v-model="searchMap.onlineStatus" @change="getPageData" enum="com.ybveg.govx.enums.medi.EnterpriseUserStateEnum"
          placeholder="在线状态(全部)"></enum-select>
        <select-area-grid class="selectHeight" placeholder="所属下级部门" @change="deptChange"></select-area-grid>
        <el-button @click="exportTaskExcel" class="w65 dc" type="primary">导出</el-button>
        <div class="dc-bt" v-if="isDcShow">
          <el-button @click="exportTaskExcel" class="w100 dclist" type="primary">导出全部</el-button>
          <el-button @click="exportTaskExcel" class="w100 dclist" type="primary">导出本页</el-button>
          <el-button @click="exportTaskExcel" class="w100 dclist" type="primary">导出选中</el-button>
        </div>
        <el-button class="w150 dc" type="primary" icon="el-icon">批量短信预警</el-button>
      </div>

    </div>
    <el-table @sort-change="sortChange" :data="dataPage" class="table-div">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column show-overflow-tooltip type="index" min-width='50' label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="entity_name" min-width='150' label="主体名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="real_name" label="姓名"></el-table-column>
      <el-table-column show-overflow-tooltip prop="phone" label="手机号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="reality_addr" label="经营地址"></el-table-column>
      <el-table-column show-overflow-tooltip prop="dept_name" label="所属下级部门"></el-table-column>
      <el-table-column show-overflow-tooltip prop="index" label="短信预警次数"></el-table-column>
      <el-table-column show-overflow-tooltip prop="onlineStatus" label="在线状态"></el-table-column>
      <el-table-column show-overflow-tooltip prop="state" label="预警状态"></el-table-column>
      <el-table-column show-overflow-tooltip prop="create_time" sortable="custom" label="更新时间"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" class="operate-a">短信预警</a>
          <a href="javascript:;" v-if="scope.row.state != '已处理'" @click="dispose(scope.row)" class="operate-a">预警处理</a>
          <a href="javascript:;" @click="$router.push({name: 'medi.subject.archive', query: {entityType: scope.row.entityType, entityTypeExt: scope.row.entityTypeExt, ext: 'INFO', entityId: scope.row.entity_id}})"
            class="operate-a">主体档案</a>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-box">
      <span class="bt-info">提示：未收到预警消息{{ count.unRevicedCount }}家；待处理{{ count.tobeExecuteCount }}家；已处理{{ count.executedCount
        }}家。</span>
      <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="page.total" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
      </el-pagination>
    </div>

    <popupBody v-if="isShowDispose" class="mT-50" :width="700" :top="150">
      <p class="popTit">
        <span>预警处理</span>
        <span @click="colsePop"><i class="el-icon-close"></i></span>
      </p>
      <div class="contBox">
        <el-form :model="handleInfo" :rules="rules" ref="handleInfo" label-width="100px" class="demo-ruleForm">
          <el-form-item label="主体名称:">
            <span>{{ handleInfo.entityName }}</span>
          </el-form-item>
          <el-form-item label="处理方式:" prop="disposeWay">
            <enum-select v-model="handleInfo.disposeWay" enum="com.ybveg.govx.enums.medi.WarningTaskHandleWayEnum" placeholder="预警状态(全部)"></enum-select>
          </el-form-item>
          <el-form-item label="相关备注:" prop="info">
            <el-input class="w350" type="textarea" placeholder="请输入相关备注，200字内" :maxlength="200" :rows="4" v-model="handleInfo.info"></el-input>
          </el-form-item>
          <el-form-item label="相关附件：" prop="fileIdList">
            <el-upload action="/api/upload" :data="{type:'WARNING_RECORD', field: 'PHOTO'}" list-type="picture-card" :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove" :limit="fileLimit" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
              :on-exceed="handleExceed">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" size="tiny">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <p class="bz" style="margin-top: 10px;">图片格式：png，jpg，gif</p>
            <p class="bz">图片大小：每张图片小于10M</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="botBox">
        <el-button @click="colsePop" class="w100" type="primary">取消并关闭</el-button>
        <el-button @click="saveDispose" class="w100" type="primary">保存并提交</el-button>
      </div>
    </popupBody>
  </div>
</template>

<script>
  import EnumSelect from 'components/common/EnumSelect'
  import * as warningTask from "api/warning/warning";
  import popupBody from 'components/popup/popupform';
  import SelectAreaGrid from 'components/common/SelectAreaGrid';
  import { downloadFile } from 'api/common';


  export default {
    methods: {
      // 分页查询
      getPageData() {
        warningTask.warningPageSituation(this.$route.params.warningTaskId, this.searchMap, this.page.pageSize, this.page.pageNum).then(r => {
          this.dataPage = r.data.list
          this.page.total = r.data.total
        })
      },
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num
        this.getPageData()
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size
        this.getPageData()
      },
      sortChange() {
        this.searchMap.sort = arguments[0].order ? arguments[0].order : 'descending'
        this.getPageData();
        this.getCount()
      },
      init() {
        this.taskId = this.$route.params.warningTaskId
        this.getPageData()
        this.getCount()
      },
      deptChange(deptId) {
        this.searchMap.deptCodes = !deptId ? "" : deptId[deptId.length - 1];
        this.getPageData();
      },
      getCount() {
        warningTask.recordCount(this.$route.params.warningTaskId).then(r => {
          this.count = r.data
        })
      },
      handleAvatarSuccess(file) {
        if (file.status) {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.handleInfo.fileIdList.push(file.data.id);
        }
      },
      exportTaskExcel() {
        warningTask.exportExcel([], this.taskId).then(r => {
          downloadFile(r.data, '预警任务执行情况');
        })
      },
      dispose(data) {
        this.isShowDispose = true
        this.handleInfo.entityName = data.entity_name
        this.handleInfo.entityId = data.entity_id
      },
      saveDispose() {
        this.handleInfo.taskId = this.taskId
        this.$refs["handleInfo"].validate((valid) => {
          if (valid) {
            warningTask.addRecord(this.handleInfo).then(r => {
              if (r.status) {
                this.$message({
                  message: '处理成功',
                  type: 'success'
                })
                this.colsePop()
                this.getPageData()
              }
            })
          }
        }, () => {
        })
      },
      colsePop() {
        this.isShowDispose = false
        this.$refs["handleInfo"].resetFields();
      },
      handleExceed(files, fileList) {
        this.$message.warning(
          `最多可上传 5 个文件， 当前已选择 ${fileList.length} 个文件`);
      },
      beforeAvatarUpload(file) {
        let fileType = file.type.split("/")[1];
        if (fileType !== 'png' && fileType !== 'jpeg' && fileType !== 'gif') {
          this.$message({
            message: '请上传正确格式的图片(图片格式：png，jpg，gif)',
            type: 'error'
          })
          return false;
        }
      },
      handleRemove(file, fileList) {
        for (let i = 0; i < this.handleInfo.fileIdList.length; i++) {
          let id = this.handleInfo.fileIdList[i];
          if (id === file.response.data.id) {
            this.handleInfo.fileIdList.splice(i, 1);
            break;
          }
        }
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
    },
    async mounted() {
      this.init()
    },
    data() {
      return {
        isShowDispose: false,
        isDcShow: false,
        taskId: '',
        count: {
          entityCount: 0,
          tobeExecuteCount: 0,
          unRevicedCount: 0,
          executedCount: 0
        },
        handleInfo: {
          entityName: '',
          entityId: '',
          disposeWay: '',
          info: '',
          state: 'EXECUTED',
          fileIdList: [],
          taskId: ''
        },
        searchMap: {
          keysWord: '',
          state: '',
          sort: 'descending',
          onlineStatus: '',
          deptCodes: ''
        },
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        dialogImageUrl: '',
        dialogVisible: false,
        imageUrl: '',
        dataPage: null,
        pageObj: null,
        fileLimit: 5, //限制文件上传的个数
        rules: {
          disposeWay: [{ required: true, message: '请选择处理方式', trigger: 'change' }],
        }
      };
    },
    components: {
      EnumSelect, SelectAreaGrid, popupBody
    }
  }
</script>

<style scoped lang="sass">
  .bt-info {
    line-height: 32px;
    font-size: 14px;
    margin-left: 10px;
    float: left;
  }

  .dc {
    float: right;
    width: 150px;
    margin: 0 5px;
    border-radius: 2px;
  }

  .table-div {
    margin: 20px 0;
    text-align: center;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .operate-a {
    color: #0DB5EF;
  }

  .popTit {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: rgba(242, 245, 248, 1);
  }

  .popTit span:first-child {
    margin-left: 20px;
    font-size: 14px;
    color: rgba(57, 57, 57, 1);
  }

  .popTit span:last-child {
    float: right;
    margin-right: 10px;
    color: rgba(154, 154, 154, 1);
  }

  .contBox {
    width: 100%;
    margin-top: 20px;
  }

  .contBox .row {
    margin-top: 20px;
  }

  .botBox {
    text-align: right;
    margin-top: 30px;
  }

  .botBox button:first-child {
    background: rgba(246, 247, 248, 1);
    border: 1px solid #C2CAD2;
    color: #393939;
  }
</style>