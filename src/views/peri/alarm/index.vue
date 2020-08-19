<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>短信告警配置</span>
    </div>
    <ToggleForm title="告警模式配置" v-loading="oneLodg">
      <div style="text-align: center;" class="mt20">
        <span class="mr10">重复告警过滤:</span>
        <span v-if="oneShow">{{datas.filterRepetition==0?'关闭':'开启'}}</span>
        <el-select v-else v-model="datas.filterRepetition" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </div>
      <div style="text-align: right;padding-right: 20px;" class="mt20">
        <el-button v-if="oneShow" type="primary" @click="oneShow=false;">编辑</el-button>
        <el-button v-if="!oneShow" type="primary" @click="save">保存</el-button>
        <el-button v-if="!oneShow" @click="cancel">取消</el-button>
      </div>
    </ToggleForm>
    <ToggleForm title="告警手机号配置" v-loading="twoLodg">
      <p style="text-align: center;" class="mt20">请输入告警手机号，换行隔开</p>
      <div style="text-align: center;" class="mt20">
        <span v-if="twoShow" >{{datas.notifyPhone}}</span>
        <textarea v-else v-model="datas.notifyPhone" style="width: 180px;height: 150px;line-height: 25px;"></textarea>
      </div>
      <div style="text-align: right;padding-right: 20px;" class="mt20">
        <el-button v-if="twoShow" type="primary" @click="twoShow=false;">编辑</el-button>
        <el-button v-if="!twoShow" type="primary" @click="saveT">保存</el-button>
        <el-button v-if="!twoShow" @click="cancelT">取消</el-button>
      </div>
    </ToggleForm>
  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import { getEwSMSConfigFind, postEwSMSConfigUpdate } from 'api/peri/camera'
  export default {
    data() {
      return {
        oneShow: true,
        twoShow: true,
        oneLodg: true,
        twoLodg: true,
        datas: {
          filterRepetition: 0,
          notifyPhone: "",
          togEntityId: ""
        },
        options: [{
          name: '开启',
          value: 1
        },{
          name: '关闭',
          value: 0
        }],

      }
    },
    mounted() {
      this.datas.togEntityId = '674cbcfffc7c11e9b37cec0d9a37059e';
      getEwSMSConfigFind(this.datas.togEntityId).then(r => {
        this.oneLodg = false;
        this.twoLodg = false;
        if (r.status) {
          this.datas = r.data;
        }
      })
    },
    methods: {
      save(){
        this.oneLodg = true;
        postEwSMSConfigUpdate({ filterRepetition: this.datas.filterRepetition, togEntityId: this.datas.togEntityId}).then(r=>{
          this.oneLodg = false;
          if(r.status){
            this.oneShow = true;
            this.$message.success('保存成功')
          }
        })
      },
      saveT() {
        this.twoLodg = true;
        postEwSMSConfigUpdate({ notifyPhone: this.datas.notifyPhone, togEntityId: this.datas.togEntityId }).then(r => {
          this.twoLodg = false;
          if (r.status) {
            this.twoShow = true;
            this.$message.success('保存成功')
          }
        })
      },
      cancel() {
        this.oneLodg = true;
        getEwSMSConfigFind('003c34f3648c4c8aaf8a8049fcc8d706').then(r => {
          this.oneLodg = false;
          if (r.status) {
            this.oneShow = true;
            this.datas.filterRepetition = r.data.filterRepetition;
          }
        })
      },
      cancelT() {
        this.twoLodg = true;
        getEwSMSConfigFind('003c34f3648c4c8aaf8a8049fcc8d706').then(r => {
          this.twoLodg = false;
          if (r.status) {
            this.twoShow = true;
            this.datas.notifyPhone = r.data.notifyPhone;
          }
        })
      }
    },
    components: { ToggleForm },
  }
</script>

<style scoped lang="sass">
</style>