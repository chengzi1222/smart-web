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
            <b></b><span>商品列表</span><Back></Back>
        </div>
        <div class="dateBox">
            <el-date-picker
              v-model="seldate"
              type="date"
              class="w140"
              @change="singleDate()"
              placeholder="选择日期">
            </el-date-picker>
        </div>
        <h2 class="titName" v-if="this.rourtParams">{{rourtParams.name}}</h2>
        <div class="num" v-if="this.rourtParams">
            <p><span v-if="this.rourtParams.type == 'pass'">合格批次</span><span v-if="this.rourtParams.type == 'unPass'">不合格批次</span><span>{{rourtParams.num}}</span></p>
            <el-button @click="elseDown" v-if="dataPage && dataPage.length <= 0" class="w65 dc" type="primary">导出</el-button>
            <a :href="derive" v-else class="w65 dc godown" target="_blank" download="filename">导出</a>
        </div> 
        <div style="position: relative;">
          <div v-if="lodings" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;z-index: 99;text-align: center;background-color: rgba(0,0,0,.1);">
            <span style="position: absolute;top: 50%;margin-top: -30px;"><i class="icon el-icon-loading" style="font-size: 40px;"></i></span>
          </div>
            <el-table :data="dataPage" class="table-div r30 allDown" v-if="dataPage">
                <el-table-column show-overflow-tooltip min-width="50" label="序号">
                    <template slot-scope="scope">
                        {{(pageObj.pageSize * (pageObj.pageNumber - 1) + scope.$index + 1)}}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip  min-width="150" prop="pdtName" label="商品名"></el-table-column>
                <el-table-column show-overflow-tooltip min-width="100" prop="date" label="检测日期"></el-table-column>
                <el-table-column show-overflow-tooltip min-width="100" prop="detecPerson" label="检测人"></el-table-column>
                <el-table-column show-overflow-tooltip min-width="80" label="检测结果">
                    <template slot-scope="scope">
                        <span v-if="scope.row.detecResult == '合格' && cao">(阴性){{scope.row.detecResult}}</span>
                        <span v-if="scope.row.detecResult == '不合格' && cao">(阳性){{scope.row.detecResult}}</span>
                        <span v-if="!cao">{{scope.row.detecResult}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="way"  min-width="80" label="处理结果"></el-table-column>
                <el-table-column type="expand"  min-width="80">
                    <template slot-scope="prop">
                        <div class="details" v-if="detailsdata[prop.row.md5BatNo]">
                            <div class="dataBox">
                                <div v-for="(item,index) in detailsdata[prop.row.md5BatNo]">
                                    <h2 v-if="index == 0">检测详情<span>第1次检测</span></h2>
                                    <h2 v-else><span style="margin-left:0px;">第{{index + 1}}次检测</span></h2>
                                    <p>检测项目：{{item.detecType}}</p>
                                    <p v-if="!cao"><span>标准值： <span class="w150">{{item.standardVal}}</span></span><span>检测值： <span class="w65">{{item.actualVal}}</span></span></p>
                                    <p><span>检测人： <span class="w150">{{item.detecPerson}}</span></span><span>检测时间： <span class="w65">{{item.detecTime}}</span></span></p>
                                </div>
                            </div>
                            <div class="state">
                                <h2 v-if="!cao" :class="prop.row.detecResult == '不合格'?'color2':'color1'">{{prop.row.detecResult}}</h2>
                                <h2 v-if="cao && prop.row.detecResult == '合格'" class="color1">(阴性){{prop.row.detecResult}}</h2>
                                <h2 v-if="cao && prop.row.detecResult == '不合格'" class="color2">(阳性){{prop.row.detecResult}}</h2>
                                <p>检测结果</p>
                            </div>
                        </div>
                        <div class="flow" v-if="detaildata[prop.row.md5BatNo]">
                            <p>
                                <span>供货商<i class="qq"></i></span>
                                <span>配送商<i class="qq"></i></span>
                                <span>农残检测<i class="qq"></i></span>
                                <span>采购商<i class="qq"></i></span>
                            </p>
                            <p></p>
                            <p>
                                <span>{{detaildata[prop.row.md5BatNo].sourceName}}</span>
                                <span>{{detaildata[prop.row.md5BatNo].seller}}</span>
                                <span>{{detaildata[prop.row.md5BatNo].seller}}</span>
                                <span style="display: inline-block;">
                                    <span style="display: inline-block;width: 100%;text-align: center;" v-for="item in detaildata[prop.row.md5BatNo].buyerList">{{item}}</span>
                                </span>
                            </p>
                        </div>
                        <p class="result" v-if="prop.row.detecResult == '合格'">处理结果<span>经检测农药残留低于标准值，农残抑制率达标准备发货。</span></p>
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
            this.rourtParams.date = dates.getFullYear() + "-" + mon + "-" +  day;
            this.down();
        },
        //转换参数类型，请求检测批次分页
        gettransferData(){
            this.lodings = true;
            let form = new FormData();
            form.append('sellerCode',this.rourtParams.sellerCode);
            form.append('type',this.rourtParams.type);
            form.append('date',this.rourtParams.date);
            form.append('pageSize',this.page.pageSize);
            form.append('pageNumber',this.page.pageNum);
            form.append('isSeller',this.transferData.pattern);
            plan.postDetpage(form).then(d => {
                this.lodings = false;
                this.dataPage = d.data;
                console.log('this.dataPage',this.dataPage)
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
            form.append('batNo',row.md5BatNo);
            form.append('isSeller',this.transferData.pattern);
            let txt = row.md5BatNo;
            if(this.detailsdata[txt] == undefined){
                plan.postDetail(form).then(d => {
                    this.detailsdata[txt] = d.data.detec;
                    this.detaildata[txt] = d.data.suy;
                })
            } 
            this.down();
        },
        elseDown(){
            this.$message({
                message: '暂无数据可导出',
                type: 'warning'
            });
        },
        down(){
             this.derive = encodeURI(config.Derive + 'govapi/detec/exportDetail?isSeller=' + this.transferData.pattern + '&type=' + this.rourtParams.type + '&sellerCode=' + this.rourtParams.sellerCode + '&date=' + this.rourtParams.date);
        }
    },
    mounted() {
        if (this.$store.getters.user.realName == "顺点-曹建") {
            this.cao = true;
        }
        if(this.$route.query.source == '4k'){
            this.transferData.areaId = '5101'
        } else if(this.$store.state.common.user.areaCode.length <= 4){
            this.transferData.areaId = this.$store.state.common.user.areaCode;
        } else {
            this.transferData.areaId = this.count;
        }
        this.rourtParams.sellerCode = this.$route.query.sellerCode;
        this.rourtParams.type = this.$route.query.type;
        this.rourtParams.date = this.$route.query.date;
        this.transferData.pattern = this.$route.query.isSeller;
        this.page.total = this.$route.query.num - 0;
        this.seldate = this.$route.query.date;
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
                date:null,
                pattern:''
            },
            dataPage:null,
            detailsdata:{},
            pageObj:null,
            detaildata:{},
            derive:'',
            lodings:true,
            cao:false
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
    .dateBox{
        position: absolute;
        top: 15px;
        right: 0;
        z-index: 666;
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
        color: #0DB5EF;
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
        display: flex;
        flex-wrap: wrap;
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
