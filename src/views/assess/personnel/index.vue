<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>人员档案</span>
    </div>

    <div class="user-box">
      <div class="mt20 mb20 clear_a">
        <el-input placeholder="姓名、单位、备案号、账号、手机…" class="w250 seekIpt" v-model="queryLimit.keyword"
          @keyup.enter.native="changeSearch">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch"></i>
        </el-input>
        <select-area-grid class="selectHeight w150" placeholder="所属区域" @change="selectAreaGrid"></select-area-grid>
        <el-select class="selectHeight w150" v-model="queryLimit.hasProcessedEw" :clearable="true" placeholder="状态"
          @change="changeSearch">
          <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
        <!-- <el-select class="selectHeight w150" v-model="queryLimit.hasProcessedEw" :clearable="true" placeholder="人员类型"
          @change="changeSearch">
          <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
        <el-select class="selectHeight w150" v-model="queryLimit.hasProcessedEw" collapse-tags multiple  :clearable="true" placeholder="行业类型"
          @change="changeSearch">
          <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
        <el-select class="selectHeight w150" v-model="queryLimit.hasProcessedEw" collapse-tags multiple  :clearable="true" placeholder="主体类型"
          @change="changeSearch">
          <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select> -->
      </div>
      <div class="mb20 clear_a">
        <el-button class="w100 mb20" @click="exportList">批量启用</el-button>
        <el-button class="w100 mb20" @click="exportList">批量禁用</el-button>
        <el-button class="w120 mb20" @click="exportList">下载导出模板</el-button>
        <el-button class="w100 mb20" @click="exportList">导入</el-button>
        <el-button class="w100 mb20" @click="exportList">导出</el-button>
        <el-button class="w100 mr20" type="primary" @click="add"><i
            style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>添加
        </el-button>
      </div>
      <div class="tabOffTop120">
        <el-table v-loading="loading" @selection-change="handleSelectionChange" element-loading-text="数据正在努力加载中"
          :border="true" :resizable="true" :data="tableData" class="table-div">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="buyerName" min-width="120" label="姓名"></el-table-column>
          <el-table-column show-overflow-tooltip prop="legalPerson" min-width="200" label="手机号(账号)"></el-table-column>
          <el-table-column show-overflow-tooltip prop="legalPerson" min-width="200" label="身份证号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="tel" min-width="120" label="单位名称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="areaName" min-width="80" label="单位许可备案号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="streetAreaName" min-width="80" label="岗位职务"></el-table-column>
          <el-table-column show-overflow-tooltip prop="streetAreaName" min-width="80" label="所属区域"></el-table-column>
          <el-table-column show-overflow-tooltip prop="streetAreaName" min-width="80" label="主体类型"></el-table-column>
          <el-table-column show-overflow-tooltip prop="streetAreaName" min-width="80" label="人员类型"></el-table-column>
          <el-table-column show-overflow-tooltip prop="streetAreaName" min-width="80" label="行业类型"></el-table-column>
          <el-table-column show-overflow-tooltip prop="streetAreaName" min-width="80" label="从业年限"></el-table-column>
          <el-table-column show-overflow-tooltip prop="streetAreaName" min-width="80" label="健康证有效期"></el-table-column>
          <el-table-column show-overflow-tooltip prop="streetAreaName" min-width="80" label="状态"></el-table-column>
          <el-table-column show-overflow-tooltip prop="streetAreaName" min-width="80" label="更新日期"></el-table-column>
          <el-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <a href="javascript:;" class="operate-a">编辑</a>
              <a href="javascript:;" class="operate-a">禁用</a>
              <a href="javascript:;" class="operate-a" @click="$router.push({name: 'assess.personnelDetail'});">详情</a>
              <a href="javascript:;" class="operate-a">重置密码</a>
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
  import SelectAreaGrid from 'components/common/SelectAreaGrid'
  export default {
    data() {
      return {
        total: 0,
        loading: false,
        tableData: [{
          buyerName: '888'
        }],
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
    components: {
      SelectAreaGrid
    },
    methods: {
      selectAreaGrid(val){
        console.log(val)
      },
      handleSelectionChange(val) {
        console.log(val)
      },
      view(id) {
        this.$router.push({
          name: "assess.personnelAdd"
        });
      },
      add() {
        this.$router.push({
          name: "assess.personnelAdd"
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
        // this.searchPage();
      },
      pagecCurrentChange(num) {
        this.queryLimit.current = num;
        // this.searchPage();
      },
      pageSizeChange(size) {
        this.queryLimit.size = size;
        // this.changeSearch();
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