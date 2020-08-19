<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>统计报表</span>
    </div>
    <section class="select" style="margin-bottom:20px;">
      <el-select style="vertical-align: top;" class="w125" v-model="riskRankValue" placeholder="请选择状态" @change="selectChange">
        <el-option v-for="item in riskRankSelect" :key="item.id" :label="item.name" :value="item.code">
        </el-option>
        <el-option :label="'未评估'" :value="'未评估'"></el-option>
      </el-select>
      <el-select style="vertical-align: top;" class="w125" v-model="spaceDstValue" placeholder="请选择状态" @change="selectChange">
        <el-option v-for="item in spaceDstSelect" :key="item.id" :label="item.name" :value="item.code">
        </el-option>
      </el-select>
      <el-button @click="exportFile" style="margin-top:20px;" class="floatR" type="primary">导出
      </el-button>
    </section>
    <el-table :data="report" class="table-div" v-loading="loading">
      <el-table-column type="index" align="center" label="排名" width="50">

      </el-table-column>
      <el-table-column show-overflow-tooltip prop="deptName" min-width="90" label="单位名称"></el-table-column>

      <el-table-column show-overflow-tooltip align="center" min-width="90" label="三小">
        <template slot-scope="scope">
          {{scope.row.cfdaRestaurant + scope.row.sale + scope.row.workshop + scope.row.vendors}}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="product" min-width="90" label="生产主体"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="circulation" min-width="90" label="流通主体"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="restaurant" min-width="90" label="餐饮主体"></el-table-column>

      <el-table-column show-overflow-tooltip align="center" min-width="90" label="总计">
        <template slot-scope="scope">
          {{scope.row.cfdaRestaurant + scope.row.sale + scope.row.workshop + scope.row.vendors + scope.row.product + scope.row.circulation
          + scope.row.restaurant}}
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>
<script>
  import { reportForms, getDicts, exportFile, exportTitleGenerate } from 'api/statistics/statistics';
  import { listDictUserItemByDictCode, downloadFile } from 'api/common';

  export default {
    async mounted() {
      this.loading = true;
      let risk = await listDictUserItemByDictCode("OTHER_RISK");
      let dicts = await getDicts();
      this.riskRankSelect = dicts.data.risk;
      this.quanLevelSelect = dicts.data.quantify;
      this.spaceDstSelect = dicts.data.otherPlace;
      this.selectChange()
    },
    methods: {
      async selectChange() {
        this.loading = true;
        let report = await reportForms("all", '', this.riskRankValue, this.spaceDstValue,
          this.quanLevelValue);
        this.loading = false;
        this.report = report.data;
      },
      exportFile() {
        let title = '统计报表';
        let remake = '备注:';
        remake = remake + exportTitleGenerate("风险等级", this.riskRankSelect, this.riskRankValue)
          + ',';
        remake = remake + exportTitleGenerate("场所分布", this.spaceDstSelect, this.spaceDstValue);

        exportFile(title, remake, "all", "all", '', this.riskRankValue, this.spaceDstValue,
          this.quanLevelValue).then((result) => {
            downloadFile(result.data, "统计报表");
          });
      }
    },
    data() {
      return {
        riskRankValue: '',
        quanLevelValue: '',
        spaceDstValue: '',
        riskRankSelect: [],
        quanLevelSelect: [],
        spaceDstSelect: [],
        report: [],
        loading: false,
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