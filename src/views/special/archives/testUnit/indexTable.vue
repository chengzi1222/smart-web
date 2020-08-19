<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>检验单位档案</span>
    </div>
    <div class="mt20">
      <el-input title="名称，社会信用代码，资质许可证，账号" placeholder="名称，社会信用代码，资质许可证，账号" class="w260 seekIpt" v-model="subName" @keyup.enter.native="getInspectPaging">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getInspectPaging"></i>
      </el-input>
      <el-select class="w150 ml20" v-model="state" placeholder="状态" @change="getInspectPaging" clearable>
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <ul class="educeUl floatR w100" :class="educeUlDown?'educeUlDown':''" @mouseenter="educeUlDown = true" @mouseleave="educeUlDown = false">
        <li class="firstLi">导出<i class="ml10" :class="educeUlDown?'el-icon-caret-bottom':'el-icon-caret-top'"></i></li>
        <li class="childrenLi">
          <p class="movePoin" @click="down">导出本页</p>
          <p class="movePoin" @click="downAll">导出全部</p>
        </li>
      </ul>
      <el-upload class="floatR" action="" :http-request="uploadConfig" :show-file-list="false" :on-error="fileUploadError" :before-upload="beforeAvatarUpload">
        <el-button :disabled="false" class="mr20 w100" type="primary">导入</el-button>
      </el-upload>
      <el-button @click="addShow = true" type="primary" class="w76 floatR mr20" icon="el-icon-plus">添加</el-button>
    </div>
    <el-table class="mt20 table-div" border :data="tableData">
      <el-table-column show-overflow-tooltip type="index" label="序号" min-width="50"></el-table-column>
      <el-table-column show-overflow-tooltip prop="name" label="检验单位名称" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="creditCode" label="统一社会信用代码" min-width="140"></el-table-column>
      <el-table-column show-overflow-tooltip prop="aptitudeLicence" label="资质许可证号" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="aptitudeRank" label="资质级别" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="accountNumber" label="账号" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="address" label="地址" min-width="150"></el-table-column>
      <el-table-column show-overflow-tooltip prop="contacts" label="联系人" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="contactNumber" label="联系电话" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="state" label="状态" min-width="80"></el-table-column>
      <el-table-column min-width="200" label="操作">
        <template slot-scope="scope">
          <a style="color: #1787AD;cursor:pointer" @click="edit(scope.row)">编辑</a>
          <a style="color: #1787AD;cursor:pointer" @click="getInspectPasswordUpdate(scope.row)">重置密码</a>
          <a style="color: #1787AD;cursor:pointer" v-if="scope.row.state == '启用'" @click="statusUpdate(scope.row,'NO','禁用')">禁用</a>
          <a style="color: #1787AD;cursor:pointer" v-else @click="statusUpdate(scope.row,'YES','启用')">启用</a>
          <!-- <a style="color: #1787AD;cursor:pointer" @click="lookUserShow = true">人员</a> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box mt20">
      <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="pageSizeChange"
        @current-change="pagecCurrentChange">
      </el-pagination>
    </div>
    <addPopup v-if="addShow" @addShowHiden="addShowHiden" :esitRow="esitRow" @statusUpdate="statusUpdate"></addPopup>
    <lookUserPopup v-if="lookUserShow" @lookUserShowHiden="lookUserShowHiden"></lookUserPopup>
    <div class="login" v-if="login">
      <p>导入中<i class="el-icon-loading"></i></p>
    </div>
  </div>
</template>

<script>
  import { getInspectPaging, getInspectPasswordUpdate, postInspectUpdate, getInspectExport, getInspectAllExport, getInspectImport } from 'api/special/archives'
  import { downloadFile, uploadFile } from 'api/common'

  import addPopup from './add.vue';
  import lookUserPopup from './lookUser.vue';
  export default {
    data() {
      return {
        subName: '',
        educeUlDown: false,
        options: [
          {
          value: 'YES',
          label: '启用'
          }, {
          value: 'NO',
          label: '禁用'
          }
        ],
        tableData: [],
        page: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        addShow: false,
        lookUserShow: false,
        state: '',
        esitRow: {},
        login: false,
        entityType: []
      };
    },
    mounted() {
      this.getInspectPaging()
    },
    methods: {
      edit(row) {
        this.addShow = true;
        this.esitRow = row;
      },
      down() {
        let params = {
          keysWork: this.subName,
          state: this.state,
          pageSize: this.page.pageSize,
          pageNum: this.page.pageNum,
        }
        getInspectExport(params).then(r => {
          if (r.status) {
            downloadFile(r.data.fileId, r.data.fileName)
          }
        })
      },
      downAll() {
        getInspectAllExport().then(r => {
          if (r.status) {
            downloadFile(r.data.fileId, r.data.fileName)
          }
        })
      },
      addShowHiden(){
        this.addShow = false; 
        this.esitRow = {};
        this.getInspectPaging()
      },
      lookUserShowHiden() {
        this.lookUserShow = false; 
      },
      getInspectPaging(){
        let params = {
          keysWork: this.subName,
          state: this.state,
          entityType: this.entityType,
          pageSize: this.page.pageSize,
          pageNum: this.page.pageNum
        }
        getInspectPaging(params).then(r => {
          if (!r.status) { return }
          this.page.total = r.data.total;
          this.tableData = r.data.list;
        })
      },
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.getInspectPaging()
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.getInspectPaging()
      },
      getInspectPasswordUpdate(row) {
        this.$confirm('是否重置该检验单位的登录密码？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getInspectPasswordUpdate(row.userId).then(r => {
            if (r.status) {
              this.$message.success('该单位密码已重置为：111111')
            } else {
              this.$message.error('密码重置失败，请重试！')
            }
          })
        }).catch(() => { });
      },
      statusUpdate(row, status, toopStr) {
        this.$confirm('是否确认' + toopStr + '该单位？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            name: row.name,
            accountNumber: row.accountNumber,
            address: row.address,
            contacts: row.contacts,
            creditCode: row.creditCode,
            contactNumber: row.contactNumber,
            aptitudeRank: row.aptitudeRank,
            aptitudeLicence: row.aptitudeLicence,
            state: status
          }
          postInspectUpdate(row.id, params).then(r => {
            if (r.status) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.getInspectPaging();
              this.addShow = false;
              this.esitRow = {};
            } else {
              this.$message.error(r.message)
            }
          })
        })
      },
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
          getInspectImport(data).then(r => {
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
              _this.getInspectPaging()
            } else {
              this.$message.error(r.message)
            }
          })
        })
      },
    },
    components: {
      addPopup, lookUserPopup
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
  .pagination-box{
    text-align: right;
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