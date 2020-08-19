<template>
  <div class="charts-box">
    <div class="body">
      <!-- 预警时长 -->
      <div class="warnTime" ref="warnTime">
        <p class="text" v-if="info.state === '已完成'">预警任务耗时</p>
        <p class="text" v-if="info.state === '执行中'">预警已发布时长</p>
        <p class="time">{{ showTime }}</p>
      </div>
      <div class="position">
        <i class="el-icon-location" style="cursor:pointer;"></i>
        <span>{{ center }}</span> <!-- 获取当前城市 -->
      </div>
      <div class="total">
        <p class="num-box">
          <!-- 总数 -->
          <span class="num">{{ info.entityCount }}{{unit}}</span>
          家
        </p>
        <p class="charts-title">
          <span>企业总数</span>
        </p>
      </div>
      <div class="charts" id="charts">

      </div>
      <div class="textNumber">
        <p>共{{ info.entityCount }}家企业纳入本次预警</p>
      </div>

    </div>
  </div>
</template>

<script>
  import echarts from "echarts";
  import * as warningTask from "api/warning/warning";

  export default {
    props: {
      taskId: String
    },
    data() {
      return {
        chart: null,
        total: 4485,
        color: ['#6477FF', '#0DB5EF', '#FFFFFF', '#B45B3E'],
        info: {
          entityCount: 0,
          tobeExecuteCount: 0,
          unRevicedCount: 0,
          executedCount: 0,
          dispList: [],
          startTime: '',
          finishTime: '',
          state: '',
        },
        units: ["千", "万"],
        unit: "",
        timer: [],//定时器
        showTime: "",
        list: [
          { "value": 61, "name": "已处理" }, { "value": 10, "name": "待处理" }, { "value": 26, "name": "未读" }
        ]
      };
    },
    mounted() {
      this.init()
      const chart = this.chart = echarts.init(document.getElementById("charts"));
      window.addEventListener('resize', () => {
        chart.resize();
      }, false);

    },
    beforeDestroy() {
      this.timer.forEach(item => {
        clearInterval(item);
        item = null;
      });
    },
    methods: {

      showChart(option) {
        this.chart.clear();
        this.chart.setOption(option);
      },
      getOption(type) {
        return {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} 家({d}%)"
          },
          color: ['#6477FF', '#0DB5EF', '#FFFFFF', '#B45B3E'],
          series: [{
            type: "pie",
            radius: ['70%', '75%'],
            center: ["50%", "50%"],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 1)"
              }
            }
          }]
        };
      },
      chartPie() {//请求接口处
        const option = this.getOption();
        //添加颜色
        option.color = this.color
        const series = option.series[0];
        series.data = this.list;
        series.name = "预警情况";
        this.showChart(option);
      },
      setTotal(num) {
        if (num > 10000) {
          num = (num / 10000).toFixed(2);
          this.unit = this.units[1];
        }
        else {
          this.unit = "";
        }
        return num;
      },
      init() {
        warningTask.taskRecordInfo(this.taskId).then(r => {
          console.log(r)
          this.info = r.data
          this.info.entityCount = this.setTotal(this.info.entityCount);
          this.list = [];
          this.color = [];
          if (r.data.unRevicedCount !== 0) {
            this.list.push({ "value": r.data.unRevicedCount, "name": "未读" })
            this.color.push('#6477FF')
          }
          if (r.data.tobeExecuteCount !== 0) {
            this.list.push({ "value": r.data.tobeExecuteCount, "name": "待处理" })
            this.color.push('#FFFFFF')
          }
          if (r.data.executedCount !== 0) {
            this.list.push({ "value": r.data.executedCount, "name": "已处理" })
            this.color.push('#0DB5EF')
          }
          this.chartPie();
          if (this.info.state === '已完成') {
            this.timeInit()
          } else {
            this.timeinc()
          }
        })
      },
      timeinc() {
        this.$nextTick(() => {
          if (this._isDestroyed) return;
          var t = setInterval(() => {
            this.timeInit();
            var style = this.$refs.warnTime.style;
            style.right = -(this.$refs.warnTime.offsetWidth + 20) + "px";
          }, 1000);
          this.timer.push(t);
        });
      },

      timeInit() {
        let time;
        if (this.info.state === '已完成') {
          time = parseFloat(this.info.finishTime - this.info.startTime) / 1000;
        } else {
          time = parseFloat(new Date().getTime() - this.info.startTime) / 1000;
        }
        if (null != time && "" != time) {
          if (time > 60 && time < 60 * 60) {
            var f = () => {
              var num = parseInt(time / 60.0);
              if (num < 10) {
                return "0" + num;
              } else {
                return num;
              }
            };
            var m = () => {
              var num = parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60);
              if (num < 10) {
                return "0" + num;
              } else {
                return num;
              }
            };
            time = "00:" + f() + ":" + m() + "";
          } else if (time >= 60 * 60) {
            var s = () => {
              var num = parseInt(time / 3600.0);
              if (num < 10) {
                return "0" + num;
              } else {
                if (num > 24) {
                  var n = num % 24;
                  var t = (num - n) / 24;
                  if (n < 10) {
                    return t + "天 0" + n
                  } else {
                    return t + "天 " + n
                  }
                } else {
                  return num;
                }
              }
            };
            var f = () => {
              var num = parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60);
              if (num < 10) {
                return "0" + num;
              } else {
                return num;
              }
            };
            var m = () => {
              var num = parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60);
              if (num < 10) {
                return "0" + num;
              } else {
                return num;
              }
            };
            time = s() + ":" + f() + ":" + m();
          } else {
            if (time < 10) {
              time = "00:00:0" + parseInt(time);
            } else {
              time = "00:00:" + parseInt(time);
            }
          }
        }
        this.showTime = time
      },
    },
    computed: {
      center() {
        return this.$store.getters.mapCenter.center;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .charts-box {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 20px;
    top: 20px;
    width: 25%;
    height: 40%;
    min-width: 340px;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 3;
    .body {
      flex: 1;
      box-sizing: border-box;
      padding-top: 30px;
      .position {
        cursor: pointer;
        color: #fff;
        font-size: 16px;
        text-align: right;
        position: absolute;
        right: 15px;
        top: 20px;
        >span {
          margin-left: 10px;
        }
      }
      .charts {
        height: 92%;
        width: 100%;
      }
      .textNumber {
        color: #a2aab6;
        width: 100%;
        font-size: 12px;
        text-align: center;
        position: absolute;
        bottom: 10px;
        left: 0px;
      }
      .total {
        position: absolute;
        text-align: center;
        width: 100%;
        // left: calc(50% - 40px);
        top: calc(50% - 20px);
        font-size: 14px;
        .num-box {
          color: #a2aab6;
          margin: 3% auto 0;
          .num {
            font-size: 32px;
            color: #fff;
          }
        }
        .charts-title {
          color: #fff;
        }
      }
    }
    .foot {
      text-align: center;
      color: #fff;
      background: #6d6f73;
    }
  }

  .warnTime {
    min-width: 136px;
    height: 80px;
    padding: 0 10px;
    position: absolute;
    right: -206px;
    top: 0px;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 3;
    text-align: center;
    .text {
      color: #A2AAB6;
      font-size: 14px;
      margin: 11px 0 8px 0;
    }
    .time {
      font-size: 24px;
      color: #fff;
    }
  }
</style>