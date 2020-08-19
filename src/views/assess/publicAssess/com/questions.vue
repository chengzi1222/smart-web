<template>
    <div>
        <ToggleForm title="题库管理">
            <div class="mt30">
                <div class="mb20">
                    <el-button class="w120" type="primary" @click="isShow = true;">
                        <i style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>添加题库
                    </el-button>
                </div>
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
                            <a href="javascript:;" class="operate-a">更换题库</a>
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
            </div>
        </ToggleForm>
        <!-- 弹窗 -->
        <yb-popup @close="isShow = false;" :isShow="isShow" title="添加题库" width="806">
            <div slot="body">
                <div style="margin:0 20px">
                    <el-input placeholder="题库名称" class="w350 mr20 seekIpt" v-model="queryLimit.keyword">
                        <i slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <el-select class="w150" v-model="queryLimit.type" collapse-tags multiple  :clearable="true" placeholder="行业类型">
                        <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
                        </el-option>
                    </el-select>
                    <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                        :data="popTableData" class="table-div mt20">
                        <el-table-column type="index" width="55" label="序号">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="correct" min-width="120" label="题库名称">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="analysis" min-width="200" label="题库描述">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="areaName" min-width="80" label="行业类型">
                        </el-table-column>
                        <el-table-column label="操作" min-width="150">
                            <template slot-scope="scope">
                                <a href="javascript:;" class="operate-a" @click="addPop">选择</a>
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
    </div>
</template>

<script>
    import ToggleForm from "components/ToggleForm.vue";
    import YbPopup from 'components/ybpopup/YbPopup.vue'

    export default {
        components: {
            ToggleForm,
            YbPopup
        },
        data() {
            return {
                isShow: false,
                total: 0,
                queryLimit: {
                    current: 1,
                    type: "",
                    keyword: "",
                    size: 10
                },
                queryLimitL: {},
                rules: {},
                addData: {
                    radio: ''
                },
                loading: false,
                tableData: [{
                        correct: 'B',
                        analysis: '解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析'
                    },
                    {
                        correct: 'B',
                        analysis: '解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析'
                    },
                ],
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
                popTableData: [{
                        correct: 'B',
                        analysis: '解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析'
                    },
                    {
                        correct: 'B',
                        analysis: '解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析解析'
                    },
                ],
                select: [{
                        name: "存在",
                        key: true
                    },
                    {
                        name: "不存在",
                        key: false
                    }
                ]
            };
        },

        mounted() {},
        methods: {
            pagecCurrentChange(num) {
                this.queryLimit.current = num;
                this.searchPage();
            },
            pageSizeChange(size) {
                this.queryLimit.size = size;
                this.changeSearch();
            },
            addPop() {

            },
            close() {
                // 清除数据
                this.isShow = false;
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