<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>{{title}}</span>
      <back></back>
    </div>
    <div class="mt20">
      <el-input placeholder="请输入主体名称" class="w260 seekIpt" v-model="entityName" @keyup.enter.native="search">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
      </el-input>
      <select-dept-grid class="selectHeight" style="overflow: visible" placeholder="请选择街道" @change="areaChange"></select-dept-grid>
      <el-select class="ml20" v-model="assessVal" placeholder="请选择考核结果" @change='assessValSel' clearable>
        <el-option v-for="item in assessOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker class="w120 ml20" v-model="seldate" type="month" @change="changeMonth" placeholder="选择月份">
      </el-date-picker>
    </div>
    <div style="position: relative;">
      <div v-if="lodings" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;z-index: 99;text-align: center;background-color: rgba(0,0,0,.1);">
        <span style="position: absolute;top: 50%;margin-top: -30px;"><i class="icon el-icon-loading" style="font-size: 40px;"></i></span>
      </div>
      <el-table :data="dataPage" class="table-div etable">
        <el-table-column show-overflow-tooltip min-width="80" type="index" label="序号">
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="80" label="主体名称">
          <template slot-scope="scope">
            <span>{{scope.row.entityName ? scope.row.entityName : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="80" label="排名">
          <template slot-scope="scope">
            <span>{{scope.row.rank ? scope.row.rank : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="type==='XCWS'" show-overflow-tooltip min-width="80" label="晨检">
          <template slot-scope="scope">
            <span>{{scope.row.mi != null ? Number(scope.row.mi*100).toFixed(1)+'%' : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="type==='XCWS'" show-overflow-tooltip min-width="80" label="清洗消毒">
          <template slot-scope="scope">
            <span>{{scope.row.cad != null ? Number(scope.row.cad*100).toFixed(1)+'%' : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="type==='XCWS'" show-overflow-tooltip min-width="80" label="食品留样">
          <template slot-scope="scope">
            <span>{{scope.row.fs != null ? Number(scope.row.fs*100).toFixed(1)+'%' : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="type==='XCWS'" show-overflow-tooltip min-width="80" label="餐厨垃圾">
          <template slot-scope="scope">
            <span>{{scope.row.kw != null ? Number(scope.row.kw*100).toFixed(1)+'%' : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="type==='XCWS'" show-overflow-tooltip min-width="80" label="每日菜谱">
          <template slot-scope="scope">
            <span>{{scope.row.dr != null ? Number(scope.row.dr*100).toFixed(1)+'%' : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="type==='XCWS'" show-overflow-tooltip min-width="80" label="陪餐">
          <template slot-scope="scope">
            <span>{{scope.row.pam != null ? Number(scope.row.pam*100).toFixed(1)+'%' : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="type==='AI'" show-overflow-tooltip min-width="80" label="AI预警">
          <template slot-scope="scope">
            <span>{{scope.row.ai != null ? Number(scope.row.ai*100).toFixed(1)+'%' : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="80" label="考核结果">
          <template slot-scope="scope">
            <span>{{resultOpt[scope.row.result]? resultOpt[scope.row.result] : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="80" label="操作">
          <template slot-scope="scope">
            <a href="javascript:;" class="operate-a" @click="goDetail(scope.row)">详情</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box mb20">
        <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { getAIEntityUsage, getXcwsEntityUsage } from "api/trace/foodAssess"
  import SelectDeptGrid from "components/common/SelectDeptGrid.vue";
  import Back from 'utils/back.vue';
  export default {
    computed: {
      month() {
        let date = new Date(this.seldate);
        let mon = '';
        if((date.getMonth() + 1) < 10) {
          mon = '0' + (date.getMonth() + 1)
        } else {
          mon = (date.getMonth() + 1)
        }
        return date.getFullYear() + '-' + mon;
      },
    },
    methods: {
      assessValSel(val) {
        this.page.pageNum = 1;
        this.getPageData();
      },
      areaChange(val) {
        if (!val || val.length == 0) {
          this.areaCode = this.$route.query.areaCode;
        } else {
          this.areaCode = val[val.length - 1];
        }
        this.page.pageNum = 1;
        this.getPageData();
      },
      //请求分页数据
      async getPageData() {
        this.lodings = true;
        let entityQueryParams = {
          entityName: this.entityName,
          areaCode: this.areaCode,
          month: this.month,
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
          result: this.assessVal
        }
        let res = this.type === 'XCWS' ?
                  await getXcwsEntityUsage(entityQueryParams) :
                  await getAIEntityUsage(entityQueryParams)
        if(res.status) {
          this.dataPage = res.data.records;
          this.page.total = res.data.total;
        }
        this.lodings = false;
      },
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.getPageData();
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.getPageData();
      },
      changeMonth() {
        this.page.pageNum = 1;
        this.getPageData();
      },
      //搜索框搜索
      search() {
        this.page.pageNum = 1;
        this.getPageData();
      },
      // 详情
      goDetail(row) {
        let path = this.type === 'XCWS' ? '/xcwsWarn/kitchen/detail' : '/xcwsWarn/AIWarnList/detail'
        this.$router.push({
          path: path,
          query: {
            entityId: row.entityId
          }
        })
      }
    },
    mounted() {
      this.areaCode = this.$route.query.areaCode;
      this.type = this.$route.query.type;
      this.title = this.type === 'XCWS' ? '校餐卫士使用率考核' : 'AI预警使用率考核'
      this.getPageData();
    },
    data() {
      return {
        title: '校餐卫士使用率考核',
        type: '',
        areaCode: '',
        assessVal: '',
        assessOptions: [{
          label: '合格',
          value: '1'
        }, {
          label: '不合格',
          value: '0'
        }],
        seldate: new Date(this.$route.query.date),
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        dataPage: [],
        entityName: '',
        lodings: true,
        resultOpt: {
          "1": "合格",
          "0": "不合格"
        }
      };
    },
    components: {
      SelectDeptGrid,
      Back
    }
  }
</script>

<style scoped lang="sass">
  .bigbox {
    position: relative;
    height: 100%;
  }

  .table-div {
    margin: 20px 0;
    text-align: center;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .etable tr td:first-child {
    text-align: left;
  }
</style>