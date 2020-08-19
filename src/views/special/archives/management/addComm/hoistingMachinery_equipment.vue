<template>
  <div class="content">
    <div class="row">
      <el-form-item :class="editInfoList.workLevel?'font-color':''" label="工作级别：">
        <el-input v-if="type=='edit'" placeholder="请输入工作级别" maxlength="30" class="w180" v-model="equipmentDatas.workLevel"></el-input>
        <span v-else :class="editInfoList.workLevel?'fontColor':''">{{equipmentDatas.workLevel?equipmentDatas.workLevel:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.liftHeight?'font-color':''" label="提升高度：">
        <el-input v-if="type=='edit'" placeholder="请输入提升高度" maxlength="30" class="w180" v-model="equipmentDatas.liftHeight"></el-input>
        <span v-else :class="editInfoList.liftHeight?'fontColor':''">{{equipmentDatas.liftHeight?equipmentDatas.liftHeight:'无'}}</span>
        <b>(m)</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.span?'font-color':''" label="跨度：">
        <el-input v-if="type=='edit'" placeholder="请输入跨度" maxlength="30" class="w180" v-model="equipmentDatas.span"></el-input>
        <span v-else :class="editInfoList.span?'fontColor':''">{{equipmentDatas.span?equipmentDatas.span:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.liftSpeed?'font-color':''" label="起升速度：">
        <el-input v-if="type=='edit'" placeholder="请输入起升速度" maxlength="30" class="w180" v-model="equipmentDatas.liftSpeed"></el-input>
        <span v-else :class="editInfoList.liftSpeed?'fontColor':''">{{equipmentDatas.liftSpeed?equipmentDatas.liftSpeed:'无'}}</span>
        <b>(mm)</b>
      </el-form-item>
    </div>

    <div class="row">
      <el-form-item :class="editInfoList.fetchInstallation?'font-color':''" label="取物装置：">
        <el-input v-if="type=='edit'" placeholder="请输入取物装置" maxlength="30" class="w180" v-model="equipmentDatas.fetchInstallation"></el-input>
        <span v-else :class="editInfoList.fetchInstallation?'fontColor':''">{{equipmentDatas.fetchInstallation?equipmentDatas.fetchInstallation:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.driverCabForm?'font-color':''" label="司机室型式：">
        <el-input v-if="type=='edit'" placeholder="请输入司机室型式" maxlength="30" class="w180" v-model="equipmentDatas.driverCabForm"></el-input>
        <span v-else :class="editInfoList.driverCabForm?'fontColor':''">{{equipmentDatas.driverCabForm?equipmentDatas.driverCabForm:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.controlForm?'font-color':''" label="操纵型式：">
        <el-input v-if="type=='edit'" placeholder="请输入操纵型式" maxlength="30" class="w180" v-model="equipmentDatas.controlForm"></el-input>
        <span v-else :class="editInfoList.controlForm?'fontColor':''">{{equipmentDatas.controlForm?equipmentDatas.controlForm:'无'}}</span>
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