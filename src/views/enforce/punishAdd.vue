<template xmlns="http://www.w3.org/1999/html">
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>添加行政处罚</span>
      <back></back>
    </div>

    <div class="right-info">
      <el-form :model="punishData" :rules="rules" ref="punishData" label-width="110px">
        <!-- 主体基本信息 -->
        <toggle-form title="主体基本信息" name="entityInfo">
          <div class="content">
            <div class="row">
              <el-form-item label="主体信息:" prop="entity">
                <el-button type="primary" @click="showEntityTable">选择主体</el-button>
              </el-form-item>
            </div>
            <div class="currentIndex">
              <template v-if="isEntityInfoShow">
                <div class="row">
                  <el-form-item label="主体名称:" prop="entityName">
                    {{ punishData.entityName }}
                  </el-form-item>
                  <el-form-item label="主体类型:" prop="entityType">
                    {{ punishData.entityTypeStr }}
                  </el-form-item>
                </div>
                <div class="row">
                  <el-form-item label="统一社会信用代码:" prop="creditCode">
                    {{ punishData.creditCode?punishData.creditCode:"无" }}
                  </el-form-item>
                  <el-form-item label="许可备案号:" prop="licenseNumber">
                    {{ punishData.licenseNumber?punishData.licenseNumber:"无" }}
                  </el-form-item>
                </div>
                <div class="row">
                  <el-form-item label="法人:" prop="corpName">
                    {{ punishData.corpName }}
                  </el-form-item>
                  <el-form-item label="经营场所地址:" prop="spaceAddr">
                    {{ punishData.spaceAddr?punishData.spaceAddr:"无" }}
                  </el-form-item>
                </div>
              </template>
            </div>
          </div>
        </toggle-form>

        <!-- 处罚信息 -->
        <toggle-form title="处罚信息" required name="punishInfo">
          <div class="content">
            <div class="row">
              <el-form-item label="线索来源:" prop="source">
                <el-select clearable v-model="punishData.source" placeholder="请选择线索来源">
                  <el-option v-for="item in sourceList" :key="item.id" :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="违法事实:" prop="illegal">
                <el-tooltip class="item" effect="dark" content="最多可输入300个字符" placement="right">
                  <el-input type="textarea" :rows="4" v-model="punishData.illegal" class="w400" :maxlength="300"
                          placeholder="请输入违法事实"></el-input>
                </el-tooltip>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="货值金额:" prop="valueMoney">
                <el-tooltip class="item" effect="dark" placement="right">
                  <div slot="content">· 最多可输入11个字符<br/>· 只能输入数字和小数点<br/>· 小数点最多保留两位</div>
                  <el-input v-model="punishData.valueMoney" :maxlength="11" placeholder="请输入货值金额"></el-input>
                </el-tooltip>
              </el-form-item>
              <span style="color: #A2AAB6;font-size:12px;margin-left:5px;">(选填)</span>
            </div>

            <div class="row">
              <el-form-item label="处罚类型:" prop="type">
                <el-select clearable v-model="punishData.type" placeholder="请选择处罚类型">
                  <el-option v-for="item in punishTypeList" :key="item.id" :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="处罚金额:" prop="punishMoney">
                <el-tooltip class="item" effect="dark" placement="right">
                  <div slot="content">· 最多可输入11个字符<br/>· 只能输入数字和小数点<br/>· 小数点最多保留两位</div>
                  <el-input v-model="punishData.punishMoney" :maxlength="11" placeholder="请输入处罚金额"></el-input>
                </el-tooltip>
              </el-form-item>
              <span style="color: #A2AAB6;font-size:12px;margin-left:5px;">(选填)</span>
            </div>

            <div class="row">
              <el-form-item label="处罚详情:" prop="punishInfo">
                <el-tooltip class="item" effect="dark" content="最多可输入300个字符" placement="right">
                  <el-input type="textarea" :rows="4" v-model="punishData.punishInfo" class="w400" :maxlength="300"
                          placeholder="请输入处罚详情"></el-input>
                </el-tooltip>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="执法日期:" prop="punishTime">
                <el-date-picker v-model="punishData.punishTime" format="yyyy-MM-dd" type="date"
                                value-format="yyyy-MM-dd" :picker-options="pickerOptions1"
                                :editable="false" placeholder="请选择执法时间" class="w200">
                </el-date-picker>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="处罚文书名:" prop="punishFile">
                <el-tooltip class="item" effect="dark" content="最多可输入30个字符" placement="right">
                  <el-input v-model="punishData.punishFile" :maxlength="30" placeholder="请输入处罚文书名"></el-input>
                </el-tooltip>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="处罚文书编号:" prop="punishFileNo">
                <el-tooltip class="item" effect="dark" content="最多可输入30个字符" placement="right">
                  <el-input v-model="punishData.punishFileNo" :maxlength="30" placeholder="请输入处罚文书编号"></el-input>
                </el-tooltip>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="处罚文书附件:" prop="writ">
                <el-upload
                  class="upload-demo"
                  action="/api/upload"
                  :data="{type: 'PUNISH',field: 'WRIT'}"
                  :on-preview="handlePreview"
                  :on-error="handleError"
                  :on-success="handleWritSuccess"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :before-upload="beforeUpload"
                  :limit="fileLimit"
                  :on-exceed="handleExceed">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png/doc/pdf文件，且不超过10M，最多可上传5个文件
                  </div>
                </el-upload>
                <div v-if="dialogVisible" class="modal" @click.stop="dialogVisible = false;">
                  <img class="bigImg"  :src="dialogImageUrl" alt="">
                </div>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="证据附件:" prop="evidence">
                <el-upload
                  class="upload-demo"
                  action="/api/upload"
                  :data="{type: 'PUNISH',field: 'EVIDENCE'}"
                  :on-preview="handlePreview"
                  :on-error="handleError"
                  :on-success="handleEvidenceSuccess"
                  :before-remove="beforeRemove"
                  :on-remove="handleRemove"
                  :before-upload="beforeUpload"
                  :limit="fileLimit"
                  :on-exceed="handleExceed">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png/doc/pdf文件，且不超过10M，最多可上传5个文件
                  </div>
                </el-upload>
                <div v-if="dialogVisible" class="modal" @click.stop="dialogVisible = false;">
                  <img class="bigImg"  :src="dialogImageUrl" alt="">
                </div>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="执法人员:" prop="punishPerson">
                <el-select clearable multiple v-model="punishData.punishPerson" class="w300"
                           placeholder="执法人员（全部）"
                           @change="opSearch">
                  <el-option v-for="item in punishPersonList" :key="item.id" :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

          </div>
        </toggle-form>
      </el-form>
    </div>
    <br/><br/><br/><br/>

    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button type="primary" @click="submit('punishData')">保存</el-button>
        <el-button @click="resetForm('punishData')">重置</el-button>
        <el-button type="default" @click="$router.go(-1);">取消</el-button>
      </div>
    </div>

    <!-- 选择主体弹窗 -->
    <yb-popup width="850" :isShow='isEntityTableShow' @close="hideEntityTable()" :title="'选择主体'" id="popup">
      <div slot="body">
        <div style="width:750px;margin:20px auto 0;">
          <el-form :model="entityData" ref="entityData" label-width="100px"
                   class="demo-ruleForm">
            <div style="margin-bottom: 20px;">
              <el-input placeholder="主体名称、许可备案号" class="w250 seekIpt" style="margin-right: 10px"
                        v-model="entityData.search" @keyup.enter.native="handleIconClick">
                <i slot="suffix" class="el-input__icon el-icon-search"
                   @click="handleIconClick"></i>
              </el-input>
              <el-select v-model="entityType" placeholder="请选择主体类型"
                         class="w200" clearable @change="handleEntityTypeChange">
                <el-option v-for="item in entityTypeList" :key="item.key" :label="item.name"
                           :value="item.key">
                </el-option>
              </el-select>
            </div>

            <el-table style="height:373px;overflow-y:auto;" :data="tableData" class="table-div" fit  highlight-current-row
                      @current-change="handleCurrentChange">
              <el-table-column type="index" width="50" label="序号"></el-table-column>
              <el-table-column show-overflow-tooltip prop="entityName"
                               label="主体名称"></el-table-column>
              <el-table-column show-overflow-tooltip prop="entityTypeStr"
                               label="主体类型"></el-table-column>
              <el-table-column show-overflow-tooltip prop="licenseNumber"
                               label="许可备案号"></el-table-column>
              <el-table-column show-overflow-tooltip prop="spaceAddr"
                               label="经营地址/场所地址"></el-table-column>
            </el-table>
            <div class="pagination-box">
              <el-pagination background @size-change="pageSizeChange"
                             @current-change="pageCurrentChange"
                             :current-page="page.pageNum"
                             :page-sizes="[5,8,10,15,20,25,30]"
                             :page-size="page.pageSize"
                             layout="total, sizes, prev, pager, next, jumper"
                             :total="page.total">
              </el-pagination>
            </div>
            <br/>
            <div style="text-align:right">
              <el-form-item>
                <el-button type="primary" :disabled="isShowBtn" @click="showEntityInfo();">确定
                </el-button>
                <el-button type="default" @click="hideEntityTable();">取消</el-button>
              </el-form-item>
            </div>

          </el-form>
        </div>
      </div>

    </yb-popup>

  </div>
</template>

<script>
  import Back from 'utils/back.vue'		//返回上一个页面按钮
  import * as punish from "api/enforce/punish";
  import YbPopup from 'components/ybpopup/YbPopup';
  import {downloadFile} from "api/common";
  import {dailyEntityPage} from 'api/patrol/dailyRecordAdd.js';
  import ToggleForm from "components/ToggleForm.vue";
  import {floatValidNotRequired} from 'utils/validate';

  export default {
    async mounted() {

      var sourceDictCode = "AP_CLUE";
      var punishTypeDictCode = "AP_TYPE";

      // 主体类型下拉列表
      punish.listEntityType().then(result => {
        this.entityTypeList = result.data;
      }),

        // 线索来源下拉列表
        punish.listDict(sourceDictCode).then(result => {
          this.sourceList = result.data;
        }),

        // 处罚方式下拉列表
        punish.listDict(punishTypeDictCode).then(result => {
          this.punishTypeList = result.data;
        }),

        // 执法人员下拉列表
        punish.listPunishPerson().then(result => {
          this.punishPersonList = result.data;
        })

    },
    methods: {

      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addPunish();
          } else {
            return false;
          }
        });
      },

      addPunish() {
        this.punishData.valueMoney = parseFloat(this.punishData.valueMoney);
        this.punishData.punishMoney = parseFloat(this.punishData.punishMoney);
        this.$confirm('是否确认保存该行政处罚?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          punish.addPunish(this.punishData).then((result) => {
            if (!result.status) {
              this.$message({
                message: result.message,
                type: result.level
              });
              return;
            } else if (result.data) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              setTimeout(() => {
                this.backBtn();
              }, 2000);
            } else {
              this.$message({
                message: '保存失败',
                type: 'error'
              });
            }
          });
        })
      },

      // 重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.isEntityInfoShow = false;
      },

      // 返回列表
      backBtn() {
        this.$router.push({name: "enforce.punish"});
      },

      //下拉查询
      opSearch() {
        this.listEntityData();
      },
      handleEntityTypeChange() {
        if (this.entityType === '') {
          this.entityData.entityTypes.splice(0, this.entityData.entityTypes.length);
        } else {
          this.entityData.entityTypes.splice(0, this.entityData.entityTypes.length,
            this.entityType);
        }
        this.opSearch();
      },
      handleIconClick() {
        this.listEntityData();
      },
      //页面查询
      async listEntityData() {
        dailyEntityPage(this.entityData, this.page.pageSize, this.page.pageNum).then(result => {
          this.tableData = result.data.list;
          this.page.total = result.data.total;
        })
      },
      //分页条
      pageCurrentChange(num) {
        this.page.pageNum = num;
        this.listEntityData();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.listEntityData();
      },
      // 选择主体列表
      showEntityTable() {
        this.isEntityTableShow = true;
        this.entityData.search = "";
        this.entityType = "";
        this.listEntityData();

      },
      hideEntityTable() {
        this.isEntityTableShow = false;
      },

      handleCurrentChange(currentRow,oldCurrentRow) {
        this.isShowBtn = false;
        this.punishData.entityId = currentRow.id;
        this.punishData.entityName = currentRow.entityName;
        this.punishData.entityType = currentRow.entityType;
        this.punishData.entityTypeStr = currentRow.entityTypeStr;
        this.punishData.creditCode = currentRow.creditCode;
        this.punishData.licenseNumber = currentRow.licenseNumber;
        this.punishData.corpName = currentRow.corpName;
        this.punishData.spaceAddr = currentRow.spaceAddr;
      },
      showEntityInfo() {
        this.isEntityInfoShow = true;
        this.isEntityTableShow = false;
      },
      // 处罚文书上传成功后钩子
      handleWritSuccess(response) {
        this.isWritUpload = true;
        this.punishData.punishFileList.push(response.data.id);
        console.log(this.punishData.punishFileList);
      },
      // 证据上传成功后钩子
      handleEvidenceSuccess(response) {
        this.isEvidenceUpload = true;
        this.punishData.punishFileList.push(response.data.id);
        console.log(this.punishData.punishFileList);
      },
      // 上传失败后钩子
      handleError(response) {
        this.$message.error(
          `文件上传失败！`);
      },
      // 超出限制时的钩子
      handleExceed(files, fileList) {
        this.$message.warning(
          `最多可上传 5 个文件， 当前已选择 ${fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        if (file.status != 'ready') {
          return this.$confirm(`确定移除 ${ file.name }？`);
        }
      },
      handleRemove(file, fileList) {
        this.punishData.punishFileList.splice(
          this.punishData.punishFileList.indexOf(file.response.data.id), 1);
      },
      handlePreview(file) {
        let type = file.name.substr(file.name.lastIndexOf('.'));
        let isJPG =
          type === '.png' ||
          type === '.jpg' ||
          type === '.jpeg';
        if (isJPG) {
          this.dialogImageUrl = this.$store.getters.filePath + file.response.data.fileId
          this.dialogVisible = true
        } else {
          let index
          this.handleDownload(file.response.data.fileId, ((index = file.name.lastIndexOf('.')) == -1 ? file.name : file.name.substring(0, index)));
        }
      },
      // 下载文件
      async handleDownload(fileId, fileName) {
        // window.open(downloadFile(fileId, fileName));
        downloadFile(fileId, fileName)
      },
      //判断数组是否包含字符串
      IsInArray(arr,val){
        var testStr=arr.join(",");
        return testStr.indexOf(val)!=-1;
      },
      beforeUpload(file) {
        //类型和大小限制
        var picType = ["doc","jpg","png","pdf"];
        var testmsg=file.name.substring(file.name.lastIndexOf('.')+1).toLowerCase();
        if(!this.IsInArray(picType,testmsg)){
          this.$message.warning(`仅可上传jpg，png，doc，pdf格式的图片`);
          return false;
        }
        if(file.size/1024/1024>10){
          this.$message.warning(`上传图片大小不能超过10M`);
          return false;
        }
      },

    },
    components: {
      YbPopup,
      ToggleForm,
      Back
    },
    data() {
      var checkEntityData = (rule, value, callback) => {
        if (!this.isEntityInfoShow) {
          callback(new Error('请选择主体信息'));
        } else {
          callback();
        }
      };
      var checkWrit = (rule, value, callback) => {
        if (!this.isWritUpload) {
          callback(new Error('请上传处罚文书附件'));
        } else {
          callback();
        }
      };
      var checkEvidence = (rule, value, callback) => {
        if (!this.isEvidenceUpload) {
          callback(new Error('请上传证据附件'));
        } else {
          callback();
        }
      };
      return {

        entityType: "",
        isWritUpload: false,
        isEvidenceUpload: false,
        isEntityTableShow: false,
        isShowBtn: true,
        isEntityInfoShow: false,
        punishData: {
          entityId: "",
          entityName: "",
          entityType: [],
          creditCode: "",
          licenseNumber: "",
          corpName: "",
          spaceAddr: "",
          source: "",
          illegal: "",
          punishInfo: "",
          valueMoney: "",
          type: "",
          punishMoney: "",
          punishTime: "",
          punishFileNo: "",
          punishPerson: [],
          punishFileList: [],
        },
        page: {
          pageSize: 8,
          pageNum: 1,
          total: 0
        },

        entityTypeList: [],
        sourceList: [],
        punishTypeList: [],
        punishPersonList: [],

        //列表数据
        tableData: [],
        entityData: {
          search: "",
          entityTypes: []
        },
        dialogImageUrl: '',
        dialogVisible: false,
        fileLimit: 5,

        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },

        rules: {
          entity: [
            {validator: checkEntityData, message: '请选择主体信息', trigger: 'blur'}
          ],
          illegal: [
            {required: true, message: '请输入违法事实', trigger: 'blur'}
          ],
          valueMoney: [
            {validator: floatValidNotRequired, trigger: 'blur', message: '请输入正确的金额值'}
          ],
          punishMoney: [
            {validator: floatValidNotRequired, trigger: 'blur', message: '请输入正确的金额值'}
          ],
          punishInfo: [
            {required: true, message: '请输入处罚详情', trigger: 'blur'}
          ],
          punishFile: [
            {required: true, message: '请输入处罚文书名', trigger: 'blur'}
          ],
          punishFileNo: [
            {required: true, message: '请输入处罚文书编号', trigger: 'blur'}
          ],
          source: [
            {required: true, message: '请选择线索来源', trigger: 'change'}
          ],
          type: [
            {required: true, message: '请选择处罚类型', trigger: 'change'}
          ],
          punishTime: [
            {required: true, message: '请选择执法时间', trigger: 'change'}
          ],
          punishPerson: [
            {type:'array',required: true, message: '请至少选择一个执法人员', trigger: 'change'}
          ],
          writ: [
            {validator: checkWrit, message: '请上传处罚文书附件', trigger: 'blur'}
          ],
          evidence: [
            {validator: checkEvidence, message: '请上传证据附件', trigger: 'blur'}
          ]
        }
      }
        ;
    }
  }
</script>

<style lang="sass">
#popup table .current-row td{
  color: #0DB5EF;
}
</style>


<style lang="scss" scoped>
  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
  }

  .li-bott span {
    color: #393939;
  }

  .tab-box .tab-bott {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 2px;
    background: #ebf1f5;
  }

  .ipt-btn-box {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9a9a9a;
    text-align: center;
  }

  .tab-box a {
    color: #9a9a9a;
    width: 100%;
    height: 100%;
    display: inline-block;
  }

  .tab-box a span {
    float: right;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0db5ef;
    z-index: 666;
    position: relative;
  }

  .li-bott a {
    color: #393939;
  }

  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;

    font-size: 15px;
    color: #9a9a9a;
    text-align: center;
  }

  .li-bott span {
    color: #393939;
  }

  .tab-box .tab-bott {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 2px;
    background: #ebf1f5;
  }

  .ipt-btn-box {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .table-div {
    width: 100%;
    text-align: center;
  }

  .operate-a {
    color: #1787ad;
  }

  table tr td:last-child .cell a {
    border-right: 1px solid #ccc;
    padding-right: 5px;
  }

  table tr td:last-child .cell a:last-child {
    border-right: none;
    padding-right: 0px;
  }

  .mainbody {
    margin-left: 20px;
    margin-bottom: 30px;
    background: #eff7f9;
    border: 1px solid #c2eaf8;
    padding: 10px;
    width: 720px;
    color: #1fabdc;
    position: relative;

    .form-item {
      margin: 10px 0;
      display: inline-block;
      width: 350px;

      .title {
        width: 100px;
        display: inline-block;
        text-align: right;
      }
    }
    .close {
      position: absolute;
      right: 20px;
      top: 10px;
      font-size: 16px;
      color: #1fabdc;
      cursor: pointer;
      font-weight: bolder;
    }
  }

  .modal{
    width: 100%;
    height: 100%;
    position: fixed;
    left:0;
    top: 0;
    z-index: 998;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,.5);

  }
  .bigImg{
    min-width: 450px;
    max-width: 80%;
  }

  .content{
    padding-left: 220px;
  }
</style>
