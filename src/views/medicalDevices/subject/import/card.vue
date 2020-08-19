<template>
      <div class="contentCard">
        <p>{{licence.licenceType === 'ONE_CATEGORY' ? 'Ⅰ类医疗器械生产备案信息' : '医疗器械生产许可证信息'}}</p>
        <div class="row red">
          <el-form-item :label="getLicenceNoLabel()" prop="licenceNo">
            <span v-if="showType === 'info'">{{licence.licenceNo ? licence.licenceNo : '暂无'}}</span>
          </el-form-item>
          <el-form-item label="许可状态" prop="licenceState">
            <span v-if="showType === 'info'">{{licence.licenceStateStr ?licence.licenceStateStr : '暂无'}}</span>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="注册场所:">
            <span v-if="showType === 'info'">{{licence.spaceAddr ? licence.spaceAddr : '暂无'}}</span>
          </el-form-item>
          <el-form-item label="生产地址:">
            <span v-if="showType === 'info'">{{licence.otherAddr ? licence.otherAddr : '暂无'}}</span>
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="负责人:">
            <span v-if="showType === 'info'">{{licence.corpPerson ? licence.corpPerson : '暂无'}}</span>
          </el-form-item>
          <el-form-item label="发证部门:">
            <span v-if="showType === 'info'">{{licence.certificationDept ? licence.certificationDept : '暂无'}}</span>
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="发证日期:">
            <span v-if="showType === 'info'">{{licence.beginDate ? new Date(licence.beginDate).getFullYear() + '-' + (new Date(licence.beginDate).getMonth() + 1) + '-' + new Date(this.licence.beginDate).getDate() : '暂无'}}</span>
          </el-form-item>
          <el-form-item label="有效期至:">
            <span v-if="showType === 'info'">{{licence.endDate ? new Date(licence.endDate).getFullYear() + '-' + (new Date(licence.endDate).getMonth() + 1) + '-' + new Date(this.licence.endDate).getDate() : '暂无'}}</span>
          </el-form-item>
        </div>
        <div class="row" v-for="licenceExt in licence.maaiLicenceExts" :key="licenceExt.$index">
          <el-form-item :label="getLabel(licenceExt.licenceType)">
            <span v-if="showType === 'info'">{{licenceExt.scopeContext ? licenceExt.scopeContext : '暂无'}}</span>
          </el-form-item>
        </div>
      </div> 
</template>

<script  type="module">
import EnumSelect from "components/common/EnumSelect";
import * as common from "api/common";

export default {
  components: {
    EnumSelect,
  },
  mounted() {
    if (this.showType !== 'info') {
      common.getEnums(['com.ybveg.govx.enums.maai.MaaiLicenceStateEnum'], false).then(r => {
        this.licenceStateList = r.data;
      });
      this.validated()
    }
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
    }
  },
  data() {
    return {
      pickerOptions0: {
        disabledDate: (time) => {
          if (this.licence.endDate) {
            return time.getTime() > this.licence.endDate;
          }

        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          if (this.licence.beginDate) {
            return time.getTime() < this.licence.beginDate;
          }
        }
      },
      licenceStateList:[],
      licenceNoDisplay: false,
      licenceStateDisplay: false,
      //主体基础信息字段
      entity: {
        
      },
    };
  },
  methods: {
    validated() {
      this.$emit("getData", this.entity);
    },

    getLabel (category) {
      let label
      if (category === 'ONE_CATEGORY') {
        label = 'Ⅰ类器械生产范围:'
      } else if (category === 'TWO_CATEGORY') {
        label = 'Ⅱ类器械生产范围:'
      } else if (category === 'THREE_CATEGORY') {
        label = 'Ⅲ类器械生产范围:'
      }
      return label
    },

    getLicenceNoLabel () {
      let placeholder
      if (this.licence.licenceType === 'ONE_CATEGORY') {
        placeholder = '备案编号'
      } else if (this.licence.licenceType === 'PRODUCT_CATEGORY') {
        placeholder = '许可证编号'
      }
      return placeholder
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
  position: relative;
  min-width: 400px;
  .reDiv{
    position: absolute;
    bottom: -15px;
    line-height: 15px;
    font-size: 12px;
    left: 0px;
    color: red;
  }
}
</style>
