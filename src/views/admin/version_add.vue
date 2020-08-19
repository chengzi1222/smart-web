<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin:40px auto;width:400px;">
    <el-form-item label="更新版本:" prop="code">
      <el-input v-if="curd != 'detail'" v-model.number="ruleForm.code"></el-input>
      <span v-if="curd == 'detail'" class="w200">{{ruleForm.code}}</span>
    </el-form-item>
    <el-form-item label="展示版本:" prop="version">
      <el-input v-if="curd != 'detail'" v-model="ruleForm.version"></el-input>
      <span v-if="curd == 'detail'" class="w200">{{ruleForm.version}}</span>
    </el-form-item>
    <el-form-item label="更新平台:" prop="type">
      <enum-select v-if="curd != 'detail'" style="width: 300px;" v-model="ruleForm.type" enum="com.ybveg.govx.enums.VersionTypeEnum"></enum-select>
      <span v-if="curd == 'detail'" class="w200">{{ruleForm.typeStr}}</span>
    </el-form-item>
    <el-form-item label="更新标题:" prop="title">
      <el-input v-if="curd != 'detail'" v-model="ruleForm.title"></el-input>
      <span v-if="curd == 'detail'" class="w200">{{ruleForm.title}}</span>
    </el-form-item>
    <el-form-item label="是否强制更新:" prop="isNecessary">
      <enum-select v-if="curd != 'detail'" style="width: 300px;" v-model="ruleForm.isNecessary" enum="com.ybveg.govx.enums.TrueFalseEnum"></enum-select>
      <span v-if="curd == 'detail'" class="w200">{{ruleForm.isNecessaryStr}}</span>
    </el-form-item>
    <el-form-item label="更新内容:" prop="message">
      <el-input v-if="curd != 'detail'" type="textarea" v-model="ruleForm.message" ></el-input>
      <span v-if="curd == 'detail'" class="w200">{{ruleForm.message}}</span>
    </el-form-item>
    <el-form-item label="更新地址:" prop="upUrl">
      <el-input v-if="curd != 'detail'" type="textarea" v-model="ruleForm.upUrl" ></el-input>
      <span v-if="curd == 'detail'" class="w200">{{ruleForm.upUrl}}</span>
    </el-form-item>
    <el-form-item>
      <el-button v-if="curd == 'add'" @click="resetForm('ruleForm')">重置</el-button>
      <el-button v-if="curd == 'add'" type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button v-if="curd == 'edit'" type="primary" @click="editForm('ruleForm')">编辑</el-button>
      <el-button v-if="curd != 'add'" type="primary" @click="goBack()">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

  import EnumSelect from 'components/common/EnumSelect.vue';
  import {addVersion,getVersion,editVersion} from "api/admin/version";

  export default {
    components:{
      EnumSelect
    },
    data() {
      return {
        ruleForm: {
          code: "",
          version: "",
          title: "",
          message: "",
          address: "",
          isNecessary:"",
          upUrl:"",
          type:"",
          id:""
        },
        rules: {
          code: [
            { required: true, message: '不能为空', trigger: 'blur' },
//            { type: 'number', message: '必须为数字'}
          ],
          version: [
            { required: true, message: '不能为空', trigger: 'blur' },
          ],
          title: [
            { required: true, message: '不能为空', trigger: 'blur' },
          ],
          message: [
            { required: true, message: '不能为空', trigger: 'blur' },
          ],
          upUrl: [
            { required: true, message: '不能为空', trigger: 'blur' },
          ],
          isNecessary:[
            {required: true, message: '不能为空', trigger: 'change' },
          ],
          type:[
            {required: true, message: '不能为空', trigger: 'change' },
          ],
        },
        curd:"",
        versionId:""
      };
    },
    async mounted(){
      this.curd = this.$route.params.curd;
      //如果不是添加，获取当前id
      if(this.curd != 'add'){
        this.versionId = this.$route.query.versionId;
        this.getData(this.versionId);
      }
    },
    methods: {
      //添加
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addVersion(this.ruleForm).then(r=>{
              this.goBack();
            })
          } else {
            //验证失败....
            return false;
          }
        });
      },
      //根据Id获取信息
      getData(versionId){
          getVersion(this.versionId).then(r => {
            this.ruleForm.code = r.data.code;
            this.ruleForm.version = r.data.version;
            this.ruleForm.title = r.data.title;
            this.ruleForm.message = r.data.message;
            this.ruleForm.address = r.data.address;
            this.ruleForm.isNecessary = r.data.isNecessary;
            this.ruleForm.isNecessaryStr = r.data.isNecessaryStr;
            this.ruleForm.upUrl = r.data.upUrl;
            this.ruleForm.type = r.data.type;
            this.ruleForm.typeStr = r.data.typeStr;
            this.ruleForm.id = r.data.id;
          })
      },
      //添加重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      goBack(){
        this.$router.push({name: 'version'});
      },
      //编辑保存
      editForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = this.ruleForm;
            editVersion(params).then(r => {
              this.goBack();
            })
          } else {
            //验证失败....
            return false;
          }
        });
      }
    }
  }
</script>

<style  scoped>
.selectHeight{
  max-height:40px !important;
  margin-left: 0px !important;
}
</style>
