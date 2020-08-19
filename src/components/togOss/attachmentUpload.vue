<!--oss-jc-->
<template>
    <div>
        <el-upload :file-list="picList" :class="picList.length<maxLength ? '':'upload-hide'" :action="obj.host"
            :on-success="uploadSuccess" :on-error="uploadError" :before-upload="beforeUpload" :show-file-list="false"
            :data="uploadData" :limit='maxLength' :disabled="disabled_">
            <el-button type="default">点击上传</el-button>
        </el-upload>
        <div class="show-success-file">
            <div class="file-item" v-for="(item,index) in picList" :key="index">
                <span class="file-name not-pic" @click.stop="downloadFile(index,item)">{{item.name}}</span>
                <span class="delete-btn" @click="removeFile(index,item)">删除</span>
            </div>
        </div>
    </div>
</template>

<script>
    import * as api from "api/common";
    import config from "utils/config";
    import {
        downloadFile
    } from "api/common";


    Array.prototype.arrayRemove = function (dx) {
        if (isNaN(dx) || dx > this.length) {
            return false;
        }
        this.splice(dx, 1);
    };
    export default {
        name: "attachmentUpload",
        props: {
            filesArr: {
                //编辑回显时必须
                type: Array,
                default: () => []
            },
            maxLength: { //最大上传数量
                type: Number,
                default: 5
            },

        },
        watch: {
            filesArr(val) {
                this.picList = [];
                this.filesArr.map(item => {
                    this.picList.push({
                        name: item.name,
                        fileId: item.fileId,
                        id: item.id,
                        url: item.url
                    })
                })
            }
        },
        data() {
            return {
                pathFile: '',
                disabled_: false,
                imageUrl: "",
                dialogVisible: false,
                picList: [],
                obj: {
                    accessid: "",
                    host: "", //地址
                    policyBase64: "",
                    signature: "", //时间
                    expire: 0,
                    callback: "",
                    key: "",
                    now: Date.parse(new Date()) / 1000,
                    dir: "" //key
                },
                uploadData: {}
            };
        },
        methods: {
            async downloadFile(index, file) {
                let fileName = file.name;
                if (fileName) {
                    fileName = fileName.substr(0, fileName.lastIndexOf("."));
                }
                downloadFile(file.fileId, fileName);
            },
            random_string(len, type) {
                //随机名字
                len = len || 32;
                var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
                var maxPos = chars.length;
                var pwd = "";
                for (let i = 0; i < len; i++) {
                    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
                }
                let date = new Date();
                let seperator1 = "-";
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                let fullDate = year + seperator1 + month + seperator1 + strDate;
                return fullDate + pwd + "." + type;
            },
            //上传前
            async beforeUpload(file) {
                this.disabled_ = true;
                return new Promise(async (resolve, reject) => {
                    if (["application/pdf"].indexOf(file.type) == -1) {
                        this.$message.error("请选择pdf格式的附件！");
                        this.disabled_ = false;
                        return reject(false);
                    }

                    if (file.size / 1024 / 1024 > 5) {
                        this.$message.error("上传失败、每个附件大小最多5M！");
                        this.disabled_ = false;
                        return reject(false);
                    }
                    await this.get_signature();
                    this.uploadData = {
                        key: this.obj.key +
                            this.random_string(
                                20,
                                file.type.substring(file.type.lastIndexOf("/") + 1)
                            ),
                        policy: this.obj.policyBase64,
                        OSSAccessKeyId: this.obj.accessid,
                        success_action_status: "200", //让服务端返回200,不然，默认会返回204
                        callback: this.obj.callbackbody,
                        signature: this.obj.signature,
                        "x:original_filename": file.name
                    };
                    return resolve(true)
                });
            },
            //上传成功
            uploadSuccess(response, file, fileList) {
                console.log(response.data, file, fileList, "uploadSuccess");
                let data = response.data
                this.picList.push({
                    name: data.fileName,
                    fileId: data.fileId,
                    id: data.id,
                    url: this.pathFile + data.fileId
                });
                this.$message.success("上传成功！");
                this.disabled_ = false;
                this.$emit('uploadSuccess', this.picList, '上传成功')
            },
            //上传失败
            uploadError(err, file, fileList) {
                //   console.log(err, file, fileList, "uploadError");
                this.$message.error("上传失败！");
                this.disabled_ = false;
                this.$emit('uploadError', this.picList, '上传失败')
            },
            //删除
            removeFile(index, item) {
                this.picList.arrayRemove(index);
                this.$emit('remove', this.picList, '删除')
            },
            async get_signature() {
                //获取是否超时
                // 可以判断当前expire是否超过了当前时间， 如果超过了当前时间， 就重新取一下，3s 作为缓冲。
                this.obj.now = Date.parse(new Date()) / 1000;
                let obj_ = {};
                console.log(this.obj.expire, this.obj.now);
                if (this.obj.expire < this.obj.now + 3) {
                    obj_ = await this.send_request();
                    this.obj.host = obj_["host"];
                    this.obj.policyBase64 = obj_["policy"];
                    this.obj.accessid = obj_["accessId"];
                    this.obj.signature = obj_["signature"];
                    this.obj.expire = parseInt(obj_["expire"]);
                    this.obj.callbackbody = obj_["callback"];
                    this.obj.key = obj_["dir"];
                }
            },
            async send_request() {
                //向后端得到签名
                let data = {};
                await api.policy('ANNEX').then(r => {
                    if (r.status && r.data && r.data !== null) {
                        data = r.data;
                    }
                });
                return data;
            }
        },
        created() {
            this.get_signature();
        },
        mounted() {
            this.pathFile = this.$store.getters.filePath;
            this.picList = [];
            this.filesArr.map(item => {
                this.picList.push({
                    name: item.name,
                    id: item.id,
                    fileId: item.fileId,
                    url: item.url
                })
            })
        }
    };
</script>

<style lang='scss'>
    .show-success-file {
        .file-item {
            .el-progress {
                display: inline-block;
                width: 130px;
            }

            .file-name {
                cursor: pointer;
                margin-right: 20px;
            }

            .file-name:hover {
                color: #1fabdc;
            }

            .not-pic {
                // color: #6d7787;
            }

            .delete-btn {
                color: #1787ad;
                cursor: pointer;
            }
        }
    }


    .upload-hide .el-upload {
        display: none;
    }
</style>