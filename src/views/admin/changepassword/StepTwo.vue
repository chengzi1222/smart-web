<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="新密码:" prop="newPsd">
                <el-input style="width:260px;" type="password" v-model="ruleForm.newPsd" placeholder="密码为6-12位英文或数字或下划线组成"></el-input>
            </el-form-item>
             <el-form-item label="确认密码:" prop="comfirmNewPsd">
                <el-input style="width:260px;" type="password" v-model="ruleForm.comfirmNewPsd" placeholder="请再次输入新密码"></el-input>
            </el-form-item>
            <el-button type="primary" style="margin-left:100px;" @click="submit('ruleForm')">下一步</el-button>
        </el-form>
    </div>
</template>

<script>
import { updateNewPassword } from "api/login.js";
export default {
  props: {
    token: {
      type: String
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_]{6,12}$/
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if(!reg.test(value)) {
        callback(new Error('密码为6-12位英文或数字或下划线组成'))
      } else {
        if (this.ruleForm.newPsd !== "") {
          this.$refs.ruleForm.validateField("comfirmNewPsd");
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newPsd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        // token: '',
        newPsd: "",
        comfirmNewPsd: ""
      },
      rules: {
        newPsd: [{ validator: validatePass, trigger: "blur" }],
        comfirmNewPsd: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    submit(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
        //   updateNewPassword({ ...this.ruleForm, ...this.TOKEN }).then(r => {
          const user = Object.assign(this.ruleForm, this.TOKEN);
          updateNewPassword(user).then(r => {
            if (r.status) {
              this.$router.push({
                name: "sys.password",
                query: {
                  type: "reset",
                  step: 3
                }
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  computed: {
    TOKEN() {
      return { token: this.token };
    }
  }
};
</script>

<style lang="scss" scoped>

</style>

