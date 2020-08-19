<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="130px" class="demo-ruleForm labW150 right-info">
    <toggle-form title="基础信息">
      <div class="content">
        <div class="row">
          <el-form-item label="主体名称:" prop="entityName">
            <el-input @blur="validated" class="w200" v-model="entity.entityName" :maxlength="30" placeholder="请输入主体名称"></el-input>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>

          <el-form-item label="统一社会信用代码:" prop="creditCode">
            <el-input @blur="validated" class="w200" v-model="entity.creditCode" :maxlength="30" ref="creditCode" placeholder="请输入统一社会信用代码"></el-input>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="法人姓名:" prop="legalPerson">
            <el-input @blur="validated" class="w200" v-model="entity.legalPerson" :maxlength="30" placeholder="例:王维"></el-input>
          </el-form-item>
        </div>

        <div class="row"  v-if="this.entityType=='COSMETIC_PRODUCT'">
          <el-form-item label="许可备案号:" class="" prop="backupNo">
            <el-input @blur="validated" class="w200" v-model="entity.backupNo" :maxlength="30"  placeholder="请输入许可备案号"></el-input>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>

          <el-form-item label="许可证状态(主体状态):" prop="backupState">
            <enum-select class="w120" @change="validated" v-model="entity.backupState" enum="com.ybveg.govx.enums.LicenceStateEnum" placeholder="请选择">
            </enum-select>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>
        </div>

        <div class="row" v-if="this.entityType=='COSMETIC_PRODUCT'">
          <el-form-item label="有效期:">
            <el-date-picker class="w200" @change="validated" v-model="entity.recordBegin" :editable="false" :picker-options="pickerOptions0" placeholder="选择日期"></el-date-picker>
            -
            <el-date-picker class="w200" @change="validated" v-model="entity.recordEnd" :editable="false" :picker-options="pickerOptions1" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </div>
      </div>
    </toggle-form>
  </el-form>
</template>

<script>
  import { getSubBycreditCode } from "api/sub/add";
  import EnumSelect from "components/common/EnumSelect";
  import { checkSocialCreditCode } from "utils/validate";
  import ToggleForm from "components/ToggleForm.vue";

  export default {
    components: {
      EnumSelect,
      ToggleForm
    },
    mounted() {
      if(this.entityType=='COSMETIC_PRODUCT'){
        this.rules=Object.assign(this.rules,this.rules_pdt);
      }
      this.validated();
    },
    props: {
      initData: {
        type: Object
      },
      outs: {
        type: Number
      },
      entityType:{
        type: String
      }
    },
    data() {
      return {
        pickerOptions0: {
          disabledDate: (time) => {
            if (this.entity.recordEnd) {
              return time.getTime() > this.entity.recordEnd;
            }

          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            if (this.entity.recordBegin) {
              return time.getTime() < this.entity.recordBegin;
            }
          }
        },
        //主体基础信息字段
        entity: {
          entityName: '', //主体名称
          creditCode: '', //统一社会信用代码
          legalPerson: '', //法人姓名
          backupNo: '', //许可备案号
          recordBegin: '', //有效期
          recordEnd: '', //
          backupState: '' //许可证状态
        },
        //验证
        rules: {
          entityName: [
            { required: true, message: "请输入主体名称", trigger: "blur" },
          ],
        },
         //生产主体验证
        rules_pdt: {
          backupState: [
            { required: true, message: "请选择许可证状态", trigger: "blur" },
          ],
          backupNo:[
             { required: true, message: "请输入许可备案号", trigger: "blur" },
            
          ]
        },
      };
    },
    methods: {
      validated() {
        this.$emit("getData", this.entity);
      },
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
      }
    },
    watch: {
      initData () {
        Object.keys(this.entity).forEach(key => {
          this.entity[key] = this.initData[key]
        })
      },
      outs(){
        console.log(this.entity)
        this.entity = {
          entityName: '', //主体名称
          creditCode: '', //统一社会信用代码
          legalPerson: '', //法人姓名
          backupNo: '', //许可备案号
          recordBegin: '', //有效期
          recordEnd: '', //
          backupState: '' //许可证状态
        }
        this.$emit('reset',0)

        console.log(this.entity)
      }
    }
  };
</script>


<style lang="scss" scoped>
</style>
