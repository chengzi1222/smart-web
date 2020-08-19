<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin:40px auto;width:400px;">
    <el-form-item label="域名:" prop="domainName">
      <el-input v-model="ruleForm.domainName"></el-input>
    </el-form-item>
    <el-form-item label="全称:" prop="fullName">
      <el-input v-model="ruleForm.fullName"></el-input>
    </el-form-item>
    <el-form-item label="简称:" prop="simpleName">
      <el-input v-model="ruleForm.simpleName"></el-input>
    </el-form-item>
    <el-form-item label="登陆之前背景图:">
      <el-upload
        action="/api/upload"
        :class="beforeList.length === 0 ? '' : 'upload-hide'"
        :show-file-list="true"
        :file-list="beforeList"
        list-type="picture-card"
        :limit="1"
        :data="{'type': 'TEMPLATE'}"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :on-remove="removePic"
        :on-preview="handlePictureCardPreview">
        <i class="el-icon-plus"></i>
      </el-upload>
      <div v-if="dialogVisible" class="modal" @click.stop="dialogVisible = false;">
        <img :src="imageUrl" alt="">
      </div>
    </el-form-item>
    <el-form-item label="登陆之后背景图:">
      <el-upload
        action="/api/upload"
        :class="afterList.length === 0 ? '' : 'upload-hide'"
        :show-file-list="true"
        :file-list="afterList"
        list-type="picture-card"
        :limit="1"
        :data="{'type': 'TEMPLATE'}"
        :on-success="handleAvatarSuccessA"
        :before-upload="beforeAvatarUpload"
        :on-remove="removePicA"
        :on-preview="handlePictureCardPreviewA">
        <i class="el-icon-plus"></i>
      </el-upload>
      <div v-if="dialogVisibleA" class="modal" @click.stop="dialogVisibleA = false;">
        <img :src="imageUrlA" alt="">
      </div>
    </el-form-item>
    <el-form-item>
      <el-button v-if="type == 'add'" @click="resetForm('ruleForm')">重置</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button type="primary" @click="goBack()">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

  import * as home from "api/admin/home";

  export default {
    components:{
      
    },
    data() {
      return {
        ruleForm: {
          id: "",
          domainName: "",
          fullName: "",
          simpleName: "",
          beforeId: "",
          before: {},
          afterId: "",
          after: {}
        },
        beforeList: [],
        afterList: [],
        imageUrl: '',
        dialogVisible: false,
        imageUrlA: '',
        dialogVisibleA: false,
        type: "add",
        rules: {
          domainName: [
            { required: true, message: '域名不能为空', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在1-100之间', trigger: 'blur' },
          ],
          fullName: [
            { max: 100, message: '长度在0-100之间', trigger: 'blur' },
          ],
          simpleName: [
            { max: 100, message: '长度在0-100之间', trigger: 'blur' },
          ]
        }
      }
    },
    async mounted(){
      this.type = this.$route.query.type;
      if (this.type === 'edit') {
        const id = this.$route.query.id;  
        this.detail(id)
      }
    },
    methods: {
      //添加
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.beforeList && this.beforeList.length != 0) {
              this.ruleForm.beforeId = this.beforeList[0].id
            }
            if (this.afterList && this.afterList.length != 0) {
              this.ruleForm.afterId = this.afterList[0].id
            }
            if (this.type === 'add') {
              this.save(this.ruleForm);
            } else if (this.type === 'edit') {
              this.edit(this.ruleForm);
            }
          } else {
            //验证失败....
            return false;
          }
        });
      },
      //根据Id获取信息
      detail(id){
        home.detail({"id": id}).then(r => {
            if (r.status) {
                this.ruleForm = r.data;
                if (this.ruleForm.before) {
                  let file = this.ruleForm.before;
                  file.url = this.$store.getters.filePath + file.fileId
                  this.beforeList.push(file)
                }
                if (this.ruleForm.after) {
                  let file = this.ruleForm.after;
                  file.url = this.$store.getters.filePath + file.fileId
                  this.afterList.push(file)
                }
            } else {
                this.$message.warning(r.message);
            }
        })
      },
      //save
      save(params){
        home.save(params).then(r => {
            if (r.status) {
                this.$message.success("添加成功");
                this.goBack();
            } else {
                this.$message.warning(r.message);
            }
        })
      },
      //edit
      edit(params){
        home.edit(params).then(r => {
            if (r.status) {
                this.$message.success("更新成功");
                this.goBack();
            } else {
                this.$message.warning(r.message);
            }
        })
      },
      //添加重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      goBack(){
        this.$router.push({name: 'home'});
      },
      handleAvatarSuccess(response, file) {
        if (response.status) {
          let { fileId, id } = response.data;
          this.imageUrl = file.url;
          this.beforeList.push({ fileId: fileId, url: file.url , id: id});
          console.log(this.beforeList, this.beforeId, this.imageUrl, this.sign)
          this.$message.success('图片上传成功！');
        } else {
          this.$message.warning('图片上传失败！');
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        return isJPG;
      },
      handlePictureCardPreview(file){
          this.imageUrl = file.url;
          this.dialogVisible = true;
      },
      removePic(file) {
        this.beforeList = [];
        console.log(this.beforeList, this.beforeId, this.imageUrl, this.sign)
      },

      handleAvatarSuccessA(response, file) {
        if (response.status) {
          let { fileId, id } = response.data;
          this.imageUrlA = file.url;
          this.afterList.push({ fileId: fileId, url: file.url , id: id});
          this.$message.success('图片上传成功！');
        } else {
          this.$message.warning('图片上传失败！');
        }
      },
      handlePictureCardPreviewA(file){
          this.imageUrlA = file.url;
          this.dialogVisibleA = true;
      },
      removePicA(file) {
        this.afterList = [];
      }
    }
  }
</script>

<style lang="scss"  scoped>
.selectHeight{
  max-height:40px !important;
  margin-left: 0px !important;
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
  .upload-hide .el-upload{
    display: none;
  }
</style>
