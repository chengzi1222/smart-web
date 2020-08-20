<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b>
      <span>主体列表</span>
    </div>
    <div class="alert" v-if="alert">
      提示：静态分数、动态分数、审核人显示最新一次记录！
      <i class="el-icon-close movePoin" @click="alert=false"></i>
    </div>
    <div class="mt20 mb20 clear_a">
      <el-input
        placeholder="主体名称, 备案号, 社会信用代码"
        class="w250 seekIpt mr20"
        v-model="queryLimit.search"
        @keyup.enter.native="searchTab"
        :maxlength="30"
      >
        <i slot="suffix" class="el-input__icon el-icon-search" @click="searchTab"></i>
      </el-input>
      <select-area-grid class="w200 mr20" placeholder="所属辖区" @change="selectAreaGridChange"></select-area-grid>
      <el-select
        class="w200 mr20"
        v-model="queryLimit.entityType"
        placeholder="主体类型"
        clearable
        @change="searchTab"
      >
        <el-option
          v-for="item in businessType"
          :key="item.key"
          :label="item.name"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-select
        class="w200 mr20"
        v-model="searchKey.subType"
        placeholder="主体业态"
        clearable
        collapse-tags
        multiple
        v-if="queryLimit.entityType !== 'CFDARESTAURANT'"
        @change="multipleSelect('subType')"
      >
        <el-option v-for="item in subType" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
      <el-button class="floatR w100" type="primary">导出</el-button>
    </div>
    <div class="mt20 mb20 clear_a">
      <el-select
        class="w200 mr20"
        v-model="searchKey.superviseType"
        clearable
        collapse-tags
        multiple
        placeholder="监管类型"
        v-if="queryLimit.entityType !== 'CFDARESTAURANT'"
        @change="multipleSelect('superviseType')"
      >
        <el-option
          v-for="item in  supervisionType"
          :key="item.key"
          :label="item.name"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-select
        class="w200 mr20"
        v-model="searchKey.riskLevel"
        clearable
        collapse-tags
        multiple
        placeholder="风险等级"
        @change="multipleSelect('riskLevel')"
      >
        <el-option v-for="(item,key) in  riskLevel" :key="key" :label="item" :value="key"></el-option>
      </el-select>
      <div class="ml20">
        <span class="mr10">创建日期:</span>
        <el-date-picker
          @change="handleClick"
          value-format="yyyy-MM-dd"
          class="w140 mr10"
          type="date"
          v-model="searchKey.startDate"
          clearable
          placeholder="选择开始日期"
          :picker-options="beforeDate"
        ></el-date-picker>
        <span>至</span>
        <el-date-picker
          @change="handleClick"
          value-format="yyyy-MM-dd"
          v-model="queryLimit.endDate"
          class="w140 ml10 mr20"
          type="date"
          clearable
          placeholder="选择截止日期"
          :picker-options="afterDate"
        ></el-date-picker>
      </div>
      <el-select
        class="w200 mr20"
        v-model="searchKey.status"
        clearable
        collapse-tags
        multiple
        placeholder="状态"
        @change="multipleSelect('status')"
      >
        <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div>
      <el-table
        v-loading="loading"
        element-loading-text="数据正在努力加载中"
        :border="true"
        :resizable="true"
        :data="tableData"
        class="table-div"
      >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="190" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" min-width="120" label="所属区域"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityType" min-width="100" label="主体类型">
          <template
            slot-scope="scope"
          >{{scope.row.entityType === 'CFDARESTAURANT'?'小经营店（餐饮)':'餐饮主体'}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="subTypeStr"
          min-width="100"
          label="主体业态"
          v-if="queryLimit.entityType !== 'CFDARESTAURANT'"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="superviseTypeStr"
          min-width="100"
          label="监管类型"
          v-if="queryLimit.entityType !== 'CFDARESTAURANT'"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop="riskLevel" min-width="100" label="风险等级"></el-table-column>
        <el-table-column show-overflow-tooltip prop="staticScore" min-width="100" label="静态分数"></el-table-column>
        <el-table-column show-overflow-tooltip prop="dynamicScore" min-width="100" label="动态分数"></el-table-column>
        <el-table-column show-overflow-tooltip prop="reviewer" min-width="100" label="审核人"></el-table-column>
        <el-table-column show-overflow-tooltip prop="status" min-width="100" label="状态">
          <template slot-scope="scope">{{scope.row.status === 'ENABLE'?'启用':'禁用'}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" class="operate-a" @click="adjustData(scope.row)">调整等级</a>
            <a href="javascript:;" class="operate-a" @click="goRecord(scope.row.id)">评分记录</a>
            <a href="javascript:;" class="operate-a" @click="sub(scope.row)">主体档案</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          background
          @size-change="pageSizeChange"
          @current-change="pageCurrentChange"
          :current-page="queryLimit.pageNum"
          :page-sizes="[10, 20, 30, 40,50]"
          :page-size="queryLimit.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <adjust-dialog
      :showTip="showTip"
      :listData="listData"
      @cancel="showTip =false"
      @success="adjustSuccess"
      v-if="showTip"
    ></adjust-dialog>
  </div>
</template>
<script>
import * as api from '../../../../api/rating/restaurantRating2'
import SelectAreaGrid from 'components/common/SelectAreaGrid'
import { getPublic } from "../../../assess/com.js";
import { getEnums, getDicts } from 'api/common';
import AdjustDialog from './adjustDialog'
export default {
  components: {
    AdjustDialog,
    SelectAreaGrid
  },
  data() {
    return {
      showTip: false,
      alert: true,
      queryLimit: {
        search: '',
        startDate: null,
        endDate: null,
        pageNum: 1,
        pageSize: 10,
        areaCode: '',
        entityType: '',
        subType: '',
        superviseType: '',
        riskLevel: '',
        status: ''
      },
      searchKey: {
        entityType: [],
        subType: [],
        superviseType: [],
        riskLevel: [],
        status: []
      },
      listData: {
        static: 36,
        dynamic: 40,
        total: 76,
        class: 'C'
      },
      entityAreaCodeList: [],
      areaList: {
        options: [],
        props: {
          label: 'areaName',
          value: 'areaCode',
          children: "children"
        }
      },
      subType: [],
      businessType: [],
      riskLevel: ['A', 'B', 'C', 'D'],
      status: [
        {
          label: '启用',
          value: 'ENABLE'
        },
        {
          label: '禁用',
          value: 'DISABLE'
        }
      ],
      supervisionType: [],
      total: 0,
      loading: false,
      tableData: [],
      beforeDate: {
        disabledDate: (time) => {
          let endDate = new Date(this.queryLimit.endDate);
          let date = new Date('2017-12-31');
          if (this.queryLimit.endDate) {
            return time.getTime() > endDate || time.getTime() < date || time.getTime() > Date.now() - 8.64e6
          } else {
            return time.getTime() < date || time.getTime() > Date.now() - 8.64e6
          }
        }
      },
      afterDate: {
        disabledDate: (time) => {
          let startDate = new Date(this.queryLimit.startDate);
          let date = new Date('2017-12-31');
          if (this.queryLimit.startDate) {
            return time.getTime() < startDate - 8.64e7 || time.getTime() < date || time.getTime() > Date.now() - 8.64e6;
          } else {
            return time.getTime() < date || time.getTime() > Date.now() - 8.64e6
          }
        }
      },
    }
  },
  methods: {
    handleClick() {
      if (this.queryLimit.startDate && this.queryLimit.endDate || this.queryLimit.startDate === null && this.queryLimit.endDate === null) {
        this.searchTab();
      }
    },
    searchTab() {
      this.queryLimit.pageNum = 1
      this.getPageList()
    },
    pageSizeChange(size) {
      this.queryLimit.pageSize = size
      this.getPageList()
    },
    pageCurrentChange(num) {
      this.queryLimit.pageNum = num
      this.getPageList()
    },
    go(page, id) {
      this.$router.push({
        name: page,
        query: {
          id: id
        }
      })
    },
     sub(row) {
                this.$router.push({
                    path: '/subject/restaurant/archives/detail',
                    query: {
                        id: row.id,
                    }
                });
            },
    adjustSuccess() {
      this.showTip = false;
      this.searchTab()
    },
    adjustData(data) {
      this.listData = data
      this.showTip = true
    },
    goRecord(id) {
      this.$router.push({
        name: 'restaurantRating.sub.riskLevelDetail',
        query: { id: id }
      })
    },
    async getPageList() {
      this.loading = true
      let result = await api.getSubList(this.queryLimit)
      if (result.status) {
        this.tableData = result.data.list
        this.total = result.data.total
      }
      this.loading = false
    },
    async initData() {
      getEnums(['com.ybveg.govx.enums.food.djpd.FoodDjpdEntityTypeEnum']).then((data) => {
        this.businessType = data.data;
      });
      getEnums(['com.ybveg.govx.enums.sub.RestaurantSuperviseTypeEnum']).then((data) => {
        this.supervisionType = data.data;
      })
      getDicts(['RB_SUB']).then((data) => {
        this.subType = data.data[0].list || [];
      })
    },
    selectAreaGridChange(val) {
      if (!val || val.length == 0) {
        this.queryLimit.areaCode = "";
      } else {
        this.queryLimit.areaCode = val[val.length - 1];
      }
      this.searchTab();
    },
    multipleSelect(key) {
      this.queryLimit[key] = this.searchKey[key].join(',')
      this.searchTab()
    }
  },
  mounted() {
    this.getPageList()
    this.initData()
  }
}
</script>
<style lang="scss" scoped>
.bigbox {
  width: 100%;
  position: relative;
}
.table-div {
  margin: 20px 0;
  text-align: center;
}

.pagination-box {
  text-align: right;
  margin-top: 20px;
}
.alert {
  margin-top: 20px;
  padding: 0 14px;
  width: calc(100% - 28px);
  height: 34px;
  background: rgba(239, 247, 249, 1);
  border: 1px solid rgba(194, 234, 248, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(31, 171, 220, 1);
  line-height: 34px;

  .el-icon-close {
    color: #1fabdc;
    font-size: 16px;
    float: right;
    line-height: 34px;
  }
}
</style>
