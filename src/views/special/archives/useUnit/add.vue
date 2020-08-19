<template>
  <div class="addpopup">
    <div class="addDiv inputPadd5">
      <p class="addTit">
        <span class="ml20">{{titleName}}</span>
        <i class="el-icon-close floatR movePoin"  @click="$emit('addShowHiden')"></i>
      </p>
      <div class="iptP mt30">
        <div class="iptDiv">
          <span>使用单位名称：</span>
          <el-input placeholder="使用单位名称，30字以内" maxlength="30" class="w162" v-model="datas.entityName" @blur="autoAccount"></el-input>
          <b>(必填)</b>
        </div>
        <div class="iptDiv">
          <span>使用单位编码：</span>
          <el-input placeholder="请输入使用单位编码" maxlength="30" class="w162" v-model="datas.code"></el-input>
        </div>
      </div>
      <div class="iptP mt20">
        <div class="iptDiv">
          <span>统一社会信用代码：</span>
          <el-input placeholder="请输入统一社会信用代码" maxlength="30" class="w162" v-model="datas.creditCode"></el-input>
        </div>
        <div class="iptDiv">
          <span>使用单位账号：</span>
          <el-input placeholder="4-16字数字或字母" @keyup.native="datas.account=datas.account.replace(/[^\w_]/g,'');" maxlength="16" class="w162" v-model="datas.account"></el-input>
          <b>(必填)</b>
        </div>
      </div>
      <div class="iptP mt20">
        <div class="iptDiv">
          <span>单位类别：</span>
          <el-select class="w162" v-model="datas.unitCategory" placeholder="单位类别" clearable multiple collapse-tags>
            <el-option v-for="item in unitOptions" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </div>
        <div class="iptDiv">
          <span>场所类型：</span>
          <el-select class="w162" v-model="datas.placeType" placeholder="场所类型" clearable multiple collapse-tags>
            <el-option v-for="item in placeOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </div>
      </div>
      <div class="iptP mt20">
        <div class="iptDiv">
          <span>负责人：</span>
          <el-input placeholder="请输入负责人姓名" maxlength="30" class="w100" v-model="datas.corpPerson"></el-input>
        </div>
        <div class="iptDiv">
          <span>负责人联系方式：</span>
          <el-input placeholder="请输入负责人联系电话" maxlength="11" class="w162" v-model="datas.corpMobile"></el-input>
        </div>
      </div>
      <div class="iptP mt20">
        <div class="iptDiv">
          <span>安全管理部门：</span>
          <el-input placeholder="请输入安全管理部门" maxlength="30" class="w162" v-model="datas.safeManageDept"></el-input>
        </div>
        <div class="iptDiv">
          <span>安全管理人员：</span>
          <el-input placeholder="请输入安全管理人员" maxlength="30" class="w162" v-model="datas.safeManager"></el-input>
        </div>
      </div>
      <div class="iptP mt20">
        <div class="iptDiv">
          <span>安全管理手机：</span>
          <el-input placeholder="请输入安全管理手机" maxlength="30" class="w162" v-model="datas.safeManageMobile"></el-input>
        </div>
        <div class="iptDiv">
          <span>安全管理座机：</span>
          <el-input placeholder="请输入联系方式" maxlength="30" class="w162" v-model="datas.safeManageTel"></el-input>
        </div>
      </div>
      <div class="mt20" v-if="streetShow">
        <div class="iptDiv" style="margin-left:60px">
          <span style="vertical-align: 12px;">所属街道：</span>
          <el-cascader v-model='codeList' style="margin-left: 0 !important;" class="selectHeight w162" clearable placeholder="所属辖区" :options="deptsOptions.options"
            :props="deptsOptions.props" :change-on-select="true" :show-all-levels="false" @change="det">
          </el-cascader>
          <b>(必填)</b>
        </div>
      </div>
      <div class="mt20" style="margin-left: 62px;">
        <div class="iptDiv">
          <span>所属网格：</span>
          <el-select class="w162" v-model="datas.gridCode" placeholder="所属网格" clearable>
            <el-option v-for="item in streetCodeList" :key="item.areaCode" :label="item.deptName" :value="item.areaCode">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="mt20" style="margin-left: 62px;">
        <div class="iptDiv">
          <span>使用单位地址：</span>
          <el-input placeholder="请输入使用单位地址，100字以内" maxlength="100" class="w312" v-model="datas.address"></el-input>
        </div>
      </div>
      <div class="iptP mt20">
        <div class="iptDiv">
          <span>经度：</span>
          <el-input placeholder="-180到180之间，保留6位小数" maxlength="10" class="w162" v-model="datas.lng"></el-input>
        </div>
        <div class="iptDiv">
          <span>纬度：</span>
          <el-input placeholder="-90到90之间，保留6位小数" maxlength="9" class="w162" v-model="datas.lat"></el-input>
        </div>
      </div>
      <div class="mt20" style="margin-left: 62px;">
        <div class="iptDiv">
          <span>备注：</span>
          <el-input placeholder="请输入备注，300字以内" maxlength="300" type="textarea" rows="5" class="w300" v-model="datas.remark">
          </el-input>
        </div>
      </div>
      <div class="btnDiv mb20">
        <el-button @click="$emit('addShowHiden')">取消</el-button>
        <el-button type="primary" v-if="JSON.stringify(this.esitRow) == '{}'" :disabled="addStatus" class="mr20" @click="add">确定</el-button>
        <el-button type="primary" v-else :disabled="addStatus" class="mr20" @click="update">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { postEmployEntityUpdate, postEmployEntityAdd, postEmployGridList ,autoAccount} from 'api/special/archives'
  import { findDeptGridNotStreet, getDicts } from 'api/common'
export default {
  props: {
    esitRow: {
      default: function () {
        return {}
      }
    },
  },
  data(){
    return {
      subName: '',
      titleName: '',
      state: '',
      datas:{
        entityName: '',
        code: '',
        creditCode: '',
        account: '',
        corpPerson: '',
        corpMobile: '',
        safeManageDept: '',
        safeManager: '',
        safeManageMobile: '',
        safeManageTel: '',
        streetCode: '',
        gridCode: '',
        address: '',
        lng: '',
        lat: '',
        remark: ''
      },
      addStatus: false,
      deptsOptions: {
        props: {
          label: 'deptName',
          value: 'areaCode'
        },
        options: []
      },
      streetCodeList: [],
      codeList: [],
      streetShow: true,
      placeType: [],
      unitCategory: [],
      placeOptions: [],
      unitOptions: []
    }
  },
  mounted() {
    getDicts(['TZSB_PLACE_TYPE']).then(r => {
      this.placeOptions = r.data[0].list
    })
    getDicts(['TZSB_UNIT_TYPE']).then(r => {
      this.unitOptions = r.data[0].list
    })
    if(JSON.stringify(this.esitRow) != '{}'){
      this.titleName = '编辑';
      this.datas.placeType = this.esitRow.placeTypeList;
      this.datas.unitCategory = this.esitRow.unitCategoryList;
      this.datas.account = this.esitRow.userName;
      this.datas.entityName = this.esitRow.entityName;
      this.datas.code = this.esitRow.code;
      this.datas.creditCode = this.esitRow.creditCode;
      this.datas.corpPerson = this.esitRow.corpPerson;
      this.datas.corpMobile = this.esitRow.corpMobile;
      this.datas.safeManageDept = this.esitRow.safeManageDept;
      this.datas.safeManager = this.esitRow.safeManager;
      this.datas.safeManageMobile = this.esitRow.safeManageMobile;
      this.datas.safeManageTel = this.esitRow.safeManageTel;
      this.datas.streetCode = this.esitRow.streetCode;
      this.datas.gridCode = this.esitRow.gridCode;
      this.datas.address = this.esitRow.address;
      this.datas.lng = this.esitRow.lng;
      this.datas.lat = this.esitRow.lat;
      this.datas.id = this.esitRow.id;
      this.datas.userId = this.esitRow.userId; 
      this.datas.streetName = this.esitRow.streetName;
      this.datas.remark = this.esitRow.remark;
      if(this.$store.getters.user.areaCode.length == 2){
        this.codeList.push(this.esitRow.streetCode.slice(0, 2));
        this.codeList.push(this.esitRow.streetCode.slice(0, 4));
        this.codeList.push(this.esitRow.streetCode.slice(0, 6));
        this.codeList.push(this.esitRow.streetCode);
        this.postEmployGridList(this.datas.streetCode)
      } else if (this.$store.getters.user.areaCode.length == 4){
        this.codeList.push(this.esitRow.streetCode.slice(0, 4));
        this.codeList.push(this.esitRow.streetCode.slice(0, 6));
        this.codeList.push(this.esitRow.streetCode);
        this.postEmployGridList(this.datas.streetCode)
      }else if (this.$store.getters.user.areaCode.length == 6){
        this.codeList.push(this.esitRow.streetCode.slice(0, 6));
        this.codeList.push(this.esitRow.streetCode);
        this.postEmployGridList(this.datas.streetCode)
      }else if(this.$store.getters.user.areaCode.length == 10) {
        this.datas.streetCode = this.$store.getters.user.areaCode;
        this.postEmployGridList(this.datas.streetCode)
        this.streetShow = false;
      } else if(this.$store.getters.user.areaCode.length >= 14){
        this.datas.streetCode = this.$store.getters.user.areaCode.slice(0, 10);
        this.postEmployGridList(this.datas.streetCode)
        this.streetShow = false;
      }
    } else{
      if(this.$store.getters.user.areaCode.length == 10){
        this.datas.streetCode = this.$store.getters.user.areaCode;
        this.postEmployGridList(this.$store.getters.user.areaCode)
        this.streetShow = false;
      } else if (this.$store.getters.user.areaCode.length >= 14) {
        this.datas.streetCode = this.$store.getters.user.areaCode.slice(0, 10);
        this.postEmployGridList(this.$store.getters.user.areaCode.slice(0, 10))
        this.streetShow = false;
      }
      this.titleName = '添加';
      this.state = 'YES';
    }
    findDeptGridNotStreet().then(r => {
      this.deptsOptions.options = r.data
    })
  },
  methods: {
    autoAccount(){
      autoAccount({"unitName":this.datas.entityName,"unitType":"EMPLOY"}).then(r => {
        if(r.status){
          this.datas.account = r.data
        }
      })
    },
    add() {
      if (this.datas.entityName == '') {
        this.$message.error('使用单位名称不能为空');
        return
      }
      if (this.datas.account == '') {
        this.$message.error('使用单位账号不能为空');
        return
      } else if (this.datas.account.length < 4) {
        this.$message.error('使用单位账号长度为4-16以内');
        return
      }
      if (this.datas.streetCode == undefined || this.datas.streetCode == "") {
        this.$message.error('请选择所属街道');
        return
      }
      this.addStatus = true;
      this.datas.placeTypeList = this.datas.placeType;
      this.datas.unitCategoryList = this.datas.unitCategory;
      postEmployEntityAdd(this.datas).then(r => {
        this.addStatus = false;
        if (r.status) {
          this.$message.success('添加成功')
          this.$emit('getEntityPaging')
          this.$emit('addShowHiden')
        }
      })
    }, 
    update() {
      if (this.datas.entityName == '') {
        this.$message.error('使用单位名称不能为空');
        return
      }
      if (this.datas.account == '') {
        this.$message.error('使用单位账号不能为空');
        return
      }else if (this.datas.account.length < 4) {
        this.$message.error('使用单位账号长度为4-16以内');
        return
      }
      if (this.datas.streetCode == undefined || this.datas.streetCode == "") {
        this.$message.error('请选择所属街道');
        return
      }
      this.addStatus = true;
      this.datas.placeTypeList = this.datas.placeType;
      this.datas.unitCategoryList = this.datas.unitCategory;
      postEmployEntityUpdate(this.datas).then(r => {
        this.addStatus = false;
        if (r.status) {
          this.$message.success('编辑成功')
          this.$emit('getEntityPaging')
          this.$emit('addShowHiden')
        }
      })
    },
    det(deptId){
      if(deptId.length == 0){
        this.datas.streetCode = '';
        this.streetCodeList = [];
        this.datas.gridCode = '';
      }else if(deptId[deptId.length-1].length >= 10){
        this.datas.streetCode = deptId[deptId.length - 1];
        this.postEmployGridList(deptId[deptId.length-1])
        this.datas.gridCode = '';
      } else {
        this.datas.streetCode = this.esitRow.streetCode;
        this.streetCodeList = [];
        this.datas.gridCode = '';
      }
    },
    postEmployGridList(code) {
      postEmployGridList({ streetCode: code}).then(r => {
        this.streetCodeList = r.data[0].children
      })
    }
  },
}
</script>

<style scoped lang="sass">
  .addpopup{
    position: fixed;
    background: rgba(0,0,0,.5);
    z-index: 99;
    top: 0;
    bottom:0;
    left:0;
    right:0;
    overflow: auto;
  }
  .addDiv{
    width: 780px;
    position: absolute;
    top: 50%;
    margin-top: -360px;
    left: 50%;
    margin-left: -390px;
    background: #fff;
  }
  .addTit{
    height: 40px;
    line-height: 40px;
    background: #F2F5F8;
    i{
      font-size: 16px;
      margin-top: 12px;
      margin-right: 7px;
    }
  }
  .w162{
    width: 162px !important;
  }
  .w312{
    width: 312px;
  }
  .mt30{
    margin-top: 30px;
  }
  .iptP{
    display: flex;
    justify-content: space-evenly;
  }
  .iptDiv{
    min-width: 300px;
    display: inline-block;
    position: relative;
    span{
      display: inline-block;
      width: 130px;
      text-align: right;
      font-size: 14px;
    }
    b{
      position: absolute;
      font-weight: 100;
      font-size: 12px;
      color: #A2AAB6;
      top: 9px;
      right: -45px;
    }
  }
  .btnDiv{
    margin-top: 40px;
    text-align: right;
  }
</style>
