<template>
  <div class="content">
    <div class="row">
      <el-form-item :class="editInfoList.registerDate?'font-color':''" label="注册登记日期：">
        <el-date-picker v-if="type=='edit'" value-format="yyyy-MM-dd" class="sleq padRightNo mr10 w180" type="date" :editable="false" placeholder="选择注册登记日期"
          v-model="registerDatas.registerDate"></el-date-picker>
        <span v-else :class="editInfoList.registerDate?'fontColor':''">{{registerDatas.registerDate?registerDatas.registerDate:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.registerPerson?'font-color':''" label="注册登记人员：">
        <el-input v-if="type=='edit'" placeholder="请输入注册登记人员" maxlength="30" class="w180" v-model="registerDatas.registerPerson"></el-input>
        <span v-else :class="editInfoList.registerPerson?'fontColor':''">{{registerDatas.registerPerson?registerDatas.registerPerson:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.registerMechanism?'font-color':''" label="注册登记机构：">
        <el-input v-if="type=='edit'" placeholder="请输入注册登记机构" maxlength="30" class="w180" v-model="registerDatas.registerMechanism"></el-input>
        <span v-else :class="editInfoList.registerMechanism?'fontColor':''">{{registerDatas.registerMechanism?registerDatas.registerMechanism:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.propertyUnit?'font-color':''" label="产权单位：">
        <el-input v-if="type=='edit'" placeholder="请输入 产权单位" maxlength="30" class="w180" v-model="registerDatas.propertyUnit"></el-input>
        <span v-else :class="editInfoList.propertyUnit?'fontColor':''">{{registerDatas.propertyUnit?registerDatas.propertyUnit:'无'}}</span>
      </el-form-item>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    registerDatas: {
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