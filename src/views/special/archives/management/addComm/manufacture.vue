<template>
  <div class="content">
    <div class="row">
      <el-form-item :class="editInfoList.mfUnit?'font-color':''" label="制造单位：">
        <el-input v-if="type=='edit'" placeholder="请输入制造单位" maxlength="30" class="w180" v-model="manufactureDatas.mfUnit"></el-input>
        <span v-else :class="editInfoList.mfUnit?'fontColor':''">{{manufactureDatas.mfUnit?manufactureDatas.mfUnit:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.mfCreditCode?'font-color':''" label="制造单位信用代码：">
        <el-input v-if="type=='edit'" placeholder="请输入制造单位信用代码" maxlength="30" class="w180" v-model="manufactureDatas.mfCreditCode"></el-input>
        <span v-else :class="editInfoList.mfCreditCode?'fontColor':''">{{manufactureDatas.mfCreditCode?manufactureDatas.mfCreditCode:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.mfLicence?'font-color':''" label="制造单位许可证：">
        <el-input v-if="type=='edit'" placeholder="请输入制造单位许可证号" maxlength="30" class="w180" v-model="manufactureDatas.mfLicence"></el-input>
        <span v-else :class="editInfoList.mfLicence?'fontColor':''">{{manufactureDatas.mfLicence?manufactureDatas.mfLicence:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.mfDate?'font-color':''" label="制造日期：">
        <el-date-picker v-if="type=='edit'" value-format="yyyy-MM-dd" class="sleq padRightNo w180" type="date" :editable="false" placeholder="选择制造日期"
          v-model="manufactureDatas.mfDate"></el-date-picker>
        <span v-else :class="editInfoList.mfDate?'fontColor':''">{{manufactureDatas.mfDate?manufactureDatas.mfDate:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.startNumber?'font-color':''" label="出厂编号：">
        <el-input v-if="type=='edit'" placeholder="请输入出厂编号" maxlength="30" class="w180" v-model="manufactureDatas.startNumber"></el-input>
        <span v-else :class="editInfoList.startNumber?'fontColor':''">{{manufactureDatas.startNumber?manufactureDatas.startNumber:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.installUnit?'font-color':''" label="安装单位：">
        <el-input v-if="type=='edit'" placeholder="请输入安装单位" maxlength="30" class="w180" v-model="manufactureDatas.installUnit"></el-input>
        <span v-else :class="editInfoList.installUnit?'fontColor':''">{{manufactureDatas.installUnit?manufactureDatas.installUnit:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.installCreditCode?'font-color':''" label="安装单位信用代码：">
        <el-input v-if="type=='edit'" placeholder="请输入安装单位信用代码" maxlength="30" class="w180" v-model="manufactureDatas.installCreditCode"></el-input>
        <span v-else :class="editInfoList.installCreditCode?'fontColor':''">{{manufactureDatas.installCreditCode?manufactureDatas.installCreditCode:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.installDate?'font-color':''" label="安装竣工日期：">
        <el-date-picker v-if="type=='edit'" value-format="yyyy-MM-dd" class="sleq padRightNo w180" type="date" :editable="false" placeholder="选择安装竣工日期"
          v-model="manufactureDatas.installDate"></el-date-picker>
        <span v-else :class="editInfoList.installDate?'fontColor':''">{{manufactureDatas.installDate?manufactureDatas.installDate:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.acceptance?'font-color':''" label="验收检验机构：">
        <el-input v-if="type=='edit'" placeholder="请输入验收检验机构" maxlength="30" class="w180" v-model="manufactureDatas.acceptance"></el-input>
        <span v-else :class="editInfoList.acceptance?'fontColor':''">{{manufactureDatas.acceptance?manufactureDatas.acceptance:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.acceptanceNumber?'font-color':''" label="验收报告编号：">
        <el-input v-if="type=='edit'" placeholder="请输入验收报告编号" maxlength="30" class="w180" v-model="manufactureDatas.acceptanceNumber"></el-input>
        <span v-else :class="editInfoList.acceptanceNumber?'fontColor':''">{{manufactureDatas.acceptanceNumber?manufactureDatas.acceptanceNumber:'无'}}</span>
      </el-form-item>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    manufactureDatas: {
      default: function () {
        return {}
      }
    },
    type: {
      default: function () {
        return 'edit'
      }
    },
    editInfoList: {
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped lang="sass">
.content{
  margin: 20px auto;
  width: 870px;
}
.titspan{
    font-size: 12px;
    color: rgba(162,170,182,1);
    line-height: 34px;
    display: inline-block;
    width: 264px;
    margin-top: 3px;
}
.w180{
  width: 180px;
}
.fontColor{
  color: red;
}
</style>