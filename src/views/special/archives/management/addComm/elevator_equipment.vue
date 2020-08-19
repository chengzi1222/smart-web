<template>
  <div class="content">
    <div class="row">
      <el-form-item :class="editInfoList.elevatorType?'font-color':''" label="电梯型号：">
        <el-input v-if="type=='edit'" placeholder="请输入电梯型号" maxlength="30" class="w180" v-model="equipmentDatas.elevatorType"></el-input>
        <span v-else :class="editInfoList.elevatorType?'fontColor':''">{{equipmentDatas.elevatorType?equipmentDatas.elevatorType:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.equipmentSpecification?'font-color':''" label="设备规格：">
        <el-input v-if="type=='edit'" placeholder="请输入设备规格" maxlength="30" class="w180" v-model="equipmentDatas.equipmentSpecification"></el-input>
        <span v-else :class="editInfoList.equipmentSpecification?'fontColor':''">{{equipmentDatas.equipmentSpecification?equipmentDatas.equipmentSpecification:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.equipmentForm?'font-color':''" label="设备型式：">
        <el-input v-if="type=='edit'" placeholder="请输入设备型式" maxlength="30" class="w180" v-model="equipmentDatas.equipmentForm"></el-input>
        <span v-else :class="editInfoList.equipmentForm?'fontColor':''">{{equipmentDatas.equipmentForm?equipmentDatas.equipmentForm:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.ratedLoad?'font-color':''" label="额定载荷：">
        <el-input v-if="type=='edit'" placeholder="请输入额定载荷" maxlength="30" class="w180" v-model="equipmentDatas.ratedLoad"></el-input>
        <span v-else :class="editInfoList.ratedLoad?'fontColor':''">{{equipmentDatas.ratedLoad?equipmentDatas.ratedLoad:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.speed?'font-color':''" label="速度：">
        <el-input v-if="type=='edit'" placeholder="请输入速度" maxlength="30" class="w180" v-model="equipmentDatas.speed"></el-input>
        <span v-else :class="editInfoList.speed?'fontColor':''">{{equipmentDatas.speed?equipmentDatas.speed:'无'}}</span>
        <b>(m/s)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.liftingHeight?'font-color':''" label="提升高度：":style="{marginLeft: type!='info'?'-22px':''}">
        <el-input v-if="type=='edit'" placeholder="请输入提升高度" maxlength="30" class="w180" v-model="equipmentDatas.liftingHeight"></el-input>
        <span v-else :class="editInfoList.liftingHeight?'fontColor':''">{{equipmentDatas.liftingHeight?equipmentDatas.liftingHeight:'无'}}</span>
        <b>(m)</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.width?'font-color':''" label="宽度：">
        <el-input v-if="type=='edit'" placeholder="请输入宽度" maxlength="30" class="w180" v-model="equipmentDatas.width"></el-input>
        <span v-else :class="editInfoList.width?'fontColor':''">{{equipmentDatas.width?equipmentDatas.width:'无'}}</span>
        <b>(m)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.layers?'font-color':''" label="层数：":style="{marginLeft: type!='info'?'-12px':''}">
        <el-input v-if="type=='edit'" placeholder="请输入层数" maxlength="30" class="w180" v-model="equipmentDatas.layers"></el-input>
        <span v-else :class="editInfoList.layers?'fontColor':''">{{equipmentDatas.layers?equipmentDatas.layers:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.stations?'font-color':''" label="站数：">
        <el-input v-if="type=='edit'" placeholder="请输入站数" maxlength="30" class="w180" v-model="equipmentDatas.stations"></el-input>
        <span v-else :class="editInfoList.stations?'fontColor':''">{{equipmentDatas.stations?equipmentDatas.stations:'无'}}</span>
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