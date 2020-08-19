<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>{{titName}}</span>
    </div>
    <div class="mt20" style="position:relative;">
      <el-input :title="elevatorIf?'注册代码、登记证号、楼盘名、使用单位、内部编号':'注册代码、登记证号、使用单位、内部编号'" :placeholder="elevatorIf?'注册代码、登记证号、楼盘名、使用单位、内部编号':'注册代码、登记证号、使用单位、内部编号'" class="w260 seekIpt" v-model="subName" @keyup.enter.native="getEntityPaging">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getEntityPaging"></i>
      </el-input>
      <div class="filtrateDiv" :class="dowShow? 'height90':''">
        <el-select v-model="employUnit" filterable remote reserve-keyword placeholder="请输入使用单位" clearable
          :remote-method="employUnitFun" :loading="loading"  class="w150" @change="getEntityPaging">
          <el-option v-for="item in employUnitOptions" :key="item.id" :label="item.entityName" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="maintenanceUnit" filterable remote reserve-keyword placeholder="请输入维保单位" clearable
          :remote-method="maintenanceUnitFun" :loading="loading" class="w150 ml20" @change="getEntityPaging">
          <el-option v-for="item in maintenanceUnitOptions" :key="item.id" :label="item.entityName" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="buildName" filterable remote reserve-keyword placeholder="请输入楼盘名称" clearable v-if="elevatorIf"
          :remote-method="buildNameFun" :loading="loading"  class="w150 ml20" @change="getEntityPaging">
          <el-option v-for="item in buildNameOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-cascader class="w150" :class="elevatorIf?'mt20':'ml20'" clearable placeholder="设备类别与种类" :options="varietiesOptions.options"
          :props="varietiesOptions.props" :change-on-select="true" :show-all-levels="false" @change="detVarieties">
        </el-cascader>
        <el-cascader class="w150" :class="elevatorIf?'ml20':''" clearable placeholder="所属辖区" :options="deptsOptions.options"
          :props="deptsOptions.props" :change-on-select="true" :show-all-levels="false" @change="det">
        </el-cascader>
        <el-select class="w150 ml20 mt20" v-model="state" placeholder="设备状态" @change="getEntityPaging" clearable>
          <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <span class="dowShow movePoin" @click="dowShow = !dowShow">
        <i :class="!dowShow?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
      </span>
      <ul class="educeUl floatR w100" :class="educeUlDown?'educeUlDown':''" @mouseenter="educeUlDown = true" @mouseleave="educeUlDown = false">
        <li class="firstLi">导出<i class="ml10" :class="educeUlDown?'el-icon-caret-bottom':'el-icon-caret-top'"></i></li>
        <li class="childrenLi">
          <p class="movePoin" @click="down">导出本页</p>
          <p class="movePoin" @click="down('all')">导出全部</p>
        </li>
      </ul>
      <el-button @click="$router.push({name: importName,query:{entityType: entityType}})" type="primary" class="w100 floatR mr20"
                 v-if="$route.name!='specialElevator_secretElevatorArchives_indexTable'">导入</el-button>
      <el-button @click="$router.push({name: goname+'add',query:{entityType: entityType,stateType:'add'}})" type="primary" class="w76 floatR mr20" icon="el-icon-plus"
                 v-if="$route.name!='specialElevator_secretElevatorArchives_indexTable'">添加</el-button>
    </div>
    <div class="mt20" style="height: 34px;">
      <!-- 电梯 -->
      <el-button v-auth="'tzsb.biz.eb|func.batchEdit'" @click="batchFun" :disabled="multipleSelection.length <= 0"
                 v-show="$route.name=='specialElevator_secretElevatorArchives_indexTable'||$route.name=='specialElevator_ElevatorArchives_indexTable'"
                 :type="multipleSelection.length > 0?'primary':'info'" class="w100 mr10">批量操作</el-button>
      <!-- 锅炉 -->
      <el-button v-auth="'tzsb.biz.bb|func.batchEdit'" @click="batchFun" :disabled="multipleSelection.length <= 0" 
                 v-show="$route.name=='specialBoiler_BoilerArchives_indexTable'"
                 :type="multipleSelection.length > 0?'primary':'info'" class="w100 mr10">批量操作</el-button>
      <!-- 压力管道 -->
      <el-button v-auth="'tzsb.biz.fb|func.batchEdit'" @click="batchFun" :disabled="multipleSelection.length <= 0" 
                 v-show="$route.name=='specialpressurePiping_pressurePipingArchives_indexTable'"
                 :type="multipleSelection.length > 0?'primary':'info'" class="w100 mr10">批量操作</el-button>
      <!-- 压力容器 -->
      <el-button v-auth="'tzsb.biz.hb|func.batchEdit'" @click="batchFun" :disabled="multipleSelection.length <= 0" 
                 v-show="$route.name=='specialpressureVessel_pressureVesselArchives_indexTable'"
                 :type="multipleSelection.length > 0?'primary':'info'" class="w100 mr10">批量操作</el-button>
      <!-- 客运索道 -->
      <el-button v-auth="'tzsb.biz.cb|func.batchEdit'" @click="batchFun" :disabled="multipleSelection.length <= 0" 
                 v-show="$route.name=='specialpassengerRopeway_passengerRopewayArchives_indexTable'"
                 :type="multipleSelection.length > 0?'primary':'info'" class="w100 mr10">批量操作</el-button>
      <!-- 游乐设施 -->
      <el-button v-auth="'tzsb.biz.ab|func.batchEdit'" @click="batchFun" :disabled="multipleSelection.length <= 0" 
                 v-show="$route.name=='speciallargePlayground_largePlaygroundArchives_indexTable'"
                 :type="multipleSelection.length > 0?'primary':'info'" class="w100 mr10">批量操作</el-button>
      <!-- 专用机动车 -->
      <el-button v-auth="'tzsb.biz.gb|func.batchEdit'" @click="batchFun" :disabled="multipleSelection.length <= 0" 
                 v-show="$route.name=='specialmechanicallyPropelledVehicle_mechanicallyPropelledVehicleArchives_indexTable'"
                 :type="multipleSelection.length > 0?'primary':'info'" class="w100 mr10">批量操作</el-button>
      <!-- 起重机械 -->
      <el-button v-auth="'tzsb.biz.db|func.batchEdit'" @click="batchFun" :disabled="multipleSelection.length <= 0" 
                 v-show="$route.name=='specialhoistingMachinery_hoistingMachineryArchives_indexTable'"
                 :type="multipleSelection.length > 0?'primary':'info'" class="w100 mr10">批量操作</el-button>
      <el-button v-auth="'tzsb.biz.eb|func.secret'" @click="secretUpdate('YES')" :disabled="multipleSelection.length<=0" 
                 v-show="$route.name=='specialElevator_ElevatorArchives_indexTable'" :type="multipleSelection.length > 0?'primary':'info'" class="w80">涉密</el-button>
      <el-button v-auth="'tzsb.biz.eb|func.secret'" @click="secretUpdate('NO')" :disabled="multipleSelection.length<=0" 
                 v-show="$route.name=='specialElevator_secretElevatorArchives_indexTable'" :type="multipleSelection.length > 0?'primary':'info'" class="w80">解密</el-button>
    </div>
    <el-table class="table-div mt20" border :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="55"></el-table-column>
      <el-table-column show-overflow-tooltip type="index" label="序号" min-width="50"></el-table-column>
      <el-table-column show-overflow-tooltip prop="qrCode" label="二维码编号" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="registerCode" label="注册代码" min-width="130"></el-table-column>
      <el-table-column show-overflow-tooltip prop="registerCardNo" label="使用登记证号" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip label="设备状态" min-width="120">
        <template slot-scope="scope">
          <span class="entityStateSpan" :class="scope.row.entityState">{{scope.row.entityStateStr}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="address" label="使用地址" min-width="140"></el-table-column>
      <el-table-column show-overflow-tooltip prop="buildName" label="楼盘名称" min-width="120" v-if="elevatorIf"></el-table-column>
      <el-table-column show-overflow-tooltip prop="areaName" label="所属区县" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="streetName" label="所属街道" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="usePlaceStr" label="使用场所" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="employName" label="使用单位" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="insideNumber" label="单位内部编号" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="inspectName" label="检验单位" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="inspectDate" label="检验时间" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="verdict" label="检验结论" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="nextInspectDate" label="下次检验日期" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="maintainName" label="维保单位" min-width="80"></el-table-column>
      <!-- <el-table-column show-overflow-tooltip prop="recentMaintainDate" label="最近维保日期" min-width="80"></el-table-column> -->
      <el-table-column show-overflow-tooltip prop="entityName" label="设备名称" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="entityKind" label="设备类别" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="entityVarieties" label="设备品种" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="mfUnit" label="制造单位" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="installUnit" label="安装单位" min-width="80"></el-table-column>
      <el-table-column min-width="250" label="操作" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{name:goname+'add',query:{entityType: entityType,stateType:'upload',id: scope.row.id}}">编辑</router-link>
          <router-link :to="{name:goname+'info',query:{entityType: entityType,code: scope.row.registerCode,id: scope.row.id}}">详情</router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box mt20">
      <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 50, 100, 500]" :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="pageSizeChange"
        @current-change="pagecCurrentChange">
      </el-pagination>
    </div>
    <batch v-if="batchShow" @batchShowHiden="batchShowHiden" :bacthList="bacthList" :entityType="entityType"></batch>
  </div>
</template>

<script>
  import { getEntityPaging, getEmployKeywordList, getMaintainEntityKeywordPaging, getBuildingList,
           postEntitySecretUpdate, getEntityVarietiesList, getEntityExport} from 'api/special/elevator'
  import { findDeptGridNotStreet, uploadFile, downloadFile } from 'api/common'
  import batch from './batch.vue';
  import { postEmployGridList } from 'api/special/archives'
  export default {
    data() {
      return {
        titName: '',
        elevatorIf: false,
        subName: '',
        state: '',
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
        employUnit: '',
        maintenanceUnit: '',
        employUnitOptions: [], 
        maintenanceUnitOptions: [], 
        buildNameOptions: [],
        maintenanceUnitSettim: null,
        employUnitSetTim: null,
        buildNameSetTim: null,
        maintenanceUnit: '',
        buildName: '',
        category: '',
        areaCode: '',
        entityType: '',
        goname: '',
        importName: '',
        educeUlDown: false,
        secretOrNot: '',
        tableData: [],
        page: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        batchShow: false,
        bacthList: [],
        lookUserShow: false,
        dowShow: false,
        deptsOptions: {
          props: {
            label: 'deptName',
            value: 'areaCode'
          },
          options: []
        },
        varietiesOptions: {
          props: {
            label: 'value',
            value: 'key'
          },
          options: []
        },
        multipleSelection:[],
        loading: false,
        options: []
      };
    },
    mounted() {
      switch (this.$route.name) {
        case 'specialElevator_ElevatorArchives_indexTable':
          this.titName = '电梯档案';
          this.entityType = "ELEVATOR";
          this.goname = 'specialElevator_ElevatorArchives_';
          this.importName = 'specialElevator_ElevatorArchives_import'
          this.secretOrNot = 'NO';
          this.elevatorIf = true;
          break;
        case 'specialElevator_secretElevatorArchives_indexTable':
          this.titName = '涉密电梯档案';
          this.entityType = "ELEVATOR";
          this.goname = 'specialElevator_secretElevatorArchives_';
          this.importName = 'specialElevator_secretElevatorArchives_import'
          this.secretOrNot = 'YES';
          this.elevatorIf = true;
          break;
        case 'specialBoiler_BoilerArchives_indexTable':
          this.titName = '锅炉档案';
          this.entityType = "BOILER";
          this.goname = 'specialBoiler_BoilerArchives_';
          this.importName = 'specialBoiler_BoilerArchives_import'
          break;
        case 'specialpressureVessel_pressureVesselArchives_indexTable':
          this.titName = '压力容器档案';
          this.entityType = "PRESSURE_VESSEL";
          this.goname = 'specialpressureVessel_pressureVesselArchives_';
          this.importName = 'specialpressureVessel_pressureVesselArchives_import'
          break;
        case 'specialpressurePiping_pressurePipingArchives_indexTable':
          this.titName = '压力管道档案';
          this.entityType = "PRESSURE_PIPING";
          this.goname = 'specialpressurePiping_pressurePipingArchives_';
          this.importName = 'specialpressurePiping_pressurePipingArchives_import'
          break;
        case 'specialhoistingMachinery_hoistingMachineryArchives_indexTable':
          this.titName = '起重机械档案';
          this.entityType = "HOISTING_MACHINERY";
          this.goname = 'specialhoistingMachinery_hoistingMachineryArchives_';
          this.importName = 'specialhoistingMachinery_hoistingMachineryArchives_import'
          break;
        case 'specialpassengerRopeway_passengerRopewayArchives_indexTable':
          this.titName = '客运索道档案';
          this.entityType = "PASSENGER_ROPEWAY";
          this.goname = 'specialpassengerRopeway_passengerRopewayArchives_';
          this.importName = 'specialpassengerRopeway_passengerRopewayArchives_import'
          break;
        case 'speciallargePlayground_largePlaygroundArchives_indexTable':
          this.titName = '游乐设施档案';
          this.entityType = "LARGE_PLAYGROUND";
          this.goname = 'speciallargePlayground_largePlaygroundArchives_';
          this.importName = 'speciallargePlayground_largePlaygroundArchives_import'
          break;
        case 'specialmechanicallyPropelledVehicle_mechanicallyPropelledVehicleArchives_indexTable':
          this.titName = '专用机动车辆档案';
          this.entityType = "MECHANICALLY_PROPELLED_VEHICLE";
          this.goname = 'specialmechanicallyPropelledVehicle_mechanicallyPropelledVehicleArchives_';
          this.importName = 'specialmechanicallyPropelledVehicle_mechanicallyPropelledVehicleArchives_import'
          break;
      }
      if (this.$store.getters.user.areaCode.length >= 14) {
        postEmployGridList({ streetCode: this.$store.getters.user.areaCode.slice(0, 10) }).then(r => {
          if (!r.status) { return }
          this.deptsOptions.options = r.data;
        })
      } else {
        findDeptGridNotStreet().then(r => {
          if (!r.status) { return }
          this.deptsOptions.options = r.data;
        })
      }
      getEntityVarietiesList({ entityType: this.entityType}).then(r => {
        this.HandleData(r.data.children)
        this.varietiesOptions.options.push(r.data);
      })
      this.getEntityPaging()
    },
    methods: {
      HandleData (options) {
        for (let i = 0; i < options.length; i++) {
          if (options[i].children.length == 0) 
            options[i].children = ''
          else
            this.HandleData(options[i].children)
        }
      },
      down(type){
        let params;
        if(type == 'all'){
          params = {
            search: this.subName,
            employUnit: this.employUnit,
            maintenanceUnit: this.maintenanceUnit,
            buildName: this.buildName,
            category: this.category,
            status: this.state,
            areaCode: this.areaCode,
            entityType: this.entityType,
            secretOrNot: this.secretOrNot
          }
        }else {
          params = {
            pageSize: this.page.pageSize,
            pageNum: this.page.pageNum,
            search: this.subName,
            employUnit: this.employUnit,
            maintenanceUnit: this.maintenanceUnit,
            buildName: this.buildName,
            category: this.category,
            status: this.state,
            areaCode: this.areaCode,
            entityType: this.entityType,
            secretOrNot: this.secretOrNot
          }
        }
        getEntityExport(params).then(r => {
          downloadFile(r.data, '设备档案列表')
        })
      },
      getEntityPaging() {
        this.employUnitOptions = []
        let params = {
          pageSize: this.page.pageSize,
          pageNum: this.page.pageNum,
          search: this.subName,
          employUnit: this.employUnit,
          maintenanceUnit: this.maintenanceUnit,
          buildName: this.buildName,
          category: this.category,
          status: this.state,
          areaCode: this.areaCode,
          entityType: this.entityType,
          secretOrNot: this.secretOrNot
        }
        getEntityPaging(params).then(r => {
          if(!r.status){return}
          this.tableData = r.data.list;
          this.page.total = r.data.total;
        })
      },
      maintenanceUnitFun(text) {
        clearTimeout(this.maintenanceUnitSetTim);
        this.loading = true;
        if (text != '' && text.length >= 2) {
          this.loading = false;
          this.maintenanceUnitSetTim = setTimeout(() => {
            getMaintainEntityKeywordPaging({ search: text, entityType: this.entityType }).then(r => {
              this.maintenanceUnitOptions = r.data.list
            })
          }, 200);
        } else {
          this.loading = false;
          this.maintenanceUnitOptions = []
        }
      },
      employUnitFun(text) {
        clearTimeout(this.employUnitSetTim);
        this.loading = true;
        if (text != '' && text.length >= 2) {
          this.loading = false;
          this.employUnitSetTim = setTimeout(() => {
            getEmployKeywordList({ keyWord: text, entityType: this.entityType }).then(r => {
              this.employUnitOptions = r.data
            })
          }, 200);
        } else {
          this.loading = false;
          this.employUnitOptions = []
        }
      }, 
      buildNameFun(text){
        clearTimeout(this.buildNameSetTim);
        this.loading = true;
        if(text!=''&&text.length>=2){
          this.loading = false;
          this.buildNameSetTim = setTimeout(() => {
            getBuildingList({ keysWork: text, entityType: this.entityType }).then(r => {
              this.buildNameOptions = r.data
            })
          }, 200);
        } else {
          this.loading = false;
          this.employUnitOptions = []
        }
      },
      det(deptId) {
        if(deptId.length> 0){
          this.areaCode = deptId[deptId.length -1];
        } else {
          this.areaCode = ''
        }
        this.getEntityPaging();
      },
      detVarieties(id){
        if (id.length > 0) {
          this.category = id[id.length - 1];
        } else {
          this.category = ''
        }
        this.getEntityPaging();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      lookUserShowHiden() {
        this.lookUserShow = false; 
      },
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.getEntityPaging();
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.getEntityPaging();
      },
      secretUpdate(status){
        this.$confirm(`是否确认设置该设备为${status=='YES'?'涉密':'解密'}设备？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            ids: [],
            secretStatus: status
          }
          for(let i=0; i< this.multipleSelection.length; i++){
            params.ids.push(this.multipleSelection[i].id)
          }
          postEntitySecretUpdate(params).then(r => {
            if(r.status){
              this.$message.success('编辑成功');
              this.getEntityPaging();
            }
          })
        })
      },
      batchShowHiden() {
        this.bacthList = [];
        this.batchShow = false;
        this.getEntityPaging();
      },
      batchFun() {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.bacthList.push(this.multipleSelection[i].id)
        }
        this.batchShow = true;
      }
    },
    components: {
      batch
    }
  }
</script>

<style scoped lang="sass">
  .filtrateDiv{
    width: 500px;
    position: absolute;
    top: 0px;
    left: 280px;
    height: 34px;
    overflow: hidden;
  }
  .height90{
    height: 90px;
  }
  .educeUl{
    display: inline-block;
    position: relative;
    li{
      text-align: center;
    }
    .firstLi{
      background: #0DB5EF;
      line-height: 34px;
      height: 34px;
      color: #fff;
    }
    .childrenLi{
      height: 0px;
      box-shadow:0px 4px 11px 0px rgba(60,69,80,0.16),0px 2px 3px 0px rgba(34,56,72,0.06);
      overflow: hidden;
      position: absolute;
      width: 100px;
      z-index: 9;
      background: #fff;
      p{
        line-height: 40px;
      }
      p:hover{
        background: #EEF1F4;
      }
    }
  }
  .educeUlDown{
    .childrenLi{
      height: 80px;
    }
  }
  .pagination-box{
    text-align: right;
  }
  .dowShow{
    display: inline-block;
    width: 34px;
    height: 34px;
    background: #F6F7F8;
    border:1px solid #C2CAD2;
    line-height: 34px;
    text-align: center;
    position: absolute;
    left: 800px;
    box-sizing: border-box;
  }
  .entityStateSpan{
    width:44px;
    height:21px;
    display: inline-block;
    text-align: center;
    line-height: 21px;
    font-size: 12px;
    border-radius:4px;
  }
  .REUSE{
    background: #ECF9F0;
    color: #32C25E;
    border: 1px solid #B9E7C7;
  }
  .DISCONTINUE{
    background: #FFF0EE;
    color: #FA503B;
    border: 1px solid #FFC0C0;
  }
  .SCRAP{
    background: #F2F6FA;
    color: #A2AAB6;
    border: 1px solid #CDD8E3;
  }
</style>
