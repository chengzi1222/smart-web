<template>
    <div class="bigbox">
        <div class="page-tilt">
            <b></b><span>考核分析</span>
        </div>
        <div class="dateBox">
            <el-select class="w130" style="margin-right: 10px;" v-model="transferData.type" @change="sx" placeholder="请选择">
                <el-option v-for="item in patternLis" :key="item.type" class="w140" :label="item.type" :value="item.key">
                </el-option>
            </el-select>
            <el-date-picker v-model="seldate" type="month" @change="singleDate()" placeholder="选择日期" :picker-options="pickerOptions">
            </el-date-picker>
        </div>
        <div style="border: 1px solid #FFD6B6;padding:15px;background:#FFF3E9;margin-top: 15px;color: #F1822A;">
            重要通知：按照市教育局和市食药局对校园食品安全监管工作的进一步指示要求，对于学校食堂当月是否正常使用溯源平台的计算方式， 由之前的<u><b>每月使用一次溯源平台即判定为正常使用</b></u>调整为<u><b>溯源平台累计使用天数达到正常工作日的60%即评定为正常使用</b></u>。
            <br/>备注：正常工作日不包含公休日，法定节假日。
        </div>
        <h3 style="font-size: 18px;color: #393939;margin: 20px 0 10px;">使用情况</h3>
        <div style="font-size: 14px;color: #A2AAB6;" v-if="ran">
            <p>辖区内共有<span v-if="dataLis.ALL">{{dataLis.ALL.buyerNum}}</span><span v-else>0</span>家学校,当月正常使用率为<span v-if="dataLis.ALL">{{dataLis.ALL.rate}}%</span><span
                    v-else>0%</span>。</p>

            <p v-if="$route.query.source == '4k' ||(city && $store.state.common.user.areaCode.length > 4)" style="float: right;margin-top: -21px;">当月使用率排行：第<span
                    class="movePoin" style="color: #0DB5EF" @click="ranking">{{rankNum}}</span>名</p>
            <p v-if="$route.query.source == '4k' ||(city && $store.state.common.user.areaCode.length <= 4)" class="movePoin" style="float: right;margin-top: -21px;color: #0DB5EF"
                @click="ranking">当月使用率排行</p>
        </div>
        <div v-if="rank" class="rankBox">
            <div class="rank">
                <h3>区县使用率排行
                    <span style="float: right;margin-right: 10px;" @click="ranking">X</span>
                    <el-button @click="elseDown" v-if="rankData.length <= 0" class="w65 dc mr20" type="primary">导出</el-button>
                    <a :href="rankDown" v-else class="w65 dc godown mr20" target="_blank" download="filename">导出</a>
                </h3>
                <div style="border: 1px solid #FFD6B6;padding:15px;background:#FFF3E9;margin: 5px 10px;color: #F1822A;">
                    重要通知：按照市教育局和市食药局对校园食品安全监管工作的进一步指示要求，对于学校食堂当月是否正常使用溯源平台的计算方式， 由之前的<u><b>每月使用一次溯源平台即判定为正常使用</b></u>调整为<u><b>溯源平台累计使用天数达到正常工作日的60%即评定为正常使用</b></u>。
                    <br/>备注：正常工作日不包含公休日，法定节假日。
                </div>
                <p style="text-align: right;line-height: 30px;height: 30px;margin-right: 20px;">环比上月排名</p>
                <p v-for="item in rankData" :class="item.areaId == transferData.areaId?'theIs':''">
                    <span style="text-align: center;width: 70px;">{{item.rank}}</span>
                    <span style="width: 160px;">{{item.areaName}}</span>
                    <span class="biBo" style="margin-bottom: -5px;"><span :style="'width:' + item.rate + '%'" class="smBo"></span></span>
                    <span style="width: 190px;text-align: center;">{{item.rate}}%</span>
                    <span :class="item.ranks > 0?'':'rotate360'">
                        <i class="icon iconfont icon-arrow" v-if="item.ranks!=0" :class="item.ranks > 0?'col5e':'col3b'"></i>
                        <span v-if="item.ranks==0">--</span>
                    </span>
                </p>
            </div>
        </div>
        <div class="dataBox">
            <div class="dining">
                <div @click="getPageDataSingle('')">
                    <h3><span v-if="dataLis.ALL">{{dataLis.ALL.buyerNum}}</span><span v-else>0</span>家</h3>
                    <p>学校总数</p>
                </div>
                <div>
                    <h3><span v-if="dataLis.ALL">{{dataLis.ALL.num}}</span><span v-else>0</span>家</h3>
                    <p>当月正常使用</p>
                </div>
                <div>
                    <h3><span v-if="dataLis.ALL">{{dataLis.ALL.rate}}%</span><span v-else>0%</span></h3>
                    <p>使用率</p>
                </div>
            </div>
            <div class="dining">
                <div @click="getPageDataSingle('daXue')">
                    <h3><span v-if="dataLis.UNVSC">{{dataLis.UNVSC.buyerNum}}</span><span v-else>0</span>家</h3>
                    <p>大学总数</p>
                </div>
                <div>
                    <h3><span v-if="dataLis.UNVSC">{{dataLis.UNVSC.num}}</span><span v-else>0</span>家</h3>
                    <p>当月正常使用</p>
                </div>
                <div>
                    <h3><span v-if="dataLis.UNVSC">{{dataLis.UNVSC.rate}}%</span><span v-else>0%</span></h3>
                    <p>使用率</p>
                </div>
            </div>
            <div class="dining">
                <div @click="getPageDataSingle('zhongXue')">
                    <h3><span v-if="dataLis.ZX">{{dataLis.ZX.buyerNum}}</span><span v-else>0</span>家</h3>
                    <p>中学总数</p>
                </div>
                <div>
                    <h3><span v-if="dataLis.ZX">{{dataLis.ZX.num}}</span><span v-else>0</span>家</h3>
                    <p>当月正常使用</p>
                </div>
                <div>
                    <h3><span v-if="dataLis.ZX">{{dataLis.ZX.rate}}%</span><span v-else>0%</span></h3>
                    <p>使用率</p>
                </div>
            </div>
            <div class="dining">
                <div @click="getPageDataSingle('xiaoXue')">
                    <h3><span v-if="dataLis.PRISC">{{dataLis.PRISC.buyerNum}}</span><span v-else>0</span>家</h3>
                    <p>小学总数</p>
                </div>
                <div>
                    <h3><span v-if="dataLis.PRISC">{{dataLis.PRISC.num}}</span><span v-else>0</span>家</h3>
                    <p>当月正常使用</p>
                </div>
                <div>
                    <h3><span v-if="dataLis.PRISC">{{dataLis.PRISC.rate}}%</span><span v-else>0%</span></h3>
                    <p>使用率</p>
                </div>
            </div>
            <div class="dining">
                <div @click="getPageDataSingle('yey')">
                    <h3><span v-if="dataLis.KINDSC">{{dataLis.KINDSC.buyerNum}}</span><span v-else>0</span>家</h3>
                    <p>幼儿园总数</p>
                </div>
                <div>
                    <h3><span v-if="dataLis.KINDSC">{{dataLis.KINDSC.num}}</span><span v-else>0</span>家</h3>
                    <p>当月正常使用</p>
                </div>
                <div>
                    <h3><span v-if="dataLis.KINDSC">{{dataLis.KINDSC.rate}}%</span><span v-else>0%</span></h3>
                    <p>使用率</p>
                </div>
            </div>
        </div>
        <div style="margin: 20px 0;" class="tjbox">
            <span>使用商家</span>
            <el-select class="w150" v-model="Single" @change="getPageData" placeholder="请选择">
                <el-option v-for="item in scLis" :key="item.type" :label="item.type" :value="item.key">
                </el-option>
            </el-select>
            <el-select class="w150" v-model="Use" @change="getPageData" placeholder="请选择">
                <el-option v-for="item in useLis" :key="item.type" :label="item.type" :value="item.key">
                </el-option>
            </el-select>
          <el-select class="w150" v-model="binded" @change="getPageData" placeholder="是否已纳入监管" >
            <el-option v-for="item in bindedList" :key="item.binded" :label="item.bindedName" :value="item.binded">
            </el-option>
          </el-select>
            <el-input placeholder="请输入学校名称" class="w200 seekIpt" v-model="subName" @keyup.native="seekEnter">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="getPageData"></i>
            </el-input>
            <el-button @click="elseDown" v-if="dataPage && dataPage.length <= 0" class="w65 dc" type="primary">导出</el-button>
            <a :href="derive" v-else class="w65 dc godown" target="_blank" download="filename">导出</a>
        </div>
        <div style="position: relative;">
            <div v-if="lodings" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;z-index: 99;text-align: center;background-color: rgba(0,0,0,.1);">
                <span style="position: absolute;top: 50%;margin-top: -30px;"><i class="icon el-icon-loading" style="font-size: 40px;"></i></span>
            </div>
            <el-table :data="dataPage" class="table-div">
                <el-table-column show-overflow-tooltip min-width="50" label="序号">
                    <template slot-scope="scope">
                        {{(pageObj.pageSize * (pageObj.pageNumber - 1) + scope.$index + 1)}}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="buyerName" min-width="250" label="学校" align="left"></el-table-column>
                <el-table-column show-overflow-tooltip prop="buyerType" min-width="100" label="学校类型"></el-table-column>
              <el-table-column show-overflow-tooltip prop="areaName" min-width="120" label="区域"></el-table-column>
              <el-table-column show-overflow-tooltip prop="townDeptName" min-width="220" label="食药所"></el-table-column>
                <el-table-column show-overflow-tooltip prop="num" min-width="80" label="当月使用次数"></el-table-column>
                <el-table-column show-overflow-tooltip min-width="180" label="操作">
                    <template slot-scope="scope">
                        <span v-if="contrastLisName.indexOf(scope.row.buyerName)<0" style="color: #1787AD;" @click="goContrast(scope.row)">加入对比</span>
                        <span v-if="contrastLisName.indexOf(scope.row.buyerName)>=0" style="color: #FA503B;" @click="remo(contrastLisName.indexOf(scope.row.buyerName))">取消对比</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-box">
                <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
                    :total="page.total" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
                </el-pagination>
            </div>
        </div>
        <div name="fixbox">
            <h3 style="font-size: 18px;color: #393939;margin: 20px 0 10px;">使用情况对比图</h3>
            <p style="font-size: 14px;color: #A2AAB6;">最近六个月使用情况</p>
            <div class="echartbox" id="fixbox"></div>
        </div>
        <div class="fixbox">
            <div class="fixtxt">
                使用情况对比<span>{{contrastLis.length}}</span>
            </div>
            <div class="fixcont">
                <span class="sj"></span>
                <div style="margin-bottom: 20px;min-height: 150px;">
                    <p v-for="(item,index) in contrastLis" :title="item.buyerName">{{item.buyerName}}<span @click="remo(index)"
                            class="movePoin">x</span></p>
                </div>
                <div>
                    <el-button class="w100" type="primary" @click="echarts" style="position: relative;">开始对比</el-button>
                    <el-button class="w100" @click="remoAll">取消全部</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as plan from "api/trace/supervise"
    import echarts from "echarts";
    import config from "utils/config";

    export default {
        methods: {
            //  获取时间，默认为当前时间
            getdate(date) {
                let dates = date || new Date();
                let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
                if (mon <= 9) {                                     //如果小于9的话，则需要加上0
                    mon = "0" + mon;
                }
                this.transferData.date = dates.getFullYear() + "-" + mon;

                this.down();
            },
            // 根据当前分页学校guid查询关联的食药所
            findTownFda(){
              let form = new FormData();
              form.append("buyerGuids", this.buyerGuids);
              plan.findTownFda(form).then( r=> {
                  if (r.data && r.data.length > 0) {
                    for (let i = 0 ; i < this.dataPageCopy.length; i++) {
                      for (let j = 0; j < r.data.length; j++) {
                        if (this.dataPageCopy[i].guid == r.data[j].buyer_guid) {
                          this.dataPageCopy[i].areaName = r.data[j].dept_name;
                          break;
                        }
                      }
                    }
                  }
                  this.dataPage = this.dataPageCopy;
              });
            },
            //转换参数类型，请求数据
            gettransferData() {
                this.contrastLis = [];
                let form = new FormData();
                form.append('areaId', this.transferData.areaId);
                form.append('type', this.transferData.type);
                form.append('date', this.transferData.date);
                plan.postRate(form).then(d => {
                    this.dataLis = [];
                    if (d.data.length > 0) {
                        for (let i = 0; i < d.data.length; i++) {
                            this.dataLis[d.data[i].buyerType] = d.data[i];
                        }
                    }
                    this.down();
                })
            },
            //转换参数类型，请求分页数据
            getPageData() {
                this.lodings = true;
                // let form = new FormData();
              // form.append('scType', this.transferData.type);
              // form.append('type', this.Single);
              // form.append('byName', this.subName);
              // form.append('use', this.Use);
              // form.append('areaId', this.transferData.areaId);
              // form.append('date', this.transferData.date);
              // form.append('pageSize', this.page.pageSize);
              // form.append('pageNumber', this.page.pageNum);
              let form = {
                scType: this.transferData.type,
                type: this.Single,
                byName: this.subName,
                use: this.Use,
                binded: this.binded,
                areaId: this.transferData.areaId,
                date: this.transferData.date,
                pageSize: this.page.pageSize,
                pageNumber: this.page.pageNum
              };
                plan.postAssPage(form).then(d => {
                    this.lodings = false;
                    this.dataPage = d.data;
                    if (d.pageObj != undefined) {
                        this.pageObj = d.pageObj;
                        this.page.total = d.pageObj.totalRecords;
                    }
                    this.down();
                })
            },
            //请求排名
            getRank() {
                let form = new FormData();
                form.append('areaId', this.transferData.areaId.slice(0, 4));
                form.append('date', this.transferData.date);
                form.append('type', this.transferData.type);
                plan.postRank(form).then(d => {
                    this.rankData = d.data;
                    this.rankNum = 0;
                    for (var i = 0; i < d.data.length; i++) {
                        if (d.data[i].areaId == this.transferData.areaId) {
                            this.rankNum = d.data[i].rank - 0;
                            break;
                        }
                    }
                });
                let _id = '';
                if (this.transferData.areaId.length == 6) {
                    _id = this.transferData.areaId.slice(0, 4)
                } else {
                    _id = this.transferData.areaId
                }
                this.rankDown = encodeURI(config.Derive + 'govapi/assess/exportRank?areaId=' + _id + '&date=' + this.transferData.date + '&type=' + this.transferData.type);
            },
            //页数改变
            pagecCurrentChange(num) {
                this.page.pageNum = num;
                this.getPageData();
            },
            //每页数量改变
            pageSizeChange(size) {
                this.page.pageSize = size;
                this.getPageData();
            },
            //点击模式分属性
            getPageDataSingle(type) {
                this.Single = type;
                this.getPageData();
                this.down();
            },
            //改变日期
            singleDate() {
                this.getdate(this.seldate);
                this.gettransferData();
                this.getPageData();
                this.getRank();
            },
            //搜索框搜索
            seekEnter(_e) {
                let event = _e ? _e : window.event;
                if (event.keyCode == 13) {
                    this.getPageData();
                } else {
                    this.down();
                }
            },
            go(rowData) {
                let { guid, buyerName } = rowData;
                let { date, areaId } = this.transferData;
                this.$router.push("/yb/bill/detail/?guid=" + guid + "&date=" + date + "&areaId=" + areaId + "&buyerName=" + buyerName);
            },
            sx() {
                this.gettransferData();
                this.getPageData();
                this.getRank();
            },
            goContrast(row) {
                if (this.contrastLis.length < 6) {
                    this.contrastLis.push(row);
                    this.contrastLisName.push(row.buyerName);
                } else {
                    this.$message("至多添加六个对比项")
                }
            },
            remo(index) {
                this.contrastLis.splice(index, 1);
                this.contrastLisName.splice(index, 1);
            },
            remoAll() {
                this.contrastLis = [];
                this.contrastLisName = [];
            },
            ranking() {
                this.rank = !this.rank;
            },
            echarts() {
                if (this.contrastLis.length < 2) {
                    this.$message("至少添加两个对比项");
                    return
                }
                let byGuid = '';
                for (let i = 0; i < this.contrastLis.length; i++) {
                    byGuid += this.contrastLis[i].guid + ','
                }

                let form = new FormData();
                form.append('byGuid', byGuid);
                form.append('date', this.transferData.date);
                let xdata = [];
                let namedata = [];
                let seriesdata = [];
                plan.postCompare(form).then(d => {
                    xdata = d.data.date;
                    let data = d.data.data;
                    for (let i = 0; i < data.length; i++) {
                        namedata.push(data[i].byName);
                        seriesdata.push({
                            name: data[i].byName,
                            type: 'line',
                            smooth: true,
                            showSymbol: false,
                            symbol: 'circle',
                            symbolSize: 6,
                            data: data[i].data,
                            areaStyle: {
                                normal: {
                                }
                            }
                        })
                    }

                    this.syqkChart.clear();
                    const option = {
                        title: {
                            text: '订单数',
                            textStyle: {
                                color: '#6D7787',
                                fontSize: 12
                            },
                            left: '0%',
                            top: 10
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
                            }
                        },
                        legend: {
                            data: namedata,
                            right: '0%',
                            top: 20,
                            textStyle: {
                                fontSize: 14,
                                color: '#6D7787'
                            }
                        },
                        grid: {
                            left: 20,
                            right: 20,
                            bottom: 20,
                            containLabel: true
                        },
                        xAxis: [{
                            type: 'category',
                            boundaryGap: false,
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            data: xdata
                        }],
                        yAxis: [{
                            type: 'value',
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                        }],
                        series: seriesdata
                    };
                    this.syqkChart.setOption(option);
                });
                let e = document.getElementsByClassName('app-container')[0]
                e.scrollTop = e.scrollHeight;
                // window.location.hash = 'fixbox'
            },
            elseDown() {
                this.$message({
                    message: '暂无数据可导出',
                    type: 'warning'
                });
            },
            down() {
              this.derive = encodeURI(config.Derive + 'govapi/assess/exportOne?scType=' + this.transferData.type + '&type=' + this.Single + '&byName=' + this.subName + '&use=' + this.Use + '&binded=' + this.binded + '&areaId=' + this.transferData.areaId + '&date=' + this.transferData.date);
            }
        },
        mounted() {
            this.syqkChart = echarts.init(document.getElementById("fixbox"))
            if (this.$route.query.source == '4k') {
                if(this.$route.query.type!='AllNum'&&this.$route.query.type!='schoolNum'){
                    this.transferData.type = this.$route.query.type? this.$route.query.type: '';
                }
                this.$store.dispatch('getMenus', 'FOOD');
            }
            if (this.$route.query.source == '4k') {
                this.transferData.areaId = '5101'
            } else if (this.$store.state.common.user.areaCode.length <= 4) {
                this.transferData.areaId = this.$store.state.common.user.areaCode;
            } else {
                this.transferData.areaId = this.count;
            }
            if (this.$route.query.source == '4k' || this.count.length <= 3) {
                this.city = false;
            }
            if (this.$route.query.source != '4k' && this.count.length > 8) {
                this.ran = false
            }
            this.getdate();
            this.seldate = this.transferData.date;
            this.gettransferData();
            this.getPageData();
            this.getRank();
            this.down();
        },
        computed: {
            count() {
                return this.$store.state.common.user.regionCode
            }
        },
        data() {
            return {
                buyerGuids: '',
                syqkChart: null,
                city: true,
                seldate: null,
                rank: false,
                rankNum: 0,
                rankData: [],
                patternLis: [{
                    type: '全部办学类型',
                    key: ''
                }, {
                    type: '公立',
                    key: 'PUBLIC'
                }, {
                    type: '私立',
                    key: 'PRIVATE'
                }],
                scLis: [{
                    type: '全部学校类型',
                    key: ''
                }, {
                    type: '大学食堂',
                    key: 'daXue'
                }, {
                    type: '中学食堂',
                    key: 'zhongXue'
                }, {
                    type: '小学食堂',
                    key: 'xiaoXue'
                }, {
                    type: '幼儿园食堂',
                    key: 'yey'
                }],
                useLis: [{
                    type: '全部使用情况',
                    key: ''
                }, {
                    type: '正常使用',
                    key: 'TRUE'
                }, {
                    type: '未正常使用',
                    key: 'FALSE'
                }],
              bindedList: [
                {
                  binded: '',
                  bindedName: '全部监管情况'
                },
                {
                  binded: 'YES',
                  bindedName: '已纳入监管'
                },
                {
                  binded: 'NO',
                  bindedName: '未纳入监管'
                }
              ],
                page: {
                    pageSize: 10,
                    pageNum: 1,
                    total: 0
                },
                transferData: {
                    areaId: '510',
                    type: '',
                    date: null
                },
                dataLis: {
                    'ALL': {
                        buyerNum: 0,
                        num: 0,
                        rate: 0
                    }
                },
              dataPage: [],
              dataPageCopy: [],
                subName: '',
                Single: '',
                Use: '',
                binded: '',
                pageObj: null,
                contrastLis: [],
                contrastLisName: [],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6;
                    }
                },
                derive: '',
                lodings: true,
                ran: true,
                rankDown: '',
                first: true
            };
        },
        components: {

        }
    }
</script>

<style scoped lang="sass">
    .bigbox {
        position: relative;
    }

    .dateBox {
        position: absolute;
        top: 13px;
        right: 0;
        z-index: 666;
    }

    .dataBox {
        overflow: hidden;
    }

    .dataBox div {
        height: 90px;
        text-align: center;
        border: 1px solid #C2CAD2;
        float: left;
    }

    .dataBox div:nth-child(Odd) {
        margin-right: 20px;
    }

    .dataBox h3 {
        font-size: 14px;
        color: #A2AAB6;
        margin-top: 14px;
        line-height: 35px;
    }

    .collect {
        width: 18%;
    }

    .dining {
        width: 48%;
        display: flex;
        justify-content: space-between;
        margin: 20px 0 0;
        font-size: 14px;
        color: #A2AAB6;
    }

    .dining div:first-child {

        cursor: pointer;
    }

    .dining h3 span {
        font-size: 28px;
        color: #393939;
    }

    .dining div {
        border: none;
        width: 33.33%;
    }

    .tjbox span {
        font-size: 18px;
        color: #393939;
    }

    .tjbox .w130 {
        margin-left: 20px;
    }

    .tjbox .w200 {
        margin-left: 20px;
    }

    .dc {
        float: right;
    }

    .table-div {
        margin: 20px 0;
        text-align: center;
    }

    .pagination-box {
        text-align: right;
        margin-top: 20px;
    }

    .dining .riBorder {
        border-right: 1px solid #C2CAD2;
    }

    .fixbox {
        position: fixed;
        top: 50%;
        z-index: 999;
        right: 0;
        height: 228px;
        margin-top: -114px;
    }

    .fixbox .fixtxt {
        background: #59626E;
        width: 34px;
        height: 100%;
        padding: 50px 10px;
        box-sizing: border-box;
        color: #fff;
    }

    .fixtxt span {
        display: inline-block;
        width: 18px;
        height: 18px;
        line-height: 18px;
        margin-top: 10px;
        text-align: center;
        background: #7a818b;
        border-radius: 50%;
    }

    .fixcont {
        position: absolute;
        min-height: 100%;
        width: 260px;
        background: #FFFFFF;
        border: 1px solid #C2CAD2;
        padding: 20px;
        left: 34px;
        top: 0;
        box-sizing: border-box;
        margin-bottom: 20px;
    }

    .sj {
        width: 16px;
        height: 16px;
        margin-top: -8px;
        display: inline-block;
        position: absolute;
        top: 50%;
        background-color: #fff;
        transform: rotate(44deg);
        right: -8px;
    }

    .fixbox:hover .fixcont {
        left: -260px
    }

    .fixcont p {
        font-size: 14px;
        color: #3B3B3B;
        margin-bottom: 15px;
        position: relative;
        padding-right: 15px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .fixcont p:last-child {
        margin-bottom: 0;
    }

    .fixcont p span {
        width: 14px;
        height: 14px;
        background-color: #b4bcc8;
        display: inline-block;
        line-height: 14px;
        text-align: center;
        position: absolute;
        top: 50%;
        right: 0;
        margin-top: -7px;
        border-radius: 50%;
        font-size: 12px;
        color: #fff;
    }

    .echartbox {
        height: 302px;
        margin: 20px 0;
        border: 1px solid #C2CAD2;
    }

    .rankBox {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(155, 155, 155, .5);
        z-index: 9999;
        overflow: auto;
        padding-bottom: 20px;
    }

    .rank {
        background-color: #fff;
        width: 900px;
        margin: 80px auto 0;
        border-radius: 5px;
        color: #7c7d7e;
        padding-bottom: 20px;
        h3 {
            font-size: 18px;
            font-weight: 500;
            padding: 20px;
            margin-bottom: 20px;
            border-bottom: 1px solid #ccc;
        }
        p {
            margin: 5px 0;
            line-height: 40px;
            height: 40px;
            span {
                display: inline-block;
            }
        }
    }

    .biBo {
        width: 400px;
        display: inline-block;
        background-color: #c0c0c0;
        position: relative;
        height: 20px;
    }

    .smBo {
        display: inline-block;
        background-color: #f05050;
        position: absolute;
        left: 0;
        top: 0;
        height: 20px;
    }

    .theIs {
        background-color: #ccc;
    }

    .rotate360 {
        transform: rotateX(180deg);
    }

    .col5e {
        color: #32c25e;
    }

    .col3b {
        color: #fa503b;
    }
</style>
