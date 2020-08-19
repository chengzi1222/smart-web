<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>配送商溯源监管 - 综合查询分析</span><Back></Back>
    </div>
    <ul class="tab-box">
        <li class="tabLi" v-for="(item,index) in patternLis" :data-index="index"
            :class="index==mess.choose?'li-bott':''" @click="choose(index,item.key)">
            <div :data-index='index'>{{item.type}}</div>
        </li>
        <li class="tab-bott"></li>
    </ul>
    <div class="ipt-btn-box" >
      <div class="iptsbox" v-if="tok.length < 8">
        <span>所属区域：</span>
        <el-select class="w150 mr10" @change="areaIdChange" v-model="areaIdNum" placeholder="请选择">
            <el-option
              v-for="item in areaIdLis"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
      </div>
      <div class="iptsbox" v-if="mess.key != 1 && mess.key != 2">
        <span>主体名称：</span>
        <el-input type="text" class="w150 mr10" v-model="bizName" placeholder="请输入主体名称" @keyup.enter.native ="cxClick"></el-input>
      </div>
      <div class="iptsbox" v-if="mess.key == 0 || mess.key == 4">
        <span>溯源日期：</span>
        <el-date-picker class="sleq" type="date" @change="getpatrolTimesClick" v-model="getpatrolTimes" placeholder="起始时间" :picker-options="pickerOptions"></el-date-picker>至<el-date-picker @change="overpatrolTimesClick" v-model="overpatrolTimes" class="slez" type="date" placeholder="截止时间" :picker-options="pickerOptions"></el-date-picker>
      </div>
      <div class="iptsbox" v-if="mess.key != 0 && mess.key != 4">
        <span>日期：</span>
        <el-date-picker style="width: 140px;" type="month" @change="getMonthClick" v-model="getMonths" placeholder="时间" :picker-options="pickerOptions0"></el-date-picker>
      </div>
      <el-button class="w80 ml10" @click="cxClick" type="primary" v-if="mess.key != 1">查询</el-button>
    </div>
    <div style="position: relative;">
      <div v-if="lodings" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;z-index: 99;text-align: center">
        <div class="partlyLoading"><div></div></div>
      </div>
    
      <el-table :data="tableData" class="table-div" :key="mess.choose">
        <el-table-column width="50" label="序号">
          <template slot-scope="scope">
              {{(pageObj.pageSize * (pageObj.pageNumber - 1) + scope.$index + 1)}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="80" prop="areaName" label="所属区域"></el-table-column>
        <el-table-column show-overflow-tooltip prop="sourceType" label="类型" v-if="mess.key == 0"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" prop="sourceName" label="供货商" v-if="mess.key == 0" align="left"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" prop="deptName" label="主体名称" v-if="mess.key != 1 && mess.key != 2" align="left"></el-table-column>
        <el-table-column show-overflow-tooltip prop="pdtName" label="溯源商品" v-if="mess.key == 0" align="left"></el-table-column>
        <el-table-column show-overflow-tooltip prop="pdtName" label="检测品种" v-if="mess.key == 4" align="left"></el-table-column>
        <el-table-column show-overflow-tooltip prop="detecType" label="检测项目" v-if="mess.key == 4"></el-table-column>
        <el-table-column show-overflow-tooltip prop="actualVal" min-width="50" label="检测值" v-if="mess.key == 4"></el-table-column>
        <el-table-column show-overflow-tooltip prop="detecResult" label="检测结果" v-if="mess.key == 4"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" label="溯源率" v-if="mess.key != 0 && mess.key != 4">
          <template slot-scope="scope">
            <span v-if="scope.row.rate">{{scope.row.rate}}%</span>
            <span v-else>0%</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="date" label="检测日期" v-if="mess.key == 4"></el-table-column>
        <el-table-column show-overflow-tooltip prop="date" label="溯源日期" v-if="mess.key == 0"></el-table-column>
        <el-table-column show-overflow-tooltip label="进货票证" v-if="mess.key == 0">
          <template slot-scope="scope">
              <a style="color: #1787AD;cursor:pointer" @click="goLook(scope.row.img)" v-if="scope.row.img != ''">查看图片</a>
              <span style="color: #ccc;" v-else>暂无票证</span>
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
      <!-- 弹框 -->
      <div class="popup-box" v-if="isShow">
        <div class="popup-div">
          <!-- 功能模块添加到这一区域 -->
          <div style="width:500px;height:500px;">
              <img v-for="item in image" :src="item" style="width: 200px;height: 200px;margin: 10px 20px;background-color: #ccc;">
          </div>
          <div style="height:34px;width:62px;margin:20px auto 0;">
              <el-button type="primary"  @click="isShow = false" >关闭</el-button>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import * as plan from "api/trace/analyzeInfoYb";
  import Back from 'utils/back.vue';       //返回上一个页面按钮

  export default {
    components:{
    },
    mounted() {
      //分管网
      if(this.$store.state.common.user.areaCode.length == 4){
        this.areaId = this.$store.state.common.user.regionCode.slice(0,4);
        this.areaIds = this.$store.state.common.user.regionCode.slice(0,4);
        this.tok = this.$store.state.common.user.areaCode.slice(0,4);
      }else{
        this.areaId = this.$store.state.common.user.regionCode;
        this.areaIds = this.$store.state.common.user.regionCode;
        this.tok = this.$store.state.common.user.areaCode;
      }
      this.getdate();
      this.getSuypage();
      this.getArea();
      if(this.tok.length < 8){
        this.patternLis = [{
                  type:'溯源详情查询',
                  key:0
                },{
                  type:'低溯源率区域',
                  key:1
                },{
                  type:'低溯源率主体',
                  key:3
                },{
                  type:'检测不合格详情',
                  key:4
                }]
      }else{
        this.patternLis = [{
                  type:'溯源详情查询',
                  key:0
                },{
                  type:'低溯源率主体',
                  key:3
                },{
                  type:'检测不合格详情',
                  key:4
                }]
      }
    },
    methods: {
      goLook(src){//查看图片
        this.image = src.split(",");
        if (this.image.length > 1) {
          this.image.pop();
        }
        console.log(this.image)
        this.isShow = true;
      },
      //  获取时间，默认为当前时间
      getdate(date,obj) {
        let dates =date|| new Date();
        let mon = dates.getMonth()  + 1;         //getMonth()返回的是0-11，则需要加1
        if(mon <=9){                                     //如果小于9的话，则需要加上0
            mon = "0" + mon;
        }
        let day = dates.getDate();                   //getdate()返回的是1-31，则不需要加1
        if(day <=9){                                     //如果小于9的话，则需要加上0
            day = "0" + day;
        }
        if (obj == 'getpatrolTimes') {
          this.getpatrolTimes = dates.getFullYear() + "-" + mon + "-" +  day;
        }else if(obj == 'overpatrolTimes'){
          this.overpatrolTimes = dates.getFullYear() + "-" + mon + "-" +  day;
        }else if(obj == 'getMonths'){
          this.getMonths = dates.getFullYear() + "-" + mon;
        } else {
          this.getpatrolTimes = dates.getFullYear() + "-" + mon + "-" +  day;
          this.overpatrolTimes = dates.getFullYear() + "-" + mon + "-" +  day;
          this.getMonths = dates.getFullYear() + "-" + mon;
        }
      },
      //切换导航样式
      choose(index,key) {
          this.mess.choose = index;
          this.mess.key = key;
          if(this.$store.state.common.user.areaCode.length == 4){
            this.areaId = this.$store.state.common.user.regionCode.slice(0,4);
            this.areaIds = this.$store.state.common.user.regionCode.slice(0,4);
          }else{
            this.areaId = this.$store.state.common.user.regionCode;
            this.areaIds = this.$store.state.common.user.regionCode;
          }
          this.startDate = "";
          this.endDate = "";
          this.bizName = "";
          this.monthCondition = "";
          this.areaIdNum = "";
          this.getdate(new Date(),'getMonths');
          if (this.mess.key == 0) {
            this.getSuypage();
          } else if (this.mess.key == 1) {
            this.getAreapage();      
          }else if (this.mess.key == 3) {
            this.getSubjectpage();      
          } else if(this.mess.key == 4){
            this.getDetecpage();
          }
          this.getdate();
      },
      //加载所属区域
      getArea() {
        let form = new FormData();
        form.append('areaId',this.areaId);
        form.append('areaIds',this.areaIds);
        plan.getArea(form).then(d => {
          if(d.code != 200){
            this.$message.error(d.code);
          } else if (d.code == 200) {
            this.areaIdLis = d.data;
          }
        })
      },
      //溯源详情查询
      getSuypage() {
        this.lodings = true;
        let form = new FormData();
        form.append('areaId',this.areaId);
        form.append('pageNumber',this.page.num);
        form.append('pageSize',this.page.pageSize);
        form.append('sDate',this.getpatrolTimes);
        form.append('eDate',this.overpatrolTimes);
        form.append('name',this.bizName);
        form.append('areaIds',this.areaIds);
        plan.getSuypage(form).then(d => {
          this.lodings = false;
          if(d.code != 200){
            this.$message.error(d.code);
          } else if (d.code == 200) {
            this.tableData = d.data;
            this.page.total = d.pageObj.totalRecords;
            this.pageObj = d.pageObj;
          }
        })
      },
      //低溯源区县
      getAreapage() {
        this.lodings = true;
        let form = new FormData();
        form.append('areaId',this.areaId);
        form.append('pageNumber',this.page.num);
        form.append('pageSize',this.page.pageSize);
        form.append('date',this.getMonths);
        form.append('areaIds',this.areaIds);
        plan.getAreapage(form).then(d => {
          this.lodings = false;
          if(d.code != 200){
            this.$message.error(d.code);
          } else if (d.code == 200) {
            this.tableData = d.data;
            this.page.total = d.pageObj.totalRecords;
            this.pageObj = d.pageObj;
          }
        })
      },
      //低溯源主体
      getSubjectpage() {
        this.lodings = true;
        let form = new FormData();
        form.append('areaId',this.areaId);
        form.append('pageNumber',this.page.num);
        form.append('pageSize',this.page.pageSize);
        form.append('date',this.getMonths);
        form.append('name',this.bizName);
        form.append('areaIds',this.areaIds);
        plan.getSubjectpage(form).then(d => {
          this.lodings = false;
          if(d.code != 200){
            this.$message.error(d.code);
          } else if (d.code == 200) {
            this.tableData = d.data;
            this.page.total = d.pageObj.totalRecords;
            this.pageObj = d.pageObj;
          }
        })
      },
      //检测不合格
      getDetecpage() {
        this.lodings = true;
        let form = new FormData();
        form.append('areaId',this.areaId);
        form.append('pageNumber',this.page.num);
        form.append('pageSize',this.page.pageSize);
        form.append('sDate',this.getpatrolTimes);
        form.append('eDate',this.overpatrolTimes);
        form.append('name',this.bizName);
        form.append('areaIds',this.areaIds);
        plan.getDetecpage(form).then(d => {
          this.lodings = false;
          if(d.code != 200){
            this.$message.error(d.code);
          } else if (d.code == 200) {
            this.tableData = d.data;
            this.page.total = d.pageObj.totalRecords;
            this.pageObj = d.pageObj;
          }
        })
      },
      overpatrolTimesClick() {
        if(this.overpatrolTimes != null){
          this.getdate(this.overpatrolTimes,'overpatrolTimes');
        }
      },
      getpatrolTimesClick() {
        if(this.getpatrolTimes != null){
          this.getdate(this.getpatrolTimes,'getpatrolTimes');
        }
      },
      getMonthClick() {
        if(this.getMonths != null){
          this.getdate(this.getMonths,'getMonths');
          this.cxClick();
        }
      },
      //分页条
      pageCurrentChange(num) {
        this.page.num = num;
        if (this.mess.key == 0) {
          this.getSuypage();
        } else if (this.mess.key == 1) {
          this.getAreapage();      
        }else if (this.mess.key == 3) {
          this.getSubjectpage(); 
        } else if(this.mess.key == 4){
          this.getDetecpage();
        }
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        if (this.mess.key == 0) {
          this.getSuypage();
        } else if (this.mess.key == 1) {
          this.getAreapage();      
        }else if (this.mess.key == 3) {
          this.getSubjectpage(); 
        } else if(this.mess.key == 4){
          this.getDetecpage();
        }
      },
      areaIdChange(){
        if(this.areaIdNum != ""){
          this.areaId = this.areaIdNum;
        } else{
          this.areaId = this.$store.state.common.user.regionCode
        }
        if (this.mess.key == 0) {
          this.getSuypage();
        } else if (this.mess.key == 1) {
          this.getAreapage();      
        }else if (this.mess.key == 3) {
          this.getSubjectpage();     
        } else if(this.mess.key == 4){
          this.getDetecpage();
        }
      },
      cxClick(){
        if (this.mess.key == 0) {
          this.getSuypage();
        } else if (this.mess.key == 1) {
          this.getAreapage();      
        }else if (this.mess.key == 3) {
          this.getSubjectpage(); 
        } else if(this.mess.key == 4){
          this.getDetecpage();
        }
      }
    },
    data() {
      return {
        area:true,
        bazzar:true,
        main:true,
        date:true,
        areaId:'',
        areaIdNum:'',
        marketId:'',
        bizName:'',
        areaIdLis:null,
        getpatrolTimes:null,
        overpatrolTimes:null,
        getMonths:null,
        tableData:[],
        mess:{
            choose:0,
            key:0
        },
        page: {
          pageSize: 10,
          num: 1,
          total: 0
        },
        patternLis:[],
        pickerOptions: {
            disabledDate(time) {
                return time.getTime() > Date.now() - 8.64e6;
            }
        },
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        pageObj:null,
        tok:'',
        image:'',
        isShow:false,
        lodings:true,
        areaIds:''
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
  .sleq{
    margin-right: 10px;
    width: 140px;
  }
  .slez{
     margin-left:10px;
    width: 140px;
  }
  .iptsbox{
    display: inline-block;
    span{
      font-size: 14px;
    }
  }
  .popup-box{
    position: absolute;
    background: rgba(0,0,0,.5);
    top: 0px;
    bottom:0;
    left:0;
    right:0;
    z-index: 3000;
    overflow: auto;
  }
  .popup-div{
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
.partlyLoading{
  background:rgba(255,255,255,0.5) !important;
}
</style>
