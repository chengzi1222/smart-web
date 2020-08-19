<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="130px" class="demo-ruleForm labW150 right-info">
    <toggle-form title="经营信息">
      <div class="content">
        <div class="row red">
          <el-form-item :label="registerAddrLabel" prop="registerAddr">
            <el-input @blur="registerAddrValied"  class="w300" :maxlength="100" v-model="entity.registerAddr" :placeholder="registerAddrPlaceholder"></el-input>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;line-height: 18px;">(必填) 请真实填写，可在地理信息定位系统中展示，如：XX省XX市XX区/县XX镇XX街XX号</span>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="实际经营地址:">
            <el-input @blur="validated" class="w300" :maxlength="100" v-model="entity.realityAddr" placeholder="请输入实际经营场所地址"></el-input>
             <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;line-height: 18px;">如果注册地址与实际地址不符，则在此处录入实际经营地址</span>
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="生产地址:" v-if="entityType=='MAAI_PRODUCT'">
            <el-input @blur="otherAddrValied" class="w300" :maxlength="100" v-model="entity.otherAddr" placeholder="请输入生产地址"></el-input>
          </el-form-item>
          <el-form-item label="仓库地址:" v-else>
            <el-input @blur="otherAddrValied" class="w300" :maxlength="100" v-model="entity.otherAddr" placeholder="请输入仓库地址"></el-input>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="营业状态:" prop="manageState">
            <el-select clearable  @change="validated"  class="w200 selectHeight" v-model="entity.manageState" placeholder="请选择营业状态" style="margin-left: 0px !important;">
              <el-option v-for="item in manageStateList" :key="item.key" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>
          <el-form-item label="营业方式:"  v-if="entityType=='MAAI_MANAGER'" prop="manageType">
            <el-select clearable  @change="validated"  class="w200 selectHeight" v-model="entity.manageType" placeholder="请选择营业方式" style="margin-left: 0px !important;">
              <el-option v-for="item in manageTypeList" :key="item.key" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="企业形态:"  v-if="entityType!=='MAAI_PRODUCT'" prop="enterpriseForm">
            <el-select clearable  @change="validated"  class="w200 selectHeight" v-model="entity.enterpriseForm" placeholder="请选择企业形态" style="margin-left: 0px !important;">
              <el-option v-for="item in enterpriseFormList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>
          <el-form-item label="是否网络经营:"  v-if="entityType=='MAAI_MANAGER'">
            <el-select  @change="validated"  class="w200 selectHeight" v-model="entity.online" placeholder="请选择是否网络经营" style="margin-left: 0px !important;">
              <el-option v-for="item in onlineList" :key="item.key" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>
        </div>
        <div class="row" v-if="entityType=='MAAI_MANAGER' && entity.online === 'YES'">
          <el-form-item label="网络经营备注:">
            <el-input @blur="validated" class="w350" type="textarea" placeholder="网络经营备注，选填，不超过1000字" :maxlength="1000" :rows="6" v-model="entity.onlineRemark"></el-input>
          </el-form-item>
        </div>
         <div class="row" v-if="entityType=='MAAI_EMPLOY'">
          <el-form-item label="使用类别：" prop="category">
            <el-checkbox-group @change="validated" v-model="entity.category">
              <el-checkbox-button v-for="item in categorySelect" :label="item.key" :key="item.key">{{item.name}}</el-checkbox-button>
            </el-checkbox-group>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(多选、必填)</span>
          </el-form-item>
        </div>
      </div>
    </toggle-form>
  </el-form>
</template>

<script  type="module">
import ToggleForm from "components/ToggleForm.vue";
import EnumSelect from "components/common/EnumSelect";
import * as common from "api/common";

export default {
  components: {
    EnumSelect,
    ToggleForm,
  },
  mounted() {
    let enterpriseFormCode
    if(this.entityType=="MAAI_PRODUCT"){
      this.registerAddrLabel='注册场所：';
      this.registerAddrPlaceholder='请输入注册场所'
    } else if (this.entityType == 'MAAI_EMPLOY') {
      enterpriseFormCode = 'MAAI_EB_SUB'
      common.getEnums(['com.ybveg.govx.enums.maai.MaaiProductCategoryEnum'], false).then(r => {
        this.categorySelect = r.data
      })
    } else if (this.entityType == 'MAAI_MANAGER') {
      enterpriseFormCode = 'MAAI_MB_SUB'
      common.getEnums(['com.ybveg.govx.enums.maai.MaaiManagerTypeEnum'], false).then(r => {
        this.manageTypeList = r.data
      })
      common.getEnums(['com.ybveg.govx.enums.YesNoEnum'], false).then(r => {
        this.onlineList = r.data
      })
    }
    if (enterpriseFormCode) {
      common.getDicts([enterpriseFormCode]).then(r => {
        this.enterpriseFormList = r.data[0].list
      })
    }
    common.getEnums(['com.ybveg.govx.enums.ManageStateEnum'], false).then(r => {
      this.manageStateList = r.data
    })
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
      registerAddrLabel:'注册经营场所：',
      registerAddrPlaceholder:'请输入注册经营场所',
      manageStateList:[],
      categorySelect: [],
      enterpriseFormList: [],
      manageTypeList: [],
      onlineList: [],
      //主体基础信息字段
      entity: {
        registerAddr: '', // 注册经营地址
        realityAddr: '', // 实际经营地址
        otherAddr: '', // 仓库/生产地址
        manageState: 'NORMAL', // 营业状态
        manageType: 'OTHER', // 营业方式
        enterpriseForm: 'OTHER',	// 企业形态
        online: 'NO', // 是否网络经营
        onlineRemark: '', // 网络经营备注
        category: []	// 经营范围
      },
      //验证
      // 生产必须验证注册场所和营业状态
      // 经营必须验证注册场所和营业状态，经营方式，企业形态，是否网络经营
      // 使用必须验证注册场所和营业状态，企业形态
      rules: {
        registerAddr: [
          { required: true, message: "请输入注册经营场所", trigger: "blur" }
        ],
        enterpriseForm: [
          { required: true, message: "请选择企业形态", trigger: "change" }
        ],
        manageState: [
          { required: true, message: "请选择营业状态", trigger: "change" }
        ],
        category: [
          { required: true, message: "请选择使用/经营/生产类别", trigger: "change" }
        ],
        manageType: [
          { required: true, message: "请选择营业方式", trigger: "change" }
        ]
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
      if (this.entityType !== 'MAAI_EMPLOY') {
        delete this.entity['category']
      } else {
        delete this.entity['manageType']
      }
      if (this.entityType !== 'MAAI_MANAGER') {
        delete this.entity['online']
        delete this.entity['onlineRemark']
      } else {
        if (this.entity.online === 'NO') {
          this.entity.onlineRemark = ''
        }
      }
      if (this.entityType === 'MAAI_PRODUCT') {
        delete this.entity['manageType']
        delete this.entity['enterpriseForm']
      }
      this.$emit("getData", this.entity);
    },
    submitSub() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            throw new Error("表单验证出错");
          }
        });
      });
    },
    reset() {
      this.$refs["form"].resetFields();
    },
    registerAddrValied () {
      this.$emit("outRegisterAddr", this.entity.registerAddr)
      this.validated()
    },
    otherAddrValied () {
      this.$emit("outOtherAddr", this.entity.otherAddr)
      this.validated()
    }
  },
  watch: {
    initData () {
      Object.keys(this.entity).forEach(key => {
        console.log(key + ':' + this.entity[key] + ':' + this.initData[key])
        this.entity[key] = this.initData[key]
      })
    },
    outs() {
      this.entity = {
        registerAddr: '', // 注册经营地址
        realityAddr: '', // 实际经营地址
        otherAddr: '', // 仓库/生产地址
        manageState: 'NORMAL', // 营业状态
        manageType: 'OTHER', // 营业方式
        enterpriseForm: 'OTHER',	// 企业形态
        online: 'NO', // 是否网络经营
        onlineRemark: '', // 网络经营备注
        category: []	// 经营范围
      }
     
    }
  }
};
</script>


<style lang="scss" scoped>
  .right-info .content {
    width: 870px;
    margin: 20px auto 0;
  }
  .row .el-form-item {
    min-width: 400px;
  }
</style>
