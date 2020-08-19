<template>
  <div class="content">
    <div class="row">
      <el-form-item :class="editInfoList.ratedOutput?'font-color':''" label="额定出力：">
        <el-input v-if="type=='edit'" placeholder="请输入额定出力" maxlength="30" class="w180" v-model="equipmentDatas.ratedOutput"></el-input>
        <span v-else :class="editInfoList.ratedOutput?'fontColor':''">{{equipmentDatas.ratedOutput?equipmentDatas.ratedOutput:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.fuelType?'font-color':''" label="燃料种类：">
        <el-input v-if="type=='edit'" placeholder="请输入燃料种类" maxlength="30" class="w180" v-model="equipmentDatas.fuelType"></el-input>
        <span v-else :class="editInfoList.fuelType?'fontColor':''">{{equipmentDatas.fuelType?equipmentDatas.fuelType:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.boilerType?'font-color':''" label="锅炉型号：">
        <el-input v-if="type=='edit'" placeholder="请输入锅炉型号" maxlength="30" class="w180" v-model="equipmentDatas.boilerType"></el-input>
        <span v-else :class="editInfoList.boilerType?'fontColor':''">{{equipmentDatas.boilerType?equipmentDatas.boilerType:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.boilerUse?'font-color':''" label="锅炉用途：">
        <el-input v-if="type=='edit'" placeholder="请输入锅炉用途" maxlength="30" class="w180" v-model="equipmentDatas.boilerUse"></el-input>
        <span v-else :class="editInfoList.boilerUse?'fontColor':''">{{equipmentDatas.boilerUse?equipmentDatas.boilerUse:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.combustionMode?'font-color':''" label="燃烧方式：">
        <el-input v-if="type=='edit'" placeholder="请输入燃烧方式" maxlength="30" class="w180" v-model="equipmentDatas.combustionMode"></el-input>
        <span v-else :class="editInfoList.combustionMode?'fontColor':''">{{equipmentDatas.combustionMode?equipmentDatas.combustionMode:'无'}}</span>
        <b>(m/s)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.workingPressure?'font-color':''" label="工作压力：" style="margin-left: -22px;">
        <el-input v-if="type=='edit'" placeholder="请输入工作压力" maxlength="30" class="w180" v-model="equipmentDatas.workingPressure"></el-input>
        <span v-else :class="editInfoList.workingPressure?'fontColor':''">{{equipmentDatas.workingPressure?equipmentDatas.workingPressure:'无'}}</span>
        <b>(m)</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.roTemperature?'font-color':''" label="再热器出口温度：">
        <el-input v-if="type=='edit'" placeholder="请输入再热器出口温度" maxlength="30" class="w180" v-model="equipmentDatas.roTemperature"></el-input>
        <span v-else :class="editInfoList.roTemperature?'fontColor':''">{{equipmentDatas.roTemperature?equipmentDatas.roTemperature:'无'}}</span>
        <b>(m)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.roPressure?'font-color':''" label="再热器出口压力：" style="margin-left: -12px;">
        <el-input v-if="type=='edit'" placeholder="请输入再热器出口压力" maxlength="30" class="w180" v-model="equipmentDatas.roPressure"></el-input>
        <span v-else :class="editInfoList.roPressure?'fontColor':''">{{equipmentDatas.roPressure?equipmentDatas.roPressure:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.waterMethod?'font-color':''" label="水处理方式：">
        <el-input v-if="type=='edit'" placeholder="请输入水处理方式" maxlength="30" class="w180" v-model="equipmentDatas.waterMethod"></el-input>
        <span v-else :class="editInfoList.waterMethod?'fontColor':''">{{equipmentDatas.waterMethod?equipmentDatas.waterMethod:'无'}}</span>
        <b>(m)</b>
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