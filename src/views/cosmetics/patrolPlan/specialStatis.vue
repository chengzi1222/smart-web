<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>专项巡查统计分析</span>
    </div>
    <h3 class="futitle">{{planName}}<span>{{specialData.deptName}}</span></h3>
    <ul class="tab-box">
      <li v-for="(item,index) in PlanStateList" :class="index==mess.choose?'li-bott':''" @click="choose(index)">
        <div :data-index='index'>{{item.name}}</div>
      </li>
      <li class="tab-bott"></li>
    </ul>
    <div class="content" v-if="mess.choose==0">
      <div class="specialData aloneDiv">
        <div :class="{'canHover':isRouter}" @click="go">
          <h3>{{specialData.recordCount?specialData.recordCount:0}}</h3>
          <p>累计巡查</p>
        </div>
        <div>
          <h3><span class="yuandian" :class="specialData.stateStr=='已完成'?'wanc':state=='执行中'?'zhix':'daiq'"></span>{{state?state:0}}
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
          <el-table :data="dynamic" style="width: 100%;margin-top:20px;font-size:12px;">
            <el-table-column align="center" label="序号" type="index" width="50">
            </el-table-column>
            <el-table-column align="center" label="巡查对象" prop="entityName">
            </el-table-column>
            <el-table-column align="center" label="巡查结果" width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.resultStr == '符合'" size="mini" type="success">{{scope.row.resultStr}}</el-tag>
                <el-tag v-if="scope.row.resultStr == '不符合'" size="mini" type="danger">{{scope.row.resultStr}}</el-tag>
                <el-tag v-if="scope.row.resultStr == '基本符合'" size="mini" type="warning">{{scope.row.resultStr}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="所属食药所" prop="deptName" width="300"></el-table-column>
            <el-table-column align="center" prop="check" label="监管员">
            </el-table-column>
            <el-table-column align="center" prop="patrolTime" label="时间">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div style="padding: 20px;background-color: #fff;margin-top: 20px;margin-right: 20px;margin-bottom:50px;">
        <p>累计巡查</p>
        <div class="echa" id="totalPatrol"></div>
      </div>
    </div>
    <div v-if="mess.choose==1" style="margin-bottom:120px;">
      <div style="margin: 20px 0;overflow: hidden;">
        <el-button @click="exportExcel" style="margin-top:20px;" class="floatR w100" type="primary">导出</el-button>
      </div>
      <el-table :data="report" class="table-div">
        <el-table-column min-width="50" label="排名">
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="areaName" min-width="100" label="单位名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="recordCount" min-width="100" label="累计巡查"></el-table-column>
        <el-table-column show-overflow-tooltip prop="result" min-width="130" label="符合/基本符合/不符合">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="treat" min-width="200" label="正常/现场整改/限期整改/调查处理/责令停业">
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
  import * as api from "api/cosmetics/patrolPlan";
  import * as echartFun from "../../medi/sub/specialStatis/echartsFun";
  import hasAuth from 'utils/checkAuth';
  import {downloadFile} from 'api/common'


  export default {
    beforeDestroy() {//解决定时器内存泄露
      this.willDestroy = true;
    },
    mounted() {
      this.planName = this.$route.query.planName;
      this.state = this.$route.query.state;
      this.getDatas();//累计巡查
      this.dynamicFn();//动态巡查
      this.getTotalPatrol();//累计巡查图表
      this.getPatrolResult();//巡查结果分布
      this.getProcessingType();//// 处理方式分布
    },
    methods: {
      go() {
        if (!this.isRouter) {
          return;
        }
        this.$router.push({path: '/cosmetics/recordSpecial/index/tab', query: {planName: this.$route.query.id}})
      },
      exportExcel() {
        api.exportExcel(this.$route.query.id).then(r => {
          if (r.status) {
            downloadFile(r.data, '专项巡查计划统计报表')
          }
        })
      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      choose(index) {
        this.mess.choose = index;
        if (index == 1) {
          this.getReportSpecial()//报表
          this.willDestroy = true;
        } else if (index == 0) {
          this.willDestroy = false;
          this.getDatas();
          this.dynamicFn();
          this.getTotalPatrol();
          this.getPatrolResult();
          this.getProcessingType();
          this.load();
        }
      },
      getTotalPatrol() {
        api.getTotalPatrol(this.$route.query.id).then((r) => {
          if (!r.status) {
            return
          }
          let d = r.data;
          let name = [];
          let result = [];
          let jb_result = [];
          let fail = [];
          let total = [];
          for (let item in d) {
            if (
              Object.prototype.toString
                .call(d[item])
                .slice(8, -1)
                .toLowerCase() === "function"
            ) {
              continue;
            }
            name.push(d[item].areaName);
            result.push(d[item].qualified);
            jb_result.push(d[item].passed);
            fail.push(d[item].disqualified);
            total.push(d[item].qualified * 1 + d[item].passed * 1 + d[item].disqualified * 1)
          }
          let data = {
            nameArray: name,
            totaldata: {
              name: '巡查次数',
              data: total
            },
            resultdata: {
              name: '符合',
              data: result
            },
            jb_resultdata: {
              name: '基本符合',
              data: jb_result
            },
            faildata: {
              name: '不符合',
              data: fail
            },
          }
          echartFun.overlap_bar(data, "totalPatrol", 'istotal');

        })
      },
      getPatrolResult() {
        api.getPatrolResult(this.$route.query.id).then((data) => {
          if (!data.status) {
            return
          }
          ;
          // 巡查结果分布
          let legendData = ['基本符合', '符合', '不符合'];
          let seriesData = [
            {
              value: data.data.passed,
              name: '基本符合'
            },
            {
              value: data.data.qualified,
              name: '符合'
            },
            {
              value: data.data.disqualified,
              name: '不符合'
            }
          ];
          this.resultDistribution.legendData = legendData;
          this.resultDistribution.seriesData = seriesData;
          echartFun.distribution(this.resultDistribution, "0", "resultDistr");
        })
      },
      getProcessingType() {
        api.getProcessingType(this.$route.query.id).then((data) => {
          if (!data.status) {
            return
          }
          ;
          // 处理方式分布
          let legendData = ['正常', '现场整改', '限期整改', '调查处理', '责令停业'];
          let seriesData = [
            {
              value: data.data.normal,
              name: '正常',
            },
            {
              value: data.data.spotRectification,
              name: '现场整改',
            },
            {
              value: data.data.limitRectification,
              name: '限期整改',
            },
            {
              value: data.data.invesTreatment,
              name: '调查处理',
            },
            {
              value: data.data.outBusiness,
              name: '责令停业',
            }
          ];
          this.typeDistribution.legendData = legendData;
          this.typeDistribution.seriesData = seriesData;
          echartFun.distribution(this.typeDistribution, "1", "typeDistr");
        });
      },
      getDatas() {//累计巡查
        api.getSpecialData(this.$route.query.id).then((data) => {
          if (!data.status) {
            return
          }
          ;
          this.specialData = data.data;
          if (hasAuth('cosmetic.patrol.record')) {
            this.isRouter = true
          }
        })

      },
      //动态巡查
      dynamicFn() {
        if(this.intervalId) {
          clearInterval(this.intervalId)
        }
        api.getDynamic(this.$route.query.id).then(res => {
          if (!res.status) {
            return
          }
          // this.updateTable(this.dynamic, res.data, 5, 10, () => {
          //     setTimeout(() => {
          //         if (this.willDestroy) return
          //         this.dynamicFn()
          //     }, 10000)
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
        api.getReportSpecial(this.$route.query.id).then((data) => {
          this.report = data.data;
        })
      },
    },
    components: {},
    data() {
      return {
        derive: '',
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
