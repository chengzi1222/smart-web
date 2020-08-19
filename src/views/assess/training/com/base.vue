<template>
    <el-form :model="baseObj" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
        <ToggleForm title="基础信息">
            <div class="content">
                <el-form-item label="培训标题：" prop="title">
                    <p v-if='show'>{{baseObj.title}}</p>
                    <el-input v-else placeholder="30字以内" class="w300" maxlength="30" v-model="baseObj.title"></el-input>
                </el-form-item>
                <el-form-item label="培训年度：" prop="year">
                    <p v-if='show'>{{baseObj.year}}</p>
                    <el-select v-else class="w300 " v-model="baseObj.year" :clearable="true" placeholder="请选择培训年度">
                        <el-option v-for="item in year" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="培训季度：" prop="quarter">
                    <p v-if='show'>{{quarter[baseObj.quarter]}}</p>
                    <el-select v-else class="w300" v-model="baseObj.quarter" :clearable="true" placeholder="请选择培训季度">
                        <el-option v-for="(item,key) in quarter" :key="key" :label="item" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否允许公开报名：" prop="isPublic" v-if='status!="1"'>
                    <p v-if='show'>{{isPublic[baseObj.isPublic]}}</p>
                    <el-select v-else class="w300 " v-model="baseObj.isPublic" :clearable="true"
                        placeholder="请选择是否允许公开报名">
                        <el-option v-for="(item,key)  in isPublic" :key="key" :label="item" :value="key">
                        </el-option>
                    </el-select>
                    <p class="tip">如果允许公开报名，则公众可以自行报名参加培训！</p>
                </el-form-item>
                <el-form-item label="是否允许公开报名：" prop="isPublic" v-else>
                    <p v-if='show2'>{{isPublic[baseObj.isPublic]}}</p>
                    <el-select v-else class="w300 " v-model="baseObj.isPublic" :clearable="true"
                        placeholder="请选择是否允许公开报名">
                        <el-option v-for="(item,key)  in isPublic" :key="key" :label="item" :value="key">
                        </el-option>
                    </el-select>
                    <p class="tip">如果允许公开报名，则公众可以自行报名参加培训！</p>
                </el-form-item>
                <el-form-item label="培训图片：" prop="name">
                    <div v-if='show' class="box ">
                        <div class="imgbox clear_a w550" v-if='baseObj.trainImg.length>0'>
                            <div v-for="(item,index)  in baseObj.trainImg" :key='index'
                                @click="previewImg(baseObj.trainImg,index,'培训图片')" class="imgdiv">
                                <img :src="item.fileId">
                            </div>
                        </div>
                        <p v-else>暂无培训图片</p>
                    </div>
                    <Preview v-if='show' :showImg="PreviewShow" @close="PreviewShow = false"
                        :currentIndex='PreviewIndex' :title='PreviewTitle' :imgList="PreviewFileList"></Preview>
                    <togOssUpload v-else :maxLength=5 @uploadSuccess='getFiles' @uploadError="getFiles"
                        @remove='getFiles' :filesArr='filesList1' size='small'></togOssUpload>
                    <p class="tip" v-if='!show'>最多上传5张图片，文件格式：png，jpg，gif,文件大小10M</p>
                </el-form-item>
                <el-form-item label="其他附件：">
                    <div v-if='show' class="show-success-file">
                        <div v-if='baseObj.attachment.length>0'>
                            <div class="file-item" v-for="(item,index) in baseObj.attachment" :key="index">
                                <span class="file-name not-pic"
                                    @click.stop="downloadFile(index,item)">{{item.fileName}}</span>
                            </div>
                        </div>
                        <p v-else>暂无附件</p>
                    </div>
                    <attachmentUpload v-else :maxLength=1 @uploadSuccess='getAttachment' @uploadError="getAttachment"
                        @remove='getAttachment' :filesArr='filesList2'></attachmentUpload>
                    <p class="tip" v-if='!show'>最多1个附件，支持pdf文档格式，附件最大为5M</p>
                </el-form-item>
            </div>
            <div class="textR" v-if="status!='1'">
                <el-button type="primary w100" @click="submit" v-if='!show'>保存
                </el-button>
                <el-button type="primary w100" @click="status1" v-if='show&&type=="edit"'>编辑
                </el-button>
            </div>
            <div class="textR" v-if="status=='1'">
                <el-button type="primary w100" @click="submit" v-if='!show2'>保存
                </el-button>
                <el-button type="primary w100" @click="show2=false" v-if='show2'>编辑
                </el-button>
            </div>
        </ToggleForm>
    </el-form>
</template>

<script>
    import Preview from 'components/togOss/previewImg';
    import ToggleForm from "components/ToggleForm.vue";
    import togOssUpload from "components/togOss/imgUpload";
    import attachmentUpload from "components/togOss/attachmentUpload";
    import * as api from "api/assess/index";
    import {
        downloadFile
    } from "api/common";
    import {
        getPublic,
        getEntityType,
        getYear
    } from "../../com.js";
    export default {
        components: {
            ToggleForm,
            togOssUpload,
            attachmentUpload,
            Preview
        },
        watch: {
            id(val) {
                this.get(val)
            }
        },
        props: {
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                show2: false,
                show: false,
                type: 'add',
                status: '3',
                rules: {
                    title: [{
                        required: true,
                        message: '请输入培训标题',
                        trigger: 'blur'
                    }, ],
                    year: [{
                        required: true,
                        message: '请选择培训年度',
                        trigger: 'blur'
                    }, ],
                    quarter: [{
                        required: true,
                        message: '请选择培训季度',
                        trigger: 'blur'
                    }, ],
                    isPublic: [{
                        required: true,
                        message: '请选择是否允许公开报名',
                        trigger: 'blur'
                    }, ],
                },
                baseObj: {
                    isPublic: '0',
                    quarter: '',
                    title: '',
                    year: '',
                    trainImg: [],
                    attachment: [],
                    id: ''
                },
                year: getYear(),
                quarter: getPublic().quarter,
                isPublic: getPublic().isPublic,
                filesList1: [],
                filesList2: [
                    // fileId: row.cover[0].fileId,
                    // id: row.cover[0].id,
                    // url: this.pathFile + row.cover[0].fileId,
                    // name: row.cover[0].fileName
                ],
                PreviewShow: false,
                PreviewFileList: [],
                PreviewIndex: 0,
                PreviewTitle: '',
            };
        },
        computed: {
            pathFile() {
                return this.$store.getters.filePath;
            }
        },
        mounted() {
            if (this.$route.query.type) {
                this.type = this.$route.query.type;
            }
            if (this.$route.query.status) {
                this.status = this.$route.query.status;
                this.show = this.status == 1 ? true : false
            }
        },
        methods: {
            status1() {
                if (this.status == 3) {
                    this.show = false;
                    this.filesList1 = []
                    this.baseObj.trainImg.map(item => {
                        this.filesList1.push({
                            fileId: item.fileId,
                            id: item.id,
                            url: item.fileId,
                            name: item.fileName
                        })
                    })
                    this.filesList2 = []
                    this.baseObj.attachment.map(item => {
                        this.filesList2.push({
                            fileId: item.fileId,
                            id: item.id,
                            url: this.pathFile + item.fileId,
                            name: item.fileName
                        })
                    })
                    this.baseObj.trainImg = this.baseObj.trainImg.map(obj => obj.id)
                    this.baseObj.attachment = this.baseObj.attachment.map(obj => obj.id)
                } else {
                    this.show = false;
                }
            },
            get(id_) {
                api.trainPlanBaseInfo(id_).then(r => {
                    if (r.status) {
                        this.baseObj = r.data;
                        this.baseObj.isPublic = this.baseObj.isPublic.toString();
                        this.baseObj.quarter = this.baseObj.quarter.toString();
                        this.filesList1 = []
                        this.baseObj.trainImg.map(item => {
                            this.filesList1.push({
                                fileId: item.fileId,
                                id: item.id,
                                url: item.fileId,
                                name: item.fileName
                            })
                        })
                        this.filesList2 = []
                        this.baseObj.attachment.map(item => {
                            this.filesList2.push({
                                fileId: item.fileId,
                                id: item.id,
                                url: this.pathFile + item.fileId,
                                name: item.fileName
                            })
                        })
                        if (this.status == 3 && !this.show) {
                            this.baseObj.trainImg = this.baseObj.trainImg.map(obj => obj.id)
                            this.baseObj.attachment = this.baseObj.attachment.map(obj => obj.id)
                        }

                    }
                })
            },
            submit() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        if (this.status == 1 && !this.show2&&this.baseObj.attachment.length>0&&this.baseObj.attachment[0].id) {
                            this.baseObj.attachment = this.baseObj.attachment.map(obj => obj.id)
                        }
                         if (this.status == 1 && !this.show2&&this.baseObj.trainImg.length>0&&this.baseObj.trainImg[0].id) {
                            this.baseObj.trainImg = this.baseObj.trainImg.map(obj => obj.id)
                        }
                        api.trainPlanBaseAddOrUpdate(this.baseObj, this.type == 'add' ? 'add' : 'update').then((
                            r) => {
                            if (!r.status) {
                                this.$message({
                                    message: r.message,
                                    type: 'error'
                                });
                                return;
                            }
                            let str = this.type == 'edit' ? '编辑' : '添加'
                            this.$message({
                                message: '培训基本信息' + str + '成功!',
                                type: 'success'
                            });
                            this.show = true;
                            if (this.status == 1) {
                                this.show2 = true
                            }
                            if (this.type == 'add') {
                                this.$emit('ok', r.data)
                            } else {
                                this.get(this.id)
                            }
                        })
                    }
                })
            },
            getFiles(files, state) {
                this.baseObj.trainImg = files.map(item => item.id)
            },
            getAttachment(files, state) {
                this.baseObj.attachment = files.map(item => item.id)
            },
            previewImg(imgList, index, title) {
                this.PreviewFileList = []
                imgList.map(item => {
                    this.PreviewFileList.push(item.fileId)
                })
                this.PreviewIndex = index;
                this.PreviewTitle = title;
                this.PreviewShow = true;
            },
            async downloadFile(index, file) {
                let fileName = file.fileName;
                if (fileName) {
                    fileName = fileName.substr(0, fileName.lastIndexOf("."));
                }
                downloadFile(file.fileId, fileName);
            },
        }
    };
</script>
<style scoped lang="scss">
    .content {
        width: 750px;
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