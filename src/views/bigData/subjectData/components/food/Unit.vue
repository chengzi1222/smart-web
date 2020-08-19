<template>
  <div style="height:100%;padding: 40px;box-sizing: border-box;background: #050C17;">
    <div class="bigBox">
      <div class="headBox">
        <div class="headLeft">
          <p>重点监管单位情况</p>
          <img src="../../../../../assets/img/subjectData/titleLine.png" alt="">
        </div>
      </div>
      <div class="gaugeBigBox">
        <div class="gaugeBox" v-for="(item,index) in [1,2,3,4,5,6]" :key="index" :id="'gauge' + index"></div>
      </div>
      <!-- <div id="pieBox7" class="pieBox"></div> -->
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    data() {
      return {
        colors: [
          ['#0775BA', '#0DB5EF'],
          ['#381C94', '#764DFD'],
          ['#AB8301', '#EABE0D'],
          ['#CC6A1A', '#E59538'],
          ['#17813F', '#30AF5F'],
          ['#B03B1D', '#E26342']
        ],  //饼图颜色
        datas: [{
          name: '幼儿园',
          value: 953
        },{
          name: '养老院',
          value: 210
        },{
          name: '机关食堂',
          value: 156
        },{
          name: '大型餐饮',
          value: 845
        },{
          name: '学校食堂',
          value: 745
        },{
          name: '网络经营',
          value: 3214
        }]
      }
    },
    mounted() {
      for(let i=0; i<this.datas.length; i++){
        this.echart((this.datas[i].value/6123).toFixed(2), this.colors[i], this.datas[i], 'gauge'+i)
      }
    },
    methods: {
      echart(proportion, colors, datas, id) {
        let option = {
          backgroundColor: "rgba(0,0,0,0)",
          series: [{
            type: 'gauge',
            radius: '90%',
            center: ['50%', '50%'],
            axisLine: {
              show: true,
              lineStyle: {
                width: 20,
                color: [
                  [proportion, new echarts.graphic.LinearGradient(
                      0, 0, 1, 0, [{
                        offset: 0,
                        color: colors[0]
                      },{
                        offset: 1,
                        color: colors[1]
                      }]
                    )
                  ],[1, '#182d52']
                ]
              }
            },
            //分隔线样式。
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            pointer: {
              show: false
            },
            title: {
              show: true,
              offsetCenter: [0, '-26%'], // x, y，单位px
              textStyle: {
                color: '#ddd',
                fontSize: 30,
                fontWeight: 100
              }
            },
            //仪表盘详情，用于显示数据。
            detail: {
              show: true,
              offsetCenter: [0, '26%'],
              color: '#eee',
              textStyle: {
                fontSize: 60
              }
            },
            data: datas
          }]
        };
        let container = document.getElementById(id);
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
    background:rgba(24,34,52,.2);
    border:1px solid rgba(53,122,162,.2);
    height: 100%;
    box-sizing: border-box;
  }

  .headBox {
    padding: 60px;
    overflow: hidden;

    .headLeft {
      float: left;
      min-width: 652px;
      width: 652px;

      p {
        font-size: 40px;
        font-weight: 400;
        color: #eee;
        margin-left: 130px;
      }

      img {
        width: 652px;
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

  .gaugeBigBox {
    width: 100%;
    height: calc(100% - 202px);
    display: flex;
    justify-content:space-between;
    flex-wrap: wrap;
    .gaugeBox{
      width: 33.3%;
      height: 360px;
    }
  }
</style>