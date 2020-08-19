<template>
  <div class="content">
    <div class="row">
      <el-form-item :class="editInfoList.entityName?'font-color':''" label="使用单位：">
        <el-select v-if="type=='edit'" v-model="useDatas.employId" filterable remote reserve-keyword placeholder="请输入使用单位" clearable
          :remote-method="employUnitFun" :loading="loading" class="w180" @change="idChange">
          <el-option v-for="item in employUnitOptions" :key="item.id" :label="item.entityName" :value="item.id"></el-option>
        </el-select>
        <span v-if="type=='edit'" class="titspan ml10 floatR">(必填)</span>
        <span :class="editInfoList.entityName?'fontColor':''" v-else>{{useDatas.entityName?useDatas.entityName:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row" v-if="userD || type == 'info'" :class="editInfoList.entityName?'fontColor':''">
      <el-form-item :class="editInfoList.entityName?'font-color':''" label="使用单位编码：">
        <span v-if="type != 'info'">{{userD.code?userD.code:'无'}}</span>
        <span v-else>{{useDatas.code?useDatas.code:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.entityName?'font-color':''" label="安全管理部门：">
        <span v-if="type != 'info'">{{userD.safeManageDept?userD.safeManageDept:'无'}}</span>
        <span v-else>{{useDatas.safeManageDept?useDatas.safeManageDept:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row" v-if="userD || type == 'info'" :class="editInfoList.entityName?'fontColor':''">
      <el-form-item :class="editInfoList.entityName?'font-color':''" label="安全管理人员：">
        <span v-if="type != 'info'">{{userD.safeManager?userD.safeManager:'无'}}</span>
        <span v-else>{{useDatas.safeManager?useDatas.safeManager:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.entityName?'font-color':''" label="安全管理手机：">
        <span v-if="type != 'info'">{{userD.safeManageMobile?userD.safeManageMobile:'无'}}</span>
        <span v-else>{{useDatas.safeManageMobile?useDatas.safeManageMobile:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row" v-if="userD || type == 'info'" :class="editInfoList.entityName?'fontColor':''">
      <el-form-item :class="editInfoList.entityName?'font-color':''" label="单位负责人：">
        <span v-if="type != 'info'">{{userD.corpPerson?userD.corpPerson:'无'}}</span>
        <span v-else>{{useDatas.corpPerson?useDatas.corpPerson:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.entityName?'font-color':''" label="单位负责人电话：">
        <span v-if="type != 'info'">{{userD.corpMobile?userD.corpMobile:'无'}}</span>
        <span v-else>{{useDatas.corpMobile?useDatas.corpMobile:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row" v-if="userD || type == 'info'" :class="editInfoList.entityName?'fontColor':''">
      <el-form-item :class="editInfoList.entityName?'font-color':''" label="统一社会信用代码：">
        <span v-if="type != 'info'">{{userD.creditCode?userD.creditCode:'无'}}</span>
        <span v-else>{{useDatas.creditCode?useDatas.creditCode:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.entityName?'font-color':''" label="使用单位地址：">
        <span v-if="type != 'info'">{{userD.address?userD.address:'无'}}</span>
        <span v-else>{{useDatas.address?useDatas.address:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row" v-if="userD || type == 'info'" :class="editInfoList.entityName?'fontColor':''">
      <el-form-item :class="editInfoList.entityName?'font-color':''" label="所属辖区：">
        <span v-if="type != 'info'">{{userD.belongToArea?userD.belongToArea:'无'}}</span>
        <span :class="editInfoList.belongToArea?'fontColor':''" v-else>{{useDatas.belongToArea?useDatas.belongToArea:useDatas.addrCode?useDatas.addrCode:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item :class="editInfoList.insideNumber?'font-color':''" label="单位内部编号：">
        <el-input v-if="type=='edit'" placeholder="请输入单位内部编号" maxlength="30" class="w180" v-model="useDatas.insideNumber"></el-input>
        <span :class="editInfoList.insideNumber?'fontColor':''" v-else>{{useDatas.insideNumber?useDatas.insideNumber:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row" v-if="$route.query.entityType=='ELEVATOR'">
      <el-form-item :class="editInfoList.buildName?'font-color':''" label="楼盘名称：">
        <el-select v-if="type=='edit'" v-model="useDatas.buildingId" filterable remote reserve-keyword placeholder="请输入楼盘名称"
          clearable class="w180" :remote-method="buildNameFun" :loading="loading" @change="buildChange">
          <el-option v-for="item in buildNameOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <span :class="editInfoList.buildName?'fontColor':''" v-else>{{useDatas.buildName?useDatas.buildName:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row" v-if="buildD || (type=='info'&&$route.query.entityType=='ELEVATOR')">
      <el-form-item :class="editInfoList.buildContacts?'font-color':''" label="楼盘联系人：">
        <span v-if="type!='info'">{{buildD.contacts}}</span>
        <span :class="editInfoList.buildContacts?'fontColor':''" v-else>{{useDatas.buildContacts?useDatas.buildContacts:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.buildContactNumber?'font-color':''" label="楼盘联系人电话：">
        <span v-if="type!='info'">{{buildD.contactNumber}}</span>
        <span :class="editInfoList.buildContactNumber?'fontColor':''" v-else>{{useDatas.buildContactNumber?useDatas.buildContactNumber:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row" v-if="buildD || (type=='info'&&$route.query.entityType=='ELEVATOR')">
      <el-form-item :class="editInfoList.buildaddress?'font-color':''" label="楼盘地址：">
        <span v-if="type!='info'">{{buildD.address}}</span>
        <span :class="editInfoList.buildaddress?'fontColor':''" v-else>{{useDatas.buildaddress?useDatas.buildaddress:'无'}}</span>
      </el-form-item>
    </div>
    <div class="row" v-if="$route.query.entityType=='ELEVATOR'">
      <el-form-item :class="editInfoList.tung?'font-color':''" label="所在栋：">
        <el-input v-if="type=='edit'" placeholder="请输入所在栋" maxlength="30" class="w180" v-model="useDatas.tung"></el-input>
        <span :class="editInfoList.tung?'fontColor':''" v-else>{{useDatas.tung?useDatas.tung:'无'}}</span>
      </el-form-item>
      <el-form-item :class="editInfoList.unit?'font-color':''" label="所在单元：">
        <el-input v-if="type=='edit'" placeholder="请输入所在单元" maxlength="30" class="w180" v-model="useDatas.unit"></el-input>
        <span :class="editInfoList.unit?'fontColor':''" v-else>{{useDatas.unit?useDatas.unit:'无'}}</span>
      </el-form-item>
    </div>
  </div>
</template>


<script>
  import { getEmployKeywordList, getBuildingList } from 'api/special/elevator'
  import {getBuildingFind, postEmployFind} from 'api/special/archives'
export default {
  props: {
    useDatas: {
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
    },
    dataOk: {
      default: function () {
        return ''
      }
    }
  },
  data() {
    return {
      loading: false,
      entityType: '',
      employUnitOptions: [],
      buildNameOptions: [],
      employUnitSetTim: null,
      buildNameSetTim: null,
      userD: null,
      buildD: null
    }
  },
  mounted() {
    this.entityType = this.$route.query.entityType;
  },
  methods: {
    idChange(){
      if(this.useDatas.employId){
        postEmployFind(this.useDatas.employId).then(r => {
          this.userD = r.data;
        })
      } else {
        this.userD = null
      }
    },
    buildChange() {
      if (this.useDatas.buildingId) {
        getBuildingFind({id: this.useDatas.buildingId}).then(r => {
          this.buildD = r.data;
        })
      } else {
        this.buildD = null
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
    buildNameFun(text) {
      clearTimeout(this.buildNameSetTim);
      this.loading = true;
      if (text != '' && text.length >= 2) {
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
  },
  watch: {
    'oks': {
      deep: true,
      handler(nv) {
        if (this.$route.query.stateType == 'upload') {
          this.useDatas.employId = this.useDatas.id;
          this.employUnitFun(this.useDatas.entityName);
          this.idChange();
          this.useDatas.buildingId = this.useDatas.buildId;
          this.buildNameFun(this.useDatas.buildName);
          this.buildChange()
          this.useDatas.tung = this.useDatas.tungs;
          this.useDatas.unit = this.useDatas.units;
        }
      }
    },
    'dataOk': {
      deep: true,
      handler(nv) {
        this.useDatas.tung = this.useDatas.tungs;
        this.useDatas.unit = this.useDatas.units;
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