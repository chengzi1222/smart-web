<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="130px" class="demo-ruleForm labW150">
    <!-- 负责人信息  -->
    <toggle-form title="负责人信息">
      <div class="content">
        <div class="row">
          <el-form-item label="负责人:">
            <el-input @blur="validated" class="w120" v-model="entity.corpName" :maxlength="32" placeholder="例：王维"></el-input>
          </el-form-item>
          <el-form-item label="手机号:" prop="mobile">
            <el-input type="number" @blur="validated" class="w150" v-model="entity.mobile" :maxlength="11" placeholder="例：187226491XX"></el-input>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="身份证号:" prop="idNo">
            <el-input @blur="validated" class="w300" v-model="entity.idNo" :maxlength="18" placeholder="请输入18位身份证号"></el-input>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="住所:">
            <el-input @blur="validated" class="w300" v-model="entity.address" :maxlength="50" placeholder="请输入住所"></el-input>
          </el-form-item>
        </div>
      </div>
    </toggle-form>
  </el-form>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import { idNoValid, phoneValid } from "utils/validate";

  export default {
    components: {
      ToggleForm
    },
    mounted() {
      this.editEcho();
      this.validated();
    },
    props: {
      handleState: {
        type: String
      },
      type: {
        type: String
      },
      initData: {
        type: Object
      }
    },
    data() {
      return {
        entity: {
          corpName: "",
          mobile: "",
          idNo: "",
          address: ""
        },
        rules: {
          mobile: [
            { validator: phoneValid, trigger: "blur" }
          ],
          idNo: [
            { validator: idNoValid, trigger: "blur" }
          ],
        },
        num: {
          successNum: 0,
          totalNum: 0
        }
      };
    },
    watch: {
      initData() {
        this.editEcho();
      },
      entity: {
        handler() {
          this.validated();
        },
        deep: true
      }
    },
    methods: {
      //编辑回显
      editEcho() {
        if (this.handleState === "edit" || this.handleState === "change") {
          Object.keys(this.entity).forEach(key => {
            if (this.initData[key]) {
              this.entity[key] = this.initData[key];
            }
          });
          this.$refs["form"].validate();
        }
      },
      //验证
      submitSub() {
        return new Promise((resolve, reject) => {
          this.$refs["form"].validate(valid => {
            if (valid) {
              resolve();
            }
            throw new Error("表单验证出错");
          });
        });
      },
      reset() {
        return new Promise((resolve, reject) => {
          this.$refs["form"].resetFields();
        });
      },
      validated() {
        this.$emit("getData", this.entity);
      }
    }
  };
</script>