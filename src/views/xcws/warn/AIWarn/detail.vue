<template>
    <div>
        <div class="page-tilt">
            <b></b>
            <span>AI摄像头预警列表</span>
            <back></back>
            <el-button v-if='detailData.togId' class="w140 ml20" type="default"
               @click="$router.push({ path: '/camera/detail',
                query: {id:detailData.togId,cameraType:'AI'}})" >
            摄像头直播</el-button>
            <el-button v-if='detailData.togId'  class="w140" type="default"  @click="$router.push({ name: 'AICamera.AIScreen',
                query: {name:detailData.buyerName,entityId:detailData.togId,index:0}})">AI直播</el-button>
        </div>
        <div class="page-card mb20 mt20 clear_a">
            <ul class="mr20 clear_a">
                <li class="textell"><span>主体名称：</span>
                    <el-tooltip class="item" effect="dark" :content="detailData.buyerName" placement="top-start">
                        <span class="text longText">{{detailData.buyerName}}</span>
                    </el-tooltip>
                </li>
                <li class="textell"><span>主体类型：</span>
                    <span class="text">{{type[detailData.buyerType]}}</span>
                </li>
                <li class="textell"><span>负责人：</span>
                    <el-tooltip class="item" effect="dark" :content="detailData.legalPerson" placement="top-start">
                        <span class="text">{{detailData.legalPerson}}</span>
                    </el-tooltip>
                </li>
                <li class="textell"><span>联系方式：</span>
                    <el-tooltip class="item" effect="dark" :content="detailData.tel" placement="top-start">
                        <span class="text">{{detailData.tel}}</span>
                    </el-tooltip>
                </li>
                <li class="textell"><span>所属辖区：</span>
                    <el-tooltip class="item" effect="dark" :content="detailData.areaName" placement="top-start">
                        <span class="text">{{detailData.areaName}}</span>
                    </el-tooltip>
                </li>
                <li class="textell" v-if="detailData.scType !== null && detailData.scType !== ''">
                    <span>主体细类：</span><span class="text">{{detailData.scType == 'PUBLIC'? '公立':'私立'}}</span>
                </li>
                <li><span>详细地址：</span>
                    <el-tooltip class="item" effect="dark" :content="detailData.address" placement="top-start">
                        <span class="text">{{detailData.address}}</span>
                    </el-tooltip>
                </li>
            </ul>
            <div class="clear_a">
                <div>
                    <p class="number">{{detailData.ewProcessedNum}}</p>
                    <p class="text">已经处理预警数</p>
                </div>
                <div>
                    <p class="number">{{detailData.ewCurrentNum}}</p>
                    <p class="text">当前预警数</p>
                </div>
            </div>
            <div class="clear_a">
                <div>
                    <p class="number">{{detailData.deduction}}</p>
                    <p class="text">当前总扣分</p>
                </div>
                <div>
                    <p class="number">{{detailData.deductionLimit}}</p>
                    <p class="text">扣分上限</p>
                </div>
                <div>
                    <p class="number">{{detailData.actualDeduction}}</p>
                    <p class="text">实际总扣分</p>
                </div>
            </div>
        </div>
        <div class="user-box">
            <div class="ipt-btn-box" style="justify-content: end;">
                <!-- <el-input placeholder="处理人" class="w250 mr20 seekIpt" v-model="tableLimit.keyword"
                    @keyup.enter.native="handleIconClick">
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
                </el-input> -->
                <el-select class="mr20" v-model="tableLimit.handleStatus" @change="searchTab" placeholder="请选择处理状态"
                    clearable>
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-select class="mr20" v-model="tableLimit.ewType" @change="searchTab" placeholder="请选择异常类型" clearable>
                    <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
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
                    <el-table-column show-overflow-tooltip prop="pdtName" min-width="100" label="异常类型">
                        <template slot-scope="scope">{{warning[scope.row.type]}}</template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="ewNum" min-width="80" label="预警数"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="deduction" min-width="80" label="扣分"></el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100" label="处理状态">
                        <template slot-scope="scope">{{statusOptions_[scope.row.handleStatus]}}</template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="ewDate" min-width="180" label="预警日期" sortable="custom"></el-table-column>
                    <el-table-column label="操作" min-width="150" fixed="right">
                        <template slot-scope="scope">
                            <a href="javascript:;" class="operate-a" v-if="scope.row.handleStatus != '1'"
                                @click="dispose(scope.row)">处理</a>
                            <!-- <a href="javascript:;" class="operate-a" v-if="scope.row.handlePersonName"
                                @click="dispose('review',scope.row)">重新处理</a> -->
                            <a href="javascript:;" class="operate-a"
                                @click="view(scope.row)">详情</a>
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
            </div>
        </div>
        <Dialog :dialogData="dialogData" :url="url" :showTip="disposeAddDialog"
            v-if="disposeAddDialog" @refresh="refreshData" @cancel="closeDialog" disposeType='01'>
        </Dialog>
    </div>

</template>

<script>
    import * as guard from "api/xcws/warn/food";
    import {
        getMapping
    } from "../../mapping";
    import Dialog from '../disposeDialog'
    import Back from "utils/back.vue";
    import config from "utils/config"

    export default {
        components: {
            Dialog,
            Back
        },
        data() {
            return {
                url: '/ewcenter/ewAiCamera/batch/handle',
                page: {
                    total: 0
                },
                dialogData: {
                    entityId: '',
                    title: '',
                    handlePerson: '',
                    handleRemark: '',
                    deduction: 0,
                    ewType: '',
                    ewDate: ''
                },
                disposeAddDialog: false,
                loading: false,
                tableData: [],
                detailData: {},
                queryLimit: {
                    entityId: '',
                    ewType: 'AI_CAMERA'
                },
                tableLimit: {
                    entityId: '',
                    ewType: '',
                    current: 1,
                    endDate: '',
                    handleStatus: '',
                    keyword: '',
                    showOnlyDeductions: false,
                    size: 10,
                    startDate: '',
                    ewDateOrder: "DESC"
                },
                type: getMapping().type,
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
                typeOptions: [{
                        label: "无帽子",
                        value: '020201'
                    },
                    {
                        label: "无手套",
                        value: '020202'
                    },
                    {
                        label: '无口罩',
                        value: '020203'
                    },
                    {
                        label: '玩手机',
                        value: '020204'
                    },
                    {
                        label: '老鼠',
                        value: '020205'
                    },
                    {
                        label: '抽烟',
                        value: '020206'
                    },
                    {
                        label: '陌生人进入',
                        value: '020207'
                    }
                ],
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
            this.queryLimit.entityId = this.$route.query.entityId
            this.tableLimit.entityId = this.$route.query.entityId
            if (this.$route.query.handleStatus) {
                this.tableLimit.handleStatus = this.$route.query.handleStatus * 1;
            }
            this.getDetailData();
            this.searchTab();
        },
        methods: {
            refreshData() {
                this.getDetailData();
                this.searchTab();
            },
            // handleIconClick() { //搜索框按钮点击搜索
            //     this.a = !this.a;
            //     this.searchTab();
            // },
            async getDetailData() {
                this.loading = true;
                let result = await guard.getEwSummary(this.queryLimit)
                if (result.status) {
                    this.detailData = result.data
                    if (result.data.streetAreaName !== null) {
                        this.detailData.areaName = `${result.data.areaName}${result.data.streetAreaName}`
                    }
                } else {
                    this.$message.warning(result.message);
                }
                this.loading = false;
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
            async searchPage() {
                this.loading = true;
                let result = await guard.getSmallTypeList(this.tableLimit)
                if (result.status) {
                    this.tableData=result.data.records;
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
            },
            dispose(row) {
                this.dialogData.title = '预警处理';
                this.dialogData.entityId = this.$route.query.entityId;
                this.dialogData.defaultDeduction = parseInt(row.deduction/row.ewNum);
                this.dialogData.ewType = row.type;
                this.dialogData.ewDate = row.ewDate;
                this.disposeAddDialog = true;
            },
            view(row) {
                this.$router.push({
                    name: "xcwsWarn.anomalyDetail",
                    query: {
                        entityId: this.$route.query.entityId,
                        ewType: row.type,
                        ewDate: row.ewDate,
                        handleStatus: row.handleStatus
                    }
                });
            },
            closeDialog() {
                this.disposeAddDialog = false;
            }
        }
    };
</script>
<style scoped lang="scss">
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

        font-size: 15px;
        color: #9a9a9a;
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
        background: #ebf1f5;
    }

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

    .page-card {
        height: 200px;

        >ul {
            padding-top: 20px;
            height: calc(100% - 20px);
            border: 1px solid rgba(194, 202, 210, 1);
            width: calc(40% - 22px);

            li {
                width: calc(100% / 2);
                margin-bottom: 20px;
                font-size: 12px;
                font-weight: 400;
                color: rgba(109, 119, 135, 1);
                line-height: 22px;

                span {
                    width: 38%;
                    text-align: right;
                    margin-right: 2%;
                    display: inline-block;
                    vertical-align: middle;
                }

                span.text {
                    width: 56%;
                    text-align: left;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
            }
        }

        >div {
            height: calc(50% - 11px);
            border: 1px solid rgba(194, 202, 210, 1);
            width: calc(60% - 2px);

            >div {
                height: 100%;
                width: 50%;
                text-align: center;

                p.number {
                    font-size: 28px;
                    font-weight: 500;
                    color: rgba(57, 57, 57, 1);
                    line-height: 40px;
                    margin-bottom: 10px;
                    margin-top: 10px;
                }

                p.text {
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(162, 170, 182, 1);
                    line-height: 20px;
                }
            }
        }

        >div:last-child {
            margin-top: 20px;

            >div {
                width: 33%;
            }
        }
    }
</style>
