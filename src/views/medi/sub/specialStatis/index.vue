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
          <h3>{{specialData.total?specialData.total:0}}</h3>
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
          <el-table :data="dynamic" style="width: 100%;margin-top:20px;font-size:12px;">
            <el-table-column align="center" label="序号" type="index" width="50">
            </el-table-column>
            <el-table-column align="center" label="巡查对象" prop="entity_name">
            </el-table-column>
            <el-table-column align="center" label="巡查结果" width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.result_name == '符合'" size="mini" type="success">{{scope.row.result_name}}
                </el-tag>
                <el-tag v-if="scope.row.result_name == '不符合'" size="mini" type="danger">{{scope.row.result_name}}
                </el-tag>
                <el-tag v-if="scope.row.result_name == '基本符合'" size="mini" type="warning">{{scope.row.result_name}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="所属食药所" prop="dept_name" width="300"></el-table-column>
            <el-table-column align="center" prop="so_name" label="监管员">
            </el-table-column>
            <el-table-column align="center" prop="patrol_time" label="时间">
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
        <a :href="derive" class="w100 floatR godown mt20" target="_blank" download="filename">导出</a>
      </div>
      <el-table :data="report" class="table-div">
        <el-table-column min-width="50" label="排名">
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="dept_name" min-width="100" label="单位名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="subtotal" min-width="100" label="累计巡查"></el-table-column>
        <el-table-column show-overflow-tooltip prop="resultStr" min-width="130" label="符合/基本符合/不符合">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="treatStr" min-width="200" label="正常/现场整改/限期整改/调查处理/责令停业">
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
  import * as api from 'api/medi/mediSub/mediIndex';
  import * as echartFun from "./echartsFun";
  import hasAuth from 'utils/checkAuth';

  export default {
    beforeDestroy() {//解决定时器内存泄露
      this.willDestroy = true;
    },
    mounted() {
      this.planName = this.$route.query.planName;
      this.state = this.$route.query.state;
      this.row = this.$route.query.row;
      this.deptName = this.$route.query.row.deptName;
      this.getDatas();//累计巡查
      this.dynamicFn();//动态巡查
      this.getTotalPatrol();//累计巡查图表
      this.getPatrolResult();//巡查结果分布
      this.getProcessingType();//// 处理方式分布
      this.load();//加载相关名字
    },
    methods: {
      go() {
        if (!this.isRouter) {
          return;
        }
        this.$router.push({path: '/medipatrol/record/special/list', query: {planId: this.$route.query.id}})
      },
      load() {
        api.getLoadPlan({planId: this.$route.query.id}).then(r => {
          if (r.status) {
            this.planName = r.data.planName;
            this.deptName = r.data.deptName;
          }
        });
      },
      exportExcel() {//导出
        this.derive = 'http://' + window.location.host + '/api/medi/stat/patrol/export/special/' + this.$route.query.id + '/report.xls';
      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      choose(index) {
        this.mess.choose = index;
        if (index == 1) {
          this.getReportSpecial()//报表
          this.exportExcel();
        } else if (index == 0) {
          this.getDatas();
          this.dynamicFn();
          this.getTotalPatrol();
          this.getPatrolResult();
          this.getProcessingType();
          this.load();
        }
      },
      getTotalPatrol() {
        const obj = new FormData();
        obj.append('planId', this.$route.query.id);
        api.getSpecialData(obj).then((r) => {
          let d = r.data.resList;
          let name = [];
          let result = [];
          let jb_result = [];
          let fail = [];
          for (let item in d) {
            if (
              Object.prototype.toString
                .call(d[item])
                .slice(8, -1)
                .toLowerCase() === "function"
            ) {
              continue;
            }
            name.push(d[item].dept_name);
            result.push(d[item].results.QUALIFIED);
            jb_result.push(d[item].results.PASSED);
            fail.push(d[item].results.DISQUALIFIED);
          }
          let data = {
            nameArray: name,
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
          echartFun.overlap_bar(data, "totalPatrol");

        })
      },
      getPatrolResult() {
        const obj = new FormData();
        obj.append('planId', this.$route.query.id);
        api.getPatrolResult(obj).then((data) => {
          // 巡查结果分布
          let legendData = ['基本符合', '符合', '不符合'];
          let seriesData = [
            {
              value: data.data[1].cnt,
              name: '基本符合'
            },
            {
              value: data.data[0].cnt,
              name: '符合'
            },
            {
              value: data.data[2].cnt,
              name: '不符合'
            }
          ];
          this.resultDistribution.legendData = legendData;
          this.resultDistribution.seriesData = seriesData;
          echartFun.distribution(this.resultDistribution, "0", "resultDistr");
        })
      },
      getProcessingType() {
        const obj = new FormData();
        obj.append('planId', this.$route.query.id);
        api.getProcessingType(obj).then((data) => {
          // 处理方式分布
          let legendData = ['正常', '现场整改', '限期整改', '调查处理', '责令停业'];
          let seriesData = [
            {
              value: data.data[0].cnt,
              name: '正常',
            },
            {
              value: data.data[1].cnt,
              name: '现场整改',
            },
            {
              value: data.data[2].cnt,
              name: '限期整改',
            },
            {
              value: data.data[3].cnt,
              name: '调查处理',
            },
            {
              value: data.data[4].cnt,
              name: '责令停业',
            }
          ];
          this.typeDistribution.legendData = legendData;
          this.typeDistribution.seriesData = seriesData;
          echartFun.distribution(this.typeDistribution, "1", "typeDistr");
        });
      },
      getDatas() {//累计巡查
        const params = new FormData();
        params.append('planId', this.$route.query.id);
        //   console.log(params.get('planId'),this.$route.query.id);
        api.getSpecialData(params).then((data) => {
          this.specialData = data.data;
          if (hasAuth('medi.patrol.record')) {
            this.isRouter = true
          }
        })

      },
      //动态巡查
      dynamicFn() {
        const params = new FormData();
        params.append('planId', this.$route.query.id);
        params.append('pageSize', 30);
        params.append('pageNum', 1);
        if(this.intervalId) {
          clearInterval(this.intervalId)
        }
        api.getDynamic(params).then(res => {
          // this.updateTable(this.dynamic, res.data.list, 5, 10, () => {
          //     setTimeout(() => {
          //         if (this.willDestroy) return
          //         this.dynamicFn()
          //     }, 10000)
          // });
          this.updateTable(this.dynamic, res.data.list, 5, 10);
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
        let obj = new FormData();
        obj.append('planId', this.$route.query.id);
        api.getReportSpecial(obj).then((data) => {
          this.report = data.data;
        })
      }
    },
    components: {},
    data() {
      return {
        derive: '',
        isRouter: false,
        row: null,
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
