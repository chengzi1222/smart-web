<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>新农贸市场溯源监管 - 综合查询分析</span><Back></Back>
    </div>
    <ul class="tab-box">
      <li class="tabLi" v-for="(item,index) in patternLis" :data-index="index" :class="index==mess.choose?'li-bott':''" @click="choose(index,item.key)">
        <div :data-index='index'>{{item.type}}</div>
      </li>
      <li class="tab-bott"></li>
    </ul>
    <div class="ipt-btn-box">
      <div class="iptsbox" v-if="areaIf">
        <span>所属区域：</span>
        <el-select class="w150 mr10" @change="areaIdChange" v-model="areaIdNum" placeholder="请选择">
          <el-option v-for="item in areaIdLis" :key="item.areaCode" :label="item.areaName" :value="item.areaCode">
          </el-option>
        </el-select>
      </div>
      <div class="iptsbox" v-if="mess.key != 1">
        <span>供货市场：</span>
        <el-select class="w150 mr10" @change="cxClick" filterable clearable v-model="marketId" placeholder="请选择">
          <el-option v-for="item in marketIdLis" :key="item.id" :label="item.nodeName" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="iptsbox" v-if="mess.key != 1 && mess.key != 2">
        <span>经营户：</span>
        <el-input type="text" class="w150 mr10" v-model="bizName" placeholder="请输入" @keyup.enter.native="cxClick"></el-input>
      </div>
      <div class="iptsbox" v-if="mess.key == 0">
        <span>溯源日期：</span>
        <el-date-picker class="sleq" type="date" @change="getpatrolTimesClick" v-model="getpatrolTimes" placeholder="起始时间" :picker-options="pickerOptions"></el-date-picker>至
        <el-date-picker
          @change="overpatrolTimesClick" v-model="overpatrolTimes" class="slez" type="date" placeholder="截止时间" :picker-options="pickerOptions"></el-date-picker>
      </div>
      <div class="iptsbox" v-if="mess.key != 0">
        <span>日期：</span>
        <el-date-picker style="width: 140px;" type="month" @change="getMonthClick" v-model="getMonths" placeholder="时间" :picker-options="pickerOptions"></el-date-picker>
      </div>
      <el-button class="w80 ml10" @click="cxClick" type="primary" v-if="mess.key == 0 || mess.key == 3">查询</el-button>
    </div>
    <div style="position: relative;">
      <div v-if="lodings" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;z-index: 99;text-align: center">
        <div class="partlyLoading">
          <div></div>
        </div>
      </div>
      <el-table :data="tableData" class="table-div" :key="mess.choose">
        <el-table-column width="50" label="序号">
          <template slot-scope="scope">
            {{(page.pageSize * (page.num - 1) + scope.$index + 1)}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="80" prop="areaName" label="所属区域"></el-table-column>
        <el-table-column show-overflow-tooltip prop="nodeType" label="类型" v-if="mess.key == 0"></el-table-column>
        <el-table-column show-overflow-tooltip label="供货商户" v-if="mess.key == 0">
          <template slot-scope="scope">
            {{scope.row.sourceBussName?scope.row.sourceBussName:'-'}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="130" label="供货市场" v-if="mess.key == 0" align="left">
          <template slot-scope="scope">
            {{scope.row.sourceNodeName?scope.row.sourceNodeName:'-'}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="130" label="供货市场" v-if="mess.key != 1 && mess.key != 0" align="left">
          <template slot-scope="scope">
            {{scope.row.nodeName?scope.row.nodeName:'-'}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="wholesalerName" label="经营户" v-if="mess.key == 0"></el-table-column>
        <el-table-column show-overflow-tooltip prop="businessName" label="经营户" v-if="mess.key == 3"></el-table-column>
        <el-table-column show-overflow-tooltip prop="goodsName" label="溯源商品" v-if="mess.key == 0" align="left"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" label="溯源率" v-if="mess.key != 0">
          <template slot-scope="scope">
            {{scope.row.trace}}%
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="inTime" label="溯源日期" v-if="mess.key == 0"></el-table-column>
        <el-table-column label="操作" v-if="mess.key == 0">
          <template slot-scope="scope">
            <a style="color: #1787AD;cursor:pointer" @click="goLook(scope.row.fileId)" v-if="scope.row.fileId != ''">查看图片</a>
            <span style="color: #ccc;" v-else>暂无票证</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="page.num" :page-sizes="[5,8,10,15,20,25,30]"
          :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>
    <div class="popup-box" v-if="isShow">
      <div class="popup-div mb20">
        <!-- 功能模块添加到这一区域 -->
        <div style="width:500px;min-height:400px;">
          <img v-for="item in image" :src="item" style="width: 100%;height: 300px;background-color: #ccc;">
        </div>
        <div style="height:34px;width:62px;margin:20px auto 0;">
          <el-button type="primary" @click="isShow = false">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getTraceDetailPaging, getTraceLowAreaPaging, getTraceLowMarketPaging, getTraceLowBussPaging,
           getNodeList, getChildrenAreaFind } from 'api/trace/newfarm'
  import Back from 'utils/back.vue'       //返回上一个页面按钮

  export default {
    mounted() {
      this.getdate(new Date(),'getpatrolTimes');
      this.getdate(new Date(),'overpatrolTimes');
      setTimeout(() => {
        //分管网格
        if (this.$store.state.common.user.areaCode.length == 4) {
          this.areaId = this.$store.state.common.user.areaCode.slice(0, 4);
          this.areaType = this.$store.state.common.user.areaCode.slice(0, 4);
        } else {
          this.areaId = this.$store.state.common.user.areaCode;
          this.areaType = this.$store.state.common.user.areaCode;
        }
        if (this.areaType.length < 8) {
          this.areaIf = true;
        }
        this.getAreaid();
        this.getLoadRetailInitSource();
        this.getLoadRetailMarketInfo();
        if (this.$store.state.common.user.areaCode.length < 8) {
          this.patternLis = [{
            type: '溯源详情查询',
            key: 0
          }, {
            type: '低溯源率区域',
            key: 1
          }, {
            type: '低溯源率市场',
            key: 2
          }, {
            type: '低溯源率主体',
            key: 3
          }]
        } else {
          this.patternLis = [{
            type: '溯源详情查询',
            key: 0
          }, {
            type: '低溯源率市场',
            key: 2
          }, {
            type: '低溯源率主体',
            key: 3
          }]
        }
      }, 2000);
    },
    methods: {
      goLook(src) {//查看图片
        this.image = src;
        this.isShow = true;
      },
      //  获取时间，默认为当前时间
      getdate(date, obj) {
        let dates = date || new Date();
        let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        let day = dates.getDate();
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        };
        if (day <= 9) {                                     //如果小于9的话，则需要加上0
          day = "0" + day;
        };
        if (obj == 'getpatrolTimes') {
          this.getpatrolTimes = dates.getFullYear() + "-" + mon + "-" + day;
        } else if (obj == 'overpatrolTimes') {
          this.overpatrolTimes = dates.getFullYear() + "-" + mon + "-" + day;
        } else if (obj == 'getMonths') {
          this.getMonths = dates.getFullYear() + "-" + mon;
        } else {
          // this.getpatrolTimes = dates.getFullYear() + "-" + mon + "-" + day;
          // this.overpatrolTimes = dates.getFullYear() + "-" + mon + "-" + day;
          this.getMonths = dates.getFullYear() + "-" + mon;
        }
      },
      //切换导航样式
      choose(index, key) {
        this.mess.choose = index;
        this.mess.key = key;
        if (this.$store.state.common.user.areaCode.length == 4) {
          this.areaId = this.$store.state.common.user.areaCode.slice(0, 4);
          this.areaType = this.$store.state.common.user.areaCode;
          this.areaIdNum = this.$store.state.common.user.areaCode.slice(0, 4);
        } else {
          this.areaId = this.$store.state.common.user.areaCode;
          this.areaType = this.$store.state.common.user.areaCode;
          this.areaIdNum = this.$store.state.common.user.areaCode;
        }
        this.startDate = "";
        this.marketId = '';
        this.endDate = "";
        this.bizName = "";
        this.monthCondition = "";
        this.getMonths = "";
        this.page = {
          pageSize: 10,
          num: 1,
          total: 0
        };
        this.tableData = [];
        this.getdate();
        this.getLoadRetailMarketInfo();
        this.cxClick();
      },
      //加载所属区域
      getAreaid() {
        let form = {
          parentCode: this.areaId
        };
        getChildrenAreaFind(form).then(r => {
          if(r.status){
            this.areaIdLis = r.data;
            this.areaIdLis.unshift({
              areaCode: this.areaId,
              areaName: "全部",
            })
          }
        })
      },
      //加载市场名称
      getLoadRetailMarketInfo() {
        this.marketId = "";
        let form = {
          areaCode: this.areaId,
          nodeType: 'FARMER'
        };
        getNodeList(form).then(r => {
          if (r.status) {
            this.marketIdLis = r.data;
          }
        })
      },
      //溯源详情查询
      getLoadRetailInitSource() {
        this.tableData = [];
        this.lodings = true;
        let form = {
          nodeId: this.marketId,
          pageNum: this.page.num,
          pageSize: this.page.pageSize,
          areaCode: this.areaId,
          bussName: this.bizName,
          endDate: this.overpatrolTimes,
          startDate: this.getpatrolTimes,
          nodeType: 'FARMER'
        };
        getTraceDetailPaging(form).then(r => {
          this.lodings = false;
          if(r.status){
            this.tableData = r.data.list;
            this.page.total = r.data.total;
          }
        })
      },
      //低溯源区域
      getLoadLowSourceArea() {
        this.tableData = [];
        this.lodings = true;
        let form = {
          areaCode: this.areaId,
          pageNum: this.page.num,
          pageSize: this.page.pageSize,
          date: this.getMonths + '-01',
          nodeType: 'FARMER'
        };
        getTraceLowAreaPaging(form).then(r => {
          this.lodings = false;
          if(r.status){
            this.tableData = r.data.list;
            this.page.total = r.data.total;
          }
        })
      },
      // 低溯源率市场
      getLoadLowSourceMarket() {
        this.tableData = [];
        this.lodings = true;
        let form = {
          areaCode: this.areaId,
          pageNum: this.page.num,
          pageSize: this.page.pageSize,
          bussName: this.bizName,
          nodeType: 'FARMER',
          nodeId: this.marketId,
          date: this.getMonths + '-01'
        };
        getTraceLowMarketPaging(form).then(r => {
          this.lodings = false;
          if(r.status){
            this.tableData = r.data.list;
            this.page.total = r.data.total;
          }
        })
      },
      //低溯源主体
      getLoadLowSourceBiz() {
        this.tableData = [];
        this.lodings = true;
        let form = {
          areaCode: this.areaId,
          pageNum: this.page.num,
          pageSize: this.page.pageSize,
          bussName: this.bizName,
          nodeType: 'FARMER',
          date: this.getMonths + '-01',
          nodeId: this.marketId
        };
        getTraceLowBussPaging(form).then(r => {
          this.lodings = false;
          if (r.status) {
            this.tableData = r.data.list;
            this.page.total = r.data.total;
          }
        })
      },
      overpatrolTimesClick() {
        this.getdate(this.overpatrolTimes, 'overpatrolTimes');
      },
      getpatrolTimesClick() {
        this.getdate(this.getpatrolTimes, 'getpatrolTimes');
      },
      //分页条
      pageCurrentChange(num) {
        this.page.num = num;
        if (this.mess.key == 0) {
          this.getLoadRetailInitSource();
        } else if (this.mess.key == 1) {
          this.getLoadLowSourceArea();
        } else if (this.mess.key == 2) {
          this.getLoadLowSourceMarket();
        } else if (this.mess.key == 3) {
          this.getLoadLowSourceBiz();
        }
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        if (this.mess.key == 0) {
          this.getLoadRetailInitSource();
        } else if (this.mess.key == 1) {
          this.getLoadLowSourceArea();
        } else if (this.mess.key == 2) {
          this.getLoadLowSourceMarket();
        } else if (this.mess.key == 3) {
          this.getLoadLowSourceBiz();
        }
      },
      areaIdChange() {
        this.areaId = this.areaIdNum;
        this.cxClick();
        this.getLoadRetailMarketInfo();
      },
      cxClick() {
        this.page.num = 1;
        if (this.mess.key == 0) {
          this.getLoadRetailInitSource();
        } else if (this.mess.key == 1) {
          this.getLoadLowSourceArea();
        } else if (this.mess.key == 2) {
          this.getLoadLowSourceMarket();
        } else if (this.mess.key == 3) {
          this.getLoadLowSourceBiz();
        }
      },
      getMonthClick() {
        if (this.getMonths.getMonth) {
          this.getdate(this.getMonths, 'getMonths');
          this.cxClick();
        }
      },
    },
    data() {
      return {
        area: true,
        bazzar: true,
        main: true,
        date: true,
        areaId: '',
        areaIdNum: '',
        marketId: '',
        bizName: '',
        marketIdLis: [],
        getMonths: null,
        areaIdLis: [],
        getpatrolTimes: null,
        overpatrolTimes: null,
        tableData: [],
        mess: {
          choose: 0,
          key: 0
        },
        page: {
          pageSize: 10,
          num: 1,
          total: 0
        },
        patternLis: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6;
          }
        },
        image: [],
        isShow: false,
        lodings: true,
        areaType: '',
        areaIf: false
      }
    },
    components: {
      Back
    }
  }
</script>

<style scoped lang="sass">
  .ipt-btn-box {
    margin: 20px 0;
  }

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

  .sleq {
    margin-right: 10px;
    width: 140px;
  }

  .slez {
    margin-left: 10px;
    width: 140px;
  }

  .iptsbox {
    display: inline-block;
    span {
      font-size: 14px;
    }
  }

  .popup-box {
    position: absolute;
    background: rgba(0, 0, 0, .5);
    top: 0px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3000;
    overflow: auto;
  }

  .popup-div {
    border: 1px solid #ccc;
    position: absolute;
    background: #fff;
    min-width: 500px;
    box-sizing: border-box;
    padding: 30px 40px;
    left: 50%;
    margin-left: -325px;
    top: 80px;
  }

  .partlyLoading {
    background: rgba(255, 255, 255, 0.5) !important;
  }
</style>