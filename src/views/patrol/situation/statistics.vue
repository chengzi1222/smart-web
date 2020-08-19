<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>巡查概况统计</span>
    </div>
    <div class="content">

      <div class="timeBox">
        <span>日常巡查概况</span>
        <el-date-picker @change="getDaily" value-format="yyyy-MM-dd" class="sleq padRightNo" type="date" :clearable="false"
                        v-model="dailyBeginTime"
                        placeholder="起始时间" :picker-options="dailyStartDate"></el-date-picker>
        至
        <el-date-picker @change="getDaily" value-format="yyyy-MM-dd" class="slez padRightNo" type="date" :clearable="false"
                        v-model="dailyOverTime"
                        placeholder="截止时间" :picker-options="dailyAfterDate"></el-date-picker>
      </div>
      <div class="dailyData">
        <div class="dataBox">
          <p>综合数据</p>
          <div class="topDataBox aloneDiv">
            <div @click="go('patrol.record.daily','','日常监管记录')">
              <h3>{{dailyData.totalPatrol?dailyData.totalPatrol:0}}<span class="unit">(次)</span></h3>
              <p>累计巡查</p>
            </div>
            <div style="cursor: default;">
              <h3><span>{{dailyData.entityCoverage?dailyData.entityCoverage:0}}</span>%</h3>
              <p>主体覆盖率</p>
            </div>
            <div style="cursor: default;">
              <h3><span>{{inconformity}}</span>%</h3>
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

      <div class="muchDataBox" id="muchDataBox">
        <ul class="tab-box">
          <li v-for="(item,index) in muchDatas" :key="index" :class="index==mess.chooseTwo?'li-bott':''"
              @click="chooseTwo(index,item.key)">
            <div :data-index='index'>{{item.name}}</div>
          </li>
          <li class="tab-bott"></li>
        </ul>


        <div style="padding: 20px;position: relative;min-height: 320px;">
          <!-- 巡查动态 -->
          <div class="clearfix" v-if="this.mess.chooseTwo == 0" v-loading="loading" element-loading-text="拼命加载中">
            <el-table :data="dynamic" style="width: 100%;margin-top:20px;font-size:12px;">
              <el-table-column align="center" label="序号" type="index" width="50">
              </el-table-column>
              <el-table-column align="center" label="巡查对象" prop="entityName">
              </el-table-column>
              <el-table-column align="center" label="巡查结果" width="100">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.resultStr == '符合'" size="mini" type="success">{{scope.row.resultStr}}
                  </el-tag>
                  <el-tag v-if="scope.row.resultStr == '不符合'" size="mini" type="danger">{{scope.row.resultStr}}
                  </el-tag>
                  <el-tag v-if="scope.row.resultStr == '基本符合'" size="mini" type="warning">{{scope.row.resultStr}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="所属食药所" prop="deptName" width="300"></el-table-column>
              <el-table-column align="center" prop="supervisor" label="监管员">
              </el-table-column>
              <el-table-column align="center" prop="patrolTime" label="时间">
              </el-table-column>
            </el-table>
          </div>
          <!-- 统计报表 -->
          <div class="user-box">
            <div v-if="this.mess.chooseTwo == 1" v-loading="loading" element-loading-text="拼命加载中">
              <div style="margin-bottom: 20px;">
                <el-date-picker value-format="yyyy-MM-dd" @change="getReportDaily" class="sleq padRightNo"
                                style="margin-left: 0;" type="date"
                                v-model="reportStartDate" placeholder="起始时间"
                                :picker-options="beforeDate"></el-date-picker>
                至
                <el-date-picker value-format="yyyy-MM-dd" @change="getReportDaily" v-model="reportEndDate"
                                class="slez padRightNo" type="date"
                                placeholder="截止时间" :picker-options="afterDate"></el-date-picker>
                <el-select class="w150" style="margin-left: 20px;" v-model="rank" @change="getReportDaily"
                           placeholder="排序方式">
                  <el-option v-for="item in rankLis" :key="item.key" :label="item.type" :value="item.key">
                  </el-option>
                </el-select>
                <el-button class="w65 floatR" @click="exportExcel" type="primary">导出</el-button>
              </div>
              <el-table :data="report" class="table-div" height="250">
                <el-table-column min-width="50" label="排名">
                  <template slot-scope="scope">
                    {{scope.$index + 1}}
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="deptName" min-width="100" label="单位名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="totalPatrol" min-width="100"
                                 label="累计巡查"></el-table-column>
                <el-table-column show-overflow-tooltip min-width="130" label="符合/基本符合/不符合">
                  <template slot-scope="scope">
                    {{scope.row.patrolResultList[0].number}}/{{scope.row.patrolResultList[1].number}}/{{scope.row.patrolResultList[2].number}}
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="legalPerson" min-width="200"
                                 label="正常/现场整改/限期整改/调查处理/责令停业">
                  <template slot-scope="scope">
                    {{scope.row.processingTypeList[0].number}}/{{scope.row.processingTypeList[1].number}}/{{scope.row.processingTypeList[2].number}}/{{scope.row.processingTypeList[3].number}}/{{scope.row.processingTypeList[4].number}}
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip min-width="80" label="主体覆盖率">
                  <template slot-scope="scope">
                    {{scope.row.entityCoverage}}&nbsp;%
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="overdueNotPatrolNum" min-width="80"
                                 label="逾期未巡查"></el-table-column>
                <el-table-column show-overflow-tooltip prop="toBeOverdueNum" min-width="80"
                                 label="即将逾期"></el-table-column>
              </el-table>
            </div>
          </div>

          <div class="eBoxClass" :class="this.mess.chooseTwo == 2?'zIndex99':''" v-loading="loading"
               element-loading-text="拼命加载中">
            <div class="echa" id="totalPatrol" style="height: 300px"></div>
          </div>

          <div class="eBoxClass" :class="this.mess.chooseTwo == 3?'zIndex99':''" v-loading="loading"
               element-loading-text="拼命加载中">
            <div>
              <span style="margin: 0 20px 0 10px;">量化等级</span>
              <el-select class="w150 mr10" @change="getEntityCoverageChart" v-model="quanLevel" placeholder="请选择">
                <el-option v-for="item in quanLevelLis" :key='item.code' :label="item.name" :value="item.code">
                </el-option>
              </el-select>
              <span style="margin: 0 20px 0 10px;">风险等级</span>
              <el-select class="w150 mr10" @change="getEntityCoverageChart" v-model="riskLevel" placeholder="请选择">
                <el-option v-for="item in riskLevelLis" :key='item.code' :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </div>
            <div class="echa" id="coverage" style="height: 300px"></div>
          </div>

          <div class="eBoxClass" :class="this.mess.chooseTwo == 4?'zIndex99':''" v-loading="loading"
               element-loading-text="拼命加载中">
            <div class="echa" id="overdue" style="height: 300px"></div>
          </div>

          <div class="eBoxClass" :class="this.mess.chooseTwo == 5?'zIndex99':''" v-loading="loading"
               element-loading-text="拼命加载中">
            <div class="echa" id="aboutOf" style="height: 300px"></div>
          </div>
        </div>
      </div>

      <!--专项巡查概况-->
      <div class="timeBox mt20">
        <span>专项巡查概况</span>
        <el-date-picker @change="getSpecial" value-format="yyyy-MM-dd" class="sleq padRightNo" type="date"
                        v-model="specialBeginTime"
                        placeholder="起始时间" :picker-options="specialStartDate"></el-date-picker>
        至
        <el-date-picker @change="getSpecial" value-format="yyyy-MM-dd" v-model="specialOverTime" class="slez padRightNo"
                        type="date"
                        placeholder="截止时间" :picker-options="specialAfterDate"></el-date-picker>
      </div>
      <div class="specialData aloneDiv">
        <div @click="go('specialList','已完成')">
          <h3>{{specialData.finishedNum?specialData.finishedNum:0}}<span class="unit">(条)</span></h3>
          <p>已完成的计划</p>
        </div>
        <div @click="go('specialList','执行中')">
          <h3>{{specialData.executingNum?specialData.executingNum:0}}<span class="unit">(条)</span></h3>
          <p>执行中的计划</p>
        </div>
        <div style="cursor: default;" class="relative">
          <h3>{{specialData.deadlineNum?specialData.deadlineNum:0}}<span class="unit">(条)</span></h3>
          <p>即将截止的专项计划</p>
          <el-tooltip class="item" effect="dark" content="距离专项计划截止时间在七天之内的为即将截止的专项计划" placement="top-end">
            <u class="wxts movePoin absolute">温馨提示</u>
          </el-tooltip>
        </div>
        <div @click="go('patrol.record.special','','专项检查记录')">
          <h3>{{specialData.totalPatrol?specialData.totalPatrol:0}}<span class="unit">(次)</span></h3>
          <p>累计巡查</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as getSituation from "api/patrol/situation";
  import * as echartFun from "./echartsFun";
  import * as plan from 'api/common'

  export default {
    beforeDestroy() {
      this.willDestroy = true;
    },
    mounted() {
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
      this.specialOverTime = dates.getFullYear() + "-" + mon + "-" + day;
      this.dailyOverTime = dates.getFullYear() + "-" + mon + "-" + day;
      this.reportEndDate = dates.getFullYear() + "-" + mon + "-" + day;
      this.specialBeginTime = dates.getFullYear() + "-01-01";
      this.dailyBeginTime = dates.getFullYear() + "-01-01";
      this.reportStartDate = dates.getFullYear() + "-01-01";


      this.getSpecial();//专项巡查概况
      this.getDaily();//综合数据
      // this.getPatrolResult();//巡查结果分布
      this.dynamicFn();//巡查动态

      this.listDictUserItemByDictCode('OTHER_RISK');//字典查询
      this.listDictUserItemByDictCode('OTHER_QUANTIFY');//字典查询

      if (this.$route.query.chooseTwo) {
        this.mess.chooseTwo = this.$route.query.chooseTwo;
        this.chooseTwo(this.$route.query.chooseTwo);
        let e = document.getElementsByClassName('app-container')[0]
        e.scrollTop = e.scrollHeight - 270;
      }
    },
    methods: {
      exportExcel() {
        getSituation.exportDailyExcel(this.reportStartDate, this.reportEndDate, this.rank);
      },
      choose(index) {
        this.mess.chooseOne = index;
        if (this.mess.chooseOne == 1 && !this.typeDistribution.legendData) {
          this.getProcessingType();//处理方式分布
        }
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
        let params = {'startDate': this.specialBeginTime, 'endDate': this.specialOverTime};
        getSituation.getSpecialData(params).then((data) => {
          this.specialData = data.data;
        })
      },
      getPatrolResult() {
        let params = {'startDate': this.dailyBeginTime, 'endDate': this.dailyOverTime};
        getSituation.getPatrolResult(params).then((data) => {
          this.inconformity = data.data[2].percent;
          // 巡查结果分布
          let legendData = [];
          let seriesData = [];
          for (var i = 0; i < data.data.length; i++) {
            let seriesobj = {};
            seriesobj.value = data.data[i].number;
            seriesobj.name = data.data[i].resultStr;
            legendData.push(data.data[i].resultStr);
            seriesData.push(seriesobj);
          }
          this.resultDistribution.legendData = legendData;
          this.resultDistribution.seriesData = seriesData;
          echartFun.distribution(this.resultDistribution, "0", "echartDaily");
        })
      },
      getProcessingType() {
        let params = {'startDate': this.specialBeginTime, 'endDate': this.specialOverTime};
        getSituation.getProcessingType(params).then((data) => {
          // 处理方式分布
          let legendData = [];
          let seriesData = [];
          for (var i = 0; i < data.data.length; i++) {
            let seriesobj = {};
            seriesobj.value = data.data[i].number;
            seriesobj.name = data.data[i].treatStr;

            legendData.push(data.data[i].treatStr);
            seriesData.push(seriesobj);
          }
          this.typeDistribution.legendData = legendData;
          this.typeDistribution.seriesData = seriesData;
          echartFun.distribution(this.typeDistribution, "1", "echartDailyT");
        })
      },
      getTotalPatrol() {
        this.loading = true
        let params = {'startDate': this.specialBeginTime, 'endDate': this.specialOverTime};
        getSituation.getTotalPatrol(params).then((data) => {
          let legendData = ['符合', '基本符合', '不符合'];
          let seriesData = [];
          let xData = [];
          let fuhe = {
            name: '符合',
            type: 'bar',
            data: []
          }
          let jiben = {
            name: '基本符合',
            type: 'bar',
            data: []
          }
          let bufuhe = {
            name: '不符合',
            type: 'bar',
            data: []
          }
          for (var i = 0; i < data.data.length; i++) {
            xData.push(data.data[i].deptName.replace('食品药品监督管理所', '').replace('食品药品监督管理局', ''));
            for (var o = 0; o < data.data[i].patrolResult.length; o++) {
              if (data.data[i].patrolResult[o].resultStr == '符合') {
                fuhe.data.push(data.data[i].patrolResult[o].number)
              } else if (data.data[i].patrolResult[o].resultStr == '不符合') {
                bufuhe.data.push(data.data[i].patrolResult[o].number)
              } else if (data.data[i].patrolResult[o].resultStr == '基本符合') {
                jiben.data.push(data.data[i].patrolResult[o].number)
              }
            }
          }
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
      getOverdueNotPatrolChart() {
        this.loading = true
        let params = {'startDate': this.specialBeginTime, 'endDate': this.specialOverTime};
        getSituation.getOverdueNotPatrolChart(params).then((data) => {
          let xData = [];
          let overdue = [];//逾期未巡查
          for (var i = 0; i < data.data.length; i++) {
            xData.push(data.data[i].deptName.replace('食品药品监督管理所', '').replace('食品药品监督管理局', ''));
            overdue.push(data.data[i].overdueNotPatrol);
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
      getEntityCoverageChart() {
        this.loading = true
        let params = {
          'startDate': this.specialBeginTime,
          'endDate': this.specialOverTime,
          'quanLevel': this.quanLevel,
          'riskLevel': this.riskLevel,
        };
        getSituation.getEntityCoverageChart(params).then((data) => {
          let xData = [];
          let coverage = [];// 主体覆盖率
          for (var i = 0; i < data.data.length; i++) {
            xData.push(data.data[i].deptName.replace('食品药品监督管理所', '').replace('食品药品监督管理局', ''));
            coverage.push(data.data[i].entityCoverage);
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
      getToBeOverdueChart() {
        this.loading = true
        let params = {'startDate': this.specialBeginTime, 'endDate': this.specialOverTime};
        getSituation.getToBeOverdueChart(params).then((data) => {
          let xData = [];
          let aboutOf = [];// 即将逾期数
          for (var i = 0; i < data.data.length; i++) {
            xData.push(data.data[i].deptName.replace('食品药品监督管理所', '').replace('食品药品监督管理局', ''));
            aboutOf.push(data.data[i].toBeOverdue);
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
      getDaily() {
        let params = {'startDate': this.dailyBeginTime, 'endDate': this.dailyOverTime};
        getSituation.getDailyData(params).then((data) => {
          this.dailyData = data.data;
        })
        this.getPatrolResult()
      },
      //动态巡查
      dynamicFn() {
        if (!this.is_getDynamic) {
          this.loading = true;
        }
        if(this.intervalId) {
          clearInterval(this.intervalId)
        }
        getSituation.getDynamic().then(res => {
          this.is_getDynamic = true;
          this.loading = false;
          // this.updateTable(this.dynamic, res.data, 5, 10, () => {
          //   setTimeout(() => {
          //     if (this.willDestroy) return
          //     this.dynamicFn()
          //   }, 10000)
          // });
          this.updateTable(this.dynamic, res.data, 5, 10);
          this.intervalId = setInterval(() => {
            if (this.willDestroy) {
              return
            }
            this.dynamicFn()
          }, 600000)      // 每十分钟重新请求一次新的数据
        })
      },
      //更新表格 @updateObj 更细的数据对象，@dataSource 数据源 ，@limit 显示格式，@time 间隔时间 @callback数据滚完一遍重新请求新的数据
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
              dynamicNum = 0     //数据滚完一遍之后重复滚动
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
        this.loading = true;
        getSituation.getReportDaily(this.reportStartDate, this.reportEndDate, this.rank).then((data) => {
          this.loading = false;
          this.report = data.data;
        })
      },
      go(name, stateTxt, pathName) {
        let stateT = stateTxt || '';
        this.$router.push({
          name: name,
          query: {
            stateTxt: stateT,
            pathName: pathName,
            startTime: this.dailyBeginTime,
            endTime: this.dailyOverTime,
          }
        })
      },
      listDictUserItemByDictCode(dictCode) {
        plan.listDictUserItemByDictCode(dictCode).then((data) => {
          if (dictCode == 'OTHER_RISK') {
            this.riskLevelLis = data.data;
            this.riskLevelLis.unshift({code: '', name: "全部"})
          } else {
            this.quanLevelLis = data.data;
            this.quanLevelLis.unshift({code: '', name: "全部"})
          }
        })
      }
    },
    components: {},
    data() {
      return {
        is_getDynamic: false,//判断是否已经请求过一次
        willDestroy: false,
        specialBeginTime: null,
        specialOverTime: null,
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
            key: "totalPatrol"
          }, {
            type: '主体覆盖率',
            key: "entityCoverage"
          }, {
            type: '逾期未巡查',
            key: "overdueNotPatrolNum"
          }, {
            type: '即将逾期',
            key: "toBeOverdueNum"
          }
        ],
        report: [],
        dynamic: [],
        specialData: {},
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
        loading: false,
        dailyAfterDate: {
          disabledDate: (time) => {
            let dates = new Date();
            let y = dates.getFullYear() + 1;
            let year = new Date(y + "-01-01");
            let y_ = dates.getFullYear() - 1;
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
            let y = dates.getFullYear() - 1;
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
        specialAfterDate: {
          disabledDate: (time) => {
            let startDate = new Date(this.specialBeginTime);
            if (this.specialBeginTime) {
              return time.getTime() < startDate - 8.64e7;
            }
          }
        },
        specialStartDate: {
          disabledDate: (time) => {
            let endDate = new Date(this.specialOverTime);
            if (this.specialOverTime) {
              return time.getTime() > endDate;
            }
          }
        },
        afterDate: {
          disabledDate: (time) => {
            let dates = new Date();
            let y = dates.getFullYear() + 1;
            let year = new Date(y + "-01-01");
            let y_ = dates.getFullYear() - 1;
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
            let y = dates.getFullYear() - 1;
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
    height: 340px;
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
