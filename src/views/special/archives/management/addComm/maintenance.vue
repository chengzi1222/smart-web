<template>
  <div class="content">
    <div class="row">
      <el-form-item :class="editInfoList.entityName?'font-color':''" label="维保单位：">
        <el-select v-if="type == 'edit'" v-model="maintenanceDatas.maintainId" filterable remote reserve-keyword placeholder="请输入维保单位" clearable
          :remote-method="maintenanceUnitFun" :loading="loading" class="w180" @change="idChange">
          <el-option v-for="item in maintenanceUnitOptions" :key="item.id" :label="item.entityName" :value="item.id">
          </el-option>
        </el-select>
        <span v-else :class="editInfoList.entityName?'fontColor':''">{{maintenanceDatas.entityName?maintenanceDatas.entityName:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row" v-if="maintenanceD || type == 'info'" :class="editInfoList.entityName?'fontColor':''">
      <el-form-item :class="editInfoList.entityName?'font-color':''" label="社会统一信用代码：">
        <span v-if="type!='info'">{{maintenanceD.creditCode?maintenanceD.creditCode:'无'}}</span>
        <span v-else>{{maintenanceDatas.creditCode?maintenanceDatas.creditCode:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.entityName?'font-color':''" label="资质许可证：">
        <span v-if="type!='info'">{{maintenanceD.credentialsLicence?maintenanceD.credentialsLicence:'无'}}</span>
        <span v-else>{{maintenanceDatas.credentialsLicence?maintenanceDatas.credentialsLicence:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row" v-if="maintenanceD || type == 'info'" :class="editInfoList.entityName?'fontColor':''">
      <el-form-item :class="editInfoList.entityName?'font-color':''" label="联系人：">
        <span v-if="type!='info'">{{maintenanceD.linkMan?maintenanceD.linkMan:'无'}}</span>
        <span v-else>{{maintenanceDatas.linkMan?maintenanceDatas.linkMan:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.entityName?'font-color':''" label="联系电话：">
        <span v-if="type!='info'">{{maintenanceD.linkPhone?maintenanceD.linkPhone:'无'}}</span>
        <span v-else>{{maintenanceDatas.linkPhone?maintenanceDatas.linkPhone:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row" v-if="maintenanceD || type == 'info'" :class="editInfoList.entityName?'fontColor':''">
      <el-form-item :class="editInfoList.entityName?'font-color':''" label="资质级别：">
        <span v-if="type!='info'">{{maintenanceD.credentialsLevel?maintenanceD.credentialsLevel:'无'}}</span>
        <span v-else>{{maintenanceDatas.credentialsLevel?maintenanceDatas.credentialsLevel:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.maintainPerson?'font-color':''" label="维保人员：">
        <el-input v-if="type == 'edit'" placeholder="请输入维保人员姓名" maxlength="30" class="w180" v-model="maintenanceDatas.maintainPerson"></el-input>
        <span v-else :class="editInfoList.maintainPerson?'fontColor':''">{{maintenanceDatas.maintainPerson?maintenanceDatas.maintainPerson:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.maintainNo?'font-color':''" label="维保人员身份证：">
        <el-input v-if="type == 'edit'" placeholder="请输入维保人员身份证" maxlength="30" class="w180" v-model="maintenanceDatas.maintainNo"></el-input>
        <span v-else :class="editInfoList.maintainNo?'fontColor':''">{{maintenanceDatas.maintainNo?maintenanceDatas.maintainNo:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.maintainMobile?'font-color':''" label="维保人员电话：">
        <el-input v-if="type == 'edit'" placeholder="请输入维保人员电话" maxlength="30" class="w180" v-model="maintenanceDatas.maintainMobile"></el-input>
        <span v-else :class="editInfoList.maintainMobile?'fontColor':''">{{maintenanceDatas.maintainMobile?maintenanceDatas.maintainMobile:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.maintainContractDate?'font-color':''" label="维保合同有效期：">
        <el-date-picker v-if="type=='edit'" value-format="yyyy-MM-dd" class="sleq padRightNo w180" type="date" placeholder="选择维保合同有效期"
          :readonly="!maintenanceDatas" v-model="maintenanceDatas.maintainContractDate" :editable="false">
        </el-date-picker>
        <span v-else :class="editInfoList.maintainContractDate?'fontColor':''">{{maintenanceDatas.maintainContractDate?maintenanceDatas.maintainContractDate:'无'}}</span>
      </el-form-item>
    </div>
  </div>
</template>


<script>
  import { getMaintainEntityKeywordPaging } from 'api/special/elevator'
  import { postMaintainEntityFind } from 'api/special/archives'
export default {
  props: {
    maintenanceDatas: {
      default: function () {
        return {}
      }
    },
    type: {
      default: function () {
        return 'edit'
      }
    },
    oks: {
      default: function () {
        return ''
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
      loading: false,
      entityType: '',
      maintenanceUnitSetTim: null,
      maintenanceUnitOptions: [],
      maintenanceD: null
    }
  },
  mounted() {
    this.entityType = this.$route.query.entityType;
  },
  methods: {
    idChange(){
      if(this.maintenanceDatas.maintainId){
        postMaintainEntityFind(this.maintenanceDatas.maintainId).then(r => {
          this.maintenanceD = r.data;
        })
      } else {
        this.maintenanceD = null
      }
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
  },
  watch: {
    'oks': {
      deep: true,
      handler(nv) {
        if (this.$route.query.stateType == 'upload') {
          this.maintenanceUnitFun(this.maintenanceDatas.entityName);
          this.idChange();
        }
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