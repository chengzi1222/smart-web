<template>
  <div class="content">
    <div class="row">
      <el-form-item :class="editInfoList.designPressure?'font-color':''" label="设计压力：">
        <el-input v-if="type=='edit'" placeholder="请输入设计压力" maxlength="30" class="w180" v-model="equipmentDatas.designPressure"></el-input>
        <span v-else :class="editInfoList.designPressure?'fontColor':''">{{equipmentDatas.designPressure?equipmentDatas.designPressure:'无'}}</span>
        <b>(MPa)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.workPressure?'font-color':''" label="工作压力：">
        <el-input v-if="type=='edit'" placeholder="请输入工作压力" maxlength="30" class="w180" v-model="equipmentDatas.workPressure"></el-input>
        <span v-else :class="editInfoList.workPressure?'fontColor':''">{{equipmentDatas.workPressure?equipmentDatas.workPressure:'无'}}</span>
        <b>(MPa)</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.maxWorkPressure?'font-color':''" label="最高工作压力：">
        <el-input v-if="type=='edit'" placeholder="请输入最高工作压力" maxlength="30" class="w180" v-model="equipmentDatas.maxWorkPressure"></el-input>
        <span v-else :class="editInfoList.maxWorkPressure?'fontColor':''">{{equipmentDatas.maxWorkPressure?equipmentDatas.maxWorkPressure:'无'}}</span>
        <b>(MPa)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.trailPressure?'font-color':''" label="试验压力：">
        <el-input v-if="type=='edit'" placeholder="请输入试验压力" maxlength="30" class="w180" v-model="equipmentDatas.trailPressure"></el-input>
        <span v-else :class="editInfoList.trailPressure?'fontColor':''">{{equipmentDatas.trailPressure?equipmentDatas.trailPressure:'无'}}</span>
        <b>(MPa)</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.designTemperature?'font-color':''" label="设计温度：">
        <el-input v-if="type=='edit'" placeholder="请输入设计温度" maxlength="30" class="w180" v-model="equipmentDatas.designTemperature"></el-input>
        <span v-else :class="editInfoList.designTemperature?'fontColor':''">{{equipmentDatas.designTemperature?equipmentDatas.designTemperature:'无'}}</span>
        <b>℃</b>
      </el-form-item>
      <el-form-item :class="editInfoList.trailTemperature?'font-color':''" label="试验温度：" style="margin-left: 22px;">
        <el-input v-if="type=='edit'" placeholder="请输入试验温度" maxlength="30" class="w180" v-model="equipmentDatas.trailTemperature"></el-input>
        <span v-else :class="editInfoList.trailTemperature?'fontColor':''">{{equipmentDatas.trailTemperature?equipmentDatas.trailTemperature:'无'}}</span>
        <b>℃</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.workTemperature?'font-color':''" label="工作温度：">
        <el-input v-if="type=='edit'" placeholder="请输入工作温度" maxlength="30" class="w180" v-model="equipmentDatas.workTemperature"></el-input>
        <span v-else :class="editInfoList.workTemperature?'fontColor':''">{{equipmentDatas.workTemperature?equipmentDatas.workTemperature:'无'}}</span>
        <b>℃</b>
      </el-form-item>
      <el-form-item :class="editInfoList.outDiameter?'font-color':''" label="外径：" style="margin-left: 22px;">
        <el-input v-if="type=='edit'" placeholder="请输入外径" maxlength="30" class="w180" v-model="equipmentDatas.outDiameter"></el-input>
        <span v-else :class="editInfoList.outDiameter?'fontColor':''">{{equipmentDatas.outDiameter?equipmentDatas.outDiameter:'无'}}</span>
        <b>(m)</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.insideDiameter?'font-color':''" label="内径：">
        <el-input v-if="type=='edit'" placeholder="请输入内径" maxlength="30" class="w180" v-model="equipmentDatas.insideDiameter"></el-input>
        <span v-else :class="editInfoList.insideDiameter?'fontColor':''">{{equipmentDatas.insideDiameter?equipmentDatas.insideDiameter:'无'}}</span>
        <b>(m)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.actualThickness?'font-color':''" label="实测厚度：" style="margin-left: 17px;">
        <el-input v-if="type=='edit'" placeholder="请输入实测厚度" maxlength="30" class="w180" v-model="equipmentDatas.actualThickness"></el-input>
        <span v-else :class="editInfoList.actualThickness?'fontColor':''">{{equipmentDatas.actualThickness?equipmentDatas.actualThickness:'无'}}</span>
        <b>(mm)</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.vesselNorm?'font-color':''" label="容器规格：">
        <el-input v-if="type=='edit'" placeholder="请输入容器规格" maxlength="30" class="w180" v-model="equipmentDatas.vesselNorm"></el-input>
        <span v-else :class="editInfoList.vesselNorm?'fontColor':''">{{equipmentDatas.vesselNorm?equipmentDatas.vesselNorm:'无'}}</span>
        <b>(mm)</b>
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