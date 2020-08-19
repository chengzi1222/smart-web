<template>
    <div>
        <div class="page-tilt">
            <b></b><span>培训计划详情</span>
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
                <el-form ref="ruleForm" label-width="140px" class="demo-ruleForm">
                    <ToggleForm title="基础信息">
                        <div class="contentBase">
                            <div class="row">
                                <el-form-item label="培训标题：">
                                    {{baseObj.title}}
                                </el-form-item>
                                <el-form-item label="培训年度：">
                                    {{baseObj.year}}
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="培训季度：">
                                    {{quarter[baseObj.quarter]}}
                                </el-form-item>
                                <el-form-item label="是否允许公开报名：">
                                    {{isPublic[baseObj.isPublic]}}
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="启动状态：">
                                    {{trainingStatus[baseObj.trainingStatus]}}
                                </el-form-item>
                                <el-form-item label="培训启动时间：" v-if='baseObj.trainingStatus!="3"'>
                                    {{baseObj.startUpTime?baseObj.startUpTime:''}}
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="培训完成时间：" v-if='baseObj.trainingStatus=="2"'>
                                    {{baseObj.finishTime?baseObj.finishTime:''}}
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="培训图片">
                                    <div class="imgbox clear_a w550" v-if='baseObj.trainImg.length>0'>
                                        <div v-for="(item,index)  in baseObj.trainImg" :key='index'
                                            @click.stop="previewImg(baseObj.trainImg,index,'培训图片')" class="imgdiv">
                                            <img :src="item.fileId">
                                        </div>
                                    </div>
                                    <p v-else>暂无培训图片</p>
                                    <Preview v-if='baseObj.trainImg.length>0' :showImg="PreviewShow"
                                        @close="PreviewShow = false" :currentIndex='PreviewIndex' :title='PreviewTitle'
                                        :imgList="PreviewFileList"></Preview>

                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="其他附件：">
                                    <div v-if='baseObj.attachment.length>0' class="show-success-file">
                                        <div class="file-item" v-for="(item,index) in baseObj.attachment" :key="index">
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
                <!-- 培训课程管理 -->
                <ToggleForm title="培训课程管理">
                    <div class="mt30">
                        <p class="fs14 col39 mb20">总学时：{{time}}</p>
                        <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                            :data="tableData" class="table-div">
                            <el-table-column type="index" label="序号" min-width="80"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="name" min-width="100" label="课程名称">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="period" min-width="80" label="学时">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="description" min-width="200" label="课程描述">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="entityTypeStr" min-width="100" label="行业类型">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="remark" min-width="180" label="备注">
                            </el-table-column>
                            <el-table-column label="操作" min-width="100" fixed="right">
                                <template slot-scope="scope">
                                    <a href="javascript:;" class="operate-a"
                                        @click="$router.push({name: 'assess.curriculumDetail',query:{id:scope.row.id,btnShow:1}});">详情</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination-box">
                            <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
                                :current-page="queryLimit.pageNum" :page-sizes="[10, 20, 30]"
                                :page-size="queryLimit.pageSize" layout="total, sizes, prev, pager, next, jumper"
                                :total="total">
                            </el-pagination>
                        </div>
                    </div>
                </ToggleForm>
                <!-- 培训人员管理 -->
                <ToggleForm title="培训人员管理">
                    <div class="mt20">
                        <div>
                            <el-input placeholder="姓名、单位、单位备案号、账号" class="w300 mr20 seekIpt"
                                v-model="queryLimit1.keyword" @keyup.enter.native="changeSearch1">
                                <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch1"></i>
                            </el-input>
                            <select-area-grid placeholder="所属辖区" @change="selectAreaGrid_"></select-area-grid>
                            <el-select class="mr20 w150" v-model="personCategory" @change="changeSearch1"
                                :clearable="true" multiple collapse-tags placeholder="人员类型">
                                <el-option v-for="(item,key) in peopleType" :key="key" :label="item" :value="key">
                                </el-option>
                            </el-select>
                            <el-select class="mr20 w150" v-model="entityType" @change="changeSearch1" :clearable="true"
                                multiple collapse-tags placeholder="行业类型">
                                <el-option v-for="item in entityType_" :key="item.key" :label="item.name"
                                    :value="item.key">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="mt20">
                            <el-select class="mr20 w200" v-model="queryLimit1.studyStatus" @change="changeSearch1"
                                :clearable="true" placeholder="培训状态">
                                <el-option v-for="(item,key) in studyStatus" :key="key" :label="item" :value="key">
                                </el-option>
                            </el-select>
                            <el-select class="mr20 w200" v-model="queryLimit1.isSignUp" @change="changeSearch1"
                                :clearable="true" placeholder="是否报名人员">
                                <el-option v-for="(item,key)  in isApplyPeople" :key="key" :label="item" :value="key">
                                </el-option>
                            </el-select>
                            <el-button class="w100" type="primary" @click="down">导出</el-button>
                        </div>
                        <el-table v-loading="loading1" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                            :data="tableData1" class="table-div mt20">
                            <el-table-column type="index" label="序号" min-width="80"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="name" min-width="120" label="姓名">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="account" min-width="120" label="账号">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="idCard" min-width="120" label="身份证号">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="entityName" min-width="150" label="单位名称">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="licence" min-width="130" label="单位许可备案号">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="areaName" min-width="100" label="所属区域">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="post" min-width="100" label="岗位职务">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="entityTypeStr" min-width="120" label="行业类型">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="personCategory" min-width="100" label="人员类型">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip min-width="100" label="培训状态">
                                <template slot-scope="scope">
                                    {{studyStatus[scope.row.studyStatus]}}
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip min-width="100" label="是否报名人员">
                                <template slot-scope="scope">
                                    {{isApplyPeople[scope.row.isSignUp]}}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="120" fixed="right">
                                <template slot-scope="scope">
                                    <a href="javascript:;" class="operate-a"
                                        @click="$router.push({name: 'assess.trainingRecord',query:{personId:scope.row.personId,id:id}});">培训记录</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination-box">
                            <el-pagination background @size-change="pageSizeChange1"
                                @current-change="pagecCurrentChange1" :current-page="queryLimit1.pageNum"
                                :page-size="queryLimit1.pageSize" :page-sizes="[10, 50, 300, 600,1000]"
                                layout="total,sizes, prev, pager, next, jumper" :total="total1">
                            </el-pagination>
                        </div>
                    </div>
                </ToggleForm>
            </div>
            <!-- 底部按钮 start-->
            <div class="foot-btn" style="z-index:998">
                <div>
                    <el-button class="w100 mr10" @click="$router.go(-1)">返回</el-button>
                    <el-button type="primary w100" v-if='baseObj.trainingStatus!="2"'
                        @click='$router.push({name: "assess.trainingAdd",query: {type: "edit",id: id,status:baseObj.trainingStatus}});'>
                        编辑
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import scroll from "utils/scroll";
    import ToggleForm from "components/ToggleForm.vue";
    import SelectAreaGrid from 'components/common/SelectAreaGridTob'
    import Preview from 'components/togOss/previewImg';
    import * as api from "api/assess/index";
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
                PreviewShow: false,
                PreviewFileList: [],
                PreviewIndex: 0,
                PreviewTitle: '',
                id: '',
                isApplyPeople: getPublic().isApplyPeople,
                peopleType: getPublic().peopleType,
                studyStatus: getPublic().studyStatus,
                trainingStatus: getPublic().trainingStatus,
                isPublic: getPublic().isPublic,
                quarter: getPublic().quarter,
                entityType_: [],
                entityType: [],
                personCategory: [],
                baseObj: {
                    trainImg: [],
                    attachment: [],
                },
                time: 0,
                total: 0,
                loading: false,
                queryLimit: {
                    pageNum: 1,
                    pageSize: 10,
                    trainPlanId: ''
                },
                total1: 0,
                loading1: false,
                queryLimit1: {
                    pageNum: 1,
                    pageSize: 10,
                    trainPlanId: '',
                    personCategory: '',
                    entityType: '',
                    areaCode: '',
                    keyword: '',
                    isSignUp: '',
                    studyStatus: ''
                },
                slideIndex: -1,
                progress: ['基础信息', '培训课程管理', '培训人员管理'],
                tableData: [],
                tableData1: [],
                pathFile: this.$store.getters.filePath,
                showBigPic: -1, //是否展示大图
                uploadArr: [], //上传成功的图片数组
                percentage: 0 //需要关联的进度条
            };
        },
        components: {
            ToggleForm,
            SelectAreaGrid,
            Preview
        },

        async mounted() {
            this.pathFile = this.$store.getters.filePath;
            scroll.call(this, "slideIndex");
            this.entityType_ = await getEntityType()
            if (this.$route.query.id) {
                this.id = this.$route.query.id;
            }
            this.getBase()
            this.changeSearch()
            this.changeSearch1()
        },
        methods: {

            previewImg(imgList, index, title) {
                this.PreviewFileList = []
                imgList.map(item => {
                    this.PreviewFileList.push(item.fileId)
                })
                this.PreviewIndex = index;
                this.PreviewTitle = title;
                this.PreviewShow = true;
            },
            async downloadFile_(index, file) {
                let fileName = file.fileName;
                if (fileName) {
                    fileName = fileName.substr(0, fileName.lastIndexOf("."));
                }
                downloadFile(file.fileId, fileName);
            },
            getBase() {
                api.trainPlanBaseInfo(this.id).then(r => {
                    if (r.status) {
                        this.baseObj = r.data;
                    }
                })
            },
            selectAreaGrid_(value) {
                if (!val || val.length == 0) {
                    this.queryLimit1.areaCode = "";
                } else {
                    this.queryLimit1.areaCode = val[val.length - 1];
                }
                this.changeSearch1();
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
            pagecCurrentChange1(num) {
                this.queryLimit1.pageNum = num;
                this.searchPage1();
            },
            pageSizeChange1(size) {
                this.queryLimit1.pageSize = size;
                this.changeSearch1();
            },
            changeSearch1() {
                this.queryLimit1.pageNum = 1;
                this.searchPage1();
            },
            down() {
                console.log(this.queryLimit1)
                // window.location.href ='http://172.16.2.74:8098/pxkh/trainPlan/manager/person/export?trainPlanId='+this.id+
                location.href = '/api/pxkh/trainPlan/manager/person/export?trainPlanId=' + this.id +
                    '&areaCode=' + this.queryLimit1.areaCode +
                    '&isSignUp=' + this.queryLimit1.isSignUp +
                    '&studyStatus=' + this.queryLimit1.studyStatus +
                    '&entityType=' + this.entityType.toString() +
                    '&personCategory=' + this.personCategory.toString() +
                    '&keyWord=' + this.queryLimit1.keyWord +
                    '&pageNum=' + this.queryLimit1.pageNum +
                    '&pageSize=' + this.queryLimit1.pageSize
            },
            searchPage1() {
                this.loading1 = true;
                this.queryLimit1.entityType = this.entityType.toString()
                this.queryLimit1.personCategory = this.personCategory.toString()
                this.queryLimit1.trainPlanId = this.id
                api.trainPlanPersonList(this.queryLimit1).then(result => {
                    if (result.status) {
                        this.tableData1 = result.data.list;
                        this.total1 = result.data.total;
                    } else {
                        this.$message.warning("列表数据获取失败！请稍候重试");
                    }
                    this.loading1 = false;
                });
            },
            async downloadFile(index, file) {
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

    .contentBase {
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

    .show-success-file {
        .file-item {

            .file-name {
                cursor: pointer;
                margin-right: 20px;

                &:hover {
                    color: #1FABDC;
                }
            }
        }

    }

    .imgbox {
        width: 650px;
    }

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
</style>