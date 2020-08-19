import echarts from "echarts";
let colors = ['#0DB5EF', '#FFCF69',
  '#66D6A2', '#FFCF69',
  '#9C9C9C', '#BF3EFF',
  '#CD3700', '#7A67EE',
  '#698B22', '#00CD00',
  '#FFB90F', '#FFB6C1'];

export function draw(data, nameData, id) {
  let container;

  let myChart
  let color = [];
  if (data) {
    color = colors.slice(0, data.length);
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
      icon: 'circle',
      orient: 'vertical',
      // x: '70%',
      right: '22%',
      y: 'center',
      // align:'left',
      data: nameData
    },
    series: [
      {
        type: 'pie',
        radius: ['30%', '50%'],
        avoidLabelOverlap: false,
        center: ['35%', '50%'],
        color: color,
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
        data: data
      }
    ]
  };
  container = document.getElementById(id);
  myChart = echarts.init(container);
  myChart.setOption(option);
  // 窗口变化，重绘图像
  window.addEventListener('resize', function () {
    myChart.resize();
  }, false)
}

export function totalPatrol(legendData, xData, seriesData, id) {
  let myChart = echarts.init(document.getElementById(id));
  let option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (r) => {
        let num;
        if (r[0].value == 0 && r[1].value + r[0].value != 0){
          num = "0%"
        } else if (r[0].value != 0 && r[0].value / (r[1].value + r[0].value)) {
          let totl = r[0].value / (r[1].value + r[0].value) *100 + '';
          if (totl == 100){
            num = '100%'
          }else{
            num = totl.split('.')[0] + '.' + totl.split('.')[1].slice(0, 2) + "%"
          }
        } else {
          num = "暂无"
        }
        return r[0].name + "<br/>" +
          "总数：" + (r[1].value + r[0].value + r[2].value + r[3].value) + "<br/> " +
          "<span style='margin-right:5px;background: #0DB5EF;display: inline-block;height: 10px;width: 10px;border-radius: 50%'></span>" +
          "通过数：" + r[0].value + "<br/> " +
          "<span style='margin-right:5px;background: #66D6A2;display: inline-block;height: 10px;width: 10px;border-radius: 50%'></span>" +
          "拒绝数：" + r[1].value + "<br/> " +
          "<span style='margin-right:5px;background: #FFCF69;display: inline-block;height: 10px;width: 10px;border-radius: 50%'></span>" +
          "配送中：" + r[2].value + "<br/> " +
          "<span style='margin-right:5px;background: #9C9C9C;display: inline-block;height: 10px;width: 10px;border-radius: 50%'></span>" +
          "无法送达：" + r[3].value + "<br/> " +
          "通过率：" + num
      }
    },
    color: ['#0DB5EF', '#66D6A2', '#FFCF69', '#9C9C9C'],
    legend: {
      icon: 'circle',
      x: "right",
      data: legendData
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          show: false
        },
        data: xData,
        axisLabel: {//坐标轴刻度标签的相关设置。
          formatter: function (params) {
            if (params) {
              var newParamsName = "";// 最终拼接成的字符串
              var paramsNameNumber = params.length;// 实际标签的个数
              var provideNumber = 8;// 每行能显示的字的个数
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
              /**
               * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
               */
              // 条件等同于rowNumber>1
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = "";// 表示每一次截取的字符串
                  var start = p * provideNumber;// 开始截取的位置
                  var end = start + provideNumber;// 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p == rowNumber - 1) {
                    // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    // 每一次拼接字符串并换行
                    tempStr = params.substring(start, end) + "\n";
                  }
                  newParamsName += tempStr;// 最终拼成的字符串
                }

              } else {
                // 将旧标签的值赋给新标签
                newParamsName = params;
              }
              //将最终的字符串返回
              return newParamsName
            }
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisTick: {
          show: false
        },
      }
    ],
    dataZoom: {
      startValue: 0,
      endValue: 6,
      minSpan: 10,
      // zoomLock:true,
      type: 'slider',
      xAxisIndex: 0,
      filterMode: 'empty'
    },
    series: seriesData
  };
  myChart.setOption(option);
  // 窗口变化，重绘图像
  window.addEventListener('resize', function () {
    myChart.resize();
  }, false)
}