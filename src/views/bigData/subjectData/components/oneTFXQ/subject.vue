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
        }, {
          name: '药品',
          type: 'MEDI'
        }, {
          name: '医疗器械',
          type: 'MEDIDEV'
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
          textStyle: {
            fontFamily: 'SimHei',
          },
          backgroundColor: "rgba(0,0,0,0)",
          tooltip: {
            show: "true",
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0.7)', // 背景
            padding: [8, 10], //内边距
            extraCssText: 'box-shadow: 0 0 6px rgba(255, 255, 255, 0.4);', //添加阴影
          },
          grid: {
            left: 140,
            top: 20,
            bottom: 90,
            right: 40,
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
                fontSize: 26,
                fontWeight: 400
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
                fontWeight: 400,
                fontSize: 26,
                nameGap: 80
              },
              padding: [0, 20]
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
                shadowBlur: 30,
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
                  shadowBlur: 20,
                  shadowOffsetX: 0,
                  shadowOffsetY: 4,
                },
              }
            },
            barWidth: '10%',
            // data: seriesDataB
          }
          ]
        }
        let container = document.getElementById('pieBox3');
        let echartDom = echarts.init(container, null, {renderer: 'svg'});
        echartDom.setOption(option);
        // 窗口变化，重绘图像
        window.addEventListener('resize', function () {
          echartDom.resize();
        }, false)
      },
      getSubOrdinateEntityDistribution() {
        getSubOrdinateEntityDistribution().then(r => {
          r.data.MEDI = [
            {areaCode: "5101100003", total: 108, areaName: "华阳街道"},
            {areaCode: "5101100106", total: 84, areaName: "籍田街道"},
            {areaCode: "5101100120", total: 69, areaName: "新兴街道"},
            {areaCode: "5101100110", total: 58, areaName: "煎茶街道"},
            {areaCode: "5101100102", total: 55, areaName: "永兴街道"},
            {areaCode: "5101100122", total: 49, areaName: "万安街道"},
            {areaCode: "5101100101", total: 42, areaName: "太平街道"},
            {areaCode: "5101100123", total: 31, areaName: "白沙街道"},
            {areaCode: "5101100125", total: 15, areaName: "合江街道"},
            {areaCode: "5101100107", total: 14, areaName: "正兴街道"},
            {areaCode: "5101100109", total: 12, areaName: "大林街道"},
            {areaCode: "5101100121", total: 5, areaName: "兴隆街道"},
            {areaCode: "5101100124", total: 0, areaName: "三星街道"}
          ]
          r.data.MEDIDEV = [
            {areaCode: "5101100003", total: 194, areaName: "华阳街道"},
            {areaCode: "5101100106", total: 162, areaName: "籍田街道"},
            {areaCode: "5101100120", total: 93, areaName: "新兴街道"},
            {areaCode: "5101100110", total: 90, areaName: "煎茶街道"},
            {areaCode: "5101100102", total: 82, areaName: "永兴街道"},
            {areaCode: "5101100122", total: 56, areaName: "万安街道"},
            {areaCode: "5101100123", total: 40, areaName: "白沙街道"},
            {areaCode: "5101100101", total: 37, areaName: "太平街道"},
            {areaCode: "5101100125", total: 15, areaName: "合江街道"},
            {areaCode: "5101100107", total: 7, areaName: "正兴街道"},
            {areaCode: "5101100109", total: 20, areaName: "大林街道"},
            {areaCode: "5101100124", total: 16, areaName: "三星街道"},
            {areaCode: "5101100121", total: 4, areaName: "兴隆街道"}
          ]
          // r.data.maxTotal += 1358;
          // r.data.totalMap = [
          //   {areaCode: "5101100003", total: 939, areaName: "华阳街道"},
          //   {areaCode: "5101100106", total: 135, areaName: "籍田街道"},
          //   {areaCode: "5101100120", total: 105, areaName: "新兴街道"},
          //   {areaCode: "5101100110", total: 91, areaName: "煎茶街道"},
          //   {areaCode: "5101100102", total: 61, areaName: "永兴街道"},
          //   {areaCode: "5101100122", total: 48, areaName: "万安街道"},
          //   {areaCode: "5101100101", total: 47, areaName: "太平街道"},
          //   {areaCode: "5101100123", total: 30, areaName: "白沙街道"},
          //   {areaCode: "5101100107", total: 27, areaName: "正兴街道"},
          //   {areaCode: "5101100125", total: 25, areaName: "合江街道"}
          // ]
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
    background: url("~@/assets/img/subjectData/oneplus/viceBG.png") no-repeat;
    background-size: 100% 100%;
    position: relative;
  }
  .headBox{
    .headLeft{
      width: 30*2px;
      position: absolute;
      top: 49*2px;
      left: 27*2px;
      p{
        font-size:36px;
        font-weight:400;
        color: #eee;
        text-align:center;
        margin-right: 30px;
      }
    }
    .headRight{
      width: 85*2px;
      position: absolute;
      top: 10*2px;
      right: 20*2px;
      .typeBtn{
        width: 80*2px;
        height: 30*2px;
        background: #182D52;
        border: 1*2px solid #214B92;
        border-radius: 2*2px;
        color: #eee;
        font-size:28px;
        font-weight: 400;
        margin-bottom: 15*2px;
        cursor: pointer;
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
    top: 30*2px;
    left: -30*2px;
  }
</style>