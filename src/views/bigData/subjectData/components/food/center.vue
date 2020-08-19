<template>
  <div style="height:100%">
    <div class="bigBox">
      <div class="headBox">
        <div class="headLeft">
          <p>主体类型分布4</p>
          <img src="../../../../../assets/img/subjectData/titleLine.png" alt="">
        </div>
        <div class="headRight">
          <button class="typeBtn" v-for="(item,index) in butTypes" :key="index" :class="choose == index ? 'current':''">
            {{item}}
          </button>
        </div>
      </div>
      <div id="pieBox4" class="pieBox"></div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    data() {
      return {
        echartDom: null,
        butTypes: ['主体类型分布', '三小类型分布', '风险等级分布', '量化等级分布'],
        choose: 0,
        pieDatas: [{  //饼图数据
          'name': '工程建设',
          'value': 5
        }, {
          'name': '产权交易',
          'value': 6
        }, {
          'name': '土地交易',
          'value': 3
        }, {
          'name': '其他交易',
          'value': 4
        }],
        colors: ['#fa9a2a', '#eabe0d', '#0db5ef', '#764dfd'],  //饼图颜色
      }
    },
    mounted() {
      this.echartDom = echarts.init(document.getElementById('pieBox'))
      this.echart()
    },
    methods: {
      echart() {
        let data = [];
        let _piedatas = this.pieDatas;
        for (let i = 0; i < _piedatas.length; i++) {
          data.push({
            value: _piedatas[i].value,
            name: _piedatas[i].name,
            itemStyle: {
              normal: {
                borderWidth: 5,
                shadowBlur: 15,
                color: this.colors[i],
                borderColor: this.colors[i],
                shadowColor: this.colors[i]
              }
            }
          }, {
              value: 1,
              name: '',
              itemStyle: {
                normal: {
                  color: 'rgba(0, 0, 0, 0)'
                }
              }
            });
        }
        let seriesObj = [{
          name: '',
          type: 'pie',
          clockWise: false,
          radius: ['60%', '63%'],
          hoverAnimation: false,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'outside',
                color: '#fff',
                fontSize: 24,
                fontWeight: 100,
                padding: [0, 20],
                formatter: function (params) {
                  let percent = 0;
                  let total = 0;
                  for (let i = 0; i < _piedatas.length; i++) {
                    total += _piedatas[i].value;
                  }
                  percent = ((params.value / total) * 100).toFixed(0);
                  if (params.name !== '') {
                    return params.name + '：' + params.value + '   (' + percent + '%)';
                  } else {
                    return '';
                  }
                },
                rich: {
                  white: {
                    color: '#fff',
                    align: 'center',
                    padding: [3, 0]
                  }
                }
              },
              labelLine: {
                length: 50,
                length2: 150,
                show: true,
                lineStyle: {
                  width: 3
                }
              }
            }
          },
          data: data
        }];
        let option = {
          backgroundColor: 'rgba(0,0,0,0)',
          tooltip: {
            show: false
          },
          legend: {
            show: false
          },
          toolbox: {
            show: false
          },
          series: seriesObj
        }
        let container = document.getElementById('pieBox4');
        let echartDom = echarts.init(container);
        echartDom.setOption(option);
        // 窗口变化，重绘图像
        window.addEventListener('resize', function () {
          echartDom.resize();
        }, false)
      }
    },
  }
</script>

<style scoped lang="sass">
  button {
    outline: 0 none;
  }

  .bigBox {
    background: rgba(21, 34, 54, .2);
    height: 100%;
  }

  .headBox {
    padding: 60px;
    overflow: hidden;

    .headLeft {
      float: left;
      min-width: 610px;
      width: 610px;

      p {
        font-size: 40px;
        font-weight: 400;
        color: #eee;
        margin-left: 80px;
      }

      img {
        width: 610px;
      }
    }

    .headRight {
      float: right;
      min-width: 55%;
      text-align: right;
      width: 55%;

      .typeBtn {
        width: 160px;
        height: 60px;
        background: #182D52;
        border: 1px solid #214B92;
        border-radius: 2px;
        color: #eee;
        font-size: 20px;
        margin-right: 30px;
      }

      .typeBtn:last-child {
        margin-right: 0;
      }

      .current {
        background: linear-gradient(to right, #0DB5EF, #0775BA);
      }
    }
  }

  .pieBox {
    width: 100%;
    height: calc(100% - 202px);
  }
</style>