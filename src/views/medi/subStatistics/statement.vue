<template>
  <div class="user-box">
    <div style="background:#fff;padding: 0 20px 20px;margin-top: 20px;">
      <section class="select" style="margin-bottom:20px;">
        <el-select style="vertical-align: top;" class="w150" v-model="riskRankValue" placeholder="请选择状态" @change="changeSele">
          <el-option v-for="item in riskRankSelect" :key="item.id" :label="item.name" :value="item.code">
          </el-option>
          <el-option :label="'未评估'" :value="'未评估'"></el-option>
        </el-select>
        <el-select style="vertical-align: top;" class="w150" v-model="quanLevelValue" placeholder="请选择状态" @change="changeSele">
          <el-option v-for="item in quanLevelSelect" :key="item.id" :label="item.name" :value="item.code">
          </el-option>
          <el-option :label="'未评估'" :value="'未评估'"></el-option>
        </el-select>
        <a :href="'http://' + derive" class="w100 floatR godown mt20" target="_blank" download="filename">导出</a>
      </section>
      <el-table :data="report" class="table-div" v-if="$route.name == 'index_employ'" v-loading="loading">
        <el-table-column type="index" align="center" label="排名" min-width="50"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" min-width="150" label="单位名称"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="hospital" min-width="90" label="医院"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="clinic" min-width="90" label="诊所"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="healthstation" min-width="90" label="社区卫生站"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="otheremploy" min-width="90" label="其它使用主体"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="subtotal" min-width="90" label="小计"></el-table-column>
      </el-table>

      <el-table :data="report" class="table-div" v-if="$route.name != 'index_employ'" v-loading="loading">
        <el-table-column type="index" align="center" label="排名" min-width="50"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" min-width="150" label="单位名称"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="entity" min-width="90" label="药店"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="wholesale" min-width="90" label="批发企业"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="other_manager" min-width="90" label="其它经营主体"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="subtotal" min-width="90" label="小计"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import { getDicts } from 'api/statistics/statistics';
  import * as API from "api/medi/subStatistics/subStatistics.js"

  export default {
    async mounted() {
      let dicts = await getDicts();
      this.riskRankSelect = dicts.data.risk;
      this.quanLevelSelect = dicts.data.quantify;

      this.changeSele();
    },
    methods: {
      getEmploy() {
        let params = new FormData();
        params.append('riskLevel', this.riskRankValue)
        params.append('quanLevel', this.quanLevelValue)
        API.getEmploylist(params).then(r => {
          this.report = r.data;
          this.loading = false;
        })
      },
      getManagerList() {
        let params = new FormData();
        params.append('riskLevel', this.riskRankValue)
        params.append('quanLevel', this.quanLevelValue)
        API.getManagerList(params).then(r => {
          this.report = r.data;
          this.loading = false;
        })
      },
      changeSele() {
        this.loading = true;
        if (this.$route.name == 'index_employ') {
          this.getEmploy()
          this.down('employexport')
        } else {
          this.getManagerList()
          this.down('manaexport')
        }
      },
      selectChange() {

      },
      down(type) {
        this.derive = window.location.host + '/api/medi/statisticsform/' + type + '?riskLevel=' + this.riskRankValue + '&quanLevel=' + this.quanLevelValue;
      },
    },
    data() {
      return {
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