<template>
  <div class="user-box">
    <section class="select" style="margin-bottom:20px;">
      <el-select style="vertical-align: top;" class="w150" v-model="quanLevelValue" placeholder="请选择状态" @change="getAlllist">
        <el-option :label="'风险分级(全部)'" :value="''"></el-option>
        <el-option v-for="item in quanLevelSelect" :key="item.code" :label="item.name" :value="item.code">
        </el-option>
      </el-select>
      <el-button @click="down" style="margin-top:20px;" class="floatR w100" type="primary">导出</el-button>
    </section>
    <el-table :data="report"  v-loading="loading" :key='subType' element-loading-text="数据正在努力加载中"  class="table-div mb90">
      <el-table-column type="index" align="center" label="排名" min-width="50"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="150" prop="deptName" label="单位名称"></el-table-column>

      <el-table-column show-overflow-tooltip v-if="subType!='MAAI_PRODUCT'" :key='item.code' v-for="item in table_dicts" align="center" :prop="item.code" min-width="90" :label="item.alias"></el-table-column>
      <el-table-column show-overflow-tooltip v-if="subType=='MAAI_PRODUCT'" min-width="90" prop="MPS" label="生产企业"></el-table-column>
     
      <el-table-column show-overflow-tooltip align="center" prop="smallTotal" min-width="90" label="小计"></el-table-column>
    </el-table>
  </div>
</template>
<script type='module'>
  import { downloadFile, getDicts,listDictUserItemByCodeAll } from 'api/common';
   import * as API from "api/medicalDevices/superviseStatistics"

  export default {
    props:{
      subType:String,
      default: function () {
        return 'MAAI_PRODUCT'
       }
    },
    async mounted() {
      await getDicts(['MAAI_QUANTIFY']).then(r => {
        this.quanLevelSelect = r.data[0].list
      })
      if(this.subType!='MAAI_PRODUCT'){
        await this.get_dict()
      }
      this.getAlllist()
    },
    methods: {
       get_dict(){
        listDictUserItemByCodeAll(this.enum[this.subType]).then(r=>{
          if(r.status){
            this.table_dicts=r.data;
            for(let i in this.table_dicts){
              if(this.table_dicts[i].code=='OTHER'){
                this.table_dicts[i].code=this.subType=='MAAI_MANAGER'?'MMS_OTHER':'MES_OTHER';
                break;
              }
            }
          }else{
            this.$message.error(r.message)
          }
        })
      },
      getAlllist() {
        this.loading=true;
        API.getAlllist_entityType(this.subType,this.quanLevelValue).then(r => {
          if(r.status){
            this.report = r.data;
            this.loading=false;
          }else{
            this.$message.error(r.message)
          }
        })
      },
      down() {
        API.export_all_entityType(this.subType,this.quanLevelValue).then(r => {
          if(r.status){
            downloadFile(r.data.fileId,'医疗器械主体统计报表')
          }
        })
      },
    },
    data() {
      return {
        loading:false,
        quanLevelValue: '',
        quanLevelSelect: [],
        report: [],
        enum:{
          MAAI_MANAGER:'MAAI_MB_SUB',
          MAAI_EMPLOY:'MAAI_EB_SUB'
        },
        table_dicts:[]
      }
    }
  }
</script>

<style lang="sass">

  section.select .el-select {
    margin-top: 20px;
    margin-right: 20px;
    width: 150px;
  }
</style>