<template>
  <div style="position: relative;">
    <!-- 左边信息悬浮栏 -->
    <div class="left-info">
      <ul class="main-block">
        <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
          <p class="floatL left">{{item.title}}</p>
        </li>
      </ul>
    </div>
    <div class="ml230">
      <el-form label-width="130px" class="demo-ruleForm labW150">
        <toggle-form title="基础信息">
          <basics :basicsDatas="basicsDatas" :type="'info'"></basics>
        </toggle-form>
        <toggle-form :title="$route.query.entityType=='ELEVATOR'?'使用单位及楼盘':'使用单位'">
          <useBox :useDatas="useDatas" :dataOk="dataOk" :type="'info'"></useBox>
        </toggle-form>
        <toggle-form title="维保单位信息">
          <maintenance :maintenanceDatas="maintenanceDatas" :type="'info'"></maintenance>
        </toggle-form>
        <toggle-form title="最新检验信息">
          <newBox :newDatas="newDatas" :type="'info'"></newBox>
        </toggle-form>
        <toggle-form title="注册信息">
          <register :registerDatas="registerDatas" :type="'info'"></register>
        </toggle-form>
        <toggle-form title="制造及安装">
          <manufacture :manufactureDatas="manufactureDatas" :type="'info'"></manufacture>
        </toggle-form>
        <toggle-form title="设备参数">
          <elevator_equipment :equipmentDatas="equipmentDatas" v-if="$route.query.entityType=='ELEVATOR'" :type="'info'"></elevator_equipment>
          <boiler_equipment :equipmentDatas="equipmentDatas" v-if="$route.query.entityType=='BOILER'" :type="'info'"></boiler_equipment>
          <pressureVessel_equipment :equipmentDatas="equipmentDatas" v-if="$route.query.entityType=='PRESSURE_VESSEL'" :type="'info'"></pressureVessel_equipment>
          <pressurePiping_equipment :equipmentDatas="equipmentDatas" v-if="$route.query.entityType=='PRESSURE_PIPING'" :type="'info'"></pressurePiping_equipment>
          <hoistingMachinery_equipment :equipmentDatas="equipmentDatas" v-if="$route.query.entityType=='HOISTING_MACHINERY'" :type="'info'"></hoistingMachinery_equipment>
          <passengerRopeway_equipment :equipmentDatas="equipmentDatas" v-if="$route.query.entityType=='PASSENGER_ROPEWAY'" :type="'info'"></passengerRopeway_equipment>
          <largePlayground_equipment :equipmentDatas="equipmentDatas" v-if="$route.query.entityType=='LARGE_PLAYGROUND'" :type="'info'"></largePlayground_equipment>
          <mechanicallyPropelledVehicle_equipment :equipmentDatas="equipmentDatas" v-if="$route.query.entityType=='MECHANICALLY_PROPELLED_VEHICLE'" :type="'info'"></mechanicallyPropelledVehicle_equipment>
        </toggle-form>
      </el-form>
    </div>
    <!-- 底部按钮 start-->
    <div class="foot-btn" style="z-index:98">
      <div>
        <el-button @click="goEdit">编辑</el-button>
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
  import { getEntityFind} from 'api/special/elevator'
  export default {
    data(){
      return {
        slideIndex: 0,
        progress: [],
        basicsDatas: {},
        useDatas: {},
        maintenanceDatas: {},
        newDatas: {},
        registerDatas: {},
        manufactureDatas: {},
        equipmentDatas: {},
        dataOk: false
      }
    },
    mounted() {
      if(this.$route.query.entityType == 'ELEVATOR'){
        this.progress = [
          { title: '基础信息', },
          { title: '使用单位及楼盘', },
          { title: '维保单位信息', },
          { title: '最新检验信息', },
          { title: '注册信息', },
          { title: '制造及安装', },
          { title: '设备参数', }
        ]
      }else {
        this.progress = [
          { title: '基础信息', },
          { title: '使用单位', },
          { title: '维保单位信息', },
          { title: '最新检验信息', },
          { title: '注册信息', },
          { title: '制造及安装', },
          { title: '设备参数', }
        ]
      }
      getEntityFind({ entityId: this.$route.query.id, entityType: this.$route.query.entityType}).then(r => {
        if(r.status){
          this.basicsDatas = r.data.basicEntityDto;
          this.useDatas = r.data.entityEmployDto; 
          this.useDatas.tungs = r.data.entityEmployDto.tung;
          this.useDatas.units = r.data.entityEmployDto.unit;
          if(r.data.entityMaintainDto){this.maintenanceDatas = r.data.entityMaintainDto;}
          if(r.data.practiceReportDto){this.newDatas = r.data.practiceReportDto;}
          if(r.data.registerDto){ this.registerDatas = r.data.registerDto;}
          if(r.data.makeInstallDto){this.manufactureDatas = r.data.makeInstallDto;}

          switch (this.$route.query.entityType) {
            case 'ELEVATOR':
              this.useDatas.tung = r.data.elevatorDto.tung;
              this.useDatas.unit = r.data.elevatorDto.unit;
              this.equipmentDatas = r.data.elevatorDto;
              break;
            case 'BOILER':
              this.equipmentDatas = r.data.boilerDto;
              break;
            case 'PRESSURE_VESSEL':
              this.equipmentDatas = r.data.vesselDto;
              break;
            case 'PRESSURE_PIPING':
              this.equipmentDatas = r.data.pipingDto;
              break;
            case 'HOISTING_MACHINERY':
              this.equipmentDatas = r.data.craneDto;
              break;
            case 'PASSENGER_ROPEWAY':
              this.equipmentDatas = r.data.cablewayDto;
              break;
            case 'LARGE_PLAYGROUND':
              this.equipmentDatas = r.data.amusementDto;
              break;
            case 'MECHANICALLY_PROPELLED_VEHICLE':
              this.equipmentDatas = r.data.vehicleDto;
              break;
          }
          this.dataOk = true;
        }
      })
      setTimeout(() => {
        scroll.call(this, 'slideIndex');
      }, 0);
    },
    methods: {
      goEdit(){
        this.$router.push({
          name: this.$route.name.split('info')[0] + 'add',
          query: {
            entityType: this.$route.query.entityType,
            stateType: 'upload',
            id: this.$route.query.id
          }
        })
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
  margin-top: 30px;
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
}

</style>