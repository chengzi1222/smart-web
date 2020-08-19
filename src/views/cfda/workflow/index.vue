<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>备案审核</span>
    </div>
    <!-- title -->
    <ul class="tab-box">
      <li v-for="(item,index) in lists" :key="item.tabName" @click="liClick(index)" :data-index='index' :class="index == defaultIndex? 'li-bott':''">
        <span :data-index='index'>{{item.tabName}}
          <span>
            <span v-if="item.num" style="margin-left:20px;">{{item.num}}</span>
          </span>
        </span>
      </li>
      <li class="tab-bott"></li>
    </ul>

    <!--body-->
    <div style="height: calc(100% - 120px)">
      <div class="ipt-btn-box" style="justify-content: end;">
        <el-input placeholder="备案号、名称、社会信用代码" class="w250 seekIpt" v-model="condition.search" @keyup.enter.native="handleIconClick">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
        </el-input>

        <el-select class="selectHeight" v-model="condition.bizTypes" multiple collapse-tags placeholder="主体类型" @change="tabSearch">
          <el-option v-for="item in bizTypesOptions" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>

        <el-select class="selectHeight" v-model="condition.workTypes" multiple collapse-tags placeholder="业务类型" @change="tabSearch">
          <el-option v-for="item in bizStatesOptions" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>

        <select-area-grid class="selectHeight" placeholder="分管网格" @change="deptChange"></select-area-grid>

        <div class="clear_a">
          <el-date-picker @change="handleIconClick" value-format="yyyy-MM-dd" class="selectHeight" type="date"
                          v-model="condition.startDate"
                          placeholder="起始时间" :picker-options="beforeDate"></el-date-picker>
          <div style="line-height:34px;text-align:center;width:30px;">至</div>
          <el-date-picker @change="handleIconClick" value-format="yyyy-MM-dd" v-model="condition.endDate"
                          class="selectHeight" style="margin-left:0 !important;"
                          type="date" placeholder="截止时间" :picker-options="afterDate"></el-date-picker>
        </div>

        <el-button @click="exporWorkFile" class="floatR" type="primary" style="margin-left:20px;" v-if="condition.workState == 'ALREADY_FILE'">导出</el-button>

      </div>

      <div class="tabOffTop50">
        <el-table :data="tableData" :border="true" :resizable="true" @sort-change="sortChange" class="table-div" v-loading="loading">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="workNo" min-width="100" label="工单号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="creditCode" min-width="100" label="社会信用代码"></el-table-column>
          <el-table-column show-overflow-tooltip prop="entityName" min-width="90" label="主体名称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="backupNo" min-width="120" label="备案号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="typeStr" min-width="100" label="三小性质"></el-table-column>
          <el-table-column show-overflow-tooltip prop="deptName" min-width="140" label="分管网格"></el-table-column>
          <el-table-column v-if="condition.workState == 'ALREADY_REJECT'" show-overflow-tooltip prop="updateTime" min-width="110" label="驳回时间"
            sortable='custom'></el-table-column>
          <el-table-column v-else show-overflow-tooltip prop="updateTime" min-width="110" label="更新时间" sortable='custom'></el-table-column>
          <el-table-column show-overflow-tooltip prop="workTypeStr" min-width="70" label="业务类型"></el-table-column>
          <el-table-column v-if="condition.workState == 'ALREADY_REJECT'" show-overflow-tooltip prop="backReason" min-width="100" label="驳回原因"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a href="javascript:;" v-if="condition.workState == 'ALREADY_REJECT' || condition.workState == 'ALREADY_FILE'" @click="viewClick(scope.row)"
                class="operate-a">详情</a>
              <a href="javascript:;" v-if="condition.workState == 'PEND_REVIEW' && scope.row.workType != 'EDIT'" v-auth="'food.biz.cfda|func.review'"
                @click="reviewClick(scope.row)" class="operate-a">审核</a>
              <a href="javascript:;" v-if="condition.workState == 'PEND_REVIEW' && scope.row.workType == 'EDIT'" v-auth="'food.biz.cfda|func.review'"
                @click="viewClickEdit(scope.row)" class="operate-a">审核</a>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-box">
          <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange" :current-page="page.pageNum"
            :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
          </el-pagination>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

  import { countWork, getWorkStatus, getPage,exporFile } from "api/cfda/bizWorkflow";
  import { getdeptGrid, getCfdaType } from "api/cfda/enetityRecordList";
  import { WORK_STATUS, CURRENT_ENTITY_MENU } from "views/cfda/workflow/workUtil.js";
  import SelectAreaGrid from 'components/common/SelectAreaGrid';
  import {downloadFile} from 'api/common'

  export default {
    async mounted() {
      this.loading = true;
      await countWork().then((r) => {
        let data = r.data;
        //初始化选项卡
        this.lists.push(
          { tabName: '待审核', workState: WORK_STATUS.PEND_REVIEW, num: data.PEND_REVIEW },
          { tabName: '已归档', workState: WORK_STATUS.ALREADY_FILE, num: data.ALREADY_FILE },
          { tabName: '已驳回', workState: WORK_STATUS.ALREADY_REJECT, num: data.ALREADY_REJECT }
        );
        //默认显示待审核table
        this.condition.workState = WORK_STATUS.PEND_REVIEW;

        //分页查寻工单信息
        this.tabSearch();

        //初始化主体类型下拉框
        getCfdaType().then((result) => {
          this.bizTypesOptions = result.data;
        });

        //初始化工单类型下拉框
        getWorkStatus().then((result) => {
          this.bizStatesOptions = result.data;
        });

        //初始化分管网络下拉框
        getdeptGrid().then((result) => {
          this.deptsOptions.options = result.data;
        });

        this.initDate();

      });
    },
    methods: {
      //后台排序
      sortChange(column) {
        if (column.order == 'ascending') {
          this.condition.sort = 'ASC';
        }
        if (column.order == 'descending') {
          this.condition.sort = 'DESC'
        }
        this.tabSearch();
      },
      reviewClick(row) {
        if (row.workType == 'CANCEL') {
          const $this = this;
          this.$confirm('注销操作审核生效后不可撤回，请确认是否注销该主体', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push({
              name: 'cfda.workflow.review',
              query: {
                id: row.id,
                back: 'cfda.workflow',
              },
              params: {
                type: CURRENT_ENTITY_MENU.info,
              }
            });
          }).catch(_ => { });
        } else {
          this.$router.push({
            name: 'cfda.workflow.review',
            query: {
              id: row.id,
              back: 'cfda.workflow',
            },
            params: {
              type: CURRENT_ENTITY_MENU.info,
            }
          });
        }
      },

      viewClickEdit(row) {
        this.$router.push({
          name: 'cfda.archives.edit',
          query: {
            id: row.id,
            type: row.workType,
            entryType: 'cfda',
            entityName: row.entityName,
            review: true
          }
        });
      },

      //查看详情
      viewClick(row) {
        this.$router.push({
          name: 'cfda.workflow.detail',
          query: {
            id: row.id,
            back: 'cfda.workflow',
          },
          params: {
            type: CURRENT_ENTITY_MENU.work,
          }
        });
      },
      //分管网络条件赛选
      deptChange(deptId) {
        this.condition.dept = !deptId ? "" : deptId[deptId.length - 1];
        this.tabSearch();
      },
      //搜索框条件赛选
      handleIconClick() { //搜索框按钮点击搜索
        this.a = !this.a;
        this.tabSearch();
      },
      //分页条件查寻
      async searchPage() {
        var formData = {
          params: this.condition,
          num: this.page.pageNum,
          size: this.page.pageSize,
        };
        this.loading = true;
        getPage(formData).then((result) => {
          this.loading = false;
          result.data.pageNum = result.data.pageNum == 0 ? 1 : result.data.pageNum;
          this.page.total = result.data.total;
          this.tableData = result.data.list;
        });
      },
      pagecCurrentChange(num) {
        console.log(num)
        this.page.pageNum = num;
        this.searchPage();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.searchPage();
      },
      tabSearch() {
        this.page.pageNum = 1;
        this.searchPage();
      },
      liClick(index) {   //点击导航切换样式
        var me = this;
        me.defaultIndex = index;
        this.condition.workState = this.lists[me.defaultIndex].workState;
        this.tabSearch();
      },
      initDate(){
        //初始化时间
        const dates = new Date();
        let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        let day = dates.getDate();                   //getdate()返回的是1-31，则不需要加1
        if (day <= 9) {                                     //如果小于9的话，则需要加上0
          day = "0" + day;
        }
        this.condition.endDate = dates.getFullYear() + "-" + mon + "-" + day;
      },
      //导出
      exporWorkFile(){
        this.condition.title = '已归档备案审核';
        exporFile(this.condition).then((result) => {
          downloadFile(result.data.fileId, this.condition.title);
        });
      },
    },
    components: {
      SelectAreaGrid,
    },
    data() {
      return {
        a: false,
        tableData: [],
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        deptsOptions: {
          props: {
            label: 'deptName',
            value: 'areaCode'
          },
          options: []
        },
        bizTypesOptions: [],
        bizStatesOptions: [],
        condition: {
          workState: '',
          //网格
          dept: "",
          //主体类型
          bizTypes: [],
          //主体状态
          workTypes: [],
          //搜索
          search: "",
          sort: "DESC",
          startDate:"2017-01-01",
          endDate:""
        },
        dictTypeData: {},
        defaultIndex: 0,
        lists: [],
        loading: false,
        afterDate: {
          disabledDate: (time) => {
            let startDate = new Date(this.condition.startDate);
            if (this.condition.startDate) {
              return time.getTime() < startDate - 8.64e7;
            }
          }
        },
        beforeDate: {
          disabledDate: (time) => {
            let endDate = new Date(this.condition.endDate);
            if (this.condition.endDate) {
              return time.getTime() > endDate;
            }
          }
        },
      }
    }
  }
</script>


<style scoped lang="sass">
  .tab-box {
    width: 100%;
    display: flex;
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
    background: #ebf1f5;
  }

  .ipt-btn-box {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
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
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9a9a9a;
    text-align: center;
  }

  .tab-box a {
    color: #9a9a9a;
    width: 100%;
    height: 100%;
    display: inline-block;
  }

  .tab-box a span {
    float: right;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0db5ef;
    z-index: 666;
    position: relative;
  }

  .li-bott a {
    color: #393939;
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
</style>
