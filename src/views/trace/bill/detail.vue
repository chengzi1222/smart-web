<template>
  <div class="panel panel-default bigbox" ng-controller="cfdaMainCtrl">
    <div class="page-tilt">
      <b></b>
      <span>{{buyerName}}账单明细</span>
      <Back></Back>
      <div class="floatR bill-detail">
        <el-date-picker @change="dateChange" class="w140" v-model="date" type="month" placeholder="选择月份">
        </el-date-picker>
      </div>
    </div>
    <div class="bill" style="margin-top:20px;">
      <h4>{{buyerName}}&emsp;
        <span>{{(params && params.date)?params.date.substr(-2,2):""}}</span>月账单汇总
      </h4>

      <div class="content-box" style="width:100%">
        <!--点击前  -->
        <div class="left floatL hide" style="min-width:640px;width:60%" v-show="clickTag">
          <p class="title">消费占比</p>
          <p class="count" style="color: #A2AAB6;">品种数:
            <span style="margin-left:5px;">{{order?order.pdtNum:""}}</span>
          </p>
          <div style="height:222px;width:690px;padding-right:10px;margin:0 auto" id="pie">
            <!-- 放图表 -->
          </div>
        </div>

        <!--点击后  -->
        <div class="left floatL click-after clearfix " style="width:59%;border:1px solid #cbcbcb;" v-show="!clickTag">
          <div class="line3"></div>
          <div class="head">
            <strong style="margin-right:5px;">{{pieData.name}}</strong>
            <span>(共计
							<span>{{pieData.value}}</span>元)</span>
            <i class="el-icon-close close" @click="clickTag=true"></i>
          </div>
          <ul class="body-left floatL" style="margin-top:30px;">
            <li class="body-item" v-for="(item,index) in list" :key="" index>
              <span class="rangenum">{{index+1}}.</span>
              <span class="pd-name">{{item.pdtName}}</span>
              <span class="price">{{item.price}}
								<span>元</span>
							</span>
            </li>
          </ul>
        </div>

        <!--分割线  -->
        <div class="line"></div>

        <div class="right floatR text-center" style="width:38%;">
          <p style="margin-top:96px;">
            <span style="color:#1f7fe0;font-size:18px;margin-right:5px;">{{order?order.amount:""}}</span>元</p>
          <p>月总支出</p>
        </div>
      </div>

      <div class="content-box" style="width:61%;">
        <div class="clearfix">
          <p class="title floatL">
            <span>{{(params && params.date)?params.date.substr(-2,2):""}}</span>月消费趋势
            <span>（万元）</span>
          </p>
          <el-select v-model="lineType" placeholder="请选择" @change="drawLine" class="w120 floatR bill-detail">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>

        <div style="height:255px;width:100%;" id="lineEchart">
          <!-- 放图表 -->
        </div>
      </div>

      <div class="content-box floatR" style="width:35%;margin-left:4%;">
        <p class="title">消费分析</p>
        <div style="padding-left:50px;margin-top:30px;">
          <p>月消费
            <span class="red">{{order?((order.amount)/10000).toFixed(4):""}}</span>万,环比上月增长
            <span class="red">{{lastMonth}}</span>
          </p>
          <p style="margin-bottom:20px;">学校消费能力在该辖区排名第
            <span class="red">{{rank}}</span>名。</p>
          <p>学校总人数:
            <span>{{peopelNum?peopelNum:'0'}}</span>人</p>
          <p>人均日消费:
            <span>{{(order && peopelNum)?(order.amount/peopelNum/30).toFixed(2):"--"}}</span>元</p>

          <a v-if="show" @click="show=false" style="height:30px;display:block;text-align:center;width:120px;line-height:30px;margin-top:20px;border:1px solid #0DB5EF ;color:#0DB5EF ;border-radius:5px;"
             href="javascript:;" class="btn">设置学校总人数</a>
          <div v-else style="margin-top:20px;">
            <el-input @blur="show=true" style="width:120px;" v-model="peopelNum" placeholder="请输入学校人数" @keyup.enter.native="handleKeyUp"></el-input>
          </div>

        </div>

      </div>

      <div class="content-box clearfix" style="width:100%">
        <div class="floatL flexbox left" style="width:70%;border-right:1px solid #cbcbcb;">
          <div class="text-center flexbox-item">
            <p>
              <span class="bold">{{order?((order.amount)/10000).toFixed(4):""}}</span>万</p>
            <p class="name">月消费金额</p>
          </div>
          <div class="text-center flexbox-item">
            <p>
              <span class="bold">{{lastYear}}</span>
            </p>
            <p class="name">同比增长率</p>
          </div>
          <div class="text-center flexbox-item">
            <p>
              <span class="bold">{{lastMonth}}</span>
            </p>
            <p class="name">环比增长率</p>
          </div>
          <div class="text-center flexbox-item">
            <p>
              <span class="bold">{{order?order.orderNum:""}}</span>单</p>
            <p class="name">订单总数</p>
          </div>
          <div class="text-center flexbox-item">
            <p>
              <span class="bold">{{order?order.pdtNum:""}}</span>种</p>
            <p class="name">品种数</p>
          </div>
          <div class="text-center flexbox-item">
            <p>
              <span class="bold">{{order?order.dlrNum:""}}</span>家</p>
            <p class="name">供应商数量</p>
          </div>
          <div class="text-center flexbox-item">
            <p>
              <span class="bold">{{rate}}%</span>
            </p>
            <p class="name">使用率</p>
          </div>
          <div class="text-center flexbox-item">
            <p>
              <span class="bold">{{(order && peopelNum)?(order.amount/peopelNum).toFixed(2):"--"}}</span>元</p>
            <p class="name">人均月消费</p>
          </div>
          <div class="text-center flexbox-item">
            <p>
              <span class="bold">{{(order && peopelNum)?(order.amount/peopelNum/30).toFixed(2):"--"}}</span>元</p>
            <p class="name">人均日消费</p>
          </div>
        </div>
        <div class="right floatR text-center" style="width:29%">
          <p class="red" style="margin-top:96px;font-size:30px;">{{status}}</p>
          <p class="name">使用情况</p>
        </div>
      </div>
      <div style="clear:both;"></div>

      <h4 style="margin:20px 0;">账单明细</h4>
      <div style="position: relative;">
        <div v-if="lodings" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;z-index: 99;text-align: center;background-color: rgba(0,0,0,.1);">
					<span style="position: absolute;top: 50%;margin-top: -30px;">
						<i class="icon el-icon-loading" style="font-size: 40px;"></i>
					</span>
        </div>

        <YuanbenTab :tabs="tabs" label="name" value="tab" :tab="tab" @tab-change="choose" width='120px'></YuanbenTab>
        <div v-if="tab !== 'tde'" class="dataLis">
					<span style="margin-left: 0;">
						应收款总金额:{{dataLis.reportAmount?dataLis.reportAmount:0}}元
					</span>
          <span>
						已到账总金额:{{dataLis.hasPay?dataLis.hasPay:0}}元
					</span>
          <span>
						未到账总金额:{{dataLis.noPay?dataLis.noPay:0}}元
					</span>
        </div>
        <div v-if="tab !== 'tde'" style="margin-bottom: 20px;">
          <el-date-picker class="w140" @change="getmoney" v-model="startTime" :editable="false" :picker-options="pickerOptions0"
                          placeholder="起始时间"></el-date-picker>
          <span>至</span>
          <el-date-picker class="w140" @change="getmoney" v-model="endTime" :editable="false" :picker-options="pickerOptions1" placeholder="截止时间"></el-date-picker>
          <el-select class="w130" style="margin: 0 10px;" v-model="statusSel" @change="change" placeholder="请选择">
            <el-option v-for="item in patternLis" :key="item.type" class="w140" :label="item.type" :value="item.key">
            </el-option>
          </el-select>
          <el-input placeholder="请输入客户名称、简称、编号" class="w260 seekIpt" v-model="subName" @keyup.native.enter="change">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="change"></i>
          </el-input>

          <el-button @click="" v-if="dataPage && dataPage.length <= 0" class="w65 floatR" type="primary">导出</el-button>
          <a :href="derive" v-else class="w65 floatR godown" target="_blank" download="filename">导出</a>
        </div>

        <el-table :data="dataPage" class="table-div" v-if="tab == 'order'" @expand-change="gee"  :key="tab">
          <el-table-column show-overflow-tooltip type="index" min-width="50" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="orderCode" min-width="100" label="订单编号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="dlrName" min-width="100" label="配送商"></el-table-column>
          <el-table-column show-overflow-tooltip prop="date" min-width="100" label="配送日期"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" label="成交总金额">
            <template slot-scope="scope">
              <span>{{scope.row.orderAmount}}元</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" label="付款状态">
            <template slot-scope="scope">
              <span>{{scope.row.moneyStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" label="品种数">
            <template slot-scope="scope">
              <span>{{scope.row.pdtNum}}种</span>
            </template>
          </el-table-column>

          <el-table-column type="expand">
            <template slot-scope="prop">
              <el-table :data="prop.row.secondLis" class="table-div"
                        v-loading="tableLoading"
                        style="width: 100%">
                <el-table-column show-overflow-tooltip type="index" min-width="100" label="序号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="pdtName" min-width="250" label="商品名"></el-table-column>
                <el-table-column show-overflow-tooltip min-width="100" label="计量单位">
                  <template slot-scope="scope">
                    <span>{{scope.row.unit}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip min-width="120" label="规格">
                  <template slot-scope="scope">
                    <span>{{scope.row.spec}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip min-width="120" label="成交量">
                  <template slot-scope="scope">
                    <span>{{scope.row.reportWeight}}{{scope.row.unit}}</span>
                  </template>
                </el-table-column><el-table-column show-overflow-tooltip min-width="100" label="成交价">
                <template slot-scope="scope">
                  <span>{{scope.row.reportPrice}}元</span>
                </template>
              </el-table-column><el-table-column show-overflow-tooltip min-width="100" label="成交金额">
                <template slot-scope="scope">
                  <span>{{scope.row.reportAmount}}元</span>
                </template>
              </el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table>

        <el-table :data="dataPage" class="table-div" v-if="tab == 'pdt'" :key="tab">
          <el-table-column show-overflow-tooltip type="index" min-width="50" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="pdtName" min-width="100" label="商品名"></el-table-column>
          <el-table-column show-overflow-tooltip prop="unit" min-width="80" label="计量单位"></el-table-column>
          <el-table-column show-overflow-tooltip prop="spec" min-width="50" label="规格"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" label="成交量">
            <template slot-scope="scope">
              <span>{{scope.row.orderWeight}}{{scope.row.unit}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" label="成交金额">
            <template slot-scope="scope">
              <span>{{scope.row.orderAmount}}元</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" label="未到账金额">
            <template slot-scope="scope">
              <span>{{scope.row.noPay}}元</span>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 交易明细 -->
        <div v-if="tab == 'tde'">
            <div class="selBox">
                <el-input placeholder="商品名称" class="w260 seekIpt mr20" v-model="keyWord" @keyup.enter.native="search">
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
                </el-input>
                <span>配送日期：</span>
                <el-date-picker v-model="startDate" type="date" placeholder="选择起始日期" class="w160" @change="changeDataPage"
                                :picker-options="beforeDate" value-format="yyyy-MM-dd"></el-date-picker>
                <span class="ml10 mr10">至</span>
                <el-date-picker v-model="endDate" type="date" placeholder="选择截止日期" class="w160" @change="changeDataPage"
                                :picker-options="afterDate" value-format="yyyy-MM-dd"></el-date-picker>
                <el-button class="ml20 fr" @click="exportData" :loading="exportLoading" type="primary">导出</el-button>
                <p style="margin-top: 20px;">采购商: {{buyerName}}</p>
            </div>
            <el-table :data="dataPage" :default-sort = "{prop: 'buyTimeFormat', order: 'descending'}" @sort-change="sortChange" class="table-div r30 mt20 allDown movePoin" v-loading="tdeLoading">
                <el-table-column show-overflow-tooltip width="60" label="序号">
                    <template slot-scope="scope">
                        {{(page.pageSize * (page.pageNum - 1) + scope.$index + 1)}}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="orderCode" label="订单编号" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.orderCode?scope.row.orderCode:'-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="pdtName" label="食品名称" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.pdtName?scope.row.pdtName:'-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="realPdtCode" label="商品编码" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.realPdtCode?scope.row.realPdtCode:'-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="prodBatNo" label="商品批次" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.prodBatNo?scope.row.prodBatNo:'-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="realWeight" label="交易数量" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.realWeight?scope.row.realWeight:'-'}}</span> 
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="realUnit" label="单位" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.realUnit?scope.row.realUnit:'-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="realSpec" label="规格" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.realSpec?scope.row.realSpec:'-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="realSourceName" label="供应商" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.realSourceName?scope.row.realSourceName:'-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column sortable="custom" show-overflow-tooltip prop="buyTimeFormat" label="配送时间" min-width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.buyTimeFormat?scope.row.buyTimeFormat:'-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="madeDateFormat" label="生产日期" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.madeDateFormat?scope.row.madeDateFormat:'-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="expiryDateFormat" label="保质期" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.expiryDateFormat?scope.row.expiryDateFormat:'-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="ossTradeCerImg" label="交易凭证" min-width="100">
                    <template slot-scope="scope">
                        <el-link v-if="scope.row.ossTradeCerImg" @click="openTicketDiaolog(scope.column.label, scope.row.ossTradeCerImg)" type="primary">有</el-link>
                        <span v-else>{{'-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="ossDetecCerImg" label="动检证" min-width="100">
                    <template slot-scope="scope">
                        <el-link v-if="scope.row.ossDetecCerImg" @click="openTicketDiaolog(scope.column.label, scope.row.ossDetecCerImg)" type="primary">有</el-link>
                        <span v-else>{{'-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="ossSpybCerImg" label="其它票证" min-width="100">
                    <template slot-scope="scope">
                        <el-link v-if="scope.row.ossSpybCerImg" @click="openTicketDiaolog(scope.column.label, scope.row.ossSpybCerImg)" type="primary">有</el-link>
                        <span v-else>{{'-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="isCardString" label="索票索证" min-width="100"></el-table-column>
            </el-table>
        </div>
            <el-dialog class="dialogDiv" :close-on-click-modal="false" :modal-append-to-body='false' :title="dialogTitle" :visible.sync="ticketDialogVisible">
                <el-image :src="ticketImg" fit="cover"></el-image>
            </el-dialog>
    </div>

        <div class="pagination-box pull-right" style="margin:30px 0">
          <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
                         :total="page.total" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
          </el-pagination>
        </div>
      </div>
  </div>

</template>

<script>
  import YuanbenTab from 'components/common/YuanbenTab'
  import * as billAPI from "api/trace/bill.js"
  import pieCharts from './pie_echarts';
  import lineChars from './line_echarts.js';
  import Back from 'utils/back.vue'       //返回上一个页面按钮
  import config from "utils/config";
  import {getTicket} from "api/trace/ticket"

  export default {
    mounted() {
      if (this.$route.query.source == '4k') {
        this.$store.dispatch('getMenus', 'FOOD');
      }
      this.endTime = this.$route.query.date + '-31';
      this.startTime = this.$route.query.date + '-01';
      
      this.params = this.$route.query;
      this.buyerName = this.params.buyerName
      this.date = this.params.date
      this.getBuyerCode();
      this.draw()
      this.getmoney();
    },
    data() {
      return {
        date: "",
        options: [{
          value: 'month',
          label: '按月统计'
        }, {
          value: 'day',
          label: '按天统计'
        }],
        lineType: 'month',
        pieData: {},
        buyerName: "",
        clickTag: true,
        lastYear: '--',
        lastMonth: '--',
        params: null,
        order: null,
        rate: 0,
        rank: 0,
        peopelNum: null,
        show: true,
        dataPage: [],
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        list: [],
        lodings: true,
        status: '',
        tabs: [{
          name: '按订单',
          tab: 'order'
        }, {
          name: '按商品',
          tab: 'pdt'
        },{
          name: '交易明细',
          tab: 'tde'
        }],
        tab: 'order',
        startTime: null,
        endTime: null,
        pickerOptions0: {
          disabledDate: (time) => {
            if (this.endTime) {
              return time.getTime() > this.endTime;
            }

          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            if (this.startTime) {
              return time.getTime() < this.startTime;
            }
          }
        },
        patternLis: [ {
          type: '全部',
          key: ''
        },{
          type: '未支付',
          key: 'FALSE'
        }, {
          type: '已支付',
          key: 'TRUE'
        }],
        statusSel: '',
        subName: '',
        derive:'',
        dataLis:{},
        tableLoading:false,
        /**交易明细data*/ 
        keyWord: '',
        startDate: '',
        endDate: '',
        tdeLoading: false,
        exportLoading: false,
        orderBy: 'DESC',
        buyerCode: null, 
        ticketDialogVisible: false,
        dialogTitle:'票证',
        ticketImg: '',
        beforeDate: {
            disabledDate: (time) => {
                let before = new Date("2018-01-01") - 8.64e7;
                let after = new Date();
                let endDate = new Date(this.endDate);
                let intervalDate = endDate.getDate();
                let intervalMonth = endDate.getMonth() + 1 - 3;
                let intervalYear = endDate.getFullYear();
                if(intervalMonth < 1) {
                    intervalMonth = intervalMonth + 12;
                    intervalYear = intervalYear - 1;
                }
                let interval = new Date(intervalYear + '/' + intervalMonth + '/' + intervalDate + '/08:00:00');
                if (this.endDate) {
                    return time.getTime() < interval || time.getTime() > endDate || time.getTime() > after || time.getTime() < before;
                } else {
                    return time.getTime() > after || time.getTime() < before;
                }
            }
        },
        afterDate: {
            disabledDate: (time) => {
                let before = new Date("2018-01-01") - 8.64e7;
                let after = new Date();
                let startDate = new Date(this.startDate);
                let intervalDate = startDate.getDate();
                let intervalMonth = startDate.getMonth() + 1 + 3;
                let intervalYear = startDate.getFullYear();
                if(intervalMonth > 12) {
                    intervalMonth = intervalMonth - 12;
                    intervalYear = intervalYear + 1;
                }
                let interval = new Date(intervalYear + '/' + intervalMonth + '/' + intervalDate + '/08:00:00') - 8.64e7;
                if (this.startDate) {
                    return time.getTime() > interval || time.getTime() < startDate - 8.64e7 || time.getTime() > after || time.getTime() < before;
                } else {
                    return time.getTime() > after || time.getTime() < before;
                }
            }
        }
      }
    },
    computed: {
        queryParams: function(){
            return {
                buyerName: this.buyerName,
                buyerCode: this.buyerCode, 
                pdtName: this.keyWord, 
                startTime: this.startDate, 
                endTime: this.endDate,
                orderBy: this.orderBy,
                areaId: this.params.areaId, 
                pageNumber: this.page.pageNum, 
                pageSize: this.page.pageSize 
            }
        },
        buyerParams: function() {
            return {
                buyerName: this.buyerName,
                areaId: this.params.areaId, 
                pageNumber: this.page.pageNum, 
                pageSize: this.page.pageSize
            }
        }
    },
    methods: {
      gee(row){
        this.tableLoading =  true;
        row.secondLis =[
         {
           unit:'22',
           spec:'222',
           reportWeight:'2222',
           reportPrice:'22222',
           reportAmount:'222222'
         }

        ]
        if(row.orderCode!=null){
          let form = new FormData();
          form.append('orderCode', row.orderCode);

          billAPI.billOdpage(form).then(d =>{
            setTimeout(()=>{
              this.tableLoading = false;
            },200)
            this.$set(row,'secondLis', d.data);
          })
        }

      },
      test(){
        console.log('展开事件')
      },
      elseDown() {
        this.$message({
          message: '暂无数据可导出',
          type: 'warning'
        });
      },
      down() {
        this.derive = encodeURI(config.Derive + 'govapi/bill/exportOrder?guid=' + this.params.guid
            + '&type=' + this.tab
            + '&sDate=' + this.getdateT(this.startTime)
            + '&eDate=' + this.getdateT(this.endTime))
          + '&pageSize=' + this.page.pageSize
          + '&pageNumber=' + this.page.pageNum
          + '&dlrName=' + this.subName
          + '&pay=' + this.statusSel;
      },
      choose(tab) {
        if (this.tab !== tab) {
          this.tab = tab
          this.page.pageNum=1;
          if(this.tab === 'tde') {
              this.dateInit();
              this.refreshTable();
          } else {
              this.getPageData();
          }
        }
      },
      //  获取时间，默认为当前时间
      getdate(date) {
        let dates = null;
        if (date == undefined || date == 'undefined') {
          dates = new Date();
        } else {
          dates = date;
        }
        let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        this.params.date = dates.getFullYear() + "-" + mon;
        if(mon=='02'){
          this.endTime = dates.getFullYear() + "-" + mon + '-28';
        } else {
          this.endTime = dates.getFullYear() + "-" + mon + '-31';
        }
        this.startTime = dates.getFullYear() + "-" + mon + '-01';
      },
      getdateT(date) {
        if (date == null || date.getDate == undefined) {
          return date || ''
        }
        let mon = date.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        let day = date.getDate();         //getMonth()返回的是0-11，则需要加1
        if (day <= 9) {                                     //如果小于9的话，则需要加上0
          day = "0" + day;
        }
        return date.getFullYear() + "-" + mon + "-" + day;
      },
      dateChange() {
        this.getdate.call(this, this.date);
        this.draw();
        this.getmoney();
        if(this.tab === 'tde') {
            this.dateInit();
            this.refreshTable();
        }
      },
      handleKeyUp() {
        this.peopelNum = this.peopelNum.replace(/^0|\D+/, '');
      },
      change(){
         this.page.pageNum=1;
        this.getPageData()
      },
      //转换参数类型，请求分页数据
      getPageData() {
        this.lodings = true;
        let form = new FormData();
        form.append('guid', this.params.guid);
        form.append('type', this.tab);
        form.append('sDate', this.getdateT(this.startTime));
        form.append('eDate', this.getdateT(this.endTime));
        // form.append('date', this.params.date);
        form.append('pageSize', this.page.pageSize);
        form.append('pageNumber', this.page.pageNum);
        form.append('dlrName', this.subName);
        form.append('pay', this.statusSel);
        billAPI.odpage(form).then(d => {
          this.lodings = false;
          this.dataPage = d.data;
          this.page.total = d.pageObj.totalRecords;
          this.down();
        })
      },
      getmoney(){
        this.page.pageNum=1;
        let form = new FormData();
        form.append('guid', this.params.guid);
        form.append('sDate', this.getdateT(this.startTime));
        form.append('eDate', this.getdateT(this.endTime));
        billAPI.money(form).then(d => {
          this.dataLis = d.data;
        })
        this.getPageData();
      },
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        if(this.tab === 'tde') {
            this.refreshTable();
        } else {
            this.getPageData();
        }
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageNum = 1;
        this.page.pageSize = size;
        if(this.tab === 'tde') {
            this.refreshTable();
        } else {
            this.getPageData();
        }
      },
      //渲染页面ehcarts
      draw() {
        let form = new FormData();
        for (let key in this.params) {
          let item = this.params[key];
          form.append(key, item);
        }
        billAPI.postDetail(form).then(res => {
          this.order = res.data.order;
          this.rate = res.data.rate;
          this.rank = res.data.rank;
          this.lastYear = res.data.lastYear ? res.data.lastYear : '--';
          this.lastMonth = res.data.lastMonth ? res.data.lastMonth : '--';
          this.status = res.data.order.level;

          let bChart = res.data.bChart;
          let arr = [];
          let nameArr = [];
          bChart.forEach(item => {
            arr.push(Object.assign({}, {
              "name": (item['typeName'] + " " + item['price'] + "元 " + item["per"] + "%"),
              "value": item['price'],
              "typeCode": item['typeCode']
            }));
            nameArr.push(item['typeName'] + " " + item["price"] + "元 " + item["per"] + "%")
          });

          pieCharts('pie', nameArr, arr, (a, b) => {
            let form = new FormData();
            form.append('guid', this.params.guid);
            form.append('date', this.params.date);
            form.append('typeCode', a.data.typeCode);
            this.pieData = a.data;

            billAPI.pdtlist(form).then(d => {
              this.list = d.data;
              this.clickTag = false
            })

          });
        })

        this.drawLine();

      },
      drawLine() {
        let form = new FormData();
        form.append('guid', this.params.guid);
        form.append('date', this.params.date);
        form.append('type', this.lineType);

        billAPI.line(form).then(d => {
          let lChart = d.data;
          let arr2 = [];
          let nameArr2 = [];
          lChart.forEach(item => {
            arr2.push(item["amount"]);
            nameArr2.push(item['date'])
          });
          lineChars('lineEchart', '订单总金额', nameArr2, arr2, (date) => {
            this.params.date = date;
            this.date = date;
            this.getPageData();
            this.drawLine();
            this.draw();
          });
        })

      },
/**
 *  交易明细方法
*/
        // 搜索
        search() {
            this.page.pageNum = 1;
            this.refreshTable();
        },
        // 日期选择
        changeDataPage() {
            this.page.pageNum = 1;
            this.refreshTable();
        },
        // 日期初始化
        dateInit() {
            let year = this.$route.query.date.slice(0,4);
            this.startDate = this.$route.query.date + '-01';
            let monthStr = this.$route.query.date.slice(5);
            if([1,3,5,7,8,10,12].indexOf(parseInt(monthStr)) > -1) { // 大月
                this.endDate =  this.$route.query.date + '-31';
            } else if ([4,6,9,11].indexOf(parseInt(monthStr)) > -1) { // 小月
                this.endDate =  this.$route.query.date + '-30';
            } else { // 2月
                if(year%4 === 0) { // 闰年
                    this.endDate =  this.$route.query.date + '-29';
                } else {
                    this.endDate =  this.$route.query.date + '-28';
                }
            }
        },
        // 排序
        sortChange(params) {
            if(params.order !== null) {
                if(params.order === 'ascending') { // 升序
                    this.orderBy = 'ASC';
                } else if(params.order === 'descending') { // 降序
                    this.orderBy = 'DESC';
                } 
                this.page.pageNum = 1;
                this.refreshTable();
            }
        },
        // 导出
        exportData() {
            this.exportLoading = true;
            billAPI.tradeDetailExport(this.queryParams).then(r => {
                if(r.code === 200) {
                    window.open(r.data)
                } else {
                    this.$message.error(r.msg);
                }
                this.exportLoading = false;
            }).catch(e => {
                console.log(e)
            })
        },
        openTicketDiaolog(label, imgSrc) {
            this.dialogTitle = label;
            this.ticketImg = imgSrc;
            this.ticketDialogVisible = true;
        },
        refreshTable() {
            this.tdeLoading = true;
            billAPI.tradeDetailList(this.queryParams).then(r => {
                if(r.code === 200) {
                    this.dataPage = r.data;
                    this.page.total = r.pageObj.totalRecords;
                    this.tdeLoading = false;
                } else {
                    this.$message.error(r.msg);
                }
            }).catch(e => {})
        },
        // 获取buyerCode
        getBuyerCode() {
            getTicket(this.buyerParams).then(r => {
                if(r.code === 200) {
                    this.buyerCode = r.data[0].buyerCode
                } else {
                    this.$message.error(r.msg);
                }
            }).catch(e => {})
        }
    },
    components: {
      Back,
      YuanbenTab
    }
  }

</script>
<style lang="scss">
  .bill-detail .el-input__icon {
    width: 0px !important;
  }

  .bill-detail .el-input__suffix {
    width: 30px;
    height: 26px;
  }
  .red {
        color: red;
      }
</style>

<style lang="scss" scoped>
  .bigbox {
    position: relative;
  }

  .dateBox {
    position: absolute;
    top: 15px;
    right: 0;
    z-index: 666;
  }

  h4 {
    margin: 0;
    margin-bottom: 10px;
    font-size: 20px;
    color: #393939;
  }

  .bill {
    &:after {
      content: "";
      clear: both;
      overflow: hidden;
    }
    .content-box {
      position: relative;
      padding: 10px;
      color:#5a5a5a;
      margin: 10px 0;
      float: left;
      height: 300px;
      border: 1px solid #cbcbcb;
      box-sizing: border-box;
      .title {
        font-size: 16px;
        color: #393939;
      }
      .line {
        height: 240px;
        width: 1px;
        position: absolute;
        left: 61%;
        top: 33px;
        background: #cbcbcb;
      }
      .linetwo {
        height: 177px;
        width: 1px;
        position: absolute;
        left: 30%;
        top: 61px;
        background: #cbcbcb;
      }
      .click-after {
        position: relative;
        .line3 {
          position: absolute;
          left: 50%;
          top: 50px;
          background: #ccc;
          width: 1px;
          height: 228px;
        }
        .head {
          height: 50px;
          line-height: 50px;
          background-color: #e7ebee;
          padding: 0 20px;
          border-bottom: 1px solid #cbcbcb;
          position: relative;
          >.close {
            position: absolute;
            right: 20px;
            top: 20px;
            cursor: pointer;
            &:hover {
              opacity: 0.5;
            }
          }
        }
        ul {
          box-sizing: border-box;
          padding: 0 20px;
          list-style: none;
          width: 100%;
          color: #A2AAB6;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          height: 198px;
        }
        .body-item {
          box-sizing: border-box;
          width: 50%;
          padding: 0 20px;
          height: 35px;
          line-height: 35px;
          .price {
            float: right;
          }
          .rangenum {
            margin-right: 10px;
          }
        }
      }
    }
    .left,
    .right {
      height: 100%;
    }
    .flexbox {
      display: flex;
      flex-wrap: wrap;
      .flexbox-item {
        width: 160px;
        margin: 10px;
      }
    }
    .bold {
      font-size: 28px;
      color: #393939;
    }
  }

  .name {
    font-size: 14px;
    color: #A2AAB6;
  }
  .dataLis{
    margin-bottom: 20px;
    span{
      margin:0 20px;
      font-size:15px;
      color:#9a9a9a;
    }
  }
  .dialogDiv {
        text-align:center;
  }
</style>
