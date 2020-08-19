<template>
  <div v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255, 255, 255, 0.8)" class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>{{ taskName }}双随机巡查记录</span>
      <i @click="goBack();" class="icon iconfont icon-back" style="cursor: pointer;
          display: inline-block;
          color: rgb(96, 105, 121);
          height: 22px;
          width: 22px;
          line-height: 22px;">
      </i>
    </div>
    <div class="ipt-btn-box" >
      <el-input style="vertical-align:top;" placeholder="主体名称、巡查人员" class="w200 mr20 seekIpt" v-model="search.select"
                @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>
      <el-cascader class="selectHeight w250" :clearable="true" v-model="entityAreaCodeList"
                   placeholder="所属区域" :change-on-select="true"
                   :options="areaList.options" :props="areaList.props"
                   :show-all-levels="false" @change="handleAreaChange">
      </el-cascader>
      <select-area-grid  class="selectHeight w150"  placeholder="执行机构"  @change="deptChange"></select-area-grid>
      <enum-select  v-model="search.entityType" multiple placeholder="主体类型" @change="handleIconClick"  enum="com.ybveg.govx.enums.SubTypeEnum"></enum-select>
      <i :class="down?'el-icon-caret-top':'el-icon-caret-bottom'" class="down" @click="downSeleBox"></i>
    </div>
    <div  class="ipt-btn-box" style="padding-left: 220px;" v-if="down">
        <enum-select  v-model="search.result" multiple placeholder="巡查结果" @change="handleIconClick"  enum="com.ybveg.govx.enums.random.RandomResultEnum"></enum-select>
        <enum-select  v-model="search.treat" multiple placeholder="处理方式" @change="handleIconClick"  enum="com.ybveg.govx.enums.random.RandomTreatEnum"></enum-select>
    </div>
    <div :class="down?'tabOffTop170':'tabOffTop120'">
      <el-table :data="tableData" class="table-div" :class="shadowShow?'shadowNo':''" @sort-change="handleSortChange" :key="maxheight" :max-height="maxheight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName"
                         label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="recordNo"
                         label="巡查编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityType"
                         label="主体类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="area_name"
                         label="所属区域"></el-table-column>
        <el-table-column show-overflow-tooltip prop="dept_name" width="70"
                         label="执行机构"></el-table-column>
        <el-table-column show-overflow-tooltip prop="leaderName"
                         label="组长"></el-table-column>
        <el-table-column show-overflow-tooltip width="70" prop="messName"
                         label="组员"></el-table-column>
        <el-table-column show-overflow-tooltip width="70" prop="random_result"
                         label="检查结果"></el-table-column>
        <el-table-column show-overflow-tooltip
                         label="问题项/巡查项">
          <template slot-scope="data">
            <span>{{data.row.quesTotal}}/{{data.row.allTotal}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="random_treat"
                         label="处理方式"></el-table-column>
        <el-table-column show-overflow-tooltip prop="randomTime" sortable="custom"
                         label="巡查日期"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" @click="view(scope.row.id)" class="operate-a">详情</a>
            <a href="javascript:;" class="operate-a" @click="printRecord(scope.row.id, true)">打印预览</a>
            <a href="javascript:;" class="operate-a" @click="printRecord(scope.row.id, false)">打印</a>
            <a href="javascript:;" class="operate-a" v-auth="'food.biz.cb,food.biz.pb,food.biz.rb'" @click="$router.push({name: 'subject.archives.detail',params: {type: scope.row.entityTypeEnum}, query: {id: scope.row.entityId}})">主体档案</a>
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
  import { findRandomRecordPage, listTaskArea, findTaskAreaList, getInfo } from "api/random/random";
  import EnumSelect from 'components/common/EnumSelect.vue';
  import SelectAreaGrid from 'components/common/SelectAreaGrid.vue';
  import AreaSelect from 'components/common/AreaSelect.vue'
  import { calcTableHeight,boxShadow } from 'utils/utils';
  import { doPrintRecord } from 'utils/print/doPrint.js';
  import PrintPatrol from 'views/random/record/PrintPatrol.vue';
  import {getDetails} from "api/random/recordInfo";

  export default {
    components:{
      EnumSelect, SelectAreaGrid, AreaSelect,PrintPatrol
    },
    async mounted() {
      this.initdata();
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
      goBack(){
        console.log("back")
        history.back();
      },
      //页面查询
      async getPage() {
        let params = this.search;
        var formData = {
          params: this.search,
          taskId: this.taskId,
          num: this.page.num,
          pageSize: this.page.pageSize,
        }
        findRandomRecordPage(formData).then(r => {
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
      handleAreaChange(){
        this.search.areaCode = this.entityAreaCodeList[this.entityAreaCodeList.length-1]
        this.getPage();
      },
      deptChange(deptId) {
        this.search.deptId = !deptId ? "" : deptId[deptId.length - 1];
        this.getPage();
      },
      //当前年的第一天
      getFirstDayOfYear(date) {
        var currentYear = date.getFullYear();
        return new Date(currentYear, 0, 1);
      },
      async initdata(){
        this.taskId = this.$route.query.taskId
        await getInfo(this.taskId).then(r => {
          this.taskName = r.data.taskName
          this.taskAreaCode = r.data.areaCode
        })
        await findTaskAreaList(this.taskAreaCode).then(result => {
          this.areaList.options = result.data;
        })
      },
      //详情
      view(recordId){
        this.$router.push({
          name: 'random.task.record.detail',
          query:{
            recordId:recordId
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
        taskId: "",
        taskName: "",
        down: true,
        maxheight: 0,
        shadowShow: false,
        taskAreaCode: "",
        page: {
          pageSize: 10,
          num: 1,
          total: 0
        },
        //所属区域下拉列表
        areaList: {
          options: [],
          props: {
            label: 'areaName',
            value: 'areaCode',
            children: "children"
          }
        },
        entityAreaCodeList: [],
        search: {
          select: "",   //搜索
          entityType: [], //主体类型
          result: [], //主体类型
          treat: [], //主体类型
          sortType: "DESC",
          deptId: "",//网格
          areaCode: ""
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
