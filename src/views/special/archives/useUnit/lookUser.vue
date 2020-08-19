<template>
  <div class="lookpopup">
    <div class="lookDiv">
      <p class="lookTit">
        <span class="ml20">查看人员</span>
        <i class="el-icon-close floatR movePoin"  @click="$emit('lookUserShowHiden')"></i>
      </p>
      <el-input placeholder="主体名称、许可备案号" class="w200 seekIpt mt20 ml20" v-model="subName" @keyup.native="seekEnter">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="seekEnter"></i>
      </el-input>
      <div class="tableDiv">
        <el-table class="mt20 table-div" :data="tableData">
          <el-table-column show-overflow-tooltip prop="date" label="序号" min-width="50"></el-table-column>
          <el-table-column show-overflow-tooltip prop="date" label="姓名" min-width="120"></el-table-column>
          <el-table-column show-overflow-tooltip prop="date" label="账号" min-width="130"></el-table-column>
          <el-table-column show-overflow-tooltip prop="date" label="手机" min-width="80"></el-table-column>
          <el-table-column show-overflow-tooltip prop="date" label="备注" min-width="120"></el-table-column>
        </el-table>
      </div>
      <div class="pagination-box mt20 mr20">
        <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="pageSizeChange"
          @current-change="pagecCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data(){
    return {
      subName: '',
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 50
      },
      tableData: [{
        date: 1
      }, {
          date: 2
        }, {
          date: 3
        }, {
          date: 4
        }, {
          date:5
        }, {
          date: 6
        }]
    }
  },
  mounted() {
    
  },
  methods: {
    seekEnter(){

    },
    //页数改变
    pagecCurrentChange(num) {
      this.page.pageNum = num;
    },
    //每页数量改变
    pageSizeChange(size) {
      this.page.pageSize = size;
    },
  },
}
</script>

<style scoped lang="sass">
  .lookpopup{
    position: fixed;
    background: rgba(0,0,0,.5);
    z-index: 99;
    top: 0;
    bottom:0;
    left:0;
    right:0;
    overflow: auto;
  }
  .lookDiv{
    width: 780px;
    height: 524px;
    position: absolute;
    top: 50%;
    margin-top: -262px;
    left: 50%;
    margin-left: -390px;
    background: #fff;
  }
  .lookTit{
    height: 40px;
    line-height: 40px;
    background: #F2F5F8;
    i{
      font-size: 16px;
      margin-top: 12px;
      margin-right: 7px;
    }
  }
  .tableDiv{
    max-height: 325px;
    overflow: auto;
    padding: 0 20px;
  }
  .pagination-box{
    text-align: right;
  }
</style>