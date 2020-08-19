<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="130px" class="demo-ruleForm labW150 right-info">
    <toggle-form title="经营信息">
      <div class="content">
        <div class="row red">
          <el-form-item label="(经营场所)证照地址:" prop="registerAddr">
            <el-input @blur="validated"  class="w300" :maxlength="100" v-model="entity.registerAddr" placeholder="请输入经营场所地址"></el-input>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="实际经营地址:">
            <el-input @blur="validated" class="w300" :maxlength="100" v-model="entity.realityAddr" placeholder="请输入实际经营场所地址"></el-input>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="营业状态:">
            <enum-select @change="validated" class="w200" v-model="entity.manageState" enum="com.ybveg.govx.enums.ManageStateEnum" placeholder="请选择营业状态"></enum-select>
          </el-form-item>

          <el-form-item label="企业形态:"  v-if="this.entityType != 'COSMETIC_PRODUCT'">
            <el-select  clearable class="selectHeight" :collapse-tags="true" v-model="entity.enterpriseForm" placeholder="请选择企业形态" @change="validated">
              <el-option v-for="item in enterpriseFormArr" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div  class="row" >
          <el-form-item :label="manageRangeText" >
            <el-checkbox-group @change="validated" v-model="entity.manageScope">
              <el-checkbox-button v-for="item in manageRangeSelect" :label="item.code" :key="item.code">{{item.name}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div  class="row">
          <el-form-item :label="detailedEngageText">
            <yb-select v-if='isReset'
              @getSelectData="getDetailedSelect"
              :selectData="detailedEngageItem"
              :checkedData="detailedEngageChecked"
              showFlied="name"
              childFlid="children"
              id='id'>
            </yb-select>
          </el-form-item>
        </div>
      </div>
    </toggle-form>
  </el-form>
</template>

<script>
import { floatValid, intValid } from "utils/validate";
import ToggleForm from "components/ToggleForm.vue";
import BtnSelect from "components/BtnSelect.vue";
import EnumSelect from "components/common/EnumSelect";
import DictSelect from "components/common/DictSelect";
import YbSelect from 'components/ybselect/YbSelect.vue';
import * as common from "api/common";

export default {
  components: {
    EnumSelect,
    ToggleForm,
    BtnSelect,
    DictSelect,
    YbSelect
  },
  mounted() {
    if (this.entityType === 'COSMETIC_MANAGER') {
      common.listDictUserItemByCodeAll('COSM_MB_SUB').then(d=>{
          this.enterpriseFormArr  = d.data;
          // this.enterpriseFormArr .unshift({ code: '', name: "企业形态" })
      });
      common.getDicts(['COSM_MB_BS']).then(r => {
        this.manageRangeSelect = r.data[0].list
      })
       common.listDictUserItemByCodeAll('COSM_MB_MI').then(d=>{
            this.detailedEngageItem = d.data;
      });
      this.manageRangeText="经营范围:";
      this.detailedEngageText='详细经营信息:';
    } else if (this.entityType === 'COSMETIC_EMPLOY') {
      common.listDictUserItemByCodeAll('COSM_EB_SUB').then(d=>{
          this.enterpriseFormArr  = d.data;
      });
      common.getDicts(['COSM_EB_BS']).then(r => {
        this.manageRangeSelect = r.data[0].list
      })
       common.listDictUserItemByCodeAll('COSM_EB_MI').then(d=>{
            this.detailedEngageItem = d.data;
      });
      this.manageRangeText="经营范围:";
      this.detailedEngageText='详细经营信息:';
    } else if (this.entityType === 'COSMETIC_PRODUCT') {
       common.getDicts(['COSM_PB_PR']).then(r => {
        this.manageRangeSelect = r.data[0].list
      })
      common.listDictUserItemByCodeAll('COSM_PB_MI').then(d=>{
              this.detailedEngageItem = d.data;
      });
      this.manageRangeText="生产范围:";
      this.detailedEngageText='详细生产信息:';
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
    entityType: {
      type: String
    }
  },
  data() {
    return {
      isReset:true,
      detailedEngageItem:[],//详细信息数据
      detailedEngageChecked: [],//详细信息回显的数组
      enterpriseFormArr: [],
      manageRangeSelect: [],
      manageRangeText:'',
      detailedEngageText:'',
      //主体基础信息字段
      entity: {
        registerAddr: '', // 注册经营地址
        realityAddr: '', // 实际经营地址
        manageState: '', // 营业状态
        enterpriseForm: '',	// 企业形态
        manageScope: [],	// 经营范围
        detailedEngage:[]//详细信息
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
    getDetailedSelect(val) {
      this.entity.detailedEngage = val;
      // this.detailedEngageChecked = val;
      this.validated();
    },
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
    },
    recursion(arr,arr2){
       for (let item in arr) {
            if (
              Object.prototype.toString
                .call(arr[item])
                .slice(8, -1)
                .toLowerCase() === "function"
            ) {
              continue;
            }
         for(let v in arr2 ){
           if (
              Object.prototype.toString
                .call(arr2[v])
                .slice(8, -1)
                .toLowerCase() === "function"
            ) {
              continue;
            }
           if(arr2[v]==arr[item].code){
             this.detailedEngageChecked.push(arr[item]);
           }
         }
       }
    },
  },
  watch: {
    initData () {
      Object.keys(this.entity).forEach(key => {
        this.entity[key] = this.initData[key]
      })
      if (!this.entity.manageScope) {
        this.entity.manageScope = []
      }
      if (this.entity.detailedEngage=='') {
        debugger
        this.entity.detailedEngage = []
      }
      // 回显详细信息
      if(typeof this.entity.detailedEngage === 'string'){
        this.entity.detailedEngage=this.entity.detailedEngage.split(',')
      };
      if(typeof this.entity.manageScope === 'string'){
        this.entity.manageScope=this.entity.manageScope.split(',')
      };
      this.recursion(this.detailedEngageItem,this.entity.detailedEngage);
      this.validated()
    },
    outs() {
      this.entity = {
        registerAddr: '', // 注册经营地址
        realityAddr: '', // 实际经营地址
        manageState: '', // 营业状态
        enterpriseForm: '',	// 企业形态
        manageScope: [],	// 经营范围
        detailedEngage:[]//详细信息
      }
      this.isReset=false;
      this.$nextTick(() => {
      this.isReset = true
      })
      
    }
  }
};
</script>


<style lang="scss" scoped>
.selectHeight {
  margin-left: 0px !important;
}
</style>
<style lang="sass">
.red .el-form-item__label{
  color: red;
}
</style>
