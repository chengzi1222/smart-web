<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)"
    class="user-box">
    <div class="ipt-btn-box" style="justify-content: end;">
      <el-input placeholder="供应商名称、记录编号、车牌号" class="w250 seekIpt" v-model="searchMap.keyWork" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>
      <el-select class="selectHeight" v-model="searchMap.result" clearable placeholder="检查结果" @change="searchPage">
        <el-option v-for="item in resultSelect" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>
      <el-select class="selectHeight" v-model="searchMap.treat" clearable placeholder="处理方式" @change="searchPage">
        <el-option v-for="item in treatSelect" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>
      <el-select class="selectHeight" v-model="searchMap.examineDate" clearable placeholder="检查日期" @change="searchPage">
        <el-option v-for="item in dateSelect" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
    </div>
    <div class="tabOffTop50">
      <el-table :data="tableData" :border="true" :resizable="true" @sort-change="sortChange" class="table-div">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="100" label="供应商名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="reportedNo" min-width="90" label="配送编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="recordNo" min-width="90" label="检查记录编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="carNo" min-width="80" label="车牌号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="superviseName" min-width="80" label="监督人员"></el-table-column>
        <el-table-column show-overflow-tooltip prop="boxQuantity" min-width="80" label="盒饭上报数量"></el-table-column>
        <el-table-column show-overflow-tooltip prop="staple" min-width="60" label="主食温度"></el-table-column>
        <el-table-column show-overflow-tooltip prop="resultStr" min-width="60" label="检查结果"></el-table-column>
        <el-table-column show-overflow-tooltip prop="treatStr" min-width="60" label="处理方式"></el-table-column>
        <el-table-column show-overflow-tooltip prop="examineTime" min-width="80" label="检查时间" sortable='custom'></el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <a href="javascript:;" class="operate-a" @click="toInfo(scope.row.id)">详情</a>
            <a href="javascript:;" @click="printRecord(scope.row.id, true)" class="operate-a">打印预览</a>
            <a href="javascript:;" @click="printRecord(scope.row.id, false)" class="operate-a">打印</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange" :current-page="page.pageNum"
          :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>


    <!-- 打印组件 -->
    <PrintPatrol ref="PrintPatrol" :resultData="infoData" :patrolType="'重大活动保障盒饭检查'"></PrintPatrol>
  </div>
</template>

<script>
  import { dateSelect, page } from 'api/activity/box'
  import { getEnums } from 'api/common'
  import { doPrintRecord } from 'utils/print/doPrint.js'
  import PrintPatrol from './printPatrol.vue'
  import { info } from 'api/activity/box'
  export default {
    mounted() {
      this.searchMap.taskId = this.$route.query.taskId
      dateSelect(this.$route.query.taskId).then(r => {
        this.dateSelect = r.data
      })
      getEnums(['com.ybveg.govx.enums.active.ActiveBoxExamineResultEnum'], false).then((r) => {
        this.resultSelect = r.data
      });
      getEnums(['com.ybveg.govx.enums.active.ActiveBoxExamineTreatEnum'], false).then((r) => {
        this.treatSelect = r.data
      });
      this.searchPage()
    },
    methods: {
      sortChange(column) {
        this.searchMap.sort = column.order
        this.searchPage();
      },

      handleIconClick() { //搜索框按钮点击搜索
        this.searchPage();
      },
      async searchPage() {
        this.loading = true;
        page(this.page, this.searchMap).then(r => {
          this.loading = false;
          this.tableData = r.data.list
          this.page.total = r.data.total
        })
      },
      searchTab() {
        this.page.pageNum = 1;
        this.searchPage();
      },
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.searchPage();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.searchPage();
      },
      toInfo(examineId) {
        this.$router.push({ name: 'boxLunch.info', query: { 'examineId': examineId } })
      },
      /* 打印 */
      async printInitData(id) {
        this.qrcodeId = id
        await info(id).then(r => {
          this.infoData = r.data
          let names = this.infoData.deptName.split(',')
          let set = new Set()
          names.forEach(element => {
            set.add(element)
          })
          let deptNameArray = new Array()
          set.forEach(element => {
            deptNameArray.push(element)
          })
          this.infoData.deptName = deptNameArray.join(',')
          this.infoData.sum = this.infoData.contexts.length
          let noQual = 0
          let qualArray = new Array()
          let qualStr = new Array()
          this.infoData.contexts.forEach(element => {
            if (element.qual == '否') {
              noQual++
            } else {
              qualArray.push(element)
              qualStr.push(element.no)
            }
          })
          this.infoData.qualStr = qualStr.join(',')
          this.infoData.qualArray = qualArray
          this.infoData.noQual = noQual
          console.log(this.infoData);
        })
      },

      async printRecord(id, isPreview) {
        this.loading = true
        await this.printInitData(id)
        this.$refs.PrintPatrol.printStyle(id)
        setTimeout(() => {
          doPrintRecord(isPreview)
          setTimeout(() => {
            this.loading = false
          }, 1000)
        }, 2000)
      }
    },
    components: {
      PrintPatrol
    },
    data() {
      return {
        search: '',
        sort: 'DESC',
        tableData: [],
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        searchMap: {
          keyWork: '',
          result: '',
          treat: '',
          sort: '',
          examineDate: '',
          taskId: ''
        },
        resultSelect: [],
        treatSelect: [],
        dateSelect: [],
        infoData: {},
        qrcodeId: '',
        loading: false
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

  table tr td:last-child .cell a {
    border-right: 1px solid #ccc;
    padding-right: 5px;
  }

  table tr td:last-child .cell a:last-child {
    border-right: none;
    padding-right: 0px;
  }
</style>