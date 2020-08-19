<template>
    <div>
        <div class="page-tilt">
            <b></b><span>考核计划详情</span>
        </div>
        <div style="margin-bottom: 120px;position: relative;">
            <!-- 左边信息悬浮栏 start-->
            <div class="left-info">
                <div class="head-block">
                    <ul class="main-block">
                        <li class="clearfix " :class="slideIndex==index?'activePosition':''"
                            v-for="(item,index) in progress" :key="index">
                            <p class="floatL left">{{item}}</p>

                        </li>
                    </ul>
                </div>
            </div>
            <!-- 左边信息悬浮栏 end-->
            <div class="ml210">
                <!-- 基础信息 -->
                <el-form ref="ruleForm" label-width="120px" class="demo-ruleForm">
                    <ToggleForm title="基础信息">
                        <div class="content">
                            <div class="row">
                                <el-form-item label="考核名称：">
                                    {{baseObj.name}}
                                    <p class='tip' v-if="baseObj.trainName">此考核计划为（{{baseObj.trainName}}）关联创建！</p>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="考核年度：">
                                    {{baseObj.year}}
                                </el-form-item>
                                <el-form-item label="考核季度：">
                                    {{quarter[baseObj.quarter]}}
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="补考次数：">
                                   {{baseObj.againTime>=0?baseObj.againTime+'次':'不限次数'}}
                                </el-form-item>
                                <el-form-item label="启动状态：">
                                    {{assessStatus[baseObj.startStatus]}}
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="考核时长：">
                                    {{baseObj.duration==-1?'不限时间':baseObj.duration+'分钟'}}
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="考核启动时间:" v-if='baseObj.startStatus!=1'>
                                    {{baseObj.startDate}}
                                </el-form-item>
                                <el-form-item label="考核完成时间：" v-if='baseObj.startStatus==3'>
                                    {{baseObj.endDate}}
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="其他附件：">
                                    <div v-if='baseObj.adjunct.length>0' class="show-success-file">
                                        <div class="file-item" v-for="(item,index) in baseObj.adjunct" :key="index">
                                            <span class="file-name not-pic"
                                                @click.stop="downloadFile_(index,item)">{{item.fileName}}</span>
                                        </div>
                                    </div>
                                    <p v-else>暂无附件</p>
                                </el-form-item>
                            </div>
                        </div>
                    </ToggleForm>
                </el-form>
                <!-- 题库管理 -->
                <ToggleForm title="题库管理">
                    <div class='mt30'>
                        <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                            :data="tableData" class="table-div">
                            <el-table-column type="index" label="序号" min-width="80"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="name" min-width="120" label="题库名称">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="description" min-width="200" label="题库描述">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="entityTypeStr" min-width="80" label="行业类型">
                            </el-table-column>
                            <el-table-column min-width="80" label="考题类型">
                                <template slot-scope="scope">
                                    <p>
                                        {{addData.pumpType==0?'随机考题':'统一考题'}}
                                    </p>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="100" fixed="right">
                                <template slot-scope="scope">
                                    <a href="javascript:;" class="operate-a"
                                        @click="$router.push({name: 'assess.questionsDetail',query:{id:scope.row.id,btnShow:1}});">详情</a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="mt20 clear_a scoreBox" v-if='addData.questionDepotId'>
                        <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                            :data="tableData2" class="table-div left">
                            <el-table-column show-overflow-tooltip prop="name" min-width="80" label="题型">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="topicNum" min-width="80" label="题型总数(个)">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="spotCheckNum" min-width="120" label="抽考数量 (个)">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="score" min-width="120" label="每题分值 (分)">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="sumScore" min-width="80" label="合计 (分)">
                            </el-table-column>
                        </el-table>
                        <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                            :data="tableData3" class="table-div right">
                            <el-table-column show-overflow-tooltip prop="name" min-width="100" label="等级">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="number" min-width="200" label="范围">
                                <template slot-scope="scope">
                                    {{scope.$index!=3?'>=':'<='}}{{scope.row.number}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </ToggleForm>
                <!-- 考核人员管理 -->
                <ToggleForm title="考核人员管理">
                    <div class="mt20">
                        <el-input placeholder="姓名、单位、单位备案号、手机号" class="w250 mr20 seekIpt" v-model="queryLimit.keyWord"
                            @keyup.enter.native="changeSearch">
                            <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch"></i>
                        </el-input>
                        <select-area-grid class="mr20"  placeholder="所属辖区" @change="selectAreaGrid_"></select-area-grid>
                        <el-select class="mr20 w200" v-model="personType" @change="changeSearch" :clearable="true"
                            multiple collapse-tags placeholder="人员类型">
                            <el-option v-for="(item,key) in peopleType" :key="key" :label="item" :value="key">
                            </el-option>
                        </el-select>
                        <el-select class="mr20 w200" v-model="entityType" @change="changeSearch" :clearable="true"
                            multiple collapse-tags placeholder="行业类型">
                            <el-option v-for="item in entityType_" :key="item.key" :label="item.name" :value="item.key">
                            </el-option>
                        </el-select>
                        <el-select class="mr20 w200" v-model="queryLimit.assessResult" :clearable="true"
                            @change="changeSearch" placeholder="考核结果">
                            <el-option v-for="(item,key) in assessResult" :key="key" :label="item" :value="key">
                            </el-option>
                        </el-select>
                        <el-button class="w100" type="primary" @click="assessPlanPersonExport">导出</el-button>
                    </div>
                    <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                        :data="tableData4" class="table-div mt20">
                        <el-table-column show-overflow-tooltip prop="name" min-width="120" label="姓名">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="account" min-width="120" label="账号">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="idCard" min-width="120" label="身份证号">
                            <template slot-scope="scope">
                                {{scope.row.idCard?scope.row.idCard:'-'}}
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="entityName" min-width="150" label="单位名称">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="licence" min-width="130" label="单位许可备案号">
                            <template slot-scope="scope">
                                {{scope.row.licence?scope.row.licence:'-'}}
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="areaName" min-width="100" label="所属区域">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="post" min-width="100" label="岗位职务">
                            <template slot-scope="scope">
                                {{scope.row.post?scope.row.post:'-'}}
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="entityTypeStr" min-width="120" label="行业类型">
                            <template slot-scope="scope">
                                {{scope.row.entityTypeStr?scope.row.entityTypeStr:'-'}}
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="personCategoryStr" min-width="100" label="人员类型">
                            <template slot-scope="scope">
                                {{scope.row.personCategoryStr?scope.row.personCategoryStr:'-'}}
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip min-width="100" label="考核结果">
                            <template slot-scope="scope">
                                {{assessResult[scope.row.result]}}/{{scope.row.score}}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="120" fixed="right">
                            <template slot-scope="scope">
                                <a href="javascript:;" class="operate-a"
                                    @click="$router.push({name: 'assess.assessRecord',query:{personId:scope.row.personId,id:id}});">考核记录</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination-box">
                        <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
                            :current-page="queryLimit.pageNum" :page-sizes="[10, 50, 300, 600,1000]"
                            :page-size="queryLimit.pageSize" layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                        </el-pagination>
                    </div>
                </ToggleForm>
            </div>
            <!-- 底部按钮 start-->
            <div class="foot-btn" style="z-index:998">
                <div>
                    <el-button class="w100 mr10" @click="$router.go(-1)">返回</el-button>
                    <el-button type="primary w100"  v-if='baseObj.startStatus!="3"'
                        @click='$router.push({name: "assess.assessAdd",query: {type: "edit",id: id,status:baseObj.startStatus}});'>
                        编辑
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as api from "api/assess/index";
    import scroll from "utils/scroll";
    import ToggleForm from "components/ToggleForm.vue";
    import SelectAreaGrid from 'components/common/SelectAreaGridTob'
    import {
        downloadFile
    } from "api/common";
    import {
        getPublic,
        getEntityType,
        getYear
    } from "../com.js";
    export default {
        data() {
            return {
                id: '',
                quarter: getPublic().quarter,
                peopleType: getPublic().peopleType,
                assessResult: getPublic().assessResult,
                assessStatus: getPublic().assessStatus,
                entityType_: [],
                baseObj: {
                    adjunct: [],
                    duration:1,
                    againTime:0,
                },
                addData: {},
                total: 0,
                queryLimit: {
                    pageNum: 1,
                    pageSize: 10,
                    planId: '',
                    entityType: '',
                    personType: '',
                    areaCode: '',
                    keyWord: '',
                    assessResult: ''
                },
                entityType: [],
                personType: [],
                loading: false,
                slideIndex: -1,
                progress: ['基础信息', '题库管理', '考核人员管理'],
                tableData: [],
                tableData2: [{
                        name: '单选题',
                        topicType: 0,
                        spotCheckNum: 0,
                        topicNum: 0,
                        score: '',
                        sumScore: '0',
                    },
                    {
                        name: '多选题',
                        topicType: 1,
                        spotCheckNum: 0,
                        topicNum: 0,
                        score: '',
                        sumScore: '0',
                    },
                    {
                        name: '判断题',
                        topicType: 2,
                        spotCheckNum: 0,
                        topicNum: 0,
                        score: '',
                        sumScore: '0',
                    },
                    {
                        name: '总分值(100)',
                        topicType: '',
                        spotCheckNum: '-',
                        topicNum: '-',
                        score: '-',
                        sumScore: '100',
                    }
                ],
                tableData3: [{
                        name: '优秀',
                        number: '90'
                    },
                    {
                        name: '良好',
                        number: '80'
                    },
                    {
                        name: '合格',
                        number: '60'
                    },
                    {
                        name: '不合格',
                        number: '59'
                    }
                ],
                tableData4: [],
                pathFile: this.$store.getters.filePath,
            };
        },
        components: {
            ToggleForm,
            SelectAreaGrid
        },

        async mounted() {
            this.pathFile = this.$store.getters.filePath;
            scroll.call(this, "slideIndex");
            this.entityType_ = await getEntityType()
            this.id = this.$route.query.id;
            this.getBase()
            this.getQuestions()
            this.changeSearch();

        },
        methods: {
            getBase() {
                api.assessPlanBasicDetail(this.id).then(r => {
                    if (r.status) {
                        this.baseObj = r.data;
                    }
                })
            },
            getQuestions() {
                api.assessPlanQuestionDetail(this.id).then(r => {
                    if (r.status) {
                        this.addData = r.data;
                        if (!this.addData.questionDepotId) {
                            return
                        }
                        this.tableData3[0].number = this.addData.excellentScore
                        this.tableData3[1].number = this.addData.wellScore
                        this.tableData3[2].number = this.addData.qualifiedScore
                        this.tableData3[3].number = this.addData.unqualifiedScore
                        this.addData.queConfig.map((item, i) => {
                            if (item.topicType == 0) {
                                this.$set(this.tableData2, 0, this.addData.queConfig[i])
                                // this.tableData2[0] = this.addData.queConfig[i]
                                this.tableData2[0].name = '单选题'
                            } else if (item.topicType == 1) {
                                this.$set(this.tableData2, 1, this.addData.queConfig[i])
                                // this.tableData2[1] = this.addData.queConfig[i]
                                this.tableData2[1].name = '多选题'
                            } else {
                                this.$set(this.tableData2, 2, this.addData.queConfig[i])
                                // this.tableData2[2] = this.addData.queConfig[i]
                                this.tableData2[2].name = '判断题'
                            }
                        })
                        this.tableData = [];
                        let obj = {
                            name: this.addData.depotName,
                            description: this.addData.depotDescription,
                            entityTypeStr: this.addData.depotEntityTypeStr,
                            id: this.addData.questionDepotId,
                        }
                        this.tableData.push(obj)
                    }
                })
            },
            selectAreaGrid_(val) {
                if (!val || val.length == 0) {
                    this.queryLimit.areaCode = "";
                } else {
                    this.queryLimit.areaCode = val[val.length - 1];
                }
                this.changeSearch();
            },
            pagecCurrentChange(num) {
                this.queryLimit.pageNum = num;
                this.searchPage();
            },
            pageSizeChange(size) {
                this.queryLimit.pageSize = size;
                this.changeSearch();
            },
            changeSearch() {
                this.queryLimit.pageNum = 1;
                this.searchPage();
            },
            searchPage() {
                this.loading = true;
                this.queryLimit.entityType = this.entityType.toString()
                this.queryLimit.personType = this.personType.toString()
                this.queryLimit.planId = this.id
                api.assessPlanPersonOutList(this.queryLimit).then(result => {
                    if (result.status) {
                        this.tableData4 = result.data.list;
                        this.total = result.data.total;
                    } else {
                        this.$message.warning("列表数据获取失败！请稍候重试");
                    }
                    this.loading = false;
                });
            },
            assessPlanPersonExport() {
                // window.location.href ='http://172.16.2.74:8098/pxkh/assess/plan/person/export?planId='+this.id+
                location.href ='/api/pxkh/assess/plan/person/export?planId='+this.id+
                '&areaCode='+this.queryLimit.areaCode+
                '&assessResult='+this.queryLimit.assessResult+
                '&entityType='+this.entityType.toString()+
                '&personType='+this.personType.toString()+
                '&keyWord='+this.queryLimit.keyWord+
                '&pageNum='+this.queryLimit.pageNum+
                '&pageSize='+this.queryLimit.pageSize
            },
            async downloadFile_(index, file) {
                let fileName = file.fileName;
                if (fileName) {
                    fileName = fileName.substr(0, fileName.lastIndexOf("."));
                }
                // window.open(downloadFile(file.fileId,fileName));
                downloadFile(file.fileId, fileName);
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

    .content {
        width: 750px;
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
        white-space: pre-wrap;
    }

    .w80 {
        width: 80px !important;
    }

    .pagination-box {
        text-align: right;
        margin-top: 20px;
    }

    .scoreBox {
        .left {
            margin-right: 20px;
            width: calc(60% - 20px);
        }

        .right {
            width: 40%;
        }
    }
</style>