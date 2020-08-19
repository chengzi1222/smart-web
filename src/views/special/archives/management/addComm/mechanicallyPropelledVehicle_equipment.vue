<template>
  <div class="content">
    <div class="row">
      <el-form-item :class="editInfoList.licenseNumber?'font-color':''" label="牌照号码：">
        <el-input v-if="type=='edit'" placeholder="请输入牌照号码" maxlength="30" class="w180" v-model="equipmentDatas.licenseNumber"></el-input>
        <span v-else :class="editInfoList.licenseNumber?'fontColor':''">{{equipmentDatas.licenseNumber?equipmentDatas.licenseNumber:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.engineNumber?'font-color':''" label="发动机编号：">
        <el-input v-if="type=='edit'" placeholder="请输入发动机编号" maxlength="30" class="w180" v-model="equipmentDatas.engineNumber"></el-input>
        <span v-else :class="editInfoList.engineNumber?'fontColor':''">{{equipmentDatas.engineNumber?equipmentDatas.engineNumber:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.factoryNumber?'font-color':''" label="出厂(底盘)编号：">
        <el-input v-if="type=='edit'" placeholder="请输入编号" maxlength="30" class="w180" v-model="equipmentDatas.factoryNumber"></el-input>
        <span v-else :class="editInfoList.factoryNumber?'fontColor':''">{{equipmentDatas.factoryNumber?equipmentDatas.factoryNumber:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.ratedWeight?'font-color':''" label="额定重量：">
        <el-input v-if="type=='edit'" placeholder="请输入额定重量" maxlength="30" class="w180" v-model="equipmentDatas.ratedWeight"></el-input>
        <span v-else :class="editInfoList.ratedWeight?'fontColor':''">{{equipmentDatas.ratedWeight?equipmentDatas.ratedWeight:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.runningSpeed?'font-color':''" label="运行速度：">
        <el-input v-if="type=='edit'" placeholder="请输入运行速度" maxlength="30" class="w180" v-model="equipmentDatas.runningSpeed"></el-input>
        <span v-else :class="editInfoList.runningSpeed?'fontColor':''">{{equipmentDatas.runningSpeed?equipmentDatas.runningSpeed:'无'}}</span>
        <b>(km/h)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.powerMode?'font-color':''" label="动力方式：" style="margin-left: -27px;">
        <el-input v-if="type=='edit'" placeholder="请输入动力方式" maxlength="30" class="w180" v-model="equipmentDatas.powerMode"></el-input>
        <span v-else :class="editInfoList.powerMode?'fontColor':''">{{equipmentDatas.powerMode?equipmentDatas.powerMode:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.cabSeating?'font-color':''" label="驾驶室定员：">
        <el-input v-if="type=='edit'" placeholder="请输入驾驶室定员" maxlength="30" class="w180" v-model="equipmentDatas.cabSeating"></el-input>
        <span v-else :class="editInfoList.cabSeating?'fontColor':''">{{equipmentDatas.cabSeating?equipmentDatas.cabSeating:'无'}}</span>
        <b>(人)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.fuelType?'font-color':''" label="燃油类型：" style="margin-left: -14px;">
        <el-input v-if="type=='edit'" placeholder="请输入燃油类型" maxlength="30" class="w180" v-model="equipmentDatas.fuelType"></el-input>
        <span v-else :class="editInfoList.fuelType?'fontColor':''">{{equipmentDatas.fuelType?equipmentDatas.fuelType:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.emptyCarWeight?'font-color':''" label="空车重量：">
        <el-input v-if="type=='edit'" placeholder="请输入空车重量" maxlength="30" class="w180" v-model="equipmentDatas.emptyCarWeight"></el-input>
        <span v-else :class="editInfoList.emptyCarWeight?'fontColor':''">{{equipmentDatas.emptyCarWeight?equipmentDatas.emptyCarWeight:'无'}}</span>
        <b>(kg)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.color?'font-color':''" label="颜色：" style="margin-left: -15px;">
        <el-input v-if="type=='edit'" placeholder="请输入颜色" maxlength="30" class="w180" v-model="equipmentDatas.color"></el-input>
        <span v-else :class="editInfoList.color?'fontColor':''">{{equipmentDatas.color?equipmentDatas.color:'无'}}</span>
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