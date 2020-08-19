<template>
    <div class="bigbox">
        <div class="page-tilt">
            <b></b><span>价格预警</span>
        </div>
        <div class="dateBox">
            <el-date-picker v-model="seldate" type="date" class="w140" @change="singleDate()" placeholder="选择日期">
            </el-date-picker>
        </div>
        <div class="num">
            <h2 class="titName">价格异常食材数：<span>{{pdts}}</span></h2>
            <el-button @click="elseDown" v-if="dataPage && dataPage.length <= 0" class="w65 dc" type="primary">导出</el-button>
            <a :href="derive" v-else class="w65 dc godown" target="_blank" download="filename">导出</a>
        </div>
        <div style="position: relative;">
            <div v-if="lodings" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;z-index: 99;text-align: center;background-color: rgba(0,0,0,.1);">
                <span style="position: absolute;top: 50%;margin-top: -30px;"><i class="icon el-icon-loading" style="font-size: 40px;"></i></span>
            </div>
            <el-table :data="dataPage" class="table-div pointerTab" v-if="dataPage" @row-click="go">
                <el-table-column show-overflow-tooltip min-width="50" label="序号">
                    <template slot-scope="scope">
                        {{(pageObj.pageSize * (pageObj.pageNumber - 1) + scope.$index + 1)}}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="buyerName" label="采购商" align="left"></el-table-column>
                <el-table-column show-overflow-tooltip prop="legalPerson" label="责任人"></el-table-column>
                <el-table-column show-overflow-tooltip prop="tel" label="手机号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="num" label="预警数"></el-table-column>
            </el-table>
            <div class="pagination-box">
                <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
                    :total="page.total" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import * as plan from "api/trace/supervise"
    import config from "utils/config";
    export default {
        methods: {
            //  获取时间，默认为当前时间
            getdate(date) {
                let dates = date || new Date();
                let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
                if (mon <= 9) {                                     //如果小于9的话，则需要加上0
                    mon = "0" + mon;
                }
                let day = dates.getDate();                   //getdate()返回的是1-31，则不需要加1
                if (day <= 9) {                                     //如果小于9的话，则需要加上0
                    day = "0" + day;
                }
                this.transferData.date = dates.getFullYear() + "-" + mon + "-" + day;
                this.down();
            },
            //获取价格预警异常总数
            getPdts() {
                let form = new FormData();
                form.append('areaId', this.transferData.areaId);
                form.append('date', this.transferData.date);
                plan.postPdts(form).then(d => {
                    this.pdts = d.data;
                    this.down();
                })
            },
            //转换参数类型，请求检测批次分页
            gettransferData() {
                this.lodings = true;
                let form = new FormData();
                form.append('areaId', this.transferData.areaId);
                form.append('date', this.transferData.date);
                form.append('pageSize', this.page.pageSize);
                form.append('pageNumber', this.page.pageNum);
                plan.postBuyerpage(form).then(d => {
                    this.lodings = false;
                    this.dataPage = d.data;
                    this.pageObj = d.pageObj;
                    this.page.total = d.pageObj.totalRecords;
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
            singleDate() {
                this.getdate(this.seldate);
                this.getPdts();
                this.gettransferData();
            },
            go(row) {
                sessionStorage.setItem('priceDate', this.transferData.date);
                this.$router.push({
                    name: 'yb.pricedeta',
                    query: {
                        pdtCode: row.pdtCode,
                        byGuid: row.guid,
                        date: this.transferData.date,
                        num: row.num,
                        name: row.buyerName
                    }
                })
            },
            elseDown() {
                this.$message({
                    message: '暂无数据可导出',
                    type: 'warning'
                });
            },
            down() {
                this.derive = encodeURI(config.Derive + 'govapi/price/exportOne?areaId=' + this.transferData.areaId + '&date=' + this.transferData.date);
            }
        },
        mounted() {
            if (this.$route.query.source == '4k') {
                this.transferData.areaId = '5101'
            } else if (this.$store.state.common.user.areaCode.length <= 4) {
                this.transferData.areaId = this.$store.state.common.user.areaCode;
            } else {
                this.transferData.areaId = this.count;
            }

            if (sessionStorage.getItem('priceDate')) {
                this.seldate = sessionStorage.getItem('priceDate');
                this.transferData.date = sessionStorage.getItem('priceDate');
            } else {
                this.getdate();
                this.seldate = this.transferData.date;
            }
            this.getPdts();
            this.gettransferData();
            this.down();
        },
        computed: {
            count() {
                return this.$store.state.common.user.regionCode
            }
        },
        data() {
            return {
                seldate: null,
                pdts: 0,
                page: {
                    pageSize: 10,
                    pageNum: 1,
                    total: 0
                },
                transferData: {
                    areaId: '510',
                    type: '',
                    date: null
                },
                dataPage: null,
                pageObj: null,
                derive: '',
                lodings: true
            };
        },
        components: {

        }
    }
</script>

<style scoped lang="sass">
    .bigbox {
        position: relative;
    }

    .dateBox {
        position: absolute;
        top: 15px;
        right: 0;
        z-index: 666;
    }

    .dc {
        float: right;
    }

    .table-div {
        margin: 20px 0;
        text-align: center;
    }

    .pagination-box {
        text-align: right;
        margin-top: 20px;
    }

    .titName {
        font-size: 20px;
        color: #393939;
        float: left;
    }

    .num {
        font-size: 20px;
        color: #393939;
        margin-bottom: 20px;
        overflow: hidden;
        margin-top: 30px;
    }

    .num span:last-child {
        color: #ee6723;
        padding-left: 15px;
    }
</style>