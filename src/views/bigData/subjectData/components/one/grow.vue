<template>
  <div class="bigBox">
    <div class="headBox">
      <!-- <p>主体总量增长趋势</p> -->
      <div class="headLeft">
        <p>主体总量增长趋势</p>
      </div>
      <div class="headRight">
        <button class="typeBtn" v-for="(item,index) in legendDatas" :key="index" @click="chooseChange(index)"></button>
      </div>
    </div>
    <div id="pieBox2" class="pieBox"></div>
    <div id="pieBoxS" class="pieBoxS"></div>
  </div>
</template>

<script>
  import { getSubjectGrowthTrend } from 'api/bigData/subjectData'
  import echarts from 'echarts'
  export default {
    data() {
      return {
        colors: ['rgba(48, 175, 95, 1)', 'rgba(12, 181, 239, 1)', 'rgba(118, 76, 253, 1)', 'rgba(249, 154, 42, 1)', 'rgba(234, 190, 15, 1)'],  //线颜色
        colorsB8: ['rgba(48, 175, 95, .8)', 'rgba(12, 181, 239, .8)', 'rgba(118, 76, 253, .8)', 'rgba(249, 154, 42, .8)', 'rgba(234, 190, 15, .8)'],  //渐变起始颜色
        colorsB0: ['rgba(48, 175, 95, 0)', 'rgba(12, 181, 239, 0)', 'rgba(118, 76, 253, 0)', 'rgba(249, 154, 42, 0)', 'rgba(234, 190, 15, 0)'],  //渐变结束颜色
        xDatas: [],
        legendDatas : [],
        datas: [],
        intev: null,
        choose: 0
      }
    },
    mounted() {
      this.getSubjectGrowthTrend();
      let _this = this;
      this.intev = setInterval(() => {
        _this.choose++;
        if (_this.choose >= _this.legendDatas.length) {
          _this.choose = 0;
          _this.echartOnly(_this.choose)
        } else if (_this.datas.length == _this.legendDatas.length) {
          _this.echartOnly(_this.choose)
        }
      }, 10000);
    },
    methods: {
      echart() {
        let seriesDatas = [];
        for(let i=0; i< this.datas.length; i++) {
          seriesDatas.push({
            name: this.legendDatas[i],
            type: 'line',
            symbol: 'circle',
            symbolSize: 20,
            smooth: true,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: this.colorsB8[i]
                }, {
                  offset: 1,
                  color: this.colorsB0[i]
                }], false)
              }
            },
            itemStyle: {
              normal: {
                color: this.colors[i]
              }
            },
            data: this.datas[i]
          })
        };

        let option = {
          backgroundColor: 'rgba(0,0,0,0)',
          title: {
            show: false
          },
          legend: {
            data: this.legendDatas,
            right: 15,
            top: 55,
            orient: 'vertical',
            itemGap: 48,
            textStyle: {
              fontSize: 12,
              color: '#F1F1F3'
            }
          },
          grid: {
            left: 2000,
            right: 0,
            bottom: 30,
            top: 50,
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              fontSize: 12,
              margin: 20
            },
            data: this.xDatas
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              margin: 28,
              textStyle: {
                fontSize: 12,
                color: '#ddd',
                fontWeight: 100
              }
            },
            splitLine: {
              lineStyle: {
                color: '#214B92',
                type: 'dashed'
              }
            }
          }],
          series: seriesDatas
        };
        let container = document.getElementById('pieBox2');
        let echartDom = echarts.init(container);
        echartDom.setOption(option);
        // 窗口变化，重绘图像
        window.addEventListener('resize', function () {
          echartDom.resize();
        }, false)
      },
      echartOnly(index) {
        let seriesDatas = [{
          name: this.legendDatas[index],
          type: 'line',
          symbol: 'circle',
          symbolSize: 10,
          lineStyle: {
            normal: {
              width: 2
            }
          },
          label: {
            normal: {
              show: true,
              position: 'top',
              textStyle: {
                color: this.colorsB8[index],
                fontSize: 12,
                fontWeight: 'bold'
              }
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: this.colorsB8[index]
              }, {
                offset: 1,
                color: this.colorsB0[index]
              }], false)
            }
          },
          itemStyle: {
            normal: {
              color: this.colors[index]
            }
          },
          data: this.datas[index]
        }]

        let option = {
          backgroundColor: 'rgba(0,0,0,0)',
          title: {
            show: false
          },
          legend: {
            show: false
          },
          grid: {
            left: 10,
            right: 10,
            bottom: 0,
            top: 10,
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              fontSize: 12,
              margin: 20
            },
            data: this.xDatas
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              margin: 28,
              textStyle: {
                fontSize: 12,
                color: '#ddd',
                fontWeight: 100
              }
            },
            splitLine: {
              lineStyle: {
                color: '#214B92',
                type: 'dashed'
              }
            }
          }],
          series: seriesDatas
        };
        let container = document.getElementById('pieBoxS');
        let echartDom = echarts.init(container);
        echartDom.setOption(option);
        // 窗口变化，重绘图像
        window.addEventListener('resize', function () {
          echartDom.resize();
        }, false)
      },
      getSubjectGrowthTrend(){
        getSubjectGrowthTrend().then(r => {
          if (!r.status) {
            return
          }
          this.xDatas = r.data.dateqSet;
          this.legendDatas = r.data.entityTypeSet;
          for (let item in r.data.valueItem) { 
            this.datas.push(r.data.valueItem[item])
          }
          this.echartOnly(0);
          this.echart();
        })
      },
      chooseChange(index){
        this.echartOnly(index);
        let _this = this
        this.choose = index;
        clearInterval(this.intev);
        this.intev = setInterval(() => {
          _this.choose++;
          if (_this.choose >= _this.legendDatas.length) {
            _this.choose = 0;
            _this.echartOnly(_this.choose)
          } else if (_this.datas.length == _this.legendDatas.length) {
            _this.echartOnly(_this.choose)
          }
        }, 10000);
      }
    },
  }
</script>

<style scoped lang="sass">  
  button{
    outline:0 none;
  }
  .bigBox{
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
      z-index: 9;
      top: 49px;
      right: 10px;
      .typeBtn{
        width: 90px;
        height: 30px;
        background: none;
        border: none;
        color: #eee;
        font-size:12px;
        margin-bottom: 30px;
        cursor: pointer;
      }
      .typeBtn:last-child{
        margin-bottom: 0;
      }
    }
  }

  .pieBox{
    width: 100%;
    height: 100%;
  }
  .pieBoxS{
    width: 80%;
    height: 80%;
    position: absolute;
    z-index: 9;
    top: 30px;
    left: 50px;
    /* background: #07111f !important; */
  }
</style>