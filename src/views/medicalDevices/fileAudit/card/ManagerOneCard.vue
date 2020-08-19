<template>
  <!-- <el-form :model="entity" :rules="rules" ref="form" label-width="130px" class="demo-ruleForm labW150 right-info"> -->
      <div class="contentCard">
        <p>多证合一许可备案信息</p>
        <div class="row red">
          <el-form-item label="许可备案编号" prop="licenceNo"
                        :class="showR?(Object.keys(otherMap).length==0 ? 'font-color': ( (!otherMap.licenceNo || otherMap.licenceNo == '')
                        && (!licence.licenceNo || licence.licenceNo == '') ?
                        '': (otherMap.licenceNo == licence.licenceNo ? '':'font-color') ) ):''">
            <span v-if="showType === 'info'">{{this.licence.licenceNo}}</span>
          </el-form-item>
          <el-form-item label="许可状态" prop="licenceState"
                        :class="showR?(Object.keys(otherMap).length==0  ? 'font-color': ( (!otherMap.licenceState || otherMap.licenceState == '')
                        && (!licence.licenceState || licence.licenceState == '' ) ?
                        '': (otherMap.licenceState == licence.licenceState ? '':'font-color') ) ):''">
            <span v-if="showType === 'info'">{{this.licence.licenceStateStr}}</span>
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="发证日期:"
                        :class="showR?(Object.keys(otherMap).length==0  ? 'font-color': ( (!otherMap.beginDate || otherMap.beginDate == '')
                        && (!licence.beginDate || licence.beginDate == '' ) ?
                        '': (otherMap.beginDate == licence.beginDate ? '':'font-color') ) ):''">
            <span v-if="showType === 'info'">{{this.licence.beginDate ? new Date(this.licence.beginDate).getFullYear() + '-' + (new Date(this.licence.beginDate).getMonth() + 1) + '-' + new Date(this.licence.beginDate).getDate() : '暂无'}}</span>
          </el-form-item>
          <el-form-item label="有效期至:"
                        :class="showR?(Object.keys(otherMap).length==0  ? 'font-color': ( (!otherMap.endDate || otherMap.endDate == '')
                        && (!licence.endDate || licence.endDate == '' ) ?
                        '': (otherMap.endDate == licence.endDate ? '':'font-color') ) ):''">
            <span v-if="showType === 'info'">{{this.licence.endDate ? new Date(this.licence.endDate).getFullYear() + '-' + (new Date(this.licence.endDate).getMonth() + 1) + '-' + new Date(this.licence.endDate).getDate() : '暂无'}}</span>
          </el-form-item>
        </div>
        <div class="row" v-for="(licenceExt,index) in licence.maaiLicenceExts" :key="licenceExt.$index">
          <el-form-item :label="getLabel(licenceExt.licenceType)"
                        :class="showR?(Object.keys(otherMapext).length==0 ?'font-color':((!otherMapext[index] && licenceExt)?'font-color': (!otherMapext[index] || !otherMapext[index].scopeContext || otherMapext[index].scopeContext == '')
                        && (!licenceExt || !licenceExt.scopeContext || licenceExt.scopeContext == '') ?
                        '': (otherMapext[index].scopeContext == licenceExt.scopeContext ? '':'font-color') ) ):''">
            <span v-if="showType === 'info'">{{licenceExt.scopeContext?licenceExt.scopeContext:'暂无'}}</span>
          </el-form-item>
        </div>
      </div>
  <!-- </el-form> -->
</template>

<script  type="module">
import EnumSelect from "components/common/EnumSelect";
import * as common from "api/common";

export default {
  components: {
    EnumSelect,
  },
  mounted() {
    common.getEnums(['com.ybveg.govx.enums.maai.MaaiLicenceStateEnum'], false).then(r => {
      this.licenceStateList = r.data;
    });
    this.validated();
    this.getLicence();
  },
  props: {
    outs: {
      type: Number
    },
    licence: {
      type: Object
    },
    showType: {
      type: String
    },
    otherLicence:{
      type:Object
    },
    showR:{
      type:Boolean
    }
  },
  data() {
    return {
      licenceStateList:[],
      //主体基础信息字段
      entity: {

      },
      rules: {
        licenceNo: [
          { required: true, message: "请输入许可编号", trigger: "blur" }
        ],
        licenceState: [
          { required: true, message: "请选择许可状态", trigger: "change" }
        ]
      },
      otherMap :{},
      otherMapext:[],
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
            resolve()
          }
          throw new Error("表单验证出错")
        });
      });
    },
    reset() {
      this.$refs["form"].resetFields();
    },
    getLabel (category) {
      let label
      if (category === 'ONE_CATEGORY') {
        label = 'Ⅰ类器械经营范围:'
      } else if (category === 'TWO_CATEGORY') {
        label = 'Ⅱ类器械经营范围:'
      } else if (category === 'THREE_CATEGORY') {
        label = 'Ⅲ类器械经营范围:'
      }
      return label
    },
    getPlaceholder (category) {
      let placeholder
      if (category === 'ONE_CATEGORY') {
        placeholder = 'Ⅰ类器械经营范围'
      } else if (category === 'TWO_CATEGORY') {
        placeholder = 'Ⅱ类器械经营范围'
      } else if (category === 'THREE_CATEGORY') {
        placeholder = 'Ⅲ类器械经营范围'
      }
      return placeholder
    },
    getLicence(){
      //许可备案信息
      let otherLicence = this.otherLicence;
      if(JSON.stringify(otherLicence) != '{}'){
        for(let m in otherLicence){
          if(otherLicence[m].licenceType == this.licence.licenceType){
            this.otherMap = otherLicence[m];
            this.otherMapext = otherLicence[m].maaiLicenceExts;
          }
        }
      }
    }
  },
  watch: {
    outs() {
      this.entity = {

      }
    }
  }
};
</script>


<style lang="scss" scoped>
.contentCard {
    width: 900px;
    background:rgba(242,245,248,1);
    margin: 20px auto;
    padding: 20px;
}
.row .el-form-item {
    min-width: 400px;
}
.font-color{
  color: red !important;
}
</style>
