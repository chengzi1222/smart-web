<template>
  <div class="box">
    <h3>溯源考核分析</h3>
    <ul class="dataBox">
      <li v-for="(item,index) in databox" class="movePoin" @click="routerChange(item)" :key='titKey+index'>
        <p>{{item.name}}</p>
        <p class="pB">{{assessData[item.type]?assessData[item.type]:0}}</p>
      </li>
    </ul>
    <div id="echartsAssessBox"></div>
  </div>
</template>

<script>
  import echarts from 'echarts';
  import { postRank } from "api/trace/supervise"

  export default {
    props: {
      assessData: {
        default: function() {
          return {}
        }
      },
      assessDataNum: {
        default: function() {
          return 0
        }
      }
    },
    watch: {
      assessDataNum: function() {
          this.titKey = 'assessDataOk'+this.assessDataNum;
      }
    },
    data() {
      return {
        titKey: '1',
        databox: [
          { name: "综合使用率", num: "0%", type: 'AllNum' },
          { name: "公立学校使用率", num: "0%", type: 'PUBLIC' },
          { name: "私立学校使用率", num: "0%", type: 'PRIVATE' },
          { name: "溯源异常学校", num: 0, type: 'schoolNum' },
        ],
      }
    },
    mounted() {
      let dates = new Date();
      let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
      if (mon <= 9) {                                     //如果小于9的话，则需要加上0
        mon = "0" + mon;
      }
      let transferData = dates.getFullYear() + "-" + mon;
      let form = new FormData();
      form.append('areaId', '5101');
      form.append('date', transferData);
      postRank(form).then(r => {
        let sData=[];
        let xData=[];
        for(let i=0; i<r.data.length&&i<10; i++){
          xData.push(r.data[i].areaName);
          sData.push(r.data[i].rate);
        }
        this.pieFun(xData, sData);
      })
    },
    methods: {
      routerChange(item){
        // this.$emit('routerChange','analyze',{type:item.type});
        this.$emit('routerChange', `/yb/analyzemain/analyze?source=4k&type=${item.type}`);
      },
      pieFun(xData,sData) {
        var option = {
          grid: {
            left: 40,
            right: 40,
            bottom: 10,
            top: 60,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: xData,
            axisLine: {
              lineStyle: {
                color: '#74FAFD'

              }
            },
            axisLabel: {
              color: '#ddd',
              fontSize: 16,
              rotate: 40,
              margin: 20
            }
          },
          yAxis: {
            type: 'value',
            max: '100',
            name: '使用率(%)',
            nameTextStyle: {
              fontSize: 18,
              color: "#ddd",
              verticalAlign: 'top',
              lineHeight: 50
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#74FAFD'
              }
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              color: '#ddd',
              fontSize: 20
            }
          },
          series: [{
            name: '1',
            type: 'bar',
            barWidth: 30,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#74fafd'
                }, {
                  offset: 1,
                  color: '#31dde1'
                }]),
                opacity: 0.5,
                barBorderRadius: 12,
                shadowBlur: 15,
                shadowColor: '#397B7C'
              },
            },
            label: {
              normal: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#ddd',
                  fontSize: 18,
                },
                formatter: function (params) {
                    return params.value + '%';
                },
              }
            },
            data: sData
          }],
        }
        var myChart;
        var container = document.getElementById("echartsAssessBox");
        myChart = echarts.init(container);
        myChart.setOption(option);
        window.addEventListener('resize', function () {
          myChart.resize();
        }, false);
      },
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
          font-size: 22px;
          margin-top: 40px;
        }

        .pB {
          margin-top: 20px;
          font-size: 40px;
          color: #74FAFD;
        }
      }

      li:hover {
        background: url('~assets/img/subjectData/4kTrace/titbtnBgHover.png');
      }
    }

    #echartsAssessBox {
      width: 100%;
      height: 600px;
    }
  }

  .ifrBox {
    width: 1920px;
    height: 1080px;
    background: #fff;
    position: fixed;
    top: 50%;
    margin-top: -540px;
    left: 50%;
    margin-left: -960px;
    z-index: 999;
  }
</style>