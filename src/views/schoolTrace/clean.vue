<template>
    <div class="rightBox">
        <div class="titie clear_a">
            <div class="titie_left">清洗消毒</div>
            <div class="titie_right">
                <el-date-picker class="w200 fr" :clearable='false' @change="timeChange" v-model="time" type="month"
                                align="right"
                                :picker-options="option" value-format="yyyy-MM">
                </el-date-picker>
            </div>
        </div>
        <div class="innerBox">
            <el-scrollbar class="scrollbar">
                <div>
                    <el-table :data="tableData" class="table-div" v-loading="loading" element-loading-text="数据正在努力加载中">
                        <el-table-column show-overflow-tooltip prop="disinfectDate" min-width="100"
                                         label="日期"></el-table-column>
                        <!--<el-table-column show-overflow-tooltip prop="goodsName" min-width="100" label="物品名称"></el-table-column>-->
                        <!--<el-table-column show-overflow-tooltip  min-width="100" label="数量/单位">-->
                        <!--<template slot-scope="scope">-->
                        <!--{{scope.row.cnt === null || scope.row.unit_rd === null ? '暂无':scope.row.cnt+ '/' +scope.row.unit_rd}}-->
                        <!--</template>-->
                        <!--</el-table-column>-->
                        <el-table-column show-overflow-tooltip prop="disinfectWay_rd" min-width="100"
                                         label="消毒方式"></el-table-column>
                        <!--<el-table-column show-overflow-tooltip  min-width="100" label="开始时间">-->
                        <!--<template slot-scope="scope">-->
                        <!--{{scope.row.startTime}}-->
                        <!--</template>-->
                        <!--</el-table-column>-->
                        <el-table-column show-overflow-tooltip min-width="100" label="消毒时长(分钟)">
                            <template slot-scope="scope">
                                {{scope.row.disinfectDuration}}
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="disinfectPerson" min-width="100"
                                         label="操作员"></el-table-column>
                        <!--<el-table-column show-overflow-tooltip prop="remark" min-width="100" label="备注"></el-table-column>-->
                        <el-table-column show-overflow-tooltip min-width="100" label="操作">
                            <template slot-scope="scope">
                                <a href="javascript:;" class="operate" @click="toInfo(scope.row.id)">查看详情</a>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination-box mt20 fr">
                    <el-pagination @size-change="pageSizeChange"
                                   @current-change="pageCurrentChange"
                                   :current-page="page.pageNum"
                                   :page-sizes="[10,20,30,40]"
                                   :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
                                   :total="page.total">
                    </el-pagination>
                </div>
            </el-scrollbar>

        </div>

    </div>
</template>

<script>
    import * as api from "../../api/schoolTrace/index";

    export default {
        methods: {
            async getDictTree() {
                await api.getDictTree().then(r => {
                    if (r.code == 200) {
                        this.dictTree = r.data;
                    }
                })
            },
            getUnit(num) {
                let result;
                for (let i in this.dictTree) {
                    if (this.dictTree[i].dictType === num) {
                        result = this.dictTree[i].dictItem
                    }
                }
                return result
            },
            timeChange() {
                this.page.pageNum = 1;
                this.searchPage();
            },
            pageCurrentChange(num) {
                this.page.pageNum = num;
                this.searchPage();
            },
            pageSizeChange(size) {
                this.page.pageNum = 1;
                this.page.pageSize = size;
                this.searchPage();
            },
            searchPage() {
                this.loading = true;
                let obj = {
                    entityId: this.entityId,
                    current: this.page.pageNum,
                    searchMonth: this.time,
                    clientType: '02',
                    size: this.page.pageSize
                }
                api.getClean(obj).then(r => {
                    if (r.code == 200) {
                        this.tableData = r.data.records;
                        let disinfect = this.getUnit('03')
                        let unitDict = this.getUnit('01')
                        this.tableData.map(items => {
                            let resultWay = items.disinfectWay.split(",")
                            items.disinfectWay_rd = [];
                            resultWay.map(itemWay => {
                                disinfect.map(item => {
                                    if (itemWay === item.code) {
                                        items.disinfectWay_rd.push(item.name)
                                    }
                                })
                            })
                            items.disinfectWay_rd = items.disinfectWay_rd.join()
                            unitDict.map(item => {
                                if (items.unit === item.code) {
                                    items.unit_rd = item.name
                                }
                            })
                        })
                        this.page.total = r.data.total;
                        this.time = r.timestamp
                        this.loading = false;
                    }
                })
            },
            toInfo(id) {
                this.$router.push({
                    name: "schoolTrace.cleanInfo",
                    query: {
                        id: id,
                        entityId: this.entityId
                    }
                });
            }
        },
        async mounted() {
            if (this.$route.query.entityId) {
                this.entityId = this.$route.query.entityId;
            }
            await this.getDictTree();
            this.searchPage();
        },
        data() {
            return {
                dictTree: null,
                entityId: '',
                loading: true,
                tableData: [],
                time: '',
                option: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                page: {
                    pageSize: 10,
                    pageNum: 1,
                    total: 0
                },
            };
        }
    }
</script>

<style scoped lang='scss'>
    .rightBox {
        width: calc(100% - 60px);
        padding: 0 30px;
        height: 100%;
        .titie {
            height: 80px;
            line-height: 80px;
            .titie_left {
                font-size: 20px;
                font-weight: 500;
                color: rgba(51, 51, 51, 1);
                width: 50%;
                height: 100%;
            }
            .titie_right {
                width: 50%;
                height: 100%;
                text-align: right;
            }
        }
        .innerBox {
            width: calc(100% - 40px);
            padding: 30px 20px;
            height: calc(888px - 100px);
            background: #fff;
            border-radius: 10px;
            .scrollbar {
                height: 100%;
                width: 100%;
            }
        }
    }
</style>
<style>
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .operate {
        color: #34C5D7;
    }

    .rightBox {
        overflow: hidden;
    }
</style>

