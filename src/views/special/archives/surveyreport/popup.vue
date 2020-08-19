<template>
  <div class="addpopup popIn">
    <div class="addDiv">
      <p class="addTit">
        <span class="ml20">{{titleName}}</span>
        <i class="el-icon-close floatR movePoin" @click="$emit('popupShowHiden')"></i>
      </p>
      <div style="max-height: 520px;overflow:auto;">
        <div class="iptP mt30">
          <div class="iptDiv">
            <span>设备注册代码：</span><s>{{datas.entityRegisterCode?datas.entityRegisterCode:'无'}}</s>
          </div>
          <div class="iptDiv">
            <span>使用登记证号：</span><s>{{datas.entityRegisterCardNo?datas.entityRegisterCardNo:'无'}}</s>
          </div>
        </div>
        <div class="iptP mt30">
          <div class="iptDiv">
            <span>使用单位名称：</span><s>{{datas.entityEmployName?datas.entityEmployName:'无'}}</s>
          </div>
          <div class="iptDiv" v-show="$route.name == 'specialElevator_Surveyreport_indexTable'">
            <span>楼盘名称：</span><s>{{datas.entityBuildingName?datas.entityBuildingName:'无'}}</s>
          </div>
          <div class="iptDiv" v-if="$route.name != 'specialElevator_Surveyreport_indexTable'">
            <span>单位内部编号：</span><s>{{datas.entityNo?datas.entityNo:'无'}}</s>
          </div>
        </div>
        <div class="iptP mt30">
          <div class="iptDiv" v-show="$route.name == 'specialElevator_Surveyreport_indexTable'">
            <span>单位内部编号：</span><s>{{datas.entityNo?datas.entityNo:'无'}}</s>
          </div>
          <div class="iptDiv">
            <span>设备名称：</span><s>{{datas.entityName?datas.entityName:'无'}}</s>
          </div>
          <div class="iptDiv" v-if="$route.name != 'specialElevator_Surveyreport_indexTable'"></div>
        </div>
        <div class="iptP mt20 inputPadd5" :class="status?'colorNo':''">
          <div class="iptDiv">
            <span>检验报告编号：</span>
            <el-input v-if="status" placeholder="请输入检验报告编号" maxlength="30" class="w162" v-model="datas.number">
            </el-input>
            <b v-if="status">(必填)</b>
            <i v-else>{{datas.number?datas.number:'无'}}</i>
          </div>
          <div class="iptDiv">
            <span>检验类别：</span>
            <el-input v-if="status" placeholder="请输入检验类别" class="w162" maxlength="16" v-model="datas.type"></el-input>
            <i v-else>{{datas.type?datas.type:'无'}}</i>
          </div>
        </div>
        <div class="iptP mt20" :class="status?'colorNo':''">
          <div class="iptDiv inputPadd5">
            <span>检验结论：</span>
            <el-input v-if="status" placeholder="请输入检验结论" maxlength="30" class="w162" v-model="datas.verdict">
            </el-input>
            <b v-if="status">(必填)</b>
            <i v-else>{{datas.verdict?datas.verdict:'无'}}</i>
          </div>
          <div class="iptDiv">
            <span>检验日期：</span>
            <el-date-picker v-if="status" value-format="yyyy-MM-dd" class="sleq padRightNo mr10 w162" type="date"
              v-model="datas.inspectDate" :picker-options="dailyInspectDate"></el-date-picker>
            <i v-else>{{datas.inspectDate?datas.inspectDate:'无'}}</i>
          </div>
        </div>
        <div class="iptP mt20" :class="status?'colorNo':''">
          <div class="iptDiv">
            <span>下次检验日期：</span>
            <el-date-picker v-if="status" value-format="yyyy-MM-dd" class="sleq padRightNo mr10 w162" type="date"
              @focus="dateFocus" :readonly="!datas.inspectDate" v-model="datas.nextInspectDate"
              :picker-options="dailyNextInspectDate"></el-date-picker>
            <i v-else>{{datas.nextInspectDate?datas.nextInspectDate:'无'}}</i>
          </div>
          <div class="iptDiv inputPadd5">
            <span>检验单位名称：</span>
            <el-input v-if="status" placeholder="请输入检验单位名称" maxlength="30" class="w162" v-model="datas.inspectName">
            </el-input>
            <i v-else>{{datas.inspectName?datas.inspectName:'无'}}</i>
          </div>
        </div>
        <div class="iptP mt20 inputPadd5" :class="status?'colorNo':''">
          <div class="iptDiv">
            <span>检验机构核准证：</span>
            <el-input v-if="status" placeholder="请输入检验机构核准证" maxlength="30" class="w162" v-model="datas.inspectLicence">
            </el-input>
            <i v-else>{{datas.inspectLicence?datas.inspectLicence:'无'}}</i>
          </div>
          <div class="iptDiv">
            <span>检验人员：</span>
            <el-input v-if="status" placeholder="请输入检验人员姓名" maxlength="30" class="w162" v-model="datas.inspectPerson">
            </el-input>
            <i v-else>{{datas.inspectPerson?datas.inspectPerson:'无'}}</i>
          </div>
        </div>
        <div class="mt20" :class="status?'colorNo':''" style="margin-left: 62px;">
          <div class="iptDiv inputPadd5" style="max-width: 100%;margin-left: -20px;">
            <span>问题描述：</span>
            <el-input v-if="status" placeholder="请输入问题描述，300字以内" maxlength="300" type="textarea" rows="5" class="w312"
              v-model="datas.problems"></el-input>
            <i style="max-width: 80%" v-else>{{datas.problems?datas.problems:'无'}}</i>
          </div>
        </div>
        <div class="mt20" :class="status?'colorNo':''" style="margin-left: 62px;">
          <div class="iptDiv inputPadd5" style="max-width: 100%;margin-left: -20px;">
            <span>检验备注：</span>
            <el-input v-if="status" placeholder="请输入检验备注，300字以内" maxlength="300" type="textarea" rows="5" class="w312"
              v-model="datas.remark"></el-input>
            <i style="max-width: 80%" v-else>{{datas.remark?datas.remark:'无'}}</i>
          </div>
        </div>
        <div class="mt20" :class="status?'colorNo':''" style="margin-left: 62px;">
          <div class="iptDiv" style="max-width: 100%;width:100%;margin-left: -20px;">
            <span>相关文件：</span>
            <el-upload v-if="status" class="upload-demo" style="width:40%" action="/api/upload"
              :on-success="fileSuccess" :data="{type: 'TZSB_INSPECT_REPORT'}" multiple :limit="5"
              :on-exceed="handleExceed" :file-list="fileList" :on-error="uploadError" :on-remove="popuptype == 'edit'?handleRemove:addHandleRemove"
              :before-upload="flieBeforeUpload">
              <el-button size="small" type="" v-if="popuptype == 'edit'">继续上传</el-button>
              <el-button size="small" type="" v-else>点击上传</el-button>
              <b slot="tip" style="right: 200px;" class="el-upload__tip">最多上传5个文件,文件格式:pdf,word(doc,docx)</b>
            </el-upload>
            <div style="margin: -20px 0 0 130px;" v-else>
              <p class="movePoin" style="text-decoration: underline;color: #0db5ef" v-for="item in fileList" :key="item.id" @click="downloadFile(item.fileId,item.name)">
                {{item.name}}</p>
            </div>
          </div>
        </div>
        <div class="mt20" :class="status?'colorNo':''" style="margin-left: 62px;">
          <div class="iptDiv" style="max-width: 100%;margin-left: -20px;">
            <span>上传照片：</span>
            <el-upload v-if="status" class="upload-demo" action="/api/upload" :data="{type:'TZSB_INSPECT_REPORT'}" multiple
              list-type="picture-card" :on-preview="handlePictureCardPreview" :on-success="handleAvatarSuccess"
              :file-list="imgFileList" :on-error="uploadError" :on-exceed='maxLimit' :limit="20"
              :before-upload="beforeAvatarUpload" :on-remove="popuptype == 'edit'?handleImgRemove:addHandleImgRemove">
              <i class="el-icon-plus"></i>
              <p style="color: #A2AAB6;font-size:14px;position: absolute;width: 150px;margin-top: -120px;height: 130px;">点击上传</p>
            </el-upload>
            <div v-else>
              <img style="width: 150px;height:150px;margin-left: 10px;" v-for="item in imgFileList" :key="item.id"
                :src="item.url" :alt="item.name" @click="imgShow(item.url)">
            </div>

            <el-dialog :visible.sync="dialogVisible" size="tiny">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <div class="mt10" v-if="status" style="color:#A2AAB6;font-size:12px;margin-left: 135px;">
              <p>图片格式：png，jpg，jpeg</p>
              <p>图片大小：每张图片小于10M</p>
              <p>此项为选填项</p>
            </div>
          </div>
        </div>
      </div>
      <div class="btnDiv mb20" v-if="status">
        <el-button @click="$emit('popupShowHiden')">取消</el-button>
        <el-button type="primary" v-if="popuptype == ''" :disabled="addStatus" class="mr20" @click="add">确定</el-button>
        <el-button type="primary" v-else :disabled="addStatus" class="mr20" @click="update">确定</el-button>
      </div>
      <div class="btnDiv mb20" v-else>
        <el-button class="mr20" @click="$emit('popupShowHiden')">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { getReportFind, postReportEdit, postReportAdd } from "api/special/elevator";
  import { downloadFile } from 'api/common'

  export default {
    props: {
      popuptype: {
        default: function () {
          return ''
        }
      },
      name: {
        default: function () {
          return ''
        }
      },
      status: {
        default: function () {
          return true
        }
      },
      reportId: {
        default: function () {
          return ''
        }
      },
      equipmentData: {
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        subName: '',
        titleName: '',
        datas: {},
        addStatus: false,
        fileList: [],
        fileListDatas: [],
        dialogImageUrl: '',
        dialogVisible: false,
        imgFileList: [],
        imgFileListDatas: [],
        removeFile: [],
        dailyInspectDate: {
          disabledDate: (time) => {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        dailyNextInspectDate: {
          disabledDate: (time) => {
            let endDate = new Date(this.datas.inspectDate);
            if (this.datas.inspectDate) {
              let b = (time.getTime() + 86400000) < endDate
              return b;
            }
          }
        },
      }
    },
    mounted() {
      if (this.name != '') {
        this.titleName = this.name
      } else if (this.popuptype == 'edit') {
        this.titleName = '编辑';
      } else if (this.popuptype == 'info') {
        this.titleName = '详情';
      } else {
        this.titleName = '添加';
      }
      if (this.reportId != '') {
        getReportFind({ reportId: this.reportId }).then(r => {
          this.datas = r.data;
          for (let i = 0; i < r.data.documentList.length; i++) {
            this.fileList.push({
              name: r.data.documentList[i].fileName,
              // url: `http://fs-local.ybveg.com/fdfs/${r.data.documentList[i].fileId}`,
              url: this.$store.getters.filePath + r.data.documentList[i].fileId,
              id: r.data.documentList[i].id,
              fileId: r.data.documentList[i].fileId
            });
            this.fileListDatas.push(r.data.documentList[i].id);
          }
          for (let i = 0; i < r.data.picList.length; i++) {
            this.imgFileList.push({
              name: r.data.picList[i].fileName,
              // url: `http://fs-local.ybveg.com/fdfs/${r.data.picList[i].fileId}`,
              url: this.$store.getters.filePath + r.data.picList[i].fileId,
              id: r.data.picList[i].id
            });
            this.imgFileListDatas.push(r.data.picList[i].id);
          }
        })
      } else {
        this.datas.entityRegisterCode = this.equipmentData.registerCode;
        this.datas.entityRegisterCardNo = this.equipmentData.registerCardNo;
        this.datas.entityEmployName = this.equipmentData.employName;
        this.datas.entityBuildingName = this.equipmentData.buildName;
        this.datas.entityNo = this.equipmentData.insideNumber;
        this.datas.entityName = this.equipmentData.entityName;
      }
    },
    methods: {
      downloadFile(fileId, name) {
        downloadFile(fileId, name)
      },
      imgShow(url) {
        this.dialogImageUrl = url;
        this.dialogVisible = true;
        setTimeout(() => {
          document.getElementsByClassName('v-modal')[0].click()
        }, 0);
      },
      add() {
        if (!this.datas.number) {
          this.$message.error('检验报告编号不能为空');
          return
        }
        if (!this.datas.verdict) {
          this.$message.error('检验结论不能为空');
          return
        }
        let params = {
          entityId: this.equipmentData.id,
          number: this.datas.number,
          verdict: this.datas.verdict,
          type: this.datas.type,
          inspectDate: this.datas.inspectDate,
          nextInspectDate: this.datas.nextInspectDate,
          inspectName: this.datas.inspectName,
          inspectLicence: this.datas.inspectLicence,
          inspectPerson: this.datas.inspectPerson,
          problems: this.datas.problems,
          remark: this.datas.remark,
          documentFileId: this.fileListDatas,
          pictureFileId: this.imgFileListDatas
        }
        postReportAdd(params).then(r => {
          if (r.status) {
            this.$message.success('添加成功');
            this.$emit('popupShowHiden')
          }
        })
      },
      update() {
        this.addStatus = true;
        this.datas.pictureFileId = this.imgFileListDatas;
        this.datas.documentFileId = this.fileListDatas;
        this.datas.deleteFileId = this.removeFile;
        this.datas.id = this.reportId;
        postReportEdit(this.datas).then(r => {
          this.addStatus = false;
          if (r.status) {
            this.$message.success('编辑成功')
            this.$emit('popupShowHiden');
          }
        })
      },
      dateFocus() {
        if (!this.datas.inspectDate) {
          this.$message.warning('请先选择检验日期');
        }
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning("做多上传5个文件");
      },
      handleRemove(file, fileList) {
        if (this.fileList.indexOf(file)>=0) { 
          this.removeFile.push(this.fileListDatas[this.fileList.indexOf(file)]);
          this.fileListDatas.splice(this.fileList.indexOf(file), 1);
          this.fileList.splice(this.fileList.indexOf(file), 1);
        } else if (this.fileList.indexOf(file.response.data.id) >= 0){
          this.removeFile.push(this.fileListDatas[this.fileList.indexOf(file.response.data.id)]);
          this.fileListDatas.splice(this.fileList.indexOf(file.response.data.id), 1);
          this.fileList.splice(this.fileList.indexOf(file.response.data.id), 1);
        }else {
          return
        }
      },
      addHandleRemove(file, fileList) {
        if (this.fileList.indexOf(file.response.data.id) < 0) { return }
        this.removeFile.push(this.fileListDatas[this.fileList.indexOf(file.response.data.id)]);
        this.fileListDatas.splice(this.fileList.indexOf(file.response.data.id), 1);
        this.fileList.splice(this.fileList.indexOf(file.response.data.id), 1);
      },
      handleImgRemove(file, fileList) {
        if (this.imgFileList.indexOf(file)>=0) {
          this.removeFile.push(this.imgFileListDatas[this.imgFileList.indexOf(file)])
          this.imgFileListDatas.splice(this.imgFileList.indexOf(file), 1);
          this.imgFileList.splice(this.imgFileList.indexOf(file), 1);
        } else if (this.imgFileList.indexOf(file.response.data.id) >= 0) {
          this.removeFile.push(this.imgFileListDatas[this.imgFileList.indexOf(file.response.data.id)])
          this.imgFileListDatas.splice(this.imgFileList.indexOf(file.response.data.id), 1);
          this.imgFileList.splice(this.imgFileList.indexOf(file.response.data.id), 1);
        } else {
          return
        }
      },
      addHandleImgRemove(file, fileList) {
        if (this.imgFileList.indexOf(file.response.data.id) < 0) { return }
        this.removeFile.push(this.imgFileListDatas[this.imgFileList.indexOf(file.response.data.id)])
        this.imgFileListDatas.splice(this.imgFileList.indexOf(file.response.data.id), 1);
        this.imgFileList.splice(this.imgFileList.indexOf(file.response.data.id), 1);
      },
      //点击已上传的文件链接预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        setTimeout(() => {
          document.getElementsByClassName('v-modal')[0].click()
        }, 0);
      },
      //图片上传失败
      uploadError() {
        this.$message.error('图片上传失败！');
      },
      //上传图片
      beforeAvatarUpload(file) {
        let fileType = file.type.split("/")[1];
        if (fileType !== 'png' && fileType !== 'jpg' && fileType !== 'jpeg') {
          this.$message.error('请上传正确格式的图片(图片格式:png,jpg,jpeg)')
          return false;
        }
      },
      flieBeforeUpload(file) {
        let fileType = file.name.slice(file.name.length - 3, file.name.length);
        if (fileType !== 'doc' && fileType !== 'ocx' && fileType !== 'pdf') {
          this.$message.error('请上传正确格式的图片(图片格式:pdf,word(doc,docx))')
          return false;
        }
      },
      maxLimit(files, fileList) {
        // 上传数量限制
        this.$message.warning('最多上传20张图片!');
      },
      //上传图片成功提示
      handleAvatarSuccess(file) {
        if (file.status) {
          this.$message.success('上传成功');
          this.imgFileList.push(file.data.id);
          this.imgFileListDatas.push(file.data.id);
        }
      },
      fileSuccess(file) {
        this.$message.success('上传成功');
        this.fileList.push(file.data.id);
        this.fileListDatas.push(file.data.id);
      }
    },
    computed: {
      inspectDate() {
        return this.datas.inspectDate
      }
    },
    watch: {
      inspectDate() {
        if (!this.datas.inspectDate) {
          this.datas.nextInspectDate = ''
        }
      }
    }
  }
</script>

<style scoped lang="sass">
  .addpopup {
    position: fixed;
    background: rgba(0, 0, 0, .5);
    z-index: 99;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
  }

  .addDiv {
    width: 780px;
    position: absolute;
    top: 10%;
    left: 50%;
    margin-left: -390px;
    background: #fff;
  }

  .addTit {
    height: 40px;
    line-height: 40px;
    background: #F2F5F8;

    i {
      font-size: 16px;
      margin-top: 12px;
      margin-right: 7px;
    }
  }

  .w162 {
    width: 162px !important;
  }

  .w312 {
    width: 312px;
  }

  .mt30 {
    margin-top: 30px;
  }

  .iptP {
    display: flex;
    justify-content: space-evenly;
  }

  .iptDiv {
    min-width: 320px;
    max-width: 320px;
    display: inline-block;
    position: relative;

    span {
      display: inline-block;
      width: 130px;
      text-align: right;
      font-size: 14px;
      color: #6D7787;
      vertical-align: top;
    }

    b {
      position: absolute;
      font-weight: 100;
      font-size: 12px;
      color: #A2AAB6;
      top: 9px;
      right: -45px;
    }

    i {
      font-style: normal;
      display: inline-block;
      max-width: 185px;
      word-wrap: break-word;
    }
    s{
      text-decoration: none;
      display: inline-block;
      width: 190px;
    }
  }

  .btnDiv {
    margin-top: 40px;
    text-align: right;
  }

  .upload-demo {
    display: inline-block;

    b {
      right: -140px;
      top: 0;
    }
  }
  .colorNo{
    span{
      color: #393939;
    }
  }
</style>