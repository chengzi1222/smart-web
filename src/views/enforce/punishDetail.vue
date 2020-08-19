<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>行政处罚详情</span>
      <back></back>
    </div>

    <div class="right-info">
      <el-form ref="punishData" label-width="110px">
        <!-- 主体基本信息 -->
        <toggle-form title="主体基本信息" name="entityInfo">
          <div class="content">
            <div class="row">
              <el-form-item label="主体名称:" prop="entityName" >
                {{ punishData.entityName }}
              </el-form-item>
              <el-button @click="ifType(punishData.entityId,punishData.entityParentType,punishData.entityType)">进入该主体档案</el-button>
            </div>
            <div>
              <el-form-item label="主体类型:" prop="entityTypeStr">
                {{ punishData.entityTypeStr }}
              </el-form-item>
              <el-form-item label="统一信用代码:" prop="creditCode">
                {{ punishData.creditCode?punishData.creditCode:"无" }}
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="许可备案号:" prop="licenseNumber">
                {{ punishData.licenseNumber?punishData.licenseNumber:"无" }}
              </el-form-item>
              <el-form-item label="法人:" prop="corpName">
                {{ punishData.corpName?punishData.corpName:"无" }}
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="经营场所地址:" prop="spaceAddr">
                {{ punishData.spaceAddr }}
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 处罚信息 -->
        <toggle-form title="处罚信息" required name="punishInfo">
          <div class="content">
            <div class="row">
              <el-form-item label="线索来源:" prop="source" class="wordBreak">
                {{ punishData.sourceStr }}
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="违法事实:" prop="illegal" class="wordBreak">
                {{ punishData.illegal }}
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="货值金额:" prop="valueMoney">
                {{ punishData.valueMoney }} 元
              </el-form-item>
              <el-form-item label="处罚金额:" prop="punishMoney">
                {{ punishData.punishMoney }} 元
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="处罚类型:" prop="punishType">
                {{ punishData.typeStr }}
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="处罚单位:" prop="type">
                {{ punishData.punishDeptName }}
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="处罚详情:" prop="punishInfo"  class="wordBreak">
                {{ punishData.punishInfo }}
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="处罚文书名:" prop="punishTime">
                {{ punishData.punishFile }}
              </el-form-item>
              <el-form-item label="处罚文书编号:" prop="punishFileNo">
                {{ punishData.punishFileNo }}
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="处罚文书附件:">
                <div class="show-success-file">
                  <div class="file-item" v-for="item in punishData.fileList" :key="item.id"
                       :value="item.fileName">
                    <span class="file-name not-pic" @click.stop="handleFile(item)"
                          v-if="item.colu == 'WRIT'">
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
              <el-form-item label="证据附件:">
                <div class="show-success-file">
                  <div class="file-item" v-for="item in punishData.fileList" :key="item.id"
                       :value="item.fileName">
                    <span class="file-name not-pic" @click="handleFile(item)"
                          v-if="item.colu == 'EVIDENCE'">
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
              <el-form-item label="执法人员:" prop="person">
                {{ punishData.person }}
              </el-form-item>
              <el-form-item label="执法日期:" prop="punishTime">
                {{ punishData.punishTime }}
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="录入人员:" prop="entryPerson">
                {{ punishData.entryPersonName }}
              </el-form-item>
              <el-form-item label="录入时间:" prop="createTime">
                {{ punishData.createTime }}
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
  import * as punish from "api/enforce/punish";
  import {dailyEntityPage, downloadFile} from "api/common";
  import ToggleForm from "components/ToggleForm.vue";

  export default {
    async mounted() {
      let id = this.$route.query.id;
      if (!id) {
        return;
      }

      // 行政处罚详情
      punish.getPunishById(id).then(result => {
        this.punishData = result.data;
        this.fileList = result.data.fileList;
      });

      // 图片服务器地址
      punish.getBase().then(result =>{
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
      ifType(entityId,parentType,entityType){
        if (parentType == 'CFDA') {
          this.$router.push({
            name: 'cfda.archives.detail',
            query: {
              id: entityId,
            }
          });
        } else if(parentType == 'ENTITY'){
          this.$router.push({
            name: "subject.archives.detail",
            params: {
              type: entityType
            },
            query: {
              id: entityId,
            }
          })
        }
      },

    },
    components: {
      ToggleForm,
      Back
    },
    data() {
      return {

        filePath: "",
        punishData: "",
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

