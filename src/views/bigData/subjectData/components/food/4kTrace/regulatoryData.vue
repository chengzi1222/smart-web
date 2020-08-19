<template>
  <div class="box">
    <h3>学校汇总</h3>
    <div style="position:relative">
      <div class="centerBox">
        <h4>学校总数</h4>
        <p>{{total}}</p>
      </div>
      <div id="pieEchartsBoxSchool"></div>
      <div id="pieEchartsBoxSchoolT"></div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts';

  export default {
    props: {
      dataAllsAll: {
        default: function (){
          return []
        }
      },
      dataAllsRests: {
        default: function () {
          return []
        }
      },
      total: {
        default: function () {
          return 0
        }
      }
    },
    watch: {
      dataAllsAll: function() {
        this.echart();
      },
      dataAllsRests: function () {
        if(this.dataAllsRests.length >= 2){
          this.echartT();
        }
      }
    },
    data() {
      return {
        colors: ['#fa9a2a', '#0db5ef', '#eabe0d', '#764dfd', '#567dad'],  //饼图颜色
        colorsT: ['#F9DC71', '#4DA3E1', '#eabe0d'],  //饼图颜色
      }
    },
    methods: {
      echart() {
        let data = [];
        let _piedatas = this.dataAllsAll;
        let _this = this;
        let totalNum = 0;
        for (let i = 0; i < _piedatas.length; i++) {
          totalNum += _piedatas[i].num;
        }
        for (let i = 0; i < _piedatas.length; i++) {
          data.push({
            value: _piedatas[i].num,
            name: _piedatas[i].type,
            itemStyle: {
              normal: {
                borderWidth: 6,
                shadowBlur: 10,
                color: this.colors[i],
                borderColor: this.colors[i],
                shadowColor: this.colors[i]
              }
            }
          }, {
              value: totalNum * 0.02,
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
          radius: ['45%', '45%'],
          hoverAnimation: false,
          itemStyle: {
            normal: {
              label: {
                show: false,
              },
              labelLine: {
                show: false
              },
              color: 'rgba(0,0,0,0)',
              borderType: 'dashed',
              borderWidth: 1,
              borderColor: '#0DB5EF'
            }
          },
          data: [1]
        }, {
          name: '',
          type: 'pie',
          clockWise: false,
          radius: ['58%', '62%'],
          hoverAnimation: false,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'outside',
                color: '#fff',
                fontSize: 20,
                fontWeight: 100,
                lineHeight: 40,
                formatter: function (params) {
                  let percent = 0;
                  let total = 0;
                  for (let i = 0; i < _piedatas.length; i++) {
                    total += _piedatas[i].num;
                  }
                  percent = ((params.value / total) * 100).toFixed(2);
                  if (params.name !== '') {
                    return params.name + '\n' + params.value + ' (' + percent + '%)';
                  } else {
                    return '';
                  }
                },
              },
              labelLine: {
                length: 30,
                length2: 70,
                show: true,
                lineStyle: {
                  width: 2
                }
              }
            }
          },
          data: data
        }];
        let option = {
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
        let container = document.getElementById('pieEchartsBoxSchool');
        let echartDom = echarts.init(container);
        echartDom.clear()
        echartDom.setOption(option);
        // 窗口变化，重绘图像
        window.addEventListener('resize', function () {
          echartDom.resize();
        }, false)
      },
      echartT() {
        let _dataT = this.dataAllsRests;
        let option = {
          calculable: true,
          color: this.colorsT,
          series: [
            {
              name: '',
              type: 'pie',
              radius: [20, 110],
              roseType: 'radius',
              label: {
                show: true,
                position: 'outside',
                color: '#fff',
                fontSize: 20,
                fontWeight: 100,
                lineHeight: 40,
                formatter: function (params) {
                  let percent = 0;
                  let total = 0;
                  for (let i = 0; i < _dataT.length; i++) {
                    total += _dataT[i].value;
                  }
                  percent = ((params.value / total) * 100).toFixed(2);
                  if (params.name !== '') {
                    return params.name + '\n' + params.value + ' (' + percent + '%)';
                  } else {
                    return '';
                  }
                },
              },
              labelLine: {
                length: 30,
                length2: 70,
                show: true,
                lineStyle: {
                  width: 2
                }
              },
              data: _dataT
            }
          ]
        };
        let container = document.getElementById('pieEchartsBoxSchoolT');
        let echartDom = echarts.init(container);
        echartDom.clear();
        echartDom.setOption(option);
        // 窗口变化，重绘图像
        window.addEventListener('resize', function () {
          echartDom.resize();
        }, false)
      },
    }
  }
</script>
<style lang='scss' scoped>
  .box {
    background: url('~assets/img/subjectData/4kTrace/allLiB.png');
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100%;
    h3 {
      font-weight: normal;
      color: #eee;
      font-size: 40px;
      padding-top: 20px;
      margin-left: calc(17%);
      margin-bottom: 20px;
    }
    #pieEchartsBoxSchool {
      width: 100%;
      height: 500px;
    }
    #pieEchartsBoxSchoolT {
      width: 100%;
      height: 350px;
    }
    .centerBox{
      width: 22.82%;
      height: 24.63%;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: calc(-11.41%);
      margin-top: calc(-28.5%);
      text-align: center;
      padding: 45px 0;
      box-sizing: border-box;
      color: #EEEEEE;
      h4{
        font-size:24px;
        font-weight: normal;
      }
      p{
        margin-top: 18px;
        font-size:40px;
        color:rgba(116,250,253,1);
      }
    }
  }
</style>