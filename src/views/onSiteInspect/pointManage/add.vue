<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b>
      <span>添加核查要点表</span>
    </div>
    <el-form ref="form" :model="form" :rules="formRule" label-width="200px">
      <toggle-form title="基本信息">
        <div class="content">
          <div class="row">
            <el-form-item label="要点表名称" prop="name">
              <el-input
                v-model="form.name"
                :maxlength="30"
                placeholder="请输入要点表名称, 30字以内"
                class="w300"
                v-if="baseDataEdit"
              ></el-input>
              <span v-else>{{form.name}}</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="适用类型" prop="businessType">
              <el-input
                type="textarea"
                class="w300"
                :maxlength="100"
                :autosize="{minRows:6}"
                placeholder="请输入适用类型, 100字以内"
                v-model="form.businessType"
                v-if="baseDataEdit"
              ></el-input>
               <span v-else>{{form.businessType}}</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="使用说明" prop="description">
              <el-input
                type="textarea"
                class="w300"
                :maxlength="1000"
                :autosize="{minRows:6}"
                placeholder="请输入使用说明, 1000字以内"
                v-model="form.description"
                v-if="baseDataEdit"
              ></el-input>
              <span v-else>{{form.description === ''? '暂无':form.description}}</span>
            </el-form-item>
          </div>
        </div>
        <div class="mt20 mb20 clear_a">
          <el-button
            class="w100 mr20 floatR"
            type="primary"
            @click="saveInfo"
          >{{baseDataEdit? '保存':'编辑'}}</el-button>
        </div>
      </toggle-form>
    </el-form>
    <toggle-form title="要点表核查内容信息" v-if="form.id !== ''">
      <div class="mt20 mb20">
        <el-button class="w130 mr20"  type="primary" @click="go('xchc.pointManage.setting',form.id)">配置核查项目</el-button>
        <el-button class="w130 mr20"  @click="dialog.show = true">添加核查内容</el-button>
        <el-upload action="" class="mr20" style="display: inline-block"  :show-file-list="false"
               :http-request="uploadConfig" :on-error="fileUploadError" :before-upload="beforeAvatarUploadImport">
                        <el-button  class="w100">导入</el-button>
        </el-upload>
        <el-button class="w130 mr20" @click="downLoadTem">下载导入模板</el-button>
      </div>
      <div  v-if="tableList.length > 0">
        <el-table   v-for="(item,index) in tableList" :key="item.id" :class="index==0?'firsTeit':''" :data="item"
                :span-method="objectSpanMethod" border class="table-div brN mT0">
          <el-table-column show-overflow-tooltip prop="projectNo" label="核查项编号" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="核查项目" min-width="120"></el-table-column>
          <el-table-column show-overflow-tooltip prop="contextNo" label="核查内容编号" min-width="120"></el-table-column>
          <el-table-column show-overflow-tooltip prop="content" label="核查内容" min-width="250"></el-table-column>
          <el-table-column show-overflow-tooltip  label="重要性" min-width="80">
            <template slot-scope="scope">
              {{importance[scope.row.importance]}} 
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" min-width="185">
            <template slot-scope="scope">{{scope.row.status === 'YES'?'启用':'禁用'}}</template>
          </el-table-column>
          <el-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <a href="javascript:;" class="operate-a" @click="editContent(scope.row)">编辑</a>
              <a href="javascript:;" class="operate-a" @click="operate(scope.row)">{{scope.row.status === 'YES'?'禁用':'启用'}}</a>
              <a href="javascript:;" class="operate-a" v-if="scope.row.status === 'NO'" @click="del(scope.row.contentId,scope.row.importance)">删除</a>
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
    <el-form ref="settingForm" :rules="settingRule" :model="settingForm" label-width="200px" style="height:100%">
      <toggle-form title="配置最少不符合项" v-if="tableList.length > 0">
        <div class="content">
          <div class="row">
            <el-form-item label="关键项不符合数" prop="cruxNum">
              <el-input v-model="settingForm.cruxNum" class="w300"></el-input>
            </el-form-item>
            <span class="rowybUploadText">当前关键项{{cruxIndex}}项</span>
          </div>
          <div class="row">
            <el-form-item label="重点项不符合数" prop="importantNum">
              <el-input v-model="settingForm.importantNum" class="w300"></el-input>
            </el-form-item>
            <span class="rowybUploadText">当前重点项{{importantIndex}}项</span>
          </div>
          <div class="row">
            <el-form-item label="一般项+重点项不符合数" prop="generalImportNum">
              <el-input v-model="settingForm.generalImportNum" class="w300"></el-input>
            </el-form-item>
            <span class="rowybUploadText">当前一般项{{generalIndex}}项</span>
          </div>
        </div>
        <div class="mt20 mb20 clear_a">
          <el-button class="w100 mr20 floatR" type="primary" @click="saveStandard">保存</el-button>
        </div>
      </toggle-form>
    </el-form>
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button @click="goBack()" style="width:120px;">返回</el-button>
      </div>
    </div>
    <add-dialog  :tableId="form.id" v-if="dialog.show" :showTip="dialog.show" @cancel="cancel"></add-dialog>
    <edit-dialog  :tableId="form.id" :editData="editData" v-if="editShow" :showTip="editShow" @cancel="editShow = false"></edit-dialog>
  </div>
</template>
<script>
import ToggleForm from "components/ToggleForm.vue";
import AddDialog from "./addDialog"
import EditDialog from './editDialog'
import * as api from '../../../api/xchc/index'
import * as storage from "utils/sessionStorage";
import {
        downloadFile
    } from "api/common";
export default {
  components: {
    ToggleForm,
    AddDialog,
    EditDialog
  },
  data() {
    var checkCrux = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('关键项不能为空'));
        }
        setTimeout(() => {
          if (value > this.cruxIndex) {
              callback(new Error('不能大于当前要点表对应项数量'));
            } else {
              callback();
            }
        
        }, 100);
    };
    var checkImportant = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('重点项不能为空'));
        }
        setTimeout(() => {
            if (value > this.importantIndex) {
              callback(new Error('不能大于当前要点表对应项数量'));
            } else {
              callback();
            }
        }, 100);
    };
     var checkGeneralIm = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('一般项+重点项不能为空'));
        }
        setTimeout(() => {
            if (value > this.generalIndex + this.importantIndex) {
              callback(new Error('不能大于当前要点表对应项数量'));
            } else {
              callback();
            }
        }, 100);
    };
    return {
      baseDataEdit:true,
      dialog: {
        title: '添加核查内容',
        show: false,
        id: ''
      },
      importance:{
        "IMPORTANT":"重点项(**)",
        "CRUX":"关键项(***)",
        "GENERAL":"一般项(*)"
      },
      importantIndex:0,
      cruxIndex:0,
      generalIndex:0,
      dialogVisible: false,
      form: {
        name: '',
        businessType: '',
        description: '',
        id: ''
      },
      editData:{},
      editShow:false,
      total: 0,
      settingForm: {
        cruxNum: null,
        generalImportNum: null,
        importantNum: null,
        tableId:''
      },
      tableList:[],
      queryLimit: {
        pageSize: 10,
        pageNum: 1,
        tableId:''
      },
      formRule: {
        name: [
          { required: true, message: '请输入要点表名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        businessType: [
          { required: true, message: '请输入适用类型', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ]
      },
      settingRule: {
        cruxNum: [
          { required: true, message: '请输入关键项不符合数', trigger: 'blur' },
          { message: "请输入0或正整数", pattern: /^([1-9]\d*|[0]{1,1})$/, trigger: "blur" },
          { validator: checkCrux, trigger: 'blur' }
        ],
        importantNum: [
          { required: true, message: '请输入重点项不符合数', trigger: 'blur' },
          { message: "请输入0或正整数", pattern: /^([1-9]\d*|[0]{1,1})$/, trigger: "blur" },
          { validator: checkImportant, trigger: 'blur' }
        ],
        generalImportNum: [
          { required: true, message: '请输入一般项和重点项不符合数', trigger: 'blur' },
          { message: "请输入0或正整数", pattern: /^([1-9]\d*|[0]{1,1})$/, trigger: "blur" },
          { validator: checkGeneralIm, trigger: 'blur' }

        ]
      },
      importLoad: false
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
    go(page, id) {
      this.$router.push({
        name: page,
        query: {
          id: id
        }
      })
    },
    cancel() {
      this.dialog.show = false
    },
    searchTab(){
      this.queryLimit.pageNum = 1;
      this.getList()
    },
    editContent(row){
      this.editData = row;
      this.editShow = true
    },
    async saveInfo() {
      if(!this.baseDataEdit){
          this.baseDataEdit = true
          return
        }
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let result = await api.addInfo(this.form)
           if(result&&result.status){
            this.form.id = result.data
            this.queryLimit.tableId = result.data
            storage.setData("table", JSON.stringify(this.form)); 
            this.$message({
                type: 'success',
                message: `操作成功` 
              });
            this.baseDataEdit = false
           }
        } else {
          return false;
        }
      });
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
    downLoadTem() {
      location.href = '/api/xchc/template' 
    },
    goBack(){
      this.$router.go(-1)
      storage.removeData('table')
    },
    async getList(){
      await this.getBaseData()
      this.tableList = []
      let result = await api.getContentList(this.queryLimit)
      if(result && result.status){
        let d = result.data.list
        for (let i = 0; i < d.length; i++) {
            let list = [];
            for (let j = 0; j < d[i].contentInfoList.length; j++) {
              let obj = {}
              // obj = d[i].contentInfoList[j];
              obj.projectNo = d[i].no;
              obj.name = d[i].name; 
              obj.id = d[i].id;
              obj.content = d[i].contentInfoList[j].content;
              obj.contentId = d[i].contentInfoList[j].id; 
              obj.importance = d[i].contentInfoList[j].importance;
              obj.contextNo = d[i].contentInfoList[j].no;
              obj.status = d[i].contentInfoList[j].status 
              obj.quickCheck = d[i].contentInfoList[j].quickCheck
              list.push(obj);
            } 
            d[i].contentInfoList.length <=0? '':this.tableList.push(list);
          }
        this.total = result.data.total
      }
    },
    async saveStandard(){
        this.$refs['settingForm'].validate(async (valid) => {
          if (valid) {
            this.settingForm.tableId = this.form.id
            let result = await api.saveLeast(this.settingForm)
            if(result && result.status){
              this.$message({
                type: 'success',
                message: `操作成功`
              });
              this.$router.go(-1)
              storage.removeData('table')
            }
          } else {
            return false;
          }
        });
    },
    async getBaseData(){
      let result = await api.getBaseData({
        tableId:this.form.id
      })
      this.importantIndex = result.data.currentImportNum;
      this.cruxIndex = result.data.currentCruxNum;
      this.generalIndex = result.data.currentGeneralNum;
    },
    async operate(row){
        // if(!this.checkNum(row.importance,row.status)){
        //   return 
        // }
        let text = ''
        let status = ''
        row.status === 'YES'? text='禁用后可能会影响核查合格规则，请谨慎操作!是否确认禁用':text ='是否确认启用'
        row.status === 'YES'? status='NO':status ='YES'
       this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let result = await api.contentStatus({
            contentId:row.contentId,
            status:status
          });
          if(result.status){
            this.$message({
            type: 'success',
            message: `操作成功`
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
    checkNum(importance,status){
        if(status &&status === 'NO'){
            return true
        }
        if(importance === 'CRUX'){
          if(this.settingForm.cruxNum&&this.settingForm.cruxNum== this.cruxIndex){
            this.$message({
            type: 'warning',
            message: '需校验要点表核查内容数量不能小于最少不符合项'
            });
            return false
          }
        }else if(importance === 'GENERAL' || 'IMPORTANT'){
           if(this.settingForm.importantNum&&this.settingForm.importantNum == this.importantIndex){
            this.$message({
            type: 'warning',
            message: '需校验要点表核查内容数量不能小于最少不符合项'
            });
            return false
          }
          if(this.settingForm.generalImportNum&&this.settingForm.generalImportNum== this.generalIndex + this.importantIndex){
            this.$message({
            type: 'warning',
            message: '需校验要点表核查内容数量不能小于最少不符合项'
            });
            return false
          }
        }
        return true
    },
    async del(id,importance){
      // if(!this.checkNum(importance)){
      //     return 
      //   }
       this.$confirm('删除后可能会影响核查合格规则，请谨慎操作!是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let result = await api.contentDel({
            contentId:id,
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
      formdata.append('file', file.file);
      formdata.append('tableId',this.queryLimit.tableId)
      api.uploadFile(formdata).then((r) => {
      this.importLoad = false;
      if (r.status&&!r.data) {
          this.$message.success('导入成功!');
          this.getList()
      }else if (r.status&&r.data) {
        this.$message.error('导入失败!正在下载失败内容');
        downloadFile(r.data, '导入失败内容');
        this.getList()
      } else {
         tis.$message.error('导入失败!');
        }
      })
    },
  },
  mounted() { 
    if(storage.getData('table')){
      this.form = JSON.parse(storage.getData('table'))
      this.queryLimit.tableId = this.form.id
      this.baseDataEdit = false
      this.getList()
    } 
  }

}
</script>
<style lang="scss" scoped>
.content {
  margin: 20px auto 0px;
  width: 750px;
}
.rowybUploadText {
  line-height: 40px;
  font-size: 12px;
  color: #a2aab6;
}
</style>
<style lang="sass">
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
  .mT35 .el-table__header-wrapper {
    display: none;
  }

  .mT35 .firsTeit .el-table__header-wrapper {
    display: block;
  }

  .mT35 .el-table {
    border-top: none !important;
  }

  .mT35 .firsTeit {
    border-top: 1px solid #ebeef5 !important;
  }
  .mT0{
    margin:0
  }

  .detail table {
    width: calc(100% - 270px) !important;
  }
</style>
