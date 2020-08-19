<template>
  <div class="content">
    <div class="row">
      <el-form-item :class="editInfoList.origin?'font-color':''" label="管道起点：">
        <el-input v-if="type=='edit'" placeholder="请输入管道起点" maxlength="30" class="w180" v-model="equipmentDatas.origin"></el-input>
        <span v-else :class="editInfoList.origin?'fontColor':''">{{equipmentDatas.origin?equipmentDatas.origin:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.terminus?'font-color':''" label="管道止点：">
        <el-input v-if="type=='edit'" placeholder="请输入管道止点" maxlength="30" class="w180" v-model="equipmentDatas.terminus"></el-input>
        <span v-else :class="editInfoList.terminus?'fontColor':''">{{equipmentDatas.terminus?equipmentDatas.terminus:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.beginUseDate?'font-color':''" label="投用日期：">
        <el-date-picker v-if="type=='edit'" value-format="yyyy-MM-dd" class="sleq padRightNo w180" type="date" v-model="equipmentDatas.beginUseDate" :editable="false" placeholder="选择投用日期"></el-date-picker>
        <span v-else :class="editInfoList.beginUseDate?'fontColor':''">{{equipmentDatas.beginUseDate?equipmentDatas.beginUseDate:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.designPressure?'font-color':''" label="设计压力：">
        <el-input v-if="type=='edit'" placeholder="请输入设计压力" maxlength="30" class="w180" v-model="equipmentDatas.designPressure"></el-input>
        <span v-else :class="editInfoList.designPressure?'fontColor':''">{{equipmentDatas.designPressure?equipmentDatas.designPressure:'无'}}</span>
        <b>(MPa)</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.workPressure?'font-color':''" label="工作压力：">
        <el-input v-if="type=='edit'" placeholder="请输入工作压力" maxlength="30" class="w180" v-model="equipmentDatas.workPressure"></el-input>
        <span v-else :class="editInfoList.workPressure?'fontColor':''">{{equipmentDatas.workPressure?equipmentDatas.workPressure:'无'}}</span>
        <b>(MPa)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.designTemperature?'font-color':''" label="设计温度：" style="margin-left: -27px;">
        <el-input v-if="type=='edit'" placeholder="请输入设计温度" maxlength="30" class="w180" v-model="equipmentDatas.designTemperature"></el-input>
        <span v-else :class="editInfoList.designTemperature?'fontColor':''">{{equipmentDatas.designTemperature?equipmentDatas.designTemperature:'无'}}</span>
        <b>℃</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.workTemperature?'font-color':''" label="工作温度：">
        <el-input v-if="type=='edit'" placeholder="请输入工作温度" maxlength="30" class="w180" v-model="equipmentDatas.workTemperature"></el-input>
        <span v-else :class="editInfoList.workTemperature?'fontColor':''">{{equipmentDatas.workTemperature?equipmentDatas.workTemperature:'无'}}</span>
        <b>℃</b>
      </el-form-item>
      <el-form-item :class="editInfoList.converyMedia?'font-color':''" label="输送介质：" style="margin-left: -6px;">
        <el-input v-if="type=='edit'" placeholder="请输入输送介质" maxlength="30" class="w180" v-model="equipmentDatas.converyMedia"></el-input>
        <span v-else :class="editInfoList.converyMedia?'fontColor':''">{{equipmentDatas.converyMedia?equipmentDatas.converyMedia:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.norm?'font-color':''" label="管道规格：">
        <el-input v-if="type=='edit'" placeholder="请输入管道规格" maxlength="30" class="w180" v-model="equipmentDatas.norm"></el-input>
        <span v-else :class="editInfoList.norm?'fontColor':''">{{equipmentDatas.norm?equipmentDatas.norm:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.adiabatMaterials?'font-color':''" label="绝热层材料：">
        <el-input v-if="type=='edit'" placeholder="请输入绝热层材料" maxlength="30" class="w180" v-model="equipmentDatas.adiabatMaterials"></el-input>
        <span v-else :class="editInfoList.adiabatMaterials?'fontColor':''">{{equipmentDatas.adiabatMaterials?equipmentDatas.adiabatMaterials:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.adiabatThickness?'font-color':''" label="绝热层厚度：">
        <el-input v-if="type=='edit'" placeholder="请输入绝热层厚度" maxlength="30" class="w180" v-model="equipmentDatas.adiabatThickness"></el-input>
        <span v-else :class="editInfoList.adiabatThickness?'fontColor':''">{{equipmentDatas.adiabatThickness?equipmentDatas.adiabatThickness:'无'}}</span>
        <b>(mm)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.layWay?'font-color':''" label="管道铺设方式：" style="margin-left: -22px;">
        <el-input v-if="type=='edit'" placeholder="请输入管道铺设方式" maxlength="30" class="w180" v-model="equipmentDatas.layWay"></el-input>
        <span v-else :class="editInfoList.layWay?'fontColor':''">{{equipmentDatas.layWay?equipmentDatas.layWay:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.installationName?'font-color':''" label="装置名称：">
        <el-input v-if="type=='edit'" placeholder="请输入装置名称" maxlength="30" class="w180" v-model="equipmentDatas.installationName"></el-input>
        <span v-else :class="editInfoList.installationName?'fontColor':''">{{equipmentDatas.installationName?equipmentDatas.installationName:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.level?'font-color':''" label="管道级别：">
        <el-input v-if="type=='edit'" placeholder="请输入管道级别" maxlength="30" class="w180" v-model="equipmentDatas.level"></el-input>
        <span v-else :class="editInfoList.level?'fontColor':''">{{equipmentDatas.level?equipmentDatas.level:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.aczoilingMeterials?'font-color':''" label="防腐层材料：">
        <el-input v-if="type=='edit'" placeholder="请输入防腐层材料" maxlength="30" class="w180" v-model="equipmentDatas.aczoilingMeterials"></el-input>
        <span v-else :class="editInfoList.aczoilingMeterials?'fontColor':''">{{equipmentDatas.aczoilingMeterials?equipmentDatas.aczoilingMeterials:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.corrosionMeasure?'font-color':''" label="腐蚀预量：">
        <el-input v-if="type=='edit'" placeholder="请输入腐蚀预量" maxlength="30" class="w180" v-model="equipmentDatas.corrosionMeasure"></el-input>
        <span v-else :class="editInfoList.corrosionMeasure?'fontColor':''">{{equipmentDatas.corrosionMeasure?equipmentDatas.corrosionMeasure:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.length?'font-color':''" label="管道长度：">
        <el-input v-if="type=='edit'" placeholder="请输入管道长度" maxlength="30" class="w180" v-model="equipmentDatas.length"></el-input>
        <span v-else :class="editInfoList.length?'fontColor':''">{{equipmentDatas.length?equipmentDatas.length:'无'}}</span>
      </el-form-item>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    equipmentDatas: {
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
  margin: 20px auto 80px;
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
.row b{
  font-size: 12px;
  font-weight: normal;
  color: #A2AAB6;
}
.fontColor{
  color: red;
}
</style>