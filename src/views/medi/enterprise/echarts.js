import echarts from "echarts";

export function pie(data,index,id,title){
  let itemGap;
  let color;
  if (index == 0) {
    itemGap = 20;
    color=['#0DB5EF','#92E6FF','#66D6A2',"#FFCF69"]
  }else{
    itemGap = 20;
    color=['#66D6A2','#0DB5EF','#FFCF69']
  }
  let myChart = echarts.init(document.getElementById(id));
  let option = {
    title: {
      text: title,
      textStyle:{
        // fontWeight:"normal",
        fontSize:16
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: "{b} <br/>数量: {c} <br/> 占比:{d}%"
    },
    color:color,
    legend: {
      orient: 'vertical',
      x: '65%',
      y:"25%",
      itemGap:itemGap,
      icon:'circle',
      data:data.legendData
    },
    series: [
      {
        type:'pie',
        radius: ['40%', '55%'],
        center:["40%","50%"],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '20',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data:data.seriesData
      }
    ]
  }
  myChart.setOption(option);
}

