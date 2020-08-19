<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>编辑审核</span>
    </div>
    <ul class="tab-box">
      <li v-for="item in lists" @click="tabChange(item.state)" :key="item.state" :class="workState == item.state? 'li-bott':''">
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
      <enum-select class="selectHeight" v-model="condition.natureType" placeholder="请选择证照类型" enum="com.ybveg.govx.enums.sub.NatureTypeEnum" @change="tabSearch"></enum-select>

      <el-select clearable class="selectHeight" v-model="condition.subType" placeholder="经营类型" @change="tabSearch">
        <el-option v-for="item in subTypeList" :key="item.code" :label="item.name" :value="item.code">
        </el-option>
      </el-select>

      <select-area-grid class="selectHeight" placeholder="分管网格" @change="deptChange"></select-area-grid>

      <enum-select class="selectHeight" v-model="condition.workType" placeholder="业务类型" enum="com.ybveg.govx.enums.sub.SubWorkTypeEnum" @change="tabSearch"></enum-select>

    </div>
    <div class="tabOffTop50">
      <el-table :data="tableData"  :border="true" :resizable="true"  @sort-change="sortChange" class="table-div" v-show="workState != 'ALREADY_REJECT'" v-loading="loading">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="workNo" min-width="100" label="工单号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="90" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="licence" min-width="90" label="许可备案号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="creditCode" min-width="90" label="社会信用代码"></el-table-column>
        <el-table-column show-overflow-tooltip prop="natureTypeLabel" min-width="120" label="证照类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="subTypeLabel" min-width="100" label="经营类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" min-width="140" label="分管网格"></el-table-column>
        <el-table-column show-overflow-tooltip prop="updateTime" min-width="110" label="更新时间" sortable='custom'></el-table-column>
        <el-table-column show-overflow-tooltip prop="workTypeLabel" min-width="70" label="业务类型"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a href="javascript:;" v-if="scope.row.state == 'PEND_REVIEW'" @click="review(scope.row,true)" v-auth="'food.biz.pb|func.review,food.biz.cb|func.review,food.biz.rb|func.review'" class="operate-a">审核</a>
            <a href="javascript:;" v-if="scope.row.state != 'PEND_REVIEW'" @click="review(scope.row,false)" class="operate-a">详情</a>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="tableData" @sort-change="sortChange"  :border="true" :resizable="true"  class="table-div" v-show="workState == 'ALREADY_REJECT'">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="workNo" min-width="100" label="工单号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="90" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="licence" min-width="90" label="许可备案号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="creditCode" min-width="90" label="社会信用代码"></el-table-column>
        <el-table-column show-overflow-tooltip prop="natureTypeLabel" min-width="120" label="证照类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="subTypeLabel" min-width="100" label="经营类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" min-width="140" label="分管网格"></el-table-column>
        <el-table-column show-overflow-tooltip prop="updateTime" min-width="110" label="驳回时间" sortable='custom'></el-table-column>
        <el-table-column show-overflow-tooltip prop="workTypeLabel" min-width="70" label="业务类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backReason" min-width="70" label="驳回原因"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a href="javascript:;" v-if="scope.row.state != 'PEND_REVIEW'" @click="review(scope.row,false)" class="operate-a">详情</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange" :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { pageWork, countWork } from "api/sub/work";
import * as common from 'api/common';
import subject from '../common/utils/Contants';
import SelectAreaGrid from 'components/common/SelectAreaGrid';
import EnumSelect from 'components/common/EnumSelect';

export default {
  mounted() {
    this.loading=true;
    //获得主体类型
    this.entityType = this.$route.params.type;
    this.contants = subject[this.entityType];

    countWork(this.entityType).then((results) => {
      const data = results.data;
      this.lists =
        [{ tabName: '待审核', state: 'PEND_REVIEW', num: data.PEND_REVIEW },
        { tabName: '已归档', state: 'ALREADY_FILE', num: data.ALREADY_FILE },
        { tabName: '已驳回', state: 'ALREADY_REJECT', num: data.ALREADY_REJECT }]
    });
    this.tabSearch();

    common.getDicts([this.contants.subType]).then((result) => {
      this.subTypeList = result.data[0].list || [];
    });
  },
  methods: {
    tabChange(state) {   //点击导航切换样式
      this.workState = state;
      Object.assign(this.$data.condition, this.$options.data().condition)   //切换tab 重置condition
      this.condition.workState = state;
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
    review(record, isReivew) {
      this.$router.push({
        name: "subject.workinfo.detail",
        params: {
          type: this.entityType
        },
        query: {
          id: record.id,
          type: record.type,
          review: isReivew
        }
      })
    },
    deptChange(deptId) {
      this.condition.dept = !deptId ? "" : deptId[deptId.length - 1];
      this.tabSearch();
    },
    handleIconClick() { //搜索框按钮点击搜索
      this.a = !this.a;
      this.tabSearch();
    },
    searchPage() {
      const params = this.condition;
      const formData = {
        entityType: this.entityType,
        params: params,
        num: this.page.pageNum,
        size: this.page.pageSize,
      };
      this.loading=true;
      pageWork(formData).then((result) => {
        this.loading=false;
        this.page.total = result.data.total;
        this.tableData = result.data.list;
      });
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
      workState: 'PEND_REVIEW',
      tableData: [],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      subTypeList: [],
      condition: {
        workState: 'PEND_REVIEW',
        dept: "", //网格
        natureType: "", //主体类型
        subType: "",  //经营类型
        workType: "",  //主体状态
        search: "",   //搜索
        sort: "DESC"
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
  padding: 0;
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
     
