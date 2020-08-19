<template>
  <!-- <el-form :model="entity" :rules="rules" ref="form" label-width="130px" class="demo-ruleForm labW150 right-info"> -->
      <div class="contentCard" v-if="licence.licenceType != 'ONE_CATEGORY'">
        <p>{{licence.licenceType === 'ONE_CATEGORY' ? 'Ⅰ类医疗器械备案信息' : (licence.licenceType === 'TWO_CATEGORY' ? 'Ⅱ类医疗器械备案信息' : 'Ⅲ类医疗器械许可证信息')}}</p>
        <div class="row red">
          <el-form-item :label="getLicenceNoLabel()" prop="licenceNo">
            <span v-if="showType === 'info'">{{this.licence.licenceNo ? this.licence.licenceNo : '暂无'}}</span>
            <el-input v-if="showType !== 'info'" @blur="licenceNoChange"  class="w200" :maxlength="30" v-model="licence.licenceNo" :placeholder="getLicenceNoPlaceholder()"></el-input>
            <span v-if="showType !== 'info'" style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;line-height: 18px;">{{licence.licenceType === 'ONE_CATEGORY' ? '(选填)' : '(必填)'}}</span>
            <div v-if="licenceNoDisplay" class="reDiv">请输入编号</div>
          </el-form-item>
          <el-form-item :label="getLicenceStateLabel()" prop="licenceState">
            <span v-if="showType === 'info'">{{this.licence.licenceStateStr ? this.licence.licenceStateStr : '暂无'}}</span>
            <el-select v-if="showType !== 'info'" clearable  @change="licenceStateChange"  class="w200 selectHeight" v-model="licence.licenceState" placeholder="请选择许可状态" style="margin-left: 0px !important;">
              <el-option v-for="item in licenceStateList" :key="item.key" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
            <span v-if="showType !== 'info'" style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;line-height: 18px;">{{licence.licenceType === 'ONE_CATEGORY' ? '(选填)' : '(必填)'}}</span>
            <div v-if="licenceStateDisplay" class="reDiv">请选择状态</div>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="经营场所:">
            <span v-if="showType === 'info'">{{this.licence.spaceAddr ? this.licence.spaceAddr : '暂无'}}</span>
            <el-input v-if="showType !== 'info'" @blur="validated" class="w200" :maxlength="100" v-model="licence.spaceAddr" placeholder="请输入经营场所"></el-input>
          </el-form-item>
          <el-form-item label="仓库地址:">
            <span v-if="showType === 'info'">{{this.licence.otherAddr ? this.licence.otherAddr : '暂无'}}</span>
            <el-input v-if="showType !== 'info'" @blur="validated" class="w200" :maxlength="100" v-model="licence.otherAddr" placeholder="请输入仓库地址"></el-input>
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="经营方式:">
            <span v-if="showType === 'info'">{{this.licence.manageTypeStr ? this.licence.manageTypeStr : '暂无'}}</span>
            <el-select v-if="showType !== 'info'" clearable  @change="validated"  class="w200 selectHeight" v-model="licence.manageType" placeholder="请选择经营方式" style="margin-left: 0px !important;">
              <el-option v-for="item in manageTypeList" :key="item.key" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="发证部门:">
            <span v-if="showType === 'info'">{{this.licence.certificationDept ? this.licence.certificationDept : '暂无'}}</span>
            <el-input v-if="showType !== 'info'" @blur="validated" class="w200" :maxlength="30" v-model="licence.certificationDept" placeholder="请输入发证部门名称"></el-input>
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="发证日期:">
            <span v-if="showType === 'info'">{{this.licence.beginDate ? new Date(this.licence.beginDate).getFullYear() + '-' + (new Date(this.licence.beginDate).getMonth() + 1) + '-' + new Date(this.licence.beginDate).getDate() : '暂无'}}</span>
            <el-date-picker :editable="false" v-if="showType !== 'info'" class="w200" @change="validated" v-model="licence.beginDate" :picker-options="pickerOptions0" placeholder="请选择发证日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="有效期至:" v-if="licence.licenceType !== 'TWO_CATEGORY'">
            <span v-if="showType === 'info'">{{this.licence.endDate ? new Date(this.licence.endDate).getFullYear() + '-' + (new Date(this.licence.endDate).getMonth() + 1) + '-' + new Date(this.licence.endDate).getDate() : '暂无'}}</span>
            <el-date-picker :editable="false" v-if="showType !== 'info'" class="w200" @change="validated" v-model="licence.endDate" :picker-options="pickerOptions1" placeholder="请选择截至日期"></el-date-picker>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="负责人:">
            <span v-if="showType === 'info'">{{this.licence.corpPerson ? this.licence.corpPerson : '暂无'}}</span>
            <el-input v-if="showType !== 'info'" @blur="validated" class="w200" :maxlength="30" v-model="licence.corpPerson" placeholder="请输入负责人"></el-input>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item :label="getLabel2002(licence.licenceType)">
            <span v-if="showType === 'info'">{{this.licence.maaiLicenceExts[0].scopeContext ? this.licence.maaiLicenceExts[0].scopeContext : '暂无'}}</span>
            <el-input v-if="showType !== 'info'" class="w350" type="textarea" v-model="licence.maaiLicenceExts[0].scopeContext" :placeholder="getPlaceholder2002(licence.licenceType)" :maxlength="3000" :rows="6"></el-input>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item :label="getLabel2017(licence.licenceType)">
            <span v-if="showType === 'info'">{{this.licence.maaiLicenceExts[1].scopeContext ? this.licence.maaiLicenceExts[1].scopeContext : '暂无'}}</span>
            <el-input v-if="showType !== 'info'" class="w350" type="textarea" v-model="licence.maaiLicenceExts[1].scopeContext" :placeholder="getPlaceholder2017(licence.licenceType)" :maxlength="3000" :rows="6"></el-input>
          </el-form-item>
        </div>
      </div>
  <!-- </el-form> -->
</template>˙˙

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
      common.getEnums(['com.ybveg.govx.enums.maai.MaaiManagerTypeEnum'], false).then(r => {
        this.manageTypeList = r.data;
      });

      this.validated();
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
      Type: String
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
      manageTypeList: [],
      licenceNoDisplay: false,
      licenceStateDisplay: false,
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
      }
    };
  },
  methods: {
    validated() {
      this.$emit("getData", this.entity);
    },
    licenceStateChange () {
      let display
      if (this.licence.licenceType === 'ONE_CATEGORY') {
        display = true
      } else {
        display = !(!this.licence.licenceState)
      }
      this.licenceStateDisplay = !display
      this.validated()
      return display
    },
    licenceNoChange () {
      let display
      if (this.licence.licenceType === 'ONE_CATEGORY') {
        display = true
      } else {
        display = !(!this.licence.licenceNo)
      }
      this.licenceNoDisplay = !display
      this.validated()
      return display
    },
    getLabel2002 (category) {
      let label
      if (category === 'ONE_CATEGORY') {
        label = 'Ⅰ类器械经营范围（2002版）:'
      } else if (category === 'TWO_CATEGORY') {
        label = 'Ⅱ类器械经营范围（2002版）:'
      } else if (category === 'THREE_CATEGORY') {
        label = 'Ⅲ类器械经营范围（2002版）:'
      }
      return label
    },
    getLabel2017 (category) {
      let label
      if (category === 'ONE_CATEGORY') {
        label = 'Ⅰ类器械经营范围（2017版）:'
      } else if (category === 'TWO_CATEGORY') {
        label = 'Ⅱ类器械经营范围（2017版）:'
      } else if (category === 'THREE_CATEGORY') {
        label = 'Ⅲ类器械经营范围（2017版）:'
      }
      return label
    },
    getPlaceholder2017 (category) {
      let placeholder
      if (category === 'ONE_CATEGORY') {
        placeholder = '请输入Ⅰ类器械经营范围，如果经营范围参考2017版医疗器械分类目录则在此处填写，3000字以内，选填'
      } else if (category === 'TWO_CATEGORY') {
        placeholder = '请输入Ⅱ类器械经营范围，如果经营范围参考2017版医疗器械分类目录则在此处填写，3000字以内，选填'
      } else if (category === 'THREE_CATEGORY') {
        placeholder = '请输入Ⅲ类器械经营范围，如果经营范围参考2017版医疗器械分类目录则在此处填写，3000字以内，选填'
      }
      return placeholder
    },
    getPlaceholder2002 (category) {
      let placeholder
      if (category === 'ONE_CATEGORY') {
        placeholder = '请输入Ⅰ类器械经营范围，如果经营范围参考2002版医疗器械分类目录则在此处填写，3000字以内，选填'
      } else if (category === 'TWO_CATEGORY') {
        placeholder = '请输入Ⅱ类器械经营范围，如果经营范围参考2002版医疗器械分类目录则在此处填写，3000字以内，选填'
      } else if (category === 'THREE_CATEGORY') {
        placeholder = '请输入Ⅲ类器械经营范围，如果经营范围参考2002版医疗器械分类目录则在此处填写，3000字以内，选填'
      }
      return placeholder
    },
    getLicenceNoPlaceholder () {
      let placeholder
      if (this.licence.licenceType === 'ONE_CATEGORY') {
        placeholder = '请输入Ⅰ类医疗器械备案编号'
      } else if (this.licence.licenceType === 'TWO_CATEGORY') {
        placeholder = '请输入Ⅱ类医疗器械备案编号'
      } else if (this.licence.licenceType === 'THREE_CATEGORY') {
        placeholder = '请输入Ⅲ类医疗器械许可证编号'
      }
      return placeholder
    },
    getLicenceNoLabel () {
      let placeholder
      if (this.licence.licenceType === 'ONE_CATEGORY' || this.licence.licenceType === 'TWO_CATEGORY') {
        placeholder = '备案编号'
      }  else if (this.licence.licenceType === 'THREE_CATEGORY') {
        placeholder = '许可证编号'
      }
      return placeholder
    },
    getLicenceStateLabel() {
      let placeholder
      if (this.licence.licenceType === 'ONE_CATEGORY' || this.licence.licenceType === 'TWO_CATEGORY') {
        placeholder = '备案状态'
      }  else if (this.licence.licenceType === 'THREE_CATEGORY') {
        placeholder = '许可状态'
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
