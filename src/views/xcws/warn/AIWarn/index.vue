<template>
    <div>
        <div class="page-tilt">
            <b></b>
            <span>AI摄像头预警</span>
        </div>

        <div class="user-box">
            <ul class="clear_a mt20 page-card ">
                <li>
                    <p class="number">{{count.currentEntityNum}}</p>
                    <p class="text">当前预警主体数</p>
                </li>
                <li>
                    <p class="number">{{count.currentNum}}</p>
                    <p class="text">当前预警风险数</p>
                </li>
                <li>
                    <p class="number">{{count.processedEntityNum}}</p>
                    <p class="text">已处理风险主体数</p>
                </li>
                <li>
                    <p class="number">{{count.processedNum}}</p>
                    <p class="text">已处理风险数</p>
                </li>
            </ul>
            <div class="mt20 mb20 clear_a">
                <el-input placeholder="主体名称, 负责人,联系方式" class="w250 seekIpt" v-model="queryLimit.keyword"
                          @keyup.enter.native="handleIconClick">
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
                </el-input>
                <select-area-grid class="selectHeight" style="margin-right: 20px;"
                                  placeholder="所属辖区" @change="areaChange"></select-area-grid>
                <!-- <el-cascader class="selectHeight" clearable :change-on-select="true" :options="options" @change="areaChange" :props="props"></el-cascader> -->
                <enum-select class="selectHeight" v-model="queryLimit.buyerType" placeholder="主体类型"
                             enum="com.ybveg.govx.enums.sub.RestaurantSuperviseTypeEnum"
                             @change="searchTab"></enum-select>
                <el-select class="selectHeight" v-model="queryLimit.hasCurrentEw" :clearable="true"  placeholder="是否存在当前预警"  @change="selectChange" >
                    <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
                <el-select class="selectHeight" v-model="queryLimit.hasProcessedEw" :clearable="true"  placeholder="是否存在已处理预警"  @change="selectChange" >
                    <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
                <!-- <el-button class="floatR w100" type="primary" @click="exportList">导出</el-button> -->
            </div>
            <div class="tabOffTop120">
                <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                          :data="tableData" class="table-div" @sort-change="sortChange">
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column show-overflow-tooltip min-width="190" label="主体名称">
                        <template slot-scope="scope">
                            {{scope.row.buyerName ? scope.row.buyerName : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="120" label="责任人">
                        <template slot-scope="scope">
                            {{scope.row.legalPerson ? scope.row.legalPerson : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="120" label="联系方式">
                        <template slot-scope="scope">
                            {{scope.row.tel ? scope.row.tel : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip  min-width="100" label="主体类型">
                        <template slot-scope="scope">
                            {{scope.row.buyerType ? type[scope.row.buyerType] : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="areaName" min-width="100" label="所属区域">
                        <template slot-scope="scope">
                            {{scope.row.areaName ? scope.row.areaName : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100" label="所属街道">
                        <template slot-scope="scope">
                            {{scope.row.streetAreaName ? scope.row.streetAreaName : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="ewProcessedNum" min-width="120" label="已处理预警数"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="ewCurrentNum" min-width="140" label="当前预警数" sortable='custom'>
                        <template slot-scope="scope">
                            {{scope.row.ewCurrentNum ? scope.row.ewCurrentNum : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="actualDeduction" min-width="100" label="扣分数" sortable='custom'>
                        <template slot-scope="scope">
                            {{scope.row.actualDeduction ? scope.row.actualDeduction : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="ewDate" min-width="120" sortable='custom' label="最新预警日期">
                        <template slot-scope="scope">
                            {{scope.row.ewDate ? scope.row.ewDate : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="150" fixed="right">
                        <template slot-scope="scope">
                            <a href="javascript:;" class="operate-a" @click="view(scope.row.entityId)">详情</a>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-box">
                    <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
                                   :current-page="queryLimit.current" :page-sizes="[10, 20, 30, 40,50]"
                                   :page-size="queryLimit.size" layout="total, sizes, prev, pager, next, jumper"
                                   :total="page.total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import EnumSelect from "components/common/EnumSelect";
    import SelectAreaGrid from "components/common/SelectAreaGridTob.vue";
    import * as guard from "api/xcws/warn/food";
    import { getMapping } from "../../mapping";

    export default {
        data() {
            return {
                page: {
                    total: 0
                },
                loading: false,
                a: false,
                tableData: [],
                count: {
                    currentEntityNum: 0,
                    currentNum: 0,
                    processedEntityNum: 0,
                    processedNum: 0
                },
                condition: {
                    appType: "1", // 校餐卫士
                    keyword: "",
                    buyerType: "",
                    scType: "",
                    areaId: ""
                },
                queryLimit: {
                    current: 1,
                    size: 10,
                    ewType: "AI_CAMERA",
                    areaId: "",
                    buyerType: "",
                    deductionOrder: "",
                    ewCurrentNumOrder: "",
                    ewDateOrder:'DESC',
                    hasCurrentEw: "",
                    hasProcessedEw: "",
                    keyword: ""
                },
                countLimit: {
                    ewType: "AI_CAMERA"
                },
                props: {
                    value: "areaId",
                    label: "areaName",
                    children: "children"
                },
                type: getMapping().type,
                select: [
                    {
                        name: "是",
                        key: true
                    },
                    {
                        name: "否",
                        key: false
                    }
                ]
            };
        },

        async mounted() {
            this.searchTab();
            this.getCount();
        },
        methods: {
            selectChange() {
                this.searchTab();
            },
            view(id) {
                this.$router.push({
                    name: "xcwsWarn.AIWarnDetail",
                    query: {
                        entityId: id
                    }
                });
            },
            handleIconClick() {
                //搜索框按钮点击搜索
                this.a = !this.a;
                this.searchTab();
            },
            async searchPage() {
                this.loading = true;
                let result = await guard.getWarnList(this.queryLimit);
                if (result.status) {
                    this.tableData = result.data.records;
                    this.page.total = result.data.total;
                } else {
                    this.$message.warning(result.message);
                }
                this.loading = false;
            },
            async getCount() {
                let result = await guard.getWarnCount(this.countLimit);
                if (result.status) {
                    this.count = result.data;
                } else {
                    this.$message.warning(result.message);
                }
            },
            async exportList() {
                let result = await guard.exportWarningList(this.queryLimit);
                if (result.status) {
                    window.location.href = result.data.fileUrl;
                } else {
                    this.$message.warning(result.message);
                }
            },
            sortChange(column) {
                if (column.order == "ascending") {
                    if (column.prop == "ewCurrentNum") {
                        this.queryLimit.ewCurrentNumOrder = "ASC";
                        this.queryLimit.deductionOrder = "";
                        this.queryLimit.ewDateOrder = "";
                    }
                    if (column.prop == "actualDeduction") {
                        this.queryLimit.deductionOrder = "ASC";
                        this.queryLimit.ewCurrentNumOrder = "";
                        this.queryLimit.ewDateOrder = "";
                    }
                    if (column.prop == "ewDate") {
                        this.queryLimit.deductionOrder = "";
                        this.queryLimit.ewCurrentNumOrder = "";
                        this.queryLimit.ewDateOrder = "ASC";
                    }
                }
                if (column.order == "descending") {
                    if (column.prop == "ewCurrentNum") {
                        this.queryLimit.ewCurrentNumOrder = "DESC";
                        this.queryLimit.deductionOrder = "";
                        this.queryLimit.ewDateOrder = "";
                    }
                    if (column.prop == "actualDeduction") {
                        this.queryLimit.deductionOrder = "DESC";
                        this.queryLimit.ewCurrentNumOrder = "";
                        this.queryLimit.ewDateOrder = "";
                    }
                    if (column.prop == "ewDate") {
                        this.queryLimit.deductionOrder = "";
                        this.queryLimit.ewCurrentNumOrder = "";
                        this.queryLimit.ewDateOrder = "DESC";
                    }
                }
                this.searchTab();
            },
            searchTab() {
                this.queryLimit.current = 1;
                this.searchPage();
            },
            pagecCurrentChange(num) {
                this.queryLimit.current = num;
                this.searchPage();
            },
            pageSizeChange(size) {
                this.queryLimit.size = size;
                this.searchPage();
            },
            areaChange(val) {
                if (!val || val.length == 0) {
                    this.queryLimit.areaId = "";
                } else {
                    this.queryLimit.areaId = val[val.length - 1];
                }
                this.searchTab();
            }
        },
        components: { EnumSelect, SelectAreaGrid },
        filters: {
            buyerType: function(val) {
                switch (val) {
                    case "KINDSC":
                        return "幼儿园";
                    case "PRISC":
                        return "小学";
                    case "MIDSC":
                        return "初中";
                    case "HIGSC":
                        return "高中";
                    case "UNVSC":
                        return "大学";
                }
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
        height: 90px;
        border: 1px solid rgba(194, 202, 210, 1);
        width: 100%;
        box-sizing: border-box;
        > li {
            height: 100%;
            width: calc(100% / 4);
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
</style>
