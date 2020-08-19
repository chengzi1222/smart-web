<template>
  <div class="box">
    <h3>本月账单汇总</h3>
    <div style="position:relative">
      <div class="centerBox">
        <h4>品种数量</h4>
        <p>{{total}}</p>
      </div>
      <div id="pieEchartsBox"></div>
      <div class="legendDiv">
        <span v-for="(item,index) in datas"><b :style="{background: colors[index]}"></b>{{item.typeName}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts';
  import { postDetail } from "api/trace/bill.js"

  export default {
    props: {
      schoolCode: {
        default: function () {
          return ''
        }
      },
      schoolName: {
        default: function () {
          return ''
        }
      }
    },
    watch: {
      schoolCode: function(){
        this.postDetail()
      }
    },
    data() {
      return {
        colors: ['#ff5b00', '#ffa800', '#f5d705', '#137cff', '#00cfff', '#65d6a2', '#764cfd','#d3f864', '#f96b8d'],  //饼图颜色
        total: 0,
        datas:[],
      }
    },
    mounted() {
      setTimeout(() => {
        this.postDetail()
      }, 0);
    },
    methods: {
      echart() {
        let data = [];
        let _piedatas = this.datas;
        let _this = this;
        let total = 0;
        for (let i = 0; i < _piedatas.length && _piedatas.length>0; i++) {
          total += _piedatas[i].price
        }
        for (let i = 0; i < _piedatas.length; i++) {
          data.push({
            value: _piedatas[i].price,
            name: _piedatas[i].typeName,
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
              value: total * 0.02,
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
          radius: ['22%', '22%'],
          center: ['50%', '35%'],
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
          radius: ['28%', '33%'],
          center: ['50%', '35%'],
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
                    total += _piedatas[i].price;
                  }
                  percent = ((params.value / total) * 100).toFixed(2);
                  if (params.name !== '') {
                    return params.name + ' ' + params.value + ' (' + percent + '%)';
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
            show: false,
          },
          toolbox: {
            show: false
          },
          series: seriesObj
        }
        let container = document.getElementById('pieEchartsBox');
        let echartDom = echarts.init(container);
        echartDom.clear();
        echartDom.setOption(option);
        // 窗口变化，重绘图像
        window.addEventListener('resize', function () {
          echartDom.resize();
        }, false)
      },
      postDetail() {
        let dates = new Date();
        let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        let transferData = dates.getFullYear() + "-" + mon;
        let form = new FormData();
        form.append('guid', this.schoolCode);
        form.append('date', transferData);
        form.append('areaId', '5101');
        form.append('buyerName', this.schoolName);
        postDetail(form).then(r => {
          this.total = r.data.order.pdtNum;
          this.$emit('rankNum', r.data.order.pdtNum, r.data.order.amount)
          this.datas = r.data.bChart;
          this.echart()
        })
      }
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
    #pieEchartsBox {
      width: 100%;
      height: 850px;
    }
    .centerBox{
      width: 22.82%;
      height: 33.63%;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: calc(-11.41%);
      margin-top: calc(-28.5%);
      text-align: center;
      padding: 100px 0;
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
    .legendDiv{
      display: flex;
      position: absolute;
      width: 100%;
      flex-wrap: wrap;
      bottom: 40px;
      padding-left: 100px;
      span{
        display: inline-block;
        width: 30%;
        height: 80px;
        font-size: 24px;
        color: #fff;
        line-height: 80px;
      }
      b{
        display: inline-block;
        width: 40px;
        height: 20px;
        border-radius: 10px;
        margin-right: 20px;
      }
    }
  }
</style>