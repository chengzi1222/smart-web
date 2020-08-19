<template>
  <div v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255, 255, 255, 0.8)" class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>日常监管记录</span>
    </div>
    <div class="ipt-btn-box" >
      <el-input style="vertical-align:top;" placeholder="名称、编号、人员" class="w200 seekIpt" v-model="search.select"
                @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>
      <el-date-picker @change="handleIconClick" class="sleq w150" type="date" value-format="yyyy-MM-dd" v-model="search.startDate" placeholder="起始时间"
                      :picker-options="beforeDate"></el-date-picker>
      至
      <el-date-picker @change="handleIconClick" v-model="search.endDate" class="slez w150"
                      type="date" value-format="yyyy-MM-dd" placeholder="截止时间" :picker-options="afterDate"></el-date-picker>
      <!-- <el-cascader class="selectHeight w150" :clearable="true" placeholder="分管网格"
                     :options="deptsOptions.options" :props="deptsOptions.props"
                     :change-on-select="true"
                     :show-all-levels="false" @change="deptChange">
      </el-cascader> -->

      <select-area-grid  class="selectHeight w150"  placeholder="分管网格"  @change="deptChange"></select-area-grid>

      <enum-select  v-model="search.entityType" multiple placeholder="主体类型" @change="handleIconClick"  enum="com.ybveg.govx.enums.EntityEnum"></enum-select>
      <!-- <i :class="down?'el-icon-caret-top':'el-icon-caret-bottom'" class="down" @click="downSeleBox"></i> -->
      <el-button class="selectHeight floatR" type="primary" v-auth="'food.patrol.record|func.add'"
                 @click="add"><i style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>添加记录
      </el-button>
    </div>
    <div  class="ipt-btn-box" style="margin-left:-20px;" >
        <enum-select  v-model="search.result" multiple placeholder="巡查结果" @change="handleIconClick"  enum="com.ybveg.govx.enums.patrol.RecordResultEnum"></enum-select>
        <enum-select  v-model="search.treat" multiple placeholder="处理方式" @change="handleIconClick"  enum="com.ybveg.govx.enums.patrol.TreatEnum"></enum-select>
        <select-dept-grid  class="selectHeight w150"  placeholder="检查部门"  @change="doDeptChange"></select-dept-grid>
    </div>
    <div class="tabOffTop170">
      <el-table :data="tableData" class="table-div"  :border="true" :resizable="true"  :class="shadowShow?'shadowNo':''" @sort-change="handleSortChange" :key="maxheight">
        <el-table-column type="index"  min-width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName"
                         label="主体名称"   min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="patrolRecordNo"  min-width="90"
                         label="巡查记录编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName"  min-width="100"
                         label="辖区机构"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityTypeLabel"
                         label="主体类型"   min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip  min-width="70" prop="superviseName"
                         label="监管人员"></el-table-column>
        <el-table-column show-overflow-tooltip  min-width="70" prop="messName"
                         label="信息员"></el-table-column>
        <el-table-column show-overflow-tooltip  min-width="70" prop="result"
                         label="巡查结果"></el-table-column>
        <el-table-column show-overflow-tooltip
                         label="问题项/巡查项"  width="70">
          <template slot-scope="data">
            <span>{{data.row.quesTotal}}/{{data.row.allTotal}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="treat"
                         label="处理方式"   min-width="70"></el-table-column>
        <el-table-column show-overflow-tooltip prop="doDeptName"  min-width="100"
                         label="检查部门"></el-table-column>
        <el-table-column show-overflow-tooltip prop="patrolTime" sortable="custom"
                         label="巡查日期"   min-width="70"></el-table-column>
        <el-table-column label="操作"   min-width="150" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" @click="view(scope.row.id)" class="operate-a">详情</a>
            <a href="javascript:;" @click="printRecord(scope.row.id, true)" class="operate-a">打印预览</a>
            <a href="javascript:;" @click="printRecord(scope.row.id, false)" class="operate-a">打印</a>
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

    <!-- 打印组件 -->
    <PrintPatrol ref="PrintPatrol"
      :basicInfoData="basicInfoData"
      :messengers="messengers"
      :patrolData="patrolData"
      :patrolContent="patrolContent"
      :resultData="resultData"
      :patrolType="'日常监督抽查'"
      :qrcodeId="qrcodeId"
    ></PrintPatrol>

  </div>
</template>

<script>
  import {findDailyPage} from "api/patrol/record/record";
  import EnumSelect from 'components/common/EnumSelect.vue';
  import SelectAreaGrid from 'components/common/SelectAreaGrid.vue';
  import SelectDeptGrid from 'components/common/SelectDeptGrid.vue';
  import {boxShadow, calcTableHeight} from 'utils/utils';
  import {doPrintRecord} from 'utils/print/doPrint.js';
  import * as plan from "api/patrol/project";
  import PrintPatrol from './PrintPatrol.vue';

  export default {
    components:{
      EnumSelect, SelectAreaGrid, PrintPatrol,SelectDeptGrid
    },
    async mounted() {
      if(this.$route.query.startTime && this.$route.query.endTime ){
          this.search.startDate=this.$route.query.startTime;
          this.search.endDate=this.$route.query.endTime;
      }
      this.loading=true;
      //分管网格
      this.getPage();
      this.maxheight = calcTableHeight(this.tableHeight,240);
      setTimeout(()=>{
        this.shadowShow = boxShadow(document.getElementsByClassName("el-table")[0].clientWidth,document.getElementsByClassName("el-table__body")[0].clientWidth);
      },0);

    },
    methods: {

      downSeleBox(){
          this.down = !this.down;
          if (this.down) {
            this.maxheight = calcTableHeight(this.tableHeight,240);
          } else{
            this.maxheight = calcTableHeight(this.tableHeight,190);
          }
      },
      add() {
          this.$router.push('/biz/patrol/record/daily/add');
      },
      //页面查询
      async getPage() {
        let params = this.search;
        var formData = {
          params: this.search,
          num: this.page.num,
          pageSize: this.page.pageSize,
        }
        findDailyPage(formData).then(r => {
          this.loading = false;
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
        this.search.sortType = order == 'descending' ? 'DESC' : 'ASC';
        this.getPage();
      },
      deptChange(deptId) {
        this.search.areaCode = !deptId ? "" : deptId[deptId.length - 1];
        this.getPage();
      },
      doDeptChange(deptId) {
        this.search.doDeptId = !deptId ? "" : deptId[deptId.length - 1];
        this.getPage();
      },
      //当前年的第一天
      getFirstDayOfYear(date) {
        var currentYear = date.getFullYear();
        return new Date(currentYear, 0, 1);
      },
      view(recordId){
        this.$router.push({
          name: 'patrol.record.dailyDetail',
          query:{
            recordId:recordId,
            patrolType:"DAILY"
          }
        })
      },

      /* 打印 */
      async printInitData(id, type){
        this.qrcodeId = id;
        await plan.getBasicInfo(id, type).then(d => {
          this.basicInfoData = d.data;
          if (this.basicInfoData.spaceAddr === undefined) {
            this.basicInfoData.spaceAddr = d.data.realityAddr;
          }
          this.messengers = "";
          this.basicInfoData.messengerList.forEach(messenger => {
            this.messengers += messenger.messengerStr + "、 "
          })
          this.messengers = this.messengers.substr(0, this.messengers.length - 2);
          // this.basicInfoData.spaceAddr = this.basicInfoData.realityAddr ? this.basicInfoData.realityAddr : this.basicInfoData.spaceAddr
          this.basicInfoData.spaceAddr = this.basicInfoData.spaceAddr;
        });

        await plan.getPatrolItems(id, type).then(d => {
              this.patrolData = JSON.parse(JSON.stringify(this.patrolDataInit));
              this.patrolContent = JSON.parse(JSON.stringify(this.patrolContentInit));
              //this.patrolData = d.data;
              d.data.forEach(list => {
            list.content.forEach(content => {
              if(content.important === 'YES') {
                this.patrolData.important++;
                if(content.qual === 'YES') {
                  this.patrolData.importantQual++;
                  this.patrolData.importantQualStr += content.pno + "." + content.cno + ", ";
                } else {
                  this.patrolData.importantNoQual++;
                  let contentItem = {};
                  contentItem.no = content.pno + "." + content.cno;
                  contentItem.context = content.context;
                  contentItem.remark = (content.remark === undefined || content.remark === '')? "无": content.remark;
                  this.patrolContent.important.push(contentItem);
                }
              } else {
                this.patrolData.normal++;
                if(content.qual === 'YES') {
                  this.patrolData.normalQual++;
                  this.patrolData.normalQualStr += content.pno + "." + content.cno + ", ";

                } else {
                  this.patrolData.normalNoQual++;
                  let contentItem = {};
                  contentItem.no = content.pno + "." + content.cno;
                  contentItem.context = content.context;
                  contentItem.remark = (content.remark === undefined || content.remark === '')? "无": content.remark;
                  this.patrolContent.normal.push(contentItem);
                }
              }
            })
          })
          this.patrolData.importantQualStr = this.patrolData.importantQualStr.substr(0, this.patrolData.importantQualStr.length - 2);
          this.patrolData.importantQualStr = this.patrolData.importantQualStr != ''? this.patrolData.importantQualStr: "无";

          this.patrolData.normalQualStr = this.patrolData.normalQualStr.substr(0, this.patrolData.normalQualStr.length - 2);
          this.patrolData.normalQualStr = this.patrolData.normalQualStr != ''? this.patrolData.normalQualStr: "无";
        });

        let datas = 'recordId=' + id + '&patrolType=' + type;
        await plan.getPatrolResult(datas).then(d => {
          this.resultData = d.data;
          if(!this.resultData.planName) {
            this.resultData.planName = this.basicInfoData.entityTypeStr + "日常监督检查";
          }
          if(this.resultData.rectifyTime) {
            if(this.resultData.rectifyTime.indexOf(" ") > 0) {
              let rectifyTimeStr = this.resultData.rectifyTime.split(' ')[0];
              let rectifyTimeArr = [];
              if(rectifyTimeStr.indexOf("-") > 0) {
                rectifyTimeArr = rectifyTimeStr.split('-');
              } else if(rectifyTimeStr.indexOf("/") > 0) {
                rectifyTimeArr = rectifyTimeStr.split('/');
              }
              if(rectifyTimeArr != []) {
                this.resultData.rectifyTime = rectifyTimeArr[0] + "年" + rectifyTimeArr[1] + "月" + rectifyTimeArr[2] + "日";
              }
            }
          }
        });
      },

      async printRecord(id, isPreview){
        this.loading = true;
        await this.printInitData(id, "DAILY");
        this.$refs.PrintPatrol.printStyle(id);
        setTimeout(() => {
           doPrintRecord(isPreview);
           setTimeout(() => {
             this.loading = false;
           }, 1000)
         }, 2000)
      }
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
        page: {
          pageSize: 10,
          num: 1,
          total: 0
        },
        search: {
          select: "",   //搜索
          entityType: [], //主体类型
          result: [], //主体类型
          treat: [], //主体类型
          sortType: "DESC",
          areaCode: "",//网格
          doDeptId: "",//执行部门
          startDate: "",
          endDate: ""
        },
        deptsOptions: {
          props: {
            label: 'deptName',
            value: 'areaCode'
          },
          options: []
        },
        mess: {
          choose: 0,
        },
        //下拉表
        subTypeList: [],
        resultList: [],
        treatList: [],
        //列表数据
        tableData: [],
        areaLevel: "",
        patrolTimes: [],

        //打印
        printShow:false,
        qrcodeId: "",
        basicInfoData: {},
        messengers: "",

        patrolData: {
          normal: 0,
          normalQual: 0,
          normalNoQual: 0,
          normalQualStr: "",

          important: 0,
          importantQual: 0,
          importantNoQual: 0,
          importantQualStr: "",
        },
        patrolContent: {
          normal: [],
          important: []
        },
        patrolDataInit: {
          normal: 0,
          normalQual: 0,
          normalNoQual: 0,
          normalQualStr: "",

          important: 0,
          importantQual: 0,
          importantNoQual: 0,
          importantQualStr: "",
        },
        patrolContentInit: {
          normal: [],
          important: []
        },
        resultData: {},
        patrolRecordAddressIsShow: false,
        gross: 0,

        recordData: {
          serialNumber: 123456789,
        },
        loading: false,
        afterDate: {
          disabledDate: (time) => {
            let startDate = new Date(this.search.startDate);
            if(this.search.startDate){
              return time.getTime() < startDate - 8.64e7;
            }
          }
        },
        beforeDate: {
          disabledDate: (time) => {
            let endDate = new Date(this.search.endDate);
            if(this.search.endDate){
              return time.getTime() > endDate;
            }
          }
        },
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
