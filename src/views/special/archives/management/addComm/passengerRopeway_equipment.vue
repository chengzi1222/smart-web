<template>
  <div class="content">
    <div class="row">
      <el-form-item :class="editInfoList.speed?'font-color':''" label="运行速度：">
        <el-input v-if="type=='edit'" placeholder="请输入运行速度" maxlength="30" class="w180" v-model="equipmentDatas.speed"></el-input>
        <span v-else :class="editInfoList.speed?'fontColor':''">{{equipmentDatas.speed?equipmentDatas.speed:'无'}}</span>
        <b>(m/s)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.longness?'font-color':''" label="索道长度：" style="margin-left: -23px;">
        <el-input v-if="type=='edit'" placeholder="请输入索道长度" maxlength="30" class="w180" v-model="equipmentDatas.longness"></el-input>
        <span v-else :class="editInfoList.longness?'fontColor':''">{{equipmentDatas.longness?equipmentDatas.longness:'无'}}</span>
        <b>(m)</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.ratedLoad?'font-color':''" label="额定负载：">
        <el-input v-if="type=='edit'" placeholder="请输入额定负载" maxlength="30" class="w180" v-model="equipmentDatas.ratedLoad"></el-input>
        <span v-else :class="editInfoList.ratedLoad?'fontColor':''">{{equipmentDatas.ratedLoad?equipmentDatas.ratedLoad:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.vehicleType?'font-color':''" label="运载车辆型式：">
        <el-input v-if="type=='edit'" placeholder="请输入运载车辆型式" maxlength="30" class="w180" v-model="equipmentDatas.vehicleType"></el-input>
        <span v-else :class="editInfoList.vehicleType?'fontColor':''">{{equipmentDatas.vehicleType?equipmentDatas.vehicleType:'无'}}</span>
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