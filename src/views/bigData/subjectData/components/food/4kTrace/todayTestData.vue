<template>
  <div class="box">
    <h3>检测数据</h3>
    <ul class="dataBox">
      <li v-for="(item,index) in databox" @click="routerChange(item.type)" :key="item+index" class="movePoin">
        <p>{{item.name}}</p>
        <p class="pB">{{item.num}}</p>
      </li>
    </ul>
    <div id="echartsBox"></div>
  </div>
</template>

<script>
  import echarts from 'echarts';
  import { postSum, postDspage, postTrend } from "api/trace/supervise";
  export default {
    components: {

    },
    data() {
      return {
        databox: [
          { name: "今日检测批次", num: 0, type: 'all' },
          { name: "今日检测商家", num: 0, type: 'all' },
          { name: "今日不合格", num: 0, type: 'unPass' },
          { name: "今日合格率", num: "0%", type: 'pass' },
        ],
        echarts: {
          line_xAxisData: [],
          line_seriesData: [{
            name: '检测批次',
            type: 'line',
            data: []
          }, {
            name: '合格率(%)',
            type: 'line',
            yAxisIndex: 1,
            data: []
          }]
        },
        ifrShow: false,
        type: '',
      }
    },
    mounted() {
      this.postStatDatas();
      this.postTrendDatas();
    },
    methods: {
      line() {
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          color: ["#58aa66", "#e3bf42"],
          grid: {
            top: '10%',
            bottom: '10%',
          },
          xAxis: [
            {
              type: 'category',
              data: this.echarts.line_xAxisData,
              axisPointer: {
                type: 'shadow'
              },
              axisLine: {
                lineStyle: {
                  color: '#0DB5EF'
                }
              },
              axisLabel: {
                color: '#fff',
                fontSize: 20
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '批次数',
              nameTextStyle: {
                fontSize: 20,
                color: "#ddd",
              },
              axisLine: {
                lineStyle: {
                  color: '#0DB5EF'
                }
              },
              axisLabel: {
                color: '#fff',
                fontSize: 18
              },
              splitLine: {
                show: false
              }
            },
            {
              type: 'value',
              name: '合格率',
              nameTextStyle: {
                fontSize: 20,
                color: "#ddd",
              },
              min: 0,
              max: 100,
              interval: 20,
              axisLine: {
                lineStyle: {
                  color: '#0DB5EF'
                }
              },
              axisLabel: {
                fontSize: 18
              },
              splitLine: {
                show: false
              }
            }
          ],
          series: this.echarts.line_seriesData
        };
        var myChart;
        var container = document.getElementById("echartsBox");
        myChart = echarts.init(container);
        myChart.setOption(option);
        window.addEventListener('resize', function () {
          myChart.resize();
        }, false);
      },
      postTrendDatas() {
        var _this = this;
        postTrend().then(res => {
          if(!res.state){return}
          let resD = res.data;
          for(let i=0;i< resD.length;i++){
            _this.echarts.line_xAxisData.push(resD[i].date)
            _this.echarts.line_seriesData[0].data.push(resD[i].checktimes)
            _this.echarts.line_seriesData[1].data.push(100-((resD[i].checktimes- resD[i].passtimes)/ resD[i].checktimes * 100).toFixed(1))
          }
          _this.line()
        });
      },
      postStatDatas() {
        let dates = new Date();
        let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        let day = dates.getDate();                   //getdate()返回的是1-31，则不需要加1
        if (day <= 9) {                                     //如果小于9的话，则需要加上0
          day = "0" + day;
        }
        let transferData = dates.getFullYear() + "-" + mon + "-" + day;
        let form = new FormData();
        form.append('areaId', '5101');
        form.append('date', transferData);
        form.append('isSeller', 'TRUE');
        postSum(form).then(r => {
          if(!r.state || r.data.allNum==0){return}
          this.databox[0].num = r.data.allNum;
          this.databox[2].num = r.data.unPass;
          this.databox[3].num = ((r.data.allNum - r.data.unPass) / r.data.allNum *100).toFixed(2) + '%';
          this.$emit('SumUnPassNum', r.data.unPass)
        })
        let formt = new FormData();
        formt.append('areaId', '5101');
        formt.append('date', transferData);
        formt.append('pageNumber', 1);
        formt.append('pageSize', 1);
        formt.append('type', 'all');
        formt.append('isSeller', 'TRUE');
        postDspage(formt).then(r => {
          this.databox[1].num = r.pageObj.totalRecords;
        })
      },
      routerChange(type) {
        this.$emit('routerChange', `/yb/gathermain/gather?source=4k&type=${type}`)
      }
    }
  }
</script>
<style lang='scss' scoped>
  .box {
    background: url('~assets/img/subjectData/4kTrace/allLiB.png');
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100%;
    h3 {
      font-weight: normal;
      color: #eee;
      font-size: 40px;
      padding-top: 20px;
      margin-left: calc(17%);
      margin-bottom: 76px;
    }

    .dataBox {
      width: calc(100% - 80px);
      height: 180px;
      display: flex;
      justify-content: space-between;
      padding: 0 40px;
      margin-bottom: 12px;

      >li {
        width: 180px;
        height: 100%;
        background: url('~assets/img/subjectData/4kTrace/titbtnBg.png');
        text-align: center;

        p {
          color: #ffffff;
          font-size: 24px;
          margin-top: 40px;
        }

        .pB {
          margin-top: 20px;
          font-size: 40px;
          color: #74FAFD;
        }
      }
      li:hover{
        background: url('~assets/img/subjectData/4kTrace/titbtnBgHover.png');
      }
    }

    #echartsBox {
      width: 100%;
      height: 600px;
    }
  }
</style>