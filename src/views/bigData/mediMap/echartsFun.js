import echarts from "echarts";
let colors = ['#0DB5EF', '#FFCF69',
  '#66D6A2', '#FFCF69',
  '#9C9C9C', '#BF3EFF',
  '#CD3700', '#7A67EE',
  '#698B22', '#00CD00',
  '#FFB90F', '#FFB6C1'];

  let container;
  let myChart
  
  let container2;
  let myChart2
  
  let container3;
  let myChart3

export function draw(data, nameData, id) {
  let color = [];
  if (data) {
    color = colors.slice(0, data.length);
  }

  let option = {
    tooltip: {
      trigger: 'item',
      formatter: (r) =>{
        return r.marker + r.data.name + "：" + r.data.value
      }
    },
    legend: {
      icon: 'square',
      orient: 'vertical',
      right: '10%',
      y: '5%',
      textStyle:{
        color: '#fff'
      },
      data: nameData
    },
    series: [
      {
        type: 'pie',
        radius: ['30%', '60%'],
        avoidLabelOverlap: false,
        center: ['50%', '50%'],
        color: color,
        label: {
          normal: {
            show:false
          }
        },
        data: data
      }
    ]
  };
  container = document.getElementById(id);
  myChart = echarts.init(container);
  myChart.clear();
  myChart.setOption(option);
  // 窗口变化，重绘图像
  window.addEventListener('resize', function () {
    myChart.resize();
  }, false)
}

export function draw2(data, nameData, id) {
  let color = [];
  if (data) {
    color = colors.slice(0, data.length);
  }

  let option = {
    tooltip: {
      trigger: 'item',
      formatter: (r) => {
        return r.marker + r.data.name + "：" + r.data.value
      }
    },
    legend: {
      icon: 'square',
      orient: 'vertical',
      right: '10%',
      y: '5%',
      textStyle: {
        color: '#fff'
      },
      data: nameData
    },
    series: [
      {
        type: 'pie',
        radius: ['30%', '60%'],
        avoidLabelOverlap: false,
        center: ['50%', '50%'],
        color: color,
        label: {
          normal: {
            show: false
          }
        },
        data: data
      }
    ]
  };
  container2 = document.getElementById(id);
  myChart2 = echarts.init(container2);
  myChart2.clear();
  myChart2.setOption(option);
  // 窗口变化，重绘图像
  window.addEventListener('resize', function () {
    myChart2.resize();
  }, false)
}

export function draw3(data, nameData, id) {
  let color = [];
  if (data) {
    color = colors.slice(0, data.length);
  }

  let option = {
    tooltip: {
      trigger: 'item',
      formatter: (r) => {
        return r.marker + r.data.name + "：" + r.data.value
      }
    },
    legend: {
      icon: 'square',
      orient: 'vertical',
      right: '10%',
      y: '5%',
      textStyle: {
        color: '#fff'
      },
      data: nameData
    },
    series: [
      {
        type: 'pie',
        radius: ['30%', '60%'],
        avoidLabelOverlap: false,
        center: ['50%', '50%'],
        color: color,
        label: {
          normal: {
            show: false
          }
        },
        data: data
      }
    ]
  };
  container3 = document.getElementById(id);
  myChart3 = echarts.init(container3);
  myChart3.clear();
  myChart3.setOption(option);
  // 窗口变化，重绘图像
  window.addEventListener('resize', function () {
    myChart3.resize();
  }, false)
}