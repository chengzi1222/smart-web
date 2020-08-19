<template>
  <div style="position: relative;">
    <div class="page-tilt">
      <b></b><span>{{$route.query.stateType=='add'?'添加':'编辑'}}设备</span>
    </div>
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
          <basics :entityType="entityType" :basicsDatas="basicsDatas"></basics>
        </toggle-form>
        <toggle-form :title="$route.query.entityType=='ELEVATOR'?'使用单位及楼盘':'使用单位'">
          <useBox :useDatas="useDatas" :oks="oks"></useBox>
        </toggle-form>
        <toggle-form title="维保单位信息">
          <maintenance :maintenanceDatas="maintenanceDatas" :oks="oks"></maintenance>
        </toggle-form>
        <toggle-form title="最新检验信息">
          <newBox :newDatas="newDatas" @empty="empty" @boxShowFun="boxShowFun"></newBox>
        </toggle-form>
        <toggle-form title="注册信息">
          <register :registerDatas="registerDatas"></register>
        </toggle-form>
        <toggle-form title="制造及安装">
          <manufacture :manufactureDatas="manufactureDatas"></manufacture>
        </toggle-form>
        <toggle-form title="设备参数">
          <elevator_equipment :equipmentDatas="equipmentDatas" v-if="$route.query.entityType=='ELEVATOR'"></elevator_equipment>
          <boiler_equipment :equipmentDatas="equipmentDatas" v-if="$route.query.entityType=='BOILER'"></boiler_equipment>
          <pressureVessel_equipment :equipmentDatas="equipmentDatas" v-if="$route.query.entityType=='PRESSURE_VESSEL'"></pressureVessel_equipment>
          <pressurePiping_equipment :equipmentDatas="equipmentDatas" v-if="$route.query.entityType=='PRESSURE_PIPING'"></pressurePiping_equipment>
          <hoistingMachinery_equipment :equipmentDatas="equipmentDatas" v-if="$route.query.entityType=='HOISTING_MACHINERY'"></hoistingMachinery_equipment>
          <passengerRopeway_equipment :equipmentDatas="equipmentDatas" v-if="$route.query.entityType=='PASSENGER_ROPEWAY'"></passengerRopeway_equipment>
          <largePlayground_equipment :equipmentDatas="equipmentDatas" v-if="$route.query.entityType=='LARGE_PLAYGROUND'"></largePlayground_equipment>
          <mechanicallyPropelledVehicle_equipment :equipmentDatas="equipmentDatas" v-if="$route.query.entityType=='MECHANICALLY_PROPELLED_VEHICLE'"></mechanicallyPropelledVehicle_equipment>
        </toggle-form>
      </el-form>
    </div>
    <!-- 底部按钮 start-->
    <div class="foot-btn" style="z-index:98">
      <div>
        <el-button @click="goback">取消并关闭</el-button>
        <el-button @click="update" :disabled="false" type="primary">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import basics from './addComm/basics.vue'
  import useBox from './addComm/use.vue'
  import maintenance from './addComm/maintenance.vue'
  import register from './addComm/register.vue'
  import newBox from './addComm/new.vue'
  import manufacture from './addComm/manufacture.vue'
  import elevator_equipment from './addComm/elevator_equipment.vue'
  import boiler_equipment from './addComm/boiler_equipment.vue'
  import pressureVessel_equipment from './addComm/pressureVessel_equipment.vue'
  import pressurePiping_equipment from './addComm/pressurePiping_equipment.vue'
  import hoistingMachinery_equipment from './addComm/hoistingMachinery_equipment.vue'
  import passengerRopeway_equipment from './addComm/passengerRopeway_equipment.vue'
  import largePlayground_equipment from './addComm/largePlayground_equipment.vue'
  import mechanicallyPropelledVehicle_equipment from './addComm/mechanicallyPropelledVehicle_equipment.vue'

  import scroll from "utils/scroll";
  import ToggleForm from "components/ToggleForm.vue";

  import { postEntityAdd, getEntityFind, postEntityEdit } from "api/special/elevator";
  export default {
    data(){
      return {
        slideIndex: 0,
        progress: [],
        stateType: 'edit',
        boxShow: false,
        entityType: '',
        basicsDatas: {},
        useDatas: {},
        maintenanceDatas: {},
        newDatas: {},
        manufactureDatas: {},
        equipmentDatas: {},
        registerDatas: {},
        oks: ''
      }
    },
    mounted() {
      if (this.$route.query.entityType == 'ELEVATOR') {
        this.progress = [
          { title: '基础信息', },
          { title: '使用单位及楼盘', },
          { title: '维保单位信息', },
          { title: '最新检验信息', },
          { title: '注册信息', },
          { title: '制造及安装', },
          { title: '设备参数', }
        ]
      } else {
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
      this.stateType = this.$route.query.stateType
      this.entityType = this.$route.query.entityType;
      if(this.$route.query.stateType == 'upload'){
        getEntityFind({ entityId: this.$route.query.id, entityType: this.$route.query.entityType }).then(r => {
          if (r.status) {
            this.basicsDatas = r.data.basicEntityDto;
            this.useDatas = r.data.entityEmployDto;
            this.useDatas.tungs = r.data.entityEmployDto.tung;
            this.useDatas.units = r.data.entityEmployDto.unit;
            if (r.data.entityMaintainDto) { this.maintenanceDatas = r.data.entityMaintainDto; }
            if (r.data.practiceReportDto) { this.newDatas = r.data.practiceReportDto; }
            if (r.data.registerDto) { this.registerDatas = r.data.registerDto; }
            if (r.data.makeInstallDto) { this.manufactureDatas = r.data.makeInstallDto; }

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
            this.oks = 'a'
          }
        })
      }
      setTimeout(() => {
        scroll.call(this, 'slideIndex');
      }, 0);
    },
    methods: {
      goback() {
        history.back();
      },
      boxShowFun(b){
        this.boxShow = b;
      },
      empty() {
        this.newDatas = {};
      },
      update() {
        if(!this.basicsDatas.registerCode){
          this.$message.error('请输入设备注册代码')
          return
        }
        if (!this.basicsDatas.entityState) {
          this.$message.error('请选择设备状态')
          return
        }
        if (!this.useDatas.employId) {
          this.$message.error('请选择使用单位')
          return
        }
        if (this.boxShow && !this.newDatas.number) {
          this.$message.error('请输入检验报告编号')
          return
        }
        if (this.boxShow && !this.newDatas.verdict) {
          this.$message.error('请输入检验结论')
          return
        }
        let params = {
          id: this.basicsDatas.id,
          entityType: this.entityType,
          qrCode: this.basicsDatas.qrCode,   //二维码编号
          registerCode: this.basicsDatas.registerCode,  //设备注册代码
          registerCardNo: this.basicsDatas.registerCardNo,  //使用登记证号
          entityName: this.basicsDatas.entityName,  //设备名称
          entityVarieties: this.basicsDatas.entityVarieties,  //电梯品种
          outdoorIndoor: this.basicsDatas.outdoorIndoor,  //室内外
          usePlace: this.basicsDatas.usePlace,  //使用场所
          entityState: this.basicsDatas.entityState,  //电梯状态
          stopDate: this.basicsDatas.stopDate,  //停用日期
          oldEquipment: this.basicsDatas.oldEquipment,  //是否老设备
          address: this.basicsDatas.address,  //设备使用地址
          lat: this.basicsDatas.lat,  //设备使用地址经度
          lng: this.basicsDatas.lng,  //设备使用地址维度
          employId: this.useDatas.employId,  //使用单位id
          insideNumber: this.useDatas.insideNumber,  //单位内部编号
          maintainId:this.maintenanceDatas.maintainId? this.maintenanceDatas.maintainId:'',  //维保单位id
          maintainPerson:this.maintenanceDatas.maintainPerson,  //维保人员
          maintainNo:this.maintenanceDatas.maintainNo,  //维保人员身份证
          maintainMobile:this.maintenanceDatas.maintainMobile,  //维保人员电话
          maintainContractDate:this.maintenanceDatas.maintainContractDate,  //维保合同有效期
          registerDate: this.registerDatas.registerDate,  //注册登记日期
          registerPerson: this.registerDatas.registerPerson,  //注册登记人员
          registerMechanism: this.registerDatas.registerMechanism,  //注册登记机构
          propertyUnit: this.registerDatas.propertyUnit,  //产权单位
          mfUnit: this.manufactureDatas.mfUnit,  //制造单位
          mfCreditCode: this.manufactureDatas.mfCreditCode,  //制造单位信用代码
          mfLicence: this.manufactureDatas.mfLicence,  //制造单位许可证
          mfDate: this.manufactureDatas.mfDate,  //制造日期
          startNumber: this.manufactureDatas.startNumber,  //出场编号
          installUnit: this.manufactureDatas.installUnit,  //安装单位
          installCreditCode: this.manufactureDatas.installCreditCode,  //安装单位信用代码
          installDate: this.manufactureDatas.installDate,  //安装竣工日期
          acceptance: this.manufactureDatas.acceptance,  //验收检验机构
          acceptanceNumber: this.manufactureDatas.acceptanceNumber,  //验收报告编号
        }
        if(this.boxShow) {
          params.inspectReport = { //检验报告
            number: this.newDatas.number,  //检验报告编号
            type: this.newDatas.type,  //检验类别
            verdict: this.newDatas.verdict,  //检验结论
            inspectDate: this.newDatas.inspectDate,  //检验日期
            nextInspectDate: this.newDatas.nextInspectDate,  //下次检验日期
            inspectName: this.newDatas.inspectName,  //检验单位名称
            inspectLicence: this.newDatas.inspectLicence,  //检验机构核准证
            inspectPerson: this.newDatas.inspectPerson,  //检验人员
            problems: this.newDatas.problems,  //问题描述
            remark: this.newDatas.remark,  //检验备注
            documentFileId: this.newDatas.documentFileId,  //文档附件
            pictureFileId: this.newDatas.pictureFileId,  //图片附件
          }
        }
        
        switch (this.$route.query.entityType) {
          case 'ELEVATOR':
            params.elevator = { //电梯
              entityId: this.basicsDatas.id,
              entityType: 'ELEVATOR',
              buildingId: this.useDatas.buildingId,  //楼盘id
              tung: this.useDatas.tung, //所在栋
              unit: this.useDatas.unit,  //所在单元
              elevatorType: this.equipmentDatas.elevatorType,  //电梯型号
              equipmentSpecification: this.equipmentDatas.equipmentSpecification,  //设备规格
              equipmentForm: this.equipmentDatas.equipmentForm,  //设备型式
              ratedLoad: this.equipmentDatas.ratedLoad,  //额定载荷
              speed: this.equipmentDatas.speed,  //速度
              liftingHeight: this.equipmentDatas.liftingHeight,  //提升高度
              width: this.equipmentDatas.width,  //宽度
              layers: this.equipmentDatas.layers,  //层数
              stations: this.equipmentDatas.stations,  //站数
            }
            break;
          case 'BOILER':
            params.boiler = { //锅炉
              entityId: this.basicsDatas.id,
              entityType: 'BOILER',
              boilerType: this.equipmentDatas.boilerType,  //锅炉型号
              boilerUse: this.equipmentDatas.boilerUse,  //锅炉用途
              combustionMode: this.equipmentDatas.combustionMode,  //燃烧方式
              fuelType: this.equipmentDatas.fuelType,  //燃料种类
              ratedOutput: this.equipmentDatas.ratedOutput,  //额定出力
              roPressure: this.equipmentDatas.roPressure,  //再热器出口压力
              roTemperature: this.equipmentDatas.roTemperature,  //再热器出口温度
              waterMethod: this.equipmentDatas.waterMethod,  //水处理方式
              workingPressure: this.equipmentDatas.workingPressure,  //工作压力
            }
            break;
          case 'PRESSURE_VESSEL':
            params.vessel = { //压力容器
              entityId: this.basicsDatas.id,
              entityType: 'PRESSURE_VESSEL',
              actualThickness: this.equipmentDatas.actualThickness,  //实测厚度
              designPressure: this.equipmentDatas.designPressure,  //设计压力
              designTemperature: this.equipmentDatas.designTemperature,  //设计温度
              insideDiameter: this.equipmentDatas.insideDiameter,  //内径
              maxWorkPressure: this.equipmentDatas.maxWorkPressure,  //最高工作压力
              outDiameter: this.equipmentDatas.outDiameter,  //外径
              trailPressure: this.equipmentDatas.trailPressure,  //试验压力
              trailTemperature: this.equipmentDatas.trailTemperature,  //试验温度
              vesselNorm: this.equipmentDatas.vesselNorm,  //容器规格
              workPressure: this.equipmentDatas.workPressure,  //工作压力
              workTemperature: this.equipmentDatas.workTemperature,  //工作温度
            }
            break;
          case 'PRESSURE_PIPING':
            params.piping = { //压力管道
              entityId: this.basicsDatas.id,
              entityType: 'PRESSURE_PIPING',
              aczoilingMeterials: this.equipmentDatas.aczoilingMeterials,  //防腐层材料
              adiabatMaterials: this.equipmentDatas.adiabatMaterials,  //绝热层材料
              adiabatThickness: this.equipmentDatas.adiabatThickness,  //绝热层厚度
              beginUseDate: this.equipmentDatas.beginUseDate,  //投用日期
              converyMedia: this.equipmentDatas.converyMedia,  //输送介质
              corrosionMeasure: this.equipmentDatas.corrosionMeasure,  //腐蚀预量
              designPressure: this.equipmentDatas.designPressure,  //设计压力
              designTemperature: this.equipmentDatas.designTemperature,  //设计温度
              installationName: this.equipmentDatas.installationName,  //装置名称
              layWay: this.equipmentDatas.layWay,  //管道铺设方式
              length: this.equipmentDatas.length,  //管道长度
              level: this.equipmentDatas.level,  //管道级别
              norm: this.equipmentDatas.norm,  //管道规格
              origin: this.equipmentDatas.origin,  //管道起点
              terminus: this.equipmentDatas.terminus,  //管道止点
              workPressure: this.equipmentDatas.workPressure,  //工作压力
              workTemperature: this.equipmentDatas.workTemperature,  //工作温度
            }
            break;
          case 'HOISTING_MACHINERY':
            params.crane = { //起重机械
              entityId: this.basicsDatas.id,
              entityType: 'HOISTING_MACHINERY',
              controlForm: this.equipmentDatas.controlForm,  //操纵形式
              driverCabForm: this.equipmentDatas.driverCabForm,  //司机室形式
              fetchInstallation: this.equipmentDatas.fetchInstallation,  //取物装置
              liftHeight: this.equipmentDatas.liftHeight,  //提升高度
              liftSpeed: this.equipmentDatas.liftSpeed,  //起升速度
              span: this.equipmentDatas.span,  //跨度
              workLevel: this.equipmentDatas.workLevel,  //工作级别
            }
            break;
          case 'PASSENGER_ROPEWAY':
            params.cableway = { //客栈索道
              entityId: this.basicsDatas.id,
              entityType: 'PASSENGER_ROPEWAY',
              longness: this.equipmentDatas.longness,  //索道长度
              ratedLoad: this.equipmentDatas.ratedLoad,  //额定负载
              speed: this.equipmentDatas.speed,  //运行速度
              vehicleType: this.equipmentDatas.vehicleType,  //运载车辆型式
            }
            break;
          case 'LARGE_PLAYGROUND':
            params.amusement = { //游乐设施
              entityId: this.basicsDatas.id,
              entityType: 'LARGE_PLAYGROUND',
              auxiliaryPower: this.equipmentDatas.auxiliaryPower,  //副功率
              auxiliarySpeed: this.equipmentDatas.auxiliarySpeed,  //副速度
              cabinAltitude: this.equipmentDatas.cabinAltitude,  //座舱高度
              carTotal: this.equipmentDatas.carTotal,  //车辆总数
              drivingType: this.equipmentDatas.drivingType,  //驱动型式
              facilitiesHeight: this.equipmentDatas.facilitiesHeight,  //游乐设施高度
              facilitiesLinePeed: this.equipmentDatas.facilitiesLinePeed,  //游乐设施线速度
              gauge: this.equipmentDatas.gauge,  //轨距
              gaugeLength: this.equipmentDatas.gaugeLength,  //轨距长度
              mainPower: this.equipmentDatas.mainPower,  //驱动主功率
              poolDepth: this.equipmentDatas.poolDepth,  //游乐池水深
              ratedLoad: this.equipmentDatas.ratedLoad,  //额定载荷
              ratedPassengersNum: this.equipmentDatas.ratedPassengersNum,  //额定乘客人数
              ratedSpeed: this.equipmentDatas.ratedSpeed,  //额定速度
              rotaryDiameter: this.equipmentDatas.rotaryDiameter,  //回转直径
              slideHeight: this.equipmentDatas.slideHeight,  //水滑梯高度
              slope: this.equipmentDatas.slope,  //倾夹角或坡度
              voltage: this.equipmentDatas.voltage,  //电压
              yardArea: this.equipmentDatas.yardArea,  //车场面积
            }
            break;
          case 'MECHANICALLY_PROPELLED_VEHICLE':
            params.vehicle = { //专用车辆
              entityId: this.basicsDatas.id,
              entityType: 'MECHANICALLY_PROPELLED_VEHICLE',
              cabSeating: this.equipmentDatas.cabSeating,  //驾驶室定员
              color: this.equipmentDatas.color,  //颜色
              emptyCarWeight: this.equipmentDatas.emptyCarWeight,  //空车重量
              engineNumber: this.equipmentDatas.engineNumber,  //发动机编号
              factoryNumber: this.equipmentDatas.factoryNumber,  //出厂编号
              fuelType: this.equipmentDatas.fuelType,  //燃油类型
              licenseNumber: this.equipmentDatas.licenseNumber,  //牌照号码
              powerMode: this.equipmentDatas.powerMode,  //动力方式
              ratedWeight: this.equipmentDatas.ratedWeight,  //额定重量
              runningSpeed: this.equipmentDatas.runningSpeed,  //运行速度
            }
            break;
        }
        if (this.$route.query.stateType=='add') {
          postEntityAdd(params).then(r => {
            if (r.status) {
              this.$message.success('添加成功')
              history.back();
            }
          })
        }else {
          params.entityStateStr = document.getElementById('entityStateStr').value;
          params.outdoorIndoorStr = document.getElementById('outdoorIndoor').value;
          params.oldEquipmentStr = document.getElementById('oldEquipment').value;
          params.entityVarietiesStr = document.getElementById('entityVarieties').children[1].innerHTML.replace(/ /g,'').replace(/\n/g,'');
          params.usePlaceStr = document.getElementById('usePlace').value; 
          switch (this.$route.query.entityType) {
            case 'ELEVATOR':
              params.entityTypeStr = '电梯';
              break;
            case 'BOILER':
              params.entityTypeStr = '锅炉';
              break;
            case 'PRESSURE_VESSEL':
              params.entityTypeStr = '压力容器';
              break;
            case 'PRESSURE_PIPING':
              params.entityTypeStr = '压力管道';
              break;
            case 'HOISTING_MACHINERY':
              params.entityTypeStr = '起重机械';
              break;
            case 'PASSENGER_ROPEWAY':
              params.entityTypeStr = '客运索道';
              break;
            case 'LARGE_PLAYGROUND':
              params.entityTypeStr = '大型游乐设施';
              break;
            case 'MECHANICALLY_PROPELLED_VEHICLE':
              params.entityTypeStr = '场内专用车辆';
              break;
          }
          postEntityEdit(params).then(r => {
            if(r.status){
              this.$message.success('编辑成功')
              history.back();
            }
          })
        }
      }
    },
    components: {
      ToggleForm, 
      basics, useBox, maintenance, register, manufacture, newBox,
      elevator_equipment, boiler_equipment, pressureVessel_equipment, pressurePiping_equipment,
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
  margin-top: 80px;
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