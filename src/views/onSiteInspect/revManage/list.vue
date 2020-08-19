<template>
    <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)" class="bigbox">
        <div class="page-tilt">
            <b></b><span>整改复查管理</span>
        </div>
        <ul class="tabBox">
            <li class="tabLi" v-for="(item,index) in patternLis" :key="index" :data-index="index"
                :class="item.type==messType?'li-bott':''" @click="choose(index,item.type)">
                <div :data-index='index'>
                    <span :class="item.type==messType?'li-span':''">
                        {{item.name}}
                    </span>
                </div>
            </li>
            <li class="tabBott"></li>
        </ul>
        <div class="clear_a mb20">
            <el-input placeholder="经营者、业务受理号" class="w300 mr20 seekIpt" v-model="searchMap.keysWord"
                @keyup.enter.native="searchData">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="searchData"></i>
            </el-input>
            <div class="mr20">
                <el-date-picker format="yyyy 年 MM 月 dd 日" value-format="yyyy/MM/dd" @change="searchData"
                    v-model="searchMap.startDate" class="sle w200" type="date" placeholder="核查起始日期"
                    :picker-options="startDate"></el-date-picker>至
                <el-date-picker format="yyyy 年 MM 月 dd 日" value-format="yyyy/MM/dd" @change="searchData"
                    v-model="searchMap.endDate" class="sle w200" type="date" placeholder="核查截止日期"
                    :picker-options="endDate"></el-date-picker>
            </div>
        </div>
        <div class="clear_a">
            <el-select @change="searchData" clearable collapse-tags multiple v-model="searchMap.applyTypes"
                class="w200 mr20" placeholder="申请类型">
                <el-option v-for="(item,key) in applyTypes" :key="key" :label="item" :value="key">
                </el-option>
            </el-select>
            <el-select @change="searchData" clearable v-model="searchMap.rectifyType" class="w200 mr20"
                placeholder="整改方式">
                <el-option v-for="(item,key) in rectifyType" :key="key" :label="item" :value="key">
                </el-option>
            </el-select>
            <el-select @change="searchData" clearable v-model="searchMap.result" class="w200 mr20" placeholder="复查结果"
                v-if="messType == 'ok'">
                <el-option v-for="(item,key) in resultSelectdata" :key="key" :label="item" :value="key">
                </el-option>
            </el-select>
            <el-select @change="searchData" clearable collapse-tags multiple v-model="searchMap.treat" class="w200 mr20"
                placeholder="复查处理方式" v-if="messType == 'ok'">
                <el-option v-for="(item,key) in treatSelectdata" :key="key" :label="item" :value="key">
                </el-option>
            </el-select>
        </div>
        <div>
            <el-table :data="dataPage" :border="true" :resizable="true" class="table-div">
                <el-table-column min-width='50' type="index" label="序号">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="entityName" min-width="120" label="经营者名称">
                </el-table-column>
                <el-table-column prop="applyTypeStr" min-width="120" label="申请类型"></el-table-column>
                <el-table-column show-overflow-tooltip prop="businessNo" min-width="80" label="业务受理号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="patrolResultStr" min-width="80" label="核查结果">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="patrolTime" v-if="messType == 'not'" min-width="80"
                    :key='"patrolTime"' label="核查日期"></el-table-column>
                <el-table-column prop="noContextCount" v-if="messType == 'not'" min-width="80" label="问题项"
                    :key='"noContextCount"'>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="rectifyTypeStr" min-width="80" label="整改方式"
                    :key='"rectifyTypeStr"'>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="rectifiedTime" min-width="120" label="整改提交时间"
                    :key='"rectifiedTime"'>
                    <template slot-scope="scope">
                        {{scope.row.rectifiedTime === null || scope.row.rectifiedTime === ''? '-':scope.row.rectifiedTime}}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="sourceRectifyTime" min-width="120" v-if="messType == 'not'"
                    :key='"sourceRectifyTime"' label="整改截止日期">
                    <template slot-scope="scope">
                        <span
                            :class="{red : isDate(scope.row.sourceRectifyTime) }">{{scope.row.sourceRectifyTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="repatrolResultStr" min-width="80" label="复查结果"
                    :key='"repatrolResultStr"' v-if="messType == 'ok'"></el-table-column>
                <el-table-column show-overflow-tooltip prop="repatrolTreatStr" min-width="80" label="复查处理方式"
                    :key='"repatrolTreatStr"' v-if="messType == 'ok'"></el-table-column>
                <el-table-column show-overflow-tooltip prop="repatrolTime" min-width="120" label="复查时间"
                    :key='"repatrolTime"' v-if="messType == 'ok'"></el-table-column>
                <el-table-column show-overflow-tooltip label="操作" min-width="150" fixed="right">
                    <template slot-scope="scope">
                        <a href="javascript:;" class="operate-a"
                            @click="goDetail(scope.row)">{{messType == 'ok'?'详情':'检查记录'}}</a>
                        <a href="javascript:;" v-if="scope.row.rectifyType == 'OFFLINE'&&messType=='not'"
                            class="operate-a" @click="repatrol(scope.row.id,'ad');">复查</a>
                        <a href="javascript:;" v-if="scope.row.rectifyType == 'ONLINE'&&messType=='not'"
                            @click="repatrol(scope.row.id,'audit');" class="operate-a">审核</a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-box">
                <el-pagination background :current-page="searchMap.pageNum" :page-sizes="[10, 20, 30, 40,50]"
                    :page-size="searchMap.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
                    @size-change="pageSizeChange" @current-change="pagecCurrentChange">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import * as api from '../../../api/xchc/detail'
    export default {
        data() {
            return {
                rectifyType: {
                    'ONLINE': '线上整改',
                    'OFFLINE': '线下整改',
                },
                applyTypes: {
                    'NEW': '新办',
                    'CHANGE': '变更',
                    'CONTINUE': '延续',
                    'SUPPLEMENT': '补证',
                    'LOGOUT': '注销',
                    'REPLACE': '换证',
                },
                resultSelectdata: {
                    'YES': '符合',
                    'NO': '不符合',
                },
                treatSelectdata: {
                    'NORMAL': '正常',
                    'RE_RECTIFY': '再次限期整改',
                    'REJECT': '驳回',
                },
                patternLis: [{
                    name: '待复查',
                    type: 'not'
                }, {
                    name: '已复查',
                    type: 'ok'
                }],
                messType: 'not',
                total: 0,
                // 查询条件
                searchMap: {
                    startDate: "", // 开始时间
                    endDate: "", // 结束时间
                    pageSize: 10,
                    pageNum: 1,
                    keysWord: '', // 关键字
                    applyTypes: [], // 申请类型
                    state: 'WAIT', // 默认设置待复查
                    rectifyType: '',
                    result: [], // 处理结果
                    treat: '', // 处理方式
                },
                dataPage: [],
                loading: false,
                startDate: {
                    disabledDate: (time) => {
                        let endDate = new Date(this.searchMap.endDate);
                        let date = new Date('2017-12-31');
                        if (this.searchMap.endDate) {
                            return time.getTime() > endDate || time.getTime() < date || time.getTime() > Date
                                .now() 
                        } else {
                            return time.getTime() < date || time.getTime() > Date.now() 
                        }
                    }
                },
                endDate: {
                    disabledDate: (time) => {
                        let startDate = new Date(this.searchMap.startDate);
                        let date = new Date('2017-12-31');
                        if (this.searchMap.startDate) {
                            return time.getTime() < startDate  || time.getTime() < date || time.getTime() >
                                Date.now() ;
                        } else {
                            return time.getTime() < date || time.getTime() > Date.now() 
                        }
                    }
                },
            }
        },
        methods: {

            // 切换导航样式
            choose(index, type) {
                this.messType = type
                console.log(index + ":" + type)
                if (type == 'not') {
                    this.searchMap.state = 'WAIT'
                } else {
                    this.searchMap.state = 'ALREADY'
                }
                this.searchMap.keysWord = ''
                this.searchMap.applyTypes = []
                this.searchMap.result = []
                this.searchMap.treat = ''
                this.searchMap.rectifyType = ''
                this.searchMap.startDate = ''
                this.searchMap.endDate = ''
                this.searchMap.pageSize = 10
                this.searchMap.pageNum = 1
                this.dataPage = []
                this.getPageData();
            },
            // 页数改变
            pagecCurrentChange(num) {
                this.searchMap.pageNum = num
                this.getPageData();
            },
            // 每页数量改变
            pageSizeChange(size) {
                this.searchMap.pageSize = size
                this.getPageData();
            },

            getPageData() {
                this.loading = true;
                api.repatrolList(this.searchMap).then((response) => {
                    this.loading = false;
                    if (!response.status) {
                        this.$message.error('数据获取失败')
                        return
                    }
                    this.dataPage = response.data.list
                    this.total = response.data.total
                })
            },
            searchData() {
                this.searchMap.pageNum = 1
                this.getPageData()
            },

            isDate(date) {
                var currDate = new Date();
                var strDate = currDate.getFullYear() + "-" + (currDate.getMonth() + 1) + "-" + currDate.getDate()
                if (Date.parse(new Date(Date.parse(date) - 8 * 60 * 60 * 1000)) < Date.parse(new Date(Date.parse(
                        strDate)))) {
                    return true
                } else {
                    return false
                }
            },
            //跳转复查/审核页面
            repatrol(id, type) {
                this.$router.push({
                    name: 'xchc.revManage.' + type,
                    query: {
                        'id': id
                    }
                })
            },
            goDetail(item) {
                this.$router.push({
                    name: 'xchc.allDetails.revManage',
                    query: {
                        'id': this.messType == 'not' ? item.sourceId : item.id,
                        'count': item.repatrolCount,
                        'messType': this.messType,
                    }
                })
            },

        },
        mounted() {
            this.getPageData()
        },

    }
</script>

<style scoped lang="scss">
    .bigbox {
        width: 100%;
        position: relative;
    }

    .tabBox {
        width: 100%;
        display: flex;
        position: relative;
        margin-bottom: 20px;
    }

    .tabBox .tabLi {
        width: 128px;
        height: 50px;
        line-height: 50px;
        margin-right: 30px;
        font-family: PingFangSC-Regular;
        font-size: 15px;
        color: #9A9A9A;
        text-align: center;
    }

    .tabBox .li-bott {
        border-bottom: 2px solid #0DB5EF;
        z-index: 666;
        position: relative;
    }

    .tabBox .li-span {
        color: #393939;
    }

    .tabBox span:first-child {
        margin-right: 10px;
    }

    .tabBox .tabBott {
        background: #EBF1F5 !important;
        height: 2px !important;
        width: 100% !important;
        position: absolute;
        bottom: 0;
    }

    .table-div {
        margin: 20px 0;
        text-align: center;
    }

    .pagination-box {
        text-align: right;
        margin-top: 20px;
    }

    .mr20 {
        margin-right: 20px;
    }

    .sle {
        margin: 0 12px;
    }

    .opct0 {
        display: none;
    }

    .red {
        color: red !important;
    }
</style>