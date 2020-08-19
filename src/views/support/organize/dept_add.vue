<template>
  <div class="user-box">

    <div class="page-tilt">
      <b></b>
      <span>添加部门</span>
      <Back></Back>
    </div>
    <div class="form-box">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

        <div class="ipt-box">
          <span class="prompt">父级部门：</span>
          {{parentDept.deptName}}
        </div>

        <el-form-item v-if="showInput.other" label="所属区域:" prop="areaCode">
          <el-select class="w250" v-model="ruleForm.areaCode" clearable @change="setDeptNameInput" :placeholder="placeholder.areaText">
            <el-option v-for="item in options" :key="item.areaCode" :label="item.areaName" :value="item.areaCode"></el-option>
          </el-select>
          <span class="w200 tip" style="cursor: pointer;" @click="showAddAddrMsg">{{addressMsg}}</span>
        </el-form-item>

        <el-form-item label="所属街道:" v-if="showInput.street">
          <el-input class='w250' v-model="ruleForm.areaName" @blur="areaNameBlur" placeholder="请填写街道名称"></el-input>
          <span class="w200 tip" style="cursor: pointer;" @click="closeAddAddrMsg">x</span>
        </el-form-item>

        <el-form-item :label="deptNameInput.label" prop="deptName">
          <el-input class='w250' v-model="ruleForm.deptName" :placeholder="deptNameInput.text"></el-input>
        </el-form-item>

        <el-form-item label="管理账号:" prop="deptAdmin">
          <el-input class='w250' v-model="ruleForm.deptAdmin" placeholder="请填写管理账号"></el-input>
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
        <el-button type="primary" @click="submitInfo" v-loading="loading" :disabled="loading">保存</el-button>
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
    getCustomDdptNameByAreaAndParentDept,
    addDeptAndDeptAdmin,
    getUserByDeptId
  } from 'api/support/organize';

  export default {
    mounted() {
      this.parentDept.deptId = this.$route.query.id;
      let This = this;
      //获取当前创建部门父部门信息
      getDeptAndRoles(This.parentDept.deptId).then((result) => {
        This.parentDept.deptName = result.data.deptName;
        This.parentDept.codeLevel = result.data.codeLevel;
        This.parentDept.areaCode = result.data.areaCode;
        This.ruleForm.parentAreaCode = result.data.areaCode;
        let parentLevel = This.parentDept.codeLevel;
        if (parentLevel == 3) {
          this.addressMsg = '找不到目标街道?';
          this.placeholder.areaText = "请填写所属街道";
        } else if (parentLevel == 4) {
          this.showInput.street = false;
          this.showInput.supervisor = true;
          this.showInput.other = false;
          this.deptNameInput.label = "网格名称:";
          this.deptNameInput.text = "请填写网格名称";
          this.rules.supervisorId[0].required = true;
        }
        else {
          this.placeholder.areaText = "请填写所属区县";
        }
      });

      getDeptSubAreaInfoWithNotExitsDeptForThatArea(this.parentDept.deptId).then((result) => {
        This.options = result.data;
      });

      getUserByDeptId(this.parentDept.deptId).then((result) => {
        This.supervisorOptions = result.data;
      });
    },
    methods: {

      areaNameBlur() {
        getCustomDdptNameByAreaAndParentDept(
          {
            areaName: this.ruleForm.areaName
          }
        ).then(r => {
          this.ruleForm.deptName = r.data.deptName
          this.ruleForm.deptAdmin = r.data.deptAdmin
        })
      },
      setDeptNameInput() {
        if (!this.ruleForm.areaCode) {
          if (this.showInput.street == false) {
            this.ruleForm.deptName = ''
            this.ruleForm.deptAdmin = ''
          }
          return;
        }
        this.showInput.street = false
        this.ruleForm.areaName = ''
        let This = this;
        getDdptNameByAreaAndParentDept(
          {
            areaCode: this.ruleForm.areaCode,
            deptId: this.parentDept.deptId
          }).then((result) => {
            if (result.status) {
              This.ruleForm.deptName = result.data.deptName;
              This.ruleForm.deptAdmin = result.data.deptAdmin;
            } else {
              console.info(result);
            }
          })
      },
      submitInfo() {
        if(this.loading){
          this.$message({
            message: '操作执行中，请稍等!',
            type: 'warning'
          });
          return;
        }
        let This = this;
        if (This.ruleForm.areaName.length != 0) {
          this.rules.areaCode[0].required = false;
        } else {
          this.rules.areaCode[0].required = true;
        }
        // 表单验证方法
        this.$refs.ruleForm.validate(function (result) {
          if (result) {
            if (this.parentDept.codeLevel == 4) {
              this.ruleForm.areaName = this.ruleForm.deptName;
            }
            // 验证通过
            This.ruleForm.parentDeptId = This.parentDept.deptId;
            this.loading=true;
            addDeptAndDeptAdmin(This.ruleForm).then((result) => {
              this.loading=false;
              if (result.status) {
                this.$message({
                  message: '添加部门和部门管理员成功!',
                  type: 'success'
                });
                This.$router.go(-1);
              } else {
                this.$message({
                  message: result.message,
                  type: 'error'
                });
              }
            })

          } else {
            this.$message({
              message: '请填写完毕所有必填字段!',
              type: 'warning'
            });
          }
        }.bind(this));
      },
      showAddAddrMsg() {
        let parentLevel = this.parentDept.codeLevel;
        if (parentLevel == 3) {
          this.showInput.street = true;
          this.ruleForm.areaCode = ''
          this.ruleForm.areaName = ''
          this.ruleForm.deptName = '';
          this.ruleForm.deptAdmin = '';
        } else {
          this.showInput.street = false;
          this.$alert('请联系开发人员新增或修改行政区域信息', '添加提示', {
            confirmButtonText: '确定'
          });
        }
      },
      closeAddAddrMsg() {
        this.ruleForm.deptName = ''
        this.ruleForm.deptAdmin = ''
        this.showInput.street = false;
        this.ruleForm.areaName = '';
        this.rules.areaCode[0].required = true;
      }

    },
    data() {
      return {
        loading: false,
        addressMsg: '找不到目标区县?',
        placeholder: {
          areaText: ""
        },
        parentDept: {
          deptId: "",
          deptName: "",
          codeLevel: "",
          areaCode: ""
        },
        showInput: {
          street: false,
          supervisor: false,
          other: true
        },
        deptNameInput: {
          label: "部门名称:",
          text: "请填写部门名称"
        },
        mainName: '',
        phone: '',
        number: '',
        date: '',
        sync: false,
        options: [],
        supervisorOptions: [],
        yes: true,
        ruleForm: {
          areaCode: '',
          deptName: '',
          adds: '',
          deptAdmin: '',
          parentDeptId: '',
          areaName: "",
          parentAreaCode: "",
          supervisorId: ""
        },
        rules: {
          areaCode: [{ required: true, message: '请选择', trigger: 'change' }],
          deptName: [{ required: true, message: '请输入', trigger: 'blur' }],
          supervisorId: [{ required: false, message: '请选择', trigger: 'change' }],
          deptAdmin: [
            {
              required: true, message: '请输入', trigger: 'blur'
            },
            {
              validator: userNameValid, trigger: 'blur'
            }
          ],
          supervisorId: [{ requiredrequired: true, message: '请选择', trigger: 'change' }],
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
