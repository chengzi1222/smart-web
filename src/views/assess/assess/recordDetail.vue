<template>
    <div>
        <div class="page-tilt">
            <b></b><span>考题详情</span>
        </div>
        <p class="text textC mt20 mb20">考核名称：<span class="col39 ml10">{{name}}</span></p>
        <toggle-form title="单选题">
            <div class="mt30">
                <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                    :data="tableData1" class="table-div">
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
                    <el-table-column show-overflow-tooltip prop="correct" min-width="80" label="正确答案">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="optionalAnswer" min-width="150" label="已选">
                    </el-table-column>
                </el-table>
            </div>
        </toggle-form>
        <ToggleForm title="多选题">
            <div class="mt30">
                <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                    :data="tableData2" class="table-div">
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
                    <el-table-column show-overflow-tooltip prop="correct" min-width="80" label="正确答案">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="optionalAnswer" min-width="150" label="已选">
                    </el-table-column>
                </el-table>
            </div>
        </ToggleForm>
        <ToggleForm title="判断题">
            <div class="mt30 mb200">
                <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                    :data="tableData3" class="table-div">
                    <el-table-column type="index" label="序号" min-width="80"></el-table-column>
                    <el-table-column show-overflow-tooltip min-width="300" label="题目" prop="title">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="correct" min-width="80" label="正确答案">
                        <template slot-scope="scope">
                            {{scope.row.correct==1?'对':"错"}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="optionalAnswer" min-width="150" label="已选">
                         <template slot-scope="scope">
                            {{scope.row.optionalAnswer==1?'对':"错"}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </ToggleForm>
        <div class="foot-btn" style="z-index:998">
            <div>
                <el-button class="w100 mr10" @click="$router.go(-1)">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import ToggleForm from "components/ToggleForm.vue";
    import * as api from "api/assess/index";
    export default {
        data() {
            return {
                recordId: '',
                loading: false,
                tableData1: [],
                tableData2: [],
                tableData3: [],
                name:''
            };
        },
        components: {
            ToggleForm,
        },
        mounted() {
            if (this.$route.query.id) {
                this.recordId = this.$route.query.id;
            }
            this.searchPage()
        },
        methods: {
           
            searchPage() {
                this.loading = true;
                api.assessPlanExamDetail({
                    recordId:this.recordId
                }).then(result => {
                    if (result.status) {
                        this.tableData1 = result.data.singleChoice;
                        this.tableData2 = result.data.multipleChoice;
                        this.tableData3 = result.data.judge;
                        this.name=result.data.name;
                    } else {
                        this.$message.warning("列表数据获取失败！请稍候重试");
                    }
                    this.loading = false;
                });
            },
        },
        watch: {}
    };
</script>

<style scoped lang="scss">
    // 左边悬浮信息栏的样式 start
    $c: #0db5ef;


    .mt30 {
        margin-top: 30px;
    }

    p.text {
        font-size: 14px;
        color: #6D7787;
        line-height: 16px;
        margin: 0 30px;
    }

    .pagination-box {
        text-align: right;
        margin-top: 20px;
    }
</style>