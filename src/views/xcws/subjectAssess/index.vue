<template>
    <div>
        <div class="page-tilt">
            <b></b>
            <span>主体食安指数考核排名</span>
        </div>

        <div class="user-box mt20">
            <div class="page-tips mt20">
                提示：食安指数过低的主体可能存在食品安全隐患。
            </div>
            <div class="ipt-btn-box clear_a ">
                <el-input placeholder="主体名称" class="w250  mr20 seekIpt" v-model="queryLimit.keyword"
                          @keyup.enter.native="changeSearch">
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch"></i>
                </el-input>
                <select-area-grid class="selectHeight mr20"  placeholder="所属辖区" @change="areaChange"></select-area-grid>
                <el-select class="selectHeight mr20" v-model="queryLimit.riskRating" :clearable="true"  placeholder="风险评级"  @change="changeSearch" >
                    <el-option v-for="item in riskArr" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>               
                <span class="mr10">月份筛选:</span>
                <div class="date boxSB">
                    <el-date-picker
                    v-model="queryLimit.month"
                    type="month"
                    :clearable="false"
                    @change="changeSearch"
                    placeholder="选择月份"
                    value-format="yyyy-MM"
                    :picker-options="pickerOptions">
                    </el-date-picker>
                </div>
                <!-- <el-button class="floatR" type="primary" @click="configRisk">配置食安风险标准值</el-button>  -->
                <!-- <el-button class="floatR w100" type="primary" :disabled="disabled" @click="exportList">导出</el-button> -->
            </div>
            <div class="tabOffTop120">
                <el-table v-loading="loading"   @sort-change="sortChange" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                          :data="tableData" class="table-div">
                    <el-table-column type="index"  sortable='custom' label="序号" width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="buyerName" min-width="190"
                                     label="主体名称"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="score"  min-width="120"
                                     label="食安指数得分"  sortable='custom'></el-table-column>
                    <el-table-column show-overflow-tooltip prop="realDeduction" min-width="120" label="累计扣分"></el-table-column>
                    <el-table-column show-overflow-tooltip  min-width="100"
                                     label="风险评级">
                        <template slot-scope="scope">{{risk[scope.row.riskRating]}}</template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100"label="当前风险数">
                      <template slot-scope="scope">{{currentMonth==queryLimit.month?scope.row.ewCurrentNum:'-'}}</template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100" label="已处理风险数">
                      <template slot-scope="scope">{{currentMonth==queryLimit.month?scope.row.ewProcessedNum:'-'}}</template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="lastMonthScore" min-width="120"
                                     label="上月食安指数"></el-table-column>
                    <el-table-column show-overflow-tooltipmin-width="120" label="食安指数涨跌">
                         <template slot-scope="scope">
                           <!-- scoreChange -->
                           <i class="el-icon-top" style="color:#FA503B;" v-if='scope.row.scoreChange>0&&scope.row.scoreChange!=null'></i>
                           <i class="el-icon-bottom" style="color:#66D6A2;" v-if='scope.row.scoreChange<0&&scope.row.scoreChange!=null'></i>
                           {{Math.abs(scope.row.scoreChange)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" v-if='currentMonth==queryLimit.month' min-width="150" fixed="right">
                        <template slot-scope="scope">
                            <a href="javascript:;" class="operate-a" @click="view(scope.row.entityId)">详情</a>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-box">
                    <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
                                   :current-page="queryLimit.current" :page-sizes="[10, 20, 30, 40,50]"
                                   :page-size="queryLimit.size" layout="total, sizes, prev, pager, next, jumper"
                                   :total="total">
                    </el-pagination>
                </div>
                <!-- <el-dialog title="食安风险等级标准值范围配置" :visible.sync="isConfigDialogShow" :append-to-body="true">
                  <el-table element-loading-text="数据正在努力加载中" :border="true" :data="configData" class="table-div">
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="ewType" min-width="200" label="风险等级"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="standardValue" min-width="200" label="食安分数">
                      <template slot-scope="scope">
                        <div v-if="">
                          <span>=</span>
                          <el-input v-model.number="scope.row.score" placeholder="100" maxlength="10"></el-input>
                        </div>
                        <div v-if="">
                          <span>≥</span>
                          <el-input v-model.number="scope.row.score" placeholder="80" maxlength="10"></el-input>
                        </div>
                        <div v-if="">
                          <span>≥</span>
                          <el-input v-model.number="scope.row.score" placeholder="60" maxlength="10"></el-input>
                        </div>
                        <div v-if="">
                          <span>≤</span>
                          <el-input v-model.number="scope.row.score" placeholder="59" maxlength="10"></el-input>
                        </div>
                        
                      </template>
                    </el-table-column>
                  </el-table>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="isConfigDialogShow = false">取 消</el-button>
                    <el-button type="primary" @click="submitConfig">保 存</el-button>
                  </span>
                </el-dialog> -->
            </div>
        </div>
    </div>

</template>

<script>
import SelectAreaGrid from "components/common/SelectAreaGridTob.vue";
import * as api from "api/xcws/warn/warnTwo";
import { getMapping } from "../mapping";

export default {
  data() {
    return {
      disabled:false,
      risk:getMapping().risk,
      riskArr:[],
      pickerOptions: {
        disabledDate(time) {
           let date = new Date("2018-12-31");
          return time.getTime() > Date.now() - 8.64e6||time.getTime() < date;
        }
      },
      total: 0,
      loading: false,
      tableData: [],
      currentMonth:'',
      queryLimit: {
        areaId: '',
        current: 1,
        month: "",
        keyword: "",
        riskRating: "",
        scoreOrder: "DESC",
        size: 10,
      },
      props: {
        value: "areaId",
        label: "areaName",
        children: "children"
      },
      isConfigDialogShow: false,
      configData: []
    };
  },

  async mounted() {
    this.getNowDate();
    this.getElectOption();
    this.searchPage();
  },
  methods: {
    configRisk() {
      this.isConfigDialogShow = true;
    },
    getNowDate(){
        let date = new Date();
        let seperator1 = "-";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        let fullDate = year + seperator1 + month;
        this.currentMonth=fullDate;
        this.queryLimit.month=fullDate;
      },
    getElectOption() {
      this.riskArr = [];
      for (let i in this.risk) {
        this.riskArr.push({
          label: this.risk[i],
          value: i
        });
      }
    },
    sortChange(column) {
      if (column.order == "ascending") {
          this.queryLimit.scoreOrder = "ASC";
      }
      if (column.order == "descending") {
          this.queryLimit.scoreOrder = "DESC";
      }
      this.changeSearch();
    },
    view(id) {
      this.$router.push({
        name: "xcws.subjectAssessDetail",
        query: {
          entityId: id,
          month:this.queryLimit.month
        }
      });
    },
    changeSearch() {
      this.queryLimit.current = 1;
      this.searchPage();
    },
    async searchPage() {
      this.loading = true;
      let result = await api.getEwEntityRanking(this.queryLimit);
      if (result.status) {
        this.tableData = result.data.records;
        this.total = result.data.total;
        if (this.tableData.length <= 0) {
            this.disabled = true;
          } else {
            this.disabled = false;
          }
      } else {
        this.$message.warning(result.message);
      }
      this.loading = false;
    },
    async exportList() {
      this.disabled = true;
        api.getEwEntityRankingExport(this.queryLimit).then(r => {
          if (r.status) {
            location.href = r.data.fileUrl;
            this.disabled = false;
          }else{
             this.$message.warning('导出失败');
          }
        })
    },
    pagecCurrentChange(num) {
      this.queryLimit.current = num;
      this.searchPage();
    },
    pageSizeChange(size) {
      this.queryLimit.size = size;
      this.changeSearch();
    },
    areaChange(val) {
      if (!val || val.length == 0) {
        this.queryLimit.areaId = "";
      } else {
        this.queryLimit.areaId = val[val.length - 1];
      }
      this.changeSearch();
    },
    submitConfig() {
      this.isConfigDialogShow = false;
    },
  },
  components: { SelectAreaGrid },
};
</script>
<style scoped lang="scss">
.user-box {
  border-top: 2px solid #ebf1f5;
}
.page-tips {
  padding: 0 15px;
  width: calc(100% - 30px);
  height: 40px;
  background: rgba(255, 243, 233, 1);
  border: 1px solid rgba(255, 214, 182, 1);
  font-size: 16px;
  color: rgba(241, 130, 42, 1);
  line-height: 40px;
}
.ipt-btn-box {
  margin: 20px 0;
  span {
    line-height: 33px;
  }
}

.pagination-box {
  text-align: right;
  margin-top: 20px;
}

.table-div {
  width: 100%;
  text-align: center;
}

.operate-a {
  color: #1787ad;
}

table tr td:last-child .cell a {
  border-right: 1px solid #ccc;
  padding-right: 5px;
}

table tr td:last-child .cell a:last-child {
  border-right: none;
  padding-right: 0px;
}

.page-warn {
  height: 30px;
  .warnNum {
    width: 70%;
    font-size: 20px;
    font-weight: 400;
    color: #393939;
    line-height: 30px;

    span {
      color: #f15235;
    }
  }
}
</style>
