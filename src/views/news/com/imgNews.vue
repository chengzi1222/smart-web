<template>
  <div class="right-info">
    <el-form label-width="130px" class="demo-ruleForm" :model="dto" :rules="rules" ref="ruleForm">
      <!-- 基本信息 -->
      <toggle-form title="基本信息">
        <div class="content">
          <div class="row">
            <el-form-item label="标题：" prop="title">
              <el-input v-model="dto.title" class="w250" placeholder="请输入资讯标题">
              </el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="发布部门：" prop="pubDeptName">
              <el-input v-model="dto.pubDeptName" placeholder="请输入发布部门">
              </el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="封面：">
              <el-upload :file-list="photo" action="/api/newsUpload/img" list-type="picture-card" :on-success="uploadSuccess" :on-error="uploadError"
                :data="{type:'NEWS',field:'PHOTO'}" :before-upload="beforeAvatarUpload" :on-preview="handlePictureCardPreview"
                :on-remove="removePic" :limit="dto.bigYes == 'YES' ? 1 : 3" :on-exceed="overflow">
                <i class="el-icon-plus"></i>
              </el-upload>
              <div v-if="dialogVisible" class="modal" @click.stop="dialogVisible = false;">
                <img :src="imageUrl" alt="">
              </div>
              <p class="bz" style="margin-top: 10px;">图片格式：png，jpg，jpeg</p>
              <p class="bz">图片大小：每张图片小于4M</p>
              <p class="bz">大图资讯仅限上传1张封面，支持1张或3张封面图片在APP显示</p>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="是否大图：">
              <el-switch v-model="dto.bigYes" active-color="#0DB5EF" inactive-color="#E7ECF2" active-value="YES" inactive-value="NO">
              </el-switch>
              <span class="bz">放心食安公示端和管理端不支持多封面及大图模式</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="是否发布：">
              <el-switch v-model="dto.pubYes" active-color="#0DB5EF" inactive-color="#E7ECF2" active-value="YES" inactive-value="NO">
              </el-switch>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="请选择资讯标签：" prop="newsTypeId">
              <el-select v-model="dto.newsTypeId" placeholder="请选择资讯标签" class="w250">
                <el-option v-for="item in typeFlag.array" :key="item.id" :label="item.type_name" :value="item.id" class="w250">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="发布端类型:" prop="releaseTypeList">
              <el-checkbox-group v-model="dto.releaseTypeList" size="large">
                <el-checkbox-button v-for="item in releaseTypeEnumList" :label="item.key" :key="item.key">{{item.name}}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </div>
      </toggle-form>
    </el-form>
    <!-- 巡查项 -->
    <toggle-form title="资讯内容">
      <div class="editorBox">
        <editor-demo @EditorChange="editHmtl" :resetHtml="resetHtml" @getPicIdToParent="getPicIdFromChild"></editor-demo>
      </div>
    </toggle-form>
    <!--浮动的保存按钮层-->
    <div class="foot-btn">
      <div>
        <el-button @click="backList();">返回</el-button>
        <el-button type="primary" @click="sumbit('ruleForm');" v-if="submitYes == 'YES'">保存</el-button>
        <el-button type="primary" @click="sumbit('ruleForm');" v-else disabled>保存</el-button>
      </div>
    </div>
    <br/><br/><br/><br/><br/><br/><br/>
  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import EditorDemo from "components/EditorDemo.vue";
  import * as newsApi from 'api/news/news';
  import { getEnums } from 'api/common.js';
  export default {
    components: {
      ToggleForm, EditorDemo
    },
    props: ['newsTypeList', 'editInfo'],
    mounted() {
      this.typeFlag.array = this.newsTypeList;
      if (this.newsTypeList != null && this.newsTypeList.length > 0) {
        this.defaultNewsType();
      }
      this.submitYes = 'YES';
      getEnums(['com.ybveg.govx.enums.newscenter.NewsReleaseType'], false).then(r => {
        if (r.status) {
          this.releaseTypeEnumList = r.data
        } else {
          this.$message.warning(r.message)
        }
      })
    },
    watch: {
      newsTypeList(val) {
        this.typeFlag.array = val;
        this.defaultNewsType();
      },
      editInfo(val) {
        this.editInfoData = val;
        if (val.isEdit) { // 如果是编辑
          let tmpFlag = "@#";
          this.dto = val.detail;
          this.dto.picIdList = [];
          this.dto.delFileIdList = [];
          let fileId = "";
          if (this.dto.imgurls && this.dto.imgurls.length > 0) {
            for (let i = 0; i < this.dto.imgurls.length; i++) {
              if (this.dto.imgurls[i].indexOf(tmpFlag) != -1) {
                // 只回显大图
                if (this.dto.imgurls[i].split(tmpFlag)[1] === 'NEWSBIG') {
                  fileId = this.dto.imgurls[i].split(tmpFlag)[0];
                  this.photo.push({ url: this.pathFile + fileId }); // 只作显示作用，不参与逻辑判断这里给个url连接地址就行了
                  this.picList.push({ fileId: fileId, url: this.pathFile + fileId, tmpNewsId: this.dto.id });
                }
              }
            }
          }
          this.resetHtml = val.detail.content; //设置富文本编辑框内容
          this.editHmtl(this.resetHtml); //设置富文本编辑框内容

        }
      }
    },
    methods: {
      sumbit(formName) {
        this.submitYes = '';
        if (!this.validateForm()) {
          this.submitYes = 'YES';
          return false;
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let formData = {
              newsJson: JSON.stringify(this.dto)
            };
            // 提交添加资讯
            if (!this.editInfo.isEdit) {
              newsApi.add(formData).then((r) => {
                if (r.status) {
                  this.$message.success('资讯添加成功！');
                  this.backList();
                }
                this.submitYes = 'YES';
              });
            } else {
              //必须先删除imgurls,否则在controller中转为dto时报错！
              delete this.dto.imgurls;
              formData = {
                newsJson: JSON.stringify(this.dto)
              };
              // 提交编辑资讯
              newsApi.edit(formData).then((r) => {
                if (r.status) {
                  this.$message.success("资讯编辑成功！");
                  this.backList();
                }
                this.submitYes = 'YES';
              });
            }
          } else {
            console.log('表单验证出错!');
            this.submitYes = 'YES';
            return false;
          }
        });
      },

      validateForm() {
        let dto = this.dto;
        if (!dto.content) {
          this.$message.error("请输入资讯内容");
          return false;
        }
        if (dto.content.length > 20000) {
          this.$message.error("资讯内容不能超过20000个字符");
          return false;
        }
        if (!this.picList || this.picList.length == 0) {
          this.$message.error("必须上传资讯图片！");
          return false;
        }
        if (dto.bigYes == 'YES' && this.picList.length > 1) {
          this.$message.error("大图资讯只能上传1张图片，请删除多余图片后再保存！");
          return false;
        }
        if (dto.bigYes == 'NO' && this.picList.length > 3) {
          this.$message.error("非大图资讯最多只能上传3张图片！");
          return false;
        }
        if (dto.releaseTypeList.length <= 0) {
          this.$message.error("发布端类型不能为空");
          return false;
        }
        return true;
      },
      editHmtl(html) {
        this.dto.content = html;
        //console.log(html,8888)
      },

      // 设置默认的值
      defaultNewsType() {
        this.dto.newsTypeId = this.typeFlag.array[0].id;
      },
      //图片上传成功
      uploadSuccess(response, file, fileList) {
        let picFileList = response.data.fileList; //返回的本批次图片文件字段集合
        if (picFileList && picFileList.length > 0) {
          // 将本次上传成功的图片
          let fileId = picFileList[0].fileId;//只看本批次图片的第一张
          let tmpNewsId = picFileList[0].tmpNewsId; //本批次图片的批次id
          this.picObjList = this.picObjList.concat(picFileList); //每次上传成功，都将picFileList数组合并到this.picObjList中去
          for (let i = 0; i < picFileList.length; i++) {
            this.dto.picIdList.push(picFileList[i].id); //将本批次图片的id存入this.dto.picIdList;
          }
          this.imageUrl = file.url;
          this.addPic = false;
          this.picList.push({ fileId: fileId, url: file.url, tmpNewsId: tmpNewsId });
          this.$message.success('图片上传成功！');
        } else {
          this.uploadError();
        }
      },
      //图片上传失败
      uploadError() {
        this.$message.error('图片上传失败！');
      },
      overflow() {
        let bigyes = this.dto.bigYes;
        if (bigyes == 'YES') {
          this.$message.error('大图资讯最多传1张封面！');
        } else {
          this.$message.error('非大图资讯最多传3张封面！');
        }
      },
      // 返回列表页
      backList() {
        this.$router.push({ name: 'news.list', query: { tab_type: 'newsTable' } });
      },
      //图片上传前判断图片类型
      beforeAvatarUpload(file) {
        const type = file.type;
        if (['image/png', 'image/jpg', 'image/jpeg'].indexOf(type) == -1) {
          this.$message.error('请选择png、jpg、jpeg格式的图片！');
          return false
        }
      },
      //点击已上传的文件链接放大图片
      handlePictureCardPreview(file) {
        this.imageUrl = file.url;
        this.dialogVisible = true;
      },
      //删除图片
      removePic(file, fileList) {
        const url = file.url;
        for (let i = 0; i < this.picList.length; i++) {
          let obj = this.picList[i];
          //应该删除本批次图片
          if (obj.url == url) {
            let tmpNewsId = obj.tmpNewsId; //要删除的批次id
            let tempArr = []; //返回的图片文件对象数组
            let tempIdArr = []; //返回的图片文件id数组
            for (let m = 0; m < this.picObjList.length; m++) {
              if (this.picObjList[m].tmpNewsId != tmpNewsId) { //找到批次id
                tempArr.push(this.picObjList[m]);
                tempIdArr.push(this.dto.picIdList[m])
              }
            }
            this.picObjList = tempArr;
            this.dto.picIdList = tempIdArr;
            this.dto.delFileIdList.push(obj.fileId);
            // 在picList中删除
            this.picList.splice(i, 1);
            break;
          }
        }
      },
      //获得富文本编辑器上传的图片文件的id,并添加到this.dto.picIdList中去
      getPicIdFromChild(data) {
        if (!data) {
          return;
        }
        this.dto.picIdList.push(data);
      }
    },
    data() {
      return {
        releaseTypeEnumList: [],
        pathFile: this.$store.getters.filePath,
        submitYes: 'YES',
        editInfoData: {},
        resetHtml: "",
        picObjList: [],
        dto: {
          title: "",
          pubDeptName: this.$store.getters.user.deptName,
          bigYes: 'NO',
          pubYes: 'YES',
          viewType: 'PICWORD',
          newsTypeId: '',
          picIdList: [], //与本主体关联的资讯图片id
          delFileIdList: [],
          releaseTypeList: []
        },
        typeFlag: {
          array: [],
          id: ''
        },
        imageUrl: "",
        photo: [], //图片
        picList: [],  //存图片相关的内容
        dialogVisible: false,
        rules: {
          title: [
            { required: true, message: '请输入资讯标题', trigger: 'blur' },
            { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
          ],
          pubDeptName: [
            { required: true, message: '请输入发布部门', trigger: 'blur' },
            { min: 3, max: 32, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          newsTypeId: [
            { required: true, message: '请选择资讯标签', trigger: 'change' }
          ]
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bz {
    line-height: 20px;
    font-size: 12px;
    color: #A2AAB6;
  }

  /** 图片上传*/
  .upload-pic {
    border: 1px solid #cbcbcb;
    width: 130px;
    height: 130px;
    border-radius: 6px;
    margin-left: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    color: #fff;
    background: #0DB5EF;
    font-size: 18px;
    margin-bottom: 5px;
  }

  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }

  .modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    display: flex;
    justify-content: center;
    align-items: center;
    .big-img {
      min-width: 30%;
      max-width: 800px;
      max-height: 500px;
    }
  }
</style>
