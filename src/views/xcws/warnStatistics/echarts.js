import echarts from "echarts";
// 线图
export function echartsLine(data, id) {

    let myChart = echarts.init(document.getElementById(id));
    myChart.clear()

    let option = {
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                let text = '<p  style="font-size:14px;font-weight: 400;color:rgba(255, 255, 255, 1);margin-bottom: 20px;"><span style="display:inline-block;width:10px;height: 10px;background: ' + data.line + ';border-radius: 50%;margin-right: 10px;"></span>' + params[0].name.split('-')[0] + '年' + params[0].name.split('-')[1] + '月' + '</p>';
                text += '<p style="line-height:20px;color:rgba(255, 255, 255, 1);font-size:14px;"><span>' + params[0].seriesName + ': </span><span style="float: right">' + params[0].value + '个</span></p>'
                return text
            },
            backgroundColor: 'rgba(17, 34, 40,0.6)        ',
            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
            textStyle: {
                color: '#606871'
            },
            padding: 15,
            axisPointer: {
                type: 'line',
                label: {
                    backgroundColor: '#FFFFFF',
                    color: '#606871'
                },
                lineStyle: {
                    color: 'rgba(50, 65, 70,1)'
                }
            }
        },
        grid: {
            top: '7%',
            left: '10%',
            right: '4%',
            bottom: '10%',
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: 'rgba(101, 119, 123, 1)'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#CCCCCC'
            },
            data: data.xData
        }],

        yAxis: [{
            axisTick: {
                show: false
            },

            type: 'value',
            axisLine: {
                show: false,
            },
            axisLabel: {
                color: '#CCCCCC'
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(50, 65, 70, 1)',
                    type: 'dashed'
                }
            },
        }, ],
        series: [{
            name: data.seriesName,
            type: 'line',
            smooth: true,
            itemStyle: {
                color: data.line
            },
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(11, 74, 94, 0)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(16, 121, 155, 0.1)'
                        }
                    ], false),
                }
            },
            data: data.data
        }]
    };
    myChart.setOption(option);
    // 窗口变化，重绘图像
    window.addEventListener('resize', function () {
        myChart.resize();
    }, false)
}
//饼图
export function echartsPie(total,scaleData, id,callback) {

    let myChart = echarts.init(document.getElementById(id));
    myChart.clear()
    // let scaleData = [{
    //         'name': '健康证过期',
    //         'value': 10,
    //         'url':'/#/xcwsWarn/healthCert'
    //     },
    //     {
    //         'name': '检查不合格',
    //         'value': 19,
    //     },
    //     {
    //         'name': '未陪餐',
    //         'value': 35,
            
    //     },
    //     {
    //         'name': '投诉举报',
    //         'value': 29
    //     },
    //     {
    //         'name': '疑是过期食品',
    //         'value': 48,
    //         'url':'/#/xcwsWarn/food'
    //     },
    //     {
    //         'name': '溯源异常',
    //         'value': 22,
    //         'url':'/#/xcwsWarn/healthCert'
    //     }, {
    //         'name': '许可证过期',
    //         'value': 15,
    //         'url':'/#/xcwsWarn/trace'
    //     },
    //     {
    //         'name': '后厨管理不规范',
    //         'value': 22
    //     },
    // ];
    let rich = {
        white: {
            color: '#ddd',
            align: 'center',
            padding: [3, 0]
        }
    };
    let placeHolderStyle = {
        normal: {
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            color: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 0
        }
    };
    let data = [];
    let color = ['#B44F50', '#BE8DAD', '#585FC2', '#1E59B9', '#2CABC7', '#34C793', '#FCE233', '#C56737']
    for (let i = 0; i < scaleData.length; i++) {
        data.push({
            value: scaleData[i].value,
            name: scaleData[i].name,
            url:scaleData[i].url,
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowBlur: 20,
                    borderColor: color[i],
                    shadowColor: color[i]
                }
            }
        }, {
            value: total/30,
            name: '',
            itemStyle: placeHolderStyle
        });
    }
    let seriesObj = [{
        name: '',
        type: 'pie',
        clockWise: false,
        radius: [105, 110],
        hoverAnimation: false,
        itemStyle: {
            normal: {
                label: {
                    show: true,
                    position: 'outside',
                    color: '#ddd',
                    formatter: function (params) {
                        let percent = 0;
                        percent = ((params.value / total) * 100).toFixed(2);
                        if (params.name !== '') {
                            if(params.value){
                                 return params.value+'（' +  percent + '%）' + '\n{white|}' + params.name ;
                            }
                            // else{
                            //     return '暂无数据' + '\n{white|}' + params.name ;
                            // }
                        } else {
                            return '';
                        }
                    },
                    rich: rich
                },
                labelLine: {
                    length: 25,
                    length2:15,
                    show: true,
                    color: '#00ffff'
                }
            }
        },
        data: data
    }];
    let option = {
        title: [{
            text: '风险总数',
            left: 'center',
            top: 167,
            textStyle: {
                color: '#FFFFFF',
                fontWeight: 400,
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16
            }
        },{
            text: total,
            left: 'center',
            top: 202,
            textStyle: {
                color: '#FCE233',
                fontWeight: 400,
                fontFamily: 'zcool-gdh',
                fontSize: 30
            }
        }],
        tooltip: {
            show: false
        },
        legend: {
            show: false
        },
        toolbox: {
            show: false
        },
        grid: {
            top: 'middle',
            left: 'middle',
            right: 'middle',
            bottom: 'middle',
        },
        series: seriesObj
    }

    myChart.setOption(option);
    // 窗口变化，重绘图像
    myChart.on('click', function (params) {
        callback(params.data)
    });
    window.addEventListener('resize', function () {
        myChart.resize();
    }, false)
}