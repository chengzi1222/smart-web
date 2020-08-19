<template>
    <div>
        <ToggleForm title="单选题">
            <div class="mt30 ">
                <div class="mb20 clear_a">
                    <el-input placeholder="题干名称" class="w250 seekIpt" v-model="queryLimit.keyword"
                        @keyup.enter.native="changeSearch">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch"></i>
                    </el-input>
                    <el-button class="w120 fr ml20" type="primary" @click="add('add',null)" v-if='num<=2000'>
                        <i style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>添加单选题
                    </el-button>
                    <el-upload action="" v-if='num<=2000' class="fr" style="display: inline-block"
                        :show-file-list="false" :http-request="uploadConfig" :on-error="fileUploadError"
                        :before-upload="beforeAvatarUploadImport">
                        <el-button class="w100 ml20" type="primary">导入</el-button>
                    </el-upload>
                    <el-button class="w120 fr" @click="downTableTemplet">下载导入模板</el-button>
                </div>
                <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                    :data="tableData" class="table-div">
                    <el-table-column type="index" label="序号" min-width="80"></el-table-column>
                    <el-table-column show-overflow-tooltip min-width="300" label="题目">
                        <template slot-scope="scope">
                            <p class="text mb10 textell">{{scope.row.title}}（）</p>
                            <p class="text mb10 textell">A.{{scope.row.choiceA}}</p>
                            <p class="text mb10 textell">B.{{scope.row.choiceB}}</p>
                            <p class="text mb10 textell">C.{{scope.row.choiceC}}</p>
                            <p class="text textell">D.{{scope.row.choiceD}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="correct" min-width="80" label="正确答案"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="resolve" min-width="150" label="考题解析">
                    </el-table-column>
                    <el-table-column label="操作" min-width="80" fixed="right">
                        <template slot-scope="scope">
                            <a href="javascript:;" class="operate-a" @click="add('update',scope.row)">编辑</a>
                            <a href="javascript:;" class="operate-a" @click="del(scope.row)">删除</a>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-box textR mt20 mb20">
                    <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
                        :current-page="queryLimit.pageNum" :page-sizes="[10, 20, 30, 40,50]"
                        :page-size="queryLimit.pageSize" layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </ToggleForm>
        <!-- 弹窗 -->
        <yb-popup @close="close" :isShow="isShow" :title="addPopTypeTitle" width="588">
            <div slot="body">
                <el-form v-if='isShow' :model="addData" ref="ruleForm" label-width="120px">
                    <div style="width:500px;margin:20px auto">
                        <el-form-item label="题干：" required>
                            <el-input placeholder="300字以内" class="w300" maxlength="300" :rows="5" type="textarea"
                                v-model="addData.title"></el-input>
                        </el-form-item>
                        <el-form-item label="A:" required>
                            <el-input placeholder="50字以内" class="w300" maxlength="50" v-model="addData.choiceA">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="B:" required>
                            <el-input placeholder="50字以内" class="w300" maxlength="50" v-model="addData.choiceB">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="C:" required>
                            <el-input placeholder="50字以内" class="w300" maxlength="50" v-model="addData.choiceC">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="D:" required>
                            <el-input placeholder="50字以内" class="w300" maxlength="50" v-model="addData.choiceD">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="正确答案：" required>
                            <el-radio-group v-model="addData.correct">
                                <el-radio :label="'A'">A</el-radio>
                                <el-radio :label="'B'">B</el-radio>
                                <el-radio :label="'C'">C</el-radio>
                                <el-radio :label="'D'">D</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="考题解析：" required>
                            <el-input placeholder="300字以内" class="w300" maxlength="300" :rows="5" type="textarea"
                                v-model="addData.resolve"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div slot="foot" style="padding-bottom:20px;">
                <el-button class="w80" type="default" @click="close">取消</el-button>
                <el-button class="w80" type="default" @click="addPop(0)">保存</el-button>
                <el-button class="w100" type="primary" @click="addPop(1)" v-if='addPopType=="add"'>保存并新建</el-button>
            </div>
        </yb-popup>
    </div>
</template>

<script>
    import ToggleForm from "components/ToggleForm.vue";
    import YbPopup from 'components/ybpopup/YbPopup.vue'
    import * as api from "api/assess/index";
    export default {
        props: {
            id: {
                type: String,
                default: ''
            },
            num: {
                type: Number,
                default: 0
            }
        },
        components: {
            ToggleForm,
            YbPopup
        },
        data() {
            return {
                type: 'add',
                total: 0,
                queryLimit: {
                    keyword: '',
                    pageNum: 1,
                    pageSize: 10,
                    type: 1,
                    questionDepotId: '',
                },
                addData: {
                    id: '',
                    questionDepotId: '',
                    type: 1,
                    title: '',
                    choiceA: '',
                    choiceB: '',
                    choiceC: '',
                    choiceD: '',
                    correct: '',
                    resolve: '',
                },
                addPopType: 'add',
                addPopTypeTitle: '添加单选题',
                isShow: false,
                loading: false,
                tableData: [],
                importLoad: false
            };
        },
        mounted() {
            if (this.$route.query.type) {
                this.type = this.$route.query.type;
            }
            this.searchPage()
        },
        methods: {
            //下载要点表导入模板
            downTableTemplet() {
                location.href = `/api/pxkh/question/template?type=singleChoice`;
            },
            beforeAvatarUploadImport(file) {
                return new Promise(async (resolve, reject) => {
                    let type = file.name.substr(file.name.lastIndexOf('.'))
                    if (type !== '.xlsx' && type !== '.xls') {
                        this.$message.warning('上传格式错误')
                        return reject(false);
                    }
                    return resolve(true)
                });
            },
            fileUploadError(err, file) {
                this.$message.warning("文件上传失败！");
            },
            uploadConfig(file, callback) {
                this.importLoad = true;
                var formdata = new FormData()
                formdata.append('excelFile', file.file);
                formdata.append('questionDepotId', this.id);
                formdata.append('choiceType', 1);
                api.uploadFileQuestion(formdata).then((r) => {
                    this.importLoad = false;
                    if (r.status) {
                        this.$message.success('导入成功!');
                    } else {
                        this.$message.error('导入失败!');
                    }
                    this.searchPage();
                })
            },
            add(type, row) {
                this.addPopType = type;
                this.addPopTypeTitle = type == 'add' ? '添加单选题' : '编辑单选题';
                this.isShow = true;
                this.addData = {
                    id: '',
                    questionDepotId: this.id,
                    type: 1,
                    title: '',
                    choiceA: '',
                    choiceB: '',
                    choiceC: '',
                    choiceD: '',
                    correct: '',
                    resolve: '',
                }
                if (type == 'update') {
                    this.addData = {
                        id: row.id,
                        questionDepotId: this.id,
                        type: 1,
                        title: row.title,
                        choiceA: row.choiceA,
                        choiceB: row.choiceB,
                        choiceC: row.choiceC,
                        choiceD: row.choiceD,
                        correct: row.correct,
                        resolve: row.resolve,
                    }
                }
            },
            del(row) {
                this.$confirm("是否确定删除该题?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const data = new FormData()
                    data.append('id', row.id)
                    api.questionChoiceDel(data).then(r => {
                        if (r.status) {
                            this.$message.success("删除成功")
                            this.changeSearch()
                        }
                    })
                })
            },
            changeSearch() {
                this.queryLimit.pageNum = 1;
                this.searchPage();
            },
            pagecCurrentChange(num) {
                this.queryLimit.pageNum = num;
                this.searchPage();
            },
            pageSizeChange(size) {
                this.queryLimit.pageSize = size;
                this.changeSearch();
            },
            searchPage() {
                this.loading = true;
                this.queryLimit.questionDepotId = this.id
                api.questionChoiceList(this.queryLimit).then(result => {
                    if (result.status) {
                        this.tableData = result.data.list;
                        this.total = result.data.total;
                    } else {
                        this.$message.warning("列表数据获取失败！请稍候重试");
                    }
                    this.$emit('questionDepotCount')
                    this.loading = false;
                });
            },
            changeSearch() {
                this.queryLimit.pageNum = 1;
                this.searchPage();
            },
            addPop(again) {
                if (this.addData.title == '' || this.addData.choiceA == '' || this.addData.choiceB == '' || this.addData
                    .choiceC == '' || this.addData.choiceD == '' || this.addData.correct == '' || this.addData
                    .resolve == '') {
                    this.$message.error('所有必填！请仔细填好每一项！')
                    return
                }
                const data = new FormData()
                data.append('id', this.addData.id)
                data.append('questionDepotId', this.id)
                data.append('type', 1)
                data.append('title', this.addData.title)
                data.append('choiceA', this.addData.choiceA)
                data.append('choiceB', this.addData.choiceB)
                data.append('choiceC', this.addData.choiceC)
                data.append('choiceD', this.addData.choiceD)
                data.append('correct', this.addData.correct)
                data.append('resolve', this.addData.resolve)
                api.questionChoiceAddOrUpdate(data, this.addPopType).then((r) => {
                    if (!r.status) {
                        this.$message({
                            message: r.message,
                            type: 'error'
                        });
                        this.close();
                        return;
                    }
                    if (again) {
                        this.$message({
                            message: '添加成功!继续添加下一条',
                            type: 'success'
                        });
                        this.add('add', null)
                    } else {
                        let str = this.addPopType == 'update' ? '编辑' : '添加'
                        this.$message({
                            message: str + '成功!',
                            type: 'success'
                        });
                        this.close();
                    }
                })
            },
            close() {
                // 清除数据
                this.isShow = false;
                this.changeSearch();
            },
        }
    };
</script>
<style scoped lang="scss">
    .mt30 {
        margin-top: 30px;
    }

    p.text {
        font-size: 12px;
        color: rgba(59, 59, 59, 1);
        line-height: 16px;
        text-align: left;
    }

    .w80 {
        width: 80px !important;
    }
</style>