<template>
    <div>
        <div class="page-tilt">
            <b></b>
            <span>AI摄像头预警详情</span>
            <back></back>
        </div>
        <div class="user-box">
            <div class="ipt-btn-box" style="justify-content: end;">
                <el-input placeholder="处理人" class="w250 mr20 seekIpt" v-model="tableLimit.keyword"
                    @keyup.enter.native="handleIconClick">
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
                </el-input>
                <el-select class="mr20" v-model="tableLimit.handleStatus" @change="searchTab" placeholder="请选择处理状态"
                    clearable>
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-select class="mr20" v-model="tableLimit.handleType" @change="searchTab" placeholder="请选择处理方式"
                    clearable>
                    <el-option v-for="(value,key) in handleType" :key="value" :label="value" :value="key">
                    </el-option>
                </el-select>
                <el-select class="mr20" v-model="tableLimit.handleDept" @change="searchTab" placeholder="处理部门"
                           clearable>
                    <el-option
                            v-for="item in deptOptionsArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <span class="mr10">预警日期:</span>
                <el-date-picker @change="searchTab" value-format="yyyy-MM-dd" class=" w140 mr10" type="date"
                    v-model="tableLimit.startDate" clearable placeholder="选择开始日期" :picker-options="beforeDate">
                </el-date-picker>
                <span>至</span>
                <el-date-picker @change="searchTab" value-format="yyyy-MM-dd" v-model="tableLimit.endDate"
                    class=" w140 ml10 mr20" type="date" clearable placeholder="选择截止日期" :picker-options="afterDate">
                </el-date-picker>

                <el-checkbox v-model="tableLimit.showOnlyDeductions" @change=searchTab style="line-height:34px;">
                    仅显示扣分项
                </el-checkbox>
            </div>
            <div class="tabOffTop120">
                <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                    :data="tableData" class="table-div" @sort-change="sortChange">
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="pdtName" min-width="190" label="异常类型">
                        <template slot-scope="scope">{{warning[scope.row.type]}}</template>
                    </el-table-column>
                    <el-table-column  prop="screenshotUrl" min-width="100" label="异常截图">
                        <template slot-scope="scope">
                            <el-image style="width: 100px; height: 100px" :src="scope.row.screenshotUrl"
                                :preview-src-list="scope.row.screenshotUrl.split(',')">
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="cameraPosition" min-width="100" label="摄像头点位名称">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="ewDate" min-width="150" label="预警时间" sortable='custom'>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="deduction" min-width="80" label="扣分"></el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100" label="处理状态">
                        <template slot-scope="scope">
                            {{statusOptions_[scope.row.handleStatus]}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="150" label="处理方式">
                        <template slot-scope="scope">
                            {{scope.row.handleType ? handleType[scope.row.handleType] : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100" label="处理部门">
                        <template slot-scope="scope">
                            {{scope.row.handleDept ? deptOptions[scope.row.handleDept] : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100" label="处理人">
                        <template slot-scope="scope">
                            {{scope.row.handlePersonName ? scope.row.handlePersonName : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="150" label="处理时间">
                        <template slot-scope="scope">
                            {{scope.row.handleTime ? scope.row.handleTime : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100" label="处理备注">
                        <template slot-scope="scope">
                            {{scope.row.handleRemark ? scope.row.handleRemark : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column  min-width="120" label="处理附件">
                        <template slot-scope="scope">
                            <div v-if='scope.row.urlList_.length>0'  style="width: 100px; height: 100px" >
                                <el-image style="width: 100px; height: 100px"  :src="scope.row.urlList_[0]"
                                          :preview-src-list="scope.row.urlList_">
                                </el-image>
                            </div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="100" fixed="right">
                        <template slot-scope="scope">
                            <a href="javascript:;" class="operate-a" v-if="scope.row.handlePersonName"
                                @click="disposeReview(scope.row)">重新处理</a>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-box">
                    <el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange"
                        :current-page="tableLimit.current" :page-sizes="[10, 20, 30, 40,50]"
                        :page-size="tableLimit.size" layout="total, sizes, prev, pager, next, jumper"
                        :total="page.total">
                    </el-pagination>
                </div>
                <Dialog :dialogData="dialogData" :url="url" :showTip="disposeAddDialog"
                  v-if="disposeAddDialog" @refresh="refreshData" @cancel="disposeAddDialog = false;" disposeType='01'>
                </Dialog>
            </div>
        </div>
    </div>

</template>

<script>
    import * as guard from "api/xcws/warn/food";
    import {
        getMapping
    } from "../../mapping";
    import Back from "utils/back.vue";
    import config from "utils/config"
    import Dialog from '../disposeDialog'

    export default {
        components: {
            Back,
            Dialog
        },
        data() {
            return {
                page: {
                    total: 0
                },
                schoolTraceBaseUrl:'',
                loading: false,
                disposeAddDialog: false,
                dialogData: [],
                url: '/ewcenter/ewAiCamera/handle',
                dialogData: {
                    entityId: '',
                    id: '',
                    title: '',
                    handlePerson: '',
                    handleRemark: '',
                    deduction: 0,
                    ewType: '',
                    ewDate: ''
                },
                tableData: [],
                tableLimit: {
                    entityId: '',
                    ewType: '',
                    current: 1,
                    endDate: '',
                    handleStatus: '',
                    handleType: '',
                    keyword: '',
                    showOnlyDeductions: false,
                    size: 10,
                    handleDept:'',
                    startDate: '',
                    ewDateOrder: "DESC"
                },
                deptOptionsArr:[],
                deptOptions:getMapping().disposeDept,
                type: getMapping().type,
                handleType: getMapping().handle,
                warning: getMapping().warning,
                statusOptions: [{
                        label: "已处理",
                        value: 1
                    },
                    {
                        label: "未处理",
                        value: 0
                    },
                    {
                        label: "逾期未处理",
                        value: 2
                    }
                ],
                statusOptions_:{
                    '1':'已处理',
                    '0':'未处理',
                    '2':'逾期未处理'
                },
                beforeDate: {
                    disabledDate: (time) => {
                        let endDate = new Date(this.tableLimit.endDate);
                        let date = new Date('2018-12-31');
                        if (this.tableLimit.endDate) {
                            return time.getTime() > endDate || time.getTime() < date || time.getTime() > Date
                            .now() - 8.64e6
                        } else {
                            return time.getTime() < date || time.getTime() > Date.now() - 8.64e6
                        }
                    }
                },
                afterDate: {
                    disabledDate: (time) => {
                        let startDate = new Date(this.tableLimit.startDate);
                        let date = new Date('2018-12-31');
                        if (this.tableLimit.startDate) {
                            return time.getTime() < startDate - 8.64e7 || time.getTime() < date || time.getTime() >
                                Date.now() - 8.64e6;
                        } else {
                            return time.getTime() < date || time.getTime() > Date.now() - 8.64e6
                        }
                    }
                },
            };
        },
        async mounted() {
            this.tableLimit.entityId = this.$route.query.entityId;
            this.tableLimit.ewType = this.$route.query.ewType;
            this.tableLimit.startDate = this.$route.query.ewDate;
            this.tableLimit.endDate = this.$route.query.ewDate;
            this.tableLimit.handleStatus = this.$route.query.handleStatus;
            if (this.$route.query.handleStatus) {
                this.tableLimit.handleStatus = this.$route.query.handleStatus * 1;
            }
            this.schoolTraceBaseUrl = config.schoolTraceBaseUrl;
            this.dataEdit();
            this.searchTab();
        },
        methods: {
            refreshData() {
                this.searchTab();
            },
            dataEdit() {
                this.deptOptionsArr = []
                for(let i in this.deptOptions){
                    this.deptOptionsArr.push({
                        label: this.deptOptions[i],
                        value: i
                    });
                }
            },
            handleIconClick() { //搜索框按钮点击搜索
                this.a = !this.a;
                this.searchTab();
            },
            sortChange(column) {
                if (column.order == "ascending") {
                    this.tableLimit.ewDateOrder = "ASC";
                }
                if (column.order == "descending") {
                    this.tableLimit.ewDateOrder = "DESC";
                }
                this.searchTab();
            },
            // 重新处理
            disposeReview(row) {
              this.dialogData.title = '重新处理'
              this.dialogData.handleRemark = row.handleRemark;
              this.dialogData.handlePersonName = row.handlePersonName;
              this.dialogData.fidList = row.urlList;
              this.dialogData.entityId = this.$route.query.entityId;
              this.dialogData.id = row.id;
              this.dialogData.deduction = row.deduction;
              this.dialogData.defaultDeduction = row.defaultDeduction;
              this.dialogData.ewType = row.type;
              this.dialogData.ewDate = row.ewDate;
              this.dialogData.handleType = row.handleType;
              this.disposeAddDialog = true;
            },
            async searchPage() {
                this.loading = true;
                let result = await guard.getAIDetail(this.tableLimit)
                if (result.status) {
                    this.tableData=[];
                    result.data.records.map(item1=>{
                        if(item1.urlList.length>0){
                            let arr=item1.urlList.map(item =>this.schoolTraceBaseUrl + item.fileUrl)
                            this.$set(item1,'urlList_',arr)
                        }else{
                            this.$set(item1,'urlList_',[])
                        }
                        this.tableData.push(item1)
                    })
                    this.page.total = result.data.total
                } else {
                    this.$message.warning(result.message);
                }
                this.loading = false;
            },
            searchTab() {
                this.tableLimit.current = 1;
                this.searchPage();
            },
            pageCurrentChange(num) {
                this.tableLimit.current = num;
                this.searchPage();
            },
            pageSizeChange(size) {
                this.tableLimit.size = size;
                this.searchPage();
            }
        }
    };
</script>
<style scoped lang="scss">
    .ipt-btn-box {
        margin: 20px 0;
        display: flex;
        justify-content: space-between;

        span {
            line-height: 33px;
        }
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
        color: #1787ad;
    }

    table tr td:last-child .cell a {
        border-right: 1px solid #ccc;
        padding-right: 5px;
    }

    table tr td:last-child .cell a:last-child {
        border-right: none;
        padding-right: 0px;
    }
</style>
