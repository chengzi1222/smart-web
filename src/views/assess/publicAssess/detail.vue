<template>
    <div>
        <div class="page-tilt">
            <b></b><span>公开考核计划详情</span>
        </div>
        <div style="margin-bottom: 120px;position: relative;">
            <!-- 左边信息悬浮栏 start-->
            <div class="left-info">
                <div class="head-block">
                    <ul class="main-block">
                        <li class="clearfix " :class="slideIndex==index?'activePosition':''"
                            v-for="(item,index) in progress" :key="index">
                            <p class="floatL left">{{item.title}}</p>
                            <p class="floatR right">
                                <span>{{item.total}}</span>
                            </p>
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
                            <el-form-item label="考核名称：">
                                餐饮服务食品安全管理人员操作课程
                            </el-form-item>
                            <el-form-item label="考核年度：" prop="name">
                                2019年
                            </el-form-item>
                            <el-form-item label="考核季度：" prop="name">
                                第一季度
                            </el-form-item>
                            <el-form-item label="考核日期：" prop="name">
                                2019-08-24
                            </el-form-item>
                            <el-form-item label="考核时长：" prop="name">
                                不限时间
                            </el-form-item>
                            <el-form-item label="其他附件：">
                                <div class="show-success-file">
                                    <div class="file-item" v-for="(item,index) in uploadArr" :key="index">
                                        <span class="file-name not-pic" @click.stop="downloadFile(index,item)"
                                            v-if="['png','jpg','jpeg'].indexOf(item.type)==-1">{{item.fileName}}</span>
                                        <span class="file-name" @click.stop="showBigPic=index"
                                            v-if="~['png','jpg','jpeg'].indexOf(item.type)">{{item.fileName}}</span>
                                        <div class='big-img' v-show="showBigPic==index" @click.stop="showBigPic = -1"
                                            v-if="~['png','jpg','jpeg'].indexOf(item.type)">
                                            <img :src="pathFile + item.path" alt="">
                                        </div>
                                    </div>
                                </div>
                            </el-form-item>
                            <!-- <el-form-item label="现场图片">
                                添加的时候没有看到。还不确定
                            </el-form-item> -->
                        </div>
                    </ToggleForm>
                </el-form>
                <!-- 题库管理 -->
                <ToggleForm title="题库管理">
                    <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                        :data="tableData" class="table-div">
                        <el-table-column type="index" label="序号" min-width="80"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="correct" min-width="100" label="课程名称">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="correct" min-width="200" label="课程描述">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="analysis" min-width="100" label="行业类型">
                        </el-table-column>
                        </el-table-column>
                        <el-table-column label="操作" min-width="100" fixed="right">
                            <template slot-scope="scope">
                                <a href="javascript:;" class="operate-a">详情</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="mt20 clear_a scoreBox">
                        <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                            :data="tableData2" class="table-div left">
                            <el-table-column show-overflow-tooltip prop="name" min-width="100" label="题型">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="number" min-width="200" label="数量 (个)">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="analysis" min-width="100" label="分值 (分)">
                            </el-table-column>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="analysis" min-width="100" label="合计 (分)">
                            </el-table-column>
                        </el-table>
                        <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                            :data="tableData3" class="table-div right">
                            <el-table-column show-overflow-tooltip prop="name" min-width="100" label="等级">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="number" min-width="200" label="范围">
                            </el-table-column>
                        </el-table>
                    </div>
                </ToggleForm>
                 <!-- 培训类型管理 -->
                <ToggleForm title="考核类型管理">
                    <el-form ref="ruleForm" label-width="120px" class="demo-ruleForm">
                        <div class="contentBase">
                            <el-form-item label="考核辖区" prop="industryType">
                                青羊区，双流区
                            </el-form-item>
                            <el-form-item label="主体类型：" prop="industryType">
                                流通主体，餐饮主体，小经营店（销售）
                            </el-form-item>
                            <el-form-item label="人员类型：" prop="industryType">
                                食品安全管理人员，从业人员，负责人，其他人员
                            </el-form-item>
                        </div>
                    </el-form>
                </ToggleForm>
                <!-- 考核人员管理 -->
                <ToggleForm title="考核人员记录">
                    <div class="mt20">
                        <el-input placeholder="姓名、单位、单位备案号、手机号" class="w250 mr20 seekIpt" v-model="queryLimit.keyword">
                            <i slot="suffix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                        <select-area-grid placeholder="所属区域" @change="selectAreaGrid"></select-area-grid>
                        <el-select class="ml20 mr20 w150" v-model="queryLimit.type" :clearable="true"
                            placeholder="主体类型">
                            <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
                            </el-option>
                        </el-select>
                        <el-select class="mr20 w150" v-model="queryLimit.type" :clearable="true" placeholder="人员类型">
                            <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
                            </el-option>
                        </el-select>
                        <el-button type="primary"  class="floatR mr20">
                            导出
                        </el-button>
                    </div>
                    <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                        :data="tableData" class="table-div mt20">
                        <el-table-column show-overflow-tooltip prop="correct" min-width="100" label="单位名称">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip min-width="80" label="姓名"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="correct" min-width="100" label="手机号(账号)">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="correct" min-width="100" label="身份证号">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="correct" min-width="100" label="单位许可备案号">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="correct" min-width="100" label="所属区域">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="correct" min-width="100" label="主体类型">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="correct" min-width="100" label="人员类型">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="correct" min-width="100" label="考核状态">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="correct" min-width="100" label="考核次数">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="correct" min-width="100" label="考核结果">
                        </el-table-column>
                        <el-table-column label="操作" min-width="120" fixed="right">
                            <template slot-scope="scope">
                                <a href="javascript:;" class="operate-a">人员详情</a>
                                <a href="javascript:;" class="operate-a">主体档案</a>
                                <a href="javascript:;" class="operate-a">考核记录</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination-box">
                        <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
                            :current-page="queryLimit.current" :page-sizes="[10, 20, 30, 40,50]"
                            :page-size="queryLimit.size" layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                        </el-pagination>
                    </div>
                </ToggleForm>
            </div>
            <!-- 底部按钮 start-->
            <div class="foot-btn" style="z-index:998">
                <div>
                    <el-button class="w100 mr10">返回</el-button>
                    <el-button type="primary w100">编辑</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import scroll from "utils/scroll";
    import {
        getInfo
    } from "api/cosmetics/subject";
    import ToggleForm from "components/ToggleForm.vue";
    import * as common from "api/common";
    import SelectAreaGrid from 'components/common/SelectAreaGrid'
    import {
        downloadFile
    } from "api/common";
    export default {
        data() {
            return {
                total: 0,
                queryLimit: {
                    current: 1,
                    type: "",
                    keyword: "",
                    size: 10
                },
                select: [{
                        name: "存在",
                        key: true
                    },
                    {
                        name: "不存在",
                        key: false
                    }
                ],
                loading: false,
                slideIndex: -1,
                progress: [{
                        title: "基础信息",
                        total: "0"
                    },
                    {
                        title: "题库管理",
                        total: "0"
                    }, {
                        title: "考核类型管理",
                        total: "0"
                    },
                    {
                        title: "考核人员记录",
                        total: "0"
                    }
                ],
                loading: false,
                tableData2: [{
                        name: '单选题',
                        number: '10'
                    },
                    {
                        name: '多选题',
                        number: '10'
                    },
                    {
                        name: '判断题',
                        number: '10'
                    },
                    {
                        name: '总分值',
                        number: '10'
                    }
                ],
                tableData3: [{
                        name: '优秀',
                        number: '》=10'
                    },
                    {
                        name: '良好',
                        number: '10'
                    },
                    {
                        name: '合格',
                        number: '10'
                    },
                    {
                        name: '不合格',
                        number: '10'
                    }
                ],
                tableData: [{
                        correct: 'B',
                        analysis: '解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析'
                    },
                    {
                        correct: 'B',
                        analysis: '解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析'
                    },
                ],
                pathFile: this.$store.getters.filePath,
                showBigPic: -1, //是否展示大图
                uploadArr: [], //上传成功的图片数组
                percentage: 0 //需要关联的进度条
            };
        },
        components: {
            ToggleForm,
            SelectAreaGrid
        },

        mounted() {
            this.pathFile = this.$store.getters.filePath;
            scroll.call(this, "slideIndex");
        },
        methods: {
            selectAreaGrid(value) {
                console.log(value);
            },
            pagecCurrentChange(num) {
                this.queryLimit.current = num;
                // this.searchPage();
            },
            pageSizeChange(size) {
                this.queryLimit.size = size;
                // this.changeSearch();
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