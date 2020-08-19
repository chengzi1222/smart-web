<template>
    <div class="bigbox">
    	<div class="page-tilt"> 
    	    <b></b><span>猪肉价格汇总</span>
    	</div>
        <div class="absolute" style="right:0px; top:15px;">
            <el-date-picker v-model="searchDate" class="w160" type="date" placeholder="年/月/日" @change="changeDate"
                        :picker-options="pickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
        </div>
        <div class="dateBox">
            <el-collapse v-model="activeNames" @change="handleChange" style="margin-top:40px;">
                <el-collapse-item title="猪肉综合价格" name="superior">
                    <div style="overflow-x: auto">
                        <el-table :data="compPrice" class="table-div r30 allDown movePoin" v-loading="compLoading">
                            <el-table-column show-overflow-tooltip width="60" type=index label="序号">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="areaName" label="辖区" min-width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.areaName?scope.row.areaName:'成都市'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="avgPrice" label="猪肉均价" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.avgPrice?scope.row.avgPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="yesAvgPrice" label="昨日均价" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.yesAvgPrice?scope.row.yesAvgPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="percent" label="较昨日涨幅(%)" min-width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.percent?scope.row.percent : '-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p1AvgPrice" label="猪腿肉均价" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p1AvgPrice?scope.row.p1AvgPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p1MinPrice" label="猪腿肉最低价格" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p1MinPrice?scope.row.p1MinPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p1MaxPrice" label="猪腿肉最高价格" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p1MaxPrice?scope.row.p1MaxPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p2AvgPrice" label="五花肉均价" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p2AvgPrice?scope.row.p2AvgPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p2MinPrice" label="五花肉最低价格" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p2MinPrice?scope.row.p2MinPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p2MaxPrice" label="五花肉最高价格" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p2MaxPrice?scope.row.p2MaxPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p3AvgPrice" label="排骨均价" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p3AvgPrice?scope.row.p3AvgPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p3MinPrice" label="排骨最低价格" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p3MinPrice?scope.row.p3MinPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p3MaxPrice" label="排骨最高价格" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p3MaxPrice?scope.row.p3MaxPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p4AvgPrice" label="肉绍子均价" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p4AvgPrice?scope.row.p4AvgPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p4MinPrice" label="肉绍子最低价格" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p4MinPrice?scope.row.p4MinPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p4MaxPrice" label="肉绍子最高价格" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p4MaxPrice?scope.row.p4MaxPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="各辖区猪肉采购价格" name="junior">
                    <div style="overflow-x: auto">
                        <el-button class="floatR mb10" @click="exportData" :loading="exportLoading" type="primary">导出</el-button>
                        <el-table :data="areaPrice" :default-sort = "{prop: 'avgPrice', order: 'descending'}" class="table-div r30 allDown movePoin" v-loading="compLoading">
                            <el-table-column show-overflow-tooltip width="60" type=index label="序号">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="areaName" label="辖区" min-width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.areaName?scope.row.areaName:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="avgPrice" sortable label="猪肉均价" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.avgPrice?scope.row.avgPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="yesAvgPrice" label="昨日均价" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.yesAvgPrice?scope.row.yesAvgPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="percent" label="较昨日涨幅(%)" min-width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.percent?scope.row.percent : '-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p1avgPrice" label="猪腿肉均价" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p1avgPrice?scope.row.p1avgPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p1minPrice" label="猪腿肉最低价格" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p1minPrice?scope.row.p1minPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p1maxPrice" label="猪腿肉最高价格" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p1maxPrice?scope.row.p1maxPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p2avgPrice" label="五花肉均价" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p2avgPrice?scope.row.p2avgPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p2minPrice" label="五花肉最低价格" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p2minPrice?scope.row.p2minPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p2maxPrice" label="五花肉最高价格" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p2maxPrice?scope.row.p2maxPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p3avgPrice" label="排骨均价" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p3avgPrice?scope.row.p3avgPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p3minPrice" label="排骨最低价格" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p3minPrice?scope.row.p3minPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p3maxPrice" label="排骨最高价格" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p3maxPrice?scope.row.p3maxPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p4avgPrice" label="肉绍子均价" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p4avgPrice?scope.row.p4avgPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p4minPrice" label="肉绍子最低价格" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p4minPrice?scope.row.p4minPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="p4maxPrice" label="肉绍子最高价格" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.p4maxPrice?scope.row.p4maxPrice:'-'}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
import * as porkPrice from "api/trace/pork"
export default {
    data() {
        return {
            activeNames: ['superior', 'junior'],
            compLoading: false,
            areaLoading: false,
            searchDate: '',
            pickerOptions: {
                disabledDate: (time) => {
                    let before = new Date("2018-01-01") - 8.64e7;
                    let after = new Date();
                    return time.getTime() < before || time.getTime() > after
                }
            },
            exportLoading: false,
            compPrice:[],
            areaPrice: [],
        }
    },
    computed: {
        
    },
    methods: {
        handleChange(val) {

        },
        changeDate(val) {
            if(!val) return;
            this.getCompPrice();
            this.getAreaPrice();
        },
        // 导出各辖区价格
        exportData() {
            this.exportLoading = true;
            porkPrice.priceExport({date: this.searchDate}).then(r => {
                if(r.code === 200) {
                    window.open('https://yuanben-bucket.oss-cn-hangzhou.aliyuncs.com/' + r.data,'_blank');
                } else {
                    this.$message.error(r.msg);
                }
                this.exportLoading = false;
            }).catch(e => {})
        },
        getCompPrice() {
            this.compLoading = true;
            porkPrice.compPriceList({date: this.searchDate}).then(r => {
                if(r.code === 200) {
                    this.compPrice = [r.data];
                    this.compLoading = false;
                } else {
                    this.$message.error(r.msg);
                }
            }).catch(e => {})
        },
        getAreaPrice() {
            this.areaLoading = true;
            porkPrice.areaPriceList({date: this.searchDate}).then(r => {
                if(r.code === 200) {
                    this.areaPrice = r.data;
                    this.areaLoading = false;
                } else {
                    this.$message.error(r.msg);
                }
            }).catch(e => {})
        }
    },
    mounted() {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let date = now.getDate();
        this.searchDate = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (date < 10 ? ('0' + date) : date);
        this.getCompPrice();
        this.getAreaPrice();
    }
}
</script>

<style scoped lang="sass">
.bigbox {
  position: relative;
}
.dateBox {
  top: 15px;
  right: 0;
  z-index: 666;
}

</style>
