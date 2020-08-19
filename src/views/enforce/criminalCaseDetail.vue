<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>刑事案件详情</span>
      <back></back>
    </div>

    <div class="right-info">
      <el-form ref="criminalCaseData" label-width="110px">
        <!-- 主体基本信息 -->
        <toggle-form title="主体基本信息" name="entityInfo">
          <div class="content">
            <div class="row">
              <el-form-item label="主体名称:" prop="entityName">
                {{ criminalCaseData.entityName }}
              </el-form-item>
              <el-form-item label="主体类型:" prop="entityTypeStr">
                {{ criminalCaseData.entityTypeStr }}
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="统一信用代码:" prop="creditCode">
                {{ criminalCaseData.creditCode?criminalCaseData.creditCode:"无" }}
              </el-form-item>
              <el-form-item label="许可备案号:" prop="licenseNumber">
                {{ criminalCaseData.licenseNumber?criminalCaseData.licenseNumber:"无" }}
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="法人:" prop="corpName">
                {{ criminalCaseData.corpName?criminalCaseData.corpName:"无" }}
              </el-form-item>
              <el-form-item label="经营场所地址:" prop="spaceAddr">
                {{ criminalCaseData.spaceAddr?criminalCaseData.spaceAddr:"无" }}
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 案件信息 -->
        <toggle-form title="案件信息" required name="caseInfo">
          <div class="content">
            <div class="row">
              <el-form-item label="线索来源:" prop="source">
                {{ criminalCaseData.sourceStr }}
              </el-form-item>
              <el-form-item label="案件性质:" prop="caseProperty">
                {{ criminalCaseData.casePropertyStr }}
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="立案时间:" prop="buildCaseTime">
                {{ criminalCaseData.buildCaseTime }}
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="犯罪事实:" prop="criminalFacts">
                {{ criminalCaseData.criminalFacts }}
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="货值金额:" prop="valueMoney">
                {{ criminalCaseData.valueMoney }} 元
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="判决文书名:" prop="documentName">
                {{ criminalCaseData.documentName }}
              </el-form-item>
              <el-form-item label="判决文书编号:" prop="documentNo">
                {{ criminalCaseData.documentNo }}
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="适用条款:" prop="item">
                {{ criminalCaseData.item }}
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="判决时间:" prop="judgeTime">
                {{ criminalCaseData.judgeTime }}
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="判决内容:" prop="judgeContent">
                {{ criminalCaseData.judgeContent }}
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="判决文书附件:">
                <div class="show-success-file">
                  <div class="file-item" v-for="item in criminalCaseData.fileList" :key="item.id"
                       :value="item.fileName">
                    <span class="file-name not-pic" @click.stop="handleFile(item)"
                          v-if="item.colu == 'JUDGE'">
                      <i class="el-icon-document"/>
                      {{item.fileName}}
                    </span>
                  </div>
                </div>
                <div v-if="dialogVisible" class="modal" @click.stop="dialogVisible = false;">
                  <img class="bigImg"  :src="dialogImageUrl" alt="">
                </div>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="其他附件:">
                <div class="show-success-file">
                  <div class="file-item" v-for="item in criminalCaseData.fileList" :key="item.id"
                       :value="item.fileName">
                    <span class="file-name not-pic" @click="handleFile(item)"
                          v-if="item.colu == 'OTHER'">
                      <i class="el-icon-document"/>
                      {{item.fileName}}
                    </span>
                  </div>
                </div>
                <div v-if="dialogVisible" class="modal" @click.stop="dialogVisible = false;">
                  <img class="bigImg"  :src="dialogImageUrl" alt="">
                </div>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="录入人员:" prop="entryPerson">
                {{ criminalCaseData.entryPersonName }}
              </el-form-item>
              <el-form-item label="录入时间:" prop="createTime">
                {{ criminalCaseData.createTime }}
              </el-form-item>
            </div>

          </div>
        </toggle-form>
      </el-form>
    </div>
    <br/><br/>

    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button type="default" @click="$router.go(-1);">返回</el-button>
      </div>
    </div>

  </div>
</template>

<script>
  import Back from 'utils/back.vue'		//返回上一个页面按钮
  import { getBase } from "api/enforce/punish";
  import * as criminalCase from "api/enforce/criminal_case";
  import { downloadFile} from "api/common";
  import ToggleForm from "components/ToggleForm.vue";

  export default {
    async mounted() {
      let id = this.$route.query.id;
      if (!id) {
        return;
      }

      // 刑事案件详情
      criminalCase.getCriminalCaseById(id).then(result => {
        this.criminalCaseData = result.data;
        this.fileList = result.data.fileList;
      })

      // 图片服务器地址
      getBase().then(result =>{
        this.filePath = result.data.filePath;

      })

    },
    methods: {

      handleFile(file) {
        let type = file.fileName.substr(file.fileName.lastIndexOf('.'));
        let isJPG =
          type === '.png' ||
          type === '.jpg' ||
          type === '.jpeg';
        if (isJPG) {
          this.dialogImageUrl = this.filePath + file.fileId;
          this.dialogVisible = true;
        } else {
          this.handleDownload(file.fileId, file.fileName.substring(0,file.fileName.lastIndexOf('.')));
        }
      },
      // 下载文件
      async handleDownload(fileId, fileName) {
        downloadFile(fileId, fileName);
      },

    },
    components: {
      ToggleForm,
      Back
    },
    data() {
      return {

        filePath: "",
        criminalCaseData: "",
        fileList: [],
        dialogImageUrl: '',
        dialogVisible: false,
      };
    }
  }
</script>

<style scoped lang="sass">

  .li-bott span {
    color: #393939;
  }

  .tab-box .tab-bott {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 2px;
    background: #EBF1F5;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9A9A9A;
    text-align: center;
  }

  .tab-box a {
    color: #9A9A9A;
    width: 100%;
    height: 100%;
    display: inline-block;
  }

  .tab-box a span {
    float: right;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0DB5EF;
    z-index: 666;
    position: relative;
  }

  .li-bott a {
    color: #393939;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;

    font-size: 15px;
    color: #9A9A9A;
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
    background: #EBF1F5;
  }

  table tr td:last-child .cell a {
    border-right: 1px solid #ccc;
    padding-right: 5px;
  }

  table tr td:last-child .cell a:last-child {
    border-right: none;
    padding-right: 0px;
  }

</style>

<style scoped lang="scss">

  .show-success-file {
    .file-item {
      .el-progress {
        display: inline-block;
        width: 130px;
      }
      .file-name {
        cursor: pointer;
        margin-right: 20px;
      }
      span:hover{
        color: #409EFF;
      }
      .not-pic {
        color: #6d7787;
      }
      .delete-btn {
        color: #1787ad;
        cursor: pointer;
      }
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
</style>

