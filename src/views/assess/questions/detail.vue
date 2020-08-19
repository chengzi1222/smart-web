<template>
    <div>
        <div class="page-tilt">
            <b></b><span>题库详情</span>
        </div>
        <div style="margin-bottom: 120px;position: relative;">
            <!-- 左边信息悬浮栏 start-->
            <div class="left-info">
                <div class="head-block">
                    <ul class="main-block">
                        <li class="clearfix " :class="slideIndex==index?'activePosition':''"
                            v-for="(item,index) in progress" :key="index">
                            <p class="floatL left">{{item}}</p>
                            <p class="floatR right" v-if='item=="单选题"'>（{{number.singleChoiceCount}}）</p>
                            <p class="floatR right" v-if='item=="多选题"'>（{{number.multipleChoiceCount}}）</p>
                            <p class="floatR right" v-if='item=="判断题"'>（{{number.judgeCount}}）</p>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 左边信息悬浮栏 end-->
            <div class="ml210">
                <!-- 基础信息 -->
                <el-form ref="ruleForm" label-width="120px" class="demo-ruleForm">
                    <ToggleForm title="基础信息">
                        <div class="contentBase">
                            <el-form-item label="题库名称：">
                                {{baseObj.name}}
                            </el-form-item>
                            <el-form-item label="题库描述：">
                                {{baseObj.description}}
                            </el-form-item>
                            <el-form-item label="行业类型：">
                                {{baseObj.entityTypeStr}}
                            </el-form-item>
                        </div>
                    </ToggleForm>
                </el-form>
                <!-- 单选题 -->
                <ToggleForm title="单选题">
                    <div class="mt30">
                        <div class="mb20 clear_a">
                            <el-input placeholder="题干名称" class="w250 seekIpt" v-model="queryLimit1.keyword"
                                @keyup.enter.native="changeSearch1">
                                <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch1"></i>
                            </el-input>
                        </div>
                        <el-table v-loading="loading1" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                            :data="tableData1" class="table-div">
                            <el-table-column type="index" label="序号" min-width="80"></el-table-column>
                            <el-table-column show-overflow-tooltip min-width="300" label="题目">
                                <template slot-scope="scope">
                                    <p class="text mb10 textell">{{scope.row.title}}（）</p>
                                    <p class="text mb10 textell">A.{{scope.row.choiceA}}</p>
                                    <p class="text mb10 textell">B.{{scope.row.choiceB}}</p>
                                    <p class="text mb10 textell">C.{{scope.row.choiceC}}</p>
                                    <p class="text textell">D.{{scope.row.choiceD}}</p>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="correct" min-width="80" label="正确答案">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="resolve" min-width="150" label="考题解析">
                            </el-table-column>
                        </el-table>
                        <div class="pagination-box  textR mt20 mb20">
                            <el-pagination background @size-change="pageSizeChange1"
                                @current-change="pagecCurrentChange1" :current-page="queryLimit1.pageNum"
                                :page-sizes="[10, 20, 30, 40,50]" :page-size="queryLimit1.pageSize"
                                layout="total, sizes, prev, pager, next, jumper" :total="total1">
                            </el-pagination>
                        </div>
                    </div>
                </ToggleForm>
                <!-- 多选题 -->
                <ToggleForm title="多选题">
                    <div class="mt30">
                        <div class="mb20 clear_a">
                            <el-input placeholder="题干名称" class="w250 seekIpt" v-model="queryLimit2.keyword"
                                @keyup.enter.native="changeSearch2">
                                <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch2"></i>
                            </el-input>
                        </div>
                        <el-table v-loading="loading2" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                            :data="tableData2" class="table-div">
                            <el-table-column type="index" label="序号" min-width="80"></el-table-column>
                            <el-table-column show-overflow-tooltip min-width="300" label="题目">
                                <template slot-scope="scope">
                                    <p class="text mb10 textell">{{scope.row.title}}（）</p>
                                    <p class="text mb10 textell">A.{{scope.row.choiceA}}</p>
                                    <p class="text mb10 textell">B.{{scope.row.choiceB}}</p>
                                    <p class="text mb10 textell">C.{{scope.row.choiceC}}</p>
                                    <p class="text textell">D.{{scope.row.choiceD}}</p>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="correct" min-width="80" label="正确答案">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="resolve" min-width="150" label="考题解析">
                            </el-table-column>
                        </el-table>
                        <div class="pagination-box  textR mt20 mb20">
                            <el-pagination background @size-change="pageSizeChange2"
                                @current-change="pagecCurrentChange2" :current-page="queryLimit2.pageNum"
                                :page-sizes="[10, 20, 30, 40,50]" :page-size="queryLimit2.pageSize"
                                layout="total, sizes, prev, pager, next, jumper" :total="total2">
                            </el-pagination>
                        </div>
                    </div>
                </ToggleForm>
                <!-- 判断题 -->
                <ToggleForm title="判断题">
                    <div class="mt30 ">
                        <div class="mb20 clear_a">
                            <el-input placeholder="题干名称" class="w250 seekIpt" v-model="queryLimit3.keyword"
                                @keyup.enter.native="changeSearch3">
                                <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch3"></i>
                            </el-input>
                        </div>
                        <el-table v-loading="loading3" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                            :data="tableData3" class="table-div">
                            <el-table-column type="index" label="序号" min-width="80"></el-table-column>
                            <el-table-column show-overflow-tooltip min-width="300" label="题目" prop="title">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="correct" min-width="80" label="正确答案">
                                <template slot-scope="scope">
                                    {{scope.row.correct==1?'对':"错"}}
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="resolve" min-width="150" label="考题解析">
                            </el-table-column>
                        </el-table>
                        <div class="pagination-box  textR mt20 mb20">
                            <el-pagination background @size-change="pageSizeChange3"
                                @current-change="pagecCurrentChange3" :current-page="queryLimit3.pageNum"
                                :page-sizes="[10, 20, 30, 40,50]" :page-size="queryLimit3.pageSize"
                                layout="total, sizes, prev, pager, next, jumper" :total="total3">
                            </el-pagination>
                        </div>
                    </div>
                </ToggleForm>
            </div>
            <!-- 底部按钮 start-->
            <div class="foot-btn" style="z-index:998">
                <div>
                    <el-button class="w100 mr10" @click="$router.go(-1)">返回</el-button>
                    <el-button type="primary w100 mr10" @click="del">删除</el-button>
                    <el-button type="primary w100 mr10" @click="exportList($route.query.id)">导出</el-button>
                    <el-button type="primary w100" v-if='btnShow==0'
                        @click='$router.push({name: "assess.questionAdd",query: {type: "edit",id: id}});'>配置
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import scroll from "utils/scroll";
    import ToggleForm from "components/ToggleForm.vue";
    import * as api from "api/assess/index";
    export default {
        data() {
            return {
                baseObj: {},
                queryLimit1: {
                    keyword: '',
                    pageNum: 1,
                    pageSize: 10,
                    type: 1,
                    questionDepotId: '',
                },
                loading1: false,
                total1: 0,
                queryLimit2: {
                    keyword: '',
                    pageNum: 1,
                    pageSize: 10,
                    type: 2,
                    questionDepotId: '',
                },
                loading2: false,
                total2: 0,
                queryLimit3: {
                    keyword: '',
                    pageNum: 1,
                    pageSize: 10,
                    questionDepotId: '',
                },
                loading3: false,
                total3: 0,
                id: '',
                slideIndex: -1,
                progress: ['基础信息', '单选题', '多选题', '判断题'],
                number: {
                    judgeCount: 0,
                    multipleChoiceCount: 0,
                    singleChoiceCount: 0,
                },
                tableData1: [],
                tableData2: [],
                tableData3: [],
                btnShow: 0
            };
        },
        components: {
            ToggleForm
        },
        mounted() {
            if (this.$route.query.id) {
                this.id = this.$route.query.id;
            }
            if (this.$route.query.btnShow) {
                this.btnShow = this.$route.query.btnShow;
            }
            scroll.call(this, "slideIndex");
            this.get(this.id)
            this.changeSearch1()
            this.changeSearch2()
            this.changeSearch3()
            this.count()
        },
        methods: {
            exportList(id) {
                location.href = `/api/pxkh/question/depot/export?questionDepotId=` + id;
            },
            del() {
                this.$confirm('是否确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    const data = new FormData()
                    data.append('id', this.id)
                    api.depotDel(data).then(r => {
                        if (r.status) {
                            this.$message.success("删除成功,马上返回列表")
                            this.$router.go(-1)
                        }
                    })
                })
            },
            count() {
                api.questionDepotCount(this.id).then((r) => {
                    if (r.status) {
                        this.number = r.data
                    }
                })
            },
            get(id_) {
                api.questionDepotInfo({
                    id: id_
                }).then(r => {
                    if (r.status) {
                        this.baseObj = r.data;
                    }

                })
            },
            changeSearch1() {
                this.queryLimit1.pageNum = 1;
                this.searchPage1();
            },
            pagecCurrentChange1(num) {
                this.queryLimit1.pageNum = num;
                this.searchPage1();
            },
            pageSizeChange1(size) {
                this.queryLimit1.pageSize = size;
                this.changeSearch1();
            },
            searchPage1() {
                this.loading1 = true;
                this.queryLimit1.questionDepotId = this.id
                api.questionChoiceList(this.queryLimit1).then(result => {
                    if (result.status) {
                        this.tableData1 = result.data.list;
                        this.total1 = result.data.total;
                    } else {
                        this.$message.warning("列表数据获取失败！请稍候重试");
                    }
                    this.loading1 = false;
                });
            },
            changeSearch2() {
                this.queryLimit2.pageNum = 1;
                this.searchPage2();
            },
            pagecCurrentChange2(num) {
                this.queryLimit2.pageNum = num;
                this.searchPage2();
            },
            pageSizeChange2(size) {
                this.queryLimit2.pageSize = size;
                this.changeSearch2();
            },
            searchPage2() {
                this.loading2 = true;
                this.queryLimit2.questionDepotId = this.id
                api.questionChoiceList(this.queryLimit2).then(result => {
                    if (result.status) {
                        this.tableData2 = result.data.list;
                        this.total2 = result.data.total;
                    } else {
                        this.$message.warning("列表数据获取失败！请稍候重试");
                    }
                    this.loading2 = false;
                });
            },
            changeSearch3() {
                this.queryLimit3.pageNum = 1;
                this.searchPage3();
            },
            pagecCurrentChange3(num) {
                this.queryLimit3.pageNum = num;
                this.searchPage3();
            },
            pageSizeChange3(size) {
                this.queryLimit3.pageSize = size;
                this.changeSearch3();
            },
            searchPage3() {
                this.loading3 = true;
                this.queryLimit3.questionDepotId = this.id
                api.questionJudgeList(this.queryLimit3).then(result => {
                    if (result.status) {
                        this.tableData3 = result.data.list;
                        this.total3 = result.data.total;
                    } else {
                        this.$message.warning("列表数据获取失败！请稍候重试");
                    }
                    this.loading3 = false;
                });
            },
        },
        watch: {}
    };
</script>

<style scoped lang="scss">
    // 左边悬浮信息栏的样式 start
    $c: #0db5ef;

    .left-info {
        width: 210px;
        height: 560px;
        background: #fff;
        position: fixed;
        margin-left: -230px;
        z-index: 2;
        top: 0 !important;

        .head-block {
            padding: 0 20px;
            box-sizing: border-box;

            .num {
                color: $c;
            }
        }

        .main-block {
            >li {
                border-right: 2px solid #ebf1f5;
                padding: 0 20px;
                height: 50px;
                line-height: 50px;
                cursor: default;

                &:hover {
                    background: #f2f5f8;
                }

                .right {
                    color: #a2aab6;
                }
            }

            .activePosition {
                border-right: 2px solid $c;

                .left {
                    color: $c;
                }
            }
        }
    }

    .ml210 {
        margin-left: 210px;
    }

    .contentBase {
        width: 700px;
        margin: 30px auto 0;

        .w550 {
            width: 550px !important;
        }
    }

    .mt30 {
        margin-top: 30px;
    }

    p.text {
        font-size: 12px;
        color: rgba(59, 59, 59, 1);
        line-height: 16px;
        text-align: left;
        margin: 0 10px;
    }

    .w80 {
        width: 80px !important;
    }
</style>