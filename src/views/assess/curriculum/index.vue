<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>课程管理</span>
    </div>

    <div class="user-box">
      <div class="mt20 mb20 clear_a">
        <el-input placeholder="课程名称" class="w250 seekIpt" v-model="queryLimit.keyword"
          @keyup.enter.native="changeSearch">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch"></i>
        </el-input>
        <el-select class="selectHeight" v-model="queryLimit.entityType" multiple :clearable="true" collapse-tags
          placeholder="行业类型" @change="changeSearch">
          <el-option v-for="item in entityType" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
        <el-button class="selectHeight floatR mr20" type="primary" @click="add"><i
            style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>添加
        </el-button>
      </div>
      <div class="tabOffTop120">
        <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
          :data="tableData" class="table-div">
          <el-table-column show-overflow-tooltip prop="name" min-width="120" label="课程名称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="description" min-width="200" label="课程描述"></el-table-column>
          <el-table-column show-overflow-tooltip prop="period" min-width="80" label="学时"></el-table-column>
          <el-table-column show-overflow-tooltip prop="entityType" min-width="80" label="行业类型"></el-table-column>
          <el-table-column show-overflow-tooltip prop="remark" min-width="200" label="备注"></el-table-column>
          <el-table-column show-overflow-tooltip prop="updateTime" min-width="80" label="更新日期"></el-table-column>
          <el-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <a href="javascript:;" class="operate-a"
                @click="$router.push({name: 'assess.curriculumAdd',query:{id:scope.row.id}});">编辑</a>
              <a href="javascript:;" class="operate-a"
                @click="$router.push({name: 'assess.curriculumDetail',query:{id:scope.row.id}});">详情</a>
              <a href="javascript:;" class="operate-a" v-if='!scope.row.correlation' @click="del(scope.row)">删除</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
            :current-page="queryLimit.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="queryLimit.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import * as api from "api/assess/index";
  import {
    getPublic,
    getEntityType,
    getYear
  } from "../com.js";
  export default {
    data() {
      return {
        total: 0,
        loading: false,
        tableData: [],
        queryLimit: {
          pageNum: 1,
          entityType: [],
          keyword: "",
          pageSize: 10
        },
        entityType: []
      };
    },
    async mounted() {
      this.searchPage();
      this.entityType = await getEntityType()
    },
    methods: {
      del(row) {
        this.$confirm('是否确认删除改课程？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          api.courseDel(row.id).then(r => {
            if (r.status) {
              this.$message.success("删除成功")
              this.changeSearch()
            }
          })
        })
      },
      add() {
        this.$router.push({
          name: "assess.curriculumAdd"
        });
      },
      searchPage() {
        this.loading = true;
        api.courseList(this.queryLimit).then(result => {
          if (result.status) {
            this.tableData = result.data.list;
            this.total = result.data.total;
          } else {
            this.$message.warning("列表数据获取失败！请稍候重试");
          }
          this.loading = false;
        });
      },
      changeSearch() {
        this.queryLimit.pageNum = 1;
        this.searchPage();
      },
      pagecCurrentChange(num) {
        this.queryLimit.pageNum = num;
        this.searchPage();
      },
      pageSizeChange(size) {
        this.queryLimit.pageSize = size;
        this.changeSearch();
      },
    },
  };
</script>
<style scoped lang="scss">
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

  .yesTooltip {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFangSC;
    font-weight: 400;
    color: rgba(50, 194, 94, 1);
    line-height: 21px;
    text-align: center;
    width: 44px;
    height: 21px;
    background: rgba(236, 249, 240, 1);
    border-radius: 4px;
    border: 1px solid rgba(185, 231, 199, 1);
    display: inline-block;
  }

  .noTooltip {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFangSC;
    font-weight: 400;
    color: #a2aab6;
    line-height: 21px;
    text-align: center;
    width: 44px;
    height: 21px;
    background: rgba(242, 246, 250, 1);
    border-radius: 4px;
    border: 1px solid rgba(205, 216, 227, 1);
    display: inline-block;
  }
</style>