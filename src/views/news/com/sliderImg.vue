<template>
  <div class="user-box">
    <div class="ipt-btn-box">
      <el-input placeholder="标题" class="w250 seekIpt" v-model="search" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>
      <el-button class="selectHeight floatR" type="primary" @click="add"><i style="margin-right: 5px;font-weight: 700;color: #fff;"
          class="el-icon-plus"></i>添加
      </el-button>
    </div>
    <div class="tabOffTop50">
      <el-table :data="tableData" @sort-change="sortChange" class="table-div">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="title" min-width="250" label="标题"></el-table-column>
        <el-table-column show-overflow-tooltip prop="pub_dept_name" min-width="90" label="发布部门"></el-table-column>
        <el-table-column show-overflow-tooltip prop="pub_yes_name" min-width="140" label="发布状态"></el-table-column>
        <el-table-column show-overflow-tooltip prop="local_yes_name" min-width="140" label="链接类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="outside_url" min-width="140" label="链接地址"></el-table-column>
        <el-table-column show-overflow-tooltip prop="update_time" min-width="140" label="更新时间"></el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <a href="javascript:" @click="detail(scope.row)" class="operate-a">查看详情</a>
            <a href="javascript:" @click="edit(scope.row)" v-if="scope.row.edit_yes" class="operate-a">编辑</a>
            <a href="javascript:" @click="del(scope.row)" v-if="scope.row.edit_yes" class="operate-a">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="page.pageNum"
          :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import * as newsApi from 'api/news/news';
  export default {
    mounted() {
      this.listNewsPicSearch();
    },

    methods: {
      listNewsPicSearch(num = 1) {
        let search = {
          title: this.search,
          pageNum: this.page.pageNum || 1,
          pageSize: this.page.pageSize || 10
        };
        newsApi.listNewsPic(search).then((results) => {
          console.log(results.data);
          this.page.total = results.data.total;
          this.tableData = results.data.list;
        });
      },
      add() {
        this.$router.push({ name: "news.sliderAdd" });
      },
      detail(d) {
        this.$router.push({ name: "news.sliderDetail", query: { id: d.id } });
      },
      edit(d) {
        this.$router.push({ name: "news.sliderEdit", query: { id: d.id } });
      },
      // 软删除资讯
      del(d) {
        this.$confirm('是否确认删除该轮播图?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(d.id);
          newsApi.delPic({ ids: ids.toString() }).then((r) => {
            if (r.status) {
              this.$message.success("轮播图删除成功！");
            } else {
              this.$message.error("轮播图删除失败！");
            }
            this.listNewsPicSearch(this.page.pageNum);
          });
        });
      },
      sortChange(column) {
        //根据组件里面的返回的字段设置排序，更新表格
        if (column.order == 'ascending') {
          this.dateSort = 'ASC';
        }
        if (column.order == 'descending') {
          this.dateSort = 'DESC'
        }
      },

      handleIconClick() { //搜索框按钮点击搜索
        this.listNewsPicSearch();
      },
      pageCurrentChange(num) {//改变页数
        this.page.pageNum = num;
        this.listNewsPicSearch();
      },
      pageSizeChange(size) {//改变每一页显示的条数
        this.page.pageSize = size;
        this.listNewsPicSearch();
      },
    },
    components: {

    },
    data() {
      return {
        search: "",
        tableData: [],
        dateSort: "DESC",
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

  table tr td:last-child .cell a {
    border-right: 1px solid #ccc;
    padding-right: 5px;
  }

  table tr td:last-child .cell a:last-child {
    border-right: none;
    padding-right: 0px;
  }
</style>