import echarts from "echarts";
// 线图
export function getCharts(data, id) {

    let myChart = echarts.init(document.getElementById(id));
    // myChart.clear()

    let option = {}
    if(id === 'riskScale') {
      let data1 = [{value:335, name:'高风险'},
                  {value:787, name:'中风险'},
                  {value:234, name:'低风险'},
                  {value:135, name:'暂无风险'}]
      let count = 0
      data1.forEach(item => {
        count += item.value
      })
      option = {
        color: ['#F2947E','#96E4A8','#A4E0FF','#FFCF69'],
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
          icon:'circle',
          top: 'middle',
          right: 50,
          itemGap: 20,
          textStyle: {
            fontSize: 14,
            color: '#6D7787'
          },
          data:['高风险','中风险','低风险','暂无风险']
        },
        series: [
          {
            name:'风险总数',
            type:'pie',
            center: ['40%', '50%'],
            radius: ['50%', '70%'],
            startAngle: 120,
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
            data: data1
          }
        ]
      }
    }

    if(id === 'riskDistri') {
      let data2 = [{value:645, name:'证照风险'},
                  {value:369, name:'地址风险'},
                  {value:1299, name:'联系方式风险'}]
      let count = 0
      data2.forEach(item => {
        count += item.value
      })
      let data3 = [{value:335, name:'无证照'},
                  {value:310, name:'证照模糊'},
                  {value:234, name:'无地址'},
                  {value:135, name:'地址重复'},
                  {value:1048, name:'无号码'},
                  {value:251, name:'号码重复'}]
      // let count2 = 0
      // data3.forEach(item => {
      //   count2 += item.value
      // })
      option = {
        tooltip: {
          trigger: 'item',
          padding: 10,
          formatter: function(params) {
            return `<span style="color:#BDC5D2">${params.name}</span><br/>
                    ${params.marker}<span style="color:#FFFFFF">数量: ${params.value}</span><br/>
                    ${params.marker}<span style="color:#FFFFFF">占比: ${Math.round(params.value/count * 100)}%</span>`
          }
        },
        series: [{
          name:'风险分布',
          type:'pie',
          radius: [0, '49%'],
          startAngle: 240,
          color: ['#58D6D6','#81D89B','#7EBEF9'],
          hoverOffset: 1,
          itemStyle: {
            borderColor: ['#FFFFFF']
          },
          label: {
            normal: {
              position: 'inner',
              fontSize: 10
            }
          },
          data: data2
        }, {name:'风险分布',
            type:'pie',
            radius: ['50%', '70%'],
            startAngle: 240,
            itemStyle: {
              borderColor: ['#FFFFFF']
            },
            color: ['#86E7E7','#B8F6F6','#9FE5AF','#C4F6CD','#C4EBFF','#91D1FE'],
            avoidLabelOverlap: true,
            hoverOffset: 1,
            labelLine: {
              normal: {
                length: 10,
                length2: 0,
                lineStyle: {
                  color: '#C4EBFF'
                }
              }
            },
            label: {
              normal: {
                color: '#6D7787',
                fontSize: 12
              }
            },
            data:data3
        }]
      }
    }

    myChart.setOption(option)
    // 窗口变化，重绘图像
    window.addEventListener('resize', function () {
        myChart.resize()
    }, false)
}