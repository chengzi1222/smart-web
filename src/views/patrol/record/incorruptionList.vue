<template>
  <div v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255, 255, 255, 0.8)" class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>廉洁自律反馈记录</span>
    </div>
    <div class="ipt-btn-box" >
      <el-input style="vertical-align:top;" placeholder="主体名称" class="w200 seekIpt" v-model="search.select"
                @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>
      <span class="ml20">反馈日期：</span>
      <el-date-picker @change="handleIconClick" class="sleq w150" type="date" value-format="yyyy-MM-dd" v-model="search.startDate" placeholder="起始时间"
                      :picker-options="beforeDate"></el-date-picker>
      至
      <el-date-picker @change="handleIconClick" v-model="search.endDate" class="slez w150"
                      type="date" value-format="yyyy-MM-dd" placeholder="截止时间" :picker-options="afterDate"></el-date-picker>
    </div>
    <div style="margin-left:-20px;" >
      <!-- <el-button class="selectHeight mb10" type="primary" v-auth="'food.patrol.record'" @click="batch('export')">批量导出</el-button> -->
      <el-button class="selectHeight mb10" type="primary" v-auth="'food.patrol.record'" @click="batch('print')">批量打印</el-button>
      <el-select v-model="search.workingCondition" class="w180 ml20" placeholder="工作情况" clearable @change="handleIconClick">
        <el-option v-for="(item,index) in workingConditionOpts" :key="index" :label="item.name" :value="item.key"></el-option>
      </el-select>
    </div>
    <div class="tabOffTop170">
      <el-table :data="tableData" class="table-div"  :border="true" :resizable="true"  :class="shadowShow?'shadowNo':''" @selection-change="handleSelectionChange" :row-key="getRowKeys" :key="maxheight">
        <el-table-column type="selection" :reserve-selection="true" min-width="55" fixed="left"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" label="主体名称" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.entityName ? scope.row.entityName : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="address" label="通讯地址" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.address ? scope.row.address: '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="contactPerson" label="联系人" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.contactPerson ? scope.row.contactPerson: '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="contactTel" label="联系电话" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.contactTel ? scope.row.contactTel: '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="infoPerson" label="检查人员" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.infoPerson ? scope.row.infoPerson: '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="workingConditionStr" label="工作情况" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.workingConditionStr ? scope.row.workingConditionStr: '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="createTime" label="反馈日期" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.createTime ? scope.row.createTime: '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"  min-width="150" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" @click="view(scope.row.id, scope.row.recordId)" class="operate-a">详情</a>
            <a href="javascript:;" @click="printRecord(scope.row.id, true)" class="operate-a">打印预览</a>
            <a href="javascript:;" @click="printRecord(scope.row.id, false)" class="operate-a">打印</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange"
                       @current-change="pageCurrentChange"
                       :current-page="page.pageNum"
                       :page-sizes="[5,8,10,15,20,25,30]"
                       :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="page.total">
        </el-pagination>
      </div>
    </div>

    <!-- 打印组件 -->
    <div v-for="(item,index) in recordDataArr" :key="index">
      <PrintIncorruptions ref="PrintIncorruptions" :dataInfo="item"></PrintIncorruptions>
    </div>
    <PrintIncorruption ref="PrintIncorruptionSingle" :dataInfo="recordData"></PrintIncorruption>

  </div>
</template>

<script>
  import {getIncorruptionList, getIncorruptionDetail, bacthExport} from "api/patrol/incorruption/incorruption";
  import EnumSelect from 'components/common/EnumSelect.vue';
  import {boxShadow, calcTableHeight} from 'utils/utils';
  import {doPrintIncorruption} from 'utils/print/doPrint.js';
  import PrintIncorruptions from '../record/printIncorruption.vue';
  import PrintIncorruption from '../record/printIncorruption.vue';
  import qs from 'qs';
  import axios from "axios";

  export default {
    components:{
      EnumSelect, 
      PrintIncorruption,
      PrintIncorruptions
    },
    async mounted() {
      if(this.$route.query.startTime && this.$route.query.endTime ){
        this.search.startDate = this.$route.query.startTime;
        this.search.endDate = this.$route.query.endTime;
      }
      this.loading=true;
      this.getPage();
      this.maxheight = calcTableHeight(this.tableHeight,240);
      setTimeout(()=>{
        this.shadowShow = boxShadow(document.getElementsByClassName("el-table")[0].clientWidth,document.getElementsByClassName("el-table__body")[0].clientWidth);
      },0);

    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 批量导出/打印
      batch(type) {
        if(this.multipleSelection && this.multipleSelection.length > 0) {
          let ids = []
          this.multipleSelection.forEach(item => {
            ids.push(item.id)
          })
          // ids = ["cf1485226e71451595d0ca57acd8c47d", "1ba3702e053043f09b9aeaabf0a234cb", "cf1485226e71451595d0ca57acd8c47d", "1ba3702e053043f09b9aeaabf0a234cb", "cf1485226e71451595d0ca57acd8c47d", "1ba3702e053043f09b9aeaabf0a234cb" , "cf1485226e71451595d0ca57acd8c47d", "1ba3702e053043f09b9aeaabf0a234cb", "cf1485226e71451595d0ca57acd8c47d", "1ba3702e053043f09b9aeaabf0a234cb","cf1485226e71451595d0ca57acd8c47d", "1ba3702e053043f09b9aeaabf0a234cb", "cf1485226e71451595d0ca57acd8c47d", "1ba3702e053043f09b9aeaabf0a234cb", "cf1485226e71451595d0ca57acd8c47d", "1ba3702e053043f09b9aeaabf0a234cb" , "cf1485226e71451595d0ca57acd8c47d", "1ba3702e053043f09b9aeaabf0a234cb", "cf1485226e71451595d0ca57acd8c47d", "1ba3702e053043f09b9aeaabf0a234cb"]

          if(type === 'print') { // 批量打印
            this.printBatch(ids)
          } else { // 批量导出
            bacthExport(ids).then( res=> {
              if(res.status) {
                console.log(res)
              }
            }).catch(err => {})
          }
        } else {
          this.$message.warning(`请先勾选需要${type === 'export' ? "导出" : "打印"}的数据`)
        }
      },
      // 批量打印方法
      async printBatch(ids){
        this.loading = true;
        await this.getPrintData(ids);
        let printDocs = []
        if(this.$refs.PrintIncorruptions && this.$refs.PrintIncorruptions.length > 0) {
          this.$refs.PrintIncorruptions.forEach(item => {
            printDocs.push(item.$el.children[0].children[0].innerHTML)
          })
        }
        setTimeout(() => {
          doPrintIncorruption(true, printDocs);
          setTimeout(() => {
            this.loading = false;
          }, 1000)
        }, 2000)
      },
      // 批量获取打印数据
      async getPrintData(ids) {

        // 请求拿到要批量打印的数据
        let recordDataArr = []
        let questArr = []
        for(let i=0; i<ids.length; i++) {
          questArr.push(this.getDetail(ids[i]))
        }
        await axios.all(
          questArr
        ).then(axios.spread((...res) => {
          res.forEach(itemRes => {
            if(itemRes.status) {
              recordDataArr.push(itemRes.data)
            }
          })
        })).catch(err => {
          console.log(err)
        })
        this.recordDataArr = recordDataArr
      },
      // 获取详情数据
      getDetail(id) {
        return getIncorruptionDetail(qs.stringify({feedbackId: id}))
      },
      //页面查询
      async getPage() {
        let params = this.search;
        let queryParams = {
          startDate: this.search.startDate,
          endDate: this.search.endDate,
          entityName: this.search.select,
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
          workingCondition: this.search.workingCondition
        }
        getIncorruptionList(queryParams).then(r => {
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
        this.page.pageNum = num;
        this.getPage();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.getPage();
      },
      //当前年的第一天
      getFirstDayOfYear(date) {
        var currentYear = date.getFullYear();
        return new Date(currentYear, 0, 1);
      },
      view(feedbackId, recordId){
        this.$router.push({
          name: 'patrol.record.incorruptionDetail',
          query:{
            feedbackId: feedbackId,
            recordId: recordId
          }
        })
      },

      /* 打印 */
      async printInitData(id){
        await this.getDetail(id).then(res => {
          if(res.status) {
            this.recordData = res.data
          }
        }).catch(err => {}) 
      },

      async printRecord(id, isPreview){
        this.loading = true;
        await this.printInitData(id);
        let printDoc = []
        printDoc.push(this.$refs.PrintIncorruptionSingle.$el.children[0].children[0].innerHTML)
        setTimeout(() => {
           doPrintIncorruption(isPreview, printDoc);
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
          pageNum: 1,
          total: 0
        },
        multipleSelection: [],
        // dataLen: null,
        getRowKeys(row) {
          return row.id;
        },
        search: {
          select: "",   //搜索
          startDate: "",
          endDate: "",
          entityName: "",
          workingCondition: ""
        },
        workingConditionOpts: [{
          name: "满意",
          key: "SATISFACTION"
        },{
          name: "不满意",
          key: "DISSATISFIED"
        },{
          name: "基本满意",
          key: "BASICALLYATISFIED"
        }],
        //列表数据
        tableData: [],
        //打印
        printShow:false,
        recordData: {},
        recordDataArr: [],
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
    margin: 0 10px;
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
