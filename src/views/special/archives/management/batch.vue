<template>
  <div class="addpopup">
    <div class="addDiv inputPadd5">
      <p class="addTit">
        <span class="ml20">批量修改</span>
        <i class="el-icon-close floatR movePoin" @click="$emit('batchShowHiden')"></i>
      </p>
      <p class="tootip mt20">在字段输入框内输入‘#’字符号，可清空该字段！请谨慎使用#字符号！</p>
      <div class="iptP mt20">
        <div class="iptDiv">
          <span>使用单位名称：</span>
          <el-select v-model="datas.employId" filterable remote reserve-keyword placeholder="请输入使用单位" clearable
                     :remote-method="employUnitFun" :loading="loading" class="w162" @change="userChange">
            <el-option v-for="item in employUnitOptions" :key="item.id" :label="item.entityName"
                       :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="iptDiv"
             v-if="$route.name=='specialElevator_ElevatorArchives_indexTable' || $route.name=='specialElevator_secretElevatorArchives_indexTable'">
          <span>楼盘名称：</span>
          <el-select v-model="datas.buildingId" filterable remote reserve-keyword placeholder="请输入楼盘名称"
                     clearable class="w162" :remote-method="buildNameFun" :loading="loading" @change="userChange">
            <el-option v-for="item in buildNameOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="iptDiv" v-else>
          <span>设备状态：</span>
          <el-select class="w162" v-model="datas.entityState" placeholder="请选择设备状态" clearable>
            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="iptP mt20">
        <div class="iptDiv"
             v-if="$route.name=='specialElevator_ElevatorArchives_indexTable' || $route.name=='specialElevator_secretElevatorArchives_indexTable'">
          <span>设备状态：</span>
          <el-select class="w162" v-model="datas.entityState" placeholder="请选择设备状态" clearable>
            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="iptDiv">
          <span>类别品种：</span>
          <el-cascader class="w162" clearable placeholder="请选择设备类别与种类" :options="varietiesOptions.options"
                       :props="varietiesOptions.props" :change-on-select="true" :show-all-levels="false"
                       @change="detVarieties">
          </el-cascader>
        </div>
        <div class="iptDiv"
             v-if="$route.name!='specialElevator_ElevatorArchives_indexTable' && $route.name!='specialElevator_secretElevatorArchives_indexTable'">
          <span>室内外：</span>
          <el-select class="w162" v-model="datas.outdoorIndoor" placeholder="请选择设备属于室内还是室外" clearable>
            <el-option v-for="item in roomOptions" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="iptP mt20">
        <div class="iptDiv"
             v-if="$route.name=='specialElevator_ElevatorArchives_indexTable' || $route.name=='specialElevator_secretElevatorArchives_indexTable'">
          <span>室内外：</span>
          <el-select class="w162" v-model="datas.outdoorIndoor" placeholder="请选择设备属于室内还是室外" clearable>
            <el-option v-for="item in roomOptions" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="iptDiv">
          <span>使用场所：</span>
          <el-select class="w162" v-model="datas.usePlace" placeholder="请选择使用场所" clearable>
            <el-option v-for="item in siteOptions" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </div>
        <div class="iptDiv"
             v-if="$route.name!='specialElevator_ElevatorArchives_indexTable' && $route.name!='specialElevator_secretElevatorArchives_indexTable'">
          <span>维保单位：</span>
          <el-select v-model="datas.maintainId" filterable remote reserve-keyword placeholder="请输入维保单位" clearable
                     :remote-method="maintenanceUnitFun" :loading="loading" class="w162" @change="userChange">
            <el-option v-for="item in maintenanceUnitOptions" :key="item.id" :label="item.entityName" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="iptP mt20">
        <div class="iptDiv"
             v-if="$route.name=='specialElevator_ElevatorArchives_indexTable' || $route.name=='specialElevator_secretElevatorArchives_indexTable'">
          <span>维保单位：</span>
          <el-select v-model="datas.maintainId" filterable remote reserve-keyword placeholder="请输入维保单位" clearable
                     :remote-method="maintenanceUnitFun" :loading="loading" class="w162" @change="userChange">
            <el-option v-for="item in maintenanceUnitOptions" :key="item.id" :label="item.entityName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="iptDiv">
          <span>维保人员：</span>
          <el-input placeholder="请输入维保人员姓名" class="w162" maxlength="30" v-model="datas.maintainPerson"></el-input>
        </div>
        <div class="iptDiv"
             v-if="$route.name!='specialElevator_ElevatorArchives_indexTable' && $route.name!='specialElevator_secretElevatorArchives_indexTable'">
          <span>维保人员身份证：</span>
          <el-input placeholder="请输入维保人员身份证" class="w162" maxlength="30" v-model="datas.maintainNo"></el-input>
        </div>
      </div>
      <div class="iptP mt20">
        <div class="iptDiv"
             v-if="$route.name=='specialElevator_ElevatorArchives_indexTable' || $route.name=='specialElevator_secretElevatorArchives_indexTable'">
          <span>维保人员身份证：</span>
          <el-input placeholder="请输入维保人员身份证" class="w162" maxlength="30" v-model="datas.maintainNo"></el-input>
        </div>
        <div class="iptDiv">
          <span>维保人员电话：</span>
          <el-input placeholder="请输入维保人员电话" class="w162" maxlength="11" v-model="datas.maintainMobile"></el-input>
        </div>
        <div class="iptDiv"
             v-if="$route.name!='specialElevator_ElevatorArchives_indexTable' && $route.name!='specialElevator_secretElevatorArchives_indexTable'"></div>
      </div>
      <div class="mt20" style="margin-left: 60px;">
        <div class="iptDiv">
          <span>设备使用地址：</span>
          <el-input placeholder="请输入设备使用地址，50字以内" maxlength="50" class="w312" v-model="datas.address"></el-input>
        </div>
      </div>
      <div class="mt20" style="margin-left: 60px;">
        <div class="iptDiv">
          <span>设备地址经度：</span>
          <el-input @focus="mapShowFun(true)" placeholder="请选择设备地址经度" maxlength="100" class="w162"
                    v-model="datas.lng"></el-input>
          <span>设备地址纬度：</span>
          <el-input @focus="mapShowFun(true)" placeholder="请选择设备地址纬度" maxlength="100" class="w162"
                    v-model="datas.lat"></el-input>
        </div>
      </div>
      <yb-popup :isShow='true' v-show="mapShow" style="height: 568px;overflow: hidden;" @close="mapShowFun(false)" title='地图经纬度'>
        <div slot="body">
          <div style="width:630px;margin:30px auto 0;">
            <el-input placeholder="请输入地点名称" v-model="address" class="w350 seekIpt" @keyup.enter.native="mapSearch">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="mapSearch"></i>
            </el-input>
            <el-input placeholder="地点经度" v-model="lng" class="w100"></el-input>
            <el-input placeholder="地点纬度" v-model="lat" class="w100"></el-input>
            <div id="container"></div>
          </div>
          <div style="text-align:right">
            <el-button type="default" @click="mapShowFun(false)">取消</el-button>
            <el-button type="primary" class="mr20" @click="ampClick">确定</el-button>
          </div>
        </div>

      </yb-popup>
      <div class="btnDiv mb20">
        <el-button @click="$emit('batchShowHiden')">取消</el-button>
        <el-button type="primary" :disabled="JSON.stringify(this.datas) == '{}'&&stst" class="mr20" @click="update">确定
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  var geocoder;
  var marker;
  var map;
  import YbPopup from 'components/YbPopup';
  import {getEnums, getDicts} from 'api/common'
  import {
    getEmployKeywordList,
    getBuildingList,
    getEntityVarietiesList,
    postEntityBatchUpdate,
    getMaintainEntityKeywordPaging
  } from 'api/special/elevator'

  export default {
    props: {
      bacthList: {
        default() {
          return []
        }
      },
      entityType: {
        default() {
          return ''
        }
      }
    },

    data() {
      return {
        mapCode:'',
        lat: '',
        lng: '',
        address: '',
        mapShow: false,
        subName: '',
        siteOptions: [],
        stst: true,
        datas: {},
        addStatus: false,
        titleName: '',
        loading: false,
        employUnitSetTim: null,
        buildNameSetTim: null,
        employUnitOptions: [],
        buildNameOptions: [],
        stateOptions: [
          {
            value: 'REUSE',
            label: '在用'
          }, {
            value: 'DISCONTINUE',
            label: '停用'
          }, {
            value: 'SCRAP',
            label: '报废'
          }
        ],
        varietiesOptions: {
          props: {
            label: 'value',
            value: 'key'
          },
          options: []
        },
        roomOptions: [],
        maintenanceUnitOptions: []
      }
    },
    components: {
      YbPopup
    },
    mounted() {
      this.mapCode=this.$store.state.common.user.areaCode;
      getEntityVarietiesList({entityType: this.entityType}).then(r => {
        this.varietiesOptions.options.push(r.data);
      })
      getEnums(['com.ybveg.govx.enums.tzsb.TzsbPositionEnum'], false).then(r => {
        this.roomOptions = r.data
      })
      let types = '';
      switch (this.$route.name) {
        case 'specialElevator_ElevatorArchives_indexTable':
          types = 'TZSB_EB_PLACE'
          break;
        case 'specialElevator_secretElevatorArchives_indexTable':
          types = 'TZSB_EB_PLACE'
          break;
        case 'specialBoiler_BoilerArchives_indexTable':
          types = 'TZSB_BB_PLACE'
          break;
        case 'specialpressureVessel_pressureVesselArchives_indexTable':
          types = 'TZSB_HB_PLACE'
          break;
        case 'specialpressurePiping_pressurePipingArchives_indexTable':
          types = 'TZSB_FB_PLACE'
          break;
        case 'specialhoistingMachinery_hoistingMachineryArchives_indexTable':
          types = 'TZSB_DB_PLACE'
          break;
        case 'specialpassengerRopeway_passengerRopewayArchives_indexTable':
          types = 'TZSB_CB_PLACE'
          break;
        case 'speciallargePlayground_largePlaygroundArchives_indexTable':
          types = 'TZSB_AB_PLACE'
          break;
        case 'specialmechanicallyPropelledVehicle_mechanicallyPropelledVehicleArchives_indexTable':
          types = 'TZSB_GB_PLACE'
          break;
      }
      getDicts([types]).then(r => {
        this.siteOptions = r.data[0].list
      })
    }
    ,
    methods: {
      ampClick(){
        this.datas.lat = this.lat;
        this.datas.lng = this.lng;
        this.lng = '';
        this.lat = '';
        this.mapShow = false;
      },
      mapShowFun(state){
        if (!geocoder) {
          geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
        }
        let self = this;
        geocoder.getLocation(self.address, function (status, result) {
          if (status === 'complete' && result.geocodes.length) {
            var lnglat = result.geocodes[0].location
            self.lat = result.geocodes[0].location.lat
            self.lng = result.geocodes[0].location.lng
            if (!marker) {
              marker = new AMap.Marker({
                position: [self.lat, self.lng]
              });
            } else {
              map.remove(marker);
              marker.setPosition(lnglat)
            }
            map.add(marker);
            map.setFitView(marker);
          }
        });
        if (state) {//地图窗口打开的时候实例化地图
          map = new AMap.Map('container', {
            resizeEnable: true,
            zoom: 11,//级别
            //center: [104.062528, 30.502077],//中心点坐标
          });
          marker = new AMap.Marker({
           // position: [104.062528, 30.502077]//位置
          })
          map.add(marker);
          map.setFitView(marker);
          let that = this;
          AMap.event.addListener(map, 'click', function (e) { //添加点击事件,传入对象名，事件名，回调函数
            map.remove(marker);
            that.lat = e.lnglat.getLat();
            that.lng = e.lnglat.getLng();
            marker = new AMap.Marker({
              position: [that.lng, that.lat]//位置
            })
            map.add(marker);
            map.setFitView(marker);
            AMap.service('AMap.Geocoder', function () {//回调函数
              geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
              });
              var lnglatXY = [that.lat, that.lng];
              geocoder.getAddress(lnglatXY, function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                  //获得了有效的地址信息:
                  that.address = result.regeocode.formattedAddress;
                } else {
                  //获取地址失败
                }
              });
            })
          });
        }
        if (!state) {
          map && map.destroy();
        }
        this.lng = '';
        this.lat = '';
        this.address='';
        this.mapShow = state;
      },
      mapSearch() {
        map.remove(marker);
        if (!geocoder) {
          geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
        }
        let self = this;
        geocoder.getLocation(self.address, function (status, result) {
          if (status === 'complete' && result.geocodes.length) {
            var lnglat = result.geocodes[0].location
            self.lat = result.geocodes[0].location.lat
            self.lng = result.geocodes[0].location.lng
            if (!marker) {
              marker = new AMap.Marker({
                position: [self.lat, self.lng]
              });
            } else {
              map.remove(marker);
              marker.setPosition(lnglat)
            }
            map.add(marker);
            map.setFitView(marker);
          }
        });
      },
      maintenanceUnitFun(text) {
        clearTimeout(this.maintenanceUnitSetTim);
        this.loading = true;
        if (text != '' && text.length >= 2) {
          this.loading = false;
          this.maintenanceUnitSetTim = setTimeout(() => {
            getMaintainEntityKeywordPaging({search: text, entityType: this.entityType}).then(r => {
              this.maintenanceUnitOptions = r.data.list
            })
          }, 200);
        } else {
          this.loading = false;
          this.maintenanceUnitOptions = []
        }
      }
      ,
      userChange() {
        this.employUnitOptions = [];
        this.maintenanceUnitOptions = [];
        this.buildNameOptions = [];
      }
      ,
      update() {
        this.datas.ids = this.bacthList;
        this.datas.entityType = this.entityType;
        postEntityBatchUpdate(this.datas).then(r => {
          if (r.status) {
            this.$message.success('修改成功')
            this.$emit('batchShowHiden')
          }
        })
      }
      ,
      employUnitFun(text) {
        clearTimeout(this.employUnitSetTim);
        this.loading = true;
        if (text != '' && text.length >= 2) {
          this.loading = false;
          this.employUnitSetTim = setTimeout(() => {
            getEmployKeywordList({keyWord: text, entityType: this.entityType}).then(r => {
              this.employUnitOptions = r.data
            })
          }, 200);
        } else {
          this.loading = false;
          this.employUnitOptions = []
        }
      }
      ,
      buildNameFun(text) {
        clearTimeout(this.buildNameSetTim);
        this.loading = true;
        if (text != '' && text.length >= 2) {
          this.loading = false;
          this.buildNameSetTim = setTimeout(() => {
            getBuildingList({keysWork: text, entityType: this.entityType}).then(r => {
              this.buildNameOptions = r.data
            })
          }, 200);
        } else {
          this.loading = false;
          this.employUnitOptions = []
        }
      }
      ,
      detVarieties(id) {
        if (id.length > 0) {
          this.datas.entityVarieties = id[id.length - 1];
          this.stst = false;
        } else {
          this.datas.entityVarieties = '';
          this.stst = true;
        }
      }
      ,
    }
    ,
  }
</script>

<style scoped lang="sass">
  .addpopup{
    position:fixed;
    background: rgba(0, 0, 0, .5);
    z-index: 99;
    top: 0;

    bottom:0;

    left:0;

    right:0;

    overflow:auto;

  }

    .addDiv{
      width: 780px;

      position:absolute;
      top: 50%;
      margin-top: -250px;
      left: 50%;
      margin-left: -390px;
      background: #fff;

  }

    .addTit{
      height: 40px;
      line-height: 40px;
      background: #F2F5F8;

      i {
        font-size: 16px;
        margin-top: 12px;
        margin-right: 7px;

  } }

    .w162{
      width: 162px !important;

  }

    .w312{
      width: 312px;

  }

    .iptP{
      display:flex;

      justify-content:space-evenly;

  }

    .iptDiv{
      display:inline-block;

      position:relative;
      min-width: 300px;

      span {

        display:inline-block;
        width: 130px;

        text-align:right;
        font-size: 14px;

  } }

    .btnDiv{
      margin-top: 40px;

      text-align:right;

  }

    .tootip{
      color: #FA503B;

      text-align:left;
      font-size: 12px;
      line-height: 34px;
      border: 1px solid #FFC0C0;
      background: #FFF0EE;
      width: 610px;
      padding: 0 20px;
      height: 34px;
      margin: 0 auto;

  }

    #container {
    margin-top: 15px;

    width:620px;

    height:380px;

  }
</style>
