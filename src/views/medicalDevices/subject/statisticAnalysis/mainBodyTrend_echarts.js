import echarts from "echarts";

let colors = ['#0DB5EF', '#BF3EFF',
  '#CD3700', '#92E6FF', '#66D6A2',
  '#FFCF69', '#9C9C9C', '#7A67EE',
  '#698B22', '#00CD00',
  '#FFB90F', '#FFB6C1'];

let myChart;
function draw(xData, yData) {
  let ySeries = [];
  let areaNames = [];
  if (yData) {
    for (let i = 0; i < yData.length; i++) {
      areaNames.push(yData[i].dept_name);
      let yDataArr = []
      for(let j=0;j<yData[i].list.length;j++){
        yDataArr.push(yData[i].list[j].cnt)
      }
      ySeries.push({
        name: yData[i].dept_name,
        type: 'line',
        smooth: true,
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 10,
        data: yDataArr,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: colors[i]
            }, {
              offset: 1,
              color: '#ffe'
            }], false)
          }
        },
        itemStyle: {
          normal: {
            color: colors[i]
          }
        },
        lineStyle: {
          normal: {
            width: 3
          }
        }
      })
    }
  }
  let option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          color: '#ddd'
        }
      },
      backgroundColor: 'rgba(121,128,138,0.7)',
      padding: [5, 10],
      textStyle: {
        color: '#fff',
      },
      extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
    },
    legend: {
      left: '2%',
      orient: 'horizontal',
      data: areaNames
    },
    grid: {
      left: '4%',
      right: '3%'
    },
    xAxis: {
      type: 'category',
      data: xData,
      boundaryGap: false,
      splitLine: {
        show: false,
        interval: 'auto',
        lineStyle: {
          color: ['#D4DFF5']
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#6D7787'
        }
      },
      axisLabel: {
        margin: 10,
        textStyle: {
          fontSize: 14
        }
      }
    },
    dataZoom: {
      startValue: 0,
      endValue: 6,
      zoomLock: true,
      type: 'slider',
      xAxisIndex: 0,
      filterMode: 'empty'
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: ['#D4DFF5']
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#6D7787'
        }
      },
      axisLabel: {
        margin: 10,
        textStyle: {
          fontSize: 14
        }
      }
    },
    series: ySeries
  };
  myChart = echarts.init(document.getElementById('mainBodyTrend'));
  myChart.clear();
  myChart.setOption(option);
  // 针对时间颗粒度为年的情况下，tip第一次默认显示，不用触发，之后移入还是喝hover效果一样
  if(xData&&xData.length==1&&yData&&yData.length==1){
    setTimeout(function(){
      myChart.dispatchAction({
            type: 'showTip',
            seriesIndex:0,  // 显示第几个series
            dataIndex: 0 // 显示第几个数据
        });
    })
  }
  // 窗口变化，重绘图像
  window.addEventListener('resize', function () {
    myChart.resize();
  }, false)
}
export default draw
