<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>我的工单</span>
    </div>

    <div class="ipt-btn-box" style="justify-content: end;">
      <el-input placeholder="许可备案号、名称、社会信用代码" class="w250 seekIpt" v-model="condition.search" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>

      <select-area-grid class="selectHeight" placeholder="分管网格" @change="deptChange"></select-area-grid>

      <enum-select v-model="condition.type" enum="com.ybveg.govx.enums.sub.SubWorkTypeEnum" placeholder="业务类型" @change="searchTab"></enum-select>

      <enum-select v-model="condition.state" enum="com.ybveg.govx.enums.WorkStateEnum" placeholder="工单状态" @change="searchTab"></enum-select>
    </div>
    <div class="tabOffTop50">
      <el-table :data="tableData"  :border="true" :resizable="true"  @sort-change="sortChange" class="table-div">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="workNo" min-width="100" label="工单号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="90" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backupNo" min-width="90" label="许可备案号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="creditCode" min-width="90" label="社会信用代码"></el-table-column>
        <el-table-column show-overflow-tooltip prop="gridName" min-width="100" label="分管网格"></el-table-column>
        <el-table-column show-overflow-tooltip prop="updateTime" min-width="110" label="更新时间" sortable='custom'></el-table-column>
        <el-table-column show-overflow-tooltip prop="typeStr" min-width="70" label="业务类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="stateStr" min-width="70" label="工单状态"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a href="javascript:;" @click="review(scope.row,false)" class="operate-a">详情</a>
            <a href="javascript:;" v-if="scope.row.state === 'PEND_REVIEW' " @click="revoke(scope.row.id)" class="operate-a">撤销</a>
            <a href="javascript:;" v-if="scope.row.state !== 'ALREADY_FILE' && scope.row.state === 'ALREADY_REVOKE' " @click="deleteByWorkId(scope.row.id)" class="operate-a">删除</a>
            <a href="javascript:;" v-if="scope.row.state === 'ALREADY_REVOKE' || scope.row.state === 'ALREADY_REJECT'"
               @click="$router.push({name: 'medi.workflow.rework', query: {entityType: scope.row.entityType, entityTypeExt: scope.row.entityTypeExt, ext: 'REWORK', entityId: scope.row.entityId,workId:scope.row.id}})" class="operate-a">重新申请</a>
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
  import {mywork,deleteWorkFlow,revoke} from "api/medi/workflow/workflow";
  import EnumSelect from 'components/common/EnumSelect';
  import SelectAreaGrid from 'components/common/SelectAreaGrid';

  export default {
    mounted() {
      this.tabSearch();
    },
    methods: {
      tabChange(state) {   //点击导航切换样式
        Object.assign(this.$data.condition, this.$options.data().condition)   //切换tab 重置condition
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
        if(record.type == "FIRST"){
          name = "medi.workflow.workflow_auditInfo";
        }else{
          name = "medi.workflow.workflow_workInfo";
        }
        this.$router.push({
          name: name,
          query: {
            id: record.id,
            review: isReivew,
            type_ext:record.entityTypeExt.toLowerCase()
          }
        })
      },
      //删除
      deleteByWorkId(workId){
        this.$confirm("确认要删除当前工单吗", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteWorkFlow(workId).then(d=>{
            this.tabSearch();
            this.$message({
              message: "删除成功",
              type: 'success'
            });
          });
        })
      },
      revoke(workId){
        this.$confirm("确认要撤销当前工单吗", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          revoke(workId).then(d=>{
            this.tabSearch();
            this.$message({
              message: "撤销成功",
              type: 'success'
            });
          });
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
        const formData = {
          params: params,
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
        };
        mywork(formData).then((result) => {
          if(result){
            result.data.pageNum = result.data.pageNum == 0 ? 1 : result.data.pageNum;
            this.page.total = result.data.total;
            this.tableData = result.data.list;
          }
        });
      },
      searchTab(){
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
      tabSearch() {
        this.page.pageNum = 1;
        this.searchPage();
      },

    },
    components: {EnumSelect,SelectAreaGrid },
    data() {
      return {
        tableData: [],
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        condition: {
          state: "",
          workType: [], //主体类型
          search: "",   //搜索
          sort: "DESC"
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
