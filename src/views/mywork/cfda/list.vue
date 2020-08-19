<template>
  <div class="user-box">
    <div class="ipt-btn-box" style="justify-content: end;">
      <el-input placeholder="备案号、名称、社会信用代码" class="w250 seekIpt" v-model="condition.search" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>

      <enum-select class="selectHeight" v-model="condition.bizTypes" multiple collapse-tags placeholder="主体类型" @change="searchTab" enum="com.ybveg.govx.enums.cfda.CfdaTypeEnum">
      </enum-select>

      <enum-select class="selectHeight" v-model="condition.workTypes" multiple collapse-tags placeholder="业务类型" @change="searchTab" enum="com.ybveg.govx.enums.cfda.CfdaWorkTypeEnum">
      </enum-select>

      <enum-select class="selectHeight" v-model="condition.workStates" multiple collapse-tags placeholder="工单状态" @change="searchTab" enum="com.ybveg.govx.enums.WorkStateEnum">
      </enum-select>

    </div>
    <div class="tabOffTop50">
      <el-table :data="tableData"  :border="true" :resizable="true"  @sort-change="sortChange" class="table-div" v-loading="loading">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="workNo" min-width="100" label="工单号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="90" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backupNo" min-width="120" label="备案号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="creditCode" min-width="120" label="社会信用代码"></el-table-column>
        <el-table-column show-overflow-tooltip prop="typeStr" min-width="100" label="三小性质"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" min-width="140" label="分管网格"></el-table-column>
        <el-table-column show-overflow-tooltip prop="updateTime" min-width="110" label="更新时间" sortable='custom'></el-table-column>
        <el-table-column show-overflow-tooltip prop="workTypeStr" min-width="70" label="业务类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="workStateStr" min-width="70" label="工单状态"></el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <a v-if="scope.row.workType != 'EDIT'" href="javascript:;" @click="viewClick(scope.row)" class="operate-a">详情</a>
            <a v-if="scope.row.workType == 'EDIT'" href="javascript:;" @click="viewClickEdit(scope.row)" class="operate-a">详情</a>
            <a v-if="(scope.row.workState == 'ALREADY_REJECT' || scope.row.workState == 'ALREADY_REVOKE')
                     && (scope.row.bizState == 'ALREADY_FILE' || scope.row.bizState == 'FIRST') &&
                      scope.row.workType != 'CANCEL'&& scope.row.workType != 'EDIT'" href="javascript:;" @click="reapply(scope.row)" class="operate-a">重新申请</a>
            <a v-if="(scope.row.workState == 'ALREADY_REJECT' || scope.row.workState == 'ALREADY_REVOKE')
                     && (scope.row.bizState == 'ALREADY_FILE' || scope.row.bizState == 'FIRST') &&
                      scope.row.workType == 'EDIT'" href="javascript:;" @click="reapplyEdit(scope.row)" class="operate-a">重新申请</a>
            <a v-if="scope.row.workState == 'PEND_REVIEW'" href="javascript:;" @click="workRevoke(scope.row)" class="operate-a">撤销</a>
            <a v-if="scope.row.workState == 'ALREADY_REVOKE'" href="javascript:;" @click="workDel(scope.row)" class="operate-a">删除</a>
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
import EnumSelect from 'components/common/EnumSelect';
import { pageByUser, revoke, del } from "api/cfda/bizWorkflow";
import { INFO_TYPE } from "views/cfda/workflow/workUtil";

export default {
  mounted() {
    this.searchTab();
  },
  methods: {
    sortChange(column) {
      if (column.order == 'ascending') {
        this.condition.sort = 'ASC';
      }
      if (column.order == 'descending') {
        this.condition.sort = 'DESC'
      }
      this.searchTab();
    },
    //重新申请
    reapply(row) {
      this.$router.push({
        name: 'mywork.cfda.workflow',
        query: {
          workId: row.id,
          type: row.workType.toLocaleLowerCase(),
          back: 'mywork.cfda'
        },
        params: {

        }
      });
    },

    //重新申请
    reapplyEdit(row) {
      this.$router.push({
        name: 'cfda.archives.change',
        query: {
          cfdaId: row.entityId,
          type: INFO_TYPE.edit,
          back: 'cfda.archives'
        }
      });
    },

    viewClick(row) {
      this.$router.push({
        name: 'mywork.cfda.detail',
        query: {
          id: row.id,
          back: 'mywork.cfda'
        }
      });
    },

    viewClickEdit(row) {
      this.$router.push({
        name: 'cfda.archives.edit',
        query: {
          id: row.id,
          type: row.workType,
          entryType: 'cfda',
          entityName: row.entityName,
        }
      });
    },

    workDel(row) {
      const $this = this;
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(row.id).then((result) => {
          this.$message({
            message: '删除成功!',
            type: 'success'
          });
          this.searchTab();
        });
      });

    },
    workRevoke(row) {
      revoke(row.id).then((result) => {
        this.$message({
          message: '撤销成功!',
          type: 'success'
        });
        this.searchTab();
      });
    },
    handleIconClick() { //搜索框按钮点击搜索
      this.a = !this.a;
      this.searchTab();
    },
    async searchPage() {
      var formData = {
        params: this.condition,
        num: this.page.pageNum,
        size: this.page.pageSize
      };
      this.loading=true;
      pageByUser(formData).then((result) => {
        this.loading=false;
        this.page.total = result.data.total;
        this.tableData = result.data.list;
      });
    },
    searchTab() {
      this.page.pageNum = 1;
      this.searchPage();
    },
    pagecCurrentChange(num) {
      this.page.pageNum = num;
      this.searchPage();
    },
    pageSizeChange(size) {
      this.page.pageSize = size;
      this.searchPage();
    },
  },
  components: {
    EnumSelect,
  },
  data() {
    return {
      tableData: [],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      condition: {
        //主体状态
        workStates: [],
        //主体类型
        bizTypes: [],
        //工单类型
        workTypes: [],
        //搜索
        search: "",
        sort: "DESC"
      },
      dictTypeData: {},
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
