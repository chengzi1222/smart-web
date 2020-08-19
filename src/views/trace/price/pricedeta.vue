<style scope>
    .r30 .el-table__row td:last-child{
        right: 30px;
    }
    .el-table__expanded-cell{
        padding:0;
    }
    tr.el-table__row:hover{
        background-color: #eef1f6;
    }
</style>
<template>
    <div class="bigbox">
        <div class="page-tilt">
            <b></b><span>预警详情</span><Back></Back>
        </div>
        <h2 class="titName" v-if="this.rourtParams">{{rourtParams.name}} <span>{{rourtParams.date}}</span></h2>
        <div class="num" v-if="this.rourtParams">
            <p><span>价格异常食材数 </span><span>{{rourtParams.num}}</span></p>
            <el-button @click="elseDown" v-if="dataPage && dataPage.length <= 0" class="w65 dc" type="primary">导出</el-button>
            <a :href="derive" v-else class="w65 dc godown" target="_blank" download="filename">导出</a>
        </div><div style="position: relative;">
          <div v-if="lodings" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;z-index: 99;text-align: center;background-color: rgba(0,0,0,.1);">
            <span style="position: absolute;top: 50%;margin-top: -30px;"><i class="icon el-icon-loading" style="font-size: 40px;"></i></span>
          </div>
            <el-table :data="dataPage" class="table-div r30 allDown" v-if="dataPage" @expand-change="echartc">
                <el-table-column show-overflow-tooltip prop="pdtName" label="品种"></el-table-column>
                <el-table-column show-overflow-tooltip label="均价">
                    <template slot-scope="scope">
                        <span>{{scope.row.price}}元/{{scope.row.unit}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="所属价格">
                    <template slot-scope="scope">
                        <span>{{scope.row.orderPrice}}元/{{scope.row.unit}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="偏离">
                    <template slot-scope="scope">
                        <span style="color: #FA503B">{{scope.row.per}}%</span>
                    </template>
                </el-table-column>
                <el-table-column type="expand">
                    <template slot-scope="prop">
                        <div :class="'_' + prop.row.pdtCode" ref="ech" style="width: 100%;height: 295px;"></div>
                        <p class="result">说明<span>{{rourtParams.name}}所购{{prop.row.pdtName}}进价{{prop.row.orderPrice}}元/{{prop.row.unit}}远高于市场平均价，建议对其进货渠道加以核实</span></p>
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
    </div>
</template>

<script>
import * as plan from "api/trace/supervise"
import echarts from "echarts";
import Back from 'utils/back.vue'       //返回上一个页面按钮
import config from "utils/config";

export default {
    methods: {
        //  获取时间，默认为当前时间
        getdate(date) {
            let dates =null;
            if(date == undefined){
                dates =  new Date();
            }else{
                dates =  date;
            }
            let mon = dates.getMonth()  + 1;         //getMonth()返回的是0-11，则需要加1
            if(mon <=9){                                     //如果小于9的话，则需要加上0
                mon = "0" + mon;
            }
            let day = dates.getDate();                   //getdate()返回的是1-31，则不需要加1
            if(day <=9){                                     //如果小于9的话，则需要加上0
                day = "0" + day;
            }
            this.transferData.date = dates.getFullYear() + "-" + mon + "-" +  day;
            this.down();
        },
        //转换参数类型，请求检测批次分页
        gettransferData(){
            this.lodings = true;
            let form = new FormData();
            form.append('pdtCode',this.rourtParams.pdtCode);
            form.append('byGuid',this.rourtParams.byGuid);
            form.append('date',this.rourtParams.date);
            form.append('pageSize',this.page.pageSize);
            form.append('pageNumber',this.page.pageNum);
            plan.postPdtpage(form).then(d => {
                this.lodings = false;
                this.dataPage = d.data;
                this.pageObj = d.pageObj;
                for(var i=0;i<this.dataPage.length;i++){
                    this.details(this.dataPage[i]);
                }
                setTimeout(()=>{
                    let list = document.getElementsByClassName("el-icon");
                    for(var i=0;i<list.length;i++){
                        document.getElementsByClassName("el-icon")[i].classList.remove("el-icon-arrow-right");
                        document.getElementsByClassName("el-icon")[i].classList.add("el-icon-caret-right");
                    }
                },50)
                this.down();
            })
        },
        //页数改变
        pagecCurrentChange(num) {
            this.page.pageNum = num;
            this.gettransferData();
        },
        //每页数量改变
        pageSizeChange(size) {
            this.page.pageSize = size;
            this.gettransferData();
        },
        //改变日期
        singleDate(){
            this.getdate(this.seldate);
            this.gettransferData();
        },
        //转换参数类型，请求检测详情数据
        details(row){
            let form = new FormData();
            form.append('pdtCode',row.pdtCode);
            form.append('date',this.rourtParams.date);
            form.append('byGuid',this.rourtParams.byGuid);
            let txt = '_' + row.pdtCode;
            let nameData = [];
            let numData = [];
            if(this.detailsdata[txt] == undefined){
                plan.postEchart(form).then(d => {
                    for(var i=0;i<d.data.length;i++){
                        nameData.push(d.data[i].buyerName);
                        numData.push(d.data[i].orderPrice);
                    }
                    this.namedata[txt] = nameData;
                    this.numdata[txt] = numData;
                })
            }
            this.down();
        },
        echartc(row){
            setTimeout(()=>{
                if(this.$refs.ech){
                    let clas = '_' + row.pdtCode;
                    let nameData = this.namedata[clas];
                    let numData = this.numdata[clas];
                    var myChart = echarts.init(this.$refs.ech);
                    // 指定图表的配置项和数据
                    var option = {
                        color: ['#3398DB'],
                            tooltip : {
                                trigger: 'axis',
                                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis : [
                                {
                                    type : 'category',
                                    data : nameData,
                                    axisTick: {
                                        alignWithLabel: true
                                    }
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value'
                                }
                            ],
                            series : [
                                {
                                    name:'食材价格（元）',
                                    type:'bar',
                                    barWidth: '60%',
                                    data:numData,
                                    markLine : {
                                        data : [
                                            {type : 'average', name: '平均值'}
                                        ]
                                    }
                                }
                            ]
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                }
            },0)
        },
        elseDown(){
            this.$message({
                message: '暂无数据可导出',
                type: 'warning'
            });
        },
        down(){
             this.derive = encodeURI(config.Derive + 'govapi/price/exportTwo?byGuid=' + this.rourtParams.byGuid + '&date=' + this.rourtParams.date + '&pdtCode=' + this.rourtParams.pdtCode);
        }
    },
    mounted() {
        if (this.$route.query.source == '4k') {
            this.transferData.areaId = '5101'
        } else if(this.$store.state.common.user.areaCode.length <= 4){
            this.transferData.areaId = this.$store.state.common.user.areaCode;
        } else {
            this.transferData.areaId = this.count;
        }
        this.rourtParams.pdtCode = this.$route.query.pdtCode;
        this.rourtParams.byGuid = this.$route.query.byGuid;
        this.rourtParams.date = this.$route.query.date;
        this.rourtParams.name = this.$route.query.name;
        this.page.total = this.$route.query.num -0;
        this.getdate();
        this.seldate = this.transferData.date;
        this.gettransferData();
        this.down();
    },
    computed:{
        count () {
          return this.$store.state.common.user.regionCode
        }
    },
    data() {
        return {
            rourtParams:{},
            seldate:null,
            page: {
                pageSize: 10,
                pageNum: 1,
                total: 0
            },
            transferData:{
                areaId:'510',
                type:'',
                date:null
            },
            dataPage:null,
            detailsdata:{},
            pageObj:null,
            namedata:{},
            numdata:{},
            derive:'',
            lodings:true
        };
    },
    components: {
        Back
    }
}
</script>

<style scoped lang="sass">
    .bigbox{
        position: relative;
    }
    .dc{
        float: right;
    }
    .table-div{
        margin: 20px 0;
        text-align: center;
    }
    .pagination-box {
        text-align: right;
        margin-top: 20px;
    }
    .titName{
        font-size: 20px;
        color: #393939;
        margin:20px 0;
    }
    .titName span{
        font-size: 14px;
        color: #A2AAB6;
        font-weight: 100;
        margin-left: 20px;
    }
    .num{
        font-size: 18px;
        color: #A2AAB6;
        margin-bottom: 20px;
        overflow: hidden;
    }
    .num p{
        float: left;
    }
    .num span:last-child{
        color: #EE6723;
        padding-left: 15px;
    }
    .details{
        display: flex;
    }
    .dataBox{
        width: 50%;
        border-bottom: 1px solid #C2CAD2;
        border-right: 1px solid #C2CAD2;
        padding-top: 20px;
        margin-left: 20px;
        text-align: left;
    }
    .dataBox h2{
        font-size: 16px;
        color: #393939;
        margin-bottom: 15px;
    }
    .dataBox h2 span{
        margin-left: 23px;
        font-size: 14px;
        color: #6D7787;
    }
    .dataBox p{
        font-size: 12px;
        color: #6D7787;
        line-height: 30px;
    }
    .dataBox p:last-child{
        margin-bottom: 15px;
    }
    .dataBox p span{
        width: 150px;
        display: inline-block;
     }
    .state{
        width: 50%;
        border-bottom: 1px solid #C2CAD2;
        padding-top: 20px;
        margin-right: 20px;
    }
    .state h2{
        font-size: 22px;
        margin-top: 25px;
        margin-bottom: 10px;
    }
    .color1{
        color: #0DB5EF;
    }
    .color2{
        color: #FA503B;
    }
    .state p{
        font-size: 14px;
        color: #6D7787;
    }
    .qq{
        border: 4px solid #0DB5EF;
        position: absolute;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        box-sizing: border-box;
        top: 31px;
        left: 50%;
        margin-left: -9px;
        background: #fff;
    }
    .flow{
        margin-bottom: 20px;
    }
    .flow p:first-child{
        font-size: 16px;
        display: flex;
        margin-top: 20px;
        color: #393939;
        justify-content: space-around;
    }
    .flow p:first-child span{
        position: relative;
    }
    .flow p:nth-child(2){
        height: 4px;
        background-color: #0DB5EF;
        margin: 15px auto;
        width: 75%;
    }
    .flow p:last-child{
        display: flex;
        font-size: 12px;
        color: #6D7787;
        justify-content: space-between;
    }
    .flow p:last-child span{
        display: inline-block;
        width: 25%;
    }
    .result {
        text-align: center;
        font-size: 16px;
        color: #393939;
        line-height: 70px;
        margin-bottom: 20px;
    }
    .result span{
        margin-left: 50px;
        font-size: 14px;
        color: #6D7787;
    }
</style>
