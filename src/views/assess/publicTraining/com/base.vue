<template>
    <el-form :model="baseObj" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <ToggleForm title="基础信息">
            <div class="content">
                <el-form-item label="培训标题：" prop="name">
                    <el-input placeholder="请输入培训标题" class="w300" maxlength="15" v-model="baseObj.name"></el-input>
                </el-form-item>
                <el-form-item label="培训类型：" prop="name">
                    <el-select  class="w300" v-model="baseObj.hasProcessedEw" :clearable="true"
                        placeholder="培训类型">
                        <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="培训年度：" prop="name">
                    <el-date-picker class="w300" :picker-options="pickerOptions" v-model="baseObj.month" type="month"
                        format="yyyy-MM" value-format="yyyy-MM" :editable="false" :clearable="true" placeholder="培训年度">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="培训季度：" prop="name">
                    <el-select  class="w300" v-model="baseObj.hasProcessedEw" :clearable="true"
                        placeholder="培训季度">
                        <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="其他附件：">
                    <el-upload class="avatar-uploader" action="" :http-request="uploadImg" :show-file-list="false"
                        :on-error="fileUploadError" :before-upload="beforeAvatarUpload">
                        <el-button type="default" style="background:#F6F7F8;margin-right:20px;">点击上传</el-button>
                    </el-upload>
                    <span
                        style="white-space:nowrap;position:absolute;left:100px;top:-8px;max-width:316px;color: #A2AAB6;font-size:12px;margin-top: 10px;">最多上传5个文件，文件格式：jpg，png，doc，pdf</span>
                    <div class="show-success-file">
                        <div class="file-item" v-for="(item,index) in uploadArr" :key="index">
                            <span class="file-name not-pic" @click.stop="downloadFile(index,item)"
                                v-if="['png','jpg','jpeg'].indexOf(item.type)==-1">{{item.fileName}}</span>
                            <span class="file-name" @click.stop="showBigPic=index"
                                v-if="~['png','jpg','jpeg'].indexOf(item.type)">{{item.fileName}}</span>
                            <el-progress :percentage="percentage"
                                v-if="(index==(uploadArr.length-1)) && (percentage < 100)"></el-progress>
                            <span class="delete-btn" @click="removeFile(index,item)">删除</span>
                            <div class='big-img' v-show="showBigPic==index" @click.stop="showBigPic = -1"
                                v-if="~['png','jpg','jpeg'].indexOf(item.type)">
                                <img :src="pathFile + item.path" alt="">
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </div>
        </ToggleForm>
    </el-form>
</template>

<script>
    import ToggleForm from "components/ToggleForm.vue";
    import {
        uploadFile,
        downloadFile
    } from "api/common";
    import {
        removeFile
    } from "api/cfda/add";
    /*
     * 方法:Array.arrayRemove(dx)
     * 功能:删除数组元素.
     * 参数:dx删除元素的下标.
     * 返回:在原数组上修改数组.
     */
    Array.prototype.arrayRemove = function (dx) {
        if (isNaN(dx) || dx > this.length) {
            return false;
        }
        this.splice(dx, 1);
    };
    export default {
        components: {
            ToggleForm
        },
        data() {
            return {
                limit: 5, //限制文件上传的个数
                showBigPic: -1, //是否展示大图
                uploadArr: [], //上传成功的图片数组
                percentage: 0, //需要关联的进度条
                pathFile: this.$store.getters.filePath,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6;
                    }
                },
                rules: {},
                select: [{
                        name: "存在",
                        key: true
                    },
                    {
                        name: "不存在",
                        key: false
                    }
                ],
                baseObj: {},

            };
        },

        mounted() {
            this.pathFile = this.$store.getters.filePath;
        },
        methods: {
            async uploadImg(file, callback) {
                // 上传数量限制
                if (this.uploadArr.length >= this.limit) {
                    this.$message({
                        message: "最多上传" + this.limit + "个文件!",
                        type: "warning"
                    });
                    return;
                }
                this.isUploadImag = true;
                var formdata = new FormData();
                let fileName = file.file.name;
                let fileType = file.file.type.split("/")[1];
                formdata.append("file", file.file);

                let _this = this;
                _this.uploadArr.push(
                    Object.assign({}, {
                        fileName: fileName,
                        type: fileType,
                        id: "",
                        fileId: "",
                        path: ""
                    })
                );

                // 更新进度条
                function callback(e) {
                    _this.percentage = Math.floor(e.percent);
                }

                await uploadFile(formdata, {
                    type: "PATROL_PLAN"
                }, callback).then(
                    result => {
                        //          console.log(result)
                        let data = result.data;
                        //          let url = "http://192.168.1.40/fdfs/" + result.data;
                        _this.uploadArr[_this.uploadArr.length - 1].path = data.fileId;
                        _this.uploadArr[_this.uploadArr.length - 1].id = data.id;
                        _this.uploadArr[_this.uploadArr.length - 1].fileId = data.fileId;
                        _this.planData.file = result.data;
                        _this.imageUrl = result.data;
                        this.isUploadImag = false;
                    }
                );
            },
            // 删除上传的文件
            async removeFile(index, file) {
                /*   console.log(file)  */
                this.$confirm("是否确认删除该文件吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                }).then(() => {
                    if (this.$route.query.opt == "edit") {
                        removeFile(file.id).then(res => {
                            this.$message.success("文件删除成功！");
                        });
                    }
                    this.uploadArr.arrayRemove(index);
                });
            },
            fileUploadError(err, file) {
                if (this.uploadArr && this.uploadArr.length > 0) {
                    let ua = this.uploadArr[this.uploadArr.length - 1];
                    if (!ua.url) {
                        this.uploadArr.arrayRemove(this.uploadArr.length - 1);
                    }
                }
                this.$message.warning("该文件上传失败！");
            },
            beforeAvatarUpload(file) {
                //类型和大小限制
                var picType = ["doc", "jpg", "png", "pdf"];
                var testmsg = file.name
                    .substring(file.name.lastIndexOf(".") + 1)
                    .toLowerCase();
                if (!this.IsInArray(picType, testmsg)) {
                    this.$message.warning(`仅可上传jpg，png，doc，pdf格式的文件`);
                    return false;
                }
                if (file.size / 1024 / 1024 > 10) {
                    this.$message.warning(`上传文件大小不能超过10M`);
                    return false;
                }
            },
            async downloadFile(index, file) {
                let fileName = file.fileName;
                if (fileName) {
                    fileName = fileName.substr(0, fileName.lastIndexOf("."));
                }
                // window.open(downloadFile(file.fileId,fileName));
                downloadFile(file.fileId, fileName);
            },
            //判断数组是否包含字符串
            IsInArray(arr, val) {
                var testStr = arr.join(",");
                return testStr.indexOf(val) != -1;
            }
        }
    };
</script>
<style scoped lang="scss">
    .content {
        width: 700px;
        margin: 30px auto 0;
    }

    .w550 {
        width: 550px !important;
    }
</style>