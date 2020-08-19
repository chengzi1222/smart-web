<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b><span>统计报表</span>
    </div>
    <section class="select" style="margin-bottom:20px;">
      <el-select style="vertical-align: top;" class="w150" v-model="riskRankValue" placeholder="请选择状态" @change="getAlllist">
        <el-option v-for="item in riskRankSelect" :key="item.id" :label="item.name" :value="item.code">
        </el-option>
        <el-option :label="'未评估'" :value="'未评估'"></el-option>
      </el-select>
      <el-select style="vertical-align: top;" class="w150" v-model="quanLevelValue" placeholder="请选择状态" @change="getAlllist">
        <el-option v-for="item in quanLevelSelect" :key="item.id" :label="item.name" :value="item.code">
        </el-option>
        <el-option :label="'未评估'" :value="'未评估'"></el-option>
      </el-select>
      <a :href="derive" class="w100 floatR godown mt20" target="_blank" download="filename">导出</a>
    </section>
    <el-table :data="report" class="table-div">
      <el-table-column type="index" align="center" label="排名" min-width="50"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="150" prop="deptName" label="单位名称"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="manager" min-width="90" label="经营主体"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="employ" min-width="90" label="使用主体"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="subtotal" min-width="90" label="小计"></el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { getDicts } from 'api/statistics/statistics';
  import * as API from "api/medi/subStatistics/subStatistics.js"

  export default {
    async mounted() {
      let dicts = await getDicts();
      console.log(dicts)
      this.riskRankSelect = dicts.data.risk;
      this.quanLevelSelect = dicts.data.quantify;

      this.getAlllist()
    },
    methods: {
      getAlllist() {
        this.down()
        let params = new FormData();
        params.append('riskLevel', this.riskRankValue)
        params.append('quanLevel', this.quanLevelValue)
        API.getAlllist(params).then(r => {
          this.report = r.data;
        })
      },
      down() {
        this.derive = 'http://' + window.location.host + '/api/medi/statisticsform/allexport?riskLevel=' + this.riskRankValue + '&quanLevel=' + this.quanLevelValue;
      },
    },
    data() {
      return {
        riskRankValue: '',
        quanLevelValue: '',
        riskRankSelect: [],
        quanLevelSelect: [],
        report: [],
        derive: ''
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