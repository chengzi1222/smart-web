<template>
    <el-dialog :title="dialogData.title" :visible.sync="showTip" :modal-append-to-body="false"
        :close-on-click-modal="false" width="40%" :before-close="handleClose">
        <div class="tip">提示:处理方式为“未发现问题“或”已补传记录“，该预警的扣分会清零。处理方式为“确认存在问题”的情况下，可更改扣分分值。</div>
        <el-form :model="form" label-width="100px" :rules="rules" ref="ruleForm">
            <el-form-item label="处理方式" prop="handleType">
                <el-select v-if='disposeType=="01"' v-model="form.handleType" placeholder="请选择处理方式" @change="resetGrade" clearable>
                    <el-option v-for="(item,i) in handle" :key="i" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-if='disposeType=="02"' v-model="form.handleType" placeholder="请选择处理方式" @change="resetGrade" clearable>
                    <el-option v-for="(item,i) in handle2" :key="i" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-if='disposeType=="03"' v-model="form.handleType" placeholder="请选择处理方式" @change="resetGrade" clearable>
                    <el-option v-for="(item,i) in handle3" :key="i" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="扣分" v-if="form.handleType == '01'" prop="deduction">
                <el-select v-model="form.deduction" placeholder="请选择扣分分数" clearable>
                    <el-option v-for="(item,i) in grade" :key="i" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="扣分" prop="deduction" v-if="form.handleType == '02'">
                <el-input v-model="form.deduction" style="width: 60%" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="处理人" prop="handlePersonName">
                <el-input v-model="form.handlePersonName" placeholder="请输入处理人" clearable style="width: 60%"></el-input>
            </el-form-item>
            <el-form-item label="处理备注" prop="handleRemark">
                <el-input type="textarea" placeholder="请输入处理备注, 300字以内, 选填" :autosize="{minRows: 12, maxRows: 15}"
                    maxlength="300" v-model="form.handleRemark" style="width: 60%;"></el-input>
                <span class="tipText">(选填)</span>
            </el-form-item>
            <el-form-item label="处理附件" prop="handleRemark">
                <xcwsUpload :maxLength=3 @uploadSuccess='getFiles' @uploadError="getFiles" @remove='getFiles'
                    :filesArr='detailFilesArr'></xcwsUpload>
                <!-- filesArr:[],回显的时候必传 -->
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button :disabled="btn" type="primary" @click="comfirmAdd">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import * as guard from "api/xcws/warn/food";
    import xcwsUpload from "components/xcwsUpload";

    export default {
        name: "disposeDialog",
        components: {
            xcwsUpload
        },
        props: {
            showTip: {
                type: Boolean,
                default: true
            },
            dialogData: {
                type: Object,
            },
            url: {
                type: String
            },
            disposeType:{
                type: String,
                default: '01'
            }
        },
        data() {
            return {
                detailFilesArr:[],
                btn: false,
                submitUrl: '',
                form: {
                    handlePersonName: '',
                    handleType: '',
                    deduction: 0,
                    handleRemark: '',
                    id: '',
                    fidList:[],
                    entityId: '',
                    ewDate: '',
                    ewType: ''
                },
                fidList:[],
                formId: '',
                handle: [{
                        label: '确认存在问题, 并整改',
                        value: '01'
                    },
                    {
                        label: '未发现问题,解除预警',
                        value: '02'
                    }
                ],
                handle2: [{
                        label: '确认存在问题, 并整改',
                        value: '01'
                    },
                    {
                        label: '未发现问题,解除预警',
                        value: '02'
                    }, {
                        label: '数据未上传，已补传相关数据',
                        value: '06'
                    }
                ],
                handle3: [{
                    label: '无效投诉建议，解除预警',
                    value: '04'
                }, {
                    label: '投诉建议已反馈解决，解除预警',
                    value: '05'
                }],
                grade: [],
                rules: {
                    handlePersonName: [{
                        required: true,
                        message: '请输入处理人',
                        trigger: 'blur'
                    }, ],
                    handleType: [{
                        required: true,
                        message: '请选择处理方式',
                        trigger: 'change'
                    }],
                    deduction: [{
                        required: true,
                        message: '请选择扣分',
                        trigger: 'change'
                    }],
                    handleRemark: [{
                        min: 0,
                        max: 300,
                        message: '请输入300字以内的备注',
                        trigger: 'blur'
                    }],
                }
            }
        },
        mounted() {
            this.form.id = this.dialogData.id;
            this.form.entityId = this.dialogData.entityId;
            this.form.ewDate = this.dialogData.ewDate;
            this.form.ewType = this.dialogData.ewType;
            this.form.deduction = this.dialogData.deduction;
            this.submitUrl = this.url;
            this.getGrade();
            if (this.dialogData.id && this.dialogData.title == '重新处理') {
                this.form.handleType = this.dialogData.handleType;
                this.form.handlePersonName = this.dialogData.handlePersonName;
                this.form.handleRemark = this.dialogData.handleRemark;
                this.detailFilesArr = this.dialogData.fidList;
                this.fidList= this.dialogData.fidList;
            }
        },
        methods: {
            getFiles(files, state) {
                this.fidList = files;
            },
            cancel() {
                this.$emit("cancel")
            },
            refreshList() {
                this.$emit("refresh")
            },
            resetGrade() {
                this.form.deduction = 0;
            },
            getGrade() {
                this.grade = [];
                for (let i = 0; i <= this.dialogData.defaultDeduction; i++) {
                    let result = {
                        label: `${i}分`,
                        value: i
                    }
                    this.grade.push(result);
                }
            },
            async comfirmAdd() {
                this.btn = true;
                this.$refs.ruleForm.validate(async (valid) => {
                    if (valid) {
                        this.form.fidList=this.fidList.map(item => item.fileId)
                        let result = await guard.handleDetail(this.form, this.submitUrl);
                        if (result.status) {
                            this.$message({
                                message: '处理成功',
                                type: 'success'
                            });
                            this.cancel();
                            this.refreshList();
                            this.btn = false;
                        } else {
                            this.btn = false;
                        }
                    } else {
                        this.btn = false;
                        return false;
                    }
                });
            },
            handleClose() {
                this.$emit("cancel")
            },
        }
    }
</script>

<style scoped lang="scss">
    .tip {
        width: 95%;
        margin: 0 auto 30px auto;
        background: rgba(255, 243, 233, 1);
        border: 1px solid rgba(255, 214, 182, 1);
        color: #F1822A;
        font-size: 14px;
        line-height: 20px;
        font-weight: 400;
        padding: 10px 20px;
        box-sizing: border-box;
    }

    .tipText {
        color: #A2AAB6;
        font-size: 12px;
        line-height: 17px;
        font-weight: 400;
        margin-left: 6px;
    }
</style>