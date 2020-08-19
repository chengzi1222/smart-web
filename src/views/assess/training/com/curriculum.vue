<template>
    <div>
        <ToggleForm title="培训课程管理">
            <div class="mt30">
                <div class="mb20" v-if="status!='1'">
                    <el-button class="w120" type="primary" @click="addPop" v-if='total<=30'>
                        <i style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>添加课程
                    </el-button>
                    <span class="tip ml20">最多添加30个课程</span>
                </div>
                <p class="fs14 col39 mb20">总学时：{{time}}</p>
                <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                    :data="tableData" class="table-div">
                    <el-table-column type="index" label="序号" min-width="80"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="name" min-width="100" label="课程名称">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="period" min-width="80" label="学时"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="description" min-width="200" label="课程描述">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="entityTypeStr" min-width="100" label="行业类型">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="remark" min-width="180" label="备注">
                    </el-table-column>
                    <el-table-column label="操作" v-if="status!='1'"  min-width="100" fixed="right">
                        <template slot-scope="scope">
                            <!-- <a href="javascript:;" class="operate-a"
                                 @click="$router.push({name: 'assess.curriculumDetail',query:{id:scope.row.id}});">详情</a> -->
                            <a href="javascript:;" class="operate-a" @click='del(scope.row.id)'>删除</a>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-box">
                    <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
                        :current-page="queryLimit.pageNum" :page-sizes="[10, 20, 30]" :page-size="queryLimit.pageSize"
                        layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </div>
        </ToggleForm>
        <!-- 弹窗 -->
        <yb-popup @close="close" :isShow="isShow" title="添加课程" width="900">
            <div slot="body">
                <div style="margin:0 20px">
                    <el-input placeholder="课程名称" class="w350 mr20 seekIpt" v-model="queryLimitPop.keyword"
                        @keyup.enter.native="changeSearchPop">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearchPop"></i>
                    </el-input>
                    <el-select class="w150" v-model="entityType_" multiple :clearable="true" @change="changeSearchPop"
                        placeholder="行业类型">
                        <el-option v-for="item in entityType" :key="item.key" :label="item.name" :value="item.key">
                        </el-option>
                    </el-select>
                    <el-table v-loading="loadingPop" height='550' @selection-change="handleSelectionChangePop"
                        element-loading-text="数据正在努力加载中" :border="true" :resizable="true" :data="tableDataPop"
                        class="table-div mt20">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="name" min-width="150" label="课程名称">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="period" min-width="55" label="学时">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="description" min-width="150" label="课程描述">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="entityTypeStr" min-width="120" label="行业类型">
                        </el-table-column>
                    </el-table>
                    <div class="pagination-box">
                        <el-pagination background @size-change="pageSizeChangePop"
                            @current-change="pagecCurrentChangePop" :current-page="queryLimitPop.pageNum"
                            :page-size="queryLimitPop.pageSize" :page-sizes="[10, 20, 30,40,50]" layout="total, sizes, prev, pager, next, jumper"
                            :total="totalPop">
                        </el-pagination>
                    </div>
                </div>
            </div>
            <div slot="foot" style="padding-bottom:20px;">
                <el-button class="w80" type="default" @click="close">取消</el-button>
                <el-button class="w80" type="primary" @click="submit">保存</el-button>
            </div>
        </yb-popup>
    </div>
</template>

<script>
    import ToggleForm from "components/ToggleForm.vue";
    import YbPopup from 'components/ybpopup/YbPopup.vue'
    import * as api from "api/assess/index";
    import {
        getPublic,
        getEntityType,
        getYear
    } from "../../com.js";

    export default {
        components: {
            ToggleForm,
            YbPopup
        },
        props: {
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                isShow: false,
                totalPop: 0,
                loadingPop: false,
                queryLimitPop: {
                    pageNum: 1,
                    keyword: '',
                    pageSize: 10,
                    entityType: '',
                    trainPlanId: ''
                },
                entityType_: [],
                selList: [],
                tableDataPop: [],
                queryLimit: {
                    pageNum: 1,
                    pageSize: 10,
                    trainPlanId: ''
                },
                total: 0,
                loading: false,
                time: 0,
                tableData: [],
                entityType: [],
                type: 'add',
                status: '3'
            };
        },
        async mounted() {
            this.entityType = await getEntityType()
            if (this.$route.query.type) {
                this.type = this.$route.query.type;
            }
            if (this.$route.query.status) {
                this.status = this.$route.query.status;
            }
            this.searchPage()
            
        },
        methods: {
            changeSearch() {
                this.queryLimit.pageNum = 1;
                this.searchPage();
            },

            searchPage() {
                this.loading = true;
                this.queryLimit.trainPlanId = this.id
                api.trainPlanCourseList(this.queryLimit).then(result => {
                    if (result.status) {
                        this.tableData = result.data.paging.list;
                        this.total = result.data.paging.total;
                        this.time = result.data.totalPeriod
                    } else {
                        this.$message.warning("列表数据获取失败！请稍候重试");
                    }
                    this.loading = false;
                });
            },
            pagecCurrentChange(num) {
                this.queryLimit.pageNum = num;
                this.searchPage();
            },
            pageSizeChange(size) {
                this.queryLimit.pageSize = size;
                this.changeSearch();
            },
            handleSelectionChangePop(val) {
                this.selList = val.map(obj => obj.id)
            },
            pagecCurrentChangePop(num) {
                this.queryLimitPop.pageNum = num;
                this.searchPagePop();
            },
            pageSizeChangePop(size) {
                this.queryLimitPop.pageSize = size;
                this.changeSearchPop();
            },
            changeSearchPop() {
                this.queryLimitPop.pageNum = 1;
                this.searchPagePop();
            },
            searchPagePop() {
                this.loadingPop = true;
                this.queryLimitPop.entityType = this.entityType_.toString()
                api.trainPlanCourseListForAdd(this.queryLimitPop).then(result => {
                    if (result.status) {
                        this.tableDataPop = result.data.list;
                        this.totalPop = result.data.total;
                    } else {
                        this.$message.warning("列表数据获取失败！请稍候重试");
                    }
                    this.loadingPop = false;
                });
            },
            addPop() {
                this.isShow = true
                this.entityType_ = []
                this.queryLimitPop = {
                    pageNum: 1,
                    pageSize: 10,
                    entityType: '',
                    keyword: '',
                    trainPlanId: this.id
                }
                this.searchPagePop();
            },
            submit() {
                if (this.selList.length <= 0) {
                    this.$message.error('请至少选择一个')
                    return
                }
                api.trainPlanCourseAdd({
                    id: this.id,
                    arr: this.selList
                }).then(r => {
                    if (r.status) {
                        this.$message.success("添加成功")
                        this.changeSearch()
                    } else {
                        this.$message({
                            message: r.message,
                            type: 'error'
                        });
                    }
                })
                this.close()
            },
            close() {
                this.isShow = false;
                this.changeSearch()
            },
            del(id) {
                this.$confirm("是否确定删除选中的课程？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const data = new FormData()
                    data.append('trainPlanId', this.id)
                    data.append('courseId', id)
                    api.trainPlanCourseDel(data).then(r => {
                        if (r.status) {
                            this.$message.success("删除成功")
                            this.changeSearch()
                        }
                    })
                })
            }
        }
    };
</script>
<style scoped lang="scss">
    .mt30 {
        margin-top: 30px;
    }

    p.text {
        font-size: 12px;
        color: rgba(59, 59, 59, 1);
        line-height: 16px;
        text-align: left;
        margin: 0 10px;
        white-space: pre-wrap;
    }

    .w80 {
        width: 80px !important;
    }

    .pagination-box {
        text-align: right;
        margin-top: 20px;
        min-height: 50px;
    }
</style>