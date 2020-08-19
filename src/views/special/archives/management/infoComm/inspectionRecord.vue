<template>
  <div>
    <div class="mt20">
      <el-input title="检查报告编号、检验单位、使用单位" placeholder="检查报告编号、检验单位、使用单位" class="w260 seekIpt mr20" v-model="subName" @keyup.enter.native="getReportPaging">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getReportPaging"></i>
      </el-input>
      检验日期：
      <el-date-picker @change="getReportPaging" value-format="yyyy-MM-dd" class="sleq padRightNo mr10" type="date"
        v-model="dailyBeginTime" placeholder="起始时间" :picker-options="dailyStartDate"></el-date-picker>
      至
      <el-date-picker @change="getReportPaging" value-format="yyyy-MM-dd" class="slez padRightNo ml10" type="date" v-model="dailyOverTime"
        placeholder="截止时间" :picker-options="dailyAfterDate"></el-date-picker>
    </div>
    <el-table class="table-div mt20" :data="tableData">
      <el-table-column show-overflow-tooltip type="index" label="序号" min-width="50"></el-table-column>
      <el-table-column show-overflow-tooltip prop="number" label="检验报告编号" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="type" label="检验类别" min-width="130"></el-table-column>
      <el-table-column show-overflow-tooltip prop="verdict" label="检验结论" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="inspectDate" label="检验日期" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="nextInspectDate" label="下次检验日期" min-width="140"></el-table-column>
      <el-table-column show-overflow-tooltip prop="entityName" label="检验单位名称" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="inspectLicence" label="检验机构核准证" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="inspectPerson" label="检验人员" min-width="100"></el-table-column>
      <el-table-column min-width="150" label="操作">
        <template slot-scope="scope">
          <a style="color: #1787AD;cursor:pointer" @click="info(scope.row)">详情</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box textR mt20">
      <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 50, 100,500]" :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="pageSizeChange"
        @current-change="pagecCurrentChange">
      </el-pagination>
    </div>
    <popup v-if="infoShow" popuptype='info' :reportId="reportId" name="检验报告详情" :status="false" @popupShowHiden="popupShowHiden"></popup>
  </div>
</template>

<script>
  import { getReportPaging} from "api/special/elevator"
  import popup from '../../surveyreport/popup.vue'
  export default{
    data() {
      return {
        subName: '',
        dailyBeginTime:'',
        dailyOverTime: '',
        dailyAfterDate: {
          disabledDate: (time) => {
            let dates = new Date();
            let y = dates.getFullYear() + 1;
            let year = new Date(y + "-01-01");
            let y_ = dates.getFullYear();
            let year_ = new Date(y_ + "-01-01");

            let startDate = new Date(this.dailyBeginTime);

            if (this.dailyBeginTime) {
              let b = (time.getTime() > year - 8.64e7) || (time.getTime() < year_ - 8.64e7) || (time.getTime() < startDate - 8.64e7)
              return b;
            } else {
              let b = (time.getTime() > year - 8.64e7) || (time.getTime() < year_ - 8.64e7);
              return b;
            }
          }
        },
        dailyStartDate: {
          disabledDate: (time) => {
            let dates = new Date();
            let y = dates.getFullYear();
            let year = new Date(y + "-01-01");
            let y_ = dates.getFullYear() + 1;
            let year_ = new Date(y_ + "-01-01");

            let endDate = new Date(this.dailyOverTime);

            if (this.dailyOverTime) {
              let b = (time.getTime() < year - 8.64e7) || (time.getTime() > year_ - 8.64e7) || (time.getTime() > endDate)
              return b;
            } else {
              let b = (time.getTime() < year - 8.64e7) || (time.getTime() > year_ - 8.64e7);
              return b;
            }
          }
        },
        tableData: [],
        page: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        infoShow: false,
        reportId: ''
      }
    },
    mounted() {
      this.getReportPaging()
    },
    methods: {
      getReportPaging(){
        let params = {
          keysWork: this.subName,
          pageSize: this.page.pageSize,
          pageNum: this.page.pageNum
        }
        if(this.dailyBeginTime && this.dailyBeginTime != ''){
          params.startDate = this.dailyBeginTime.replace('-','/').replace('-', '/');
        }
        if (this.dailyOverTime && this.dailyOverTime != '') {
          params.endDate = this.dailyOverTime.replace('-','/').replace('-', '/');
        }
        getReportPaging(this.$route.query.id,params).then(r => {
          this.tableData = r.data.list;
          this.page.total = r.data.total;
        })
      },
      info(row){
        this.reportId = row.id;
        this.infoShow = true;
      },
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.getReportPaging();
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.getReportPaging();
      },
      popupShowHiden(){
        this.infoShow = false;
      }
    },
    components: {
      popup
    }
  }
</script>

<style scoped lang="sass">

</style>