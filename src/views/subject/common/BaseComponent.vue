<template>
  <el-form :model="entity"  :rules="rules" ref="form" label-width="130px" class="demo-ruleForm labW150">
    <toggle-form title="基础信息">
      <div class="content">
        <div class="row">
          <el-form-item label="主体名称:" prop="entityName">
            <el-input @blur="validated" class="w200" v-model="entity.entityName"  :maxlength="50" placeholder="请输入主体名称"></el-input>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>

          <el-form-item label="统一社会信用代码:" prop="creditCode" v-if="(natureType == 'YZYZ' || natureType == 'YZWZ')">
            <el-input @blur="validated" class="w200"  v-model="entity.creditCode" :maxlength="50" ref="creditCode" placeholder="请输入统一社会信用代码"></el-input>
          </el-form-item>
        </div>

        <div class="row" v-if="natureType == 'YZYZ' || natureType == 'YZWZ'">
          <el-form-item label="法人姓名:" prop="legalPerson">
            <el-input @blur="validated" class="w200" v-model="entity.legalPerson" :maxlength="32" placeholder="例:王维"></el-input>
          </el-form-item>

          <el-form-item label="主体工商备案状态:" prop="creditType">
            <enum-select class="w200" @change="validated" v-model="entity.creditType" enum="com.ybveg.govx.enums.EntityBackupStateEnum" placeholder="请选择主体工商状态">
            </enum-select>
          </el-form-item>
        </div>

        <div class="row" v-if="natureType == 'YZYZ' && creditCodeList && creditCodeList.length > 0">
          <el-form-item label="该主体已拥有许可证:">
            <div v-for="item in creditCodeList" :key="item.licenceTypeStr">
              <span class="tag">{{item.licenceTypeStr}}：{{item.licence}}</span>
            </div>
          </el-form-item>
        </div>

        <div class="row" v-if="natureType == 'YZYZ'">
          <el-form-item v-if="entityType == 'PRODUCT'" label="许可证类型:" prop="licenceType" style="vertical-align:top">
            <enum-select  class="w200" @change="validated" @noData="licenceNull" v-model="entity.licenceType" enum="com.ybveg.govx.enums.ProduceLicenceTypeEnum" :filterKey="licenceTypeFilter" placeholder="请选择">
            </enum-select>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>

          <el-form-item v-if="entityType == 'RESTAURANT'" label="许可证类型:" prop="licenceType" style="vertical-align:top">
            <enum-select class="w200" @change="validated" @noData="licenceNull" v-model="entity.licenceType" enum="com.ybveg.govx.enums.FoodLicenceTypeEnum" :filterKey="licenceTypeFilter" placeholder="请选择">
            </enum-select>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>

          <el-form-item v-if="entityType == 'CIRCULATION'" label="许可证类型:" prop="licenceType" style="vertical-align:top">
            <enum-select class="w200" @change="validated" @noData="licenceNull" v-model="entity.licenceType" enum="com.ybveg.govx.enums.FlowLicenceTypeEnum" :filterKey="licenceTypeFilter" placeholder="请选择">
            </enum-select>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>

          <el-form-item label="许可备案号:" class="" prop="licence">
            <el-input @blur="validated" class="w200" v-model="entity.licence" :maxlength="32" placeholder="请输入许可备案号"></el-input>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>
        </div>

        <div class="row" v-if="natureType == 'YZYZ'">
            <el-form-item label="有效期:">
            <el-date-picker class="w200" @change="validated" v-model="entity.licBegin" :editable="false" :picker-options="pickerOptions0" placeholder="选择日期">
            </el-date-picker>
            -
            <el-date-picker class="w200" @change="validated" v-model="entity.licEnd" :editable="false" :picker-options="pickerOptions1" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>

        <div class="row" v-if="natureType == 'YZYZ'">
          <el-form-item label="许可证状态(主体状态):" prop="licState">
            <enum-select  class="w120" @change="validated" v-model="entity.licState" enum="com.ybveg.govx.enums.LicenceStateEnum" placeholder="请选择">
            </enum-select>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>

        </div>

      </div>
    </toggle-form>
  </el-form>
</template>

<script>
import { getSubBycreditCode, countLicence } from "api/sub/add";
import EnumSelect from "components/common/EnumSelect";
import { checkSocialCreditCode } from "utils/validate";
import ToggleForm from "components/ToggleForm.vue";

export default {
  components: {
    EnumSelect,
    ToggleForm
  },
  mounted() {
    this.editEcho();//编辑回显
    this.validated();
  },
  props: {
    handleState: {
      type: String,
    },
    natureType: {
      type: String
    },
    entityType: {
      type: String
    },
    initData: {
      type: Object,
    }
  },
  data() {
    return {
      pickerOptions0: {
        disabledDate: (time) => {
          if (this.entity.licEnd){
            return time.getTime() > this.entity.licEnd;
          }

        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          if (this.entity.licBegin){
            return time.getTime() < this.entity.licBegin;
          }
        }
      },
      creditCodeList: [], //当前信用的许可证集合
      licenceTypeFilter: [], //需要过滤的许可证类型
      //主体基础信息字段
      entity: {
        entityName: null, //主体名称
        creditCode: null, //统一社会信用代码
        legalPerson: null, //法人姓名
        creditType: null, //工商主体备案状态
        licence: null, //许可备案号
        licBegin: null, //有效期
        licEnd: null, //
        licState: null, //许可证状态
        licenceType: '',//许可证类型
      },
      //验证
      rules: {
        entityName: [
          { required: true, message: "请输入主体名称", trigger: "blur" }
        ],
        creditCode: [
          { required: false, message: "请输入统一社会信用代码", trigger: "blur" },
          { validator: checkSocialCreditCode, trigger: "blur" },
          { validator: this.creditCodeValid, trigger: "blur" }
        ],
        legalPerson: [
          { required: false, message: "请输入法人姓名", trigger: "blur" }
        ],
        creditType: [
          {
            required: false,
            message: "请选择主体工商备案状态",
            trigger: "change"
          }
        ],
        licence: [
          { required: true, message: "请输入许可备案号", trigger: "blur" },
           { validator: this.licenceNoValid, trigger: "blur" },
        ],
        licenceType: [
          { required: true, message: "请选择许可证类型", trigger: "change" }
        ],
        licState: [
          { required: true, message: "请选择许可证状态", trigger: "change" }
        ],
      }
    };
  },
  watch: {
    initData(val){
      this.editEcho();
    }
  },
  methods: {
    //编辑回显
    editEcho() {
      if (this.handleState === 'edit' || this.handleState === 'change') {
        Object.keys(this.entity).forEach((key) => {
          if (this.initData[key]) {
            this.entity[key] = this.initData[key];
          }
        });
        this.$refs["form"].validate();
      }
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
      return new Promise((resolve, reject) => {
        this.$refs["form"].resetFields();
      });
    },
    licenceNull() {
      if( this.entity.creditCode &&  this.entity.creditCode.length == 0){
        return;
      }
      //当前统一社会信用代码没有可用的许可证
      this.$alert("该统一社会信用代码对应了其它主体类型", "提示", {
        confirmButtonText: "确定",
        callback: r => {
          this.entity.creditCode = null;
          this.entity.legalPerson = null;
          this.creditCodeList = [];
          this.licenceTypeFilter = [];
        }
      });
    },
    licenceTimeValid(rule, value, callback) {
      if (this.entity.licEnd == null || this.entity.licBegin == "" || this.entity.licEnd == "") {
        callback(new Error("请选择有效期"));
      } else {
        callback();
      }
    },
    licenceNoValid(rule, value, callback){
      if(!this.entity.licenceType){
        callback(new Error("请先选择许可证类型"));
      }
      if (value.length > 32) {
        callback(new Error("许可证号长度不能超过32个字符"))
      }
      let params = {licenceType:this.entity.licenceType,licenceNo:value}
      if(this.handleState == 'change'){
        params.entityId = this.initData.entityId;
      }
      countLicence(params).then((r) => {
        if(r.data > 0){
          callback(new Error("许可证编号重复"));
        } else {
          callback();
        }
      })
    },
    creditCodeValid(rule, value, callback) {
      this.creditCodeList = [];
      this.licenceTypeFilter = [];
      //信用代码变化时
      //只有无证无照没有统一社会信用代码
      if (this.natureType == "YZYZ" || this.natureType == "YZWZ") {
        let entityId = this.handleState == 'change'?this.initData.entityId : null;
        getSubBycreditCode(value,entityId).then(r => {
          if (!r.data || r.data.length == 0) {//统一社会信用代码可用
            callback();
            return;
          };
          //统一社会信用代码已被其他主体占用，列出被占用的许可证类型
          for(let i=0; i<r.data.length; i++){
            this.creditCodeList.push({
              licenceTypeStr: r.data[i].licenceTypeStr,
              licence: r.data[i].licence
            });
            this.licenceTypeFilter.push(r.data[i].licenceType);
          }

          this.entity.legalPerson = r.data[0].legalPerson; //法人姓名
          this.entity.creditType = r.data[0].creditType; //主体工商备案状态
        });
        callback();
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.tag {
  border-radius: 0;
  background: #eff7f9;
  border: 1px solid #c2eaf8;
  padding: 8px 10px;
  line-height: 0px;
  line-height: 16px;
  margin: 5px 0;
  color: #33b2df;
  font-size: 14px;
  display: block !important;
}
.selectHeight {
  margin-left: 0px !important;
}
.right-info .content{
  width: 870px;
}
.row .el-form-item{
  min-width: 400px;
}
</style>
