<template>
  <!-- 主体处罚记录 -->

  <div class="table-content">
    <div style="display: inline-block;vertical-align: top;margin-bottom: 15px;margin-right:20px;">
        <dict-select style="margin-left:0px;" @change="entityPunishTypeChange" v-model="condition.type" dict="AP_TYPE" multiple placeholder="处罚方式(全部)"></dict-select>
    </div>

    <el-date-picker value-format="yyyy-MM-dd" @change="startTimeChange" v-model="condition.startTime" class="sle w140" type="date" placeholder="起始日期" :picker-options="beforeTime"></el-date-picker>
    至
    <el-date-picker value-format="yyyy-MM-dd" @change="endTimeChange" v-model="condition.endTime" class="sle w140" type="date" placeholder="截止日期" :picker-options="afterTime"></el-date-picker>
    <el-table @sort-change="sortChange" :data="tableData" class="table-div">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="type" min-width="100" label="处罚方式"></el-table-column>
      <el-table-column show-overflow-tooltip prop="realNameList" min-width="90" label="执法人员"></el-table-column>
      <el-table-column show-overflow-tooltip prop="punishTime" min-width="120" sortable="custom" label="执法日期"></el-table-column>
      <el-table-column show-overflow-tooltip prop="punishInfo" min-width="100" label="执法详情"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a href="javascript:;" v-auth="'food.enforce.punish'" @click="viewClick(scope.row)" class="operate-a">详情</a>
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
import { entityPunishRecordPage } from "api/enforce/punish";
import DictSelect from 'components/common/DictSelect'

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
      entityPunishRecordPage(this.condition, this.page).then(r => {
        this.page.total = r.data.total
        this.tableData = r.data.list
      })
    },
    entityPunishTypeChange () {
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
      this.$router.push({name: "enforce.punish.detail", query: {id: row.id}});
    },
  },
  components: {DictSelect},
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
        type: [],
        entityId: '',
        startTime: '',
        endTime: '',
        sort: ''
      },
      beforeTime: {
        disabledDate: (time) => {
          let endDateVal = new Date(this.condition.endTime);
          if (this.condition.endTime) {
              return time.getTime() > endDateVal;
          }
        }
      },
      afterTime: {
        disabledDate: (time) => {
          let beginDateVal = new Date(this.condition.startTime);
          if (this.condition.startTime) {
            return time.getTime() < beginDateVal - 8.64e7;
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
