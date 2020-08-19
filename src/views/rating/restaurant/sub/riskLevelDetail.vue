<template>
    <div>
        <div class="page-tilt">
            <b></b>
            <span>风险等级</span>
        </div>
        <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255, 255, 255, 0.8)" class="bigbox">
            <div class="container">
                <el-form label-width="140px" class="demo-ruleForm">
                    <!-- 基本信息 -->
                    <toggle-form title="基本信息">
                        <div class="content">
                            <div class="row">
                                <el-form-item label="主体名称:">
                                    <span>{{initRepatrol.entityName ? initRepatrol.entityName  : '暂无'}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="地址:">
                                    <span>{{initRepatrol.addr ? initRepatrol.addr  : '暂无'}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="许可备案号:">
                                    <span> {{initRepatrol.licence ? initRepatrol.licence  : '暂无'}}</span>
                                </el-form-item>
                                <el-form-item label="社会信用代码:">
                                    <span>{{initRepatrol.creditCode ? initRepatrol.creditCode  : '暂无'}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="负责人:">
                                    <span>{{initRepatrol.corpName ? initRepatrol.corpName  : '暂无'}}</span>
                                </el-form-item>
                                <el-form-item label="联系方式:">
                                    <span>{{initRepatrol.mobile ? initRepatrol.mobile  : '暂无'}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="主体类型:">
                                    <span>{{initRepatrol.entityType=='CFDARESTAURANT'?'小经营店（餐饮）':'餐饮主体'}}</span>
                                </el-form-item>
                                <el-form-item label="主体业态:">
                                    <span>{{initRepatrol.subType ? initRepatrol.subType  : '暂无'}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="监管类型:">
                                    <span>{{initRepatrol.superviseType ? initRepatrol.superviseType  : '暂无'}}</span>
                                </el-form-item>
                                <el-form-item label="分管网格:">
                                    <span>{{initRepatrol.deptName ? initRepatrol.deptName  : '暂无'}}</span>
                                </el-form-item>
                            </div>

                        </div>
                    </toggle-form>

                    <toggle-form title="风险等级">
                        <div class="alert">等级划分：A级 0-30分，B级 31-45分，C级 45-60分，D级60分以上！学校（含托幼机构）食堂及校园周边餐饮服务提供者，默认D级！</div>
                        <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                            :data="tableData" class="table-div">
                            <el-table-column show-overflow-tooltip prop="name" min-width="120" label="静态得分">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="name" min-width="200" label="动态得分">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="year" min-width="80" label="合计得分">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="name" min-width="120" label="风险等级">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="name" min-width="200" label="评定日期">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="year" min-width="80" label="调整风险等级">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="year" min-width="80" label="调整原因">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="year" min-width="80" label="检查人">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="year" min-width="80" label="审核人">
                            </el-table-column>
                            <el-table-column label="操作" min-width="150" fixed="right">
                                <template slot-scope="scope">
                                    <a href="javascript:;" class="operate-a" @click="info()">静态记录</a>
                                    <a href="javascript:;" class="operate-a" @click="info()">动态记录</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination-box">
                            <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
                                :current-page="queryLimit.pageNum" :page-sizes="[10, 20, 30, 40,50]"
                                :page-size="queryLimit.pageSize" layout="total, sizes, prev, pager, next, jumper"
                                :total="total">
                            </el-pagination>
                        </div>
                    </toggle-form>
                </el-form>
            </div>
        </div>
        <!-- 底部按钮 -->
        <div class="foot-btn" style="z-index:1">
            <div>
                <el-button @click="$router.go(-1)" style="width:120px;">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import ToggleForm from "components/ToggleForm.vue";
    import * as api from 'api/rating/restaurantRating';
    export default {
        components: {
            ToggleForm,
        },
        async mounted() {
            this.id = this.$route.query.id
            this.get()
        },
        methods: {
            get() {
                this.loading = true;
                api.getEntityBaseInfo(this.id).then(r => {
                    this.loading = false;
                    if (!r.status) {
                        this.$message.error('数据拉取失败!');
                    }
                    this.initRepatrol = r.data;
                })
            },
            info(row) {
                this.$router.push({
                    name: "restaurantRating.dynamic.ratingsDetail",
                    query: {
                        // type: t,
                        // id: row ? row.id : '',
                        // status: row ? row.startStatus : '',
                    }
                });
            },
            searchPage() {
                this.loading = true;
                // api.assessPlanList(this.queryLimit).then(result => {
                //     if (result.status) {
                //         this.tableData = result.data.list;
                //         this.total = result.data.total;
                //     } else {
                //         this.$message.warning("列表数据获取失败！请稍候重试");
                //     }
                //     this.loading = false;
                // });
            },
            changeSearch() {
                this.queryLimit.pageNum = 1;
                this.searchPage();
            },
            pagecCurrentChange(num) {
                this.queryLimit.pageNum = num;
                this.searchPage();
            },
            pageSizeChange(size) {
                this.queryLimit.pageSize = size;
                this.changeSearch();
            },
        },
        data() {
            return {
                tableData: [{
                    name: 'jjhhhhh'
                }],
                total: 0,
                queryLimit: {
                    pageNum: 1,
                    pageSize: 10
                },
                initRepatrol: {},
                tableList: [],
                loading: false,
            };
        }
    }
</script>

<style lang="scss" scoped>
    .mT35 {
        margin-top: 35px;
    }

    .result {
        margin: 20px auto;
        width: 402px;
        height: 90px;
        border: 1px solid #C2CAD2;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;

            .number {
                font-size: 26px;
                color: #3B3B3B;
            }

            .project-name {
                font-size: 14px;
                color: #A2AAB6;
            }
        }
    }

    .bz {
        line-height: 20px;
        font-size: 12px;
        color: #A2AAB6;
    }


    .container {
        position: relative;
        margin-bottom: 300px;
    }

    $c:#0db5ef;



    .content {
        margin: 20px auto 0;
        width: 750px;
    }

    .table-div {
        text-align: center;

        input {
            background: #FFFFFF;
            border: 1px solid #C2CAD2;
            height: 34px;
            font-size: 12px;
            color: #A2AAB6;
            padding-left: 12px;
            box-sizing: border-box;
        }
    }

    .diva {
        background: #F6F7F8;
        border: 1px solid #C2CAD2;
        font-size: 14px;
        color: #393939;
        height: 34px;
        width: 150px;
        text-align: center;
        line-height: 34px;
        box-sizing: border-box;
    }

    .block {
        width: 252px;
        font-size: 14px;
        color: #6D7787;
        line-height: 26px;
    }

    .brN .is-leaf {
        border-right: 0;
    }

    .brN tr td {
        border-right: 0;
    }

    .brN tr td[colspan="1"] {
        border-right: 1px solid #ebeef5;
    }

    .zj {
        border: 1px solid #ebeef5;
        border-top: 0;
        height: 44px;
        line-height: 44px;

        span:first-child {
            margin-left: 36px;
        }

        span:last-child {
            width: 85%;
            display: inline-block;
            text-align: center;
        }
    }





    .imgbox {
        width: 250px;

        .imgdiv {
            float: left;
            width: 130px;
            height: 130px;
            border: 1px solid #C2CAD2;
            border-radius: 6px;
            position: relative;
            margin-right: 20px;
            margin-top: 10px;
            cursor: pointer;

            img {
                transition: all 0.5s;
                width: 100%;
                height: 100%;
                border-radius: 6px;
            }
        }
    }


    .w40h40 {
        width: 100%;

        .imgdiv {
            width: 100%;
            height: 100%;
            text-align: center;
            margin-right: 0px;
            margin-top: 0px;
            border: none;

            img {
                transition: all 0.5s;
                width: 40px;
                height: 40px;
                border-radius: 6px;
            }
        }
    }

    .bottomContent {
        margin: 0 auto;
        width: 750px;
    }


    .rowRemark {
        width: 300px;
    }

    .alert {
        margin-top: 20px;
        padding: 0 14px;
        width: calc(100% - 28px);
        height: 34px;
        background: rgba(239, 247, 249, 1);
        border: 1px solid rgba(194, 234, 248, 1);
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(31, 171, 220, 1);
        line-height: 34px;
    }
</style>