<template>
  <div v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255, 255, 255, 0.8)" class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>上级双随机任务</span>
    </div>
    <yuanben-tab :tabs="tabs" label="stateLabel" value="stateKey" num="total" :tab="condition.taskState" @tab-change="choose"></yuanben-tab>
    <div class="ipt-btn-box" >
      <el-input style="vertical-align:top;" placeholder="计划名称" class="w200 mr20 seekIpt" v-model="condition.searchs"
                @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>

      <enum-select  v-model="condition.entityType" placeholder="主体类型" @change="handleIconClick"  enum="com.ybveg.govx.enums.SubTypeEnum"></enum-select>
      <i :class="down?'el-icon-caret-top':'el-icon-caret-bottom'" class="down" @click="downSeleBox"></i>
    </div>

    <div :class="down?'tabOffTop170':'tabOffTop120'">
      <el-table :data="tableData" class="table-div" :class="shadowShow?'shadowNo':''" @sort-change="handleSortChange" :key="maxheight" :max-height="maxheight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="taskName"
                         label="计划名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="startDate"
                         label="开始日期"></el-table-column>
        <el-table-column show-overflow-tooltip prop="endDate"
                         label="结束日期"></el-table-column>
        <el-table-column show-overflow-tooltip prop="areaName" width="70"
                         label="检查区域"></el-table-column>
        <el-table-column show-overflow-tooltip prop="eachGroups"
                         label="监管人数"></el-table-column>
        <el-table-column show-overflow-tooltip width="70" prop="enterpriseGroups"
                         label="主体数"></el-table-column>
        <el-table-column show-overflow-tooltip width="70" prop="entityTypeLabel"
                         label="主体类型"></el-table-column>
        <el-table-column show-overflow-tooltip width="70" prop="alreadyPatrol"
                         label="已巡查主体数"></el-table-column>
        <el-table-column show-overflow-tooltip prop="createTime" sortable="custom"
                         label="制定时间"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" @click="toInfo(scope.row.taskId);" class="operate-a">详情</a>
            <a href="javascript:;" @click="viewRecord(scope.row)" class="operate-a">检查记录</a>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange"
                       @current-change="pageCurrentChange"
                       :current-page="page.num"
                       :page-sizes="[5,8,10,15,20,25,30]"
                       :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="page.total">
        </el-pagination>
      </div>

    </div>
  </div>
</template>

<script>
  import {executantDeptRandomPage, executantDeptRandomCount} from "api/random/random";
  import EnumSelect from 'components/common/EnumSelect.vue';
  import { calcTableHeight,boxShadow } from 'utils/utils';
  import YuanbenTab from 'components/common/YuanbenTab'

  export default {
    components:{
      EnumSelect,
      YuanbenTab
    },
    async mounted() {
      this.initData();
      this.getPage();
      this.maxheight = calcTableHeight(this.tableHeight,240);
      setTimeout(()=>{
        this.shadowShow = boxShadow(document.getElementsByClassName("el-table")[0].clientWidth,document.getElementsByClassName("el-table__body")[0].clientWidth);
      },0);
    },
    methods: {
      choose(state){
        this.condition.taskState = state;
        this.getPage();
      },
      viewRecord(row){
        this.$router.push({name: 'random.executor.record', query:{taskId: row.taskId,taskName: row.taskName, groupId: row.taskGroupId}})
      },
      downSeleBox(){
          this.down = !this.down;
          if (this.down) {
            this.maxheight = calcTableHeight(this.tableHeight,240);
          } else{
            this.maxheight = calcTableHeight(this.tableHeight,190);
          }
      },
      //页面查询
      async getPage() {
        let params = this.search;
        var formData = {
          searchs: this.condition.searchs,
          entityType: this.condition.entityType,
          sortType: this.condition.sortType,
          state: this.condition.taskState,
        }
        this.loading=true;
        executantDeptRandomPage(this.page.pageSize, this.page.num, formData).then(r => {
          this.loading=false;
          this.tableData = r.data.list;
          this.page.total = r.data.total;
        })
      },
      handleIconClick() {
        this.getPage();
      },
      //分页条
      pageCurrentChange(num) {
        this.page.num = num;
        this.getPage();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.getPage();
      },
      // 排序
      handleSortChange({order}) {
        this.condition.sortType = order == 'descending' ? 'DESC' : 'ASC';
        this.getPage();
      },
      async initData(){
        this.loading=true;
        executantDeptRandomCount().then(r => {
         if(r.data && r.data.length > 0){
           this.tabs = r.data;
         }
        })
      },

      //详情
      toInfo (randomTaskId) {
        this.$router.push({name: 'random.task.info', query: {'randomTaskId': randomTaskId, 'showRandom': 'NO'}})
      },
    },
    computed: {
      tableHeight (){
        return this.$store.state.layout.tableHeight;
      },
      tableWidth (){
        return this.$store.state.layout.tableWidth;
      }
    },
    watch:{
      tableHeight(){
        this.maxheight = calcTableHeight(this.tableHeight,240);
      },
      tableWidth(){
        setTimeout(()=>{
          this.shadowShow = boxShadow(document.getElementsByClassName("el-table")[0].clientWidth,document.getElementsByClassName("el-table__body")[0].clientWidth);
        },0)
      }
    },
    data() {
      return {
        down: true,
        maxheight: 0,
        shadowShow: false,
        tabs:[{
          stateLabel: '执行中',
          stateKey: 'EXECUTING',
          total: 0
        },{
          stateLabel: '已完成',
          stateKey: 'ALREADY_COMPLETED',
          total: 0
        }],
        page: {
          pageSize: 10,
          num: 1,
          total: 0
        },
        condition: {
          searchs: '',
          entityType: '',
          sortType: 'DESC',
          taskState: 'EXECUTING',
        },
        mess: {
          choose: 0,
        },
        //列表数据
        tableData: [],
        loading: false,
      };
    }
  }
</script>

<style scoped lang="sass">
  .user-box {
    width: 100%;
    position: relative;
  }

  .li-bott span {
    color: #393939;
  }

  .tab-box .tab-bott {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 2px;
    background: #EBF1F5;
  }
  .down{
      display: inline-block;
      width: 32px;
      height: 32px;
      border: 1px solid #C2CAD2;
      color:  #A2AAB6;
      text-align: center;
      line-height: 32px;
      font-size: 18px;
      margin-left: 20px;
  }
  .ipt-btn-box {
    margin: 20px 0;
    display: flex;
    line-height: 34px;
  }

   .ipt-btn-box button{
      position: absolute;
      right: 40px;
    }
  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;
    font-size: 15px;
    color: #9A9A9A;
    text-align: center;
  }

  .tab-box a {
    color: #9A9A9A;
    width: 100%;
    height: 100%;
    display: inline-block;
  }

  .tab-box a span {
    float: right;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0DB5EF;
    z-index: 666;
    position: relative;
  }

  .li-bott a {
    color: #393939;
  }

  .tab-box {
    width: 100%;
    /*display: flex;*/
    position: relative;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;

    font-size: 15px;
    color: #9A9A9A;
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
    background: #EBF1F5;
  }

  .ipt-btn-box {
    margin: 20px 0;
    /*display: flex;*/
    /*justify-content: space-between;*/
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
    color: #1787AD;
  }

  table tr td:last-child .cell a {
    border-right: 1px solid #ccc;
    padding-right: 5px;
  }

  table tr td:last-child .cell a:last-child {
    border-right: none;
    padding-right: 0px;
  }
  .sleq{
    margin: 0 10px 0 20px;
  }
  .slez{
     margin-left:10px;
  }
  #content{
    margin-top: 100px;
    /* opacity: 0; */
  }
  @media print{
    .cut{
      page-break-after: always;
      padding-bottom:30px;
      min-height:800px;
    }
  }
</style>
