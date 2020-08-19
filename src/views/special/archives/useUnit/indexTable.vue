<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>生产使用单位档案</span>
    </div>
    <div class="mt20">
      <el-input title="名称，编码，账号，社会信用代码" placeholder="名称，编码，账号，社会信用代码" class="w260 seekIpt" v-model="subName" @keyup.enter.native="postEntityPaging">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="postEntityPaging"></i>
      </el-input>
      <el-select class="w150 ml20" v-model="unitCategory" placeholder="单位类别" @change="postEntityPaging" clearable multiple collapse-tags>
        <el-option v-for="item in unitOptions" :key="item.code" :label="item.name" :value="item.code">
        </el-option>
      </el-select>
      <el-select class="w180 ml20" v-model="entityType" placeholder="设备大类" @change="postEntityPaging" clearable multiple collapse-tags>
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>
      <el-select class="w150 ml20" v-model="placeType" placeholder="场所类型" @change="postEntityPaging" clearable multiple collapse-tags>
        <el-option v-for="item in placeOptions" :key="item.code" :label="item.name" :value="item.code">
        </el-option>
      </el-select>
      <el-select class="w150 ml20" v-model="state" placeholder="状态" @change="postEntityPaging" clearable>
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
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
      <el-button @click="addShow = true" type="primary" class="w76 floatR mr20" icon="el-icon-plus">添加</el-button>
    </div>
    <el-table class="mt20 table-div" border :data="tableData">
      <el-table-column show-overflow-tooltip type="index" label="序号" min-width="50"></el-table-column>
      <el-table-column show-overflow-tooltip prop="code" label="生产使用单位编码" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="entityName" label="生产使用单位名称" min-width="130"></el-table-column>
      <el-table-column show-overflow-tooltip prop="userName" label="生产使用单位账号" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="unitCategoryStr" label="单位类别" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="entityTypeStr" label="设备大类" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="placeTypeStr" label="场所类型" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="creditCode" label="统一社会信用代码" min-width="140"></el-table-column>
      <el-table-column show-overflow-tooltip prop="address" label="生产使用单位地址" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="corpPerson" label="负责人" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="corpMobile" label="负责人电话" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="safeManageDept" label="安全管理部门" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="safeManager" label="安全管理人员" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="safeManageMobile" label="安全管理手机" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="safeManageTel" label="安全管理座机" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="statusStr" label="状态" min-width="80"></el-table-column>
      <el-table-column min-width="250" label="操作" fixed="right">
        <template slot-scope="scope">
          <a style="color: #1787AD;cursor:pointer" @click="edit(scope.row)">编辑</a>
          <router-link :to="{name:'special_EmployArchives_infoIndex',query:{id:scope.row.id,name:scope.row.entityName}}">详情</router-link>
          <a style="color: #1787AD;cursor:pointer" @click="postEmployPasswordUpdate(scope.row)">重置密码</a>
          <a style="color: #1787AD;cursor:pointer" v-if="scope.row.status == 'NO'" @click="getEntityStatusUpdate(scope.row.id, 'YES')">启用</a>
          <a style="color: #1787AD;cursor:pointer" v-else @click="getEntityStatusUpdate(scope.row.id, 'NO')">禁用</a>
          <!-- <a style="color: #1787AD;cursor:pointer" @click="lookUserShow = true">人员</a> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box mt20">
      <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 50, 100,500]" :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="pageSizeChange"
        @current-change="pagecCurrentChange">
      </el-pagination>
    </div>
    <addPopup v-if="addShow" @addShowHiden="addShowHiden" @postEntityPaging="postEntityPaging" :esitRow='esitRow' :entityType='entityType'></addPopup>
    <lookUserPopup v-if="lookUserShow" @lookUserShowHiden="lookUserShowHiden"></lookUserPopup>
    <div class="login" v-if="login">
      <p>导入中<i class="el-icon-loading"></i></p>
    </div>
  </div>
</template>

<script>
  import { postEntityPaging, getEntityStatusUpdate, postEntityExport, postEmployPasswordUpdate, getEmployEntityImport} from 'api/special/archives'
  import { downloadFile, uploadFile, getEnums, getDicts } from 'api/common'

  import addPopup from './add.vue';
  import lookUserPopup from './lookUser.vue';
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
          total: 0
        },
        esitRow:{},
        addShow: false,
        lookUserShow: false,
        login: false,
        entityType: [],
        placeType: [],
        unitCategory: [],
        typeOptions: [],
        placeOptions: [],
        unitOptions: []
      };
    },
    mounted() {
      getEnums(['com.ybveg.govx.enums.tzsb.TzsbCategoryEnum'], false).then(r => {
        this.typeOptions = r.data;
      })
      getDicts(['TZSB_PLACE_TYPE']).then(r => {
        this.placeOptions = r.data[0].list
      })
      getDicts(['TZSB_UNIT_TYPE']).then(r => {
        this.unitOptions = r.data[0].list
      })
      this.postEntityPaging();
    },
    methods: {
      down(num){
        let params;
        if (num == 'all') {
          params = {
            search: this.subName,
            entityType: this.entityType,
            placeType: this.placeType,
            unitCategory: this.unitCategory,
            state: this.state
          }
        } else {
          params = {
            search: this.subName,
            state: this.state,
            entityType: this.entityType,
            placeType: this.placeType,
            unitCategory: this.unitCategory,
            pageSize: this.page.pageSize,
            pageNum: this.page.pageNum
          }
        }
        postEntityExport(params).then(r => {
          downloadFile(r.data, '使用主体信息表')
        });
      },
      addShowHiden(){
        this.esitRow = {};
        this.addShow = false; 
        this.postEntityPaging();
      },
      edit(row) {
        this.esitRow = row;
        this.addShow = true;
      },
      postEmployPasswordUpdate(row) {
        this.$confirm('是否重置该使用单位的登录密码？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          postEmployPasswordUpdate(row.userId).then(r => {
            if (r.status) {
              this.$message.success('该单位密码已重置为：111111')
            } else {
              this.$message.error('密码重置失败，请重试！')
            }
          })
        }).catch(() => { });
      },
      lookUserShowHiden() {
        this.lookUserShow = false; 
      },
      postEntityPaging() {
        let params = {
          search: this.subName,
          state: this.state,
          pageSize: this.page.pageSize,
          pageNum: this.page.pageNum,
          entityType: this.entityType,
          placeType: this.placeType,
          unitCategory: this.unitCategory
        }
        postEntityPaging(params).then(r => {
          if (r.status) {
            this.tableData = r.data.list;
            this.page.total = r.data.total;
          }
        })
      },
      getEntityStatusUpdate(id, status){
        let toopStr = status == 'YES' ? '启用' : '禁用';
        this.$confirm('是否确认' + toopStr + '该单位？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id: id,
            status: status
          }
          getEntityStatusUpdate(params).then(r => {
            if (r.status) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.postEntityPaging();
              this.addShow = false;
              this.esitRow = {};
            } else {
              if (r.level=='warning') {
                this.$message.warning(r.message)
              }else{
                this.$message.error(r.message)
              }
            }
          })
        })
      },
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.postEntityPaging();
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.postEntityPaging();
      },
      beforeAvatarUpload(file) {
        let type = file.name.substr(file.name.lastIndexOf('.'))
        let flag = true
        // if (type !== '.xls' && type !== '.xlsx') {
        if (type !== '.xls' ) {
          flag = false
          this.$message.warning('上传文件格式仅支持XLS！')
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
        let _this = this;
        getEmployEntityImport(formdata).then(r => {
          this.login = false;
          if (!r.data.fileId) {
            _this.$message.success('导入成功');
            _this.postEntityPaging()
          } else {
            _this.$message.warning('导入出错')
            downloadFile(r.data.fileId, r.data.fileName)
          }
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
    z-index: 3;
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
