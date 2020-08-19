<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>编辑审核</span>
    </div>
    <ul class="tab-box">
      <li v-for="item in lists" @click="tabChange(item.state)" :key="item.state" :class="condition.state == item.state? 'li-bott':''">
        <div>{{item.tabName}}
          <span>
            <span v-if="item.num" style="margin-left:20px;">{{item.num}}</span>
          </span>
        </div>
      </li>
      <li class="tab-bott"></li>
    </ul>

    <div class="ipt-btn-box" style="justify-content: end;">
      <el-input placeholder="社会信用代码、许可备案号、名称、工单号" class="w250 seekIpt" v-model="condition.search" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>

      <select-area-grid class="selectHeight" placeholder="分管网格" @change="deptChange"></select-area-grid>

      <enum-select class="selectHeight" v-model="condition.type" placeholder="业务类型" enum="com.ybveg.govx.enums.sub.SubWorkTypeEnum"
        @change="tabSearch"></enum-select>

    </div>
    <div class="tabOffTop50">
      <el-table :data="tableData" @sort-change="sortChange" class="table-div" v-show="condition.state != 'ALREADY_REJECT'" v-loading="loading">
        <el-table-column type="index" min-width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="workNo" min-width="100" label="工单号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="90" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backupNo" min-width="90" label="许可备案号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="creditCode" min-width="90" label="社会信用代码"></el-table-column>
        <el-table-column show-overflow-tooltip prop="gridName" min-width="140" label="分管网格"></el-table-column>h
        <el-table-column show-overflow-tooltip prop="updateTime" min-width="110" label="更新时间" sortable='custom'></el-table-column>
        <el-table-column show-overflow-tooltip prop="typeStr" min-width="70" label="业务类型"></el-table-column>
        <el-table-column label="操作" min-width="80">
          <template slot-scope="scope">
            <a href="javascript:;" v-if="scope.row.state == 'PEND_REVIEW'" @click="review(scope.row,true)" class="operate-a" v-auth="'biz.cosmetic.wf|func.edit'">审核</a>
            <a href="javascript:;" v-if="scope.row.state != 'PEND_REVIEW'" @click="review(scope.row,false)" class="operate-a">详情</a>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="tableData" @sort-change="sortChange" class="table-div" v-show="condition.state == 'ALREADY_REJECT'" v-loading="loading">
        <el-table-column type="index" min-width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="workNo" min-width="100" label="工单号1"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="90" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backupNo" min-width="90" label="许可备案号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="creditCode" min-width="90" label="社会信用代码"></el-table-column>
        <el-table-column show-overflow-tooltip prop="gridName" min-width="100" label="分管网格"></el-table-column>
        <el-table-column show-overflow-tooltip prop="updateTime" min-width="110" label="驳回时间" sortable='custom'></el-table-column>
        <el-table-column show-overflow-tooltip prop="typeStr" min-width="70" label="业务类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backReason" min-width="70" label="驳回原因"></el-table-column>
        <el-table-column label="操作"  min-width="80">
          <template slot-scope="scope">
            <a href="javascript:;" v-if="scope.row.state != 'PEND_REVIEW'" @click="review(scope.row,false)" class="operate-a">详情</a>
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
</template>

<script>
  import { findPage, getTotal } from "api/medi/workflow/workflow";
  import SelectAreaGrid from 'components/common/SelectAreaGrid';
  import EnumSelect from 'components/common/EnumSelect';

  import * as plan from 'api/cosmetics/workflow'

  export default {
    mounted() {
      this.lists =
        [{ tabName: '待审核', state: 'PEND_REVIEW', num: 0 },
        { tabName: '已归档', state: 'ALREADY_FILE', num: 0 },
        { tabName: '已驳回', state: 'ALREADY_REJECT', num: 0 }]
      this.tabSearch();
    },
    methods: {
      tabChange(state) {   //点击导航切换样式
        //        Object.assign(this.$data.condition, this.$options.data().condition)  //切换tab 重置condition
        this.condition.state = state;
        this.tabSearch();
      },
      sortChange(column) {
        if (column.order == 'ascending') {
          this.condition.sort = 'ASC';
        }
        if (column.order == 'descending') {
          this.condition.sort = 'DESC'
        }
        this.tabSearch();
      },
      //跳转审核或详情
      review(record, isReivew) {
        let name = "";
        // debugger
        // if (record.type == "FIRST") {
          if (this.$route.name == 'production.editors') {
            name = "production.compile";
          } else if (this.$route.name == 'manage.editors') {
            name = "manage.compile";
          } else if (this.$route.name == 'use.editors') {
            name = "use.compile";
          }
        // } else {
        //   name = "";
        // }
        let _entityType = this.$route.name == 'production.editors'?'production':'else'
        this.$router.push({
          name: name,
          query: {
            id: record.id,
            review: isReivew,
            type: record.type,
            entityName: record.entityName,
            entityType: _entityType,
            type_ext: this.condition.type_ext.toLowerCase()
          }
        })
      },
      deptChange(deptId) {
        this.condition.dept = !deptId ? "" : deptId[deptId.length - 1];
        this.tabSearch();
      },
      handleIconClick() { //搜索框按钮点击搜索
        this.tabSearch();
      },
      searchPage() {
        const params = this.condition;
        let _entityType = this.$route.name == 'production.editors' ? 'COSMETIC_PRODUCT' : this.$route.name == 'manage.editors' ? 'COSMETIC_MANAGER' : 'COSMETIC_EMPLOY';
        const formData = {
          search: this.condition.search,
          type: this.condition.type,
          state: this.condition.state,
          sort: this.condition.sort,
          dept: this.condition.dept,
          entityType: _entityType
        };
        this.loading=true;
        plan.postWorkPage(this.page.pageNum, this.page.pageSize, formData).then((result) => {
          this.loading=false;
          if (result) {
            result.data.pageNum = result.data.pageNum == 0 ? 1 : result.data.pageNum;
            this.page.total = result.data.total;
            this.tableData = result.data.list;
          }
        });
        let __entityType = 'COSMETIC_PRODUCT';
        plan.getTotal({ "entityType": __entityType }).then((result) => {
          let data = result.data;
          this.lists[0].num = data.review ? data.review : 0;
          this.lists[1].num = data.file ? data.file : 0;
          this.lists[2].num = data.reject ? data.reject : 0;
        })
      },
      pagecCurrentChange(num) {
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

    },
    components: { SelectAreaGrid, EnumSelect },
    data() {
      return {
        contants: {},
        lists: [],
        tableData: [],
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        condition: {
          state: 'PEND_REVIEW',
          dept: "", //网格
          type: "", //主体类型
          search: "",   //搜索
          sort: "DESC",
          type_ext: 'PEND_REVIEW'
        },
        loading: false,
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
</style>
