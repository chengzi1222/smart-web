<template>
    <el-form :model="baseObj" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <ToggleForm title="基础信息">
            <div class="content">
                <div class="row">
                    <el-form-item label="考核名称：" prop="name">
                        <p v-if='show'>{{baseObj.name}}</p>
                        <el-input v-else placeholder="30字以内" class="w300" maxlength="30" v-model="baseObj.name">
                        </el-input>
                        <p class='tip' :class="{'ml0':show}" v-if="baseObj.trainName!=''">此考核计划为({{baseObj.trainName}})关联创建！</p>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="考核年度：" prop="year">
                        <p v-if='show'>{{baseObj.year}}</p>
                        <el-select v-else class="w200 " v-model="baseObj.year" :clearable="true" placeholder="请选择考核年度">
                            <el-option v-for="item in year" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="考核季度：" prop="quarter">
                        <p v-if='show'>{{quarter[baseObj.quarter]}}</p>
                        <el-select v-else class="w200" v-model="baseObj.quarter" :clearable="true"
                            placeholder="请选择考核季度">
                            <el-option v-for="(item,key) in quarter" :key="key" :label="item" :value="key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="补考次数：" prop="againTime">
                        <p v-if='show'>{{baseObj.againTime>=0?baseObj.againTime+'次':'不限次数'}}</p>
                        <el-radio-group v-else v-model="baseObj.againTime">
                            <el-radio :label="againTime">
                                <el-select class="w200" @change="baseObj.againTime=againTime" v-model="againTime"
                                    placeholder="请选择补考次数" :disabled='baseObj.againTime===0'>
                                    <el-option v-for="item in againTimeArr" :key="item.key" :label="item.name"
                                        :value="item.key">
                                    </el-option>
                                </el-select>
                            </el-radio>
                            <el-radio :label="0"><span :class='{"tip":baseObj.againTime==againTime}'>不支持补考</span>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="考核时长：" prop="duration">
                        <p v-if='show'>{{baseObj.duration==-1?'不限时间':baseObj.duration+'分钟'}}</p>
                        <el-radio-group v-else v-model="baseObj.duration">
                            <el-radio :label="duration">
                                <el-input-number class="w200" @blur="validated" :disabled='baseObj.duration==-1'
                                    placeholder="1-300分钟，正整数" v-model="duration" controls-position="right" :min="1"
                                    :max="300" :precision="0">
                                </el-input-number>
                            </el-radio>
                            <el-radio :label="-1"><span :class='{"tip":baseObj.duration==duration}'>不限时间</span>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="其他附件：">
                        <div v-if='show' class="show-success-file">
                            <div v-if='baseObj.adjunct.length>0'>
                                <div class="file-item" v-for="(item,index) in baseObj.adjunct" :key="index">
                                    <span class="file-name not-pic"
                                        @click.stop="downloadFile(index,item)">{{item.fileName}}</span>
                                </div>
                            </div>
                            <p v-else>暂无附件</p>
                        </div>
                        <attachmentUpload v-else :maxLength=1 @uploadSuccess='getAttachment'
                            @uploadError="getAttachment" @remove='getAttachment' :filesArr='filesArr'>
                        </attachmentUpload>
                        <p class="tip" style="margin-left:0">最多1个附件，支持pdf文档格式，附件最大为5M</p>
                    </el-form-item>
                </div>
            </div>
            <div class="textR">
                <el-button type="primary w100" @click="submit" v-if='!show'>保存
                </el-button>
                <el-button type="primary w100" @click="show=false" v-if='show&&type=="edit"&&status==1'>编辑
                </el-button>
            </div>
        </ToggleForm>
    </el-form>
</template>

<script>
    import ToggleForm from "components/ToggleForm.vue";
    import * as api from "api/assess/index";
    import {
        downloadFile
    } from "api/common";
    import attachmentUpload from "components/togOss/attachmentUpload";
    import {
        getPublic,
        getEntityType,
        getYear,
        againTimeArr
    } from "../../com.js";
    export default {
        components: {
            ToggleForm,
            attachmentUpload
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
        computed: {
            pathFile() {
                return this.$store.getters.filePath;
            }
        },
        data() {
            return {
                status: 1,
                show: false,
                type: 'add',
                year: getYear(),
                quarter: getPublic().quarter,
                status: getPublic().status,
                filesArr: [
                    // fileId: row.cover[0].fileId,
                    // id: row.cover[0].id,
                    // url: this.pathFile + row.cover[0].fileId,
                    // name: row.cover[0].fileName
                ],
                rules: {
                    name: [{
                        required: true,
                        message: '请输入考核名称',
                        trigger: 'blur'
                    }, ],
                    year: [{
                        required: true,
                        message: '请选择考核年度',
                        trigger: 'blur'
                    }, ],
                    quarter: [{
                        required: true,
                        message: '请选择考核季度',
                        trigger: 'blur'
                    }, ],
                    againTime: [{
                        required: true,
                        message: '请输入补考次数',
                        trigger: 'blur'
                    }, ],
                    duration: [{
                        required: true,
                        message: '请输入考核时长',
                        trigger: 'blur'
                    }, ],
                },
                againTimeArr: againTimeArr(),
                againTime: 1,
                duration: 1,
                baseObj: {
                    adjunct: "",
                    againTime: 1,
                    duration: 1,
                    id: "",
                    name: "",
                    quarter: '',
                    trainId: "",
                    trainName:'',
                    year: "",
                },
            };
        },

        mounted() {
            let mydate = new Date();
            this.baseObj.year = mydate.getFullYear()
            if (this.$route.query.type) {
                this.type = this.$route.query.type;
            }
            if (this.$route.query.trainId) {
                this.baseObj.trainId = this.$route.query.trainId;
                this.baseObj.trainName = this.$route.query.trainName;
            }
            if (this.$route.query.status) {
                this.status = this.$route.query.status;
                this.show = this.status == 2 ? true : false
            }

        },
        methods: {
            validated() {
                if (!this.duration) {
                    this.duration = 1;
                    this.baseObj.duration = 1
                } else {
                    this.baseObj.duration = this.duration
                }

            },
            async downloadFile(index, file) {
                let fileName = file.fileName;
                if (fileName) {
                    fileName = fileName.substr(0, fileName.lastIndexOf("."));
                }
                downloadFile(file.fileId, fileName);
            },
            get(id_) {
                api.assessPlanBasicDetail(id_).then(r => {
                    if (r.status) {
                        this.baseObj = r.data;
                        this.baseObj.quarter = this.baseObj.quarter.toString();
                        this.filesArr = []
                        this.againTime=this.baseObj.againTime==0?'':this.baseObj.againTime;
                        this.duration=this.baseObj.duration;
                        this.baseObj.adjunct.map(item => {
                            this.filesArr.push({
                                fileId: item.fileId,
                                id: item.id,
                                url: item.fileId,
                                name: item.fileName
                            })
                        })
                    }
                })
            },
            submit() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        if (this.status == 1 && this.type == 'edit' && this.baseObj.adjunct.length > 0 && this
                            .baseObj.adjunct[0].id) {
                            this.baseObj.adjunct = this.baseObj.adjunct.map(obj => obj.id)
                        }
                        this.baseObj.adjunct = this.baseObj.adjunct.toString()
                        api.assessPlanBasicUpdate(this.baseObj).then((r) => {
                            if (!r.status) {
                                this.$message({
                                    message: r.message,
                                    type: r.level
                                });
                                return;
                            }
                            let str = this.type == 'edit' ? '编辑' : '添加'
                            this.$message({
                                message: '考核计划基本信息' + str + '成功!',
                                type: 'success'
                            });
                            this.show = true;
                            if (this.type == 'add') {
                                this.$emit('ok', r.data)
                            } else {
                                this.get(this.id)
                            }
                        })
                    }
                })
            },

            getAttachment(files, state) {
                this.baseObj.adjunct = files.map(item => item.id)
            },
        }
    };
</script>
<style scoped lang="scss">
    .content {
        width: 780px;
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
    .ml0{
        margin-left: 0;
    }
</style>