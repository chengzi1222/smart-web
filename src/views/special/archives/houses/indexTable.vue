<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>楼盘档案</span>
    </div>
    <div class="mt20">
      <el-input placeholder="名称、地址、联系人" class="w260 seekIpt" v-model="subName" @keyup.enter.native="getBuildingPaging">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getBuildingPaging"></i>
      </el-input>
      <el-select class="w150 ml20" v-model="state" placeholder="状态" @change="getBuildingPaging" clearable>
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <ul class="educeUl floatR w100" :class="educeUlDown?'educeUlDown':''" @mouseenter="educeUlDown = true" @mouseleave="educeUlDown = false">
        <li class="firstLi">导出<i class="ml10" :class="educeUlDown?'el-icon-caret-bottom':'el-icon-caret-top'"></i></li>
        <li class="childrenLi">
          <p class="movePoin" @click="down">导出本页</p>
          <p class="movePoin" @click="">导出全部</p>
        </li>
      </ul>
      <el-upload class="floatR" action="" :http-request="uploadConfig" :show-file-list="false" :on-error="fileUploadError" :before-upload="beforeAvatarUpload">
        <el-button :disabled="false" class="mr20 w100" type="primary">导入</el-button>
      </el-upload>
      <el-button @click="addShow = true" type="primary" class="w76 floatR mr20" icon="el-icon-plus">添加</el-button>
    </div>
    <el-table class="mt20 table-div" border :data="tableData">
      <el-table-column show-overflow-tooltip type="index" label="序号" min-width="50"></el-table-column>
      <el-table-column show-overflow-tooltip prop="name" label="楼盘名称" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="address" label="楼盘地址" min-width="140"></el-table-column>
      <el-table-column show-overflow-tooltip prop="contacts" label="楼盘联系人" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="contactNumber" label="楼盘联系电话" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="state" label="状态" min-width="80"></el-table-column>
      <el-table-column min-width="150" label="操作">
        <template slot-scope="scope">
          <a style="color: #1787AD;cursor:pointer" @click="edit(scope.row)">编辑</a>
          <a style="color: #1787AD;cursor:pointer" v-if="scope.row.state == '启用'" @click="statusUpdate(scope.row,'NO','禁用')">禁用</a>
          <a style="color: #1787AD;cursor:pointer" v-else @click="statusUpdate(scope.row,'YES','启用')">启用</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box mt20">
      <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 50, 100,500]" :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="pageSizeChange"
        @current-change="pagecCurrentChange">
      </el-pagination>
    </div>
    <addPopup v-if="addShow" @addShowHiden="addShowHiden" :esitRow='esitRow' @statusUpdate="statusUpdate"></addPopup>
    <div class="login" v-if="login">
      <p>导入中<i class="el-icon-loading"></i></p>
    </div>
  </div>
</template>

<script>
  import {getBuildingPaging, postBuildingUpdate, getBuildingExport, getBuildingImport} from 'api/special/archives'
  import { downloadFile, uploadFile } from 'api/common'
  
  import addPopup from './add.vue';
  export default {
    data() {
      return {
        subName: '',
        state: '',
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
          total: 50
        },
        addShow: false,
        esitRow: {},
        lookUserShow: false,
        login: false
      };
    },
    mounted() {
      this.getBuildingPaging()
    },
    methods: {
      addShowHiden(){
        this.addShow = false; 
        this.esitRow = {};
        this.getBuildingPaging()
      },
      getBuildingPaging(){
        let params = {
          keysWork: this.subName,
          state: this.state,
          pageSize: this.page.pageSize,
          pageNum: this.page.pageNum
        }
        getBuildingPaging(params).then(r => {
          if(!r.status){return}
          this.page.total = r.data.total;
          this.tableData = r.data.list;
        })
      },
      edit(row){
        this.addShow = true;
        this.esitRow = row;
      },
      statusUpdate(row, status, toopStr){
        this.$confirm('是否确认'+ toopStr +'该楼盘？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            name: row.name,
            address: row.address,
            contacts: row.contacts,
            contactNumber: row.contactNumber,
            lat: (row.lat + '').length == 2 ? row.lat + '.000000' : row.lat,
            lng: (row.lng + '').length == 2 ? row.lng + '.000000' : row.lng,
            state: status
          }
          postBuildingUpdate(row.id, params).then(r => {
            if (r.status) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.getBuildingPaging();
              this.addShow = false;
              this.esitRow = {};
            } else {
              this.$message.error(r.message)
            }
          })
        })
      },
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.getBuildingPaging()
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.getBuildingPaging()
      },
      down(){
        let params = {
          keysWork: this.subName,
          state: this.state,
          pageSize: this.page.pageSize,
          pageNum: this.page.pageNum
        }
        getBuildingExport(params).then(r => {
          if(r.status){
            downloadFile(r.data.fileId,r.data.fileName)
          }
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
          getBuildingImport(data).then(r => {
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
      addPopup
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