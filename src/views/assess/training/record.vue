<template>
    <div>
        <div class="page-tilt">
            <b></b><span>培训记录</span>
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
                <toggle-form title="基本信息">
                    <el-form label-width="120px" class="demo-ruleForm">
                        <div class="content">
                            <div class="row">
                                <el-form-item label="姓名:">
                                    <span>{{baseObj.name}}</span>
                                </el-form-item>
                                <el-form-item label="账号:">
                                    <span>{{baseObj.account}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="身份证号:">
                                    <span>{{baseObj.idCard?baseObj.idCard:'暂无'}}</span>
                                </el-form-item>
                                <el-form-item label="单位名称:">
                                    <span>{{baseObj.entityName}}</span>
                                </el-form-item>
                            </div>

                            <div class="row">
                                <el-form-item label="单位许可备案号:">
                                    <span>{{baseObj.licence?baseObj.licence:'暂无'}}</span>
                                </el-form-item>
                                <el-form-item label="所属区域:">
                                    <span>{{baseObj.areaName?baseObj.areaName:'暂无'}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="岗位职务:">
                                    <span>{{baseObj.post?baseObj.post:'暂无'}}</span>
                                </el-form-item>
                                <el-form-item label="人员类型:">
                                    <span>{{baseObj.personCategory?baseObj.personCategory:'暂无'}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="行业类型:">
                                    <span>{{baseObj.entityTypeStr?baseObj.entityTypeStr:'暂无'}}</span>
                                </el-form-item>
                                <el-form-item label="已修学时:">
                                    <span>{{baseObj.studyHour?baseObj.studyHour:'暂无'}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="培训状态:">
                                    <span>{{studyStatus[baseObj.studyStatus]}}</span>
                                </el-form-item>
                                <el-form-item label="是否报名人员:">
                                    <span>{{isApplyPeople[baseObj.isSignUp]}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="培训标题:">
                                    <span>{{baseObj.title}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="培训启动时间:"  v-if='baseObj.trainingStatus!="3"'>
                                    <span>{{baseObj.startUpTime}}</span>
                                </el-form-item>
                                <el-form-item label="培训完成时间:"  v-if='baseObj.trainingStatus=="2"'>
                                    <span>{{baseObj.finishTime}}</span>
                                </el-form-item>
                                <!-- 如果没有待启动没有开始时间，如果是已完成，才有结束时间 -->
                            </div>
                        </div>
                    </el-form>
                </toggle-form>
                <ToggleForm title="培训详情">
                    <div class="mt30">
                        <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                            :data="tableData" class="table-div">
                            <el-table-column type="index" label="序号" min-width="80"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="name" min-width="100" label="课程名称">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="period" min-width="80" label="学时">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="studyHour" min-width="200" label="已学">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip  min-width="100" label="状态">
                                <template slot-scope="scope">
                                    {{studyStatus[scope.row.studyStatus]}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </ToggleForm>
            </div>
            <!-- 底部按钮 start-->
            <div class="foot-btn" style="z-index:998">
                <div>
                    <el-button class="w100 mr10" @click="$router.go(-1)">返回</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import scroll from "utils/scroll";
    import ToggleForm from "components/ToggleForm.vue";
    import {
        getPublic,
        getEntityType,
        getYear
    } from "../com.js";
    import * as api from "api/assess/index";
    export default {
        data() {
            return {
                trainingStatus: getPublic().trainingStatus,
                studyStatus: getPublic().studyStatus,
                isApplyPeople:getPublic().isApplyPeople,
                loading: false,
                slideIndex: -1,
                progress: ["基础信息", "培训详情"],
                tableData: [],
                baseObj:{},
                id: '',
                personId: ''
            };
        },
        components: {
            ToggleForm,
        },
        mounted() {
            scroll.call(this, "slideIndex");
            this.id = this.$route.query.id;
            this.personId = this.$route.query.personId;
            this.get()
        },
        methods: {
            get() {
                let obj={
                    personId: this.personId,
                    trainPlanId: this.id
                }
                api.trainPlanRecordInfo(obj).then(result => {
                    if (result.status) {
                        this.baseObj = result.data;
                    }
                })
                 api.trainPlanRecordDetail(obj).then(result => {
                    if (result.status) {
                        this.tableData = result.data;
                    }
                })
            }
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
        width: 780px;
        margin: 30px auto 0;
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
</style>