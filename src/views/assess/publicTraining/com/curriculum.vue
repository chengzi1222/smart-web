<template>
    <div>
        <ToggleForm title="培训课程管理">
            <div class="mt30">
                <div class="mb20">
                    <el-button class="w120" type="primary" @click="isShow = true;">
                        <i style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>添加课程
                    </el-button>
                </div>
                <p class="fs14 col39 mb20">总学时：10</p>
                <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                    :data="tableData" class="table-div">
                    <el-table-column type="index" label="序号" min-width="80"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="correct" min-width="100" label="课程名称">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="correct" min-width="80" label="学时"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="correct" min-width="200" label="课程描述">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="analysis" min-width="100" label="行业类型">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="analysis" min-width="180" label="备注">
                    </el-table-column>
                    <el-table-column label="操作" min-width="100" fixed="right">
                        <template slot-scope="scope">
                            <a href="javascript:;" class="operate-a">详情</a>
                            <a href="javascript:;" class="operate-a">删除</a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </ToggleForm>
        <!-- 弹窗 -->
        <yb-popup @close="isShow = false;" :isShow="isShow" title="添加课程" width="806">
            <div slot="body">
                <div style="margin:0 20px">
                    <el-input placeholder="课程名称" class="w350 mr20 seekIpt" v-model="queryLimit.keyword">
                        <i slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <el-select  class="w150" v-model="queryLimit.type" collapse-tags multiple  :clearable="true" placeholder="行业类型">
                        <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
                        </el-option>
                    </el-select>
                    <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                        :data="popTableData" class="table-div mt20">
                        <el-table-column type="index" width="55" label="序号">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="correct" min-width="120" label="课程名称">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="tel" min-width="120" label="学时"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="analysis" min-width="200" label="课程描述">
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
</style>