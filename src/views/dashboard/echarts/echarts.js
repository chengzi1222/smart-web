import echarts from "echarts";

let myChart_drawMainBody
export function drawMainBody() {
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
      data: [{ name: '三小主体', icon: 'circle' }, { name: '餐饮主体', icon: 'circle' }, { name: '生产主体', icon: 'circle' }, { name: '流通主体', icon: 'circle' }]
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
          { value: this.entityTotalMap.CFDA, name: '三小主体' },
          { value: this.entityTotalMap.RESTAURANT, name: '餐饮主体' },
          { value: this.entityTotalMap.PRODUCT, name: '生产主体' },
          { value: this.entityTotalMap.CIRCULATION, name: '流通主体' },
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
      data: [{ name: '小经营店（餐饮）', icon: 'circle' }, { name: '小经营店（销售）', icon: 'circle' }, { name: '小作坊', icon: 'circle' }, { name: '小摊贩', icon: 'circle' }]
    },
    series: [
      {
        name: '三小主体数:',
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
          { value: this.cfdaTotalMap.CFDARESTAURANT, name: '小经营店（餐饮）' },
          { value: this.cfdaTotalMap.SALE, name: '小经营店（销售）' },
          { value: this.cfdaTotalMap.WORKSHOP, name: '小作坊' },
          { value: this.cfdaTotalMap.VENDORS, name: '小摊贩' },
        ]
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

let myChart_drawPercent
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
          { value: [this.entityCoverage] },
          { value: [100 - this.entityCoverage] },
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
              fontSize: '14'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          { value: [this.patrolResult.PASSED], name: '基本符合' },
          { value: [this.patrolResult.QUALIFIED], name: '符合' },
          { value: [this.patrolResult.DISQUALIFIED], name: '不符合' },
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