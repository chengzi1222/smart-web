<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="手机号:" placeholder="请输入手机号" prop="tel">
        <el-input style="width:260px;" v-model="ruleForm.tel"></el-input>
      </el-form-item>
      <el-form-item label="验证码:" placeholder="请输入验证码" prop="yzm" style="position:relative;">
        <el-input class="w120" v-model="ruleForm.yzm"></el-input>
        <el-button v-if="yzmTag" :disabled="checkCodeDisabled" type="default" style="position:absolute;right:-60px;top:3px;" @click="send">获取手机验证码</el-button>
        <span v-if="!yzmTag" class="yzmTimer" style="position:absolute;right:-60px;top:3px;">重新获取&nbsp;{{yzmTime}}s</span>
      </el-form-item>
      <el-button type="primary" style="margin-left:100px;" @click="submit('ruleForm')">下一步</el-button>
    </el-form>
  </div>
</template>

<script>
  import { checkCode, send } from "api/login.js";

  export default {
    data() {
      const validatePass = (rule, value, callback) => {
        const reg = /^((13[0-9])|(15[012356789])|(18[012356789])|(17[0-8])|(147))[0-9]{8}$/
        if (value === "") {
          this.checkCodeDisabled = true
          callback(new Error("请输入手机号"));
        } else if (!reg.test(value)) {
          this.checkCodeDisabled = true
          callback(new Error('请输入正确的手机号码'))
        } else {
          this.checkCodeDisabled = false
          callback();
        }
      };
      return {
        checkCodeDisabled: true, // 发送验证码按钮置灰
        interval: null,
        yzmTag: true, //可获取验证码
        yzmTime: 60, //验证码倒计时
        ruleForm: {
          tel: "",
          yzm: ""
        },
        rules: {
          tel: [
            { validator: validatePass, trigger: "change" }
          ],
          yzm: [{ required: true, message: "请输入验证码", trigger: "blur" }]
        }
      };
    },
    methods: {
      submit(ruleForm) {
        this.$refs[ruleForm].validate(valid => {
          if (valid) {
            // 发送请求判断验证码是否正确, 返回一个username对应的token
            checkCode(this.ruleForm).then(r => {
              if (r.data) {
                const token = r.data;

                if (token) {
                  this.$router.push({
                    name: "sys.password",
                    query: {
                      type: "reset",
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
      },
      send() {
        const $this = this;
        if (this.yzmTag === true) {
          this.yzmTag = false;
          // 发送短信
          send(this.ruleForm.tel);
          // 倒计时开始
          this.interval = window.setInterval(() => {
            if ($this.yzmTime-- <= 0) {
              $this.yzmTime = 60;
              $this.yzmTag = true;
              window.clearInterval($this.interval);
            }
          }, 1000);
        } else {
          return;
        }
      },
      beforeDestroy() {
        // 销毁定时器
        window.clearInterval(this.interval);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .yzmTimer {
    background: #ffffff;
    border: 1px solid #e0e6ed;
    width: 132px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    color: #bac5d2;
  }
</style>