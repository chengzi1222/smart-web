import echarts from "echarts";

export function getCharts(data, xAxisData, id) {
  let myChart = echarts.init(document.getElementById(id))
  // myChart.clear()
  let option = {}
  if(id === 'merCount') {
    option = {
      textStyle: {
        color: '#6D7787',
        lineHeight: 20
      },
      tooltip: {
        trigger: 'axis',
        triggerOn: 'mousemove',
        padding: [10,20,10,10],
        formatter: function(params) {
          return `<span style="color:#BDC5D2">${params[0].axisValue}</span><br/>
                  ${params[0].marker}<span style="color:#FFFFFF">${params[0].seriesName}: </span><span style="color:#FFFFFF">${params[0].value}</span>`
        },
        position: function (pt) {
            return [pt[0], 100];
        }
      },
      grid: {  
        left: 50,  
        right: 20,  
        bottom: 90, 
        top: 74
      },
      legend: {
        icon:'circle',
        data: ['商家总数'],
        top: 17,
        right: 20,
        textStyle: {
          fontSize: 14,
          color: '#6D7787'
        }
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        axisTick: false,
        axisPointer: {
          value: '2017-01',
          snap: true,
          lineStyle: {
            color: '#ABB6BF',
            opacity: 0.5,
            width: 2
          },
          axisLine: {
            lineStyle: {
              width: 0
            }
          }
        },
        data: xAxisData
      },
      yAxis: {
        type: 'value',
        axisTick: false,
        axisLine: {
          lineStyle: {
            width: 0
          }
        } 
      },
      series: [{
        name: ['商家总数'],
        data: data,
        type: 'line',
        sampling: 'average',
        areaStyle: {
          color: '#A7E8FF'
        },
        lineStyle: {
          width: 2,
          color: '#0DB5EF'
        },
        itemStyle: {
          color: '#0DB5EF'
        },
        symbolSize: 10
      }]
    }
  } 
  if(id === 'mer') {
    option = {
      textStyle: {
        color: '#6D7787',
        lineHeight: 20
      },
      tooltip: {
        trigger: 'axis',
        triggerOn: 'mousemove',
        padding: [10,20,10,10],
        formatter: function(params) {
          return `<span style="color:#BDC5D2">${params[0].axisValue}</span><br/>
                  ${params[0].marker}<span style="color:#FFFFFF">${params[0].seriesName}: </span><span style="color:#FFFFFF">${params[0].value}</span><br/>
                  ${params[1].marker}<span style="color:#FFFFFF">${params[1].seriesName}: </span><span style="color:#FFFFFF">${params[1].value}</span>`
        },
        position: function (pt) {
          return [pt[0], 100];
        }
      },
      grid: {  
        left: 50,  
        right: 20,  
        bottom: 90, 
        top: 74
      },
      legend: {
        icon:'circle',
        data: ['上新商家', '关闭商家'],
        top: 17,
        right: 20,
        textStyle: {
          fontSize: 14,
          color: '#6D7787'
        }
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        axisTick: false,
        axisLine: {
          lineStyle: {
            width: 0
          }
        },
        axisPointer: {
          value: '2017-01',
          snap: true,
          lineStyle: {
            color: '#ABB6BF',
            opacity: 0.5,
            width: 2
          }
        },
        data: xAxisData
      },
      yAxis: {
        type: 'value',
        axisTick: false,
        axisLine: {
          lineStyle: {
            width:0
          }
        } 
      },
      series: [{
        name: ['上新商家'],
        data: data.merData,
        type: 'line',
        smooth: true,
        sampling: 'average',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#A4FFD5',
            opacity: 0.5
          }, {
            offset: 1,
            color: '#D1FFE9',
            opacity: 0.18
          }])
        },
        lineStyle: {
          width: 2,
          color: '#66D6A2'
        },
        itemStyle: {
          color: '#66D6A2'
        },
        symbolSize: 10
      },{
        name: ['关闭商家'],
        data: data.merData2,
        type: 'line',
        smooth: true,
        sampling: 'average',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#FFCF69',
            opacity: 0.5
          }, {
            offset: 1,
            color: '#FFF2D7',
            opacity: 0.18
          }])
        },
        lineStyle: {
          width: 2,
          color: '#FFCF69'
        },
        itemStyle: {
          color: '#FFCF69'
        },
        symbolSize: 10
      }]
    }
  }
  if(id === 'merArea') {
    option = {
      textStyle: {
        color: '#6D7787',
        lineHeight: 20
      },
      color: '#0DB5EF',
      tooltip: {
        trigger: 'axis',
        triggerOn: 'mousemove',
        padding: [10,20,10,10],
        formatter: function(params) {
          return `<span style="color:#BDC5D2">${params[0].axisValue}</span><br/>
                  ${params[0].marker}<span style="color:#FFFFFF">${params[0].seriesName}: </span><span style="color:#FFFFFF">${params[0].value}</span>`
        },
        position: function (pt) {
          return [pt[0], 100];
        }
      },
      grid: {  
        left: 50,  
        right: 20,  
        bottom: 90, 
        top: 74
      },
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            width: 0
          }
        },
        axisPointer: {
          type: 'shadow',
          snap: true,
          lineStyle: {
            color: '#ABB6BF',
            opacity: 0.5,
            width: 2
          }
        },
        axisTick: false,
        data: xAxisData
      },
      yAxis: {
        type: 'value',
        axisTick: false,
        axisLine: {
          lineStyle: {
            width:0
          }
        } 
      },
      series: [{
        name: ['商家数量'],
        barWidth: '30%',
        barCategoryGap: '100%',
        data: data,
        type: 'bar'
      }]
    }
  }

  if(id === 'merType') {
    let data5 = [{value:335, name:'小吃快餐'},
                {value:787, name:'火锅'},
                {value:234, name:'川菜'},
                {value:135, name:'烧烤烤肉'},
                {value:345, name:'自助餐'},
                {value:542, name:'韩式料理'}]
    let count = 0
    data5.forEach(item => {
      count += item.value
    })
    option = {
      color: ['#2694CA','#0DB5EF','#92E6FF','#66D6A2','#BDEC98','#FFCF69'],
      textStyle: {
        color: '#6D7787',
        lineHeight: 20
      },
      tooltip: {
        trigger: 'item',
        padding: 10,
        formatter: function(params) {
          return `<span style="color:#BDC5D2">${params.name}</span><br/>
                  ${params.marker}<span style="color:#FFFFFF">数量: ${params.value}</span><br/>
                  ${params.marker}<span style="color:#FFFFFF">占比: ${Math.round(params.value/count * 100)}%</span>`
        }
      },
      legend: {
        orient: 'vertical',
        icon: 'circle',
        top: 'middle',
        right:'50',
        itemGap: 20,
        textStyle: {
          fontSize: 14,
          color: '#6D7787'
        },
        data:['小吃快餐','火锅','川菜','烧烤烤肉','自助餐','韩式料理']
      },
      series: [
        {
          name:'经营类别',
          type:'pie',
          center: ['40%', '50%'],
          radius: ['40%', '55%'],
          startAngle: 150,
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: data5
        }
      ]
    }
  }

  myChart.setOption(option)  
  // 窗口变化，重绘图像
  window.addEventListener('resize', function () {
      myChart.resize()
  }, false)
}