<template>
  <!-- <el-form :model="entity" :rules="rules" ref="form" label-width="130px" class="demo-ruleForm labW150 right-info"> -->
      <div class="contentCard">
        <p>{{licence.licenceType === 'ONE_CATEGORY' ? 'Ⅰ类医疗器械备案信息' : (licence.licenceType === 'TWO_CATEGORY' ? 'Ⅱ类医疗器械备案信息' : 'Ⅲ类医疗器械许可证信息')}}</p>
        <div class="row red">
          <el-form-item :label="licence.licenceType === 'THREE_CATEGORY'?'许可证编号':'备案编号'" prop="licenceNo"
                        :class="showR?(Object.keys(otherMap).length==0 ? 'font-color': ( (!otherMap.licenceNo || otherMap.licenceNo == '')
                        && (!licence.licenceNo || licence.licenceNo == '') ?
                        '': (otherMap.licenceNo == licence.licenceNo ? '':'font-color') ) ):''">
            <span v-if="showType === 'info'">{{this.licence.licenceNo}}</span>
          </el-form-item>
          <el-form-item label="许可状态" prop="licenceState"
                        :class="showR?(Object.keys(otherMap).length==0  ? 'font-color': ( (!otherMap.licenceState || otherMap.licenceState == '')
                        && (!licence.licenceState || licence.licenceState == '' ) ?
                        '': (otherMap.licenceState == licence.licenceState ? '':'font-color') ) ):''">
            <span v-if="showType === 'info'">{{this.licence.licenceStateStr?this.licence.licenceStateStr:'暂无'}}</span>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="经营场所:"
                        :class="showR?(Object.keys(otherMap).length==0  ? 'font-color': ( (!otherMap.spaceAddr || otherMap.spaceAddr == '')
                        && (!licence.spaceAddr || licence.spaceAddr == '') ?
                        '': (otherMap.spaceAddr == licence.spaceAddr ? '':'font-color') ) ):''">
            <span v-if="showType === 'info'">{{this.licence.spaceAddr?this.licence.spaceAddr:'暂无'}}</span>
          </el-form-item>
          <el-form-item label="仓库地址:"
                        :class="showR?(Object.keys(otherMap).length==0  ? 'font-color': ( (!otherMap.otherAddr || otherMap.otherAddr == '')
                        && (!licence.otherAddr || licence.otherAddr == '') ?
                        '': (otherMap.otherAddr == licence.otherAddr ? '':'font-color') ) ):''">
            <span v-if="showType === 'info'">{{this.licence.otherAddr?this.licence.otherAddr:'暂无'}}</span>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="经营方式:"
                        :class="showR?(Object.keys(otherMap).length==0  ? 'font-color': ( (!otherMap.manageType || otherMap.manageType == '')
                        && (!licence.manageType || licence.manageType == '') ?
                        '': (otherMap.manageType == licence.manageType ? '':'font-color') ) ):''">
            <span v-if="showType === 'info'">{{this.licence.manageTypeStr?this.licence.manageTypeStr:'暂无'}}</span>
          </el-form-item>
          <el-form-item label="发证部门:"
                        :class="showR?(Object.keys(otherMap).length==0  ? 'font-color': ( (!otherMap.certificationDept || otherMap.certificationDept == '')
                        && (!licence.certificationDept || licence.certificationDept == '') ?
                        '': (otherMap.certificationDept == licence.certificationDept ? '':'font-color') ) ):''">
            <span v-if="showType === 'info'">{{this.licence.certificationDept?this.licence.certificationDept:'暂无'}}</span>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="发证日期:"
                        :class="showR?(Object.keys(otherMap).length==0  ? 'font-color': ( (!otherMap.beginDate || otherMap.beginDate == '')
                        && (!licence.beginDate || licence.beginDate == '') ?
                        '': (otherMap.beginDate == licence.beginDate ? '':'font-color') ) ):''">
            <span v-if="showType === 'info'">{{this.licence.beginDate ? new Date(this.licence.beginDate).getFullYear() + '-' + (new Date(this.licence.beginDate).getMonth() + 1) + '-' + new Date(this.licence.beginDate).getDate() : '暂无'}}</span>
          </el-form-item>
          <el-form-item label="有效期至:"
                        :class="showR?(Object.keys(otherMap).length==0  ? 'font-color': ( (!otherMap.endDate || otherMap.endDate == '')
                        && (!licence.endDate || licence.endDate == '') ?
                        '': (otherMap.endDate == licence.endDate ? '':'font-color') ) ):''">
            <span v-if="showType === 'info'">{{this.licence.endDate ? new Date(this.licence.endDate).getFullYear() + '-' + (new Date(this.licence.endDate).getMonth() + 1) + '-' + new Date(this.licence.endDate).getDate() : '暂无'}}</span>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="负责人:"
                        :class="showR?(Object.keys(otherMap).length==0 ? 'font-color': ( (!otherMap.corpPerson || otherMap.corpPerson == '')
                        && (!licence.corpPerson || licence.corpPerson == '') ?
                        '': (otherMap.corpPerson == licence.corpPerson ? '':'font-color') ) ):''">
            <span v-if="showType === 'info'">{{this.licence.corpPerson?this.licence.corpPerson:'暂无'}}</span>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item :label="getLabel2002(licence.licenceType)"
                        :class="showR?(Object.keys(otherMapext).length==0 ?'font-color':( (!otherMapext[0] && licence.maaiLicenceExts[0])?'font-color':(!otherMapext[0] || !otherMapext[0].scopeContext || otherMapext[0].scopeContext == '')
                        && (!licence.maaiLicenceExts[0] || !licence.maaiLicenceExts[0].scopeContext || licence.maaiLicenceExts[0].scopeContext == '') ?
                        '': (otherMapext[0].scopeContext == licence.maaiLicenceExts[0].scopeContext ? '':'font-color') ) ):''">
            <span v-if="showType === 'info'">{{!this.licence || !this.licence.maaiLicenceExts[0] || !this.licence.maaiLicenceExts[0].scopeContext?'暂无':this.licence.maaiLicenceExts[0].scopeContext}}</span>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item :label="getLabel2017(licence.licenceType)"
                        :class="showR?(Object.keys(otherMapext).length==0 ?'font-color':( (!otherMapext[1] && licence.maaiLicenceExts[1])?'font-color':(!otherMapext[1] || !otherMapext[1].scopeContext || otherMapext[1].scopeContext == '')
                        && (!licence.maaiLicenceExts[1] || !licence.maaiLicenceExts[1].scopeContext || licence.maaiLicenceExts[1].scopeContext == '') ?
                        '': (otherMapext[1].scopeContext == licence.maaiLicenceExts[1].scopeContext ? '':'font-color') ) ):''">
            <span v-if="showType === 'info'">{{!this.licence || !this.licence.maaiLicenceExts[1] || !this.licence.maaiLicenceExts[1].scopeContext?'暂无':this.licence.maaiLicenceExts[1].scopeContext}}</span>
          </el-form-item>
        </div>
        <!--( ((!otherMapext[1] && licence ) || (otherMapext[1] && !licence))?'font-color':(!otherMapext[1] || !otherMapext[1].scopeContext || otherMapext[1].scopeContext == '')-->
        <!--&& (!licence.maaiLicenceExts[1] || !licence.maaiLicenceExts[1].scopeContext || licence.maaiLicenceExts[1].scopeContext == '') ?-->
        <!--'': (otherMapext[1].scopeContext == licence.maaiLicenceExts[1].scopeContext ? '':'font-color') )-->
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
    common.getEnums(['com.ybveg.govx.enums.maai.MaaiLicenceStateEnum'], false).then(r => {
      this.licenceStateList = r.data;
    });
    common.getEnums(['com.ybveg.govx.enums.maai.MaaiManagerTypeEnum'], false).then(r => {
      this.manageTypeList = r.data;
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
      Type: String
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
      manageTypeList: [],
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
