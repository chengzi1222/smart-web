<template>
  <div class="addpopup">
    <div class="addDiv inputPadd5">
      <p class="addTit">
        <span class="ml20">{{titleName}}</span>
        <i class="el-icon-close floatR movePoin"  @click="$emit('addShowHiden')"></i>
      </p>
      <div class="iptP mt30">
        <div class="iptDiv">
          <span>检验单位名称：</span>
          <el-input placeholder="检验单位名称，30字以内" maxlength="30" class="w162" v-model="datas.name" @blur="autoAccount"></el-input>
          <b>(必填)</b>
        </div>
        <div class="iptDiv">
          <span>统一社会信用代码：</span>
          <el-input placeholder="请输入统一社会信用代码" maxlength="30" class="w162" v-model="datas.creditCode"></el-input>
        </div>
      </div>
      <div class="iptP mt20">
        <div class="iptDiv">
          <span>检验单位账号：</span>
          <el-input placeholder="4-16字数字或字母" @keyup.native="datas.accountNumber=datas.accountNumber.replace(/[^\w_]/g,'');" maxlength="16" class="w162" v-model="datas.accountNumber"></el-input>
          <b>(必填)</b>
        </div>
        <div class="iptDiv">
          <span>资质许可证：</span>
          <el-input placeholder="请输入资质许可证" class="w162" maxlength="16" v-model="datas.aptitudeLicence"></el-input>
        </div>
      </div>
      <div class="iptP mt20">
        <div class="iptDiv">
          <span>资质级别：</span>
          <el-input placeholder="请输入资质级别" maxlength="30" class="w162" v-model="datas.aptitudeRank"></el-input>
        </div>
        <div class="iptDiv">
          <span>联系人：</span>
          <el-input placeholder="请输入联系人" maxlength="30" class="w162" v-model="datas.contacts"></el-input>
        </div>
      </div>
      <div class="mt20" style="margin-left: 60px;">
        <div class="iptDiv">
          <span>联系电话：</span>
          <el-input placeholder="请输入联系电话" class="w162" maxlength="11" v-model="datas.contactNumber"></el-input>
        </div>
      </div>
      <div class="mt20" style="margin-left: 60px;">
        <div class="iptDiv">
          <span>检验单位地址：</span>
          <el-input placeholder="请输入检验单位地址，100字以内" maxlength="100" class="w312" v-model="datas.address"></el-input>
        </div>
      </div>
      <div class="btnDiv">
        <el-button @click="$emit('addShowHiden')">取消</el-button>
        <el-button type="primary" v-if="JSON.stringify(this.esitRow) == '{}'" :disabled="addStatus" class="mr20" @click="add">确定</el-button>
        <el-button type="primary" v-else :disabled="addStatus" class="mr20" @click="$emit('statusUpdate',datas,state,'编辑')">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { postInspectAdd,autoAccount } from 'api/special/archives'

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
      datas: {
        name: '',
        accountNumber	: '',
        creditCode: '',
        aptitudeLicence: '',
        aptitudeRank: '',
        address: '',
        contacts: '',
        contactNumber: '',
      },
      addStatus: false,
      titleName: ''
    }
  },
  mounted() {
    if (JSON.stringify(this.esitRow) != '{}') {
      this.titleName = '编辑';
      this.datas.name = this.esitRow.name;
      this.datas.id = this.esitRow.id;
      this.datas.accountNumber	 = this.esitRow.accountNumber;
      this.datas.creditCode = this.esitRow.creditCode;
      this.datas.aptitudeLicence = this.esitRow.aptitudeLicence;
      this.datas.aptitudeRank = this.esitRow.aptitudeRank;
      this.datas.address = this.esitRow.address;
      this.datas.contacts = this.esitRow.contacts;
      this.datas.contactNumber = this.esitRow.contactNumber;
      this.state = this.esitRow.state == '禁用' ? 'NO' : 'YES'
    } else {
      this.titleName = '添加';
      this.state = 'YES';
    }
  },
  methods: {
    autoAccount(){
      autoAccount({'unitName': this.datas.name,"unitType":"INSPECT"}).then(r => {
        if(r.status){
          this.datas.accountNumber = r.data
        }
      })
    },
    add(){
      this.addStatus = true;
      if (this.datas.name == "") { this.$message.error('检验单位名称不能为空'); this.addStatus = false; return }
      if (this.datas.accountNumber == "") { this.$message.error('检验单位账号不能为空'); this.addStatus = false; return }
      postInspectAdd(this.datas).then(r => {
        if (r.status) {
          this.addStatus = false;
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$emit('addShowHiden');
        } else {
          this.addStatus = false;
          this.$message({
            message: r.message,
            type: 'error'
          })
        }
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
    height: 416px;
    position: absolute;
    top: 50%;
    margin-top: -208px;
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
    width: 162px;
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
    display: inline-block;
    position: relative;
    min-width: 300px;
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
