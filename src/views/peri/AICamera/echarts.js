import echarts from "echarts";

// 雷达图
export function echartsRadar(data,value, id) {

    let myChart = echarts.init(document.getElementById(id));
    myChart.clear()
    let option ={
        tooltip: {
            trigger: 'axis'
        },
        radar: {
            indicator: data,
            radius: 70,
            splitNumber: 4,
            axisLine: { //指向外圈文本的分隔线样式
                lineStyle: {
                    color: '#2c353d'
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#2c353d'],
                    width: 2
                }
            },
            splitArea: {
                areaStyle: {
                    color: ['transparent']
                }
            },
            name: {
                padding:0,
                color: '#fff',
                formatter: function (value, indicator) {
                    let text  = indicator.num > 10?'{green|' + indicator.num + "分" + '}\n{a|' + value + '}':'{yellow|' + indicator.num + "分" + '}\n{a|' + value + '}'
                    return text

                },
                lineHeight: 20,
                rich: {
                    a: {
                        color: '#7C8892',
                        fontSize: 12,
                        align: 'center'
                    },
                    yellow:{
                        color: '#FFDC00',
                        fontSize: 14,
                        align: 'center'
                    },
                    green:{
                        color: '#7FE17D',
                        fontSize: 14,
                        align: 'center'
                    }
                }
            },
        },
        series: [{
            type: 'radar',
            tooltip: {
                trigger: 'item'
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#096e32',
                    borderColor: '#46ff91'
                }
            },
            areaStyle:{
                color:['#096e32'],
                opacity:0.4
            },
            data: [{
                value
            }]
        },]
    };
    myChart.setOption(option);
    // 窗口变化，重绘图像
    window.addEventListener('resize', function () {
        myChart.resize();
    }, false)
}
