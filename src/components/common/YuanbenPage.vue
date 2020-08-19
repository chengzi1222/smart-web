<template>
  <div class="pagination-box">
    <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    page: Object,
  },
  methods: {
    pagecCurrentChange(currentPage) {
      if (this.page.pageNum !== currentPage) {
        this.$emit("current-change", currentPage)
      }
    },
    pageSizeChange(size) {
      if (this.page.pageSize !== size) {
        // this.currentTab = this.tab;
        this.$emit("size-change", size)
      }
    }
  },
}
</script>

<style scoped lang="sass">
.pagination-box {
  text-align: right;
  margin-top: 20px;
}
</style>
