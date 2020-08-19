<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>专项巡查统计分析</span>
    </div>
    <h3 class="futitle">{{planName}}<span>{{deptName}}</span></h3>
    <ul class="tab-box">
      <li v-for="(item,index) in PlanStateList" :class="index==mess.choose?'li-bott':''" @click="choose(index)">
        <div :data-index='index'>{{item.name}}</div>
      </li>
      <li class="tab-bott"></li>
    </ul>
    <div class="content" v-if="mess.choose==0">
      <div class="specialData aloneDiv">
        <div :class="{'canHover':isRouter}" @click="go">
          <h3>{{specialData.totalPatrol?specialData.totalPatrol:0}}</h3>
          <p>累计巡查</p>
        </div>
        <div>
          <h3><span class="yuandian" :class="state=='已完成'?'wanc':state=='执行中'?'zhix':'daiq'"></span>{{state?state:0}}
          </h3>
          <p>计划状态</p>
        </div>
      </div>
      <div class="fenbuBox">
        <div class="echabBox">
          <p>巡查结果分布</p>
          <div class="echart" id="resultDistr"></div>
        </div>
        <div class="echabBox">
          <p>处理方式分布</p>
          <div class="echart" id="typeDistr"></div>
        </div>
      </div>
      <div style="padding: 20px;background-color: #fff;margin-top: 20px;margin-right: 20px;">
        <!-- 巡查动态 -->
        <div class="clearfix">
          <p class="title">巡查动态</p>
          <el-table
            :data="dynamic"
            style="width: 100%;margin-top:20px;font-size:12px;">
            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              align="center"
              label="巡查对象"
              prop="entityName"
            >
            </el-table-column>
            <el-table-column
              align="center"
              label="巡查结果"
              width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.resultStr == '符合'" size="mini" type="success">{{scope.row.resultStr}}</el-tag>
                <el-tag v-if="scope.row.resultStr == '不符合'" size="mini" type="danger">{{scope.row.resultStr}}</el-tag>
                <el-tag v-if="scope.row.resultStr == '基本符合'" size="mini" type="warning">{{scope.row.resultStr}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="所属食药所"
              prop="deptName"
              width="300"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="supervisor"
              label="监管员">
            </el-table-column>
            <el-table-column
              align="center"
              prop="patrolTime"
              label="时间">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div style="padding: 20px;background-color: #fff;margin-top: 20px;margin-right: 20px;">
        <p>累计巡查</p>
        <div class="echa" id="totalPatrol"></div>
      </div>
    </div>
    <div v-if="mess.choose==1">
      <div style="margin: 20px 0;overflow: hidden;">
        <el-button class="w65 floatR" @click="exportExcel" type="primary">导出</el-button>
      </div>
      <el-table :data="report" class="table-div">
        <el-table-column min-width="50" label="排名">
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" min-width="100" label="单位名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="totalPatrol" min-width="100" label="累计巡查"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="130" label="符合/基本符合/不符合">
          <template slot-scope="scope">
            {{scope.row.patrolResultList[0].number}}/{{scope.row.patrolResultList[1].number}}/{{scope.row.patrolResultList[2].number}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="legalPerson" min-width="200" label="正常/现场整改/限期整改/调查处理/责令停业">
          <template slot-scope="scope">
            {{scope.row.processingTypeList[0].number}}/{{scope.row.processingTypeList[1].number}}/{{scope.row.processingTypeList[2].number}}/{{scope.row.processingTypeList[3].number}}/{{scope.row.processingTypeList[4].number}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button style="width:100px;" @click="back">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import * as getSituation from "api/patrol/situation";
  import * as echartFun from "./echartsFun";
  import hasAuth from 'utils/checkAuth';

  export default {
    beforeDestroy() {
      this.willDestroy = true;
    },
    mounted() {
      this.planName = this.$route.query.planName;
      this.state = this.$route.query.state;
      this.getDatas();
      this.dynamicFn();
      this.getTotalPatrol();
      this.getPatrolResult();
      this.getProcessingType();
    },
    methods: {
      go() {
        if (!this.isRouter) {
          return;
        }
        this.$router.push({path: '/biz/patrol/record/special', query: {planId: this.$route.query.id}})
      },
      exportExcel() {
        getSituation.exportSpecialExcel(this.$route.query.id, this.rank);
      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      choose(index) {
        this.mess.choose = index;
        if (index == 1) {
          this.getReportSpecial()
        } else if (index == 0) {
          this.getDatas();
          this.dynamicFn();
          this.getTotalPatrol();
          this.getPatrolResult();
          this.getProcessingType();
        }
      },
      getTotalPatrol() {
        let params = {'patrolPlanId': this.$route.query.id};
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
          let coverage = [];// 主体覆盖率
          let overdue = [];//逾期未巡查
          let aboutOf = [];//即将逾期
          for (var i = 0; i < data.data.length; i++) {
            xData.push(data.data[i].deptName);
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
        })
      },
      getPatrolResult() {
        let params = {'patrolPlanId': this.$route.query.id};
        getSituation.getPatrolResult(params).then((data) => {
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
          echartFun.distribution(this.resultDistribution, "0", "resultDistr");
        })
      },
      getProcessingType() {
        let params = {'patrolPlanId': this.$route.query.id};
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
          echartFun.distribution(this.typeDistribution, "1", "typeDistr");
        })
      },
      getDatas() {
        let params = {'patrolPlanId': this.$route.query.id};
        getSituation.getSpecialData(params).then((data) => {
          this.specialData = data.data;
          this.deptName = data.data.deptName;
          if (hasAuth('food.patrol.record')) {
            this.isRouter = true
          }
        })
      },
      //动态巡查
      dynamicFn() {
        if(this.intervalId) {
          clearInterval(this.intervalId)
        }
        getSituation.getDynamic("?patrolPlanId=" + this.$route.query.id).then(res => {
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
              dynamicNum = 0     //数据滚完一遍之后重复滚动
            }
          } catch (error) {
            clearInterval(timeID)
            timeID = null;
            // callback()

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
      getReportSpecial() {
        getSituation.getReportSpecial(this.$route.query.id, this.reportStartDate, this.reportEndDate, this.rank).then((data) => {
          this.report = data.data;
        })
      }
    },
    components: {},
    data() {
      return {
        isRouter: false,
        willDestroy: false,
        mess: {
          choose: 0
        },
        PlanStateList: [
          {
            name: "统计图表"
          }, {
            name: "统计报表"
          }
        ],
        dynamic: [],
        specialData: {},
        resultDistribution: {},
        typeDistribution: {},
        state: null,
        planName: null,
        rank: '',
        rankLis: [
          {
            type: '累计巡查'
          }, {
            type: '主体覆盖率'
          }, {
            type: '计划完成度'
          }, {
            type: '逾期未巡查'
          }, {
            type: '即将逾期'
          }
        ],
        report: [],
        deptName: '',
        total: {},
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
    .specialData {
      margin-bottom: 20px;
      margin-right: 20px;
      div {
        width: 23%;
        padding: 15px 0 20px;
      }
    }
  }

  .aloneDiv {
    background-color: #fff;
    padding: 28px 0 36px;
    display: flex;
    justify-content: space-evenly;
    div {
      text-align: center;
      h3 {
        font-size: 36px;
        color: #333333;
        font-weight: 100;
      }
      p {
        font-size: 16px;
        color: #A2AAB6;
      }
    }
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

  .echart {
    height: 305px;
    width: 45%;
    margin: 0 auto;
  }

  .echa {
    width: 100%;
    height: 340px;
  }

  .fenbuBox {
    overflow: hidden;
    p {
      padding: 15px 0 0 20px;
      font-size: 15px;
      color: #393939;
      font-weight: 700;
    }
  }

  .echabBox:last-child {
    float: right;
    margin-right: 20px;
  }

  .echabBox {
    width: 48%;
    float: left;
    background-color: #fff;
  }

  .futitle {
    font-size: 20px;
    color: #393939;
    font-weight: 100;
    margin-top: 20px;
    span {
      font-size: 15px;
      color: #A2AAB6;
      margin-left: 20px;
    }
  }

  .yuandian {
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 50%;
    margin-right: 10px;
  }

  .wanc {
    background-color: #32C25E;
  }

  .zhix {
    background-color: #F1822A;
  }

  .daiq {
    background-color: #FA503B;
  }

  .canHover {
    cursor: pointer !important;
  }
</style>
