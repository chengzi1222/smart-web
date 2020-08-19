<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>许可证预警详情</span>
      <back></back>
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
          <el-tooltip class="item" effect="dark" :content="ewSummary.areaName_" placement="top-start">
            <span class="text">{{ewSummary.areaName_}}</span>
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
          <p class="number">{{ewSummary.ewProcessedNum}}</p>
          <p class="text">已经处理预警数</p>
        </div>
        <div>
          <p class="number">{{ewSummary.ewCurrentNum}}</p>
          <p class="text">当前预警数</p>
        </div>
        <!-- <div>
                    <p class="number">{{ewSummary.credibility}}%</p>
                    <p class="text">预警综合可信度</p>
                </div> -->
      </div>
      <div class="clear_a">
        <div>
          <p class="number">{{ewSummary.deduction}}</p>
          <p class="text">当前总扣分</p>
        </div>
        <div>
          <p class="number">{{ewSummary.deductionLimit}}</p>
          <p class="text">扣分上限</p>
        </div>
        <div>
          <p class="number">{{ewSummary.actualDeduction}}</p>
          <p class="text">实际总扣分</p>
        </div>
      </div>
    </div>
    <div class="user-box">
      <div class="ipt-btn-box" style="justify-content: end;">
        <el-input placeholder="处理人" class="w250 mr20 seekIpt" v-model="tableLimit.person"
          @keyup.enter.native="changeSearch">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch"></i>
        </el-input>
        <el-select class="mr20" v-model="tableLimit.state" @change="changeSearch" placeholder="处理状态" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select class="mr20" v-model="tableLimit.type" @change="changeSearch" placeholder="处理方式" clearable>
          <el-option v-for="(value,key) in methodOptions" :key="value" :label="value" :value="key"></el-option>
        </el-select>
        <el-select class="mr20" v-model="tableLimit.handleDept" @change="changeSearch" placeholder="处理部门" clearable>
          <el-option v-for="(value,key) in disposeDept" :key="value" :label="value" :value="key">
          </el-option>
        </el-select>
        <el-select class="mr20" v-model="tableLimit.ewType" @change="changeSearch" placeholder="异常类型" clearable>
          <el-option v-for="(value,key) in ewType" :key="value" :label="value" :value="key">
          </el-option>
        </el-select>
      </div>
      <div class="ipt-btn-box" style="justify-content: end;">
        <div style="display: inline-block;">
          预警日期：
          <el-date-picker :picker-options="pickerOptions0" v-model="tableLimit.beginDate" @change="changeSearch"
            type="date" value-format="yyyy-MM-dd" placeholder="开始日期" class="ml10 mr10 w140"></el-date-picker>至
          <el-date-picker :picker-options="pickerOptions1" v-model="tableLimit.endDate" @change="changeSearch"
            type="date" value-format="yyyy-MM-dd" placeholder="结束日期" class="ml10 mr10 w140"></el-date-picker>
        </div>
        <el-checkbox v-model="tableLimit.showDeduct" style="line-height:34px;" @change="changeSearch">仅显示扣分项
        </el-checkbox>
      </div>
      <div class="tabOffTop120">
        <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
          :data="tableData" @sort-change="sortChange" class="table-div">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="150" label="许可证预览">
            <template slot-scope="scope">
              <el-image v-if="scope.row.imgUrl !==null&&scope.row.imgUrl !==''" style="width: 100px; height: 100px"
                :src="scope.row.imgUrl" :preview-src-list="[scope.row.imgUrl]">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="licenceCode" min-width="150" label="许可证编号"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="150" label="异常类型">
            <template slot-scope="scope">{{ewType[scope.row.ewType]}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="expirationDate" min-width="120" label="过期日期"></el-table-column>
          <el-table-column show-overflow-tooltip prop="ewDate" sortable='custom' min-width="120" label="预警时间">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="deduction" min-width="100" label="扣分"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" label="处理状态">
            <template slot-scope="scope">{{statusOptions_[scope.row.handleState]}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" label="处理方式">
            <template slot-scope="scope">{{methodOptions[scope.row.handleType]}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="handleDept" min-width="100" label="处理部门">
            <template slot-scope="scope">{{disposeDept[scope.row.handleDept]}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="handlePersonName" min-width="100" label="处理人"></el-table-column>
          <el-table-column show-overflow-tooltip prop="handleTime" min-width="100" label="处理时间"></el-table-column>
          <el-table-column show-overflow-tooltip prop="handleRemark" min-width="100" label="处理备注"></el-table-column>
          <el-table-column min-width="100" label="处理附件">
            <template slot-scope="scope">
              <div v-if='scope.row.urlList_.length>0' style="width: 100px; height: 100px">
                <el-image style="width: 100px; height: 100px" :src="scope.row.urlList_[0]"
                  :preview-src-list="scope.row.urlList_">
                </el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100" fixed="right">
            <template slot-scope="scope">
              <a href="javascript:;" class="operate-a"
                v-if="scope.row.handlePersonName==''||scope.row.handlePersonName==null"
                @click="dispose('dispose',scope.row)">处理</a>
              <a href="javascript:;" class="operate-a"
                v-if="scope.row.handlePersonName!=''&&scope.row.handlePersonName!=null"
                @click="dispose('review',scope.row)">重新处理</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
            :current-page="tableLimit.currentPage" :page-sizes="[10, 20, 30, 40,50]" :page-size="tableLimit.size"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <Dialog :dialogData="dialogData" url="/ewcenter/licence/update" :showTip="disposeAddDialog" v-if="disposeAddDialog"
      @refresh="disposeRefresh" disposeType='02' @cancel="closeDialog">
    </Dialog>
  </div>

</template>

<script>
  import Dialog from "../disposeDialog";
  import * as api from "api/xcws/warn/warnTwo";
  import {
    getMapping
  } from "../../mapping";
  import config from "utils/config";
  import Back from 'utils/back.vue'

  export default {
    components: {
      Dialog,
      Back
    },
    async mounted() {
      this.queryLimit.entityId = this.$route.query.entityId;
      this.tableLimit.entityId = this.$route.query.entityId;
      if (this.$route.query.handleStatus) {
        this.tableLimit.state = this.$route.query.handleStatus * 1;
      }
      this.getEwSummary();
      this.searchPage();
    },
    methods: {
      getEwSummary() {
        api.getEwSummary(this.queryLimit).then(r => {
          if (r.status) {
            this.ewSummary = r.data;
            if (this.ewSummary.streetAreaName !== null) {
              this.ewSummary.areaName_ = this.ewSummary.areaName + this.ewSummary.streetAreaName
            } else {
              this.ewSummary.areaName_ = this.ewSummary.areaName
            }
          } else {
            this.$message.warning("数据获取失败！请稍候重试");
          }
        });
      },
      sortChange(column) {
        if (column.order == "ascending") {
          this.tableLimit.isDesc = false;
        }
        if (column.order == "descending") {
          this.tableLimit.isDesc = true;
        }
        this.changeSearch();
      },
      async searchPage() {
        this.loading = true;
        let result = await api.getEwLicenceList(this.tableLimit);
        if (result.status) {
          this.tableData = [];
          result.data.records.map(item1 => {
            if (item1.urlList.length > 0) {
              let arr = item1.urlList.map(item => this.pathFile + item.fileUrl)
              this.$set(item1, 'urlList_', arr)
            } else {
              this.$set(item1, 'urlList_', [])
            }
            this.tableData.push(item1)
          })
          this.total = result.data.total;
        } else {
          this.$message.warning(result.message);
        }
        this.loading = false;
      },
      changeSearch() {
        this.tableLimit.currentPage = 1;
        this.searchPage();
      },
      pagecCurrentChange(num) {
        this.tableLimit.currentPage = num;
        this.searchPage();
      },
      pageSizeChange(size) {
        this.tableLimit.size = size;
        this.changeSearch();
      },
      disposeRefresh() {
        this.getEwSummary();
        this.searchPage();
      },
      dispose(type, row) {
        if (type == "review") {
          this.dialogData.title = "重新处理";
          this.dialogData.handleRemark = row.handleRemark;
          this.dialogData.handlePersonName = row.handlePersonName;
          this.dialogData.fidList = row.urlList;
        } else if (type == "dispose") {
          this.dialogData.title = "预警处理";
        }
        this.dialogData.id = row.id;
        this.dialogData.defaultDeduction = row.defaultDeduction;
        this.disposeAddDialog = true;
      },
      closeDialog() {
        this.disposeAddDialog = false;
      }
    },
    data() {
      return {
        pathFile: config.schoolTraceBaseUrl,
        total: 0,
        loading: false,
        tableData: [],
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
          actualDeduction: 0,
          areaName_: ''
        },
        queryLimit: {
          entityId: "",
          ewType: "LICENSE_EXPIRED"
        },
        tableLimit: {
          entityId: "",
          currentPage: 1,
          size: 10,
          beginDate: "",
          endDate: "",
          state: "",
          type: "",
          handleDept: '',
          ewType: '',
          person: "",
          showDeduct: false,
          isDesc: true
        },
        type: getMapping().type,
        disposeDept: getMapping().disposeDept,
        ewType: {
          '030301': "已过期",
          '030302': "即将过期",
        },
        statusOptions_: {
          '1': '已处理',
          '0': '未处理',
          '2': '逾期未处理'
        },
        statusOptions: [{
            label: "已处理",
            value: 1
          },
          {
            label: "未处理",
            value: 0
          },
          {
            label: "逾期未处理",
            value: 2
          }
        ],
        methodOptions: getMapping().handle2,
        methodOptionsArr: [],
        pickerOptions0: {
          disabledDate: time => {
            let endDate = new Date(this.tableLimit.endDate);
            let date = new Date("2018-12-31");
            if (this.tableLimit.endDate) {
              return time.getTime() > endDate || time.getTime() < date || time.getTime() > Date.now() - 8.64e6
            } else {
              return time.getTime() < date || time.getTime() > Date.now() - 8.64e6
            }
          }
        },
        pickerOptions1: {
          disabledDate: time => {
            let startDate = new Date(this.tableLimit.beginDate);
            let date = new Date("2018-12-31");
            if (this.tableLimit.beginDate) {
              return time.getTime() < startDate - 8.64e7 || time.getTime() < date || time.getTime() > Date.now() -
                8.64e6
            } else {
              return time.getTime() < date || time.getTime() > Date.now() - 8.64e6
            }
          }
        },
        dialogData: {
          id: "",
          title: "",
          handlePerson: "",
          handleRemark: "",
          defaultDeduction: 0
        },
        disposeAddDialog: false
      };
    }
  };
</script>
<style scoped lang="scss">
  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;

    font-size: 15px;
    color: #9a9a9a;
    text-align: center;
  }

  .li-bott span {
    color: #393939;
  }

  .tab-box .tab-bott {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 2px;
    background: #ebf1f5;
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

      >div {
        width: 33%;
      }
    }
  }

</style>