import echarts from "echarts";

let colors = ['#0DB5EF','#BF3EFF',
  '#CD3700','#92E6FF','#66D6A2',
  '#FFCF69','#9C9C9C','#7A67EE',
  '#698B22','#00CD00',
  '#FFB90F','#FFB6C1'];

let myChart;
function draw(areaNames, xData, yData){
  let ySeries = [];
  if (yData){
    for (let i = 0; i<yData.length; i++){
      ySeries.push(
      {
        name: yData[i].name,
        type: 'line',
        smooth: true,
        showSymbol: false,
        symbol: 'circle',
        symbolSize: 6,
        data: yData[i].data,
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
            color: '#8cddc1'
          }
        },
        lineStyle: {
          normal: {
            width: 3
          }
        }
      }
      )
      //////
    }
  }
  let box = document.getElementById("box");
  box.innerHTML = "";
  let div = document.createElement('div');
  // div.style.width = 2000 + 'px';
  div.style.height = 260 + 'px';
  div.id = 'canvas'+(new Date()).getTime();
  box.appendChild(div);
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
      left:'2%',
      orient: 'horizontal',
      data: areaNames
    },
    grid:{
      left:'4%',
      right:'3%'
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
      startValue:0,
      endValue:6,
      zoomLock:true,
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
  myChart = echarts.init(document.getElementById(div.id));
  myChart.setOption(option);
  // 窗口变化，重绘图像
  // window.addEventListener('resize',function(){
  //   myChart.resize();
  // },false)
}
export default draw
