<template>
  <div v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255, 255, 255, 0.8)" class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>双随机检查记录</span>
    </div>
    <div style="margin-left:20px;margin-top:10px">
      {{$route.query.taskName}}<span style="margin-left: 20px">{{count}}</span>
    </div>
    <div class="ipt-btn-box" >
      <el-input style="vertical-align:top;" placeholder="主体名称" class="w200 mr20 seekIpt" v-model="condition.entityName"
                @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>

      <enum-select  v-model="condition.entityType" placeholder="主体类型" @change="handleIconClick"  enum="com.ybveg.govx.enums.SubTypeEnum"></enum-select>

      <enum-select  v-model="condition.randomResult" placeholder="巡查结果" @change="handleIconClick"  enum="com.ybveg.govx.enums.random.RandomResultEnum"></enum-select>

      <enum-select  v-model="condition.randomTreat" placeholder="处理方式" @change="handleIconClick"  enum="com.ybveg.govx.enums.random.RandomTreatEnum"></enum-select>

      <i :class="down?'el-icon-caret-top':'el-icon-caret-bottom'" class="down" @click="downSeleBox"></i>

      <el-button type="primary" v-if="isAddRecord" @click="goAdd();">添加记录</el-button>
    </div>

    <div :class="down?'tabOffTop170':'tabOffTop120'">
      <el-table :data="tableData" class="table-div" :class="shadowShow?'shadowNo':''" @sort-change="handleSortChange" :key="maxheight" :max-height="maxheight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName"
                         label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="recordNo"
                         label="巡查编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityTypeLabel"
                         label="主体类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="leaderName"
                         label="组长"></el-table-column>
        <el-table-column show-overflow-tooltip prop="members" width="70"
                         label="组员"></el-table-column>
        <el-table-column show-overflow-tooltip prop="randomResultLabel"
                         label="检查结果"></el-table-column>
        <el-table-column show-overflow-tooltip resizable width="90" label="问题项/巡查项">
          <template slot-scope="data">
            <span>{{data.row.quesItem}}/{{data.row.patrolItem}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip width="70" prop="randomTreatLabel"
                         label="处理方式"></el-table-column>
        <el-table-column show-overflow-tooltip prop="createTimeLabel" sortable="custom"
                         label="检查日期"></el-table-column>

        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" @click="goDetail(scope.row.randomRecordId)" class="operate-a">详情</a>
            <a href="javascript:;" class="operate-a" @click="printRecord(scope.row.randomRecordId, true)">打印预览</a>
            <a href="javascript:;" class="operate-a" @click="printRecord(scope.row.randomRecordId, false)">打印</a>
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
    <!-- 打印 -->
    <PrintPatrol ref="PrintPatrol"
                 :basicInfoData="basicInfoDataPrint"
                 :messengers="messengersPrint"
                 :patrolData="patrolDataPrint"
                 :patrolContent="patrolContentPrint"
                 :resultData="resultDataPrint"
                 :qrcodeId="qrcodeId">
    </PrintPatrol>
  </div>
</template>

<script>
  import {taskRecords, taskRecordCount, isAdd } from "api/random/record";
  import EnumSelect from 'components/common/EnumSelect.vue';
  import { calcTableHeight,boxShadow } from 'utils/utils';
  import { doPrintRecord } from 'utils/print/doPrint.js';
  import PrintPatrol from 'views/random/record/PrintPatrol.vue';
  import {getDetails} from "api/random/recordInfo";


  export default {
    components:{
      EnumSelect,PrintPatrol
    },
    async mounted() {
      this.condition.taskId = this.$route.query.taskId;
      this.condition.taskName = this.$route.query.taskName;
      this.condition.groupId = this.$route.query.groupId;
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
          taskId: this.condition.taskId,
          entityName: this.condition.entityName,
          entityType: this.condition.entityType,
          randomResult: this.condition.randomResult,
          randomTreat: this.condition.randomTreat,
          sortType: this.condition.sortType
        }
        taskRecords(this.page.pageSize, this.page.num, formData).then(r => {
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
        taskRecordCount(this.condition.taskId).then(r => {
         this.count = r.data;
        });
        isAdd(this.condition.groupId).then(r => {
          if(r.data > 0){
            this.isAddRecord = true;
          }else{
            this.isAddRecord = false;
          }
        });

      },

      //跳转检查记录添加
      goAdd(randomTaskGroupId) {
        this.$router.push({name: "random.task.record.add", query: {"taskId": this.condition.taskId, "taskName": this.condition.taskName, "randomTaskGroupId": this.condition.groupId}});
      },

      goDetail(randomRecordId) {
        this.$router.push({
          name: 'random.executor.detail',
          query:{
            recordId: randomRecordId,
          }
        })
      },
      //打印
      printRecord(id, isPreview){
        this.loading = true;
        getDetails(id).then(d => {
          this.printInitData(id,d.data);
        });
        setTimeout(() => {
          this.$refs.PrintPatrol.printStyle();
          doPrintRecord(isPreview);
          setTimeout(() => {
            this.loading = false;
          }, 1000)
        }, 2000)
      },
      /* 打印 */
      async printInitData(id,resultData){
        this.qrcodeId = id;
        this.basicInfoDataPrint = resultData.record;
        this.messengersPrint += resultData.names.realName;

        this.patrolDataPrint = JSON.parse(JSON.stringify(this.patrolDataInitPrint));
        this.patrolContentPrint = JSON.parse(JSON.stringify(this.patrolContentInitPrint));
        resultData.listContext.forEach(list => {
          list.content.forEach(content => {
            if(content.important === 'YES') {
              this.patrolDataPrint.important++;
              if(content.qual === 'YES') {
                this.patrolDataPrint.importantQual++;
                this.patrolDataPrint.importantQualStr += content.pno + "." + content.cno + ", ";
              } else {
                this.patrolDataPrint.importantNoQual++;
                let contentItem = {};
                contentItem.no = content.pno + "." + content.cno;
                contentItem.context = content.context;
                contentItem.remark = (content.remark === undefined || content.remark === '')? "无": content.remark;
                this.patrolContentPrint.important.push(contentItem);
              }
            }else {
              this.patrolDataPrint.normal++;
              if(content.qual === 'YES') {
                this.patrolDataPrint.normalQual++;
                this.patrolDataPrint.normalQualStr += content.pno + "." + content.cno + ", ";

              } else {
                this.patrolDataPrint.normalNoQual++;
                let contentItem = {};
                contentItem.no = content.pno + "." + content.cno;
                contentItem.context = content.context;
                contentItem.remark = (content.remark === undefined || content.remark === '')? "无": content.remark;
                this.patrolContentPrint.normal.push(contentItem);
              }
            }
          })
        })
        this.patrolDataPrint.importantQualStr = this.patrolDataPrint.importantQualStr.substr(0, this.patrolDataPrint.importantQualStr.length - 2);
        this.patrolDataPrint.importantQualStr = this.patrolDataPrint.importantQualStr != ''? this.patrolDataPrint.importantQualStr: "无";
        this.patrolDataPrint.normalQualStr = this.patrolDataPrint.normalQualStr.substr(0, this.patrolDataPrint.normalQualStr.length - 2);
        this.patrolDataPrint.normalQualStr = this.patrolDataPrint.normalQualStr != ''? this.patrolDataPrint.normalQualStr: "无";

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
        count: 0,
        isAddRecord: false,
        page: {
          pageSize: 10,
          num: 1,
          total: 0
        },
        condition: {
          entityName: '',
          entityType: '',
          randomResult: '',
          randomTreat: '',
          sortType: 'DESC',
          taskId: '',
          groupId: '',
        },
        mess: {
          choose: 0,
        },
        //列表数据
        tableData: [],
        //打印
        printShow:false,
        qrcodeId: "",
        basicInfoDataPrint: {},
        messengersPrint: "",

        patrolDataPrint: {
          normal: 0,
          normalQual: 0,
          normalNoQual: 0,
          normalQualStr: "",

          important: 0,
          importantQual: 0,
          importantNoQual: 0,
          importantQualStr: "",
        },
        patrolContentPrint: {
          normal: [],
          important: []
        },
        patrolDataInitPrint: {
          normal: 0,
          normalQual: 0,
          normalNoQual: 0,
          normalQualStr: "",

          important: 0,
          importantQual: 0,
          importantNoQual: 0,
          importantQualStr: "",
        },
        patrolContentInitPrint: {
          normal: [],
          important: []
        },
        resultDataPrint: {},
        resultData:{},
        recordDataPrint: {
          serialNumber: 123456789,
        },
        loading: false,
      };
    }
  }
</script>

<style scoped lang="sass">
  .tab-box {
    width: 100%;
    display: flex;
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
