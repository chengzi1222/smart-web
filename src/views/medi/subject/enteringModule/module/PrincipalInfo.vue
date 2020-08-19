<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="130px" class="demo-ruleForm labW150 right-info">
    <!-- 负责人信息  -->
    <toggle-form title="负责人信息">
      <div class="content">
        <div class="row">
          <el-form-item label="负责人:">
            <el-input @blur="validated" class="w120" v-model="entity.corpName" :maxlength="32" placeholder="例：王维"></el-input>
          </el-form-item>
          <el-form-item label="手机号:" prop="corpMobile">
            <el-input type="number" @blur="validated" class="w150" v-model="entity.corpMobile" :maxlength="11" placeholder="例：187226491XX"></el-input>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="身份证号:" prop="idNo">
            <el-input @blur="validated" class="w300" v-model="entity.idNo" :maxlength="18" placeholder="请输入18位身份证号"></el-input>
          </el-form-item>
          <el-form-item v-if="entityType === 'MEDICINE_MANAGER'" label="质量负责人:" prop="qualityPerson">
            <el-input @blur="validated" class="w300" v-model="entity.qualityPerson" :maxlength="32" placeholder="请输入质量负责人姓名"></el-input>
          </el-form-item>
        </div>
      </div>
    </toggle-form>
  </el-form>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";

  export default {
    components: {
      ToggleForm
    },
    mounted() {
      this.validated();
    },
    props: {
      initData: {
        type: Object
      },
      outs: {
        type: Number
      },
      entityType: {
        type: String
      }
    },
    data() {
      return {
        entity: {
          corpName: "",
          corpMobile: "",
          idNo: "",
          qualityPerson: ''
        },
        rules: {

        }
      };
    },
    methods: {
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
        this.$refs["form"].resetFields();
      },
      validated() {
        this.$emit("getData", this.entity);
      }
    },
    watch: {
      initData() {
        Object.keys(this.entity).forEach(key => {
          this.entity[key] = this.initData[key]
        })
      },
      outs() {
        this.entity = {
          corpName: "",
          corpMobile: "",
          idNo: ""
        }
      }
    }
  };
</script>