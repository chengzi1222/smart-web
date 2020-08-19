<template>
    <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)" class="bigbox">
        <div class="page-tilt">
            <b></b><span>现场核查记录</span>
        </div>
        <div class="clear_a mb20 mt20">
            <el-input placeholder="经营者、法人、许可证、业务受理号" class="w300 mr20 seekIpt" v-model="searchMap.search"
                @keyup.enter.native="searchData">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="searchData"></i>
            </el-input>
            <div class="mr20">
                <el-date-picker value-format="yyyy-MM-dd" @change="searchData" v-model="searchMap.startDate"
                    class="sle w140" type="date" placeholder="核查起始日期" :picker-options="startDate"></el-date-picker>至
                <el-date-picker value-format="yyyy-MM-dd" @change="searchData" v-model="searchMap.endDate"
                    class="sle w140" type="date" placeholder="核查截止日期" :picker-options="endDate"></el-date-picker>
            </div>
        </div>
        <div class="clear_a">
            <el-select @change="searchData" clearable collapse-tags multiple v-model="searchMap.applyType"
                class="w200 mr20" placeholder="申请类型">
                <el-option v-for="(item,key) in applyTypes" :key="key" :label="item" :value="key">
                </el-option>
            </el-select>
            <el-select @change="searchData" clearable v-model="searchMap.result" class="w200 mr20" placeholder="核查结果">
                <el-option v-for="(item,key) in resultSelectdata" :key="key" :label="item" :value="key">
                </el-option>
            </el-select>
            <el-select @change="searchData" clearable v-model="searchMap.treat" class="w200 mr20" placeholder="核查处理方式">
                <el-option v-for="(item,key) in treatSelectdata" :key="key" :label="item" :value="key">
                </el-option>
            </el-select>
        </div>
        <div>
            <el-table :data="dataPage" :border="true" :resizable="true" class="table-div">
                <el-table-column show-overflow-tooltip min-width='50' type="index" label="序号">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="entityName" min-width="120" label="经营者名称">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="applyDate" min-width="120" label="申请日期"></el-table-column>
                <el-table-column show-overflow-tooltip prop="applyType" min-width="120" label="申请类型">
                    <template slot-scope="scope">
                        {{applyTypes[scope.row.applyType]}}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="businessType" min-width="120" label="业务状态">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="subType" min-width="120" label="主体状态"></el-table-column>
                <el-table-column show-overflow-tooltip prop="legalPerson" min-width="120" label="法人/负责人">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="spaceAddr" min-width="120" label="经营场所"></el-table-column>
                <el-table-column show-overflow-tooltip prop="licence" min-width="120" label="许可证编号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="no" min-width="120" label="业务受理号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="importTime" min-width="120" label="导入时间"></el-table-column>
                <el-table-column show-overflow-tooltip prop="inspectorName" min-width="120" label="核查人">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="inspectTime" min-width="120" label="核查时间">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="result" min-width="120" label="核查结果">
                    <template slot-scope="scope">
                        {{resultSelectdata[scope.row.result]?resultSelectdata[scope.row.result]:'暂无'}}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="treat" min-width="120" label="核查处理方式">
                    <template slot-scope="scope">
                        {{treatSelectdata[scope.row.treat]?treatSelectdata[scope.row.treat]:'暂无'}}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="操作" min-width="80" fixed="right">
                    <template slot-scope="scope">
                        <a href="javascript:;" @click="toSource(scope.row)"
                            style="font-size: 12px;color: #1787AD;">详情</a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-box">
                <el-pagination background :current-page="searchMap.pageNum" :page-sizes="[10, 20, 30, 40,50]"
                    :page-size="searchMap.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
                    @size-change="pageSizeChange" @current-change="pagecCurrentChange">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import * as api from '../../../api/xchc/detail';

    export default {
        methods: {
            // 页数改变
            pagecCurrentChange(num) {
                this.searchMap.pageNum = num
                this.getPageData();
            },
            // 每页数量改变
            pageSizeChange(size) {
                this.searchMap.pageSize = size
                this.getPageData();
            },

            getPageData() {
                this.loading = true;
                api.onSiteRecordList(this.searchMap).then((response) => {
                    this.loading = false;
                    if (!response.status) {
                        this.$message.error('数据获取失败')
                        return
                    }
                    // 数据装载
                    this.dataPage = response.data.list
                    this.total = response.data.total
                })
            },
            searchData() {
                this.searchMap.pageNum = 1
                this.getPageData()
            },
            toSource(item) {
                this.$router.push({
                    name: 'xchc.allDetails.inspectRecord',
                    query: {
                        'id': item.id,
                        'count': 0,
                        'subOrSite': 'site'
                    }
                })
            },

        },
        mounted() {
            this.getPageData()

        },
        data() {
            return {
                applyTypes: {
                    'NEW': '新办',
                    'CHANGE': '变更',
                    'CONTINUE': '延续',
                    'SUPPLEMENT': '补证',
                    'LOGOUT': '注销',
                    'REPLACE': '换证',
                },
                resultSelectdata: {
                    'YES': '符合',
                    'NO': '不符合',
                },
                treatSelectdata: {
                    'NORMAL': '正常',
                    'RECTIFY': '限期整改',
                    'REJECT': '驳回',
                },
                total: 0,
                // 查询条件
                searchMap: {
                    search: '', // 关键字
                    startDate: "", // 开始时间
                    endDate: "", // 结束时间
                    applyType: [], // 申请类型
                    result: '', // 处理结果
                    treat: '', // 处理方式
                    pageSize: 10,
                    pageNum: 1,

                },
                dataPage: [],
                loading: false,
                startDate: {
                    disabledDate: (time) => {
                        let endDate = new Date(this.searchMap.endDate);
                        let date = new Date('2017-12-31');
                        if (this.searchMap.endDate) {
                            return time.getTime() > endDate || time.getTime() < date || time.getTime() > Date
                            .now() - 8.64e6
                        } else {
                            return time.getTime() < date || time.getTime() > Date.now() - 8.64e6
                        }
                    }
                },
                endDate: {
                    disabledDate: (time) => {
                        let startDate = new Date(this.searchMap.startDate);
                        let date = new Date('2017-12-31');
                        if (this.searchMap.startDate) {
                            return time.getTime() < startDate - 8.64e7 || time.getTime() < date || time.getTime() >
                                Date.now() - 8.64e6;
                        } else {
                            return time.getTime() < date || time.getTime() > Date.now() - 8.64e6
                        }
                    }
                },
            }
        },
    }
</script>

<style scoped lang="scss">
    .bigbox {
        width: 100%;
        position: relative;
    }

    .table-div {
        margin: 20px 0;
        text-align: center;
    }

    .pagination-box {
        text-align: right;
        margin-top: 20px;
    }



    .mr20 {
        margin-right: 20px;
    }


    .sle {
        margin: 0 12px;
    }

    .opct0 {
        display: none;
    }

    .red {
        color: red !important;
    }
</style>