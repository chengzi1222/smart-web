<template>
  <div style="height:100%;padding: 40px;box-sizing: border-box;background: #050C17;">
    <div class="bigBox">
      <div class="headBox">
        <p>主体总量增长趋势</p>
        <img src="../../../../../assets/img/subjectData/titleLine.png" alt="">
      </div>
      <div id="pieBox2" class="pieBox"></div>
    </div>
  </div>
</template>

<script>
  import { getSubjectGrowthTrend } from 'api/bigData/subjectData'
  import echarts from 'echarts'
  export default {
    data() {
      return {
        colors: ['rgba(48, 175, 95, 1)', 'rgba(12, 181, 239, 1)', 'rgba(118, 76, 253, 1)', 'rgba(249, 154, 42, 1)', 'rgba(234, 190, 15, 1)'],  //线颜色
        colorsB8: ['rgba(48, 175, 95, .8)', 'rgba(12, 181, 239, .8)', 'rgba(118, 76, 253, .8)', 'rgba(249, 154, 42, .8)', 'rgba(234, 190, 15, .8)'],  //渐变起始颜色
        colorsB0: ['rgba(48, 175, 95, 0)', 'rgba(12, 181, 239, 0)', 'rgba(118, 76, 253, 0)', 'rgba(249, 154, 42, 0)', 'rgba(234, 190, 15, 0)'],  //渐变结束颜色
        xDatas: [],
        legendDatas : [],
        datas: []
      }
    },
    mounted() {
      this.getSubjectGrowthTrend();
    },
    methods: {
      echart() {
        let seriesDatas = []
        for(let i=0; i< this.datas.length; i++) {
          seriesDatas.push({
            name: this.legendDatas[i],
            type: 'line',
            symbol: 'circle',
            symbolSize: 20,
            smooth: true,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: this.colorsB8[i]
                }, {
                  offset: 1,
                  color: this.colorsB0[i]
                }], false)
              }
            },
            itemStyle: {
              normal: {
                color: this.colors[i]
              }
            },
            data: this.datas[i]
          })
        };

        let option = {
          backgroundColor: 'rgba(0,0,0,0)',
          title: {
            show: false
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#AAAAAA'
              }
            }, 
            backgroundColor: 'rgba(24, 54, 78, 0.6)',
            borderColor: 'rgba(7, 117, 186, 0.5)',
            borderWidth: 4,
            padding: 30,
            formatter: function (params) {
              let text = '<h2 style="font-size:24px;font-weight: 400;color: rgba(238, 238, 238, 1);margin-bottom: 20px;">'+ params[0].name.split('-')[0] +'年第'+ params[0].name.split('Q')[1] +'季度</h2>';
              params.forEach(item => {
                text += '<p style="line-height: 40px;color: #ddd;font-size:20px;"><span style="display:inline-block;width:14px;height: 14px;background: '+ item.color +';border-radius: 50%;margin-right: 20px;"></span><span>'+ item.seriesName +'</span><span style="float: right">' + item.value +'</span></p>'
              });
              return text
            }
          },
          legend: {
            data: this.legendDatas,
            right: '4%',
            top: 100,
            itemGap: 20,
            textStyle: {
              fontSize: 20,
              color: '#F1F1F3'
            }
          },
          grid: {
            left: 60,
            right: 60,
            bottom: 60,
            top: 210,
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#57617B',
                fontSize: 18
              }
            },
            data: this.xDatas
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              margin: 28,
              textStyle: {
                fontSize: 20,
                color: '#ddd',
                fontWeight: 100
              }
            },
            splitLine: {
              lineStyle: {
                color: '#214B92',
                type: 'dashed'
              }
            }
          }],
          series: seriesDatas
        };
        let container = document.getElementById('pieBox2');
        let echartDom = echarts.init(container);
        echartDom.setOption(option);
        // 窗口变化，重绘图像
        window.addEventListener('resize', function () {
          echartDom.resize();
        }, false)
      },
      getSubjectGrowthTrend(){
        getSubjectGrowthTrend().then(r => {
          if (!r.status) {
            return
          }
          this.xDatas = r.data.dateqSet;
          this.legendDatas = r.data.entityTypeSet;
          for (let item in r.data.valueItem) { 
            this.datas.push(r.data.valueItem[item])
          }
          this.echart();
        })
      }
    },
  }
</script>

<style scoped lang="sass">
  .bigBox {
    background:rgba(24,34,52,.2);
    border:1px solid rgba(53,122,162,.2);
    height: 100%;
    box-sizing: border-box;
    position: relative;
  }

  .headBox {
    padding: 60px;
    position: absolute;
    p {
      font-size: 40px;
      font-weight: 400;
      color: #eee;
      margin-left: 80px;
    }
    img {
      width: 652px;
    }
  }

  .pieBox {
    width: 100%;
    height: 100%;
  }
</style>