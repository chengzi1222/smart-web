<template>
    <div class="user-box">
        <div class="ipt-btn-box mb20" style="justify-content: end;">
            <el-select class="selectHeight ml0" v-model="sel.date" clearable placeholder="日期筛选" @change="searchTab">
                <el-option v-for="item in sel.dateList" :key="item.reportedDate" :label="item.reportedDate" :value="item.reportedDate">
                </el-option>
            </el-select>
            <el-select class="selectHeight" v-model="sel.order" clearable placeholder="日期排序" @change="searchTab">
                <el-option v-for="item in sel.orderlist" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
            </el-select>
        </div>
        <div>
            <div v-if="boxData.length==0" class="no-data">暂无上报数据</div>
            <!-- start -->
            <div class="dateBox mb20 p20" v-for='(item,index) in boxData' :key='index'>
                <p class="time">{{ item.reportedDate }}</p>
                <div class="config"><span>出动监管人员：{{ item.supervisor!=0 ? item.supervisor : '暂无' }}</span><el-button class="w76"
                        type="primary" @click="popFun('config',item)">配置</el-button>
                </div>
                <div class="clear_a">
                    <div class="supplier">
                        <el-table :data="item.supList" class="table-div">
                            <el-table-column type="index" width="50" label="序号"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="entityName" min-width="100" label="供应商"></el-table-column>
                            <el-table-column show-overflow-tooltip min-width="100" label="盒饭配送总量">
                                <template slot-scope="scope">
                                    {{ scope.row.boxSupQuantity!=0 ? scope.row.boxSupQuantity : '暂无' }}
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip min-width="120" label="盒饭通过总数">
                                <template slot-scope="scope">
                                    {{ scope.row.boxPassQuantity!=0 ? scope.row.boxPassQuantity : '暂无' }}
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip min-width="120" label="盒饭实际供应人次">
                                <template slot-scope="scope">
                                    {{ scope.row.boxSailQuantity!=0 ? scope.row.boxSailQuantity : '暂无' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="80">
                                <template slot-scope="scope">
                                    <a href="javascript:;" class="operate-a" @click="popFun('supplier',scope.row)">数据修正</a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="reception">
                        <el-table :data="item.recList" class="table-div">
                            <el-table-column type="index" width="50" label="序号"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="entityName" min-width="100" label="接待单位"></el-table-column>
                            <el-table-column show-overflow-tooltip min-width="120" label="早餐堂食供应人次">
                                <template slot-scope="scope">
                                    {{ scope.row.morningQuantity!=0 ? scope.row.morningQuantity : '暂无' }}
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip min-width="120" label="午餐堂食供应人次">
                                <template slot-scope="scope">
                                    {{ scope.row.nooningQuantity!=0 ? scope.row.nooningQuantity : '暂无' }}
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip min-width="120" label="晚餐堂食供应人次">
                                <template slot-scope="scope">
                                    {{ scope.row.eveningQuantity!=0 ? scope.row.eveningQuantity : '暂无' }}
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip min-width="120" label="今日总人次">
                                <template slot-scope="scope">
                                    {{ scope.row.totalQuantity!=0 ? scope.row.totalQuantity : '暂无' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="80">
                                <template slot-scope="scope">
                                    <a href="javascript:;" class="operate-a" @click="popFun('reception',scope.row)">数据修正</a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <!-- end -->

        </div>
        <!-- 弹框start -->
        <yb-popup @close="popShow = false;btnISd=false;" :isShow="popShow" :title="pop.title" width="470">
            <div slot="body">
                <el-form label-width="190px" v-if='pop.contentShow == "supplier"'>
                    <div class="row">
                        <el-form-item label="日期：">
                            <span>{{ pop.suppl.date}}</span>
                        </el-form-item>
                        <el-form-item label="供应商：">
                            <span>{{ pop.suppl.name}}</span>
                        </el-form-item>
                        <el-form-item label="盒饭实际供应人次：">
                            <el-input v-model="pop.suppl.boxSailQuantity">
                            </el-input>
                        </el-form-item>
                    </div>
                </el-form>

                <el-form label-width="190px" v-if='pop.contentShow == "reception"'>
                    <div class="row">
                        <el-form-item label="日期：">
                            <span>{{ pop.recep.date}}</span>
                        </el-form-item>
                        <el-form-item label="接待单位：">
                            <span>{{ pop.recep.name}}</span>
                        </el-form-item>
                        <el-form-item label="早餐人次：">
                            <el-input v-model="pop.recep.morningQuantity">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="午餐人次：">
                            <el-input v-model="pop.recep.nooningQuantity">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="晚餐人次：">
                            <el-input v-model="pop.recep.eveningQuantity">
                            </el-input>
                        </el-form-item>
                    </div>
                </el-form>
                <el-form label-width="190px" v-if='pop.contentShow == "config"'>
                    <div class="row">
                        <el-form-item label="日期：">
                            <span>{{ pop.config.date}}</span>
                        </el-form-item>
                        <el-form-item label="出动监管人员：">
                            <el-input v-model="pop.config.supervisor">
                            </el-input>
                        </el-form-item>
                    </div>
                </el-form>

            </div>
            <div slot="foot" style="height:32px;">
                <el-button @click="popShow=false;btnISd=false;">取消</el-button>
                <el-button type="primary" @click="update" :disabled="btnISd">保存</el-button>
            </div>
        </yb-popup>
        <!--弹框 end -->
    </div>
</template>

<script>
    import YbPopup from 'components/ybpopup/YbPopup';
    import * as api from 'api/activity/dataM';
    export default {
        props: {
            id: {
                type: String,
                default: ""
            },
        },
        components: {
            YbPopup,
        },
        mounted() {
            api.dateSelect(this.id).then(r => {
                this.sel.dateList = r.data
            });
            this.searchTab();
        },
        methods: {
            async searchTab() {
                let params = {
                    reportDate: this.sel.date,
                    sortType: this.sel.order
                };
                api.reportDataList(this.id, params).then(r => {
                    if (r.status) {
                        this.boxData = [];
                        this.boxData = r.data;
                    }
                });
            },
            popFun(type, row) {
                this.popShow = true;
                if (type == 'config') {
                    this.pop.title = '监管人数配置';
                    this.pop.contentShow = type;
                    this.pop.id = row.personId;
                    this.pop.config.date = row.reportedDate;
                    this.pop.config.supervisor = row.supervisor == '暂无' ? '' : row.supervisor;
                }
                if (type == 'supplier') {
                    this.pop.title = '供应商数据修正';
                    this.pop.contentShow = type;
                    this.pop.id = row.id;
                    this.pop.suppl.date = row.reportedDate;
                    this.pop.suppl.name = row.entityName;
                    this.pop.suppl.boxSailQuantity = row.boxSailQuantity;
                    this.pop.suppl.allNum = row.boxPassQuantity;
                }
                if (type == 'reception') {
                    this.pop.title = '接待单位数据修正';
                    this.pop.contentShow = type;
                    this.pop.id = row.id;
                    this.pop.recep.date = row.reportedDate;
                    this.pop.recep.name = row.entityName;
                    this.pop.recep.morningQuantity = row.morningQuantity;
                    this.pop.recep.nooningQuantity = row.nooningQuantity;
                    this.pop.recep.eveningQuantity = row.eveningQuantity;
                }
            },
            update() {
                let obj = {};
                this.btnISd = true;
                //供应商提交
                if (this.pop.contentShow == 'supplier') {

                    obj = {
                        entityType: 'SUPPLIER',
                        id: this.pop.id,
                        boxSailQuantity: (() => {
                            let n = /^[0-9]\d*$/;
                            console.log(this.pop.suppl.boxSailQuantity * 1 > this.pop.suppl.allNum)
                            if (this.pop.suppl.boxSailQuantity > 10000000 || !n.test(this.pop.suppl.boxSailQuantity) || this.pop.suppl.boxSailQuantity == '' || this.pop.suppl.boxSailQuantity * 1 > this.pop.suppl.allNum) {
                                if (this.pop.suppl.boxSailQuantity > this.pop.suppl.allNum) {
                                    this.$message({
                                        message: '修正错误，不允许超过当天通过盒饭数量',
                                        type: 'warning'
                                    });
                                } else {
                                    this.$message({
                                        message: '必填，并且取值范围必须是0-10000000的正整数',
                                        type: 'warning'
                                    });
                                }
                                this.btnISd = false;
                            } else {
                                return this.pop.suppl.boxSailQuantity;
                                this.btnISd = true;
                            };
                        })()
                    };
                    if (this.btnISd) {
                        api.update(this.id, this.pop.id, obj).then(r => {
                            if (r.status) {
                                this.popShow = false;
                                this.searchTab();
                                this.btnISd = false;
                                this.$message({
                                    message: "修改成功",
                                    type: "success"
                                });
                            }
                        });
                    }
                };
                //接待商提交
                if (this.pop.contentShow == 'reception') {
                    let fun = (a) => {

                        let n = /^[0-9]\d*$/;
                        if (!a) { a = 0 };
                        if (a > 10000000 || n.test(a) == false) {
                            this.btnISd = false;
                            return 'flageError';
                        } else {
                            this.btnISd = true;
                            return a;
                        }
                    }
                    obj = {
                        id: this.pop.id,
                        morningQuantity: fun(this.pop.recep.morningQuantity),
                        nooningQuantity: fun(this.pop.recep.nooningQuantity),
                        eveningQuantity: fun(this.pop.recep.eveningQuantity),
                        entityType: 'RECEPTION'
                    };
                    if (this.btnISd && obj.morningQuantity != 'flageError' && obj.nooningQuantity != 'flageError' && obj.eveningQuantity != 'flageError') {
                        api.update(this.id, this.pop.id, obj).then(r => {
                            if (r.status) {
                                this.popShow = false;
                                this.searchTab();
                                this.btnISd = false;
                                this.$message({
                                    message: "修改成功",
                                    type: "success"
                                });
                            }
                        });
                    } else {
                        this.btnISd = false;
                        this.$message({
                            message: '取值范围必须是0-10000000的数字',
                            type: 'warning'
                        });
                    }
                };
                //配置提交
                if (this.pop.contentShow == 'config') {
                    obj = {
                        personId: this.pop.id,
                        supervisor: (() => {
                            let n = /^[0-9]\d*$/;
                            if (this.pop.config.supervisor == '') { this.pop.config.supervisor = 0 }
                            if (this.pop.config.supervisor > 1000 || !n.test(this.pop.config.supervisor)) {
                                this.$message({
                                    message: ',取值范围必须是0-1000的正整数',
                                    type: 'warning'
                                });
                                this.btnISd = false;
                            } else {
                                this.btnISd = true;
                                return this.pop.config.supervisor;
                            };
                        })(),
                        // this.pop.config.supervisor.toString().trim() == '' ? 0 : this.pop.config.supervisor,
                        reportedDate: this.pop.config.date
                    }
                    if (this.btnISd) {
                        api.updateBoxPerson(this.id, obj).then(r => {
                            if (r.status) {
                                this.popShow = false;
                                this.searchTab();
                                this.btnISd = false;
                                this.$message({
                                    message: "修改成功",
                                    type: "success"
                                });
                            }
                        });
                    }
                };
            },
        },
        data() {
            return {
                btnISd: false,
                boxData: [],
                pop: {
                    id: '',
                    title: '',
                    contentShow: '',
                    suppl: {
                        boxSailQuantity: '',
                        name: '',
                        date: ''
                    },
                    recep: {
                        morningQuantity: '',
                        nooningQuantity: '',
                        eveningQuantity: '',
                        name: '',
                        date: ''
                    },
                    config: {
                        date: "",
                        supervisor: '',
                    }
                },
                supplierPop: {
                    number: ''
                },
                tableData: [{
                    num: '546510'
                }],
                popShow: false,
                sel: {
                    date: '',
                    order: 'DESC',
                    dateList: [],
                    orderlist: [{
                        key: 'DESC',
                        name: '倒序',
                    }, {
                        key: 'ASC',
                        name: '正序',
                    }],
                },
            }
        }
    }
</script>
<style lang='scss' scoped>
    .ml0 {
        margin-left: 0 !important;
    }

    .dateBox {
        min-height: 200px;
        background: rgba(242, 245, 248, 1);
        border: 1px solid rgba(194, 202, 210, 1);
        .time {
            font-size: 16px;
            font-family: PingFangSC-Semibold;
            color: rgba(57, 57, 57, 1);
            line-height: 22px;
        }
        .config {
            margin-bottom: 20px;
            span {
                font-size: 14px;
                font-family: PingFangSC-Regular;
                color: rgba(57, 57, 57, 1);
                line-height: 20px;
                display: inline-block;
                width: 150px;
                margin-right: 20px;
            }
        }
        .clear_a {
            >div {
                width: calc((100% - 20px) / 2);
            }
            .supplier {
                margin-right: 20px;
            }
        }
    }

    .no-data {
        text-align: center;
        line-height: 50px;
        font-size: 16px;
    }
</style>