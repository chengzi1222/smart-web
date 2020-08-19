<template>
  <div style="height:100%;background: #050C17;overflow: hidden;">
    <div class="bigBox">
      <div class="headBox">
        <div class="headLeft">
          <p>主体类型分布</p>
          <img src="../../../../../assets/img/subjectData/titleLine.png" alt="">
        </div>
        <div class="headRight">
          <button class="typeBtn" v-for="(item,index) in butTypes" :key="index" :class="choose == index ? 'current':''" @click="chooseChange(index)">
            {{item.name}}
          </button>
        </div>
      </div>
      <div class="pieBox">
        <div id="pieBox" style="height:100%;"></div>
        <div class="centerBox">
          <h4>主体总数</h4>
          <p>{{total[choose]}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { getSubjectDistribution } from 'api/bigData/subjectData'
  export default {
    data() {
      return {
        butTypes: [{
          name: '主体类型',
          type: 'ALL'
        },{
          name: '其它主体',
          type: 'CFDA'
        },{
          name: '风险等级',
          type: 'RISK_LEVEL'
        },{
          name: '量化等级',
          type: 'QUANTIFY_LEVEL'
        }],
        choose: 0,
        colors: ['#fa9a2a', '#0db5ef', '#eabe0d', '#764dfd', '#567dad'],  //饼图颜色
        datas: [],//饼图所有数据
        total: [],
        intev: null,
        butTypes_index: 0
      }
    },
    mounted() {
      this.getSubjectDistribution()
      let _this = this
      this.intev = setInterval(() => {
        _this.choose++;
        if (_this.choose >= _this.butTypes.length) {
          _this.choose = 0;
          _this.echart()
        }else if (_this.datas.length == _this.butTypes.length) {
          _this.echart()
        } else {
          _this.getSubjectDistribution()
        }
      }, 10000);
    },
    methods: {
      chooseChange(index){
        this.choose = index;
        let _this = this
        clearInterval(this.intev);
        if (this.datas.length == this.butTypes.length) {
          this.echart()
        }
        this.intev = setInterval(() => {
          _this.choose++;
          if (_this.choose >= _this.butTypes.length) {
            _this.choose = 0;
            _this.echart()
          } else if (_this.datas.length == _this.butTypes.length) {
            _this.echart()
          }
        }, 10000);
      },
      echart () {
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
            value: _this.total[_this.choose]*0.01,
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
          radius: ['50%', '50%'],
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
        },{
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
                fontSize: 30,
                fontWeight: 100,
                padding: [0, 20],
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
                    padding: [4, 0]
                  }
                }
              },
              labelLine: {
                length: 50,
                length2: 140,
                show: true,
                lineStyle: {
                  width: 4
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
        let container = document.getElementById('pieBox');
        let echartDom = echarts.init(container);
        echartDom.setOption(option);
        // 窗口变化，重绘图像
        window.addEventListener('resize', function () {
          echartDom.resize();
        }, false)
      },
      getSubjectDistribution() {
        getSubjectDistribution({ 'type': this.butTypes[this.butTypes_index].type }).then(r => {
          if (r.status) {
            this.total.push(r.data.total);
            if (r.data.list[3].type == 'CFDA') {
              r.data.list[3].type = '其他主体'
            }
            this.datas.push(r.data.list)
            if (this.butTypes_index == 0 ) {
              this.echart();
            }
            this.butTypes_index++;
            if (this.butTypes_index == this.butTypes.length) {
              return
            } else{
              this.getSubjectDistribution()
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="sass">
  button{
    outline:0 none;
  }
  .bigBox{
    background:rgba(24,34,52,.2);
    border:1px solid rgba(53,122,162,.2);
    height: calc(100% - 80px);
    margin: 40px;
    box-sizing: border-box;
  }
  .headBox{
    padding: 60px;
    overflow: hidden;
    .headLeft{
      float: left;
      min-width: 326px;
      width: 652px;
      p{
        font-size:40px;
        font-weight:400;
        color: #eee;
        margin-left: 100px;
      }
      img{
        width: 652px;
      }
    }
    .headRight{
      float: right;
      min-width: 55%;
      text-align: right;
      width: 55%;
      .typeBtn{
        width: 160px;
        height: 60px;
        background: #182D52;
        border: 1px solid #214B92;
        border-radius: 2px;
        color: #eee;
        font-size:20px;
        margin-right: 30px;
      }
      .typeBtn:last-child{
        margin-right: 0;
      }
      .current{
        background: linear-gradient(to right, #0DB5EF, #0775BA);
      }
    }
  }
  .pieBox{
    width: 100%;
    height: calc(100% - 202px);
    position: relative;
    .centerBox{
      width: 22.82%;
      height: 52.63%;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: calc(-11.41%);
      margin-top: calc(-11.5%);
      text-align: center;
      padding: 150px 0;
      box-sizing: border-box;
      color: #EEEEEE;
      h4{
        font-size:30px;
        font-weight: normal;
      }
      p{
        margin-top: 15px;
        font-size:60px;
      }
    }
  }
</style>