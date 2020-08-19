<template>
  <div style="position: relative;">
    <div class="page-tilt">
      <b></b><span>设备编辑记录详情</span>
    </div>
    <h2 class="nameH2 mt20">
      <span class="tit">注册代码：</span>{{$route.query.code}}
    </h2>
    <!-- 左边信息悬浮栏 -->
    <div class="left-info" :class="rList?'rList':''" v-show="JSON.stringify(allDatas)!='{}'">
      <ul class="main-block">
        <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
          <p class="floatL left">{{item.title}}</p>
        </li>
      </ul>
    </div>
    <div class="ml230" v-if="JSON.stringify(allDatas)!='{}'">
      <el-form label-width="130px" class="demo-ruleForm labW150">
        <toggle-form title="基础信息(编辑前)" v-if="allDatas.booleanBic">
          <basics :basicsDatas="allDatas.before" :editInfoList="allDatas.tzsbBasic" :type="'info'"></basics>
        </toggle-form>
        <toggle-form title="基础信息(编辑后)" v-if="allDatas.booleanBic">
          <basics :basicsDatas="allDatas.after" :type="'info'" :editInfoList="allDatas.tzsbBasic"></basics>
        </toggle-form>
        <toggle-form title="使用单位(编辑前)" v-if="allDatas.booleanEmploy">
          <useBox :useDatas="allDatas.before.tzsbEmploy" :editInfoList="allDatas.tzsbEmploy" :type="'info'"></useBox>
        </toggle-form>
        <toggle-form title="使用单位(编辑后)" v-if="allDatas.booleanEmploy">
          <useBox :useDatas="allDatas.after.tzsbEmploy" :editInfoList="allDatas.tzsbEmploy" :type="'info'"></useBox>
        </toggle-form>
        <toggle-form title="维保单位信息(编辑前)" v-if="allDatas.booleanMaintain">
          <maintenance :maintenanceDatas="allDatas.before.tzsbMaintain" :editInfoList="allDatas.tzsbMaintain" :type="'info'"></maintenance>
        </toggle-form>
        <toggle-form title="维保单位信息(编辑后)" v-if="allDatas.booleanMaintain">
          <maintenance :maintenanceDatas="allDatas.after.tzsbMaintain" :editInfoList="allDatas.tzsbMaintain" :type="'info'"></maintenance>
        </toggle-form>
        <toggle-form title="注册信息(编辑前)" v-if="allDatas.booleanRegister">
          <register :registerDatas="allDatas.before" :editInfoList="allDatas.registerDto" :type="'info'"></register>
        </toggle-form>
        <toggle-form title="注册信息(编辑后)" v-if="allDatas.booleanRegister">
          <register :registerDatas="allDatas.after" :editInfoList="allDatas.registerDto" :type="'info'"></register>
        </toggle-form>
        <toggle-form title="制造及安装(编辑前)" v-if="allDatas.booleanMakeInstall">
          <manufacture :manufactureDatas="allDatas.before" :editInfoList="allDatas.makeInstallDto" :type="'info'"></manufacture>
        </toggle-form>
        <toggle-form title="制造及安装(编辑后)" v-if="allDatas.booleanMakeInstall">
          <manufacture :manufactureDatas="allDatas.after" :editInfoList="allDatas.makeInstallDto" :type="'info'"></manufacture>
        </toggle-form>
        <toggle-form title="设备参数(编辑前)" v-if="allDatas.booleanDevice">
          <elevator_equipment :editInfoList="allDatas.elevatorDto" :equipmentDatas="allDatas.before.elevator" v-if="$route.query.entityType=='ELEVATOR'" :type="'info'"></elevator_equipment>
          <boiler_equipment :editInfoList="allDatas.boilerDto" :equipmentDatas="allDatas.before.boiler" v-if="$route.query.entityType=='BOILER'" :type="'info'"></boiler_equipment>
          <pressureVessel_equipment :editInfoList="allDatas.vesselDto" :equipmentDatas="allDatas.before.vessel" v-if="$route.query.entityType=='PRESSURE_VESSEL'" :type="'info'"></pressureVessel_equipment>
          <pressurePiping_equipment :editInfoList="allDatas.pipingDto" :equipmentDatas="allDatas.before.piping" v-if="$route.query.entityType=='PRESSURE_PIPING'" :type="'info'"></pressurePiping_equipment>
          <hoistingMachinery_equipment :editInfoList="allDatas.craneDto" :equipmentDatas="allDatas.before.crane" v-if="$route.query.entityType=='HOISTING_MACHINERY'" :type="'info'"></hoistingMachinery_equipment>
          <passengerRopeway_equipment :editInfoList="allDatas.cablewayDto" :equipmentDatas="allDatas.before.cableway" v-if="$route.query.entityType=='PASSENGER_ROPEWAY'" :type="'info'"></passengerRopeway_equipment>
          <largePlayground_equipment :editInfoList="allDatas.amusementDto" :equipmentDatas="allDatas.before.amusement" v-if="$route.query.entityType=='LARGE_PLAYGROUND'" :type="'info'"></largePlayground_equipment>
          <mechanicallyPropelledVehicle_equipment :editInfoList="allDatas.vehicleDto" :equipmentDatas="allDatas.before.vehicle" v-if="$route.query.entityType=='MECHANICALLY_PROPELLED_VEHICLE'" :type="'info'"></mechanicallyPropelledVehicle_equipment>
        </toggle-form>
        <toggle-form title="设备参数(编辑后)" v-if="allDatas.booleanDevice">
          <elevator_equipment :editInfoList="allDatas.elevatorDto" :equipmentDatas="allDatas.after.elevator" v-if="$route.query.entityType=='ELEVATOR'" :type="'info'"></elevator_equipment>
          <boiler_equipment :editInfoList="allDatas.boilerDto" :equipmentDatas="allDatas.after.boiler" v-if="$route.query.entityType=='BOILER'" :type="'info'"></boiler_equipment>
          <pressureVessel_equipment :editInfoList="allDatas.vesselDto" :equipmentDatas="allDatas.after.vessel" v-if="$route.query.entityType=='PRESSURE_VESSEL'" :type="'info'"></pressureVessel_equipment>
          <pressurePiping_equipment :editInfoList="allDatas.pipingDto" :equipmentDatas="allDatas.after.piping" v-if="$route.query.entityType=='PRESSURE_PIPING'" :type="'info'"></pressurePiping_equipment>
          <hoistingMachinery_equipment :editInfoList="allDatas.craneDto" :equipmentDatas="allDatas.after.crane" v-if="$route.query.entityType=='HOISTING_MACHINERY'" :type="'info'"></hoistingMachinery_equipment>
          <passengerRopeway_equipment :editInfoList="allDatas.cablewayDto" :equipmentDatas="allDatas.after.cableway" v-if="$route.query.entityType=='PASSENGER_ROPEWAY'" :type="'info'"></passengerRopeway_equipment>
          <largePlayground_equipment :editInfoList="allDatas.amusementDto" :equipmentDatas="allDatas.after.amusement" v-if="$route.query.entityType=='LARGE_PLAYGROUND'" :type="'info'"></largePlayground_equipment>
          <mechanicallyPropelledVehicle_equipment :editInfoList="allDatas.vehicleDto" :equipmentDatas="allDatas.after.vehicle" v-if="$route.query.entityType=='MECHANICALLY_PROPELLED_VEHICLE'" :type="'info'"></mechanicallyPropelledVehicle_equipment>
        </toggle-form>
        <toggle-form style="margin-bottom: 100px;" title="编辑记录信息">
          <div class="tabDiv mt20">
            <p>
              <span style="width: 10%;">序号</span>
              <span style="width: 30%;">操作类型</span>
              <span style="width: 30%;">操作人员</span>
              <span style="width: 30%;">操作时间</span>
            </p>
            <p>
              <span style="width: 10%;">1</span>
              <span style="width: 30%;">{{allDatas.workDto.typeStr}}</span>
              <span style="width: 30%;">{{allDatas.workDto.createUserName}}</span>
              <span style="width: 30%;">{{allDatas.workDto.createTime}}</span>
            </p>
          </div>
        </toggle-form>
      </el-form>
    </div>
    <!-- 底部按钮 start-->
    <div class="foot-btn" style="z-index:98">
      <div>
        <el-button @click="goback">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import basics from '../addComm/basics.vue'
  import useBox from '../addComm/use.vue'
  import maintenance from '../addComm/maintenance.vue'
  import newBox from '../addComm/new.vue'
  import register from '../addComm/register.vue'
  import manufacture from '../addComm/manufacture.vue'
  import elevator_equipment from '../addComm/elevator_equipment.vue'
  import boiler_equipment from '../addComm/boiler_equipment.vue'
  import pressureVessel_equipment from '../addComm/pressureVessel_equipment.vue'
  import pressurePiping_equipment from '../addComm/pressurePiping_equipment.vue'
  import hoistingMachinery_equipment from '../addComm/hoistingMachinery_equipment.vue'
  import passengerRopeway_equipment from '../addComm/passengerRopeway_equipment.vue'
  import largePlayground_equipment from '../addComm/largePlayground_equipment.vue'
  import mechanicallyPropelledVehicle_equipment from '../addComm/mechanicallyPropelledVehicle_equipment.vue'

  import scroll from "utils/scroll";
  import ToggleForm from "components/ToggleForm.vue";
  import { getWorkflowFindInfo} from 'api/special/elevator'
  export default {
    data(){
      return {
        slideIndex: 0,
        progress: [],
        allDatas: {},
        rList:false
      }
    },
    mounted() {
      getWorkflowFindInfo({workId: this.$route.query.workId}).then(r => {
        if(r.status){
          this.allDatas = r.data;
          if (this.allDatas.booleanBic) { this.progress.push({ title: '基础信息(编辑前)' }); this.progress.push({ title: '基础信息(编辑后)' }) }
          if (this.allDatas.booleanEmploy && this.$route.query.entityType == 'ELEVATOR') { this.progress.push({ title: '使用单位及楼盘(编辑前)' });this.progress.push({ title: '使用单位及楼盘(编辑后)' }) }
          if (this.allDatas.booleanEmploy && this.$route.query.entityType != 'ELEVATOR') { this.progress.push({ title: '使用单位(编辑前)' }); this.progress.push({ title: '使用单位(编辑后)' }) }
          if (this.allDatas.booleanMaintain) { this.progress.push({ title: '维保单位信息(编辑前)' }); this.progress.push({ title: '维保单位信息(编辑后)' }); }
          if (this.allDatas.booleanRegister) { this.progress.push({ title: '注册信息(编辑前)' });this.progress.push({ title: '注册信息(编辑后)' }) }
          if (this.allDatas.booleanMakeInstall) { this.progress.push({ title: '制造及安装(编辑前)' }); this.progress.push({ title: '制造及安装(编辑后)' }) }
          if (this.allDatas.booleanDevice) { this.progress.push({ title: '设备参数(编辑前)' }); this.progress.push({ title: '设备参数(编辑后)' }) }
          if (this.progress.length <= 0) { this.rList = true }
          this.progress.push({ title: '编辑记录信息' })
          setTimeout(() => {
            scroll.call(this, 'slideIndex');
          }, 0);
        }
      })
    },
    methods: {
      goback() {
        history.back();
      }
    },
    components: {
      ToggleForm, basics, useBox, maintenance, register, manufacture, 
      elevator_equipment, boiler_equipment, pressureVessel_equipment, pressurePiping_equipment, newBox,
      hoistingMachinery_equipment, passengerRopeway_equipment, largePlayground_equipment, mechanicallyPropelledVehicle_equipment
    },
  }
</script>

<style scoped lang="sass">
$c: #0db5ef;
.left-info {
  width: 210px;
  height: 560px;
  background: #fff;
  position: fixed;
  margin-left: -230px;
  margin-top: 85px;
  .head-block {
    background: #f2f5f8;
    height: 70px;
    padding: 14px 20px;
    box-sizing: border-box;
    .num {
      color: $c;
    }
  }
  .main-block {
    margin-top: 20px;
    > li {
      border-right: 2px solid #ebf1f5;
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      cursor: default;
      &:hover {
        background: #f2f5f8;
      }
      .right {
        color: #a2aab6;
      }
    }
    .activePosition {
      border-right: 2px solid $c;
      .left {
        color: $c;
      }
    }
  }
}
.ml230{
  margin-left: 230px;
  margin-bottom: 40px;
}
.tabDiv{
  border: 1px solid #ccc;
  border-right: none;
  margin-bottom: 60px;
  p{
    line-height: 35px;
    display: flex;
  }
  p:last-child{
    border-top: 1px solid #ccc;
  }
  span{
    display: inline-block;
    border-right: 1px solid #ccc;
    text-align: center;
  }
}
.rList{
  margin: 0;
}
</style>