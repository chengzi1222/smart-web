<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>刑事案件</span>
    </div>

    <div class="ipt-btn-box" style="justify-content: end;">
      <el-input placeholder="主体名称" class="w250 seekIpt" v-model="search.entityName" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>

      <el-select clearable class="selectHeight" v-model="search.entityType" placeholder="主体类型（全部）" @change="opSearch">
        <el-option v-for="item in entityTypeList" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>

      <el-cascader class="selectHeight w250" :clearable="true" v-model="search.entityDeptIdList" placeholder="辖区机构(全部)" :change-on-select="true"
        :options="deptList.options" :props="deptList.props" :show-all-levels="false" @change="opSearch">
      </el-cascader>

      <el-button class="selectHeight" type="primary" v-auth="'food.enforce.criminal|func.add'" @click="add">添加刑事案件
      </el-button>

    </div>
    <div class="ipt-btn-box" style="justify-content: end;">
      <el-select style="margin-left:0px;" clearable class="selectHeight" v-model="search.source" placeholder="线索来源（全部）" @change="opSearch">
        <el-option v-for="item in sourceList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>

      <el-cascader class="selectHeight w250" :clearable="true" v-model="search.entryDeptList" placeholder="录入机构（全部）" :options="deptList.options"
        :props="deptList.props" :change-on-select="true" :show-all-levels="false" @change="opSearch">
      </el-cascader>

      <el-select clearable class="selectHeight w250" v-model="search.caseProperty" placeholder="案件性质（全部）" @change="opSearch">
        <el-option v-for="item in casePropertyList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>

      <el-date-picker :clearable="true" class="selectHeight w250" v-model="search.buildCaseTimeList" type="daterange" range-separator="至"
        start-placeholder="开始日期" end-placeholder="结束日期" @change="opSearch" value-format="yyyy-MM-dd">
      </el-date-picker>
    </div>
    <div class="tabOffTop170">
      <el-table :data="tableData" class="table-div" @sort-change="handleSortChange" v-loading="loading">
        <el-table-column type="index" min-width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="120" prop="entityName" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" prop="entityTypeStr" label="主体类型"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" prop="entityDeptName" label="辖区机构"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" prop="entryDeptName" label="录入机构"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" prop="sourceStr" label="线索来源"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" prop="casePropertyStr" label="案件性质"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" prop="judgeContent" label="判决内容"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" prop="buildCaseTime" sortable="custom" label="立案时间"></el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <a href="javascript:;" @click="showDetails(scope.row.id)" class="operate-a">详情</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="page.pageNum"
          :page-sizes="[5,8,10,15,20,25,30]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import * as punish from "api/enforce/punish";
  import * as criminalCase from "api/enforce/criminal_case";

  export default {
    async mounted() {
      this.loading = true;
      var sourceDictCode = "AP_CLUE";
      var casePropertyDictCode = "CC_PROPERTY";

      // 主体类型下拉列表
      punish.listEntityType().then(result => {
        this.entityTypeList = result.data;
      }),

        // 辖区机构 & 执法机构下拉列表
        punish.listDept().then(result => {
          this.deptList.options = result.data;
        }),

        // 线索来源下拉列表
        punish.listDict(sourceDictCode).then(result => {
          this.sourceList = result.data;
        }),

        // 案件性质下拉列表
        punish.listDict(casePropertyDictCode).then(result => {
          this.casePropertyList = result.data;
        })

      this.listCriminalCasePage();
    },
    methods: {

      add() {
        this.$router.push({ name: "enforce.criminalCase.add" });
      },
      showDetails(id) {
        this.$router.push({ name: "enforce.criminalCase.detail", query: { id: id } });
      },
      //下拉查询
      opSearch() {
        this.listCriminalCasePage();
      },
      //页面查询
      async listCriminalCasePage() {
        this.loading = true;
        this.search.pageNum = this.page.pageNum;
        this.search.pageSize = this.page.pageSize;
        let params = this.search;
        criminalCase.listCriminalCasePage(params).then(r => {
          this.loading = false;
          this.page.total = r.data.total
          this.tableData = r.data.list;
        })
      },
      handleIconClick() {
        this.listCriminalCasePage();
      },
      //分页条
      pageCurrentChange(num) {
        this.page.pageNum = num;
        this.listCriminalCasePage();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.listCriminalCasePage();
      },
      // 排序
      handleSortChange({ order }) {
        this.search.sortType = order == 'descending' ? 'DESC' : 'ASC';
        this.listCriminalCasePage();
      },


    },
    components: {
    },
    data() {
      return {

        page: {
          pageSize: 8,
          pageNum: 1,
          total: 0
        },
        search: {
          entityName: "",
          entityType: "",
          entityDeptIdList: [],
          sourceList: "",
          entryDeptList: [],
          type: "",
          buildCaseTimeList: [],
          sortType: "DESC",
          sortColumnName: "build_case_time",
          pageNum: "",
          pageSize: ""
        },
        //下拉列表
        deptList: {
          options: [],
          props: {
            label: 'name',
            value: 'id',
            children: "children"
          }
        },

        entityTypeList: [],
        options: [],
        sourceList: [],
        casePropertyList: [],
        //列表数据
        tableData: [],
        loading: false,
      }
    }
  }
</script>

<style scoped lang="sass">
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
</style>