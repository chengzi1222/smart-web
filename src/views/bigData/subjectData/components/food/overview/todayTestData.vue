<template>
  <div class="box">
    <h3>检测数据</h3>
    <ul class="dataBox">
        <li  v-for="(item,index) in databox" :key="item+index">
            <p>{{item.name}}</p>
            <p class="pB">{{item.num}}</p>
        </li>
    </ul>
    <div id="echartsBox"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
  export default {
    components: {
      
    },
    data() {
      return {
          databox:[
              {name:"今日检测批次",num:'5742'},
              {name:"今日检测品种",num:'131'},
              {name:"今日检测商家",num:'207'},
              {name:"今日合格率",num:"97.1%"},
          ],
          echarts:{
            lineLfetMaxNum:6000,
            line_xAxisData:["04.11","04.16","04.21","04.26","05.01","05.06"],
            line_seriesData:[{
                name:'检测批次',
                type:'line',
                data:[3720,4160,4922,3958,4599,4236]
                },{
                name:'合格率',
                type:'line',
                yAxisIndex:1,
                data:[95,95.5,97,96,98,98.5]
                }]
           }
      }
    },
    mounted() {
        this.line()
    },
    beforeDestroy() {
    },
    methods: {
        line(){
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                color:["#58aa66" ,"#e3bf42"],
                // legend: {
                //     data:['检测次数','占总比']
                // },
                grid: {
                    top:'10%',
                    bottom: '10%',
                },
                xAxis: [
                    {
                        type: 'category',
                        data:this.echarts.line_xAxisData,
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#0DB5EF'
                            }
                        },
                        axisLabel:{
                            color:'#fff'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '',
                        min: 0,
                        max: this.echarts.lineLfetMaxNum,
                        interval:this.echarts.lineLfetMaxNum/5,
                        axisLabel: {
                            formatter: '{value}'
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#0DB5EF'
                            }
                        },
                        axisLabel:{
                            color:'#fff'
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    {
                    type: 'value',
                    name: '',
                    min: 0,
                    max: 100,
                    interval:20,
                    axisLabel: {
                        formatter: '{value}%'
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#0DB5EF'
                        }
                    },
                    splitLine: {
                        show: false
                    }
                }
                ],
                series: this.echarts.line_seriesData
            };
             var myChart;
            var container = document.getElementById("echartsBox");
            myChart = echarts.init(container);
            myChart.setOption(option);
            window.addEventListener('resize',function(){
                myChart.resize();
            },false);
        }
    }
  }
</script>
<style lang='scss' scoped>
  .box{
    background: url('~assets/img/subjectData/screen2bg.png');
    background-size:100% 100%; 
    height: 100%;
    h3{
      font-weight: normal;
      color: #eee;
      font-size: 20px;
      padding-top: 10px;
      margin-left: calc(17%);
      margin-bottom: 38px;
    }
    .dataBox{
        width:calc(100% - 40px);
        height: 90px;
        display: flex;
        justify-content: space-between;
        padding:0 20px; 
        margin-bottom: 6px;
        >li{
            width: 90px;
            height: 100%;
            background:linear-gradient(0deg,rgba(17,45,74,0.6),rgba(32,75,102,0.6));
            text-align: center;
            p{
                color: #ffffff;
                font-size:12px;
                margin-top: 20px;
            }
            .pB{
                margin-top: 10;
                font-size:20px;
                color:rgba(13,181,239,1);
            }
        }
    }
    #echartsBox{
        width: 100%;
        height: 300px;
    }
  }
</style>