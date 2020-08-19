import echarts from "echarts";

let myChart_drawPercent;
export function drawPercent() {
  let option = {
    tooltip: {
      trigger: 'item',
      formatter: "{a}{d}%"
    },

    series: [
      {
        name: '覆盖率:',
        type: 'pie',
        radius: ['48%', '60%'],
        avoidLabelOverlap: false,
        center: ['50%', '50%'],
        color: ['#0DB5EF', '#F6F7F8'],
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
        data: [
          { value: [this.dailyData.entityCoverage] },
          { value: [100 - this.dailyData.entityCoverage] },
        ]
      }
    ]
  };

  myChart_drawPercent = echarts.init(document.getElementById("percent"));
  myChart_drawPercent.setOption(option);

  // 窗口变化，重绘图像
  window.addEventListener('resize', function () {
    myChart_drawPercent.resize();
  }, false)
}


let myChart_drawRecord
export function drawRecord() {
  let a = 0;
  let b = 0;
  let c = 0;
  if (this.dailyData.dailyFnPei.length != 0) {
    for (let i in this.dailyData.dailyFnPei) {
      if (this.dailyData.dailyFnPei[i].name == '基本符合') {
        a = (this.dailyData.dailyFnPei[i].cover * 100).toFixed(2);
      }
      if (this.dailyData.dailyFnPei[i].name == '符合') {
        b = (this.dailyData.dailyFnPei[i].cover * 100).toFixed(2);
      }
      if (this.dailyData.dailyFnPei[i].name == '不符合') {
        c = (this.dailyData.dailyFnPei[i].cover * 100).toFixed(2);
      }
    }
  }
  let option = {
    tooltip: {
      trigger: 'item',
      // formatter: "{a} <br/>{b}: {c} ({d}%)"
      formatter: "{a} <br/>{b}: {c}%"
    },
    legend: {
      orient: 'vertical',
      x: 'right',
      y: 'center',
      align: 'left',
      data: [{ name: '基本符合', icon: 'circle' }, { name: '符合', icon: 'circle' }, { name: '不符合', icon: 'circle' }]
    },
    series: [
      {
        name: "日常巡查结果:",
        type: 'pie',
        radius: ['30%', '50%'],
        avoidLabelOverlap: false,
        center: ['35%', '50%'],
        color: ['#66D6A2', '#0DB5EF', '#FFCF69'],
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
        data: [
          { value: [a], name: '基本符合' },
          { value: [b], name: '符合' },
          { value: [c], name: '不符合' },
        ]
      }
    ]
  };

  myChart_drawRecord = echarts.init(document.getElementById("record"));
  myChart_drawRecord.setOption(option);

  // 窗口变化，重绘图像
  window.addEventListener('resize', function () {
    myChart_drawRecord.resize();
  }, false)
}


let myChart_drawMainBody
export function drawMainBody(num) {
  console.log('num',num)
  let option = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      x: 'right',
      y: 'center',
      align: 'left',
      data: [{ name: '生产主体', icon: 'circle' }, { name: '经营主体', icon: 'circle' }, { name: '使用主体', icon: 'circle' }]
    },
    series: [
      {
        name: '主体数:',
        type: 'pie',
        radius: ['30%', '50%'],
        avoidLabelOverlap: false,
        center: ['35%', '50%'],
        color: ['#66D6A2', '#0DB5EF', '#FFCF69', '#92E6FF'],
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
        data: [
          { value: num.a, name: '生产主体' },
          { value: num.b, name: '经营主体' },
          { value: num.c, name: '使用主体' },
        ]
      }
    ]
  };


  myChart_drawMainBody = echarts.init(document.getElementById("mainbody"));
  myChart_drawMainBody.setOption(option);

  // 窗口变化，重绘图像
  window.addEventListener('resize', function () {
    myChart_drawMainBody.resize();
  }, false)
}



let myChart_drawCFDA
export function drawCFDA() {
  let option = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      x: 'right',
      y: 'center',
      align: 'left',
      data: this.EntityTypeData.name,
      formatter: function (name) {
        return echarts.format.truncateText(name, 100, '14px Microsoft Yahei', '…');
      }
    },
    series: [
      {
        name: '主体类型:',
        type: 'pie',
        radius: ['30%', '50%'],
        avoidLabelOverlap: false,
        center: ['35%', '50%'],
        color: ['#66D6A2', '#0DB5EF', '#FFCF69', '#92E6FF'],
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '14'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: this.EntityTypeData.data
      }
    ]
  };

  myChart_drawCFDA = echarts.init(document.getElementById("cfda"));
  myChart_drawCFDA.setOption(option);

  // 窗口变化，重绘图像
  window.addEventListener('resize', function () {
    myChart_drawCFDA.resize();
  }, false)
}