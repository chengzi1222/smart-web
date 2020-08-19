<template>
  <div class="box">
    <h3>食品监管数据</h3>
    <ul class="dataBox">
      <li v-for="(item,index) in databox" :key="item+index">
        <p>{{item.name}}</p>
        <p class="pB">{{item.num}}</p>
      </li>
    </ul>
    <div style="position:relative">
      <div class="centerBox">
        <h4>检查总数</h4>
        <p>{{total[choose]}}</p>
      </div>
      <div id="pieEchartsBox"></div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts';
  export default {
    components: {

    },
    data() {
      return {
        databox: [
          { name: "覆盖率", num: "97.6%" },
          { name: "逾期未巡查", num: '30' },
          { name: "巡查预警", num: '6' },
          { name: "已完成计划", num: '3' },
        ],
        choose: 0,        
        colors: ['#fa9a2a', '#0db5ef', '#eabe0d', '#764dfd', '#567dad'],  //饼图颜色
        total: [5736, 6282, 16694, 16694],
        datas: [
          [
            {"num":1016,"type":"基本符合"},
            {"num":4320,"type":"符合"},
            {"num":400,"type":"不符合"}
          ],[
            {"num":4424,"type":"小经营店(餐饮)"},
            {"num":1763,"type":"小经营店(销售)"},
            {"num":38,"type":"小摊贩"},
            {"num":57,"type":"小作坊"}
          ],[
            {"num":1991,"type":"A级"},
            {"num":804,"type":"B级"},
            {"num":1418,"type":"C级"},
            {"num":160,"type":"D级"},
            {"num":12321,"type":"未评定"}
          ],[
            {"num":291,"type":"A级"},
            {"num":1918,"type":"B级"},
            {"num":1098,"type":"C级"},
            {"num":13387,"type":"未评定"}
          ]
        ]
      }
    },
    mounted() {
      this.echart()
    },
    beforeDestroy() {
    },
    methods: {
      echart() {
        let data = [];
        let _piedatas = this.datas[this.choose];
        let _this = this;
        for (let i = 0; i < _piedatas.length; i++) {
          data.push({
            value: _piedatas[i].num,
            name: _piedatas[i].type,
            itemStyle: {
              normal: {
                borderWidth: 3,
                shadowBlur: 15,
                color: this.colors[i],
                borderColor: this.colors[i],
                shadowColor: this.colors[i]
              }
            }
          }, {
              value: _this.total[_this.choose] * 0.01,
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
          radius: ['35%', '35%'],
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
          radius: ['45%', '48%'],
          hoverAnimation: false,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'outside',
                color: '#fff',
                fontSize: 12,
                fontWeight: 100,
                padding: [0, 5],
                formatter: function (params) {
                  let percent = 0;
                  let total = 0;
                  for (let i = 0; i < _piedatas.length; i++) {
                    total += _piedatas[i].num;
                  }
                  percent = ((params.value / total) * 100).toFixed(2);
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
                    padding: [2, 0]
                  }
                }
              },
              labelLine: {
                length: 15,
                length2: 20,
                show: true,
                lineStyle: {
                  width: 1
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
        let container = document.getElementById('pieEchartsBox');
        let echartDom = echarts.init(container);
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
    background: url('~assets/img/subjectData/screen2bg.png');
    background-size: 100% 100%;
    height: 100%;

    h3 {
      font-weight: normal;
      color: #eee;
      font-size: 20px;
      padding-top: 10px;
      margin-left: calc(17%);
      margin-bottom: 38px;
    }

    .dataBox {
      width: calc(100% - 40px);
      height: 90px;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      margin-bottom: 6px;

      >li {
        width: 90px;
        height: 100%;
        background: linear-gradient(0deg, rgba(17, 45, 74, 0.6), rgba(32, 75, 102, 0.6));
        text-align: center;

        p {
          color: #ffffff;
          font-size: 12px;
          margin-top: 20px;
        }

        .pB {
          margin-top: 10;
          font-size: 20px;
          color: rgba(13, 181, 239, 1);
        }
      }
    }

    #pieEchartsBox {
      width: 100%;
      height: 300px;
    }
    .centerBox{
      width: 22.82%;
      height: 39.63%;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: calc(-11.41%);
      margin-top: calc(-11.5%);
      text-align: center;
      padding: 30px 0;
      box-sizing: border-box;
      color: #EEEEEE;
      h4{
        font-size:12px;
        font-weight: normal;
      }
      p{
        margin-top: 10px;
        font-size:24px;
      }
    }
  }
</style>