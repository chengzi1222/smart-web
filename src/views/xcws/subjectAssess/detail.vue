<template>
  <div class="subjectAssess">
    <div class="page-tilt">
      <b></b>
      <span>食安指数考核详情</span>
      <Back></Back>
    </div>
    <div class="page-card mb20 mt20 clear_a">
      <ul class="mr20 clear_a">
        <li class="textell"><span>主体名称：</span>
          <el-tooltip class="item" effect="dark" :content="ewSummary.buyerName" placement="top-start">
            <span class="text longText">{{ewSummary.buyerName}}</span>
          </el-tooltip>
        </li>
        <li class="textell"><span>主体类型：</span>
          <span class="text">{{type[ewSummary.buyerType]}}</span>
        </li>
        <li class="textell"><span>负责人：</span>
          <el-tooltip class="item" effect="dark" :content="ewSummary.legalPerson" placement="top-start">
            <span class="text">{{ewSummary.legalPerson}}</span>
          </el-tooltip>
        </li>
        <li class="textell"><span>联系方式：</span>
          <el-tooltip class="item" effect="dark" :content="ewSummary.tel" placement="top-start">
            <span class="text">{{ewSummary.tel}}</span>
          </el-tooltip>
        </li>
        <li class="textell"><span>所属辖区：</span>
          <el-tooltip class="item" effect="dark" :content="ewSummary.areaName" placement="top-start">
            <span class="text">{{ewSummary.areaName}}</span>
          </el-tooltip>
        </li>
        <li class="textell" v-if="ewSummary.scType !== null && ewSummary.scType !== ''">
          <span>主体细类：</span><span class="text">{{ewSummary.scType == 'PUBLIC'? '公立':'私立'}}</span>
        </li>
        <li><span>详细地址：</span>
          <el-tooltip class="item" effect="dark" :content="ewSummary.address" placement="top-start">
            <span class="text">{{ewSummary.address}}</span>
          </el-tooltip>
        </li>
      </ul>
      <div class="clear_a">
        <div>
          <p class="number">{{ewSummary.ewCurrentNum}}</p>
          <p class="text">当前预警数</p>
        </div>
        <div>
          <p class="number">{{ewSummary.ewProcessedNum}}</p>
          <p class="text">已处理预警</p>
        </div>
      </div>
      <div class="clear_a">
        <div>
          <p class="number">{{ewSummary.score}}</p>
          <p class="text">当前得分</p>
        </div>
        <div>
          <p class="number">{{ewSummary.actualDeduction}}</p>
          <p class="text">当前扣分</p>
        </div>
      </div>
    </div>
    <div class="page-tilt">
      <b></b>
      <span>主体食安指数预警详情</span>
    </div>
    <div class="user-box mT35">
      <el-table :span-method="objectSpanMethod" :class="index==0?'firsTeit':''" :key="item.key" v-loading="loading"
        element-loading-text="数据正在努力加载中" v-for="(item,index) in tableData" :data="item.content" class="table-div brN">
        <el-table-column label="序号" min-width="50">
          <template slot-scope="scope">{{index+1}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="130" label="指标分类">
          <template slot-scope="scope">{{item.title}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="80" label="预警类型">
          <template slot-scope="scope">{{warning[scope.row.type]}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="80" label="当前预警数">
          <template slot-scope="scope">
            <a href="javascript:;" class="operate-a underline"
              @click="go(scope.row.ewCurrentNum,'ewCurrentNum',scope.row)">{{scope.row.ewCurrentNum}}</a>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="80" label="已处理预警数">
          <template slot-scope="scope">
            <a href="javascript:;" class="operate-a underline"
              @click="go(scope.row.ewProcessedNum,'ewProcessedNum',scope.row)">{{scope.row.ewProcessedNum}}</a>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="80" label="扣分项数量">
          <template slot-scope="scope">{{scope.row.deductionItemNum}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="deduction" min-width="80" label="累计扣分">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="deductionLimit" min-width="80" label="扣分上限">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="actualDeduction" min-width="80" label="实际扣分">
        </el-table-column>
        <el-table-column label="操作" min-width="80">
          <template slot-scope="scope">
            <a href="javascript:;" class="operate-a" @click="view(scope.row)">详情</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>

<script>
  import * as api from "api/xcws/warn/warnTwo";
  import {
    getMapping
  } from "../mapping";
  import Back from "utils/back.vue";
  import {
    debuglog
  } from 'util';

  export default {
    async mounted() {
      this.queryLimit.entityId = this.$route.query.entityId;
      if (this.$route.query.month) {
        this.queryLimit.month = this.$route.query.month;
      } else {
        this.queryLimit.month = this.getNowDate();
      }
      this.getEwSummary();
      this.searchPage();
    },
    methods: {
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
        return fullDate;
      },
      objectSpanMethod({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        let rownum = 0;
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].content.indexOf(row) >= 0) {
            rownum = this.tableData[i].content.length;
            break;
          }
        }
        if (columnIndex === 0 || columnIndex === 1) {
          if (rowIndex % rownum == 0) {
            return {
              rowspan: rownum,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      getEwSummary() {
        api.getEntityExamineInfo(this.queryLimit).then(r => {
          if (r.status) {
            this.ewSummary = r.data;
          } else {
            this.$message.warning("数据获取失败！请稍候重试");
          }
        });
      },
      async searchPage() {
        this.loading = true;
        let result = await api.getEntityEwDetail(this.queryLimit);
        if (result.status) {
          this.tableData = result.data;
        } else {
          this.$message.warning(result.message);
        }
        this.loading = false;
      },
      go(number, type, row) {
        let handleStatus = '';
        if (type == 'ewCurrentNum' && number > 0 && number !== null) { //未处理0
          handleStatus = "0"
        }
        if (type == 'ewProcessedNum' && number > 0 && number !== null) { //已处理1
          handleStatus = "1"
        }
        console.log(handleStatus)
        this.$router.push({
          name: 'xcwsWarn.' + this.url[row.type],
          query: handleStatus != '' ? {
            entityId: row.entityId,
            handleStatus: handleStatus
          } : {
            entityId: row.entityId
          }
        });
      },
      view(row) {
        this.$router.push({
          name: 'xcwsWarn.' + this.url[row.type],
          query: {
            entityId: row.entityId
          }
        });
      },
    },
    data() {
      return {
        url: {
          '0101': 'foodDetail',
          '0102': 'traceDetail',
          '0103': 'kitchenDetail',
          '0201': 'checkDetail',
          '0202': 'AIWarnDetail',
          '0301': 'superviseDetail',
          '0302': 'healthCertDetail',
          '0303': 'licenceDetail',
          '0401': 'complaintDetail',
        },
        warning: getMapping().warning,
        type: getMapping().type,
        loading: false,
        tableData: [{
            title: "你好",
            key: "01",
            content: [{
              name: "44444"
            }]
          },
          {
            title: "你好2",
            key: "02",
            content: [{
                name: "444442"
              },
              {
                name: "444443"
              }
            ]
          }
        ],
        ewSummary: {
          buyerName: "暂无",
          buyerType: "暂无",
          legalPerson: "暂无",
          tel: "暂无",
          areaName: "暂无",
          address: "暂无",
          scType: "PUBLIC",
          deduction: 0,
          deductionLimit: 0,
          ewDate: 0,
          ewProcessedNum: 0,
          actualDeduction: 0
        },
        queryLimit: {
          entityId: "",
          month: ""
        },
      };
    },
    components: {
      Back
    }
  };
</script>
<style scoped lang="scss">
  .subjectAssess {
    position: relative;
    width: 100%;
  }

  .ipt-btn-box {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;

    span {
      line-height: 33px;
    }
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .table-div {
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

  .page-card {
    height: 200px;

    >ul {
      padding-top: 20px;
      height: calc(100% - 20px);
      border: 1px solid rgba(194, 202, 210, 1);
      width: calc(40% - 22px);

      li {
        width: calc(100% / 2);
        margin-bottom: 20px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(109, 119, 135, 1);
        line-height: 22px;

        span {
          width: 38%;
          text-align: right;
          margin-right: 2%;
          display: inline-block;
          vertical-align: middle;
        }

        span.text {
          width: 56%;
          text-align: left;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }

    >div {
      height: calc(50% - 11px);
      border: 1px solid rgba(194, 202, 210, 1);
      width: calc(60% - 2px);

      >div {
        height: 100%;
        width: 50%;
        text-align: center;

        p.number {
          font-size: 28px;
          font-weight: 500;
          color: rgba(57, 57, 57, 1);
          line-height: 40px;
          margin-bottom: 10px;
          margin-top: 10px;
        }

        p.text {
          font-size: 14px;
          font-weight: 400;
          color: rgba(162, 170, 182, 1);
          line-height: 20px;
        }
      }
    }

    >div:last-child {
      margin-top: 20px;
    }
  }

  .mT35 {
    margin-top: 35px;
  }

  .underline {
    text-decoration: underline;
  }
</style>
<style lang="scss">
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

  .mT35 .el-table {
    border-top: none !important;
  }

  .mT35 .firsTeit {
    border-top: 1px solid #ebeef5 !important;
  }

  .mT35 .table-div .el-table__body-wrapper {
    width: 100%;
  }
</style>