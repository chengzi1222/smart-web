<template>
  <div class="bigBox">
    <div class="headBox">
      <div class="headLeft">
        <p>下级辖区主体分布</p>
      </div>
      <div class="headRight">
        <button class="typeBtn movePoin" v-for="(item,index) in butTypes" :key="index" :class="choose == index ? 'current':''" @click="chooseChange(index)">
          {{item.name}}
        </button>
      </div>
    </div>
    <div id="pieBox3" class="pieBox"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { getSubOrdinateEntityDistribution } from 'api/bigData/subjectData'
  export default {
    data() {
      return {
        butTypes: [{
          name: '主体总数',
          type: 'totalMap'
        }, {
          name: '生产主体',
          type: 'PRODUCT'
        }, {
          name: '流通主体',
          type: 'CIRCULATION'
        }, {
          name: '餐饮主体',
          type: 'RESTAURANT'
        }],
        choose: 0,
        colors: ['#fa9a2a', '#eabe0d', '#0db5ef', '#764dfd'],  //颜色
        datas: [],
        intev: null
      }
    },
    mounted() {
      this.getSubOrdinateEntityDistribution()
      let _this = this;
      this.intev = setInterval(() => {
        _this.choose++;
        if (_this.choose >= _this.butTypes.length) {
          _this.choose = 0;
          _this.echart()
        } else if (_this.choose < _this.butTypes.length) {
          _this.echart()
        }
      }, 10000);
    },
    methods: {
      chooseChange(index) {
        this.choose = index;
        let _this = this
        this.echart()
        clearInterval(this.intev);
        this.intev = setInterval(() => {
          _this.choose++;
          if (_this.choose >= _this.butTypes.length) {
            _this.choose = 0;
            _this.echart()
          } else if (_this.choose < _this.butTypes.length) {
            _this.echart()
          }
        }, 10000);
      },
      echart() {
        let _data = this.datas[this.butTypes[this.choose].type];
        let xData = [];
        let seriesData = [];
        let seriesDataB = [];
        let num = (this.datas['maxTotal'] * 1.2).toFixed(0)
        for(let item=0; item<_data.length; item++){
          xData.push(_data[item].areaName);
          seriesData.push(_data[item].total);
          console.log(num)
          // seriesDataB.push(num);
        }
        // var xData = ['成都市', '绵阳市', '德阳市', '宜宾市', '攀枝花市', '凉山彝族自治州', '成都市', '绵阳市', '德阳市', '阿坝藏族羌族自治州', '攀枝花市', '凉山彝族自治州', '成都市', '绵阳市', '德阳市', '宜宾市', '攀枝花市', '凉山彝族自治州', '成都市', '绵阳市', '德阳市'];
        // var seriesData = [13, 13, 13, 16, 17, 15, 13, 13, 13, 16, 17, 15, 16, 17, 15, 13, 13, 13, 16, 17, 15];
        // var seriesDataB = [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000];


        let option = {
          backgroundColor: "rgba(0,0,0,0)",
          tooltip: {
            show: "true",
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0.7)', // 背景
            padding: [8, 10], //内边距
            extraCssText: 'box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);', //添加阴影
          },
          grid: {
            left: 70,
            top: 10,
            bottom: 45,
            right: 20,
          },
          xAxis: [{
            type: 'category',
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#363e83',
              }
            },
            axisLabel: {
              inside: false,
              textStyle: {
                color: '#ddd',
                fontWeight: 'normal',
                fontSize: 12
              },
              rotate: 45,
              inactive: 0
            },
            data: xData,
          }, {
            type: 'category',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            },
            data: xData,
          }],
          yAxis: {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#0A2F6F',
                type: 'dashed'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#eee',
                fontWeight: 100,
                fontSize: 12,
                nameGap: 40
              },
              padding: [0, 10]
            },
          },
          series: [{
            name: '',
            type: 'bar',
            itemStyle: {
              normal: {
                show: true,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#00c0e9'
                }, {
                  offset: 1,
                  color: '#3b73cf'
                }]),
                barBorderRadius: 25,
                borderWidth: 0,
              },
              emphasis: {
                shadowBlur: 15,
                shadowColor: 'rgba(105,123, 214, 0.7)'
              }
            },
            zlevel: 2,
            barWidth: '10%',
            data: seriesData,
          },
          {
            name: '',
            type: 'bar',
            xAxisIndex: 1,
            zlevel: 1,
            itemStyle: {
              normal: {
                color: '#121847',
                borderWidth: 0,
                shadowBlur: {
                  shadowColor: 'rgba(255,255,255,0.31)',
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowOffsetY: 2,
                },
              }
            },
            barWidth: '10%',
            // data: seriesDataB
          }
          ]
        }
        let container = document.getElementById('pieBox3');
        let echartDom = echarts.init(container);
        echartDom.setOption(option);
        // 窗口变化，重绘图像
        window.addEventListener('resize', function () {
          echartDom.resize();
        }, false)
      },
      getSubOrdinateEntityDistribution() {
        getSubOrdinateEntityDistribution().then(r => {
          this.datas = r.data;
          this.echart();
        })
      }
    },
  }
</script>

<style scoped lang="sass">
  button {
    outline: 0 none;
  }
  .bigBox {
    width: 100%;
    height: 100%;
    background: url("~@/assets/img/subjectData/oneplus/viceBG.png");
    position: relative;
  }
  .headBox{
    .headLeft{
      width: 30px;
      position: absolute;
      top: 49px;
      left: 27px;
      p{
        font-size:16px;
        font-weight:400;
        color: #eee;
      }
    }
    .headRight{
      width: 85px;
      position: absolute;
      top: 49px;
      right: 20px;
      .typeBtn{
        width: 80px;
        height: 30px;
        background: #182D52;
        border: 1px solid #214B92;
        border-radius: 2px;
        color: #eee;
        font-size:12px;
        margin-bottom: 30px;
      }
      .typeBtn:last-child{
        margin-bottom: 0;
      }
      .current{
        background: linear-gradient(to right, #0DB5EF, #0775BA);
      }
    }
  }
  .pieBox {
    width: 80%;
    height: 80%;
    position: relative;
    margin: 0 auto;
    top: 30px;
    left: -30px;
  }
</style>