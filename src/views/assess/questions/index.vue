<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>题库管理</span>
    </div>
    <div class="user-box">
      <div class="mt20 mb20 clear_a">
        <el-input placeholder="题库名称" class="w250 seekIpt" v-model="queryLimit.keyword"
          @keyup.enter.native="changeSearch">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch"></i>
        </el-input>
        <el-select class="selectHeight" v-model="queryLimit.available" :clearable="true" placeholder="状态"
          @change="changeSearch">
          <el-option v-for="(item,key) in questionsStatus" :key="key" :label="item" :value="key">
          </el-option>
        </el-select>
        <el-select class="selectHeight" collapse-tags multiple v-model="entityType_" :clearable="true"
          placeholder="行业类型" @change="changeSearch">
          <el-option v-for="item in entityType" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
        <el-button class="selectHeight floatR mr20" type="primary" @click="add('add',null)"><i
            style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>添加
        </el-button>
        <el-button class="floatR" type="primary" @click="available(selection,1)">启用</el-button>
        <el-button class="floatR" type="primary" @click="available(selection,0)">禁用</el-button>
      </div>
      <div class="tabOffTop120">
        <el-table v-loading="loading" @selection-change="handleSelectionChange" element-loading-text="数据正在努力加载中"
          :border="true" :resizable="true" :data="tableData" class="table-div">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="name" min-width="120" label="题库名称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="description" min-width="200" label="题库描述"></el-table-column>
          <el-table-column show-overflow-tooltip prop="entityTypeStr" min-width="120" label="行业类型"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" label="状态">
            <template slot-scope="scope">
              <span class="yesTooltip" v-if="scope.row.available">启用</span>
              <span class="noTooltip" v-else>禁用</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="createTime" min-width="80" label="创建日期"></el-table-column>
          <el-table-column show-overflow-tooltip prop="updateTime" min-width="80" label="更新日期"></el-table-column>
          <el-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <a href="javascript:;" class="operate-a" @click="add('edit',scope.row)">配置</a>
              <a href="javascript:;" class="operate-a"
                @click="$router.push({name: 'assess.questionsDetail',query:{id:scope.row.id}});">详情</a>
              <a href="javascript:;" class="operate-a"
                @click='available([scope.row.id],scope.row.available?0:1)'>{{scope.row.available?'禁用':'启用'}}</a>
              <a href="javascript:;" class="operate-a" v-if='!scope.row.correlation' @click="del(scope.row)">删除</a>
              <a href="javascript:;" class="operate-a" @click="exportList(scope.row.id)">导出</a>
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
        tableData: [{
          buyerName: "888"
        }],
        queryLimit: {
          pageNum: 1,
          available: "",
          entityType: "",
          keyword: "",
          pageSize: 10
        },
        entityType_: [],
        questionsStatus: getPublic().questionsStatus,
        entityType: [],
        selection: []
      };
    },
    async mounted() {
      this.searchPage();
      this.entityType = await getEntityType()
    },
    methods: {
      handleSelectionChange(val) {
        this.selection = val.map(obj => obj.id)
      },
      del(row) {
        this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          const data = new FormData()
          data.append('id', row.id)
          api.depotDel(data).then(r => {
            if (r.status) {
              this.$message.success("删除成功")
              this.changeSearch()
            }
          })
        })
      },
      add(t, row) {
        this.$router.push({
          name: "assess.questionAdd",
          query: {
            type: t,
            id: row ? row.id : ''
          }
        });
      },
      searchPage() {
        this.loading = true;
        this.queryLimit.entityType = this.entityType_.toString()
        api.questionDepotList(this.queryLimit).then(result => {
          if (result.status) {
            this.tableData = result.data.list;
            this.total = result.data.total;
          } else {
            this.$message.warning("列表数据获取失败！请稍候重试");
          }
          this.loading = false;
        });
      },
      available(list, status) {
        if (list.length <= 0) {
          this.$message.error('请至少选择一个')
          return
        }
        let str = status ? '启用' : '禁用'
        this.$confirm("是否确定" + str + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.questionDepotOpt({
            available: status,
            idList: list
          }).then(r => {
            if (r.status) {
              this.$message.success(str + "成功")
              this.changeSearch()
            }
          })
        })
      },
      exportList(id) {
        location.href = `/api/pxkh/question/depot/export?questionDepotId=` + id;
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
      }
    }
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