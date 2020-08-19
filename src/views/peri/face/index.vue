<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>人脸库主体管理</span>
    </div>
    <div class="ipt-btn-box" style="justify-content: end;">
      <el-input placeholder="请输入主体名称" class="w250 seekIpt" v-model="search"
                @keyup.enter.native="getEntityGet">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getEntityGet"></i>
      </el-input>
    </div>
    <el-table :data="tableData" class="table-div" v-loading="tabLoad">
      <el-table-column type="index" min-width="50" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="entityName" min-width="90" label="主体名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="entityBusiness" min-width="70" label="经营者"></el-table-column>
      <el-table-column show-overflow-tooltip prop="phone" min-width="100" label="联系方式"></el-table-column>
      <el-table-column show-overflow-tooltip prop="address" min-width="100" label="经营地址"></el-table-column>
      <el-table-column show-overflow-tooltip prop="manageNet" min-width="140" label="分管网格"></el-table-column>
      <el-table-column label="操作" min-width='100'>
        <template slot-scope="scope">
          <a href="javascript:;" @click="goDetail(scope.row)" class="operate-a">人脸库管理</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
                      :current-page="page.pageNum"
                      :page-sizes="[10, 20, 30, 40, 50]" :page-size="page.pageSize"
                      layout="total, sizes, prev, pager, next, jumper" :total="page.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getEntityGet } from "api/peri/camera";

  export default {
    mounted() {
      this.getEntityGet();
    },
    methods: {
      getEntityGet(){
        this.tableData = [];
        this.tabLoad = true;
        getEntityGet().then(r=>{
          this.tabLoad = false;
          if(r.status){
            this.tableData.push(r.data);
            this.page.total = this.tableData.length;
          }
        })
      },
      pageSizeChange() {},
      pagecCurrentChange() {},
      goDetail(row){
        this.$router.push({
          name: 'face_admin',
          query:{
            id: row.entityId
          }
        })
      }
    },
    components: {},
    data() {
      return {
        tabLoad: true,
        search: '',
        tableData: [],
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
      }
    }
  }
</script>

<style scoped lang="sass">
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
</style>