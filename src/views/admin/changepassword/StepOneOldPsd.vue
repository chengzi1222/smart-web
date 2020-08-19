<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="原密码:" prop="oldPsd">
        <el-input style="width:260px;" type="password" v-model="ruleForm.oldPsd" placeholder="请输入原密码"></el-input>
      </el-form-item>
      <el-button type="primary" style="margin-left:100px;" @click="submit('ruleForm')">下一步</el-button>
    </el-form>
  </div>
</template>

<script>
  import { changePassword } from "api/login.js";
  export default {
    data() {
      return {
        ruleForm: {
          oldPsd: ""
        },
        rules: {
          oldPsd: [{ required: true, message: "请输入原密码", trigger: "blur" }]
        }
      };
    },
    methods: {
      submit(ruleForm) {
        this.$refs[ruleForm].validate(valid => {
          if (valid) {
            changePassword(this.ruleForm.oldPsd).then(r => {
              if (r.data) {
                var token = r.data;
                if (token) {
                  this.$router.push({
                    name: "sys.password",
                    query: {
                      type: "update",
                      step: 2,
                      token: token
                    }
                  });
                }
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>