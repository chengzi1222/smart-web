<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="130px" class="demo-ruleForm labW150 right-info">
    <toggle-form title="经营信息">
      <div class="content">
        <div class="row">
          <el-form-item label="注册经营地址:" prop="registerAddr">
            <el-input @blur="validated" class="w300" :maxlength="50" v-model="entity.registerAddr" placeholder="请输入经营场所地址"></el-input>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="实际经营地址:">
            <el-input @blur="validated" class="w300" :maxlength="50" v-model="entity.realityAddr" placeholder="请输入实际经营场所地址"></el-input>
          </el-form-item>
        </div>

        <div v-if="entityType === 'MEDICINE_MANAGER'" class="row">
          <el-form-item label="机构类型:">
            <dict-select @change="validated" class="w200" v-model="entity.organizationType" dict="MEDI_M_OT" placeholder="请选择机构类型"></dict-select>
          </el-form-item>

          <el-form-item label="经营方式:">
            <dict-select @change="validated" class="w200" v-model="entity.manageWay" dict="MEDI_M_MM" placeholder="请选择经营方式"></dict-select>
          </el-form-item>
        </div>

        <div v-if="entityType === 'MEDICINE_MANAGER'" class="row">
          <el-form-item label="药品企业类型:">
            <dict-select @change="validated" class="w200" v-model="entity.enterpriseType" dict="MEDI_M_ET" placeholder="请选择企业类型"></dict-select>
          </el-form-item>

          <el-form-item label="连锁类型:">
            <dict-select @change="validated" class="w200" v-model="entity.chainType" dict="MEDI_M_CT" placeholder="请选择连锁类型"></dict-select>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="营业状态:">
            <enum-select @change="validated" class="w200" v-model="entity.manageState" enum="com.ybveg.govx.enums.ManageStateEnum" placeholder="请选择营业状态"></enum-select>
          </el-form-item>

          <el-form-item label="企业形态:">
            <enum-select @change="validated" class="w200" v-model="entity.enterpriseForm" :enum="enterpriseFormEnum" placeholder="请选择企业形态"></enum-select>
          </el-form-item>
        </div>
        <div v-if="entityType === 'MEDICINE_MANAGER'" class="row">
          <el-form-item label="经营类别:">
            <el-checkbox-group @change="validated" v-model="entity.manageType">
              <el-checkbox-button v-for="item in manageTypeSelect" :label="item.code" :key="item.code">{{item.name}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div v-if="entityType === 'MEDICINE_MANAGER'" class="row">
          <el-form-item label="经营范围:">
            <el-checkbox-group @change="validated" v-model="entity.manageRange">
              <el-checkbox-button v-for="item in manageRangeSelect" :label="item.code" :key="item.code">{{item.name}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </div>
    </toggle-form>
  </el-form>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import EnumSelect from "components/common/EnumSelect";
  import DictSelect from "components/common/DictSelect";
  import * as common from "api/common";

  export default {
    components: {
      EnumSelect,
      ToggleForm,
      DictSelect
    },
    mounted() {
      if (this.entityType === 'MEDICINE_MANAGER') {
        this.enterpriseFormEnum = "com.ybveg.govx.enums.medi.ManagerEnterpriseFormEnum"
      } else if (this.entityType === 'MEDICINE_EMPLOY') {
        this.enterpriseFormEnum = "com.ybveg.govx.enums.medi.EmployEnterpriseFormEnum"
      } else if (this.entityType === 'MEDICINE_PRODUCT') {

      }
      this.validated();
      common.getDicts(['MEDI_M_MT']).then(r => {
        this.manageTypeSelect = r.data[0].list
      })
      common.getDicts(['MEDI_M_MS']).then(r => {
        this.manageRangeSelect = r.data[0].list
      })
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
        enterpriseFormEnum: '',
        manageTypeSelect: [],
        manageRangeSelect: [],
        //主体基础信息字段
        entity: {
          registerAddr: '', // 注册经营地址
          realityAddr: '', // 实际经营地址
          organizationType: '',	// 机构类型
          manageWay: '',	// 经营方式
          enterpriseType: '',	// 药品企业类型
          chainType: '',	// 连锁类型
          manageState: '', // 营业状态
          enterpriseForm: '',	// 企业形态
          manageType: [],	// 经营类别
          manageRange: []	// 经营范围
        },
        //验证
        rules: {
          registerAddr: [
            { required: true, message: "请输入注册经营地址", trigger: "blur" }
          ],
        }
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
      initData() {
        Object.keys(this.entity).forEach(key => {
          this.entity[key] = this.initData[key]
        })
        if (!this.entity.manageType) {
          this.entity.manageType = []
        }
        if (!this.entity.manageRange) {
          this.entity.manageRange = []
        }
      },
      outs() {
        this.entity = {
          registerAddr: '', // 注册经营地址
          realityAddr: '', // 实际经营地址
          organizationType: '',	// 机构类型
          manageWay: '',	// 经营方式
          enterpriseType: '',	// 药品企业类型
          chainType: '',	// 连锁类型
          manageState: '', // 营业状态
          enterpriseForm: '',	// 企业形态
          manageType: [],	// 经营类别
          manageRange: []	// 经营范围
        }
      }
    }
  };
</script>


<style lang="scss" scoped>
  .selectHeight {
    margin-left: 0px !important;
  }
</style>