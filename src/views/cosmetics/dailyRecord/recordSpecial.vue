<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)"
    class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>专项巡查记录</span>
    </div>
    <div class="ipt-btn-box">
      <el-input style="vertical-align:top;" placeholder="名称、编号、人员" class="w200 seekIpt" v-model="search.select" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>
      <el-date-picker @change="handleIconClick" class="sleq w150" type="date" value-format="yyyy-MM-dd" v-model="search.startDate"
        placeholder="起始时间" :picker-options="beforeDate"></el-date-picker>
      至
      <el-date-picker @change="handleIconClick" v-model="search.endDate" class="slez w150" type="date" value-format="yyyy-MM-dd"
        placeholder="截止时间" :picker-options="afterDate">
      </el-date-picker>
      <select-area-grid class="selectHeight w150" placeholder="分管网格" @change="deptChange"></select-area-grid>
      <!-- <enum-select v-model="search.specialId" multiple placeholder="巡查计划（全部）" @change="handleIconClick"></enum-select> -->
      <el-select @change="handleIconClick" clearable class="w200 selectHeight" v-model="search.specialId" placeholder="巡查计划（全部）">
        <el-option v-for="item in specialIdList" :key="item.specialId" :label="item.planName" :value="item.specialId"></el-option>
      </el-select>
      <!-- <i :class="down?'el-icon-caret-top':'el-icon-caret-bottom'" class="down" @click="downSeleBox"></i> -->
      <el-button class="selectHeight floatR" type="primary" v-auth="'cosmetic.patrol.record|func.add'" @click="add">
        <i style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>添加记录
      </el-button>
    </div>
    <div class="ipt-btn-box" style="margin-left: -20px;" >
      <enum-select v-model="search.entityType" multiple placeholder="主体类型" @change="handleIconClick" enum="com.ybveg.govx.enums.cosmetic.CosmeticEntityTypeEnum"></enum-select>
      <enum-select v-model="search.result" multiple placeholder="巡查结果" @change="handleIconClick" enum="com.ybveg.govx.enums.patrol.RecordResultEnum"></enum-select>
      <enum-select v-model="search.treat" multiple placeholder="处理方式" @change="handleIconClick" enum="com.ybveg.govx.enums.patrol.TreatEnum"></enum-select>
      <select-dept-grid class="selectHeight w150" placeholder="检查部门" @change="doDeptChange">
      </select-dept-grid>
    </div>
    <div class="tabOffTop170">
      <el-table :data="tableData" class="table-div" :border="true" :resizable="true" :class="shadowShow?'shadowNo':''" @sort-change="handleSortChange"
        :key="maxheight">
        <el-table-column type="index" min-width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="120" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="patrolRecordNo" min-width="120" label="巡查记录编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" min-width="100" label="辖区机构"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityTypeStr" min-width="70" label="主体类型"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="70" label="检查人员/监管人员">
          <template slot-scope="data">
            <span>{{data.row.checkNames ? data.row.checkNames : '无'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="70" label="信息员">
          <template slot-scope="data">
            <span>{{data.row.accompanyNames ? data.row.accompanyNames : '无'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="70" prop="resultStr" label="巡查结果"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="70" label="问题项/巡查项">
          <template slot-scope="data">
            <span>{{data.row.eqmess}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="treatStr" min-width="70" label="处理方式"></el-table-column>
        <el-table-column show-overflow-tooltip prop="patrolDeptName" min-width="70" label="检查部门"></el-table-column>
        <el-table-column show-overflow-tooltip prop="patrolTime" sortable="custom" min-width="90" label="巡查日期"></el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <a href="javascript:;" @click="view(scope.row.id, scope.row.patrolAreaCode)" class="operate-a">详情</a>
            <a href="javascript:;" @click="printRecord(scope.row.id, true)" class="operate-a">打印预览</a>
            <a href="javascript:;" @click="printRecord(scope.row.id, false)" class="operate-a">打印</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="page.num" :page-sizes="[5,8,10,15,20,25,30]"
          :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>

     <!-- 打印组件 -->
    <PrintPatrol ref="PrintPatrol" :patrolData="patrolData" :patrolContent="patrolContent"
      :resultData="resultData" :patrolType="'专项监督抽查'" :qrcodeId="qrcodeId">
    </PrintPatrol>

  </div>
</template>

<script type="module">
  import EnumSelect from 'components/common/EnumSelect.vue';
  import SelectAreaGrid from 'components/common/SelectAreaGrid.vue';
  import SelectDeptGrid from 'components/common/SelectDeptGridAll.vue';
  import { boxShadow, calcTableHeight } from 'utils/utils';
  import { doPrintRecord } from 'utils/print/doPrint.js';
  import * as plan from "api/medi/patrol/project";
  import * as planApi from "api/cosmetics/dailyRecord";
  import PrintPatrol from './PrintPatrol.vue';

  export default {
    components: {
      EnumSelect, SelectAreaGrid, PrintPatrol, SelectDeptGrid
    },
    async mounted() {
      this.loading = true;
      if (this.$route.query.startTime && this.$route.query.endTime) {
        this.search.startDate = this.$route.query.startTime;
        this.search.endDate = this.$route.query.endTime;
      }
      if (this.$route.query.planName) {
        this.search.specialId = this.$route.query.planName;
      }
      //分管网格
      planApi.getFindSpecialPlanList().then( r => {
        this.specialIdList = r.data;
      })
      this.getPage();
      this.maxheight = calcTableHeight(this.tableHeight, 240);
      setTimeout(() => {
        this.shadowShow = boxShadow(document.getElementsByClassName("el-table")[0].clientWidth,
          document.getElementsByClassName("el-table__body")[0].clientWidth);
      }, 0);

    },
    methods: {
      downSeleBox() {
        this.down = !this.down;
        if (this.down) {
          this.maxheight = calcTableHeight(this.tableHeight, 240);
        } else {
          this.maxheight = calcTableHeight(this.tableHeight, 190);
        }
      },
      add() {
        this.$router.push({
          name: "recordSpecial.add",
          query: {
            type: 'special'
          }
        });
      },
      //页面查询
      async getPage() {
        var formData = {
          search: this.search.select,
          patrolDeptCode: this.search.doDeptId,
          deptCode: this.search.areaCode,
          entityType: this.search.entityType,
          specialId: this.search.specialId,
          beginDate: this.search.startDate,
          endDate: this.search.endDate,
          sortType: this.search.sortType,
          result: this.search.result,
          treat: this.search.treat,
          patrolPlanType: 'SPECIAL'
        }
        this.loading = true;
        planApi.postRecordPage(formData, this.page.num, this.page.pageSize).then(r => {
          this.loading = false;
          if (!r.status) {
            this.tableData = [];
            this.page.total = 0;
            return false;
          }
          this.tableData = r.data.list;
          this.page.total = r.data.total;
        })
      },
      handleIconClick() {
        this.getPage();
      },
      //分页条
      pageCurrentChange(num) {
        this.page.num = num;
        this.getPage();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.getPage();
      },
      // 排序
      handleSortChange({ order }) {
        this.search.sortType = order == 'descending' ? 'DESC' : 'ASC';
        this.getPage();
      },
      deptChange(deptId) {
        this.search.areaCode = !deptId ? "" : deptId[deptId.length - 1];
        this.getPage();
      },
      doDeptChange(deptId) {
        this.search.doDeptId = !deptId ? "" : deptId[deptId.length - 1];
        this.getPage();
      },
      //当前年的第一天
      getFirstDayOfYear(date) {
        var currentYear = date.getFullYear();
        return new Date(currentYear, 0, 1);
      },
      view(recordId, patrolAreaCode) {
        this.$router.push({
          name: 'recordSpecial.info',
          query: {
            recordId: recordId,
            patrolType: "SPECIAL",
            patrolAreaCode: patrolAreaCode
          }
        })
      },

      /* 打印 */
      async printInitData(id, type) {
        this.qrcodeId = id;
        await planApi.getPatrolRecord(id, type).then(d => {
          this.resultData = d.data.basic;
          this.resultData.planName = d.data.basic.entityTypeStr + "专项监督检查";
          this.resultData.checkNames = d.data.checkNames;
          this.resultData.accompanyNames = d.data.accompanyNames;
          this.resultData.statistics = d.data.statistics;
          this.resultData.upfileList = d.data.signList.length > 0 ? d.data.signList[0].fileId : '';
        });
      },

      async printRecord(id, isPreview) {
        this.loading = true;
        await this.printInitData(id, "DAILY");
        this.$refs.PrintPatrol.printStyle();
        setTimeout(() => {
          doPrintRecord(isPreview);
          setTimeout(() => {
            this.loading = false;
          }, 1000)
        }, 2000)
      }
    },
    computed: {
      tableHeight() {
        return this.$store.state.layout.tableHeight;
      },
      tableWidth() {
        return this.$store.state.layout.tableWidth;
      }
    },
    watch: {
      tableHeight() {
        this.maxheight = calcTableHeight(this.tableHeight, 240);
      },
      tableWidth() {
        setTimeout(() => {
          this.shadowShow = boxShadow(document.getElementsByClassName("el-table")[0].clientWidth,
            document.getElementsByClassName("el-table__body")[0].clientWidth);
        }, 0)
      }
    },
    data() {
      return {
        down: true,
        maxheight: 0,
        shadowShow: false,
        page: {
          pageSize: 10,
          num: 1,
          total: 0
        },
        specialIdList:[],
        search: {
          select: "",   //搜索
          entityType: [], //主体类型
          specialId:'',
          result: [], //主体类型
          treat: [], //主体类型
          sortType: "DESC",
          areaCode: "",//网格
          doDeptId: "",//执行部门
          startDate: "",
          endDate: ""
        },
        //列表数据
        tableData: [],
        //打印
        printShow: false,
        qrcodeId: "",
        basicInfoData: {},
        messengers: "",

        patrolData: {
          normal: 0,
          normalQual: 0,
          normalNoQual: 0,
          normalQualStr: "",

          important: 0,
          importantQual: 0,
          importantNoQual: 0,
          importantQualStr: "",
        },
        patrolContent: {
          normal: [],
          important: []
        },
        patrolDataInit: {
          normal: 0,
          normalQual: 0,
          normalNoQual: 0,
          normalQualStr: "",

          important: 0,
          importantQual: 0,
          importantNoQual: 0,
          importantQualStr: "",
        },
        patrolContentInit: {
          normal: [],
          important: []
        },
        resultData: {},
        loading: false,
        afterDate: {
          disabledDate: (time) => {
            let startDate = new Date(this.search.startDate);
            if (this.search.startDate) {
              return time.getTime() < startDate - 8.64e7;
            }
          }
        },
        beforeDate: {
          disabledDate: (time) => {
            let endDate = new Date(this.search.endDate);
            if (this.search.endDate) {
              return time.getTime() > endDate;
            }
          }
        },
      };
    }
  }
</script>

<style scoped lang="sass">
  .user-box {
    width: 100%;
    position: relative;
  }

  .li-bott span {
    color: #393939;
  }

  .tab-box .tab-bott {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 2px;
    background: #EBF1F5;
  }

  .down {
    display: inline-block;
    width: 32px;
    height: 32px;
    border: 1px solid #C2CAD2;
    color: #A2AAB6;
    text-align: center;
    line-height: 32px;
    font-size: 18px;
    margin-left: 20px;
  }

  .ipt-btn-box {
    margin: 20px 0;
    display: flex;
    line-height: 34px;
  }

  .ipt-btn-box button {
    position: absolute;
    right: 40px;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;
    font-size: 15px;
    color: #9A9A9A;
    text-align: center;
  }

  .tab-box a {
    color: #9A9A9A;
    width: 100%;
    height: 100%;
    display: inline-block;
  }

  .tab-box a span {
    float: right;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0DB5EF;
    z-index: 666;
    position: relative;
  }

  .li-bott a {
    color: #393939;
  }

  .tab-box {
    width: 100%;
    /*display: flex;*/
    position: relative;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;

    font-size: 15px;
    color: #9A9A9A;
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
    background: #EBF1F5;
  }

  .ipt-btn-box {
    margin: 20px 0;
    /*display: flex;*/
    /*justify-content: space-between;*/
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
    color: #1787AD;
  }

  table tr td:last-child .cell a {
    border-right: 1px solid #ccc;
    padding-right: 5px;
  }

  table tr td:last-child .cell a:last-child {
    border-right: none;
    padding-right: 0px;
  }

  .sleq {
    margin: 0 10px 0 20px;
  }

  .slez {
    margin-left: 10px;
  }

  #content {
    margin-top: 100px;
    /* opacity: 0; */
  }

  @media print {
    .cut {
      page-break-after: always;
      padding-bottom: 30px;
      min-height: 800px;
    }
  }
</style>
