<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>编辑人员</span>
      <Back></Back>
    </div>
    <el-form :model="userForm" :rules="userRules" ref="userForm" label-width="100px">
      <div class="form-box">
        <el-form-item label="所属部门:">
          <el-input class="w200 " v-model="dept.deptName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名:" prop="realName">
          <el-input class="w200 " v-model="userForm.realName" prop placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phoneNumber">
          <el-input class="w200" v-model="userForm.phoneNumber" placeholder="请输入手机号"></el-input>
          <span class="tip">手机号可用于登录</span>
        </el-form-item>
        <el-form-item label="所属部门:" prop="subDeptId">
          <el-select v-model="userForm.subDeptId" placeholder="请选择直属部门" clearable>
            <el-option
              v-for="items in DeptList"
              :key="items.id"
              :label="items.name"
              :value="items.id">
            </el-option>
          </el-select>
          <span class="tip">(选填)</span>
        </el-form-item>
        <el-form-item label="职务:" prop="postId">
          <el-select v-model="userForm.postId" placeholder="请选择职务" clearable>
            <el-option
              v-for="items in PostList"
              :key="items.id"
              :label="items.name"
              :value="items.id">
            </el-option>
          </el-select>
          <span class="tip">(选填)</span>
        </el-form-item>
        <el-form-item label="胸牌编号:" prop="userNumber">
          <el-input class="w200" v-model="userForm.userNumber" placeholder="例如:9527X"></el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="userRoles">
          <el-checkbox-group v-model="userForm.userRoles" class="w250">
            <el-checkbox-button v-for="role in roles" :label="role.id" :key="role.id">{{role.name}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <div class="foot-btn">
        <div>
          <el-button @click="goBack">取消</el-button>
          <el-button type="primary" @click="submitForm('userForm')">保存</el-button>
        </div>
      </div>
    </el-form>

  </div>
</template>


<script>
  import Back from 'utils/back.vue'; //返回上一个页面按钮

  import {getDeptAndRoles, getUserInfo, updateUser} from 'api/support/organize';
  import {phoneValid} from 'utils/validate'
  import * as organizeApi from 'api/support/organize';

  export default {
    created() {

    },
    mounted() {
      const userId = this.$route.query.id;
      this.getDeptList();
      this.getPostList();
      getUserInfo(userId).then((result) => {
        this.userForm = result.data;
        getDeptAndRoles(this.userForm.deptId).then((result) => {
          this.dept = result.data;
          this.roles = this.dept.roleList;
        });
        //
      })

    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let form = {

            }
            updateUser(this.userForm).then((result) => {
              if (!result.status) {
                this.$message({
                  message: result.message,
                  type: result.level
                });
                return;
              }
              let msg = '用户' + this.userForm.realName + '修改成功';
              this.$message({
                message: msg,
                type: 'success'
              });
              this.goBack();
            });
          }
        });
      },
      getDeptList() {
        organizeApi.getSubDeptList().then((results) => {
          this.DeptList = results.data
        });
      },
      getPostList() {
        organizeApi.getPostList().then((results) => {
          this.PostList = results.data
        });
      },

    },
    data() {
      return {
        dept: {},
        roles: [],
        checkboxGroup1: ['巡查员'],
        yes: true,
        userForm: {
          realName: '',
          userNumber: '',
          phoneNumber: '',
          userRoles: [],
          deptId: '',
          subDeptId: '',
          postId: '',
          subDepName:'',
          postName:''

        },
        DeptList: {},
        PostList: {},
        userRules: {
          realName: [{
            required: true, message: '请输入姓名', trigger: 'blur'
          }],
          phoneNumber: [{
            required: true, message: '请输入手机号码', trigger: 'blur'
          }, {
            validator: phoneValid, trigger: 'blur'
          }],
          userRoles: [{
            type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change'
          }]
        }
      }
    },
    components: {
      Back
    }
  }
</script>


<style scoped lang="sass">
  .user-box {
    overflow: hidden;
    position: relative;
  }

  .from-box {
    width: 460px;
    margin: 0 auto 80px;
    overflow: hidden;
  }

  /* 修改elementUI的多选框样式 */
  .form-item .el-checkbox-group {
    display: inline-block;
    width: 346px;
    vertical-align: top;
  }

  .form-item label.el-checkbox-button {
    margin: 0 3px 10px 0;
  }

  .el-checkbox-group > label {
    margin-right: 10px;
  }
</style>
