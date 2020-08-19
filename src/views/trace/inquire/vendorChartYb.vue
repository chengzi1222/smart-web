<template>
    <div class="area">
        <div class="page-tilt">
            <b></b><span>配送商溯源监管{{ titl[0]=="-" ? titl :"-"+titl }}</span><Back></Back>
        </div>
        <div class="main_content">
            <!-- 1 -->
           <section class="item1 clear_a">
                <div class="left boxSB">
                    <p class="fs14 col39" >商户基本信息</p>
                    <div class="clear_a panel">
                        <ul class="clear_a fs14" v-if="information">
                           <li><span class="leftName">配送商名称：</span><span class="rightText" :title="information.dlrName">{{information.dlrName}}</span></li>
                           <li><span class="leftName">联系方式：</span><span  class="rightText">{{information.tel}}</span></li>
                           <li><span class="leftName">身份证号：</span><span  class="rightText">{{information.orgCard}}</span></li>
                           <li><span class="leftName">经营地址：</span><span  class="rightText" :title="information.dlrAddr">{{information.dlrAddr}}</span></li>
                           <li><span class="leftName">责任人：</span><span  class="rightText">{{information.legalPerson}}</span></li>
                        </ul>
                    </div>
                </div>
                <div class="right fr boxSB">
                     <p>{{mon}}月溯源平台使用情况</p>
                    <div style="text-align: center;">
                        <p><span style="color:#393939;font-size:36px;">{{rate.cc * 100}}%</span></p>
                        <p>辖区内配送商使用情况排名第{{rate.rownum}}</p>
                    </div>
                </div>
            </section>
            <!-- 3 -->
            <section class="item3 boxSB" style="height: 410px;">
                <p class="fs14 col39 mb20">历史溯源平台使用情况趋势图<el-button class="absolute" style="right: 120px;" type="primary" @click="go">综合查询分析</el-button></p>
                <div style="width:100%;height:350px;margin-top: -20px;" id="his">
                     <div class="partlyLoading"><div>拼命加载中...</div></div>
                </div>
            </section>
            <!-- 7 -->
            <section class="item7">
                <p class="fs14 col39 mb20">溯源检测情况</p>
                <div class="filtrate mb20">
                    <el-date-picker class="sleq w150" type="date" @change="getpatrolTimesClick" v-model="getpatrolTimes" placeholder="起始时间" :picker-options="pickerOptions"></el-date-picker>
                    至
                    <el-date-picker @change="overpatrolTimesClick" v-model="overpatrolTimes" class="slez w150" type="date" placeholder="截止时间" :picker-options="pickerOptions"></el-date-picker>
                    <el-select v-model="type" placeholder="检测结果" class="ml20 w200"  @change="getDlrsy">
                        <el-option
                            v-for="item in options"
                            :key="item.type"
                            :label="item.name"
                            :value="item.type">
                        </el-option>
                    </el-select>
                    <el-input style="margin-left: 20px;" placeholder="商品名"  class="w200 seekIpt"  v-model="subName" @keyup.enter.native ="getDlrsy">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="getDlrsy"></i>
                    </el-input>
                </div>
                <div style="position: relative;">
                    <div v-if="lodings" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;z-index: 99;text-align: center">
                        <div class="partlyLoading loading"><div></div></div>
                    </div>
                    <el-table :data="dataPage3" class="textC table-div pointerTab">
                        <el-table-column show-overflow-tooltip prop="inputTime" min-width="150" label="溯源日期"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="pdtName" min-width="180" label="商品名"></el-table-column>
                        <el-table-column show-overflow-tooltip min-width="180" label="上游信息"  align="left">
                            <template slot-scope="scope">
                                <span v-if="scope.row.lessName">{{scope.row.lessName}}</span>
                                <span v-else>{{scope.row.supplierType}}-{{scope.row.areaName}}-{{scope.row.supplierName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip min-width="100" label="进货票证">
                            <template slot-scope="scope">
                                <a style="color: #1787AD;cursor:pointer" @click="goLook(scope.row.img)" v-if="scope.row.img != ''">查看图片</a>
                                <span style="color: #ccc;" v-else>暂无凭证</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="detecType" min-width="150" label="检测"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="actualVal" min-width="100" label="检测值">
                            <template slot-scope="scope">
                                <span v-if="scope.row.actualVal">{{scope.row.actualVal}}</span>
                                <span v-else>--</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="detecResult" min-width="100" label="检测结果"></el-table-column>
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
            </section>
        </div>
        <!-- 弹框 -->
        <popupBody class="popup-body" v-if="isShow">
                <!-- 功能模块添加到这一区域 -->
                <span @click="isShow = false" style="position: absolute;top: 5px;right: 20px;" class="movePoin">X</span>
                <div style="width:500px;height:500px;">
                    <img v-for="item in image" :src="item" style="width: 200px;height: 200px;margin: 10px 20px">
                </div>
        </popupBody>
    </div>
</template>

<script>
import popupBody from 'components/popup/popupdata';
import Back from 'utils/back';
import echarts from "echarts";
import * as plan from "api/trace/analyzeInfoYb";
export default {
    components:{
        popupBody,
        Back
    },
    methods: {
        goLook(src){//查看图片
          this.image = src.split(",");
          this.image.pop();
          this.isShow = true;
        },
        //商户信息
        getDlrinfo(){
            let obj = {
                'sellerCode':this.bizId
            }
            plan.getDlrinfo(obj).then(d => {
                this.information = d.data;
            })
        },
        //商户信息历史使用率 10 个月
        getDlrhis(){
            let obj = {
                'sellerCode':this.bizId
            }
            plan.getDlrhis(obj).then(d => {
                let hisData=[];
                let hisRate=[];
                for(let i=0;i<d.data.length;i++){
                    hisData.push(d.data[i].month);
                    hisRate.push((d.data[i].cc*100).toFixed(2));
                };
                this.syqkChart.clear();
                let option = {
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter:"{b}<br/><span style='margin-right:5px;background: #92E6FF;display: inline-block;height: 10px;width: 10px;border-radius: 50%'></span>使用率：{c}%"
                    },
                    axisLabel: {
                       interval:0,
                       rotate:40
                    },
                    grid: {
                        left: '1%',
                        right: '1%',
                        bottom: '5%',
                        top:"10%",
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : hisData,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel: {
                                formatter: "{value}%"   // 添加%号
                            },
                        }
                    ],
                    series : [
                        {
                            name:'使用率',
                            type:'bar',
                            barWidth: '60%',
                            data:hisRate
                        }
                    ]
                };
                this.syqkChart.setOption(option);
            })
        },
        //商户信息使用率
        getDlrsy(){
            this.lodings = true;
            let obj = {
                'sellerCode':this.bizId,
                "stTime":this.getpatrolTimes,
                "endTime":this.overpatrolTimes,
                "pdtName":this.subName,
                "detecResult":this.type,
                "pageNumber":this.page.pageNum,
                "pageSize":this.page.pageSize
            }
            plan.getDlrsy(obj).then(d => {
                this.lodings = false;
                this.dataPage3 = d.data;
                this.page.total = d.pageObj.totalRecords
            })
        },
        //商户信息使用率
        getDlrr(){
            let month = new Date();
            this.mon = month.getMonth() +1;
            let monDate = month.getMonth() +1
            if(monDate <9){
                monDate = '0' + monDate
            }
            let obj = {
                'sellerCode':this.bizId,
                "month":month.getFullYear() + '-' + monDate,
            }
            plan.getDlrr(obj).then(d => {
                console.log(d)
                this.rate = d.data;
            })
        },
        overpatrolTimesClick() {
            if(this.overpatrolTimes != null){
                this.getdate(this.overpatrolTimes,'overpatrolTimes');
                this.getDlrsy();
            }
        },
        getpatrolTimesClick() {
          if(this.getpatrolTimes != null){
            this.getdate(this.getpatrolTimes,'getpatrolTimes');
          }
        },
        //  获取时间，默认为当前时间
        getdate(date,obj) {
            let dates =date || new Date();
            let mon = dates.getMonth()  + 1;         //getMonth()返回的是0-11，则需要加1
            if(mon <=9){                                     //如果小于9的话，则需要加上0
                mon = "0" + mon;
            };
            let day = dates.getDate();
            if(day <= 9){
                day = "0" + day;
            }
            if (obj == 'getpatrolTimes') {
                this.getpatrolTimes = dates.getFullYear() + "-" + mon + "-" +  day;
            }else if(obj == 'overpatrolTimes'){
                this.overpatrolTimes = dates.getFullYear() + "-" + mon + "-" +  day;
            } else {
                this.getpatrolTimes = dates.getFullYear() + "-" + mon + "-" +  day;
                this.overpatrolTimes = dates.getFullYear() + "-" + mon + "-" +  day;
                this.getMonths = dates.getFullYear() + "-" + mon;
            }
        },
        //页数改变
        pagecCurrentChange(num) {
            this.page.pageNum = num;
            this.getDlrsy();
        },
        //每页数量改变
        pageSizeChange(size) {
            this.page.pageSize = size;
            this.getDlrsy();
        },
        go(){//点击按钮是综合查询表格
            this.$router.push({name:"yb.analyzeInfo"});
        },
    },
    mounted(){
        this.syqkChart = echarts.init(document.getElementById('his'));
        this.bizId = this.$route.query.areaid;
        this.bizName = this.$route.query.name;
        this.titl = this.$route.query.backtitle + this.$route.query.name;
        this.getdate();
        this.getDlrinfo();
        this.getDlrr();
        this.getDlrhis();
        this.getDlrsy();
    },
    data() {
        return {
            isShow:false,
            range_startTime: null,
            range_endTime: null,
            subName:"",
            type:"",
            mon:'',
            dataPage3:[],
            options: [{
                type:"",
                name:"全部"
            },{
                type:"QUA",
                name:"合格"
            },{
                type:"UNQUA",
                name:"不合格"
            }],
            information:null,
            bizId:"",
            bizName:"",
            titl:"",
            rate:'',
            syqkChart:null,
            getpatrolTimes:null,
            overpatrolTimes:null,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6;
                }
            },
            image:'',
            page: {
                pageSize: 10,
                pageNum: 1,
                total: 0
            },
            lodings:true
        };
    }
}
</script>

<style scoped lang="sass">
    .area{
        background: #edf0f3;
        width:calc(100% + 40px);
        position: relative;
        left: -20px;
    }
    .bigbox{
        position: relative;
    }
    .page-tilt{
        background: #ffffff;
        padding: 12.5px 0 12.5px 20px;
    }
    .main_content{
        padding: 20px;
        width: calc(100% - 40px);
        /*height: 1200px;*/
        height: 100%;
        background-color: #edf0f3;
    }
    .main_content>section{
        background: #fff;
        width: 100%;
        margin-bottom: 20px;
    }
   .item1{
        height: 340px;
        background:transparent !important;
    }
    .item1>.left{
        height:100%;
        width:71%;
        background: #fff;
        margin-right: 20px;
        padding: 20px;

    }
    .item1>.left>.panel>ul{
        height: 200px;
        margin-right: 3%;
        margin-top: 76px;
    }
    .item1>.left>.panel>ul li{
        width: 50%;
        margin-bottom: 30px;
        height: 25px;
        line-height: 25px;
    }
    .item1>.left>.panel>ul li:after{
        content: "";
        clear: both;
        display: block;
        height: 0;
    }
    .item1>.left>.panel>ul li .leftName{
        width: 40%;
        display: block;
        float: left;
        color: #6D7787;
        margin-right: 2%;
        text-align: right;
    }
    .item1>.left>.panel>ul li .rightText{
        width: 58%;
        display: block;
        float: left;
        color: #393939;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
    .item1>.left>.panel>div{
        width: 25%;
        height: 200px;
        margin-top: 50px;
    }
    .item1 .panel>div>div{
        width: 135px;
        height: 135px;
        margin-bottom: 10px;
        background:blueviolet;
    }
    .item1 .panel>div>div img{
        width: 100%;
        height: 100%;
        display: block;
    }
    .item1>.left>.panel>div>p{
         color:  #15BAF3;
         text-align: center;
         width: 135px;
    }
    .item1>.right{
        height:100%;
        width:calc(29% - 20px);
        background: #fff;
        padding: 20px;
    }
    .item1>.right>p{
        color: #393939;
        font-size: 14px;
    }
    .item1>.right>div{
        color: #9199A7;
        font-size: 14px;
        margin-top: 100px;
    }
    .item3{
        width: 100%;
        height: 340px;
        padding: 20px 20px 10px 20px;
    }
    .item7{
        min-height: 288px;padding: 20px;box-sizing: border-box
    }
    .filtrate{
       height: 34px;
    }
    .pagination-box{
        text-align: right;
        margin-top: 10px;
    }
    .loading{
        background:rgba(255,255,255,0.5) !important;
    }
</style>
