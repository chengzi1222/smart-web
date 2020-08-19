<template>
  <div>
    <div class="page-tilt">
      <b></b><span>检验报告管理</span>
    </div>
    <div class="mt20">
      <el-input title="检验报告编号、设备注册代码、检验单位、使用单位" placeholder="检验报告编号、设备注册代码、检验单位、使用单位" class="w260 seekIpt mr20" v-model="subName" @keyup.enter.native="getReportPagingList">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getReportPagingList"></i>
      </el-input>
      检验日期：
      <el-date-picker @change="getReportPagingList" value-format="yyyy-MM-dd" class="sleq padRightNo mr10 w120" type="date"
        v-model="dailyBeginTime" placeholder="起始时间" :picker-options="dailyStartDate"></el-date-picker>
      至
      <el-date-picker @change="getReportPagingList" value-format="yyyy-MM-dd" class="slez padRightNo ml10 w120" type="date" v-model="dailyOverTime"
        placeholder="截止时间" :picker-options="dailyAfterDate"></el-date-picker>
      <ul class="educeUl floatR w100" :class="educeUlDown?'educeUlDown':''" @mouseenter="educeUlDown = true" @mouseleave="educeUlDown = false">
        <li class="firstLi">导出<i class="ml10" :class="educeUlDown?'el-icon-caret-bottom':'el-icon-caret-top'"></i></li>
        <li class="childrenLi">
          <p class="movePoin" @click="down">导出本页</p>
          <p class="movePoin" @click="down('all')">导出全部</p>
        </li>
      </ul>
      <el-upload class="floatR" action="" :http-request="uploadConfig" :show-file-list="false" :on-error="fileUploadError" :before-upload="beforeAvatarUpload">
        <el-button :disabled="false" class="mr20 w100" type="primary">导入</el-button>
      </el-upload>
      <el-button @click="equipmentShow = true" type="primary" class="w76 floatR mr20" icon="el-icon-plus">添加</el-button>
    </div>
    <el-table class="table-div mt20" border :data="tableData">
      <el-table-column show-overflow-tooltip type="index" label="序号" min-width="50"></el-table-column>
      <el-table-column show-overflow-tooltip prop="number" label="检验报告编号" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="entityRegisterCode" label="设备注册代码" min-width="130"></el-table-column>
      <el-table-column show-overflow-tooltip prop="type" label="检验类别" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="verdict" label="检验结论" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="inspectDate" label="检验日期" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="nextInspectDate" label="下次检验日期" min-width="140"></el-table-column>
      <el-table-column show-overflow-tooltip prop="inspectName" label="检验单位名称" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="inspectLicence" label="检验机构核准证" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="inspectPerson" label="检验人员" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="entityEmployName" label="使用单位" min-width="100"></el-table-column>
      <el-table-column min-width="150" label="操作">
        <template slot-scope="scope">
          <a style="color: #1787AD;cursor:pointer" @click="popupInfo(scope.row.id)">详情</a>
          <a style="color: #1787AD;cursor:pointer" @click="popupEdit(scope.row.id)">编辑</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box textR mt20">
      <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 50, 100,500]" :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="pageSizeChange"
        @current-change="pagecCurrentChange">
      </el-pagination>
    </div>
    <equipment v-if="equipmentShow" @equipmentShowFun='equipmentShowFun' @rowClick="rowClick" :entityType="entityType"></equipment>
    <popup v-if="popupShow" @popupShowHiden="popupShowHiden" :status="status" :reportId="reportId" :popuptype="popuptype" :equipmentData="equipmentData"></popup>
    <div class="login" v-if="login">
      <p>导入中<i class="el-icon-loading"></i></p>
    </div>
  </div>
</template>

<script>
  import { getReportPagingList, getReportExport, getReportImport } from 'api/special/elevator.js'
  import { downloadFile, uploadFile } from 'api/common'
  import equipment from './equipment.vue'
  import popup from './popup.vue'
  export default{
    data() {
      return {
        login: false,
        subName: '',
        dailyBeginTime:'',
        dailyOverTime: '',
        educeUlDown: false,
        dailyAfterDate: {
          disabledDate: (time) => {
            let dates = new Date();
            let y = dates.getFullYear() + 1;
            let year = new Date(y + "-01-01");
            let y_ = dates.getFullYear();
            let year_ = new Date(y_ + "-01-01");
            let startDate = new Date(this.dailyBeginTime);

            if (this.dailyBeginTime) {
              let b = (time.getTime() > year - 8.64e7) || (time.getTime() < year_ - 8.64e7) || (time.getTime() < startDate - 8.64e7)
              return b;
            } else {
              let b = (time.getTime() > year - 8.64e7) || (time.getTime() < year_ - 8.64e7);
              return b;
            }
          }
        },
        dailyStartDate: {
          disabledDate: (time) => {
            let dates = new Date();
            let y = dates.getFullYear();
            let year = new Date(y + "-01-01");
            let y_ = dates.getFullYear() + 1;
            let year_ = new Date(y_ + "-01-01");
            let endDate = new Date(this.dailyOverTime);

            if (this.dailyOverTime) {
              let b = (time.getTime() < year - 8.64e7) || (time.getTime() > year_ - 8.64e7) || (time.getTime() > endDate)
              return b;
            } else {
              let b = (time.getTime() < year - 8.64e7) || (time.getTime() > year_ - 8.64e7);
              return b;
            }
          }
        },
        tableData: [],
        page: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        equipmentShow: false,
        popupShow: false,
        status: true,
        reportId: '',
        popuptype: '',
        entityType: '',
        equipmentData: {}
      }
    },
    mounted() {
      switch (this.$route.name) {
        case 'specialElevator_Surveyreport_indexTable':
          this.entityType = "ELEVATOR"
          break;
        case 'specialBoiler_Surveyreport_indexTable':
          this.entityType = "BOILER"
          break;
        case 'specialpressureVessel_Surveyreport_indexTable':
          this.entityType = "PRESSURE_VESSEL"
          break;
        case 'specialpressurePiping_Surveyreport_indexTable':
          this.entityType = "PRESSURE_PIPING"
          break;
        case 'specialhoistingMachinery_Surveyreport_indexTable':
          this.entityType = "HOISTING_MACHINERY"
          break;
        case 'specialpassengerRopeway_Surveyreport_indexTable':
          this.entityType = "PASSENGER_ROPEWAY"
          break;
        case 'speciallargePlayground_Surveyreport_indexTable':
          this.entityType = "LARGE_PLAYGROUND"
          break;
        case 'specialmechanicallyPropelledVehicle_Surveyreport_indexTable':
          this.entityType = "MECHANICALLY_PROPELLED_VEHICLE"
          break;
      }
      this.getReportPagingList()
    },
    methods: {
      beforeAvatarUpload(file) {
        let type = file.name.substr(file.name.lastIndexOf('.'))
        let flag = true
        if (type !== '.xlsx') {
          flag = false
          this.$message.warning('上传格式错误')
        }
        return flag
      },
      fileUploadError(err, file) {
        this.$message.warning("文件上传失败！");
      },
      uploadConfig(file, callback) {
        this.login = true;
        var formdata = new FormData()
        formdata.append('file', file.file)
        let _this = this
        uploadFile(formdata, { type: 'DEPT' }, callback).then((result) => {
          let data = {
            fileId: result.data.id
          };
          getReportImport(data).then(r => {
            this.login = false;
            if (r.status) {
              let errorCount = r.data.errorCount ? r.data.errorCount : 0
              this.$message({
                message: '共导入' + r.data.total + '条, 导入成功' + (r.data.total - errorCount) + '条, 导入失败' + errorCount + '条',
                type: 'success'
              })
              if (r.data.errorFileId) {
                downloadFile(r.data.errorFileId, r.data.errorFileName)
              }
              _this.getReportPagingList()
            } else {
              this.$message.error(r.message)
            }
          })
        })
      },
      getReportPagingList(){
        let params = {
          search: this.subName,
          startDate: this.dailyBeginTime,
          endDate: this.dailyOverTime,
          entityType: this.entityType,
          pageSize: this.page.pageSize,
          pageNum: this.page.pageNum
        }
        getReportPagingList(params).then(r => {
          this.page.total = r.data.total;
          this.tableData = r.data.list;
        })
      },
      down(type) {
        let params
        if(type == 'all'){
          params = {
            search: this.subName,
            startDate: this.dailyBeginTime,
            endDate: this.dailyOverTime,
            entityType: this.entityType,
          }
        } else {
          params = {
            search: this.subName,
            startDate: this.dailyBeginTime,
            endDate: this.dailyOverTime,
            entityType: this.entityType,
            pageSize: this.page.pageSize,
            pageNum: this.page.pageNum
          }
        }
        getReportExport(params).then(r => {
          if (r.status) {
            downloadFile(r.data, '检验报告')
          }
        })
      },
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.getReportPagingList()
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.getReportPagingList()
      },
      equipmentShowFun(){
        this.equipmentShow = false;
        this.equipmentData = {};
      },
      popupShowHiden() {
        this.status = true; 
        this.popuptype = '';
        this.reportId = '';
        this.popupShow = false;
        this.getReportPagingList()
      },
      popupInfo(id) {
        this.status = false; 
        this.popuptype = 'info';
        this.reportId= id;
        this.popupShow = true;
      },
      popupEdit(id) {
        this.popuptype = 'edit';
        this.reportId= id;
        this.popupShow = true;
      },
      rowClick(data){
        this.equipmentData = data;
        this.equipmentShow = false;
        this.popupShow = true;
      }
    },
    components: {
      equipment, popup
    }
  }
</script>

<style scoped lang="sass">
  .educeUl{
    display: inline-block;
    position: relative;
    li{
      text-align: center;
    }
    .firstLi{
      background: #0DB5EF;
      line-height: 34px;
      height: 34px;
      color: #fff;
    }
    .childrenLi{
      height: 0px;
      box-shadow:0px 4px 11px 0px rgba(60,69,80,0.16),0px 2px 3px 0px rgba(34,56,72,0.06);
      overflow: hidden;
      position: absolute;
      width: 100px;
      z-index: 9;
      background: #fff;
      p{
        line-height: 40px;
      }
      p:hover{
        background: #EEF1F4;
      }
    }
  }
  .educeUlDown{
    .childrenLi{
      height: 80px;
    }
  }
  .login{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0,0,0,.5);
    z-index: 2;
    p{
      text-align: center;
      font-size: 30px;
      color: #fff;
      position: absolute;
      top: 50%;
      width: 100%;
      margin-top: -30px;
    }
  }
</style>