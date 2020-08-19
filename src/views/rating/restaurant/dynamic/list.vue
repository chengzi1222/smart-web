<template>
    <div>
        <div class="page-tilt">
            <b></b>
            <span> 动态评分</span>
        </div>
        <div class="alert" v-if='alert'>提示：分数和检查人显示最新一次记录！ <i class="el-icon-close movePoin" @click="alert=false"></i>
        </div>
        <div class="user-box">
            <div class="mt20 mb20 clear_a">
                <el-input placeholder="主体名称、备案号、社会信用代码" class="w250 mr20 seekIpt" maxlength=30
                    v-model="queryLimit.keyWord" @keyup.enter.native="changeSearch">
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch"></i>
                </el-input>
                <select-area-grid class="w200 mr20" placeholder="所属区域" @change="selectAreaGridChange">
                </select-area-grid>
                <el-select class="w200 mr20" v-model="queryLimit.entityType" clearable placeholder="主体类型"
                    @change="changeSearch">
                    <el-option v-for="(item,i) in subType" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
                <el-select class="w200 mr20" v-if='queryLimit.entityType=="RESTAURANT"' v-model="queryLimit.subType"
                    clearable collapse-tags multiple placeholder="主体业态" @change="changeSearch">
                    <el-option v-for="(item,i) in formats" :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                </el-select>
                <el-select class="w200 mr20" v-if='queryLimit.entityType=="RESTAURANT"'
                    v-model="queryLimit.superviseType" clearable collapse-tags multiple placeholder="监管类型"
                    @change="changeSearch">
                    <el-option v-for="(item,i) in supervisionType" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>

            </div>
            <div class="mt20 mb20 clear_a">
                <el-select class="w200 mr20" v-model="queryLimit.handleType" clearable placeholder="主体类别"
                    @change="changeSearch">
                    <el-option v-for="(item,key) in handleType" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
                <el-select class="w200 mr20" v-model="queryLimit.scoreStatus" clearable placeholder="评分状态"
                    @change="changeSearch">
                    <el-option v-for="(item,key) in scoreStatus" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
                <el-select class="w200 mr20" v-model="queryLimit.status" clearable placeholder="状态"
                    @change="changeSearch">
                    <el-option v-for="(item,key) in status" :key="key" :label="item" :value="key">
                    </el-option>
                </el-select>
                <div class="mr20">
                    <el-date-picker format="yyyy 年 MM 月 dd 日" value-format="yyyy/MM/dd" @change="changeSearch"
                        v-model="queryLimit.startDate" class=" w200 mr20" type="date" placeholder="评分起始日期"
                        :picker-options="startDate"></el-date-picker>至
                    <el-date-picker format="yyyy 年 MM 月 dd 日" value-format="yyyy/MM/dd" @change="changeSearch"
                        v-model="queryLimit.endDate" class=" w200 ml20" type="date" placeholder="评分截止日期"
                        :picker-options="endDate"></el-date-picker>
                </div>
                <el-button class="floatR mr20" type="primary" @click="exportList">
                    导出
                </el-button>
                <div class="floatR mr20">
                    <el-upload action="" style="display: inline-block;" :show-file-list="false"
                        :http-request="uploadConfig" :on-error="fileUploadError"
                        :before-upload="beforeAvatarUploadImport">
                        <el-button type="primary" :disabled='importLoad'>导入</el-button>
                    </el-upload>
                </div>
                <el-button class="floatR w120 mr20" @click="downTableTemplet()">下载导入模板</el-button>
            </div>
            <div class="tabOffTop120">
                <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
                    :data="tableData" class="table-div">
                    <el-table-column show-overflow-tooltip prop="entityName" min-width="150" label="主体名称"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="areaName" min-width="150" label="所属区域"></el-table-column>
                    <el-table-column show-overflow-tooltip min-width="120" label="社会信用代码">
                         <template slot-scope="scope">
                            {{scope.row.creditCode?scope.row.creditCode:'-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100" prop="entityTypeStr"  label="主体类型"></el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100"  label="主体业态">
                        <template slot-scope="scope">
                            {{scope.row.subTypeStr?scope.row.subTypeStr:'-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100" label="监管类型">
                         <template slot-scope="scope">
                            {{scope.row.superviseTypeStr?scope.row.superviseTypeStr:'-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="50" label="动态分数">
                        <template slot-scope="scope">
                            {{scope.row.score?scope.row.score:'-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="80" label="检查人">
                        <template slot-scope="scope">
                            {{scope.row.latestInspector?scope.row.latestInspector:'-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100" label="评分时间">
                        <template slot-scope="scope">
                            {{scope.row.latestInspectTime?scope.row.latestInspectTime:'-'}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="handleTypeStr" min-width="80" label="主体类别"></el-table-column>
                    <el-table-column show-overflow-tooltip min-width="60" label="评分状态">
                        <template slot-scope="scope">
                          <span :style="scope.row.scoreStatus=='EXPIRED'?'color:#FA503B':''">{{scope.row.scoreStatusStr}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="statusStr" min-width="50" label="状态"></el-table-column>
                    <el-table-column label="操作" min-width="150" fixed="right">
                        <template slot-scope="scope">
                            <a href="javascript:;" class="operate-a"
                                @click="go(scope.row,'restaurantRating.dynamic.ratings')">{{scope.row.score?'重新评分':'评分'}}</a>
                            <a href="javascript:;" class="operate-a" v-if='scope.row.score' @click="go(scope.row,'restaurantRating.dynamic.ratingsRecord')">评分记录</a>
                            <a href="javascript:;" class="operate-a" @click="sub(scope.row)">主体档案</a>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-box">
                    <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
                        :current-page="queryLimit.pageNum" :page-sizes="[10, 20, 30, 40,50]"
                        :page-size="queryLimit.pageSize" layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import SelectAreaGrid from 'components/common/SelectAreaGrid'
    import * as api from "api/rating/restaurantRating";
    import {
        getEnums,
        getDicts
    } from 'api/common';
    import {
        downloadFile,
    } from 'api/common'
    export default {
        data() {
            return {
                handleType: [],
                scoreStatus: [],
                subType: [],
                supervisionType: [],
                formats: [],
                status: {
                    "ENABLE": '启用',
                    "DISABLE": '禁用',
                },
                alert: true,
                importLoad: false,
                tableData: [],
                total: 0,
                loading: false,
                queryLimit: {
                    pageNum: 1,
                    pageSize: 10,
                    entityType: '',
                    isPage: 'YES',
                    keyWord: "",
                    scoreType: 'DYNAMIC',
                    areaCode: '',
                    endDate: '',
                    startDate: '',
                    handleType: '',
                    scoreStatus: '',
                    status: '',
                    subType: [],
                    superviseType: []
                },
                startDate: {
                    disabledDate: (time) => {
                        let endDate = new Date(this.queryLimit.endDate);
                        let date = new Date('2017-12-31');
                        if (this.queryLimit.endDate) {
                            return time.getTime() > endDate || time.getTime() < date || time.getTime() > Date
                                .now()
                        } else {
                            return time.getTime() < date || time.getTime() > Date.now()
                        }
                    }
                },
                endDate: {
                    disabledDate: (time) => {
                        let startDate = new Date(this.queryLimit.startDate);
                        let date = new Date('2017-12-31');
                        if (this.queryLimit.startDate) {
                            return time.getTime() < startDate || time.getTime() < date || time.getTime() >
                                Date.now();
                        } else {
                            return time.getTime() < date || time.getTime() > Date.now()
                        }
                    }
                },

            };
        },
        components: {
            SelectAreaGrid
        },
        mounted() {
            getEnums(['com.ybveg.govx.enums.sub.RestaurantSuperviseTypeEnum']).then((data) => {
                this.supervisionType = data.data;
            });
            getEnums(['com.ybveg.govx.enums.food.djpd.FoodDjpdEntityTypeEnum']).then((data) => {
                this.subType = data.data;
            });
            getEnums(['com.ybveg.govx.enums.food.djpd.ScoreStatusEnum']).then((data) => {
                this.scoreStatus = data.data;
            });
            getEnums(['com.ybveg.govx.enums.food.djpd.EntityHandleTypeEnum']).then((data) => {
                this.handleType = data.data;
            });
            getDicts(['RB_SUB']).then((data) => {
                this.formats = data.data[0].list || [];
            })
            this.searchPage();
        },
        methods: {
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
                formdata.append('file', file.file);
                formdata.append('scoreType', 'DYNAMIC');
                api.uploadFile(formdata).then((r) => {
                    this.importLoad = false;
                    if (r.status && !r.data) {
                        this.$message.success('导入成功!');
                    } else if (r.status && r.data) {
                        this.$message.error('导入失败!正在下载失败原因');
                        downloadFile(r.data, '导入失败原因');
                    } else {
                        this.$message.error('导入失败!');
                    }
                    this.changeSearch();
                })
            },
            downTableTemplet() {
                location.href = `/api/food/djpd/record/template?scoreType=DYNAMIC`;
            },
            selectAreaGridChange(val) {
                if (!val || val.length == 0) {
                    this.queryLimit.areaCode = "";
                } else {
                    this.queryLimit.areaCode = val[val.length - 1];
                }
                this.changeSearch();
            },
         
            go(row,url) {
                this.$router.push({
                    name:url ,
                    query: {
                        id: row.id,
                    }
                });
            },
            sub(row) {

            },
            searchPage() {
                this.loading = true;
                api.list(this.queryLimit).then(result => {
                    if (result.status) {
                        this.tableData = result.data.list;
                        this.total = result.data.total;
                    } else {
                        this.$message.warning("列表数据获取失败！请稍候重试");
                    }
                    this.loading = false;
                });
            },
            async exportList() {
                let result = await api.exportList(this.queryLimit);
                if (result.status) {
                    downloadFile(result.data, '动态评分导出')
                } else {
                    this.$message.warning('导出失败');
                }
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
        },
    };
</script>
<style scoped lang="scss">
    .ipt-btn-box {
        margin: 20px 0;
        display: flex;
        justify-content: space-between;
    }

    .pagination-box {
        text-align: right;
        margin-top: 20px;
    }

    .table-div {
        width: 100%;
        text-align: center;
    }

    .operate-a {
        color: #1787ad;
    }

    table tr td:last-child .cell a {
        border-right: 1px solid #ccc;
        padding-right: 5px;
    }

    table tr td:last-child .cell a:last-child {
        border-right: none;
        padding-right: 0px;
    }


    .alert {
        margin-top: 20px;
        padding: 0 14px;
        width: calc(100% - 28px);
        height: 34px;
        background: rgba(239, 247, 249, 1);
        border: 1px solid rgba(194, 234, 248, 1);
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(31, 171, 220, 1);
        line-height: 34px;

        .el-icon-close {
            color: #1FABDC;
            font-size: 16px;
            float: right;
            line-height: 34px;
        }
    }
</style>