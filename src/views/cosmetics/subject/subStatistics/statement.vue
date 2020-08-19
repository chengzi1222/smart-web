<template>
  <div class="user-box">
    <div style="background:#fff;padding: 0 20px 20px;margin-top: 20px;">
      <section class="select" style="margin-bottom:20px;">
        <el-select style="vertical-align: top;" class="w150" v-model="riskRankValue" placeholder="请选择状态" @change="getSubList">
          <el-option :label="'风险等级(全部)'" :value="''"></el-option>
          <el-option v-for="item in riskRankSelect" :key="item.id" :label="item.name" :value="item.code">
          </el-option>
          <el-option :label="'未评估'" :value="'OTHER'"></el-option>
        </el-select>
        <el-select style="vertical-align: top;" class="w150" v-model="quanLevelValue" placeholder="请选择状态" @change="getSubList">
          <el-option :label="'量化等级(全部)'" :value="''"></el-option>
          <el-option v-for="item in quanLevelSelect" :key="item.id" :label="item.name" :value="item.code">
          </el-option>
          <el-option :label="'未评估'" :value="'OTHER'"></el-option>
        </el-select>
        <el-button @click="down" style="margin-top:20px;" class="floatR w100" type="primary">导出</el-button>
      </section>
      <el-table :data="report" class="table-div"  v-loading="loading" element-loading-text="数据正在努力加载中" >
        <el-table-column type="index" align="center" label="排名" min-width="50"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" min-width="150" label="单位名称"></el-table-column>

        <el-table-column show-overflow-tooltip :key='item.code' v-for="item in table_dicts" align="center" :prop="item.code" min-width="90" :label="item.alias"></el-table-column>

        <el-table-column show-overflow-tooltip align="center" prop="count" min-width="90" label="小计"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import { downloadFile,listDictUserItemByCodeAll, getDicts } from 'api/common';
  import * as API from "api/cosmetics/subMap"

  export default {
    props:{
      subType:String
    },
    async mounted() {
      await getDicts(['COSM_RISK']).then(r => {
        this.riskRankSelect = r.data[0].list
      })
      await getDicts(['COSM_QUANTIFY']).then(r => {
        this.quanLevelSelect = r.data[0].list
      })
      // this.riskRankSelect = dicts.data.risk;
      // this.quanLevelSelect = dicts.data.quantify;
      if(this.subType!='COSMETIC_PRODUCT'){
        await this.get_dict()
      }
      this.getSubList();
    },
    methods: {
      get_dict(){
        listDictUserItemByCodeAll(this.subTypeList[this.subType].dict).then(r=>{
          if(r.status){
            this.table_dicts=r.data;
            let obj={
              code:'OTHER',
              alias:'其他'
            }
            this.table_dicts.push(obj)
          }
        })
      },
      getSubList() {
        this.loading = true ;
        let params={
          'riskRank':this.riskRankValue,
          'quanLevel':this.quanLevelValue,
          // 'enterpriseForm':''
        }
        API.getSubList(params,this.subType).then(r => {
          if(r.status){
            this.report = r.data;
            this.loading = false;
          }
        })
      },
      down() {
         let params={
          'riskRank':this.riskRankValue,
          'quanLevel':this.quanLevelValue
        }
        API.export_sub(params,this.subType).then(r => {
          if(r.status){
            downloadFile(r.data.fileId,this.subTypeList[this.subType].name+'统计报表')
          }
        })
      },
    },
    data() {
      return {
        table_dicts:[],
        subTypeList:{
          COSMETIC_MANAGER:{
            name:'经营主体',
            dict:'COSM_MB_SUB'
          } ,
          COSMETIC_PRODUCT: {
            name:'生产主体',
            dict:'COSM_PB_SUB'
          } ,
          COSMETIC_EMPLOY:{
            name:'使用主体',
            dict:'COSM_EB_SUB'
          }
        },
        riskRankValue: '',
        quanLevelValue: '',
        riskRankSelect: [],
        quanLevelSelect: [],
        report: [],
        derive: '',
        loading: true
      }
    }
  }
</script>

<style scoped lang="sass">
  .user-box {
    background-color: #edf0f3;
    padding: 20px;
    margin-top: -2px;
    margin-left: -20px;
    width: 100%;
    padding-top: 1px;
  }

  section.select .el-select {
    margin-top: 20px;
    margin-right: 20px;
    width: 150px;
  }
</style>