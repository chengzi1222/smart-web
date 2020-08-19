import echarts from "echarts";

let myChart
function draw(){

    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter:'{b} <br/>{a}: {c}%'
        },
        grid: {
            left: '0%',
            right: '10%',
            bottom: '0%',
            containLabel: true
        },
        dataZoom: {
            startValue:0,
            start:100,
            end: 50,
            minSpan:10,
            // zoomLock:true,
            type: 'slider',
            yAxisIndex: 0,
            filterMode: 'empty',
            backgroundColor:"transparent",
            showDataShadow:false,
        },
        color:["#0DB5EF"],
        xAxis: {
            max:100,
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            // 这里与坐标轴是反的
            data: [...this.patrolTimesName].reverse(),
            axisLabel : {//坐标轴刻度标签的相关设置。
                interval:0,  
                rotate:0,//倾斜度 -90 至 90 默认为0  
                margin:2, 
                formatter : function(params){
                   var newParamsName = "";// 最终拼接成的字符串
                      var paramsNameNumber = params.length;// 实际标签的个数
                      var provideNumber = 6;// 每行能显示的字的个数
                      var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
                      /**
                       * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                       */
                      // 条件等同于rowNumber>1
                      if (paramsNameNumber > provideNumber) {
                          /** 循环每一行,p表示行 */
                          for (var p = 0; p < rowNumber; p++) {
                              var tempStr = "";// 表示每一次截取的字符串
                              var start = p * provideNumber;// 开始截取的位置
                              var end = start + provideNumber;// 结束截取的位置
                              // 此处特殊处理最后一行的索引值
                              if (p == rowNumber - 1) {
                                  // 最后一次不换行
                                  tempStr = params.substring(start, paramsNameNumber);
                              } else {
                                  // 每一次拼接字符串并换行
                                  tempStr = params.substring(start, end) + "\n";
                              }
                              newParamsName += tempStr;// 最终拼成的字符串
                          }

                      } else {
                          // 将旧标签的值赋给新标签
                          newParamsName = params;
                      }
                      //将最终的字符串返回
                      return newParamsName
                }
            }
        },
        series: [
            {   barWidth: '20px',
                name: '覆盖率',
                type: 'bar',
                data: [...this.patrolTimesValue].reverse()
            }
        ]
    };
   
    myChart = echarts.init(document.getElementById("range"));
    myChart.clear()
    myChart.setOption(option);

    // 窗口变化，重绘图像
    window.addEventListener('resize',function(){
        myChart.resize();
    },false)
}


export default draw
