import echarts from "echarts";

let myChart
function draw(yAxisName,seriesName,xData,yData){
  let option = {
    color: ['#0DB5EF'],
    tooltip : {
      trigger: 'axis',
      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '0%',
      bottom: '0%',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        data : xData,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis : [
      {
        type : 'value',
        name: yAxisName ,
      }
    ],
    series : [
      {
        name:seriesName,
        type:'bar',
        barWidth: '40px',
        data: yData ,
      }
    ]
  };
  document.getElementById("area").style.width = yData.length * 100 + 'px';
  myChart = echarts.init(document.getElementById("area"));
  myChart.setOption(option);
  // 窗口变化，重绘图像
  window.addEventListener('resize',function(){
    myChart.resize();
  },false)
}


export default draw
