<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>私有云管理</span>
    </div>

    <div class="ipt-btn-box" style="justify-content: end;">
      <el-input placeholder="请输入私有云名称" class="w250 seekIpt" v-model="condition.search" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>
      <el-button class="selectHeight floatR" type="primary"
                 @click="goAdd"><i style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>添加私有云
      </el-button>

    </div>
    <div class="tabOffTop170">
      <el-table :data="tableData" @sort-change="sortChange" class="table-div" v-loading="loading">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="dhName" min-width="140" label="私有云名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="dhServerIP" min-width="90" label="服务器IP"></el-table-column>
        <el-table-column show-overflow-tooltip prop="dhServerPort" min-width="90" label="服务器端口"></el-table-column>
        <el-table-column show-overflow-tooltip prop="dhUserName" min-width="120" label="账号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="dhUserPwd" min-width="100" label="密码"></el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <a href="javascript:;" @click="goDetail(scope.row.cloudId)" class="operate-a">详情</a>
            <a href="javascript:;" @click="goEdit(scope.row.cloudId)" class="operate-a">编辑</a>
            <a v-if="scope.row.state == 'ALREADY_REVOKE'" href="javascript:;" @click="goDelete(scope.row.cloudId)" class="operate-a">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange" :current-page="page.pageNum"
                       :page-sizes="[10, 20, 30, 40, 50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {findPage} from "api/peri/privatecloud";
  import SelectAreaGrid from 'components/common/SelectAreaGrid';
  import hasAuth from 'utils/checkAuth';

  export default {

    async mounted() {
      this.tabSearch();
    },
    methods: {
      canOperate() {
        return hasAuth('food.peri.camera|func.add');
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

      deptChange(deptId) {
        this.condition.dept = !deptId ? "" : deptId[deptId.length - 1];
        this.tabSearch();
      },
      handleIconClick() { //搜索框按钮点击搜索
        this.a = !this.a;
        this.tabSearch();
      },
      async searchPage() {
        this.loading = true;
        let params = this.condition;
        findPage(params,this.page.pageNum,this.page.pageSize).then((result) => {
          this.loading = false;
          result.data.pageNum = result.data.pageNum == 0 ? 1 : result.data.pageNum;
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
      //添加
      goAdd(){
        this.$router.push({ name: 'camera.privatecloud.add',params: {curd: 'add'}});
      },
      //修改
      goEdit(cloudId) {
        this.$router.push({ name: 'camera.privatecloud.edit', params: {curd: 'edit', cloudId: cloudId } });
      },
      //详情
      goDetail(cloudId) {
        this.$router.push({ name: 'camera.privatecloud.detail', params: {curd: 'detail', cloudId: cloudId } });
      },
      goDelete(cloudId){

      }
    },
    components: { SelectAreaGrid },
    data() {
      return {
        tableData:null,
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        condition: {
          dept: "", //网格
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
