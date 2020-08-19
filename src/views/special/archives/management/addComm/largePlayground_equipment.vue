<template>
  <div class="content">
    <div class="row">
      <el-form-item :class="editInfoList.drivingType?'font-color':''" label="驱动型式：">
        <el-input v-if="type=='edit'" placeholder="请输入驱动型式" maxlength="30" class="w180" v-model="equipmentDatas.drivingType"></el-input>
        <span v-else :class="editInfoList.drivingType?'fontColor':''">{{equipmentDatas.drivingType?equipmentDatas.drivingType:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.ratedLoad?'font-color':''" label="额定负载：">
        <el-input v-if="type=='edit'" placeholder="请输入额定负载" maxlength="30" class="w180" v-model="equipmentDatas.ratedLoad"></el-input>
        <span v-else :class="editInfoList.ratedLoad?'fontColor':''">{{equipmentDatas.ratedLoad?equipmentDatas.ratedLoad:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.ratedSpeed?'font-color':''" label="额定速度：">
        <el-input v-if="type=='edit'" placeholder="请输入额定速度" maxlength="30" class="w180" v-model="equipmentDatas.ratedSpeed"></el-input>
        <span v-else :class="editInfoList.ratedSpeed?'fontColor':''">{{equipmentDatas.ratedSpeed?equipmentDatas.ratedSpeed:'无'}}</span>
        <b>(m/s)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.slope?'font-color':''" label="倾夹角或坡度：" :style="{marginLeft: type!='info'?'-22px':''}">
        <el-input v-if="type=='edit'" placeholder="请输入倾夹角或坡度" maxlength="30" class="w180" v-model="equipmentDatas.slope"></el-input>
        <span v-else :class="editInfoList.slope?'fontColor':''">{{equipmentDatas.slope?equipmentDatas.slope:'无'}}</span>
        <b>(度)</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.auxiliarySpeed?'font-color':''" label="副速度：">
        <el-input v-if="type=='edit'" placeholder="请输入副速度" maxlength="30" class="w180" v-model="equipmentDatas.auxiliarySpeed"></el-input>
        <span v-else :class="editInfoList.auxiliarySpeed?'fontColor':''">{{equipmentDatas.auxiliarySpeed?equipmentDatas.auxiliarySpeed:'无'}}</span>
        <b>(m/s)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.mainPower?'font-color':''" label="驱动主功率：" :style="{marginLeft: type!='info'?'-22px':''}">
        <el-input v-if="type=='edit'" placeholder="请输入驱动主功率" maxlength="30" class="w180" v-model="equipmentDatas.mainPower"></el-input>
        <span v-else :class="editInfoList.mainPower?'fontColor':''">{{equipmentDatas.mainPower?equipmentDatas.mainPower:'无'}}</span>
        <b>(kw)</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.voltage?'font-color':''" label="电压：">
        <el-input v-if="type=='edit'" placeholder="请输入电压" maxlength="30" class="w180" v-model="equipmentDatas.voltage"></el-input>
        <span v-else :class="editInfoList.voltage?'fontColor':''">{{equipmentDatas.voltage?equipmentDatas.voltage:'无'}}</span>
        <b>(v)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.auxiliaryPower?'font-color':''" label="副功率：" :style="{marginLeft: type!='info'?'-8px':''}">
        <el-input v-if="type=='edit'" placeholder="请输入副功率" maxlength="30" class="w180" v-model="equipmentDatas.auxiliaryPower"></el-input>
        <span v-else :class="editInfoList.auxiliaryPower?'fontColor':''">{{equipmentDatas.auxiliaryPower?equipmentDatas.auxiliaryPower:'无'}}</span>
        <b>(kw)</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.cabinAltitude?'font-color':''" label="座舱高度：">
        <el-input v-if="type=='edit'" placeholder="请输入座舱高度" maxlength="30" class="w180" v-model="equipmentDatas.cabinAltitude"></el-input>
        <span v-else :class="editInfoList.cabinAltitude?'fontColor':''">{{equipmentDatas.cabinAltitude?equipmentDatas.cabinAltitude:'无'}}</span>
        <b>(m)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.rotaryDiameter?'font-color':''" label="回转直径：" :style="{marginLeft: type!='info'?'-11px':''}">
        <el-input v-if="type=='edit'" placeholder="请输入回转直径" maxlength="30" class="w180" v-model="equipmentDatas.rotaryDiameter"></el-input>
        <span v-else :class="editInfoList.rotaryDiameter?'fontColor':''">{{equipmentDatas.rotaryDiameter?equipmentDatas.rotaryDiameter:'无'}}</span>
        <b>(mm)</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.slideHeight?'font-color':''" label="水滑梯高度：">
        <el-input v-if="type=='edit'" placeholder="请输入水滑梯高度" maxlength="30" class="w180" v-model="equipmentDatas.slideHeight"></el-input>
        <span v-else :class="editInfoList.slideHeight?'fontColor':''">{{equipmentDatas.slideHeight?equipmentDatas.slideHeight:'无'}}</span>
        <b>(m)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.poolDepth?'font-color':''" label="游乐池水深：" :style="{marginLeft: type!='info'?'-11px':''}">
        <el-input v-if="type=='edit'" placeholder="请输入游乐池水深" maxlength="30" class="w180" v-model="equipmentDatas.poolDepth"></el-input>
        <span v-else :class="editInfoList.poolDepth?'fontColor':''">{{equipmentDatas.poolDepth?equipmentDatas.poolDepth:'无'}}</span>
        <b>(m)</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.gauge?'font-color':''" label="轨距：">
        <el-input v-if="type=='edit'" placeholder="请输入轨距" maxlength="30" class="w180" v-model="equipmentDatas.gauge"></el-input>
        <span v-else :class="editInfoList.gauge?'fontColor':''">{{equipmentDatas.gauge?equipmentDatas.gauge:'无'}}</span>
        <b>(m)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.gaugeLength?'font-color':''" label="轨距长度：" :style="{marginLeft: type!='info'?'-11px':''}">
        <el-input v-if="type=='edit'" placeholder="请输入轨距长度" maxlength="30" class="w180" v-model="equipmentDatas.gaugeLength"></el-input>
        <span v-else :class="editInfoList.gaugeLength?'fontColor':''">{{equipmentDatas.gaugeLength?equipmentDatas.gaugeLength:'无'}}</span>
        <b>(mm)</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.facilitiesHeight?'font-color':''" label="游乐设施高度：">
        <el-input v-if="type=='edit'" placeholder="请输入游乐设施高度" maxlength="30" class="w180" v-model="equipmentDatas.facilitiesHeight"></el-input>
        <span v-else :class="editInfoList.facilitiesHeight?'fontColor':''">{{equipmentDatas.facilitiesHeight?equipmentDatas.facilitiesHeight:'无'}}</span>
        <b>(m)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.facilitiesLinePeed?'font-color':''" label="游乐设施线速度：" :style="{marginLeft: type!='info'?'-11px':''}">
        <el-input v-if="type=='edit'" placeholder="请输入游乐设施线速度" maxlength="30" class="w180" v-model="equipmentDatas.facilitiesLinePeed"></el-input>
        <span v-else :class="editInfoList.facilitiesLinePeed?'fontColor':''">{{equipmentDatas.facilitiesLinePeed?equipmentDatas.facilitiesLinePeed:'无'}}</span>
        <b>(m/s)</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.ratedPassengersNum?'font-color':''" label="额定乘客人数：">
        <el-input v-if="type=='edit'" placeholder="请输入额定乘客人数" maxlength="30" class="w180" v-model="equipmentDatas.ratedPassengersNum"></el-input>
        <span v-else :class="editInfoList.ratedPassengersNum?'fontColor':''">{{equipmentDatas.ratedPassengersNum?equipmentDatas.ratedPassengersNum:'无'}}</span>
        <b>(v)</b>
      </el-form-item>
      <el-form-item :class="editInfoList.yardArea?'font-color':''" label="车场面积：" :style="{marginLeft: type!='info'?'-8px':''}">
        <el-input v-if="type=='edit'" placeholder="请输入车场面积" maxlength="30" class="w180" v-model="equipmentDatas.yardArea"></el-input>
        <span v-else :class="editInfoList.yardArea?'fontColor':''">{{equipmentDatas.yardArea?equipmentDatas.yardArea:'无'}}</span>
        <b>(平方米)</b>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.carTotal?'font-color':''" label="车辆总数：">
        <el-input v-if="type=='edit'" placeholder="请输入车辆总数" maxlength="30" class="w180" v-model="equipmentDatas.carTotal"></el-input>
        <span v-else :class="editInfoList.carTotal?'fontColor':''">{{equipmentDatas.carTotal?equipmentDatas.carTotal:'无'}}</span>
        <b>(辆)</b>
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