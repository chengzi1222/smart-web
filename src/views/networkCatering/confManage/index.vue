<template>
  <div class="bigbox">
    <div class="page-tilt"> 
      <b></b><span>{{$route.query.pathName}}</span>
    </div>
    <div class="sizer">
      <div>
        <span class="tips">* 风险指标配置总分为100分</span>
        <el-button class="fr" style="margin-top:-7px;" @click="configure" type="primary">配置</el-button>
      </div>
    </div>
    <div class="dataBox">
      <toggle-form title="风险类别" style="margin-top: 27px;">
        <div class="childBox mT35">
          <el-table v-for="(item,index) in tableData" :class="index==0?'firsTeit':''" :key="item.key" :data="item.content" :span-method="typeSpanMethod" class="table-div brN" v-loading="tableLoading">
            <el-table-column show-overflow-tooltip label="风险类型" min-width="150">
              <template slot-scope="scope">
                <span>{{item.title?item.title:'-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="巡查项目" min-width="150">
              <template slot-scope="scope">
                <span>{{scope.row.patrol?scope.row.patrol:'-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="风险点分数" min-width="150">
              <template slot-scope="scope">
                <span>{{scope.row.score?scope.row.score : '-'}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </toggle-form>
      <toggle-form title="风险等级" style="margin-top:30px;">
        <div class="childBox">
          <el-table :data="riskLvData" border class="table-div r30 allDown movePoin" v-loading="tableLoading">
            <el-table-column show-overflow-tooltip prop="riskType" label="风险等级" min-width="150">
              <template slot-scope="scope">
                <span>范围</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="high" label="高风险" min-width="150">
              <template slot-scope="scope">
                <span>≤{{scope.row.high}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="normal" label="中风险" min-width="150">
              <template slot-scope="scope">
                <span>≤{{scope.row.normal}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="low" label="低风险" min-width="150">
              <template slot-scope="scope">
                <span>≤{{scope.row.low}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </toggle-form>
      
    </div>
  </div>
</template>

<script>
// import * as merchantInfoApi from "api/networkCatering/merchantInfo"
import ToggleForm from "components/ToggleForm"; //列表块
export default {
  components: {
    ToggleForm
  },
  data() {
    return {
      tableLoading: false,
      tableData: [],
      riskLvData: []
    }
  },
  computed: {
      
  },
  methods: {
    //配置
    configure() {
      this.$router.push({name: 'riskConf'})
    },
    // 合并行
    typeSpanMethod({ row, column, rowIndex, columnIndex }) {
      let rownum = 0;
      for(var i=0;i<this.tableData.length;i++){
        if(this.tableData[i].content.indexOf(row) >= 0) {
          rownum = this.tableData[i].content.length;
          break;
        }
      }
      if (columnIndex === 0) {
        if(rowIndex%rownum == 0){
          return [rownum, 1]
        } else {
          return [0,0]
        }
      }
    },
    tableRefresh() {
      this.tableData = [{title: '证照风险(25分)',key:'01', content: [{patrol:'无证照', score:'0'},{patrol:'证照重复', score:'0'}, {patrol:'证照模糊', score:'0'}, {patrol:'无店面照片', score:'0'}]},
                            {title: '地址风险(25分)',key:'02', content: [{patrol:'无地址', score:'0'},{patrol:'地址重复', score:'0'}, {patrol:'地址模糊', score:'0'}]},
                            {title: '联系方式风险(25分)',key:'03', content: [{patrol:'无号码', score:'0'}, {patrol:'号码重复', score:'0'}]},
                            {title: '评价风险(25分)',key:'04', content: [{patrol:'评分较低', score:'0'},{patrol:'卫生问题', score:'0'}, {patrol:'不良反应', score:'0'}]}]
      this.riskLvData = [{high: '60', normal: '80', low: '99'}]
    }
  },

  mounted() {
    this.tableRefresh()
  }
}
</script>

<style scoped lang="scss">
.bigbox {
  position: relative;
  .sizer {
    margin: 20px 0;
    .tips {
      font-size: 14px;
      color: #F5A623;
      font-weight: 400;
    }
  }
}
.dataBox {
  margin-top: 20px;
  .childBox {
    margin-top: 30px;
  }
  .brN .is-leaf {
    border-right: 0;
  }
  .brN tr td {
    border-right: 0;
  }
  .brN tr td[colspan="1"] {
    border-right: 1px solid #ebeef5;
  }
  .brN .el-table__header-wrapper {
    display: none;
  }
  .firsTeit .el-table__header-wrapper {
    display: block;
  }
  .mT35 .firsTeit {
    border-top: 1px solid #ebeef5 !important;
  }
  .mT35 .el-table {
    border-top: none !important;
  }
}
</style>
