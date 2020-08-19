<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b><span>人员详情</span><Back></Back>
    </div>
    <el-form :model="userForm" :rules="userRules" ref="userForm" label-width="100px">
      <div class="from-box">

        <div class="form-item">
          <span class="input-t">所属部门:</span>
          <span class="w125">成都市食药局</span>
        </div>
        <el-form-item label="姓名:" prop="realName">
          <el-input class="w125 " v-model="userForm.realName" prop placeholder="请输入姓名"  ></el-input>
        </el-form-item>
        <el-form-item label="用户名:" prop="userName">
          <el-input class="w150 " v-model="userForm.userName" prop placeholder="请输入用户名"  ></el-input>
          <span class="tip">用户名可用于登录</span>
        </el-form-item>
        <el-form-item label="手机号:" prop="phoneNumber">
          <el-input class="w150" v-model="userForm.phoneNumber" placeholder="请输入手机号"></el-input>
          <span class="tip">手机号可用于登录</span>
        </el-form-item>
        <el-form-item label="胸牌编号:" prop="userNumber">
          <el-input class="w150" v-model="userForm.userNumber" placeholder="例如:9527X"></el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="userRoles">
          <el-checkbox-group v-model="userForm.userRoles"  class="w250">
            <el-checkbox-button v-for="role in roles" :label="role.id" :key="role.id" >{{role.name}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <div class="foot-btn">
        <div>
          <el-button>取消</el-button>
          <el-button type="primary" @click="submitForm('userForm')">保存</el-button>
        </div>
      </div>
    </el-form>

  </div>
</template>


<script>
  import Back from 'utils/back.vue'; //返回上一个页面按钮

  import{getDeptAndRoles,getUserInfo,addUser} from 'api/support/organize';
  import{phoneValid,userNameValid} from 'utils/validate'

  export default {
    mounted(){
      this.userForm.deptId = this.$route.params.id;
      getDeptAndRoles(this.$route.params.id).then((result) => {
        this.dept = result.data;
        this.roles = this.dept.roleList;
      })
    },
    methods: {
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid){
            addUser(this.userForm).then(()=>{
              let msg = '用户' + this.userForm.userName + '已添加成功,初始密码为:111111';
              this.$message({
                message:msg,
                type: 'success'
              });
              this.$router.push({path:'/support/organize'});
            });
          }
        });
      },
      resetForm(){

      }

    },
    data() {

      return {
        dept:{
        },
        roles:[],
        checkboxGroup1: ['巡查员'],
        cities: cityOptions,
        yes:true,
        userForm:{
          userName:'',
          realName:'',
          userNumber:'',
          phoneNumber:'',
          userRoles:[],
          deptId:''
        },
        userRules:{
          userName:[
            {
              required: true,message: '请输入用户名', trigger: 'blur'
            },{
              validator:userNameValid,trigger:'blur'
            }
          ],
          realName:[{
            required: true,message: '请输入姓名', trigger: 'blur'
          }],
          phoneNumber:[{
            required: true,message: '请输入手机号码', trigger: 'blur'
          },{
            validator:phoneValid,trigger:'blur'
          }],
          userRoles:[{
            type:'array',required: true,message: '请至少选择一个角色', trigger: 'change'
          }]
        }
      }
    },
    components:{
      ElForm, Back
    }
  }
</script>


<style scoped lang="sass">
  .user-box{
    overflow:hidden;
    position: relative;
  }

  .from-box{
    width: 460px;
    margin: 0 auto 80px;
    overflow: hidden;
  }

  /* 修改elementUI的多选框样式 */
  .form-item .el-checkbox-group{
    display: inline-block;
    width: 346px;
    vertical-align: top;

  }
  .form-item label.el-checkbox-button{
    margin:0 3px 10px 0;
  }

</style>


