<template>
  <div>
    <el-button class="w140 mt30" type="primary" v-if="$route.query.stateType=='add'" :disabled="boxShow" @click="boxShowFun(true)">添加最新检验报告</el-button>
    <div class="newBox mt20" v-if="boxShow">
      <h3>
        <span class="movePoin">最新检验信息</span>
        <i class="el-icon-close movePoin" @click="close"></i>
      </h3>
      <el-form label-width="130px" class="demo-ruleForm labW150">
        <div class="content">
          <div class="row">
            <el-form-item label="检验报告编号：">
              <el-input placeholder="请输入检验报告编号" maxlength="30" class="w180" v-model="newDatas.number"></el-input>
              <b v-if="type=='edit'">(必填)</b>
            </el-form-item>
            <el-form-item label="检验类别：">
              <el-input placeholder="请输入检验类别" maxlength="30" class="w180" v-model="newDatas.type"></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="检验结论：">
              <el-input placeholder="请输入检验结论" maxlength="30" class="w180" v-model="newDatas.verdict"></el-input>
              <b v-if="type=='edit'">(必填)</b>
            </el-form-item>
            <el-form-item label="检验日期：">
              <el-date-picker value-format="yyyy-MM-dd" class="sleq padRightNo w180" type="date" :editable="false" placeholder="选择检验日期"
                v-model="newDatas.inspectDate" :picker-options="dailyInspectDate"></el-date-picker>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="下次检验日期：">
              <el-date-picker value-format="yyyy-MM-dd" class="sleq padRightNo w180" type="date" @focus="dateFocus" :editable="false" placeholder="选择下次检验日期"
                :readonly="!newDatas.inspectDate" v-model="newDatas.nextInspectDate" :picker-options="dailyNextInspectDate">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="检验单位名称：">
              <el-input placeholder="请输入检验单位名称" maxlength="30" class="w180" v-model="newDatas.inspectName"></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="检验机构核准证：">
              <el-input placeholder="请输入检验机构核准证" maxlength="30" class="w180" v-model="newDatas.inspectLicence"></el-input>
            </el-form-item>
            <el-form-item label="检验人员：">
              <el-input placeholder="请输入检验人员姓名" maxlength="30" class="w180" v-model="newDatas.inspectPerson"></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="问题描述：">
              <el-input placeholder="请输入问题描述，300字以内" maxlength="300" type="textarea" rows="5" class="w300"
                v-model="newDatas.problems"></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="检验备注：">
              <el-input placeholder="请输入检验备注，300字以内" maxlength="300" type="textarea" rows="5" class="w300"
                v-model="newDatas.remark"></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="文档附件：">
              <el-upload class="upload-demo" action="/api/upload" :on-success="fileSuccess"
                :data="{type: 'TZSB_INSPECT_REPORT'}" multiple :limit="5" :on-exceed="handleExceed" :file-list="fileList"
                :on-error="uploadError" :on-remove="handleRemove" :before-upload="flieBeforeUpload">
                <el-button size="small" type="">点击上传</el-button>
                <b slot="tip" class="ml20 el-upload__tip" style="position: inherit;">最多上传5个文件，文件格式：pdf，doc，docx</b>
              </el-upload>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="图片附件：">
              <el-upload class="upload-demo" action="/api/upload" :data="{type:'TZSB_INSPECT_REPORT'}"
                list-type="picture-card" :on-preview="handlePictureCardPreview" :on-success="handleAvatarSuccess"
                :file-list="imgFileList" :on-error="uploadError" :on-exceed='maxLimit' :limit="20" :before-upload="beforeAvatarUpload"
                :on-remove="handleImgRemove">
                <i class="el-icon-plus"></i>
                <p style="color: #A2AAB6;font-size:14px;position: absolute;width: 150px;margin-top: -120px;height: 130px;">点击上传</p>
              </el-upload>
              
              <el-dialog :visible.sync="dialogVisible" size="tiny">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
              <div class="mt10" style="color:#A2AAB6;font-size:12px;">
                <p>图片格式：png，jpg，jpeg</p>
                <p>图片大小：每张图片小于10M</p>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <el-form  v-if="$route.query.stateType!='add'" label-width="130px" class="demo-ruleForm labW150">
      <div class="content">
        <div class="row">
          <el-form-item label="检验报告编号：">
            {{newDatas.number?newDatas.number:'无'}}
          </el-form-item>
          <el-form-item label="检验类别：">
            {{newDatas.type?newDatas.type:'无'}}
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="检验结论：">
            {{newDatas.verdict?newDatas.verdict:'无'}}
          </el-form-item>
          <el-form-item label="检验日期：">
            {{newDatas.inspectDate?newDatas.inspectDate:'无'}}
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="下次检验日期：">
            {{newDatas.nextInspectDate?newDatas.nextInspectDate:'无'}}
          </el-form-item>
          <el-form-item label="检验单位名称：">
            {{newDatas.inspectName?newDatas.inspectName:'无'}}
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="检验机构核准证：">
            {{newDatas.inspectLicence?newDatas.inspectLicence:'无'}}
          </el-form-item>
          <el-form-item label="检验人员：">
            {{newDatas.inspectPerson?newDatas.inspectPerson:'无'}}
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="问题描述：">
            {{newDatas.problems?newDatas.problems:'无'}}
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="检验备注：">
            {{newDatas.remark?newDatas.remark:'无'}}
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="文档附件：">
            <div v-if="newDatas.documentList&&newDatas.documentList.length>0">
              <p class="movePoin" style="text-decoration: underline;color: #0db5ef" v-for="item in newDatas.documentList" :key="item.id"
                @click="downloadFile(item.fileId,item.fileName)">
                {{item.fileName}}</p>
            </div>
            <span v-else>无</span>
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="图片附件：">
            <div v-if="newDatas.picList.length>0">
              <img style="width: 150px;height:150px;margin-left: 10px;" v-for="item in newDatas.picList" :key="item.id" 
                   :src="$store.getters.filePath + item.fileId" :alt="item.fileName" @click="imgLook(item)">
            </div>
            <span v-else>无</span>
            <el-dialog :visible.sync="dialogVisible" size="tiny">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { downloadFile } from 'api/common'
  export default {
    props: {
      newDatas: {
        default: function () {
          return {}
        }
      },
      type: {
        default: function () {
          return 'edit'
        }
      }
    },
    data() {
      return {
        fileList: [],
        boxShow: false,
        imgFileList: [],
        dialogImageUrl: '',
        dialogVisible: false,
        dailyInspectDate: {
          disabledDate: (time) => {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        dailyNextInspectDate: {
          disabledDate: (time) => {
            let endDate = new Date(this.newDatas.inspectDate);
            if (this.newDatas.inspectDate) {
              let b = (time.getTime() + 86400000) < endDate
              return b;
            }
          }
        },
      }
    },
    mounted() {
    },
    methods: {
      downloadFile(fileId, name) {
        downloadFile(fileId, name)
      },
      boxShowFun(b){
        this.newDatas.documentFileId = [];
        this.newDatas.pictureFileId = [];
        this.boxShow = b;
        this.$emit('boxShowFun',b)
      },
      close(){
         this.$confirm('是否确认关闭，关闭之后输入的检验信息将全部清空！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.boxShow = false;
          this.$emit('boxShowFun', false)
          this.$emit('empty')
        })
      },
      dateFocus() {
        if (!this.newDatas.inspectDate) {
          this.$message.warning('请先选择检验日期');
        }
      },
      fileSuccess(file) {
        this.$message.success('上传成功');
        this.newDatas.documentFileId.push(file.data.id);
        this.fileList.push(file.data.id);
      },
      handleExceed(files, fileList) {
        this.$message.warning("最多上传5个文件");
      },
      //图片上传失败
      uploadError() {
        this.$message.error('图片上传失败！');
      },
      handleRemove(file, fileList) {
        this.newDatas.documentFileId.splice(this.newDatas.documentFileId.indexOf(file), 1);
        this.fileListDatas.splice(this.newDatas.documentFileId.indexOf(file), 1);
      },
      flieBeforeUpload(file) {
        let fileType = file.name.slice(file.name.length - 3, file.name.length);
        if (fileType !== 'doc' && fileType !== 'ocx' && fileType !== 'pdf'&&fileType !== 'DOC' && fileType !== 'OCX' && fileType !== 'PDF') {
          this.$message.error('请上传正确格式的文件(文件格式：docx，doc，pdf)')
          return false;
        }
      },
      //点击已上传的文件链接预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      imgLook(item){
        this.dialogImageUrl = this.$store.getters.filePath + item.fileId;
        this.dialogVisible = true;
        setTimeout(() => {
          document.getElementsByClassName('v-modal')[0].click()
        }, 0);
      },
      //上传图片成功提示
      handleAvatarSuccess(file) {
        if (file.status) {
          this.$message.success('上传成功');
          this.newDatas.pictureFileId.push(file.data.id);
          this.imgFileList.push(file.data.id);
        }
      },
      maxLimit(files, fileList) {
        // 上传数量限制
        this.$message.warning('最多上传20张图片!');
      },
      //上传图片
      beforeAvatarUpload(file) {
        let fileType = file.type.split("/")[1];
        if (fileType !== 'png' && fileType !== 'jpg' && fileType !== 'jpeg') {
          this.$message.error('请上传正确格式的图片(图片格式：png，jpg，jpeg)')
          return false;
        }
      },
      handleImgRemove(file, fileList) {
        this.newDatas.pictureFileId.splice(this.newDatas.pictureFileId.indexOf(file), 1);
        this.imgFileList.splice(this.newDatas.pictureFileId.indexOf(file), 1);
      },
    },
  }
</script>

<style scoped lang="sass">
  .content{
    margin: 20px auto;
    width: 870px;
  }
  .w140{
    width: 140px;
  }
  .mt30{
    margin-top: 30px;
  }
  .newBox{
    background:rgba(242,245,248,1);
    border:1px solid rgba(194,202,210,1);
    h3{
      font-weight: 100;
      font-size:18px;
      margin: 20px 0 0 30px;
      color: #6D7787;
      i{
        font-size: 20px;
        font-weight: 700;
        float: right;
        margin-right: 20px;
      }
    }
  }
  .w180{
    width: 180px;
  }
  .row b {
    position: absolute;
    font-weight: 100;
    font-size: 12px;
    color: #A2AAB6;
    top: 0px;
    right: -45px;
  }
</style>