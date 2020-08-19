import echarts from "echarts";

export default function (id,name,xAxis,dataArr,cb) {
  var myChart = echarts.init(document.getElementById(id));
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: name,
      right: '0%'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      boundaryGap: false,
      data: xAxis
    }],
    yAxis: [{
      type: 'value'
    }],
    series: [{
        name: name,
        type: 'line',
        stack: '总量',
        areaStyle: {
          normal: {}
        },
        data: dataArr
      },

    ],
    color: ["#92E6FF"]
  };

  myChart.setOption(option);
  myChart.on('click',function(a,b){
    cb(a.name)
  })
  window.addEventListener("resize",()=>{
    myChart.resize()
  })
}
