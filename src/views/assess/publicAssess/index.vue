<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>公开考核计划</span>
    </div>

    <div class="user-box">
      <div class="mt20 mb20 clear_a">
        <el-input placeholder="考核计划名称" class="w250 mr20 seekIpt" v-model="queryLimit.keyword"
          @keyup.enter.native="changeSearch">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch"></i>
        </el-input>
         <el-select v-model="queryLimit.hasProcessedEw" :clearable="true" placeholder="考核类型"
          @change="changeSearch">
          <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
        <el-date-picker class="w200" :picker-options="pickerOptions" v-model="queryLimit.month" type="month"
          format="yyyy-MM" value-format="yyyy-MM" :editable="false" :clearable="true" placeholder="考核年度">
        </el-date-picker>
        <el-select class="selectHeight" v-model="queryLimit.hasProcessedEw" :clearable="true" placeholder="考核季度"
          @change="changeSearch">
          <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
        <el-select class="selectHeight" v-model="queryLimit.hasProcessedEw" :clearable="true" placeholder="考核状态"
          @change="changeSearch">
          <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>

        <el-button class="floatR mr20" type="primary" @click="add"><i
            style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>添加
        </el-button>
        <el-button class="floatR mr20" @click="add">
          导出
        </el-button>
      </div>
      <div class="tabOffTop120">
        <el-table v-loading="loading" @selection-change="handleSelectionChange" element-loading-text="数据正在努力加载中"
          :border="true" :resizable="true" :data="tableData" class="table-div">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="buyerName" min-width="120" label="考核计划名称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="legalPerson" min-width="200" label="考核题库"></el-table-column>
          <el-table-column show-overflow-tooltip prop="tel" min-width="120" label="考核类型"></el-table-column>
          <el-table-column show-overflow-tooltip prop="streetAreaName" min-width="80" label="考核季度"></el-table-column>
          <el-table-column show-overflow-tooltip prop="streetAreaName" min-width="80" label="考核状态"></el-table-column>
          <el-table-column show-overflow-tooltip prop="streetAreaName" min-width="80" label="考核时长"></el-table-column>
          <el-table-column show-overflow-tooltip prop="streetAreaName" min-width="80" label="启动日期"></el-table-column>
          <el-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <a href="javascript:;" class="operate-a">完成</a>
              <a href="javascript:;" class="operate-a">编辑</a>
              <a href="javascript:;" class="operate-a" @click="$router.push({name: 'assess.publicAssessDetail'});">详情</a>
              <a href="javascript:;" class="operate-a">统计</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
            :current-page="queryLimit.current" :page-sizes="[10, 20, 30, 40,50]" :page-size="queryLimit.size"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import * as api from "api/xcws/warn/warnTwo";

  export default {
    data() {
      return {
        total: 0,
        loading: false,
        tableData: [{
          buyerName: '888'
        }],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6;
          }
        },
        queryLimit: {
          current: 1,
          hasCurrentEw: "",
          hasProcessedEw: "",
          keyword: "",
          size: 10
        },
        select: [{
            name: "存在",
            key: true
          },
          {
            name: "不存在",
            key: false
          }
        ]
      };
    },

    mounted() {
      this.searchPage();
    },
    methods: {
      handleSelectionChange(val) {
        console.log(val)
      },
      view(id) {
        this.$router.push({
          name: "assess.publicAssessAdd"
        });
      },
      add() {
        this.$router.push({
          name: "assess.publicAssessAdd"
        });
      },
      searchPage() {
        // debugger
        // this.loading = true;
        // api.getWarningList(this.queryLimit).then(result => {
        //   if (result.status) {
        //     // this.tableData = result.data.records;
        //     this.total = result.data.total;
        //   } else {
        //     this.$message.warning("列表数据获取失败！请稍候重试");
        //   }
        //   this.loading = false;
        // });
      },
      async exportList() {
        // let result = await api.exportWarningList(this.queryLimit);
        // if (result.status) {
        //   window.location.href = result.data.fileUrl;
        // } else {
        //   this.$message.warning(result.message);
        // }
      },
      changeSearch() {
        this.queryLimit.current = 1;
        this.searchPage();
      },
      pagecCurrentChange(num) {
        this.queryLimit.current = num;
        this.searchPage();
      },
      pageSizeChange(size) {
        this.queryLimit.size = size;
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