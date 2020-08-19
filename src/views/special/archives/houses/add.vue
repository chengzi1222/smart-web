<template>
  <div class="addpopup">
    <div class="addDiv inputPadd5">
      <p class="addTit">
        <span class="ml20">{{titleName}}</span>
        <i class="el-icon-close floatR movePoin"  @click="$emit('addShowHiden')"></i>
      </p>
      <div class="mt20" style="margin-left: 60px;">
        <div class="iptDiv">
          <span>楼盘名称：</span>
          <el-input placeholder="请输入楼盘名称，30字以内" maxlength="30" class="w312" v-model="datas.name"></el-input>
          <b>(必填)</b>
        </div>
      </div>
      <div class="iptP mt30">
        <div class="iptDiv">
          <span>联系人：</span>
          <el-input placeholder="请输入联系人" class="w100" v-model="datas.contacts"></el-input>
        </div>
        <div class="iptDiv">
          <span>联系电话：</span>
          <el-input placeholder="请输入联系电话" class="w162" v-model="datas.contactNumber"></el-input>
        </div>
      </div>
      <div class="mt20" style="margin-left: 60px;">
        <div class="iptDiv">
          <span>楼盘地址：</span>
          <el-input placeholder="请输入楼盘地址，100字以内" maxlength="100" class="w312" v-model="datas.address"></el-input>
        </div>
      </div>
      <div class="iptP mt20">
        <div class="iptDiv">
          <span>经度：</span>
          <el-input placeholder="-180到180之间，保留6位小数" maxlength="10" class="w162" v-model="datas.lat"></el-input>
        </div>
        <div class="iptDiv">
          <span>纬度：</span>
          <el-input placeholder="-90到90之间，保留6位小数" maxlength="9" class="w162" v-model="datas.lng"></el-input>
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
  import { postBuildingAdd } from 'api/special/archives'

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
      titleName: '',
      datas: {
        address: "",
        lng: "",
        name: "",
        contactNumber: "",
        contacts: "",
        lat: ""
      },
      state: '',
      addStatus: false
    }
  },
  mounted() {
    if(JSON.stringify(this.esitRow) != '{}'){
      this.titleName = '编辑';
      this.datas.address= this.esitRow.address;
      this.datas.lng= this.esitRow.lng;
      this.datas.name= this.esitRow.name;
      this.datas.contactNumber= this.esitRow.contactNumber;
      this.datas.contacts= this.esitRow.contacts;
      this.datas.lat= this.esitRow.lat;
      this.datas.id= this.esitRow.id;
      this.state = this.esitRow.state == '禁用' ? 'NO':'YES'
    } else{
      this.titleName = '添加';
      this.state = 'YES';
    }
  },
  methods: {
    add() {
      this.addStatus = true;
      if(this.datas.name == ""){this.$message.error('楼盘名称不能为空'); this.addStatus = false;return}
      postBuildingAdd(this.datas).then(r => {
        if (r.status) {
          this.addStatus = false;
          this.$message({
            message: this.titleName + '成功',
            type: 'success'
          })
          this.$emit('addShowHiden');
        } else{
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
    height: 362px;
    position: absolute;
    top: 50%;
    margin-top: -181px;
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