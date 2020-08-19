<template>
  <!-- 主体巡查记录 -->

  <div class="table-content">
    <div style="display: inline-block;vertical-align: top;margin-bottom: 15px;margin-right:20px;">
         <enum-select style="margin-left:0px;" v-model="condition.result" @change="recordResultSelectChange" enum="com.ybveg.govx.enums.patrol.RecordResultEnum" multiple placeholder="巡查结果(全部)"></enum-select>
         <enum-select v-model="condition.treat" @change="recordTreatSelectChange" enum="com.ybveg.govx.enums.patrol.TreatEnum" multiple placeholder="处理方式(全部)"></enum-select>
    </div>

    <el-date-picker value-format="yyyy-MM-dd" @change="startTimeChange" v-model="condition.startTime" class="sle w140" type="date" placeholder="起始日期" :picker-options="beforeTime"></el-date-picker>
    至
    <el-date-picker value-format="yyyy-MM-dd" @change="endTimeChange" v-model="condition.endTime" class="sle w140" type="date" placeholder="截止日期" :picker-options="afterTime"></el-date-picker>
    <el-table @sort-change="sortChange" :data="tableData" class="table-div">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="patrolRecordName" min-width="100" label="巡查计划"></el-table-column>
      <el-table-column show-overflow-tooltip prop="realName" min-width="90" label="监管人员"></el-table-column>
      <el-table-column show-overflow-tooltip prop="realNameList" min-width="120" label="信息员"></el-table-column>
      <el-table-column show-overflow-tooltip prop="result" min-width="100" label="巡查结果"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="100" label="问题项/巡查项">
        <template slot-scope="scope">
          <span>{{scope.row.noNumber}}/{{scope.row.totalNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="treat" min-width="100" label="处理方式"></el-table-column>
      <el-table-column show-overflow-tooltip prop="patrolTime" min-width="100" sortable="custom" label="巡查日期"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a href="javascript:;" v-auth="'food.patrol.record'" @click="viewClick(scope.row)" class="operate-a">详情</a>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-box">
      <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange" :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
      </el-pagination>
    </div>

  </div>

</template>

<script>
import { entityPatrolRecordPage } from "api/patrol/record/record";
import EnumSelect from 'components/common/EnumSelect'

export default {
  mounted() {
    if(!this.entityId) {
      return;
    }
    this.condition.entityId = this.entityId;
    this.tabSearch();
  },
  methods: {
    async searchPage() {
      entityPatrolRecordPage(this.condition, this.page).then(r => {
        this.page.total = r.data.total
        this.tableData = r.data.list
      })
    },
    recordResultSelectChange () {
      this.searchPage()
    },
    recordTreatSelectChange () {
      this.searchPage()
    },
    startTimeChange () {
      this.searchPage()
    },
    endTimeChange () {
      this.searchPage()
    },
    sortChange () {
      // descending下降 ascending上升
      console.log(arguments[0].order + ':' +arguments[0].prop)
      this.condition.sort = arguments[0].order
      this.searchPage()
    },
    pagecCurrentChange(num) {
      this.page.pageNum = num;
      this.searchPage();
    },
    pageSizeChange(size) {
      this.page.pageSize = size;
      this.searchPage();
    },
    tabSearch() {
      this.page.pageNum = 1;
      this.searchPage();
    },
    viewClick(row) {
      this.$router.push({ name: 'patrol.record.detail', query:{recordId: row.id, patrolType: row.planType}})
    }
  },
  components: {EnumSelect},
  props: {
    entityId: {
      type: String,
    }
  },
  data() {
    return {
      tableData: [],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      condition: {
        result: [],
        treat: [],
        entityId: '',
        startTime: '',
        endTime: '',
        sort: ''
      },
      beforeTime: {
        disabledDate: (time) => {
          if (this.condition.endTime) {
            return time.getTime() > new Date(this.condition.endTime);
          }
        }
      },
      afterTime: {
        disabledDate: (time) => {
          if(this.condition.startTime){
            return time.getTime() < new Date(this.condition.startTime);
          }
        }
      },
    }
  }
}
</script>


<style scoped lang="sass">
.tab-box {
  width: 100%;
  display: flex;
  position: relative;
}

.tab-box li {
  width: 110px;
  height: 50px;
  line-height: 50px;
  margin-right: 30px;

  font-size: 15px;
  color: #9a9a9a;
  text-align: center;
}

.li-bott span {
  color: #393939;
}

.tab-box .tab-bott {
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 2px;
  background: #ebf1f5;
}

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

.table-content {
  margin-left: -227px;
}
</style>
