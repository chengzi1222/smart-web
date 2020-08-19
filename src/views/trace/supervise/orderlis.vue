<template>
    <div class="bigbox">
        <div class="page-tilt">
            <b></b><span>订单列表</span><Back></Back>
        </div>
        <p class="titName">今日订单汇总</p>
        <div class="dataBox" v-if="dataLis">
            <div class="variety fle">
                <div class="riBorder">
                    <h3>{{dataLis.pdtNum}}</h3>
                    <p>品种数</p>
                </div>
                <div>
                    <h3>{{dataLis.vegNum}}</h3>
                    <p>蔬菜</p>
                </div>
                <div>
                    <h3>{{dataLis.meatNum}}</h3>
                    <p>肉类</p>
                </div>
                <div>
                    <h3>{{dataLis.otherNum}}</h3>
                    <p>其他</p>
                </div>
            </div>
            <div class="ordernum fle">
                <div>
                    <h3>{{dataLis.orderNum}}</h3>
                    <p>订单数</p>
                </div>
                <div>
                    <h3>{{dataLis.money}}</h3>
                    <p>订单金额</p>
                </div>
            </div>
        </div>
        <div>
            <el-date-picker
              v-model="seldate"
              type="date"
              @change="singleDate()"
              class="datebox w140"
              placeholder="选择日期">
            </el-date-picker>
            <el-input placeholder="请输入配送商、订单编号" class="w260 seekIpt" v-model="subName" @keyup.native ="seekEnter">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="getPageData"></i>
            </el-input>
            <el-button @click="elseDown" v-if="dataPage && dataPage.length <= 0" class="w65 dc" type="primary">导出</el-button>
            <a :href="derive" v-else class="w65 dc godown" target="_blank" download="filename">导出</a>
        </div>
        <div style="position: relative;">
          <div v-if="lodings" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;z-index: 99;text-align: center;background-color: rgba(0,0,0,.1);">
            <span style="position: absolute;top: 50%;margin-top: -30px;"><i class="icon el-icon-loading" style="font-size: 40px;"></i></span>
          </div>
            <el-table :data="dataPage" class="table-div pointerTab" @row-click="go">
                <el-table-column show-overflow-tooltip prop="orderCode" min-width="100" label="订单编号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="dlrName" min-width="100" label="配送商" align="left"></el-table-column>
                <el-table-column show-overflow-tooltip prop="buyerName" min-width="120" label="采购商" align="left"></el-table-column>
                <el-table-column show-overflow-tooltip prop="date" min-width="120" sortable label="配送时间"></el-table-column>
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
            let dates =date || new Date();
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
        //转换参数类型，请求分页数据
        getPageData(){
            this.lodings = true;
            let form = new FormData();
            form.append('guid',this.guid);  //'C538173C9C7B46F188EDE6B29A555FF1');
            form.append('date',this.transferData.date);  //'2017-12-08');
            form.append('dlrName',this.subName);
            form.append('pageSize',this.page.pageSize);
            form.append('pageNumber',this.page.pageNum);
            plan.postOrderPage(form).then(d => {
                this.lodings = false;
                if(d){
                    this.dataPage = d.data;
                    this.page.total = d.pageObj.totalRecords;       
                }else{
                    this.dataPage = [];
                    this.page.total = 0;
                }
                this.down();
            })
        },
        //页数改变
        pagecCurrentChange(num) {
            this.page.pageNum = num;
            this.getPageData();
        },
        //每页数量改变
        pageSizeChange(size) {
            this.page.pageSize = size;
            this.getPageData();
        },
        //改变日期
        singleDate(){
            if (this.seldate) {
                this.getdate(this.seldate);
            } else {
                this.transferData.date = "";
                this.down();
            }
            this.getPageData();
        },
        //搜索框搜索
        seekEnter(_e){
            let event = _e?_e:window.event;
            if(event.keyCode == 13){
                this.getPageData();
            } else{
                this.down();
            }
        },
        go(row){
            sessionStorage.setItem('orderlisDate', this.transferData.date);
            this.$router.push({
                name: 'yb.detaillis',
                query:{
                    Orderguid:row.guid
                }
            })
        },
        elseDown(){
            this.$message({
                message: '暂无数据可导出',
                type: 'warning'
            });
        },
        down(){
            this.derive = encodeURI(config.Derive + 'govapi/sub/exportOrder?guid=' + this.guid + '&date=' + this.transferData.date + '&dlrName=' + this.subName);
        }
    },
    mounted() {
        this.guid = this.$route.query.guid;
        let form = new FormData();
        form.append('guid',this.guid);
        plan.postOrder(form).then(d =>{
            if(d.data){
                this.dataLis = d.data;
            }
        })
        this.getPageData();
        this.down();
    },
    data() {
        return {
            seldate:null,
            page: {
                pageSize: 10,
                pageNum: 1,
                total: 0
            },
            transferData:{
                date:''
            },
            dataLis:null,
            dataPage:null,
            subName:'',
            guid:'',
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
    .titName{
        font-size: 18px;
        color: #393939;
        margin-top: 20px;
    }
    .fle{
        display: flex;
        justify-content: space-between;
        padding: 15px 0;
        box-sizing: border-box;
        border: 1px solid #C2CAD2;        
    }
    .variety{
        width: 63%;
    }
    .variety div{
        width: 25%;
        height: 50px;
    }
    .ordernum{
        width: 35%;
    }
    .ordernum div{
        width: 50%;
    }
    .dataBox{
        display: flex;
        margin: 20px 0 30px;
        justify-content: space-between;
        height: 90px;
    }
    .dataBox div{
        text-align: center;
    }
    .dataBox h3{
        font-size: 28px;
        color: #3B3B3B;
        line-height: 35px;
    }
    .dataBox p{
        font-size: 14px;
        color: #A2AAB6;
    }
    .dc{
        float: right;
    }
    .datebox{
        margin-right: 20px;
    }



    .bigbox{
        position: relative;
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
    .dining{
        width: 60%;
        display: flex;
        justify-content: space-between;
    }
    .dining div{
        border: none;
        width: 33.33%;
    }
    .table-div{
        margin: 20px 0;
        text-align: center;
    }
    .pagination-box {
        text-align: right;
        margin-top: 20px;
    }
    .riBorder{
        border-right: 1px solid #C2CAD2;
    }
</style>