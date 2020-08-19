import echarts from "echarts";
import * as $ from "static/dhplayer/js/jquery-1.11.3.min.js"
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
export function echartsBar(data, id) {
    let myChart = echarts.init(document.getElementById(id));
    myChart.clear()
    // y轴标签最大能显示的长度(文字个数), 其余隐藏
    const LIMIT = 10;
    // 辖区考核排名--配置
    let source = [];
        Object.keys(data).map((el) => {
            let sourceItem = [data[el].treatedNum, data[el].areaName];
            source.push(sourceItem);
        });
        source.reverse(); // 倒序
        source = source.slice(0,8); // 取前8
        source.reverse(); // 倒序
        source.unshift(['score','areaName']);
    
    let optionAreaAssess = {
        dataset: {
            source: source
        },
        grid: {
            top: 30,
            left: 45,
            bottom: 50,
            right: 80,
            containLabel: true,
        },
        xAxis: {
            show: false,
        },
        yAxis: {
            type: 'category',
            triggerEvent: true,
            axisLine: {
                show: false
            },
            axisTick:{
                show: false
            },
            axisLabel:{					//---坐标轴 标签
                show:true,					//---是否显示
                inside:false,				//---是否朝内
                rotate:0,					//---旋转角度	
                margin: 20,					//---刻度标签与轴线之间的距离
                formatter: function(params) {
                    return (params.length > LIMIT ? (params.slice(0,LIMIT)+"...") : params );
                }
               
            }
        },
        barWidth: 14,
        barGap: 30,
        textStyle:{
            color:'#FFFFFF',
            fontWeight: 400,
            fontSize: 12
        },
        series: {
            type: 'bar',
            encode: {
                x: 'score',
                y: 'areaName'
            },
            barWidth: 14,
            barGap: 30,
            label: {
                show: true,
                position: ['320', 0],
                distance: 10,
                formatter: function(params) {
                    return params.data[0] + '个'
                }
            },
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: "#1B5A60",
                    }, {
                        offset: 1,
                        color: "#20EAD5"
                    }], false),
                    barBorderRadius: 6
                }        
            }
        }
    };
    // 鼠标移入yAxis文本时, 如文本过长已部分隐藏, 则在旁边显示
    extension(myChart);
    function extension(mychart) {
        
        mychart.on('mouseover', function(params) {
            console.log(params)
            if(params.componentType == "yAxis") {
                if($('#extension-'+id)) {
                    $('#extension-'+id).remove();
                  } 
                
                let tooltip=$("<div id = \"extension-"+id+"\" style=\"display:none\"></div>").css({
                    "position": "absolute",
                    "color": "#FFFFFF",
                    "background-color": "#333333",
                    "border-radius": "4px",
                    "opacity": "0.7",
                    "font-size": "12px",
                    "padding": "5px",
                    "z-index": 999,
                    "display": "block",
                    "top": params.event.offsetY,
                    "left": params.event.offsetX + 50
                }).text(params.value);
                $('#'+id).append(tooltip);
            }
        });
        // 鼠标移除yAxis范围时, 隐藏文本
        mychart.on('mouseout', function(params) {
            if(params.componentType == "yAxis") {
                $("#extension-"+id).remove();
            }
        });
    }

    myChart.setOption(optionAreaAssess );
    // 窗口变化，重绘图像
    window.addEventListener('resize', function () {
        myChart.resize();
    }, false)
}