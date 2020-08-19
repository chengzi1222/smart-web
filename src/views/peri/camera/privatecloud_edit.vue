<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin:40px auto;width:400px;">
    <el-form-item label="私有云名称:" prop="dhName">
      <el-input v-if="curd != 'detail'" v-model.number="ruleForm.dhName"></el-input>
      <span v-if="curd == 'detail'" class="w200">{{ruleForm.dhName}}</span>
    </el-form-item>
    <el-form-item label="服务器IP:" prop="dhServerIp">
      <el-input v-if="curd != 'detail'" v-model="ruleForm.dhServerIp"></el-input>
      <span v-if="curd == 'detail'" class="w200">{{ruleForm.dhServerIp}}</span>
    </el-form-item>
    <el-form-item label="服务器端口:" prop="dhServerPort">
      <el-input v-if="curd != 'detail'" v-model="ruleForm.dhServerPort"></el-input>
      <span v-if="curd == 'detail'" class="w200">{{ruleForm.dhServerPort}}</span>
    </el-form-item>
    <el-form-item label="账号:" prop="dhUserName">
      <el-input v-if="curd != 'detail'" v-model="ruleForm.dhUserName"></el-input>
      <span v-if="curd == 'detail'" class="w200">{{ruleForm.dhUserName}}</span>
    </el-form-item>
    <el-form-item label="密码:" prop="dhUserPwd">
      <el-input v-if="curd != 'detail'" v-model="ruleForm.dhUserPwd"></el-input>
      <span v-if="curd == 'detail'" class="w200">{{ruleForm.dhUserPwd}}</span>
    </el-form-item>
    <el-form-item>
      <el-button v-if="curd != 'add'" type="primary" @click="goBack()">返回</el-button>
      <el-button v-if="curd == 'add'" @click="resetForm('ruleForm')">重置</el-button>
      <el-button v-if="curd == 'add'" type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button v-if="curd == 'edit'" type="primary" @click="editForm('ruleForm')">编辑</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

  import {add,edit,detail} from "api/peri/privatecloud";

  export default {
    components:{

    },
    data() {
      return {
        ruleForm: {
          dhName: "",
          dhServerIp: "",
          dhServerPort: "",
          dhUserName: "",
          dhUserPwd: ""
        },
        rules: {
          dhName: [
            { required: true, message: '不能为空', trigger: 'blur' },
            {min:1,max:32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
          ],
          dhServerIp: [
            { required: true, message: '不能为空', trigger: 'blur' },
            {min:1,max:32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
          ],
          dhServerPort: [
            { required: true, message: '不能为空', trigger: 'blur' },
            {min:1,max:8, message: '长度在 1 到 8 个字符', trigger: 'blur'}
          ],
          dhUserName: [
            { required: true, message: '不能为空', trigger: 'blur' },
            {min:1,max:32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
          ],
          dhUserPwd: [
            { required: true, message: '不能为空', trigger: 'blur' },
            {min:1,max:32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
          ]
        },
        curd:"",
        cloudId:""
      };
    },
    async mounted(){
      this.curd = this.$route.params.curd;
      //如果不是添加，获取当前id
      if(this.curd != 'add'){
        this.cloudId = this.$route.params.cloudId;
        this.getData(this.cloudId);
      }
    },
    methods: {
      //添加
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            add(this.ruleForm).then(r=>{
              if(r.status){
                this.goBack();
              }
            })
          } else {
            //验证失败....
            return false;
          }
        });
      },
//      //根据Id获取信息
      getData(cloudId){
        detail(cloudId).then(r => {
          this.ruleForm = r.data;
        })
      },
      //添加重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      goBack(){
        this.$router.push({name: 'camera.privatecloud'});
      },
      //编辑保存
      editForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = this.ruleForm;
            edit(params).then(r => {
              if(r.status){
                this.$message.success("编辑成功")
                this.goBack();
              }
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
