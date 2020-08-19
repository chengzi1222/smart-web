<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>辖区食安指数考核排名</span>
      <Back v-if='backShow'></Back>
    </div>
    <div class="user-box mt20">
      <div class="page-tips mt20">
        提示：食安指数过低的主体可能存在食品安全隐患。
      </div>
      <div class="ipt-btn-box clear_a ">
        <el-input placeholder="辖区名称" class="w250  mr20 seekIpt" v-model="queryLimit.areaName"
          @keyup.enter.native="searchPage">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="searchPage"></i>
        </el-input>
        <span class="mr10">月份筛选:</span>
        <div class="date boxSB">
          <el-date-picker v-model="queryLimit.month" type="month" :clearable="false" @change="searchPage"
            placeholder="选择月份" value-format="yyyy-MM" :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <el-button class="floatR w100" :disabled="disabled" type="primary" @click="down">导出</el-button>
      </div>
      <div class="tabOffTop120 mb90">
        <el-table v-loading="loading" @sort-change="sortChange" element-loading-text="数据正在努力加载中" :border="true"
          :resizable="true" :data="tableData" class="table-div">
          <el-table-column type="index" sortable='custom' label="序号" width="80"></el-table-column>
          <el-table-column show-overflow-tooltip prop="areaName" min-width="150" label="辖区名称"></el-table-column>
          <el-table-column prop="rank" sortable='custom' label="排名" width="80"></el-table-column>
          <el-table-column show-overflow-tooltip prop="score" min-width="80" label="食安指数"></el-table-column>
          <el-table-column show-overflow-tooltip prop="highEntity" min-width="80" label="高风险主体"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" prop="medEntity" label="中风险主体">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="lowEntity" min-width="80" label="低风险主体"></el-table-column>
          <el-table-column show-overflow-tooltip prop="lastRank" min-width="80" label="上月排名">
            <template slot-scope="scope">
              {{scope.row.lastRank==0?'-':scope.row.lastRank}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltipmin-width="120" label="排名涨跌">
            <template slot-scope="scope">
              <i class="el-icon-top" style="color:#FA503B;"
                v-if='scope.row.rankIncrease>0&&scope.row.rankIncrease!=null'></i>
              <i class="el-icon-bottom" style="color:#66D6A2;"
                v-if='scope.row.rankIncrease<0&&scope.row.rankIncrease!=null'></i>
              {{scope.row.rankIncrease==0||scope.row.rankIncrease==null?'-':Math.abs(scope.row.rankIncrease)}}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120" fixed="right">
            <template slot-scope="scope">
              <a href="javascript:;" class="operate-a" :class="{'dis':scope.row.areaId.length>6}"
                @click="view(scope.row.areaId )">详情</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>

</template>

<script>
  import {
    downloadFile
  } from 'api/common';
  import * as api from "api/xcws/warn/warnTwo";
  import Back from "utils/back.vue";

  export default {
    components: {
      Back
    },
    data() {
      return {
        disabled: false,
        backShow: false,
        pickerOptions: {
          disabledDate(time) {
            let date = new Date("2018-12-31");
            return time.getTime() > Date.now() - 8.64e6 || time.getTime() < date;
          }
        },
        loading: false,
        tableData: [],
        queryLimit: {
          areaId: "",
          areaName: "",
          month: "",
          scoreOrder: "DESC" //食安指数得分排序，默认DESC（ASC 升序 传参数）
        }
      };
    },
    mounted() {
      //处理下级页面刷新
      if (this.$route.query.areaId) {
        if (this.$route.query.areaId != undefined) {
          this.backShow = true
        } else {
          this.backShow = false
        }
        this.queryLimit.areaId = this.$route.query.areaId;
      } else {
        this.queryLimit.areaId = '';
      }
      this.getNowDate();
      this.searchPage();
    },
    watch: {
      $route(to, from) {
        if (to.query.areaId != undefined) {
          this.backShow = true
        } else {
          this.backShow = false
        }
        let id = '';
        if (to.query.areaId) {
          id = to.query.areaId
        } else {
          id = '';
        }
        this.getNowDate();
        this.queryLimit.areaId = id;
        this.queryLimit.areaName = '';
        this.queryLimit.scoreOrder = 'DESC';
        this.searchPage();
      }
    },
    methods: {
      down() {
        this.disabled = true;
        api.getAreaAssessExport(this.queryLimit).then(r => {
          if (r.status) {
            location.href = r.data.url;
            this.disabled = false;
          }
        })
      },
      getNowDate() {
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
        this.currentMonth = fullDate;
        this.queryLimit.month = fullDate;
      },
      sortChange(column) {
        if (this.queryLimit.scoreOrder != "ASC" && column.order == "ascending") {
          this.queryLimit.scoreOrder = "ASC";
          this.tableData.reverse();
        }
        if (this.queryLimit.scoreOrder != "DESC" && column.order == "descending") {
          this.queryLimit.scoreOrder = "DESC";
          this.tableData.reverse();
        }
      },
      view(id) {
        if (id.length > 6) {
          return;
        }
        this.$router.push({
          name: "xcws.areaAssess",
          query: {
            areaId: id,
            path: Math.random()
          }
        });
      },
      async searchPage() {
        this.tableData = [];
        this.loading = true;
        let result = await api.getAreaAssess(this.queryLimit);
        if (result.status) {
          this.tableData = result.data;
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
    }
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

  .dis {
    color: #ccc !important;
  }
</style>