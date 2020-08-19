import echarts from "echarts";
let container;
let colors = ['#0DB5EF','#92E6FF',
             '#66D6A2','#FFCF69',
             '#9C9C9C','#BF3EFF',
             '#CD3700','#7A67EE',
             '#698B22','#00CD00',
             '#FFB90F','#FFB6C1'];

let myChart
function draw(data,id){
  let color = [];
  if (data && data.legend){
    color = colors.slice(0,data.legend.length);
  }

  let legendDatas = [];
  for(let i=0; i<data.series.length;i++){
    legendDatas.push(data.series[i].name)
  }


  let option = {
    tooltip: {
      trigger: 'item',
      formatter: "{b}<br/>" +
      "<span style='margin-right:5px;background: #92E6FF;display: inline-block;height: 10px;width: 10px;border-radius: 50%'></span>" +
        "数量：{c} <br/> " +
      "<span style='margin-right:5px;background: #92E6FF;display: inline-block;height: 10px;width: 10px;border-radius: 50%'></span>" +
      "占比：({d}%)"
    },
    legend: {
      icon:'circle',
      orient: 'vertical',
      // x: '70%',
      right:'1%',
      y:'center',
      // align:'left',
      data:legendDatas.splice(0,10)
    },
    series: [
      {
        type:'pie',
        radius: ['30%', '50%'],
        avoidLabelOverlap: false,
        center : ['35%', '50%'],
        color:color,
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '14',
              // fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data:data.series
      }
    ]
  };
    container = document.getElementById(id);
    myChart = echarts.init(container);
    myChart.setOption(option);
    // 窗口变化，重绘图像
    window.addEventListener('resize',function(){
      // let w = container.offsetWidth;
      // let h = container.offsetHeight;
      //
      // let canvas  = container.querySelector("canvas");
      // canvas.width = w;
      // canvas.height = h;
      myChart.resize();
    },false)
}



export default draw
