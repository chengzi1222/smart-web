<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b><span>统计报表</span>
    </div>
    <section class="select" style="margin-bottom:20px;">
      <el-select style="vertical-align: top;" class="w150" v-model="riskRankValue" placeholder="请选择状态" @change="getAlllist">
        <el-option :label="'风险等级(全部)'" :value="''"></el-option>
        <el-option v-for="item in riskRankSelect" :key="item.code" :label="item.name" :value="item.code">
        </el-option>
        <el-option :label="'未评估'" :value="'OTHER'"></el-option>
      </el-select>
      <el-select style="vertical-align: top;" class="w150" v-model="quanLevelValue" placeholder="请选择状态" @change="getAlllist">
        <el-option :label="'量化等级(全部)'" :value="''"></el-option>
        <el-option v-for="item in quanLevelSelect" :key="item.code" :label="item.name" :value="item.code">
        </el-option>
        <el-option :label="'未评估'" :value="'OTHER'"></el-option>
      </el-select>
      <el-button @click="down" style="margin-top:20px;" class="floatR w100" type="primary">导出</el-button>
    </section>
    <el-table :data="report"  v-loading="loading" element-loading-text="数据正在努力加载中"  class="table-div mb90">
      <el-table-column type="index" align="center" label="排名" min-width="50"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="150" prop="deptName" label="单位名称"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="COSMETIC_PRODUCT" min-width="90" label="生产主体"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="COSMETIC_MANAGER" min-width="90" label="经营主体"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="COSMETIC_EMPLOY" min-width="90" label="使用主体"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="count" min-width="90" label="小计"></el-table-column>
    </el-table>
  </div>
</template>
<script>
  // import {getDicts } from 'api/statistics/statistics';
  import { downloadFile, getDicts } from 'api/common';
  import * as API from "api/cosmetics/subMap"

  export default {
    async mounted() {
      // let dicts = await getDicts();
      // console.log(dicts)
      await getDicts(['COSM_RISK']).then(r => {
        this.riskRankSelect = r.data[0].list
      })
      await getDicts(['COSM_QUANTIFY']).then(r => {
        this.quanLevelSelect = r.data[0].list
      })
      this.getAlllist()
    },
    methods: {      
      getAlllist() {
        this.loading=true;
        let params={
          'riskRank':this.riskRankValue,
          'quanLevel':this.quanLevelValue
        }
        API.getAlllist(params).then(r => {
          if(r.status){
            this.report = r.data;
            this.loading=false;
          }
        })
      },
      down() {
        let params={
          'riskRank':this.riskRankValue,
          'quanLevel':this.quanLevelValue
        }
        API.export_all(params).then(r => {
          if(r.status){
            downloadFile(r.data.fileId,'化妆品统计报表')
          }
        })
      },
    },
    data() {
      return {
        loading:false,
        riskRankValue: '',
        quanLevelValue: '',
        riskRankSelect: [],
        quanLevelSelect: [],
        report: [],
        derive:''
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