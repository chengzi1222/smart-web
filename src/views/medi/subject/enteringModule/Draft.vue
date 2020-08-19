<template>
  <div>
    <el-table :data="data" class="table-div" ref="table" max-height="340">
      <el-table-column show-overflow-tooltip type="index" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="entityName" label="主体名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="registerAddr" label="经营场所地址"></el-table-column>
      <el-table-column show-overflow-tooltip prop="corpName" label="负责人"></el-table-column>
      <el-table-column show-overflow-tooltip prop="createTime" label="更新时间"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作">
        <template slot-scope="scope">
          <a href="javascript:;" @click="edit(scope.row.backupId, 'edit')">编辑</a>
          <a href="javascript:;" @click="removeBack(scope.row.backupId)">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <yuanben-page :page="page" @size-change="pageSizeChange" @current-change="pageCurrentChange" style="margin-top:10px;">
    </yuanben-page>
  </div>
</template>

<script>
  import YuanbenPage from 'components/common/YuanbenPage'
  import { getBackups, removeBack } from 'api/medi/subject/manageEntity'
  export default {
    props: {
      entityType: {
        type: String
      }
    },
    mounted() {
      this.pageSearch()
    },
    methods: {
      pageCurrentChange(num) {
        if (num !== this.page.pageNum) {
          this.page.pageNum = num;
          this.pageSearch()
        }
      },
      pageSizeChange(size) {
        if (size !== this.page.pageSize) {
          this.page.pageSize = size;
          this.pageSearch()
        }
      },
      pageSearch () {
        this.$emit("dataChange")
        getBackups (this.page, 'MEDICINE', this.entityType).then(r => {
          this.data = r.data.list
          this.page.total = r.data.total
        })
      },
      removeBack (backupId) {
        removeBack(backupId).then(r => {
          this.pageSearch()
          this.$message({
            message: '删除草稿箱成功！',
            type: 'success'
          })
        })
      },
      edit (backupId, type) {
        this.$emit("getBackupId", backupId, type)
      }
    },
    data() {
      return {
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        data:[]
      }
    },
    components: {
      YuanbenPage
    }
  }
</script>

<style scoped lang="sass">
</style>
