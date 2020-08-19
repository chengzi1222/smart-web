<template>
  <div class="bigbox">
    <div class="page-tilt">
        <b></b><span>索票索证</span>
        <Back></Back>
    </div>
    <div class="selBox">
        <el-input placeholder="商品名称" class="w260 seekIpt mr20" v-model="keyWord" @keyup.enter.native="search">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
        <span>配送日期：</span>
        <el-date-picker v-model="startDate" type="date" placeholder="选择起始日期" class="w160" @change="changeDataPage"
                        :picker-options="beforeDate" value-format="yyyy-MM-dd"></el-date-picker>
        <span class="ml10 mr10">至</span>
        <el-date-picker v-model="endDate" type="date" placeholder="选择截止日期" class="w160" @change="changeDataPage"
                        :picker-options="afterDate" value-format="yyyy-MM-dd"></el-date-picker>
        <span class="ml20">索票索证：</span>
        <el-select v-model="ticketSelcet" clearable placeholder="索证索票" @change="ticketSelChange" class="w120">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <el-button class="ml20 fr" @click="exportData" :loading="exportLoading" type="primary">导出</el-button>
        <p style="margin-top: 20px;">采购商: {{buyerName}}</p>
    </div>
    <div>
      <el-table :data="dataPage" :default-sort = "{prop: 'buyTimeFormat', order: 'descending'}" @sort-change="sortChange" class="table-div r30 allDown movePoin" v-loading="lodings">
        <el-table-column show-overflow-tooltip width="60" label="序号">
          <template slot-scope="scope">
            {{(pageObj.pageSize * (pageObj.pageNum - 1) + scope.$index + 1)}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="realPdtCode" label="商品编码" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.realPdtCode?scope.row.realPdtCode:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="pdtName" label="食品名称" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.pdtName?scope.row.pdtName:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="realWeight" label="进货数量" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.realWeight?scope.row.realWeight:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="realUnit" label="单位" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.realUnit?scope.row.realUnit:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="realSpec" label="规格" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.realSpec?scope.row.realSpec:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column sortable="custom" show-overflow-tooltip prop="buyTimeFormat" label="送货时间" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.buyTimeFormat?scope.row.buyTimeFormat:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="madeDateFormat" label="生产日期" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.madeDateFormat?scope.row.madeDateFormat:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="expiryDateFormat" label="保质期" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.expiryDateFormat?scope.row.expiryDateFormat:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="seller" label="配送商名称" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.seller?scope.row.seller:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="sellerAddr" label="配送商地址" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.sellerAddr?scope.row.sellerAddr:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="sellerTel" label="配送商联系方式" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.sellerTel?scope.row.sellerTel:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="realSourceName" label="配送商进货来源" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.realSourceName?scope.row.realSourceName:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ossTradeCerImg" label="交易凭证" min-width="100">
            <template slot-scope="scope">
                <el-link v-if="scope.row.ossTradeCerImg" @click="openTicketDiaolog(scope.column.label, scope.row.ossTradeCerImg)" type="primary">有</el-link>
                <span v-else>{{'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ossDetecCerImg" label="动检证" min-width="100">
            <template slot-scope="scope">
                <el-link v-if="scope.row.ossDetecCerImg" @click="openTicketDiaolog(scope.column.label, scope.row.ossDetecCerImg)" type="primary">有</el-link>
                <span v-else>{{'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ossSpybCerImg" label="其它票证" min-width="100">
            <template slot-scope="scope">
                <el-link v-if="scope.row.ossSpybCerImg" @click="openTicketDiaolog(scope.column.label, scope.row.ossSpybCerImg)" type="primary">有</el-link>
                <span v-else>{{'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="isCardString" label="索票索证" min-width="100"></el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background :current-page="pageObj.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="pageObj.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="pageObj.totalRecords" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
        </el-pagination>
      </div>
    </div>
    <el-dialog class="dialogDiv" :close-on-click-modal="false" :modal-append-to-body='false' :title="dialogTitle" :visible.sync="ticketDialogVisible">
        <el-image :src="ticketImg" fit="cover"></el-image>
    </el-dialog>
  </div>
</template>

<script>
  import * as ticket from "api/trace/ticket"
  import Back from 'utils/back.vue'       //返回上一个页面按钮
  import config from "utils/config";
  export default {
        data() {
            return {
                keyWord: '',
                startDate: '',
                endDate: '',
                buyerName: '',
                lodings: false,
                ticketSelcet: '',
                options: [
                    {
                        value: '',
                        label: '全部'
                    },{
                        value: '1',
                        label: '有'
                    },{
                        value: '0',
                        label: '无'
                    }
                ],
                exportLoading: false,
                dataPage: [],
                orderBy: 'DESC',
                pageObj: {
                    pageNum: 1,
                    pageSize: 10,
                    totalRecords: 0,
                    totalPages: 0,
                },
                ticketDialogVisible: false,
                dialogTitle:'票证',
                ticketImg: '',
                beforeDate: {
                    disabledDate: (time) => {
                        let before = new Date("2018-01-01") - 8.64e7;
                        let after = new Date();
                        let endDate = new Date(this.endDate);
                        let intervalDate = endDate.getDate();
                        let intervalMonth = endDate.getMonth() + 1 - 3;
                        let intervalYear = endDate.getFullYear();
                        if(intervalMonth < 1) {
                            intervalMonth = intervalMonth + 12;
                            intervalYear = intervalYear - 1;
                        }
                        let interval = new Date(intervalYear + '/' + intervalMonth + '/' + intervalDate + '/08:00:00');
                        if (this.endDate) {
                            return time.getTime() < interval || time.getTime() > endDate || time.getTime() > after || time.getTime() < before;
                        } else {
                            return time.getTime() > after || time.getTime() < before;
                        }
                    }
                },
                afterDate: {
                    disabledDate: (time) => {
                        let before = new Date("2018-01-01") - 8.64e7;
                        let after = new Date();
                        let startDate = new Date(this.startDate);
                        let intervalDate = startDate.getDate();
                        let intervalMonth = startDate.getMonth() + 1 + 3;
                        let intervalYear = startDate.getFullYear();
                        if(intervalMonth > 12) {
                            intervalMonth = intervalMonth - 12;
                            intervalYear = intervalYear + 1;
                        }
                        let interval = new Date(intervalYear + '/' + intervalMonth + '/' + intervalDate + '/08:00:00') - 8.64e7;
                        if (this.startDate) {
                            return time.getTime() > interval || time.getTime() < startDate - 8.64e7 || time.getTime() > after || time.getTime() < before;
                        } else {
                            return time.getTime() > after || time.getTime() < before;
                        }
                    }
                }
            }
        },
        computed: {
            queryParams: function(){
                return {
                    buyerName: this.buyerName,
                    buyerCode: this.$route.query.buyerCode, 
                    pdtName: this.keyWord, 
                    startTime: this.startDate, 
                    endTime: this.endDate, 
                    isCard: this.ticketSelcet,
                    orderBy: this.orderBy,
                    areaId: this.$store.state.common.user.areaCode, 
                    pageNumber: this.pageObj.pageNum, 
                    pageSize: this.pageObj.pageSize 
                }
            }
        },
        methods: {
            // 搜索
            search() {
                this.pageObj.pageNum = 1;
                this.refreshTable();
            },
            // 日期选择
            changeDataPage() {
                this.pageObj.pageNum = 1;
                this.refreshTable();
            },
            // 索证索票筛选
            ticketSelChange(val) {
                this.pageObj.pageNum = 1;
                this.refreshTable();
            },
            // 排序
            sortChange(params) {
                if(params.order !== null) {
                    if(params.order === 'ascending') { // 升序
                        this.orderBy = 'ASC';
                    } else if(params.order === 'descending') { // 降序
                        this.orderBy = 'DESC';
                    } 
                    this.pageObj.pageNum = 1;
                    this.refreshTable();
                }
            },
            // 导出
            exportData() {
                this.exportLoading = true;
                ticket.exportData(this.queryParams).then(r => {
                    if(r.code === 200) {
                        window.open(r.data)
                    } else {
                        this.$message.error(r.msg)
                    }
                    this.exportLoading = false;
                }).catch(e => {
                    console.log(e)
                })
            },
            openTicketDiaolog(label, imgSrc) {
                this.dialogTitle = label;
                this.ticketImg = imgSrc;
                this.ticketDialogVisible = true;
            },
            refreshTable() {
                this.lodings = true;
                ticket.getTicketList(this.queryParams).then(r => {
                    if(r.code === 200) {
                        this.dataPage = r.data;
                        this.pageObj.totalRecords = r.pageObj.totalRecords;
                        this.lodings = false;
                    } else {
                        this.$message.error(r.msg);
                    }
                }).catch(e => {})
            },
            //页数改变
            pagecCurrentChange(num) {
                this.pageObj.pageNum = num;
                this.refreshTable();
            },
            //每页数量改变
            pageSizeChange(size) {
                this.pageObj.pageNum = 1;
                this.pageObj.pageSize = size;
                this.refreshTable();
            }
        },
        mounted() {
            let now = new Date();
            let year = now.getFullYear();
            let month = now.getMonth() + 1;
            let date = now.getDate();
            this.startDate = year + '-' + (month < 10 ? ('0' + month) : month) + '-01';
            this.endDate = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (date < 10 ? ('0' + date) : date);
            this.buyerName = this.$route.query.buyerName;
            this.refreshTable();
        },
        components: {
            Back
        }
    }
</script>

<style scoped lang="sass">
    .bigbox {
        position: relative;
    }
    .selBox {
        margin: 20px 0;
    }
    .table-div {
        margin: 20px 0;
        text-align: center;
    }
    .pagination-box {
        text-align: right;
        margin-top: 20px;
    }
    .dialogDiv {
        text-align:center;
    }
</style>