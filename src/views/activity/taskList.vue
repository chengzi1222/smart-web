<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>重大活动保障任务管理</span>
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
      <el-input placeholder="任务名称" class="w260 seekIpt" v-model="searchMap.keyword"  style="float:left;">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getPageData"></i>
      </el-input>
      <el-button class="w150 dc" type="primary" v-auth="'food.activity.task|func.add'" icon="el-icon" @click="addTask">添加任务</el-button>
    </div>
    <el-table @sort-change="sortChange" :data="dataPage" class="table-div" :key="mess.choose" v-loading="loading">
      <el-table-column show-overflow-tooltip type="index" min-width='50' label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="taskName" min-width='150' label="任务名称"></el-table-column>
      <el-table-column show-overflow-tooltip  min-width='100' label="活动开始日期">
        <template slot-scope="scope">
          {{ scope.row.startTime.substring(0,10) }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip  min-width='100' label="活动截止日期">
        <template slot-scope="scope">
          {{ scope.row.endTime.substring(0,10) }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="dept_name" min-width='100' label="发布机关"></el-table-column>
      <el-table-column show-overflow-tooltip min-width='150' label="任务描述">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.info" placement="top">
            <div class="show-overflow-tooltip">
                {{ scope.row.info }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="createTime" min-width='100' sortable="custom" label="发布时间"></el-table-column>
      <el-table-column label="操作" min-width="200">
        <template slot-scope="scope">
          <a href="javascript:;" @click="toInfo(scope.row.id)" class="operate-a">详情</a>
          <a href="javascript:;" @click="toEdit(scope.row.id)" v-auth="'food.activity.task|func.add'" class="operate-a">编辑</a>
          <a href="javascript:;" @click="toExamineRecord(scope.row.id, scope.row.taskName)" class="operate-a">检查记录</a>
          <a href="javascript:;" @click="toSituation(scope.row.id,scope.row.taskName,scope.row.startTime.substring(0,10),scope.row.endTime.substring(0,10))" v-auth="'food.activity.task|func.add'" class="operate-a">执行情况</a>
          <a href="javascript:;" @click="completeTask(scope.row.id)" class="operate-a" v-auth="'food.activity.task|func.add'" v-if="mess.key == 'EXECUTING'">完成</a>
          <a href="javascript:;" @click="completeTask(scope.row.id)" class="operate-a" v-auth="'food.activity.task|func.add'" v-if="mess.key == 'ALREADY_COMPLETED'">再启动</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
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
  import * as api from "api/activity/task";
  import YbPopup from 'components/ybpopup/YbPopup';

  export default {
    methods: {
      // 分页查询
      getPageData() {
        this.loading=true;
        this.dataPage = undefined;
        api.taskPage(this.searchMap, this.page.pageSize, this.page.pageNum).then(r => {
          this.loading=false;
          this.dataPage = r.data.list;
          this.page.total = r.data.total;
        });
      },
      //切换导航样式
      choose(index, key) {
        this.mess.choose = index;
        this.mess.key = key;
        this.searchMap.state = key;
        this.searchMap.keyword = '';
        this.page.pageNum = 1;
        this.getPageData();
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
      sortChange() {
        this.searchMap.sort = arguments[0].order ? arguments[0].order: 'descending';
        this.getPageData();
      },
      addTask() {
        this.$router.push({name: "activity.taskAdd", query: {index:this.mess.choose,'type':"ADD"}});
      },
      toInfo(warningTaskId) {
        this.$router.push({name: 'activity.taskInfo',query: {index:this.mess.choose,'id': warningTaskId}});
      },
      toEdit(warningTaskId) {
        this.$router.push({name: 'activity.taskAdd',query: {'id': warningTaskId,"type":"EDIT",index:this.mess.choose}});
      },
      toExamineRecord (taskId, taskName) {
        this.$router.push({name: 'activity.recordList', query: {'taskId': taskId, 'taskName': taskName}})
      },
      toSituation(taskId,taskName, startTime, endTime) {
        this.$router.push({name: 'statisticIndex', query: {'taskId': taskId, 'taskName': taskName,'starTime': startTime,'endTime': endTime}})
      },
      completeTask(id){
          if(this.mess.key == 'EXECUTING'){
               this.message("是否确认完成该任务？",id,"");
          }else if(this.mess.key == 'ALREADY_COMPLETED'){
              this.message("是否确认再次启动该任务？",id,'ALREADY_COMPLETED');
          };
      },
      message (str,id,state){
        this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          if(state == 'ALREADY_COMPLETED'){
              api.enable(id).then(result =>{
                  if (!result.status) {
                    this.$message({
                      message: result.message,
                      type: result.level
                    });
                    return;
                  }
                  this.$message({
                    message: '操作已成功!',
                    type: 'success'
                  });
                  this.init(state);
              });
          }else{
              api.complete(id).then(result =>{
                if (!result.status) {
                  this.$message({
                    message: result.message,
                    type: result.level
                  });
                  return;
                }
                 this.$message({
                    message: '操作已成功!',
                    type: 'success'
                  });
                  this.init(state);
              });
          }

        });
      },
      init(state) {
        this.loading=true;
        api.getTaskStates().then(r => {
          this.patternLis = r.data;
          if(state == 'ALREADY_COMPLETED'){
              this.searchMap.state = this.patternLis[1].key;
              this.mess.key = this.patternLis[1].key;
              this.mess.choose = '1';
          }else {
              this.searchMap.state =  this.patternLis[0].key;
              this.mess.key = this.patternLis[0].key;
              this.mess.choose = '0';
          };
          this.getPageData();
        })
      }
    },
    async mounted() {
      if(this.$route.query && this.$route.query.index == "1"){
       await this.init('ALREADY_COMPLETED');
      }else{
       await this.init('');
      }

    },
    data() {
      return {
        searchMap: {
          state: "EXECUTING",
          keyword: "",
          sort: "descending"
        },
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
        loading: false,
      };
    },
  }
</script>

<style scoped lang="sass">
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
</style>
