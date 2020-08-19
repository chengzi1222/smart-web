<template>
    <div>
        <ToggleForm title="题库管理">
            <div class="mt30">
                <div class="mb20">
                    <el-button class="w120" type="primary" @click="addPop" v-if="!show">
                        <i style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"
                            v-if='addData.questionDepotId==""'></i>{{addData.questionDepotId==''?'添加题库':'更换题库'}}
                    </el-button>
                </div>
                <el-table :border="true" :resizable="true" :data="tableData" class="table-div">
                    <el-table-column type="index" label="序号" min-width="80"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="name" min-width="120" label="题库名称">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="description" min-width="200" label="题库描述">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="entityTypeStr" min-width="80" label="行业类型">
                    </el-table-column>
                    <el-table-column min-width="80" label="考题类型">
                        <template slot-scope="scope">
                            <div v-if='!show'>
                                <el-tooltip class="item" effect="dark" content="随机考题的概念为考核人员考核题目为随机分配，统一考题所有考核人员为同一套题"
                                    placement="top-start">
                                    <el-switch v-model="addData.pumpType" active-color="#0DB5EF"
                                        inactive-color="#C2CAD2" :active-value="1" :inactive-value="0">
                                    </el-switch>
                                </el-tooltip>
                                {{addData.pumpType==0?'随机考题':'统一考题'}}
                            </div>
                            <p v-else>
                                {{addData.pumpType==0?'随机考题':'统一考题'}}
                            </p>
                        </template>
                    </el-table-column>

                </el-table>
                <div class="mt20 clear_a scoreBox" v-if="tableData.length>0">
                    <el-table :border="true" :resizable="true" :data="tableData2" class="table-div left">
                        <el-table-column show-overflow-tooltip prop="name" min-width="80" label="题型">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="topicNum" min-width="80" label="题型总数(个)">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="spotCheckNum" min-width="120" label="抽考数量 (个)">
                            <template slot-scope="scope">
                                <p v-if="show">{{scope.row.spotCheckNum}}</p>
                                <div v-else>
                                    <el-input-number class="w100" v-if="scope.$index!=3"
                                        @blur="computeScore(scope.row,scope.$index)"
                                        @change="computeScore(scope.row,scope.$index)" v-model="scope.row.spotCheckNum"
                                        controls-position="right" :min="0" :max="scope.row.topicNum" :precision="0">
                                    </el-input-number>
                                    <p v-else>-</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="score" min-width="120" label="每题分值 (分)">
                            <template slot-scope="scope">
                                <p v-if="show">{{scope.row.score}}</p>
                                <div v-else>
                                    <el-input-number class="w100" v-if="scope.$index!=3"
                                        @blur="computeScore(scope.row,scope.$index)"
                                        @change="computeScore(scope.row,scope.$index)" v-model="scope.row.score"
                                        controls-position="right" :min="0" :max="100" :precision="0">
                                    </el-input-number>
                                    <p v-else>-</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="sumScore" min-width="80" label="合计 (分)">
                            <template slot-scope="scope">
                                <p style="line-height:38px">{{scope.row.sumScore}}</p>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-table :border="true" :resizable="true" :data="tableData3" class="table-div right">
                        <el-table-column show-overflow-tooltip prop="name" min-width="100" label="等级">
                            <template slot-scope="scope">
                                <p class="p">{{scope.row.name}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="number" min-width="200" label="范围">
                            <template slot-scope="scope">
                                <p v-if="show" style="line-height:38px">
                                    {{scope.$index!=3?'>=':'<='}}{{scope.row.number}}</p>
                                <div v-else>
                                    {{scope.$index!=3?'>=':'<='}}
                                    <el-input-number class="w100" v-model="scope.row.number" controls-position="right"
                                        :min="1" :max="100" :precision="0" @blur="validated(scope.row,scope.$index)">
                                    </el-input-number>
                                </div>

                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </ToggleForm>
        <!-- 弹窗 -->
        <yb-popup @close="isShow = false;" :isShow="isShow" title="添加题库" width="806">
            <div slot="body">
                <div style="margin:0 20px">
                    <el-input placeholder="题库名称" class="w200 mr20 seekIpt" v-model="queryLimit.name"
                        @keyup.enter.native="changeSearch">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch"></i>
                    </el-input>
                    <el-select class="w200" v-model="entityType_" multiple :clearable="true" collapse-tags
                        placeholder="行业类型" @change="changeSearch">
                        <el-option v-for="item in entityType" :key="item.key" :label="item.name" :value="item.key">
                        </el-option>
                    </el-select>
                    <el-table v-loading="loading" height="550" element-loading-text="数据正在努力加载中" :border="true"
                        :resizable="true" :data="popTableData" class="table-div mt20">
                        <el-table-column type="index" width="55" label="序号">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="name" min-width="120" label="题库名称">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="description" min-width="200" label="题库描述">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="entityTypeStr" min-width="80" label="行业类型">
                        </el-table-column>
                        <el-table-column label="操作" min-width="150">
                            <template slot-scope="scope">
                                <a href="javascript:;" v-if="addData.questionDepotId!=scope.row.id" class="operate-a"
                                    @click="checked(scope.row)">选择</a>
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
                </div>

            </div>
        </yb-popup>
        <div class="textR mt20">
            <el-button type="primary w100" @click="submit" v-if='!show'>保存
            </el-button>
            <el-button type="primary w100" @click="show=false" v-if='show&&type=="edit"&&status==1'>编辑
            </el-button>
        </div>
    </div>
</template>

<script>
    import ToggleForm from "components/ToggleForm.vue";
    import YbPopup from 'components/ybpopup/YbPopup.vue'
    import * as api from "api/assess/index";
    import {
        getPublic,
        getEntityType,
        getYear
    } from "../../com.js";
    export default {
        components: {
            ToggleForm,
            YbPopup
        },
        watch: {
            id(val) {
                debugger
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
                show: false,
                isShow: false,
                total: 0,
                loading: false,
                queryLimit: {
                    pageNum: 1,
                    pageSize: 10,
                    entityType: '',
                    name: '',
                    palnId: ""
                },
                entityType_: [],
                addData: {
                    startStatus: 1,
                    pumpType: 0,
                    id: '',
                    planId: '',
                    questionDepotId: '',
                    excellentScore: '',
                    wellScore: '',
                    qualifiedScore: '',
                    unqualifiedScore: '',
                    queConfig: []
                },
                loading: false,
                tableData: [],
                tableData2: [{
                        name: '单选题',
                        topicType: 0,
                        spotCheckNum: 0,
                        topicNum: 0,
                        score: '',
                        sumScore: '0',
                    },
                    {
                        name: '多选题',
                        topicType: 1,
                        spotCheckNum: 0,
                        topicNum: 0,
                        score: '',
                        sumScore: '0',
                    },
                    {
                        name: '判断题',
                        topicType: 2,
                        spotCheckNum: 0,
                        topicNum: 0,
                        score: '',
                        sumScore: '0',
                    },
                    {
                        name: '总分值(100)',
                        topicType: '',
                        spotCheckNum: '-',
                        topicNum: '-',
                        score: '-',
                        sumScore: '0',
                    }
                ],
                tableData3: [{
                        name: '优秀',
                        number: '90'
                    },
                    {
                        name: '良好',
                        number: '80'
                    },
                    {
                        name: '合格',
                        number: '60'
                    },
                    {
                        name: '不合格',
                        number: '59'
                    }
                ],
                popTableData: [],
                entityType: [],
                type: 'add',
                status: 1,
            };
        },

        async mounted() {
            if (this.$route.query.type) {
                this.type = this.$route.query.type;
            }
            if (this.id) {
                this.get(this.id)
            }
            if (this.$route.query.status) {
                this.status = this.$route.query.status;
                this.show = this.status == 2 ? true : false
            }
            this.entityType = await getEntityType()
        },
        methods: {
            validated(row, index) {
                if (!row.number) {
                    this.$nextTick(() => {
                        this.$set(this.tableData2[index], 'number', 1)
                    })
                    row.number = 1
                }
                this.$forceUpdate();
            },
            computeScore(row, index) {
                this.$forceUpdate();
                if (!row.spotCheckNum) {
                    this.$nextTick(() => {
                        this.$set(this.tableData2[index], 'spotCheckNum', "0")
                    })
                    // row.spotCheckNum="0"
                }
                if (!row.score) {
                    this.$nextTick(() => {
                        this.$set(this.tableData2[index], 'score', "1")
                    })
                    // row.score="1"
                }
                this.$nextTick(() => {
                    row.sumScore = row.spotCheckNum * row.score;
                    let number = 0;
                    for (let i = 0; i < 3; i++) {
                        number = number + this.tableData2[i].sumScore * 1
                    }
                    this.tableData2[3].sumScore = number;
                })
            },
            pagecCurrentChange(num) {
                this.queryLimit.pageNum = num;
                this.searchPage();
            },
            pageSizeChange(size) {
                this.queryLimit.pageSize = size;
                this.changeSearch();
            },
            changeSearch() {
                this.queryLimit.pageNum = 1;
                this.searchPage();
            },
            searchPage() {
                this.loading = true;
                this.queryLimit.entityType = this.entityType_.toString()
                api.assessPlanQuestionList(this.queryLimit).then(result => {
                    if (result.status) {
                        this.popTableData = result.data.list;
                        this.total = result.data.total;
                    } else {
                        this.$message.warning("列表数据获取失败！请稍候重试");
                    }
                    this.loading = false;
                });
            },
            addPop() {
                this.isShow = true
                this.entityType_ = []
                this.queryLimit = {
                    pageNum: 1,
                    pageSize: 10,
                    entityType: '',
                    name: '',
                    palnId: this.id
                }
                this.searchPage();
            },
            checked(row) {
                if (row.judgeCount == 0 && row.multipleChoiceCount == 0 && row.singleChoiceCount == 0) {
                    this.$message.error('该题库里面没有题！请重新更换一个')
                    return
                }
                this.tableData = [row];
                this.isShow = false;
                this.tableData2 = [{
                        name: '单选题',
                        topicType: 0,
                        spotCheckNum: 0,
                        topicNum: row.singleChoiceCount,
                        score: '',
                        sumScore: '0',
                    },
                    {
                        name: '多选题',
                        topicType: 1,
                        spotCheckNum: 0,
                        topicNum: row.multipleChoiceCount,
                        score: '',
                        sumScore: '0',
                    },
                    {
                        name: '判断题',
                        topicType: 2,
                        spotCheckNum: 0,
                        topicNum: row.judgeCount,
                        score: '',
                        sumScore: '0',
                    },
                    {
                        name: '总分值(100)',
                        topicType: '',
                        spotCheckNum: '-',
                        topicNum: '-',
                        score: '-',
                        sumScore: '0',
                    }
                ]
                this.addData.questionDepotId = row.id;
            },
            close() {
                this.isShow = false;
            },
            submit() {
                if (this.addData.questionDepotId == '') {
                    this.$message.error('必须选择一个题库才可以提交')
                    return
                }
                if (this.tableData2[3].sumScore != 100) {
                    this.$message.error('抽考的题总分必须为100分')
                    return
                }
                if (this.tableData3[0].number >= 100 || this.tableData3[0].number <= this.tableData3[1].number) {
                    this.$message.error('优秀范围不能大于等于100分或者小于等于良好的分值')
                    return
                }
                if (this.tableData3[1].number >= this.tableData3[0].number || this.tableData3[1].number <= this
                    .tableData3[2].number) {
                    this.$message.error('良好范围不能大于优秀范围或者小于等于合格的分值')
                    return
                }
                if (this.tableData3[2].number >= this.tableData3[1].number || this.tableData3[2].number <= this
                    .tableData3[3].number) {
                    this.$message.error('合格范围不能大于良好范围或者小于等于不合格的分值')
                    return
                }
                if (this.tableData3[3].number >= this.tableData3[2].number || this.tableData3[3].number <= 0) {
                    this.$message.error('不合格范围不能大于合格范围或者小于等于0分')
                    return
                }
                if (this.tableData3[2].number - this.tableData3[3].number!=1 ) {
                    this.$message.error('不合格和合格分数之间分数只能相差为1')
                    return
                }
                this.addData.excellentScore = this.tableData3[0].number
                this.addData.wellScore = this.tableData3[1].number
                this.addData.qualifiedScore = this.tableData3[2].number
                this.addData.unqualifiedScore = this.tableData3[3].number
                this.addData.queConfig=[]
                this.addData.queConfig.push(this.tableData2[0])
                this.addData.queConfig.push(this.tableData2[1])
                this.addData.queConfig.push(this.tableData2[2])
                this.addData.planId = this.id
                api.assessPlanQuestionAddOrEdit(this.addData, this.addData.id != '' ? 'edit' : 'add').then((r) => {
                    if (!r.status) {
                        this.$message({
                            message: r.message,
                            type: r.level
                        });
                        return;
                    }
                    let str = this.type == 'edit' ? '编辑' : '添加'
                    this.$message({
                        message: '考核计划题库管理' + str + '成功!',
                        type: 'success'
                    });
                    this.show = true;
                    this.get(this.id)
                })
            },
            get(id_) {
                api.assessPlanQuestionDetail(id_).then(r => {
                    if (r.status) {

                        this.addData = r.data;
                        if (!this.addData.pumpType) {
                            this.addData.pumpType = 0
                        }
                        if (!this.addData.questionDepotId) {
                            return
                        }
                        this.tableData3[0].number = this.addData.excellentScore
                        this.tableData3[1].number = this.addData.wellScore
                        this.tableData3[2].number = this.addData.qualifiedScore
                        this.tableData3[3].number = this.addData.unqualifiedScore
                        this.addData.queConfig.map((item, i) => {
                            if (item.topicType == 0) {
                                this.tableData2[0] = this.addData.queConfig[i]
                                this.tableData2[0].name = '单选题'
                            } else if (item.topicType == 1) {
                                this.tableData2[1] = this.addData.queConfig[i]
                                this.tableData2[1].name = '多选题'
                            } else {
                                this.tableData2[2] = this.addData.queConfig[i]
                                this.tableData2[2].name = '判断题'
                            }
                        })
                        this.tableData2[3].sumScore = 100
                        this.tableData = [];
                        let obj = {
                            name: this.addData.depotName,
                            description: this.addData.depotDescription,
                            entityTypeStr: this.addData.depotEntityTypeStr,
                            id: this.addData.questionDepotId,
                        }
                        this.tableData.push(obj)

                    }
                })
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
        margin: 0 10px;
        white-space: pre-wrap;
    }

    .w100 {
        width: 100px !important;
    }

    .pagination-box {
        text-align: right;
        margin-top: 20px;
    }

    .scoreBox {
        .left {
            margin-right: 20px;
            width: calc(70% - 20px);
        }

        .right {
            width: 30%;
        }
    }

    .scoreBox .el-table .p {
        height: 34px !important;
        line-height: 34px !important;
    }
</style>