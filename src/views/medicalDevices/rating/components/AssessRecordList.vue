<template>
  <div>
    <el-row>
      <el-form>
        <el-col :span="6">
          <el-select placeholder="风险分级" size="mini" clearable style="width: 100%"
                     v-model="searchForm.quantifyLevel" @change="getAssessRecord">
            <el-option v-for="item in quantifyLevelList" :key="item.code"
                       :label="item.name" :value="item.code" :disabled="item.code=='NOASSESS'">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="6" :offset="1">
          <el-select placeholder="评定年份" size="mini" clearable style="width: 100%"
                     v-model="searchForm.year" @change="getAssessRecord">
            <el-option v-for="(value, key, index) in assessDialogYearList" :key="index"
                       :label="key" :value="key">
            </el-option>
          </el-select>
        </el-col>
      </el-form>
    </el-row>

    <el-row class="blank-space">
      <el-table :data="recordListData" class="table-div" size="small"
                v-loading="recordListLoading" @sort-change="handleSortChange">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column label="评定等级" prop="assessLevel"></el-table-column>
        <el-table-column label="年度" prop="year"></el-table-column>
        <el-table-column label="评定人" prop="userName"></el-table-column>
        <el-table-column label="评定时间" prop="assessTime" sortable="custom"></el-table-column>
      </el-table>
    </el-row>

    <div class="pagination-box" v-show="recordListDataTotal>0">
      <el-pagination background @size-change="handleSizeChange" @current-change="getAssessRecord"
                     :current-page.sync="searchForm.pageNum" :page-size="searchForm.pageSize"
                     :total="recordListDataTotal" :page-sizes="[5,10]"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>


<script type="module">
  import * as ratingApi from "api/medicalDevices/rating";

  const defaultSearchForm = {
    pageNum: 1,
    pageSize: 5,
    quantifyLevel: "",
    year: "",
    entityId: "",
    assessTimeSortType: 'DESC' //评定时间排序方式
  };

  export default {
    props: {
      entityId: "",
      quantifyLevelList: {
        type: Array,
        default: []
      }
    },

    data() {
      return {
        // 查询表单
        searchForm: {
          pageNum: 1,
          pageSize: 5,
          quantifyLevel: "",
          year: "",
          entityId: "",
          assessTimeSortType: 'DESC' //评定时间排序方式
        },
        // 检查记录列表数据
        recordListData: [],
        recordListLoading: false,
        recordListDataTotal: 0,
        // 评定年度
        assessDialogYearList: {}
      };
    },
    computed: {},

    methods: {

      // 列表数据
      getAssessRecord() {
        // console.log(JSON.stringify(this.searchForm));
        this.recordListLoading = true;
        ratingApi.assessRecordPageApi(this.searchForm).then(res => {
          // console.log(res);
          this.recordListLoading = false;
          if (res.status) {
            this.recordListData = res.data.list;
            this.recordListDataTotal = res.data.total;
          } else {
            console.log("获取评定记录列表失败");
            console.log(res.message);
          }
        });
      },

      // 分页
      handleSizeChange(size) {
        this.searchForm.pageSize = size;
        this.getAssessRecord();
      },

      // 排序
      handleSortChange() {
        this.searchForm.assessTimeSortType = this.searchForm.assessTimeSortType == "DESC" ? "ASC" : "DESC";
        this.getAssessRecord();
      },

      // 年份
      getLatestOfYearAssessRecordList() {
        let paramsObj = {
          entityId: this.searchForm.entityId
        };
        ratingApi.latestOfYearAssessRecordListApi(paramsObj).then(res => {
          if (res.status) {
            this.assessDialogYearList = res.data;
          } else {
            console.log("获取历年评定记录失败");
            console.log(res.message);
          }
        });
      }

    },

    mounted() {
      this.searchForm = Object.assign({}, defaultSearchForm);
      this.searchForm.entityId = this.entityId;
      this.getLatestOfYearAssessRecordList();
      this.getAssessRecord();
    },

    watch: {
      // dataLis() {
      //   this.numChange();
      // }
    }
  };
</script>

<style scoped lang="sass">
  .blank-space {
    margin-top: 20px;
  }

  .pagination-box {
    margin-top: 20px;
    text-align: right;
  }
</style>

