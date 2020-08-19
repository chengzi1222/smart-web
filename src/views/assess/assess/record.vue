<template>
    <div>
        <div class="page-tilt">
            <b></b><span>考核记录</span>
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
                    <el-form label-width="140px" class="demo-ruleForm">
                        <div class="content">
                            <div class="row">
                                <el-form-item label="姓名：">
                                    <span>{{baseObj.name}}</span>
                                </el-form-item>
                                <el-form-item label="账号：">
                                    <span>{{baseObj.account}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="身份证号：">
                                    <span>{{baseObj.idCard?baseObj.idCard:'暂无'}}</span>
                                </el-form-item>
                                <el-form-item label="单位名称：">
                                    <span>{{baseObj.entityName}}</span>
                                </el-form-item>
                            </div>

                            <div class="row">
                                <el-form-item label="单位许可备案号：">
                                    <span>{{baseObj.licence?baseObj.licence:'暂无'}}</span>
                                </el-form-item>
                                <el-form-item label="所属区域：">
                                    <span>{{baseObj.areaName?baseObj.areaName:'暂无'}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="行业类型：">
                                    <span>{{baseObj.entityTypeStr?baseObj.entityTypeStr:'暂无'}}</span>
                                </el-form-item>
                                <el-form-item label="人员类型：">
                                    <span>{{baseObj.personCategoryStr?baseObj.personCategoryStr:'暂无'}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="考核结果：">
                                    <span>{{assessResult[baseObj.result]+'/'+baseObj.score}}</span>
                                </el-form-item>
                                <el-form-item label="考核计划状态：">
                                    <span>{{assessStatus[baseObj.planStatus]}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="考核照片：">
                                    <div class="imgbox clear_a w400" v-if='baseObj.assessPhoto.length>0'>
                                        <div v-for="(item,index)  in baseObj.assessPhoto" :key='index'
                                            @click.stop="previewImg(baseObj.assessPhoto,index,'考核照片')" class="imgdiv">
                                            <img :src="pathFile+item">
                                        </div>
                                    </div>
                                    <p v-else>暂无考核照片</p>
                                    <Preview v-if='baseObj.assessPhoto.length>0' :showImg="PreviewShow"
                                        @close="PreviewShow = false" :currentIndex='PreviewIndex' :title='PreviewTitle'
                                        :imgList="PreviewFileList"></Preview>

                                </el-form-item>
                            </div>
                        </div>
                    </el-form>
                </toggle-form>
                <ToggleForm title="考核记录">
                    <div class="mt30">
                        <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                            :data="baseObj.assessRecordTimeDto" class="table-div">
                            <el-table-column type="index" label="序号" min-width="80"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="assessName" min-width="100" label="考核名称">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="startTime" min-width="80" label="考核时间">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="examTime" min-width="200" label='考核用时'>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="score" min-width="200" label='分数'>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="result" min-width="100" label="考核结果">
                                <template slot-scope="scope">
                                    {{assessResult[scope.row.result]}}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="150" fixed="right">
                                <template slot-scope="scope">
                                    <a href="javascript:;" class="operate-a"
                                        @click="$router.push({name: 'assess.assessRecordDetail',query:{id:scope.row.id}});">详情</a>
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
    import * as api from "api/assess/index";
    import Preview from 'components/togOss/previewImg';
    import {
        getPublic,
        getEntityType,
        getYear
    } from "../com.js";
    export default {
        data() {
            return {
                assessStatus: getPublic().assessStatus,
                assessResult: getPublic().assessResult,
                loading: false,
                slideIndex: -1,
                progress: ["基础信息", "考核详情"],
                baseObj: {
                    assessRecordTimeDto: [],
                    assessPhoto:[],
                    score:0
                },
                id: '',
                personId: '',
                PreviewShow: false,
                PreviewFileList: [],
                PreviewIndex: 0,
                PreviewTitle: '',
            };
        },
        components: {
            ToggleForm,
            Preview
        },
         computed: {
            pathFile() {
                return this.$store.getters.filePath;
            }
        },
        mounted() {
            scroll.call(this, "slideIndex");
            this.id = this.$route.query.id;
            this.personId = this.$route.query.personId;
            this.get()
        },
        methods: {
            previewImg(imgList, index, title) {
                this.PreviewFileList =[]
                imgList.map(item => {
                    this.PreviewFileList.push(this.pathFile+item)
                })
                this.PreviewIndex = index;
                this.PreviewTitle = title;
                this.PreviewShow = true;
            },
            get() {
                let obj = {
                    personId: this.personId,
                    planId: this.id
                }
                api.assessPlanRecord(obj).then(result => {
                    if (result.status) {
                        this.baseObj = result.data;
                    //    this.baseObj.assessPhoto = ['tog_test/2020-04-20mkQJBPhwHZBiXSSDi6Sw.jpeg']
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