<template>
  <div class="user-box">

    <div class="page-tilt">
      <b></b>
      <span>编辑部门</span>
      <Back></Back>
    </div>
    <div class="form-box">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

        <div class="ipt-box">
          <span class="prompt">父级部门：</span>
          {{parentDept.deptName}}
        </div>

        <el-form-item v-if="showInput.other" label="所属区域:" prop="areaCode">
          <el-select class="w250" v-model="ruleForm.areaCode" disabled placeholder="请选择所属区县">
            <el-option v-for="item in options" :key="item.areaCode" :label="item.areaName" :value="item.areaCode"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="deptNameInput.label" prop="deptName">
          <el-input class='w250' v-model="ruleForm.deptName" placeholder="请填写部门名称"></el-input>
        </el-form-item>

        <el-form-item label="管理账号:" prop="adminName">
          <el-input class='w250' v-model="ruleForm.adminName" placeholder="请填写管理账号"></el-input>
        </el-form-item>

        <el-form-item v-if="showInput.supervisor" label="监督人员:" prop="supervisorId">
          <el-select class="w250" v-model="ruleForm.supervisorId" placeholder="请选择监督人员">
            <el-option v-for="item in supervisorOptions" :key="item.id" :label="item.realName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="showInput.other" label="详细地址:" prop="adds">
          <el-input type="textarea" class='w250 div-ipth120' v-model="ruleForm.adds" placeholder="请填写详细地址"></el-input>
          <span class="w200 tip">请如实填写，系统将自动将地理信息定位到地图系统中</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="foot-btn">
      <div>
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="submitInfo">保存</el-button>
      </div>
    </div>
  </div>
</template>


<script>
  import Back from 'utils/back.vue'		//返回上一个页面按钮
  import { userNameValid } from 'utils/validate'
  import {
    getDeptAndRoles,
    getDeptSubAreaInfoWithNotExitsDeptForThatArea,
    getDdptNameByAreaAndParentDept,
    getDeptAllSubArea,
    editDeptAndDeptAdmin,
    addDeptAndDeptAdmin,
    getUserByDeptId,
    getDeptSddByDeptId
  } from 'api/support/organize';

  export default {
    mounted() {
      this.parentDept.deptId = this.$route.query.parentDeptId;
      this.ruleForm.deptId = this.$route.query.deptId;
      let This = this;
      //获取当前部门父部门信息
      getDeptAndRoles(This.parentDept.deptId).then((result) => {
        This.parentDept.deptName = result.data.deptName;
        this.parentDept.codeLevel = result.data.codeLevel;
        let parentLevel = result.data.codeLevel;
        if (parentLevel == 4) {
          this.showInput.supervisor = true;
          this.showInput.other = false;
          this.deptNameInput.label = "网格名称:";
          this.deptNameInput.text = "请填写网格名称";
          this.rules.supervisorId[0].required = true;
        }
      });

      //获取当前部门信息
      getDeptAndRoles(This.ruleForm.deptId).then((result) => {
        This.ruleForm.deptName = result.data.deptName;
        This.ruleForm.areaCode = result.data.areaCode;
        This.ruleForm.adminName = result.data.adminName;
        This.ruleForm.deptAdmin = result.data.deptAdmin;
        This.ruleForm.adds = result.data.address;
        This.ruleForm.parentDeptId = This.parentDept.deptId;
      });

      getDeptAllSubArea({ parentDeptId: this.parentDept.deptId }).then((result) => {
        This.options = result.data;
      });

      getUserByDeptId(this.parentDept.deptId).then((result) => {
        This.supervisorOptions = result.data;
      });

      getDeptSddByDeptId(this.ruleForm.deptId).then((result) => {
        this.ruleForm.supervisorId = result.data ? result.data.userId : '';
      });



    },
    methods: {
      submitInfo() {
        let This = this;
        // 表单验证方法
        this.$refs.ruleForm.validate(function (result) {
          if (result) {
            // 验证通过
            This.ruleForm.parentDeptId = This.parentDept.deptId;
            editDeptAndDeptAdmin(This.ruleForm).then((result) => {
              if (result.status) {
                this.$message({
                  message: '修改部门和部门管理员成功!',
                  type: 'success'
                });
                This.$router.go(-1);
              } else {
                this.$message({
                  message: ('修改失败' + result.message),
                  type: 'error'
                });
              }
            })

          } else {
            this.$message({
              message: ("请填写完毕所有必填字段!"),
              type: 'warning'
            });
          }
        }.bind(this));
      },

    },
    data() {
      return {
        parentDept: {
          deptId: "",
          deptName: "",
          codeLevel: "",
        },
        mainName: '',
        phone: '',
        number: '',
        date: '',
        sync: false,
        options: [],
        yes: true,
        supervisorOptions: [],
        showInput: {
          supervisor: false,
          other: true
        },
        deptNameInput: {
          label: "部门名称:",
          text: "请填写部门名称"
        },
        ruleForm: {
          areaCode: '',
          deptName: '',
          adds: '',
          adminName: '',
          parentDeptId: '',
          deptId: '',
          supervisorId: ''
        },
        rules: {
          areaCode: [{ required: true, message: '请选择', trigger: 'change' },],
          deptName: [{ required: true, message: '请输入', trigger: 'blur' }],
          supervisorId: [{ requiredrequired: true, message: '请选择', trigger: 'change' }],
          adminName: [
            {
              required: true, message: '请输入', trigger: 'blur'
            },
            {
              validator: userNameValid, trigger: 'blur'
            }
          ],
          adds: [{ required: true, message: '请输入', trigger: 'blur' }]
        }
      }
    },
    components: {
      Back
    }
  }
</script>


<style scoped lang="sass">
</style>