<template>
  <el-form :model="formdata" :rules="rules2" ref="formdata" label-width="110px">
    <toggle-form title="任务内容">
      <div class="content">
        <div class="row clear_a">
          <el-form-item label="任务名称:" prop="taskName">
            <el-tooltip class="item" effect="dark" content="最多可输入100个字符" placement="right">
              <el-input placeholder="请输入任务名称" class="w250 seekIpt" v-model="formdata.taskName" :maxlength="100"></el-input>
            </el-tooltip>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="预警级别:" prop="taskLevel">
            <div style="width:595px;">
              <enum-select v-model="formdata.taskLevel" enum="com.ybveg.govx.enums.medi.WarningLevelEnum" placeholder="请选择预警级别"></enum-select>
            </div>
          </el-form-item>
        </div>

        <div class="row clear_a">
          <el-form-item label="企业形态:" prop="enterpriseFormList">
            <el-checkbox-group v-model="formdata.enterpriseFormList" size="large" :disabled="enterpriseFormDisabled">
              <el-checkbox-button v-for="item in enterpriseForm.resData" :label="item.key" :key="item.key" @change="handleEnterpriseForm">{{item.name}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </div>

        <div class="row clear_a">
          <el-form-item label="预警信息:" prop="warningInfo">
            <div class="clear_a">
              <el-tooltip class="item" effect="dark" content="请输入预警信息最多可输入5000个字符" placement="right">
                <el-input v-model="formdata.warningInfo" type="textarea" :rows="10" class="w400" placeholder="请输入预警信息" :maxlength="5000">
                </el-input>
              </el-tooltip>
            </div>
          </el-form-item>
        </div>

        <div class="row clear_a">
          <el-form-item label="相关连接:" prop="url">
            <el-tooltip class="item" effect="dark" content="最多可输入255个字符" placement="right">
              <el-input placeholder="请输入相关连接" class="w250 seekIpt" v-model="formdata.url" :maxlength="255"></el-input>
            </el-tooltip>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="相关文件:" prop="fileList">
            <el-upload class="upload-demo" action="/api/upload" :data="{type: 'WARNING_TASK'}" :on-preview="handlePreview" :on-error="handleError"
              :on-success="handleSuccess" :on-remove="handleRemove" :before-remove="beforeRemove" :before-upload="beforeUpload"
              :limit="fileLimit" :on-exceed="handleExceed">
              <el-button size="small" type="primary">点击上传</el-button>
              <span style="color: #A2AAB6;font-size:12px;margin-left: 20px;">只能上传jpg/png/doc/pdf文件，且不超过10M，最多可上传5个文件</span>
            </el-upload>
            <div v-if="dialogVisible" class="modal" @click.stop="dialogVisible = false;">
              <img class="bigImg" :src="dialogImageUrl" alt="">
            </div>
          </el-form-item>
        </div>
      </div>
      <!-- 底部按钮taskBase -->
      <div class="foot-btn" style="z-index:1">
        <div>
          <el-button type="default" @click="goBack">取消并返回</el-button>
          <el-button type="primary" @click="confirmWarningTask">预览并发布</el-button>
        </div>
      </div>
    </toggle-form>

    <popupBody v-if="isShow" class="mT-50" :width="700" :top="110">
      <p class="popTit">
        <span>预览</span>
        <span @click="isShow = false" style="float: right"><i class="el-icon-close"></i></span>
      </p>
      <div class="contBox">
        <taskInfo :taskInfo="preView"></taskInfo>
      </div>
      <div class="botBox">
        <div class="bt-bt">
          <el-button @click="isShow = false" class="w100">取 消</el-button>
          <el-button @click="saveWarningTask" class="w100" type="primary">确认并发布</el-button>
        </div>
      </div>
    </popupBody>
  </el-form>
</template>


<script>
  import ToggleForm from 'components/ToggleForm'
  import { downloadFile, getEnums } from 'api/common';
  import EnumSelect from 'components/common/EnumSelect'
  import { addWarningTask } from 'api/warning/warning'
  import { checkUrl } from 'utils/validate'
  import taskInfo from "./taskInfo.vue";
  import popupBody from 'components/popup/popupform';


  export default {
    components: {
      ToggleForm,
      EnumSelect,
      taskInfo,
      popupBody,
    },
    async mounted() {
      this.listEnterpriseForm()
      this.setlistTaskLevel()
      this.pathFile = this.$store.getters.filePath;
    },
    data() {
      let checkEnterpriseForm = (rule, value, callback) => {
        if (!this.isEnterpriseFormSelected) {
          callback(new Error('请选择企业类型'));
        } else {
          callback();
        }
      };
      return {
        isShow: false,
        pathFile: "",
        formdata: {
          taskName: "",
          taskLevel: "",
          warningInfo: "",
          url: "",
          enterpriseFormList: [],
          fileList: [],
          info: "",
        },
        preView: {
          taskName: "",
          taskLevel: "",
          warningInfo: "",
          url: "",
          enterpriseFormList: "",
          fileList: [],
          info: "",
          isOpen: false,
          isToLong: false
        },
        isListEnterpriseForm: true,
        dialogVisible: false,
        fileList2: [],
        enterpriseFormDisabled: false,
        isEnterpriseFormSelected: false,
        enterpriseForm: {
          arr: [],
          resData: []
        },
        listTaskLevel: [],
        isFileUpload: false,
        fileLimit: 5, //限制文件上传的个数
        showBigPic: -1,//是否展示大图
        uploadArr: [],//上传成功的图片数组
        rules2: {
          taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }],
          warningInfo: [{ required: true, message: '请输入预警信息', trigger: 'change' }],
          taskLevel: [{ required: true, message: '请输入预警级别', trigger: 'change' }],
          enterpriseFormList: [
            { validator: checkEnterpriseForm, message: '请选择企业形态', trigger: 'change' }
          ],
          url: [
            { validator: checkUrl, message: '请输入正确的链接', trigger: 'change' }
          ]
        },
      }
    },
    props: {
      backData: Object
    },
    methods: {
      saveWarningTask() {
        this.$confirm('是否确认添加预警任务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          //保留格式
          this.formdata.warningInfo = this.replaceTextarea(this.formdata.warningInfo)
          addWarningTask(this.formdata).then(result => {
            if (!result.status) {
              this.$message({
                message: result.message,
                type: result.level
              });
              return;
            }
            this.$message({
              message: '提交保存成功!',
              type: 'success'
            });
            this.$router.push({ name: "warning" });
          })
        })
      },
      copyDate() {
        let enter = ''
        this.preView.taskName = this.formdata.taskName
        this.preView.taskLevel = this.formdata.taskLevel
        this.preView.url = this.formdata.url
        this.preView.fileList = this.formdata.fileList
        if (this.formdata.warningInfo.length > 120) {
          this.preView.info = this.replaceTextarea(this.formdata.warningInfo.substring(0, 120))
          this.preView.isOpen = true
          this.preView.isToLong = true
        } else {

          this.preView.info = this.replaceTextarea(this.formdata.warningInfo)
          this.preView.isOpen = false
          this.preView.isToLong = false
        }
        this.preView.warningInfo = this.replaceTextarea(this.formdata.warningInfo)
        this.enterpriseForm.resData.forEach(s => {
          this.formdata.enterpriseFormList.forEach(l => {
            if (l === s.key) {
              enter = enter + " " + s.name
            }
          })
        })
        this.preView.enterpriseForm = enter
        this.listTaskLevel.forEach(s => {
          if (s.key === this.formdata.taskLevel) {
            this.preView.taskLevel = s.name
          }
        })
      },
      confirmWarningTask() {
        this.$refs["formdata"].validate((valid) => {
          if (valid) {
            this.copyDate()
            this.isShow = true
          } else {
            return false;
          }
        });
      },
      replaceTextarea(str) {
        str = str.replace(/\r\n/g, '<br/>'); //IE9、FF、chrome
        str = str.replace(/\n/g, '<br/>'); //IE7-8
        str = str.replace(/\s/g, '&nbsp;'); //空格处理
        return str;
      },
      goBack() {
        this.$confirm('是否确认取消添加预警任务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$router.go(-1)
        })
      },
      setlistTaskLevel() {
        let enmus = ["com.ybveg.govx.enums.medi.WarningLevelEnum"];
        getEnums(enmus).then(result => {
          this.listTaskLevel = result.data;
        })
      },
      listEnterpriseForm() {
        let enmus = ["com.ybveg.govx.enums.medi.EnterpriseFormEnum"];
        getEnums(enmus).then(result => {
          if (this.isListEnterpriseForm) {
            this.enterpriseForm.resData = result.data;
          }
        })
      },
      showFileList(val) {
        for (let i = 0; i < val.length; i++) {
          this.fileList2.push({ name: val[i].fileName, url: this.pathFile + val[i].fileId });
        }
      },
      handleEnterpriseForm() {
        let enterpriseForm = this.formdata.enterpriseFormList;
        if (enterpriseForm.length === 0) {
          this.isEnterpriseFormSelected = false;
        } else {
          this.isEnterpriseFormSelected = true;
        }
      },
      // 相关文件上传成功后钩子
      handleSuccess(response) {
        this.isFileUpload = true;
        response.data.ext = response.data.fileName.split(".")[1]
        this.formdata.fileList.push(response.data);
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
        if (file.status !== 'ready') {
          return this.$confirm(`确定移除 ${file.name}？`);
        }
      },
      handleRemove(file, fileList) {
        console.log(file)
        for (let i = 0; i < this.formdata.fileList.length; i++) {
          let id = this.formdata.fileList[i].id;
          if (file.response && id === file.response.data.id) {
            this.formdata.fileList.splice(i, 1);
            break;
          }
        }
      },
      handlePreview(file) {
        let type = file.name.substr(file.name.lastIndexOf('.'));
        let isJPG =
          type === '.png' ||
          type === '.jpg' ||
          type === '.jpeg';
        if (isJPG) {
          this.dialogVisible = true;
          if (this.pageStatus === 'BACK' || this.pageStatus === 'EDITBACK') {
            this.dialogImageUrl = this.pathFile + file.url;
          } else if (this.pageStatus === 'EDIT') {
            this.dialogImageUrl = file.url;
          } else {
            this.dialogImageUrl = this.pathFile + file.response.data.fileId;
          }
        } else {
          this.handleDownload(file);
        }
      },

      // 下载文件
      async handleDownload(file) {
        // window.open(downloadFile(file.response.data.fileId, file.response.data.fileName.substring(0, file.response.data.fileName.lastIndexOf(file.response.data.ext) - 1)))
        downloadFile(file.response.data.fileId, file.response.data.fileName.substring(0, file.response.data.fileName.lastIndexOf(file.response.data.ext) - 1))
      },
      //判断数组是否包含字符串
      IsInArray(arr, val) {
        var testStr = arr.join(",");
        return testStr.indexOf(val) != -1;
      },
      beforeUpload(file) {
        //类型和大小限制
        var picType = ["doc", "jpg", "png", "pdf"];
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
        if (!this.IsInArray(picType, testmsg)) {
          this.$message.warning(`仅可上传jpg，png，doc，pdf格式的图片`);
          return false;
        }
        if (file.size / 1024 / 1024 > 10) {
          this.$message.warning(`上传图片大小不能超过10M`);
          return false;
        }
      },
    },
    computed: {
      filePath() {
        return this.$store.getters.filePath
      },
    },
    watch: {
      formdata: {
        handler() {
          console.log(this.formdata.warningInfo.split("\n").length)
        }
      },
      deep: true
    }
  }
</script>

<style lang="scss" scoped>
  .row .el-form-item {
    margin-right: 0 !important;
  }

  .taskarea .el-tag {
    display: inline-block !important;
    margin: 10px 10px 10px 0;
    height: auto;
    padding: 5px;
  }

  .contBox {
    width: 100%;
    margin-top: 20px;
    height: 480px;
    overflow-y: auto;
  }

  .contBox .el-form-item {
    padding-right: 30px;
  }

  .content {
    width: 710px;
    min-height: 800px;
    margin: 20px auto;
  }

  .row {
    margin-bottom: 5px;
  }

  .botBox {
    text-align: right;
    margin-top: 30px;
    padding: 0 40px 0 0;
  }

  .modal {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 998;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, .5);
  }

  .bigImg {
    min-width: 450px;
    max-width: 80%;
  }

  el-checkbox-button {
    min-width: 200px;
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
</style>