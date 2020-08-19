<!-- 草稿箱 -->
<template>
  <div class="tabOffTop120">
    <el-table :data="backups" style="width: 100%;margin:20px 0">
      <el-table-column type="index" label="序号" width="120"></el-table-column>
      <el-table-column label="主体名称" prop="entityName" width="150" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="证照类型" prop="natureTypeStr" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="负责人" prop="corpName" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="统一社会信用代码" prop="creditCode" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="更新时间" prop="createData" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span @click="editClick(scope.$index)">编辑</span>
          <span @click="removeBackup(scope.row.backupId)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box" style="text-align:right">
      <el-pagination background :page-sizes="[5,8,10,15,20,25,30]" :page-size="page.pageSize" :current-page="page.pageNum" :total="page.total"
        layout="total, sizes, prev, pager, next, jumper" @current-change="pagecCurrentChange" @size-change="pageSizeChange"></el-pagination>
    </div>
  </div>
</template>


<script>

  import { getBackupPage, removeBackup } from "api/sub/add.js";
  export default {
    props: {
      entityType: {
        type: String,
        default: function () {
          return ''
        }
      }
    },
    mounted() {
      this.tableSearch();
    },
    methods: {
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.tableSearch(num);
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.tableSearch();
      },

      tableSearch(num = 1) {
        getBackupPage(this.entityType, num, this.page.pageSize).then((r) => {
          this.backups = r.data.list;
          this.page.total = r.data.total;

        })
      },

      removeBackup(bid) {
        removeBackup(bid).then((r) => {
          this.$message({
            message: '刪除草稿成功!',
            type: 'success'
          });
          this.tableSearch();
          this.$emit('changeTable')
        });

      },
      editClick(index) {
        this.$emit("edit", this.backups[index])
      }

    },
    data() {
      return {
        page: {
          pageSize: 8,
          pageNum: 1,
          total: 0
        },
        backups: [],
      }
    }
  }
</script>


<style scoped lang="scss">
  /* 切换页面下面的内容 */

  .main-body {
    margin-top: 20px;
    margin-bottom: 430px;
    padding-left: 230px;
    position: relative;
    .router-btn {
      margin: 0 5px;
    }
  }

  .active {
    .el-button {
      background: #0db5ef;
      color: #fff;
    }
  }
</style>