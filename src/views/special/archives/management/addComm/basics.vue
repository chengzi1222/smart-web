<template>
  <div class="content">
    <div class="row">
      <el-form-item :class="editInfoList.qrCode?'font-color':''" label="二维码编号：">
        <el-input v-if="$route.query.stateType == 'add'" placeholder="字母与数字组合，3-16位" maxlength="16" class="w300" v-model="basicsDatas.qrCode"></el-input>
        <span v-if="$route.query.stateType == 'add'" class="titspan ml20 floatR">(如设备尚未分配二维码编号，则无需填写。系统会自动分配！)</span>
        <span :class="editInfoList.qrCode?'fontColor':''" v-else>{{basicsDatas.qrCode?basicsDatas.qrCode:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item label="设备注册代码：" :class="editInfoList.registerCode?'font-color':''">
        <el-input v-if="type=='edit'" placeholder="字母与数字组合，3-15位" maxlength="15" class="w180" v-model="basicsDatas.registerCode"></el-input>
        <b v-if="type=='edit'">(必填)</b>
        <span v-else :class="editInfoList.registerCode?'fontColor':''">{{basicsDatas.registerCode?basicsDatas.registerCode:'无'}}</span>
      </el-form-item>
      <el-form-item label="使用登记证号：" :class="editInfoList.registerCardNo?'font-color':''">
        <el-input v-if="type=='edit'" placeholder="请输入使用登记证号" maxlength="30" class="w180" v-model="basicsDatas.registerCardNo"></el-input>
        <span v-else :class="editInfoList.registerCardNo?'fontColor':''">{{basicsDatas.registerCardNo?basicsDatas.registerCardNo:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.entityName?'font-color':''" label="设备名称：">
        <el-input v-if="type=='edit'" placeholder="请输入设备名称" maxlength="30" class="w180" v-model="basicsDatas.entityName"></el-input>
        <span v-else :class="editInfoList.entityName?'fontColor':''">{{basicsDatas.entityName?basicsDatas.entityName:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.entityVarieties?'font-color':''" label="设备品种：">
        <el-cascader v-if="type=='edit'" class="w162" id="entityVarieties" clearable placeholder="请选择设备类别与种类" v-model="typeList" :options="varietiesOptions.options"
          :props="varietiesOptions.props" :change-on-select="true" :show-all-levels="false" @change="detVarieties">
        </el-cascader>
        <span v-else :class="editInfoList.entityVarieties?'fontColor':''">{{basicsDatas.entityVarietiesStr?basicsDatas.entityVarietiesStr:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.outdoorIndoorStr?'font-color':''" label="室内外：">
        <el-select v-if="type=='edit'" class="w162" id="outdoorIndoor" v-model="basicsDatas.outdoorIndoor" placeholder="请选择设备属于室内还是室外" clearable>
          <el-option v-for="item in roomOptions" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
        <span v-else :class="editInfoList.outdoorIndoorStr?'fontColor':''">{{basicsDatas.outdoorIndoorStr?basicsDatas.outdoorIndoorStr:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.usePlaceStr?'font-color':''" label="使用场所：">
        <el-select v-if="type=='edit'" class="w180" id="usePlace" v-model="basicsDatas.usePlace" placeholder="请选择使用场所" clearable>
          <el-option v-for="item in siteOptions" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
        <span v-else :class="editInfoList.usePlaceStr?'fontColor':''">{{basicsDatas.usePlaceStr?basicsDatas.usePlaceStr:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.entityStateStr?'font-color':''" label="设备状态：">
        <el-select v-if="type=='edit'" class="w180" id="entityStateStr" v-model="basicsDatas.entityState" placeholder="设备状态" clearable>
          <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <b v-if="type=='edit'">(必填)</b>
        <span v-else :class="editInfoList.entityStateStr?'fontColor':''">{{basicsDatas.entityStateStr?basicsDatas.entityStateStr:'无'}}</span>
      </el-form-item>
      <el-form-item v-if="basicsDatas.entityState=='DISCONTINUE'||basicsDatas.entityState=='SCRAP'" :class="editInfoList.entityStateStr?'font-color':''"
                    :label="basicsDatas.entityState=='DISCONTINUE'?'停用日期：':'报废日期：'">
        <el-date-picker v-if="type=='edit'" placeholder="请选择日期" value-format="yyyy-MM-dd" class="sleq padRightNo w180" type="date"
          :readonly="!basicsDatas" v-model="basicsDatas.stopDate">
        </el-date-picker>
        <span v-else :class="editInfoList.entityStateStr?'fontColor':''">{{basicsDatas.stopDate?basicsDatas.stopDate:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.oldEquipmentStr?'font-color':''" label="是否老设备：">
        <el-select v-if="type=='edit'" class="w180" id="oldEquipment" v-model="basicsDatas.oldEquipment" placeholder="请选择设备是否是老旧设备" clearable>
          <el-option key="YES" label="是" value="YES"></el-option>
          <el-option key="NO" label="否" value="NO"></el-option>
        </el-select>
        <b v-if="type=='edit'" style="right: -120px;">(不填则默认为否)</b>
        <span v-else :class="editInfoList.oldEquipmentStr?'fontColor':''">{{basicsDatas.oldEquipmentStr?basicsDatas.oldEquipmentStr:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.address?'font-color':''" label="设备使用地址：">
        <el-input v-if="type=='edit'" placeholder="请输入设备使用地址，100字以内" maxlength="100" class="w300" v-model="basicsDatas.address"></el-input>
        <span v-else :class="editInfoList.address?'fontColor':''">{{basicsDatas.address?basicsDatas.address:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.lng?'font-color':''" label="设备使用地址经度：">
        <el-input v-if="type=='edit'" placeholder="请输入设备使用地址经度" maxlength="30" class="w180" v-model="basicsDatas.lng"></el-input>
        <span v-else :class="editInfoList.lng?'fontColor':''">{{basicsDatas.lng?basicsDatas.lng:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.lat?'font-color':''" label="设备使用地址纬度：">
        <el-input v-if="type=='edit'" placeholder="请输入设备使用地址纬度" maxlength="30" class="w180" v-model="basicsDatas.lat"></el-input>
        <span v-else :class="editInfoList.lat?'fontColor':''">{{basicsDatas.lat?basicsDatas.lat:'无'}}</span>
      </el-form-item>
    </div>
  </div>
</template>


<script>
  import { getEnums, getDicts } from 'api/common'
  import { getEntityVarietiesList } from 'api/special/elevator'

export default {
  props: {
    basicsDatas: {
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
      roomOptions: [],
      siteOptions: [],
      varietiesOptions: {
        props: {
          label: 'value',
          value: 'key'
        },
        options: []
      },
      entityType: '',
      typeList: [],
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
    }
  },
  mounted() {
    this.entityType = this.$route.query.entityType;
    this.basicsDatas.entityType = this.entityType;
    if(this.type != 'info'){
      getEnums(['com.ybveg.govx.enums.tzsb.TzsbPositionEnum'], false).then(r => {
        this.roomOptions = r.data
      })
      let types = '';
      switch (this.$route.query.entityType) {
        case 'ELEVATOR':
          types = 'TZSB_EB_PLACE'
          break;
        case 'BOILER':
          types = 'TZSB_BB_PLACE'
          break;
        case 'PRESSURE_VESSEL':
          types = 'TZSB_HB_PLACE'
          break;
        case 'PRESSURE_PIPING':
          types = 'TZSB_FB_PLACE'
          break;
        case 'HOISTING_MACHINERY':
          types = 'TZSB_DB_PLACE'
          break;
        case 'PASSENGER_ROPEWAY':
          types = 'TZSB_CB_PLACE'
          break;
        case 'LARGE_PLAYGROUND':
          types = 'TZSB_AB_PLACE'
          break;
        case 'MECHANICALLY_PROPELLED_VEHICLE':
          types = 'TZSB_GB_PLACE'
          break;
      }
      getDicts([types]).then(r => {
        this.siteOptions = r.data[0].list
      })
      getEntityVarietiesList({ entityType: this.entityType }).then(r => {
        this.HandleData(r.data.children)
        this.varietiesOptions.options.push(r.data);
        
      })
      var _this = this;
      setTimeout(() => {
        if (_this.basicsDatas.entityVarieties) {
          _this.typeList.push(_this.basicsDatas.entityVarieties);
          var types = _this.basicsDatas.entityVarieties.split('').reverse();
          for (let i = 0; i < types.length; i++) {
            if (types[i] != '0') {
              if (i==1) {
                _this.typeList.push(types[3]+ types[2] + '00')
              }else if(i==2){
                _this.typeList.push(types[3] + '000')
              }
            }
          }
          _this.typeList.reverse()
        } else {
          return
        }
      }, 2000);
    }
  },
  methods: {
    detVarieties(id) {
      if (id.length > 0) {
        this.basicsDatas.entityVarieties = id[id.length - 1];
      } else {
        this.basicsDatas.entityVarieties = ''
      }
    },
    HandleData (options) {
      for (let i = 0; i < options.length; i++) {
        if (options[i].children.length == 0) 
          options[i].children = ''
        else
          this.HandleData(options[i].children)
      }
    }
  },
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
    line-height: 17px;
    display: inline-block;
    width: 264px;
    margin-top: 3px;
}
.w180{
  width: 180px;
}
.row b{
  position: absolute;
  font-weight: 100;
  font-size: 12px;
  color: #A2AAB6;
  top: 0px;
  right: -45px;
}
.fontColor{
  color: red;
}
</style>