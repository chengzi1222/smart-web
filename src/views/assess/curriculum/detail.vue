<template>
    <div>
        <div class="page-tilt">
            <b></b><span>课程详情</span>
        </div>
        <div class="mb200">
            <el-form ref="ruleForm" label-width="120px" class="demo-ruleForm">
                <ToggleForm title="基础信息">
                    <div class="content">
                        <el-form-item label="课程名称：">
                            {{baseObj.name}}
                        </el-form-item>
                        <el-form-item label="学时：">
                            {{baseObj.period}}
                        </el-form-item>
                        <el-form-item label="课程描述：">
                            {{baseObj.description}}
                        </el-form-item>
                        <el-form-item label="行业类型：">
                            {{baseObj.entityTypeStr}}
                        </el-form-item>
                        <el-form-item label="备注：">
                            {{baseObj.remark?baseObj.remark:'暂无'}}
                        </el-form-item>
                        <el-form-item label="课程附件：">
                            <div class="show-success-file" v-if='list.length>0'>
                                <div class="file-item" v-for="(item,index) in list" :key="index">
                                    <span class="file-name not-pic"
                                        @click.stop="downloadFile_(index,item)">{{item.name}}</span>
                                </div>
                            </div>
                            <p v-else>暂无附件</p>
                        </el-form-item>
                        <el-form-item label="视频附件：">
                            <div v-if='video.videoFileId' style="text-align: left;">
                                <video width="180px" height="120px" :src="pathFile+video.videoFileId" controls autoplay
                                    alt="加载失败"></video>
                                <p>{{video.name}}</p>
                            </div>
                            <p v-else>暂无视频</p>
                        </el-form-item>
                    </div>
                </ToggleForm>
            </el-form>
            <ToggleForm title="课程内容">
                <div class="editorBox" v-if='baseObj.content!=""' v-html="baseObj.content">
                </div>
                <div class="editorBox" v-else>
                    <p class="textC">暂无课程内容</p>
                </div>
            </ToggleForm>
        </div>
        <!-- 底部按钮 start-->
        <div class="foot-btn" style="z-index:998">
            <div>
                <el-button class="w100 mr10" @click="$router.go(-1)">返回</el-button>
                <el-button class="w100 mr10" v-if='!baseObj.correlation&&btnShow==0' @click="del(id)">删除</el-button>
                <el-button type="primary w100"  v-if='btnShow==0'  @click="$router.push({name: 'assess.curriculumAdd',query:{id:id}});">编辑
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import * as api from "api/assess/index";
    import ToggleForm from "components/ToggleForm.vue";
    import {
        downloadFile
    } from "api/common";

    export default {
        data() {
            return {
                id: '',
                resetHtml: "",
                baseObj: {
                    content: ''
                },
                industryArr: [{
                        code: "5855",
                        name: "食品销售经营类"
                    },
                    {
                        code: "5505",
                        name: "餐饮服务经营类"
                    },
                    {
                        code: "5755",
                        name: "单位食堂类"
                    },
                    {
                        code: "5555",
                        name: "食用农产品经营类"
                    },
                    {
                        code: "5455",
                        name: "食品小经营店（销售）"
                    },
                    {
                        code: "5553",
                        name: "食品小经营店（餐饮）"
                    },
                    {
                        code: "5552",
                        name: "市场开办方"
                    }
                ],
                video: {},
                list: [],
                btnShow: 0
            };
        },
        components: {
            ToggleForm,
        },
        computed: {
            pathFile() {
                return this.$store.getters.filePath;
            }
        },
        mounted() {
            if (this.$route.query.btnShow) {
                this.btnShow = this.$route.query.btnShow;
            }
            this.id = this.$route.query.id;
            this.get()
        },
        methods: {
            del(id) {
                this.$confirm('是否确认删除改课程？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    api.courseDel(id).then(r => {
                        if (r.status) {
                            this.$message.success("删除成功,马上返回列表")
                            this.$router.go(-1)
                        }
                    })
                })
            },
            get() {
                api.courseDetail(this.id).then(r => {
                    if (r.status) {
                        this.baseObj = r.data;
                        this.list = []
                        this.baseObj.courseAccessory.map(item => {
                            this.list.push({
                                fileId: item.fileId,
                                url: this.pathFile + item.fileId,
                                name: item.fileName
                            })

                        })
                        this.baseObj.videoAccessory.map(item => {
                            this.video = {
                                videoFileId: item.fileId,
                                name: this.baseObj.videoName
                            }
                        })
                    }
                })
            },
            async downloadFile_(index, file) {
                let fileName = file.name;
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
<style lang="scss">
    .editorBox {
        width: 750px;
        min-height: 483px;
        margin: 30px auto;
        border: 1px solid rgba(194, 202, 210, 1);
        padding: 28px 20px;

        img {
            max-width: 100% !important;
            display: inline-block;
        }
    }
</style>
<style scoped lang="scss">
    .content {
        width: 700px;
        margin: 30px auto 0;
    }

    .w550 {
        width: 550px !important;
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

    .mb200 {
        margin-bottom: 200px;
    }



    .videoList {
        text-align: center;
        margin: 20px 15px 0 15px;

        img {
            width: 120px;
            height: 90px;
        }

        p {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 20px;
        }
    }
</style>