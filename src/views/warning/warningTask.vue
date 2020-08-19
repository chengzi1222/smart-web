<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>任务管理</span>
    </div>
    <ul class="tab-box">
      <li class="tabLi" v-for="(item,index) in patternLis" :data-index="index"
          :class="index==mess.choose?'li-bott':''" :key="index" @click="choose(index,item.key)">
        <div :data-index='index'>
          <span :class="index==mess.choose?'li-span':''">{{item.name}}</span><span>{{item.num}}</span>
        </div>
      </li>
      <li class="tab-bott"></li>
    </ul>
    <div style="margin-bottom:10px;overflow:hidden;">
      <el-input placeholder="任务名称" class="w260 seekIpt" v-model="searchMap.keyword" style="float:left;">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getPageData"></i>
      </el-input>
      <div style="float:left;">
        <enum-select v-model="searchMap.taskLevel" @change="getPageData" enum="com.ybveg.govx.enums.medi.WarningLevelEnum" placeholder="预警等级"></enum-select>
        <enum-select v-model="searchMap.enterpriseForm" @change="getPageData" enum="com.ybveg.govx.enums.medi.EnterpriseFormEnum"
          placeholder="企业形态(全部)"></enum-select>
      </div>
      <el-button class="w150 dc" type="primary" icon="el-icon" v-auth="'medi.biz.wb|func.add'" @click="addWarningTask">添加预警任务</el-button>
    </div>
    <el-table @sort-change="sortChange" :data="dataPage" class="table-div" :key="mess.choose" v-loading="loading">
      <el-table-column show-overflow-tooltip type="index" min-width='50' label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="taskName" min-width='150' label="任务名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="taskLevel" min-width='100' label="预警等级"></el-table-column>
      <el-table-column show-overflow-tooltip prop="enterpriseForm" min-width='100' label="企业形态"></el-table-column>
      <el-table-column show-overflow-tooltip prop="entityCount" min-width='70' label="涉及企业"></el-table-column>
      <el-table-column show-overflow-tooltip prop="unRevicedCount" min-width='70' label="未接收"></el-table-column>
      <el-table-column show-overflow-tooltip prop="tobeExecuteCount" min-width='70' label="待处理"></el-table-column>
      <el-table-column show-overflow-tooltip prop="executedCount" min-width='70' label="已处理"></el-table-column>
      <el-table-column show-overflow-tooltip prop="create_time" min-width='120' sortable="custom" label="发布时间"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="toInfo(scope.row.id)" class="operate-a">任务详情</a>
          <a href="javascript:;" @click="toSituation(scope.row.id,scope.row.taskName,scope.row.taskLevel)" class="operate-a">执行情况</a>
          <a href="javascript:;" @click="completeTask(scope.row.id)" class="operate-a" v-auth="'medi.biz.wb|func.add'" v-if="mess.key != 'ALREADY_COMPLETED'">完成</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <span class="bt-info">提示：系统已覆盖药品经营企业总数：{{ entityCount }}家</span>
      <el-pagination background :current-page="page.pageNum"
                     :page-sizes="[10, 20, 30, 40,50]"
                     :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="page.total"
                     @size-change="pageSizeChange"
                     @current-change="pagecCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import EnumSelect from 'components/common/EnumSelect'
  import * as warningTask from "api/warning/warning";

  export default {
    methods: {
      addWarningTask() {
        this.$router.push({name: "warning.add"});
      },
      // 分页查询
      getPageData() {
        this.loading=true;
        warningTask.warningTaskPpage(this.searchMap, this.page.pageSize, this.page.pageNum).then(r => {
          this.loading=false;
          this.dataPage = r.data.list
          this.page.total = r.data.total
        })
      },
      //切换导航样式
      choose(index, key) {
        this.mess.choose = index
        this.mess.key = key
        this.searchMap.state = key
        this.searchMap.keyword = ''
        this.searchMap.enterpriseForm = ''
        this.dataPage = undefined
        this.getPageData()
      },
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num
        this.getPageData()
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size
        this.getPageData()
      },
      sortChange() {
        this.searchMap.sort = arguments[0].order ? arguments[0].order: 'descending'
        this.getPageData();
      },
      toInfo(warningTaskId) {
        this.$router.push({name: 'warning.detail',query: {'warningTaskId': warningTaskId}})
      },
      toSituation(warningTaskId,warningTaskName, taskLevel) {
        this.$router.push({name: 'warning.info', query: {'warningTaskId': warningTaskId,'warningTaskName': warningTaskName, 'taskLevel': taskLevel}})
      },
      completeTask (warningTaskId){
        this.$confirm('是否确认完成该预警任务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          warningTask.complete(warningTaskId).then(result =>{
            if (!result.status) {
              this.$message({
                message: result.message,
                type: result.level
              });
              return;
            }
            this.$message({
              message: '保存成功!',
              type: 'success'
            });
            this.init();
          })
        })
      },
      init() {
        warningTask.getWarningTaskStates().then(r => {
          this.patternLis = r.data
          this.searchMap.state = this.patternLis[0].key
          this.getPageData()
        })
        warningTask.getEntityCount().then(r => {
          this.entityCount = r.data
        })

      }
    },
    async mounted() {
      this.loading=true;
      if(this.$route.query.index){
        warningTask.getWarningTaskStates().then(r => {
          this.patternLis = r.data;
          this.mess.choose=this.$route.query.index;
          if(this.$route.query.index=='0'){
            this.mess.key='EXECUTING'
          }
          if(this.$route.query.index=='1'){
            this.mess.key='ALREADY_COMPLETED'
          }
          this.searchMap.state = this.mess.key;
          this.getPageData()
        })
        warningTask.getEntityCount().then(r => {
          this.entityCount = r.data;
        })

      }else{
        this.init();
      }
    },
    data() {
      return {
        taskId: '',
        searchMap: {
          enterpriseForm: '',
          keyword: '',
          state: '',
          sort: 'descending',
          taskLevel: ''
        },
        entityCount: 0,
        patternLis: [],
        mess: {
          choose: 0,
          key: ''
        },
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        dataPage: null,
        subName: '',
        pageObj: null,
        loading: false
      };
    },
    components: {
      EnumSelect
    }
  }
</script>

<style scoped lang="sass">
  .bt-info{
    line-height: 32px;
    font-size: 12px;
    margin-left: 10px;
    float: left;
    color: #6D7787;
  }

  .bigbox {
    position: relative;
  }

  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
    margin-bottom: 20px;
  }

  .tab-box .tabLi {
    width: 128px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9A9A9A;
    text-align: center;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0DB5EF;
    z-index: 666;
    position: relative;
  }

  .tab-box .li-span {
    color: #393939;
  }

  .tab-box span:first-child {
    margin-right: 10px;
  }

  .dc {
    float: right;
    width: 150px;
  }

  .table-div {
    margin: 20px 0;
    text-align: center;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .operate-a {
    color: #0DB5EF;
  }
</style>
