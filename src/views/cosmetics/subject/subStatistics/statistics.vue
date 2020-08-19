<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>巡查概况统计</span>
    </div>
    <div class="content">
      <div class="timeBox">
        <span>日常巡查概况</span>
        <el-date-picker @change="getDaily" value-format="yyyy-MM-dd" class="sleq padRightNo" type="date"
                        v-model="dailyBeginTime" :clearable="false"
                        placeholder="起始时间" :picker-options="dailyStartDate"></el-date-picker>
        至
        <el-date-picker @change="getDaily" value-format="yyyy-MM-dd" class="slez padRightNo" type="date"
                        v-model="dailyOverTime" :clearable="false"
                        placeholder="截止时间" :picker-options="dailyAfterDate"></el-date-picker>
        <el-select class="w150" style="margin-left: 20px;" v-model="dailyEntityType" @change="getDaily"
                   placeholder="主体类型">
          <el-option :label="'主体类型(全部)'" :value="''"></el-option>
          <el-option v-for="item in entityTypeList" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
        <el-select class="w150" style="margin-left: 20px;" v-model="dailyQuanLevel" @change="getDaily"
                   placeholder="量化等级">
          <el-option v-for="item in quanLevelLis" :key='item.code' :label="item.name" :value="item.code">
          </el-option>
          <el-option :label="'未评估'" :value="'OTHER'"></el-option>
        </el-select>
        <el-select class="w150" style="margin-left: 20px;" v-model="dailyRiskLevel" @change="getDaily"
                   placeholder="风险等级">
          <el-option v-for="item in riskLevelLis" :key='item.code' :label="item.name" :value="item.code">
          </el-option>
          <el-option :label="'未评估'" :value="'OTHER'"></el-option>
        </el-select>
      </div>
      <div class="dailyData">
        <div class="dataBox">
          <p>综合数据</p>
          <div class="topDataBox aloneDiv">
            <div @click="go('dailyRecord.tab')" v-if="goTwo">
              <h3>{{dailyData.totalPatrol?dailyData.totalPatrol:0}}<span class="unit">(次)</span></h3>
              <p>累计巡查</p>
            </div>
            <div style="cursor: default;" v-else>
              <h3>{{dailyData.totalPatrol?dailyData.totalPatrol:0}}<span class="unit">(次)</span></h3>
              <p>累计巡查</p>
            </div>
            <div style="cursor: default;">
              <h3><span>{{entityCoverage?entityCoverage:0}}</span></h3>
              <p>主体覆盖率</p>
            </div>
            <div style="cursor: default;">
              <h3><span>{{inconformity?inconformity:0}}</span></h3>
              <p>巡查结果不符合率</p>
            </div>
          </div>
          <div class="bottomDataBox aloneDiv">
            <div style="cursor: default;">
              <h3>{{dailyData.overdueNotPatrol?dailyData.overdueNotPatrol:0}}</h3>
              <p>当前逾期未巡查</p>
            </div>
            <div style="cursor: default;" class="relative">
              <h3>{{dailyData.toBeOverdue?dailyData.toBeOverdue:0}}</h3>
              <p>当前即将逾期</p>
              <el-tooltip class="item" effect="dark" content="距离逾期检查时间在七天之内的为即将逾期" placement="top-end">
                <u class="wxts movePoin absolute">温馨提示</u>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="echartBox">
          <ul class="tab-box">
            <li v-for="(item,index) in PlanStateList" :key="index" :class="index==mess.chooseOne?'li-bott':''"
                @click="choose(index,item.key)">
              <div :data-index='index'>{{item.name}}</div>
            </li>
            <li class="tab-bott"></li>
          </ul>
          <div id="echartDaily" class="echart" :class="mess.chooseOne == 0?'echartIndex':''"></div>
          <div id="echartDailyT" class="echart" :class="mess.chooseOne == 1?'echartIndex':''"></div>
        </div>
      </div>

      <div class="muchDataBox">
        <ul class="tab-box">
          <li v-for="(item,index) in muchDatas" :key="index" :class="index==mess.chooseTwo?'li-bott':''"
              @click="chooseTwo(index,item.key)">
            <div :data-index='index'>{{item.name}}</div>
          </li>
          <li class="tab-bott"></li>
        </ul>
        <div style="padding: 20px;position: relative;min-height: 320px;">

          <!-- 巡查动态 -->
          <div class="clearfix" v-if="this.mess.chooseTwo == 0" key='0' v-loading="loading"
               element-loading-text="拼命加载中">
            <el-table :data="dynamic" style="width: 100%;margin-top:20px;font-size:12px;">
              <el-table-column align="center" label="序号" type="index" min-width="50">
              </el-table-column>
              <el-table-column align="center" label="巡查对象" prop="entityName" min-width="100">
              </el-table-column>
              <el-table-column align="center" label="巡查结果" min-width="80">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.resultStr == '符合'" size="mini" type="success">{{scope.row.resultStr}}</el-tag>
                  <el-tag v-if="scope.row.resultStr == '不符合'" size="mini" type="danger">{{scope.row.resultStr}}</el-tag>
                  <el-tag v-if="scope.row.resultStr == '基本符合'" size="mini" type="warning">{{scope.row.resultStr}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="所属食药所" prop="deptName" min-width="150"></el-table-column>
              <el-table-column align="center" prop="check" label="监管员" min-width="50">
              </el-table-column>
              <el-table-column align="center" prop="patrolTime" label="时间" min-width="150">
              </el-table-column>
            </el-table>
          </div>
          <!-- 统计报表 -->
          <div v-if="this.mess.chooseTwo == 1" key='1' v-loading="loading" element-loading-text="拼命加载中">
            <div style="margin-bottom: 20px;">
              <el-date-picker value-format="yyyy-MM-dd" @change="getReportDaily" class="sleq padRightNo"
                              style="margin-left: 0;" type="date"
                              v-model="reportStartDate" placeholder="起始时间"
                              :picker-options="beforeDate"></el-date-picker>
              至
              <el-date-picker value-format="yyyy-MM-dd" @change="getReportDaily" v-model="reportEndDate"
                              class="slez padRightNo" type="date"
                              placeholder="截止时间" :picker-options="afterDate"></el-date-picker>
              <el-select class="w150" style="margin-left: 20px;" v-model="ReportDailyEntityType"
                         @change="getReportDaily" placeholder="主体类型">
                <el-option :label="'主体类型(全部)'" :value="''"></el-option>
                <el-option v-for="item in entityTypeList" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
              <el-select class="w150" clearable style="margin-left: 20px;" v-model="rank" @change="getReportDaily"
                         placeholder="排序方式">
                <el-option v-for="item in rankLis" :key="item.key" :label="item.type" :value="item.key">
                </el-option>
              </el-select>
              <el-button @click="exportExcel" class="floatR w100" type="primary">导出</el-button>
            </div>
            <el-table :data="report" class="table-div" height="250">
              <el-table-column min-width="50" label="排名">
                <template slot-scope="scope">
                  {{scope.$index + 1}}
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="areaName" min-width="100" label="单位名称"></el-table-column>
              <el-table-column show-overflow-tooltip prop="recordCount" min-width="100" label="累计巡查"></el-table-column>
              <el-table-column show-overflow-tooltip min-width="130" label="符合/基本符合/不符合">
                <template slot-scope="scope">
                  {{scope.row.result}}
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="legalPerson" min-width="200" label="正常/现场整改/限期整改/调查处理/责令停业">
                <template slot-scope="scope">
                  {{scope.row.treat}}
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip min-width="80" label="主体覆盖率">
                <template slot-scope="scope">
                  {{scope.row.coverage?scope.row.coverage:0}}
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip min-width="80" label="逾期未巡查">
                <template slot-scope="scope">
                  {{scope.row.overdue?scope.row.overdue:0}}
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip min-width="80" label="即将逾期">
                <template slot-scope="scope">
                  {{scope.row.soonOverdue?scope.row.soonOverdue:0}}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 年度累计巡查次数 -->
          <div class="eBoxClass" :class="this.mess.chooseTwo == 2?'zIndex99':''" v-loading="loading"
               element-loading-text="拼命加载中">
            <el-select class="w150" style="margin-left: 20px;" v-model="totalPatrolEntityType" @change="getTotalPatrol"
                       placeholder="主体类型">
              <el-option :label="'主体类型(全部)'" :value="''"></el-option>
              <el-option v-for="item in entityTypeList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
            <div class="echa" id="totalPatrol"></div>
          </div>
          <!-- 主体覆盖率 -->
          <div class="eBoxClass" :class="this.mess.chooseTwo == 3?'zIndex99':''" v-loading="loading"
               element-loading-text="拼命加载中">
            <div>
              <!-- <span style="margin: 0 20px 0 10px;">量化等级</span> -->
              <el-select class="w150 mr10" @change="getEntityCoverageChart" v-model="quanLevel" placeholder="请选择">
                <el-option v-for="item in quanLevelLis" :key='item.code' :label="item.name" :value="item.code">
                </el-option>
                <el-option :label="'未评估'" :value="'OTHER'"></el-option>
              </el-select>
              <!-- <span style="margin: 0 20px 0 10px;">风险等级</span> -->
              <el-select class="w150 mr10" @change="getEntityCoverageChart" v-model="riskLevel" placeholder="请选择">
                <el-option v-for="item in riskLevelLis" :key='item.code' :label="item.name" :value="item.code">
                </el-option>
                <el-option :label="'未评估'" :value="'OTHER'"></el-option>
              </el-select>
              <el-select class="w150" style="margin-left: 20px;" v-model="EntityCoverageChartEntityType"
                         @change="getEntityCoverageChart" placeholder="主体类型">
                <el-option :label="'主体类型(全部)'" :value="''"></el-option>
                <el-option v-for="item in entityTypeList" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </div>
            <div class="echa" id="coverage"></div>
          </div>
          <!-- 逾期未巡查数 -->
          <div class="eBoxClass" :class="this.mess.chooseTwo == 4?'zIndex99':''" key='4' v-loading="loading"
               element-loading-text="拼命加载中">
            <el-select class="w150" style="margin-left: 20px;" v-model="overdueEntityType"
                       @change="getOverdueNotPatrolChart" placeholder="主体类型">
              <el-option :label="'主体类型(全部)'" :value="''"></el-option>
              <el-option v-for="item in entityTypeList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
            <div class="echa" id="overdue"></div>
          </div>
          <!-- 即将逾期 -->
          <div class="eBoxClass" :class="this.mess.chooseTwo == 5?'zIndex99':''" v-loading="loading"
               element-loading-text="拼命加载中">
            <el-select class="w150" style="margin-left: 20px;" v-model="aboutOfEntityType" @change="getToBeOverdueChart"
                       placeholder="主体类型">
              <el-option :label="'主体类型(全部)'" :value="''"></el-option>
              <el-option v-for="item in entityTypeList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
            <div class="echa" id="aboutOf"></div>
          </div>
        </div>
      </div>
      <div class="timeBox mt20">
        <span>专项巡查概况</span>
      </div>
      <div class="specialData aloneDiv">
        <div @click="go('cosmetics.specialList',2)" v-if="goOne">
          <h3>{{specialData.finishedNum?specialData.finishedNum:0}}<span class="unit">(条)</span></h3>
          <p>已完成的计划</p>
        </div>
        <div style="cursor: default;" v-else>
          <h3>{{specialData.finishedNum?specialData.finishedNum:0}}<span class="unit">(条)</span></h3>
          <p>已完成的计划</p>
        </div>
        <div @click="go('cosmetics.specialList','执行中')" v-if="goOne">
          <h3>{{specialData.executingNum?specialData.executingNum:0}}<span class="unit">(条)</span></h3>
          <p>执行中的计划</p>
        </div>
        <div style="cursor: default;" v-else>
          <h3>{{specialData.executingNum?specialData.executingNum:0}}<span class="unit">(条)</span></h3>
          <p>执行中的计划</p>
        </div>
        <div @click="go('recordSpecial.tab',true)" v-if="goTwo">
          <h3>{{specialData.totalPatrol?specialData.totalPatrol:0}}<span class="unit">(次)</span></h3>
          <p>累计巡查</p>
        </div>
        <div style="cursor: default;" v-else>
          <h3>{{specialData.totalPatrol?specialData.totalPatrol:0}}<span class="unit">(次)</span></h3>
          <p>累计巡查</p>
        </div>
        <div style="cursor: default;" class="relative">
          <h3>{{specialData.deadlineNum?specialData.deadlineNum:0}}<span class="unit">(条)</span></h3>
          <p>即将截止的专项计划</p>
          <el-tooltip class="item" effect="dark" content="距离专项计划截止时间在七天之内的为即将截止的专项计划" placement="top-end">
            <u class="wxts movePoin absolute">温馨提示</u>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as echartFun from "./echartsFun";
  import * as plan from 'api/common'
  import * as api from "api/cosmetics/patrolPlan"

  export default {
    beforeDestroy() {
      this.willDestroy = true;
    },
    mounted() {
      if (this.$store.getters.auths.indexOf('cosmetic.special.plan') >= 0) {
        this.goOne = true
      }
      if (this.$store.getters.auths.indexOf('cosmetic.patrol.record') >= 0) {
        this.goTwo = true
      }
      // 默认开始日期为本年1月1日，截止时间为当天
      const dates = new Date();
      let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
      if (mon <= 9) {                                     //如果小于9的话，则需要加上0
        mon = "0" + mon;
      }
      let day = dates.getDate();                   //getdate()返回的是1-31，则不需要加1
      if (day <= 9) {                                     //如果小于9的话，则需要加上0
        day = "0" + day;
      }
      this.dailyOverTime = dates.getFullYear() + "-" + mon + "-" + day;
      this.reportEndDate = dates.getFullYear() + "-" + mon + "-" + day;
      this.dailyBeginTime = dates.getFullYear() + "-01-01";
      this.reportStartDate = dates.getFullYear() + "-01-01";


      this.getSpecial();//专项巡查概况
      this.getDaily();//综合数据/巡查结果/处理方式
      this.dynamicFn();//巡查动态


      this.listDictUserItemByDictCode('COSM_RISK');//字典
      this.listDictUserItemByDictCode('COSM_QUANTIFY');//字典
    },
    methods: {
      exportExcel() {
        let params = {
          'startDate': this.reportStartDate ? this.reportStartDate : '',
          'endDate': this.reportEndDate ? this.reportEndDate : '',
          'entityType': this.ReportDailyEntityType ? this.ReportDailyEntityType : '',
          'sortType': this.rank ? this.rank : ''
        }
        api.excelStatisticalData(params).then(r => {
          if (r.status) {
            plan.downloadFile(r.data, '统计报表')
          }
        })
      },
      choose(index) {
        this.mess.chooseOne = index;
      },
      chooseTwo(index, key) {
        this.mess.chooseTwo = index;
        if (this.mess.chooseTwo == 1 && this.report.length <= 0) {
          this.getReportDaily();//统计报表
        }
        if (this.mess.chooseTwo == 2 && !this.total.legendData) {
          this.getTotalPatrol();//累计巡查
        }
        if (this.mess.chooseTwo == 3 && !this.coverage.legendData) {
          this.getEntityCoverageChart();//主体覆盖率相
        }
        if (this.mess.chooseTwo == 4 && !this.overdue.legendData) {
          this.getOverdueNotPatrolChart();//逾期未巡查数
        }
        if (this.mess.chooseTwo == 5 && !this.aboutOf.seriesData) {
          this.getToBeOverdueChart();//即将逾期数
        }
      },
      getSpecial() {
        api.getStatPlanStateSpecial().then((r) => {//专项巡查概况计划数量
          if (r.status) {
            this.specialData.executingNum = r.data.executing;
            this.specialData.finishedNum = r.data.completed;
            this.specialData.deadlineNum = r.data.byTimeCount;
            this.specialData.totalPatrol = r.data.specialCount;
          }
        });
      },
      getToBeOverdueChart() {
        this.loading = true
        api.getoverdues({'entityType': this.aboutOfEntityType}).then((data) => {
          if (!data.status) {
            return
          }
          let xData = [];
          let aboutOf = [];// 即将逾期数
          for (var i = 0; i < data.data.length; i++) {
            xData.push(data.data[i].areaName.replace('食品药品监督管理所', '').replace('食品药品监督管理局', ''));
            aboutOf.push(data.data[i].soonOverdue);
          }
          // 即将逾期数
          this.aboutOf.legendData = ['即将逾期数'];
          this.aboutOf.xData = xData;
          let obj = {};
          obj.data = aboutOf;
          obj.name = '即将逾期数';
          obj.type = 'bar';
          obj.barWidth = 50;
          this.aboutOf.seriesData = [];
          this.aboutOf.seriesData.push(obj);
          echartFun.oneBarEchart(this.aboutOf.legendData, this.aboutOf.xData, this.aboutOf.seriesData, "aboutOf");
          this.loading = false
        })
      },
      getOverdueNotPatrolChart() {
        this.loading = true
        api.getoverdues({'entityType': this.overdueEntityType}).then((data) => {
          if (!data.status) {
            return
          }
          let xData = [];
          let overdue = [];//逾期未巡查
          for (var i = 0; i < data.data.length; i++) {
            xData.push(data.data[i].areaName.replace('食品药品监督管理所', '').replace('食品药品监督管理局', ''));
            overdue.push(data.data[i].overdue);
          }

          // 逾期未巡查数
          this.overdue.legendData = ['逾期未巡查数'];
          this.overdue.xData = xData;
          let obj = {};
          obj.data = overdue;
          obj.name = '逾期未巡查数';
          obj.type = 'bar';
          obj.barWidth = 50;
          this.overdue.seriesData = [];
          this.overdue.seriesData.push(obj);
          echartFun.oneBarEchart(this.overdue.legendData, this.overdue.xData, this.overdue.seriesData, "overdue");
          this.loading = false
        })
      },
      getTotalPatrol() {
        this.loading = true
        api.getPatrolTotal({'entityType': this.totalPatrolEntityType}).then((data) => {
          let legendData = ['巡查次数', '符合', '基本符合', '不符合'];
          let seriesData = [];
          let xData = [];
          let xunchaNum = {
            name: '巡查次数',
            type: 'bar',
            barMaxWidth: 0.0001,
            data: []
          };
          let fuhe = {
            name: '符合',
            type: 'bar',
            stack: '状态',
            barMaxWidth: 40,
            data: []
          };
          let jiben = {
            name: '基本符合',
            type: 'bar',
            stack: '状态',
            data: []
          };
          let bufuhe = {
            name: '不符合',
            type: 'bar',
            stack: '状态',
            data: []
          };
          for (var i = 0; i < data.data.length; i++) {
            xData.push(data.data[i].areaName.replace('食品药品监督管理所', '').replace('食品药品监督管理局', ''));
            xunchaNum.data.push(data.data[i].qualified * 1 + data.data[i].disqualified * 1 + data.data[i].passed * 1); //巡查次数
            fuhe.data.push(data.data[i].qualified);
            bufuhe.data.push(data.data[i].disqualified);
            jiben.data.push(data.data[i].passed)
          }
          seriesData.push(xunchaNum);
          seriesData.push(fuhe);
          seriesData.push(jiben);
          seriesData.push(bufuhe);
          // 累计巡查
          this.total.legendData = legendData;
          this.total.xData = xData;
          this.total.seriesData = seriesData;
          echartFun.totalPatrol(this.total.legendData, this.total.xData, this.total.seriesData, "totalPatrol");
          this.loading = false
        })
      },
      getEntityCoverageChart() {
        this.loading = true
        let params = {
          'quantify': this.quanLevel,
          'risk': this.riskLevel,
          "entityType": this.EntityCoverageChartEntityType
        }
        api.getCoverage(params).then((data) => {
          let xData = [];
          let coverage = [];// 主体覆盖率
          for (var i = 0; i < data.data.length; i++) {
            xData.push(data.data[i].areaName.replace('食品药品监督管理所', '').replace('食品药品监督管理局', ''));
            coverage.push(data.data[i].coverage.replace('%', '') * 1);
          }

          // 主体覆盖率
          this.coverage.legendData = ['主体覆盖率'];
          this.coverage.xData = xData;
          let obj = {};
          obj.data = coverage;
          obj.name = '主体覆盖率';
          obj.type = 'bar';
          obj.barWidth = 50;
          this.coverage.seriesData = [];
          this.coverage.seriesData.push(obj);
          echartFun.oneBarEchart(this.coverage.legendData, this.coverage.xData, this.coverage.seriesData, "coverage");
          this.loading = false
        })
      },
      getDaily() {
        //综合数据
        let params = {
          'startDate': this.dailyBeginTime ? this.dailyBeginTime : '',
          'endDate': this.dailyOverTime ? this.dailyOverTime : '',
          'entityType': this.dailyEntityType ? this.dailyEntityType : '',
          'quantify': this.dailyQuanLevel ? this.dailyQuanLevel : '',
          'risk': this.dailyRiskLevel ? this.dailyRiskLevel : ''
        };
        api.getDaily(params).then((r) => {
          this.dailyData.totalPatrol = r.data.dailyCount;
          this.entityCoverage = r.data.coverage;
          this.inconformity = r.data.unQualified;
          this.dailyData.overdueNotPatrol = r.data.overdue;
          this.dailyData.toBeOverdue = r.data.soonOverdue;
        });
        api.getResult(params).then((r) => {
          // 巡查结果分布
          let obj = {
            passed: '基本符合',
            qualified: '符合',
            disqualified: '不符合'
          }
          let legendData = [];
          let seriesData = [];
          for (let key in r.data) {
            legendData.push(obj[key]);
            let seriesobj = {};
            seriesobj.value = r.data[key];
            seriesobj.name = obj[key];
            seriesData.push(seriesobj)
          }
          this.resultDistribution.legendData = legendData;
          this.resultDistribution.seriesData = seriesData;
          echartFun.distribution(this.resultDistribution, "0", "echartDaily");
        })
        api.getTreat(params).then((r) => {
          // 处理方式分布
          let obj = {
            normal: '正常',
            spotRectification: '现场整改',
            limitRectification: '限期整改',
            invesTreatment: '调查处理',
            outBusiness: '责令停业',
          }
          let legendData = [];
          let seriesData = [];
          for (let key in r.data) {
            legendData.push(obj[key]);
            let seriesobj = {};
            seriesobj.value = r.data[key];
            seriesobj.name = obj[key];
            seriesData.push(seriesobj)
          }
          this.typeDistribution.legendData = legendData;
          this.typeDistribution.seriesData = seriesData;
          echartFun.distribution(this.typeDistribution, "1", "echartDailyT");
        })
      },
      //动态巡查
      // (注释原因为 第一次需求为每10秒就翻一次页,每页5条数据, 每次重新传输页数,请求数据,后第二次更改为每10秒翻一次页, 每十分钟重新请求一次接口,一次提取30条数据)
      // dynamicFn() {
      //   if (!this.is_getDynamic) {
      //     this.loading = true;
      //   }
      //
      //   api.dynamicsRecord(5, this.listNum).then(res => {
      //     if (res.status && res.data && res.data.list) {
      //       this.is_getDynamic = true;
      //       this.loading = false;
      //       this.listNum++;
      //       this.dynamic = res.data.list;
      //       if ((res.data.total - this.listNum * 5) < 1 || this.listNum == 6) {
      //         this.listNum = 0;
      //       }
      //       setTimeout(() => {
      //         if (this.willDestroy) return;
      //         this.dynamicFn()
      //       }, 10000)
      //     } else {
      //       this.loading = false;
      //     }
      //
      //   })
      // },
      //动态巡查
      dynamicFn() {
        if(this.intervalId) {
          clearInterval(this.intervalId)
        }
        api.dynamicsRecord(30, 0).then(res => {
          if (res.data.length <= 0) {
            return false
          }
          // this.updateTable(this.tableData, res.data, 5, 10, () => {
          //   setTimeout(() => {
          //     if (this.willDestroy) return
          //     this.dynamicFn()
          //   }, 10000)
          // });
          this.updateTable(this.dynamic, res.data.list, 5, 10);
          this.intervalId = setInterval(() => {
            if (this.willDestroy) return
            this.dynamicFn()
          }, 600000)      // 每十分钟重新请求一次新的数据
        })
      },
      //更新表格 @updateObj 更细的数据对象，@dataSource 数据源 ，@limit 显示格式，@time 间隔时间
      updateTable(updateObj, dataSource = [], limit = 5, time = 5) {
        let dynamicNum = 0
        handle()
        let timeID = setInterval(handle, time * 1000)

        function handle() {
          try {
            updateObj.splice(0, updateObj.length);
            dynamicNum++;
            let newArr = dataSource.slice((dynamicNum - 1) * limit, dynamicNum * limit);
            if ((dataSource.length % 2 != 0) && (dynamicNum * limit >= dataSource.length)) {
              newArr = dataSource.slice((dynamicNum - 1) * limit, dataSource.length);
            }
            for (let i = 0; i < newArr.length; i++) {
              updateObj.push(newArr[i]);
            }
            if (dynamicNum * limit >= dataSource.length) {
              // clear()
              // callback()
              dynamicNum = 0 //数据滚完一遍之后重复滚动
            }
          } catch (error) {
            clearInterval(timeID)
            timeID = null;
          }
        }

        function clear() {
          clearInterval(timeID);
          timeID = null;
          dynamicNum = null;
          limit = null;
          updateObj = null;
          dataSource = null;
          time = null;
        }

      },


      getReportDaily() {
        this.loading = true
        //统计报表
        let params = {
          'startDate': this.reportStartDate ? this.reportStartDate : '',
          'endDate': this.reportEndDate ? this.reportEndDate : '',
          'entityType': this.ReportDailyEntityType ? this.ReportDailyEntityType : '',
          'sortType': this.rank ? this.rank : ''
        }
        api.getReportFormsDaily(params).then((r) => {
          this.report = r.data;
          this.loading = false
        })
      },
      go(name, index = '') {
        this.$router.push({
          name: name,
          query: {
            index: index,
            startTime: this.dailyBeginTime,
            endTime: this.dailyOverTime
          }
        })
      },
      listDictUserItemByDictCode(dictCode) {
        plan.listDictUserItemByDictCode(dictCode).then((data) => {
          if (dictCode == 'COSM_RISK') {
            this.riskLevelLis = data.data;
            this.riskLevelLis.unshift({code: '', name: "风险等级(全部)"})
          } else {
            this.quanLevelLis = data.data;
            this.quanLevelLis.unshift({code: '', name: "量化等级(全部)"})
          }
        })
      }
    },
    components: {},
    data() {
      return {
        loading: false,
        is_getDynamic: false,//判断是否已经请求过一次
        willDestroy: false,
        dailyBeginTime: null,
        dailyOverTime: null,
        reportStartDate: null,
        reportEndDate: null,
        mess: {
          chooseOne: 0,
          chooseTwo: 0
        },
        PlanStateList: [
          {
            name: "巡查结果分布"
          }, {
            name: "处理方式分布"
          }
        ],
        muchDatas: [
          {
            name: "巡查动态"
          }, {
            name: "统计报表"
          }, {
            name: "累计巡查次数"
          }, {
            name: "主体覆盖率"
          }, {
            name: "逾期未巡查数"
          }, {
            name: "即将逾期"
          }
        ],
        rank: '',
        rankLis: [
          {
            type: '累计巡查',
            key: "PATROL_TOTAL"
          }, {
            type: '主体覆盖率',
            key: "ENT_COVER"
          },
          // {
          // 	type: '计划完成度',
          // 	key: "DONE_PCT"
          // },
          {
            type: '逾期未巡查',
            key: "PATROL_TIMEOUT"
          }, {
            type: '即将逾期',
            key: "PATROL_SOONEND"
          }
        ],
        report: [],
        dynamic: [],
        specialData: {
          totalPatrol: 0
        },
        dailyData: {},
        inconformity: 0,
        resultDistribution: {},
        typeDistribution: {},
        total: {},
        coverage: {},
        overdue: {},
        aboutOf: {},
        quanLevel: '',
        riskLevel: '',
        quanLevelLis: null,
        riskLevelLis: null,
        dailyAfterDate: {
          disabledDate: (time) => {
            let dates = new Date();
            let y = dates.getFullYear() + 1;
            let year = new Date(y + "-01-01");
            let y_ = dates.getFullYear();
            let year_ = new Date(y_ + "-01-01");

            let startDate = new Date(this.dailyBeginTime);

            if (this.dailyBeginTime) {
              let b = (time.getTime() > year - 8.64e7) || (time.getTime() < year_ - 8.64e7) || (time.getTime() < startDate - 8.64e7)
              return b;
            } else {
              let b = (time.getTime() > year - 8.64e7) || (time.getTime() < year_ - 8.64e7);
              return b;
            }
          }
        },
        dailyStartDate: {
          disabledDate: (time) => {
            let dates = new Date();
            let y = dates.getFullYear();
            let year = new Date(y + "-01-01");
            let y_ = dates.getFullYear() + 1;
            let year_ = new Date(y_ + "-01-01");

            let endDate = new Date(this.dailyOverTime);

            if (this.dailyOverTime) {
              let b = (time.getTime() < year - 8.64e7) || (time.getTime() > year_ - 8.64e7) || (time.getTime() > endDate)
              return b;
            } else {
              let b = (time.getTime() < year - 8.64e7) || (time.getTime() > year_ - 8.64e7);
              return b;
            }
          }
        },
        afterDate: {
          disabledDate: (time) => {
            let dates = new Date();
            let y = dates.getFullYear() + 1;
            let year = new Date(y + "-01-01");
            let y_ = dates.getFullYear();
            let year_ = new Date(y_ + "-01-01");

            let startDate = new Date(this.reportStartDate);

            if (this.reportStartDate) {
              let b = (time.getTime() > year - 8.64e7) || (time.getTime() < year_ - 8.64e7) || (time.getTime() < startDate - 8.64e7)
              return b;
            } else {
              let b = (time.getTime() > year - 8.64e7) || (time.getTime() < year_ - 8.64e7);
              return b;
            }
          }
        },
        beforeDate: {
          disabledDate: (time) => {
            let dates = new Date();
            let y = dates.getFullYear();
            let year = new Date(y + "-01-01");
            let y_ = dates.getFullYear() + 1;
            let year_ = new Date(y_ + "-01-01");

            let endDate = new Date(this.reportEndDate);

            if (this.reportEndDate) {
              let b = (time.getTime() < year - 8.64e7) || (time.getTime() > year_ - 8.64e7) || (time.getTime() > endDate)
              return b;
            } else {
              let b = (time.getTime() < year - 8.64e7) || (time.getTime() > year_ - 8.64e7);
              return b;
            }
          }
        },
        listNum: 1,
        dailyQuanLevel: '',
        dailyRiskLevel: '',
        dailyEntityType: '',
        entityTypeList: [
          {
            code: 'COSMETIC_PRODUCT',
            name: '生产主体',
          }, {
            code: 'COSMETIC_MANAGER',
            name: '经营主体',
          },
          {
            code: 'COSMETIC_EMPLOY',
            name: '使用主体',
          }
        ],
        goOne: false,
        goTwo: false,
        entityCoverage: '',
        ReportDailyEntityType: '',
        totalPatrolEntityType: '',
        EntityCoverageChartEntityType: '',
        overdueEntityType: '',
        aboutOfEntityType: '',
        intervalId: null
      }
    }
  }
</script>

<style scoped lang="scss">
  .content {
    background-color: #edf0f3;
    padding: 20px;
    margin-top: 20px;
    margin-left: -20px;
    width: calc(100% + 20px);
    .timeBox {
      margin-bottom: 20px;
      span {
        font-size: 16px;
        color: #6D7787;
      }
    }
    .specialData {
      margin-bottom: 20px;
      margin-right: 20px;
      div {
        width: 23%;
        padding: 15px 0 20px;
      }
    }
    .dailyData {
      margin-bottom: 20px;
      overflow: hidden;
      .dataBox {
        width: 59%;
        background-color: #fff;
        padding: 20px;
        float: left;
        height: 317px;
        .topDataBox {
          justify-content: space-between;
          div {
            width: 31%;
            padding: 28px 0 32px;
          }
        }
        .bottomDataBox {
          padding: 0;
          justify-content: space-between;
          div {
            width: 48%;
            padding: 28px 0 32px;
          }
          div:first-child {
            border-left: 6px solid #FA503B;
          }
          div:last-child {
            border-left: 6px solid #FFCF69;
          }
        }
      }
      .echartBox {
        width: 35%;
        background-color: #fff;
        float: right;
        margin-right: 20px;
        position: relative;
        height: 357px;
        .echart {
          height: 305px;
          position: absolute;
          background-color: #fff;
          top: 52px;
          left: 0;
          bottom: 0;
          right: 0;
          opacity: 0;
          z-index: -1;
        }
        .echartIndex {
          opacity: 1 !important;
          z-index: 6;
        }
      }
    }
    .muchDataBox {
      margin: 20px 20px 0 0;
      background-color: #fff;
    }
  }

  .aloneDiv {
    padding: 20px 0;
    background-color: #fff;
    display: flex;
    justify-content: space-evenly;
    div {
      background-color: #edf0f3;
      text-align: center;
      border: 1px solid #edf0f3;
      cursor: pointer;
      h3 {
        font-size: 30px;
        color: #333333;
      }
      p {
        font-size: 14px;
        color: #A2AAB6;
      }
    }
    div:hover {
      border: 1px solid #0DB5EF;
      background-color: #fff;
    }
  }

  .sleq {
    margin: 0 5px 0 25px;
  }

  .slez {
    margin-left: 5px;
  }

  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
  }

  .tab-box .tab-bott {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 2px;
    background: #EBF1F5;
  }

  .tab-box li {
    width: 130px;
    height: 50px;
    line-height: 50px;
    font-size: 15px;
    color: #9A9A9A;
    text-align: center;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0DB5EF;
    position: relative;
    color: #393939;
  }

  .resultStrSpan {
    display: inline-block;
    padding: 0 5px;
    border-radius: 4px;
    font-size: 12px;
  }

  .okSpan {
    background: #ECF9F0;
    border: 1px solid #B9E7C7;
    color: #32C25E;
  }

  .noSpan {
    background: #FFF0EE;
    border: 1px solid #FFC0C0;
    color: #FA503B;
  }

  .echa {
    width: 100%;
    height: 300px;
  }

  .eBoxClass {
    padding: 20px;
    background-color: #fff;
    position: absolute;
    top: -170px;
    left: 0;
    z-index: -1;
    width: calc(100% - 40px);
    opacity: 0;
  }

  .zIndex99 {
    z-index: 99 !important;
    opacity: 1 !important;
    top: 0px !important;
  }

  .wxts {
    color: #e6a23c;
    right: 10px;
    top: 10px;
  }
</style>
