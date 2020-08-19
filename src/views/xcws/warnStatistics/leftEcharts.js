import echarts from "echarts";
import {getMapping} from '../mapping';
import * as $ from "static/dhplayer/js/jquery-1.11.3.min.js"

// 左上饼图 --- 主体概况
export function echartsDoughnut(data, id) {
    let myChart = echarts.init(document.getElementById(id));
    myChart.clear()
    let dataArr = [];
    let count = 0;
    if(id==='subType') {
        dataArr = data.edList;
        count = data.count.toString();
    } else {
        let obj = data.riskMap;
        Object.keys(obj).map((el) => {
            let dataArrItem = {'name': el, 'value': obj[el]};
            dataArr.push(dataArrItem);
        });
        count = data.totalRiskNum.toString();
    }
    // 主体类型分布--配置
    let dataSubType = [];
    let legendDataSubType = [];
    let colorSubType = ['#00ffff','#00cfff','#006ced','#ffe000','#ffa800','#ff5b00','#ff3000','#52e9b2','#9bea45','#626afd','#f29ece','#cc3be2','#2ed283', '#70CE97'];
    dataArr.forEach((e, i)=>{
        let name = getMapping().type[e.buyerType]
        legendDataSubType.push(name);
        dataSubType.push({
            value: e.num,
            name: name,
            itemStyle: {
                borderWidth: 5,
                shadowBlur: 20,
                borderColor: colorSubType[i],
                shadowColor: colorSubType[i]
            }
        }, {
            value: count/30,
            name: '',
            itemStyle: {
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
            }
        });
    });
    let optionSubType = {
        title: [{
            text: '主体总数',
            left: 'center',
            top: 137, //107
            textStyle: {
                color: '#FFFFFF',
                fontWeight: 400,
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16
            }
        },{
            text: count,
            left: 'center',
            top: 172, //142
            textStyle: {
                color: '#00EAFF',
                fontWeight: 400,
                fontFamily: 'zcool-gdh',
                fontSize: 30
            }
        }],
        color: colorSubType,
        series: [
            {
                name:'主体类型',
                type:'pie',
                radius: [105, 110],
                avoidLabelOverlap: true, // 是否启用防止标签重叠策略
                hoverAnimation: false,
                startAngle: 30,
                label: {
                    show: true,
                    position: 'outside',
                    formatter: function(params) {
                        var result = '';
                        if(params.name) {
                            result += params.name + "\n{white|" + params.value + " " + "(" + Math.round(params.value/count * 10000) / 100 + "%)}";
                        }
                        return result;
                    },
                    textStyle: {
                        color: '#FFFFFF',
                        fontWeight: 400,
                        fontSize: 12
                    },
                    rich: {
                        white: {
                            color: '#ddd',
                            align: 'center',
                            padding: [3, 0]
                        }
                    }
                },
                labelLine: {
                    length: 25,
                    length2: 15,
                    show: true,
                    color:'#00ffff'
                },
                data: dataSubType
            }
        ]
    };
    // 风险等级分布--配置
    let dataRisk = [];
    let legendDataRisk = [];
    let colorRisk = ['#2ed283', '#5AB4C4','#E3D261', '#CE5E55'];
    dataArr.forEach((e, i)=>{
        let name = getMapping().risk[e.name];
        legendDataRisk.push(name);
        dataRisk.push({
            value: e.value,
            name: name,
            itemStyle: {
                borderWidth: 5,
                shadowBlur: 20,
                borderColor: colorRisk[i],
                shadowColor: colorRisk[i]
            },
        },{
            value: count/30,
            name: '',
            itemStyle: {
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
            }
        });
    });
    let optionRisk = {
        color: colorRisk,
        series: [
            {
                name:'风险等级',
                type:'pie',
                radius: [80, 110], // [50,100]
                avoidLabelOverlap: true, // 是否启用防止标签重叠策略
                hoverAnimation: false,
                startAngle: 150,
                label: {
                    show: true,
                    position: 'outside',
                    formatter: function(params) {
                        var result = '';
                        if(params.name) {
                            result += params.name + "\n{white|" + params.value + " " + "(" + Math.round(params.value/count * 10000) / 100 + "%)}";
                        }
                        return result;
                    },
                    textStyle: {
                        color: '#FFFFFF',
                        fontWeight: 400,
                        fontSize: 12
                    },
                    rich: {
                        white: {
                            color: '#ddd',
                            align: 'center',
                            padding: [3, 0]
                        }
                    }
                },
                labelLine: {
                    length: 25,
                    length2: 15,
                    show: true,
                    color:'#00ffff'
                },
                data: dataRisk
            }
        ]
    };
    myChart.setOption(id === 'subType'? optionSubType : optionRisk);
    
    // 窗口变化，重绘图像
    window.addEventListener('resize', function () {
        myChart.resize();
    }, false)
}


// 左下柱状图 --- 考核排名
export function echartsBar(data, id) {
    let myChart = echarts.init(document.getElementById(id));
    myChart.clear()
    // y轴标签最大能显示的长度(文字个数), 其余隐藏
    const LIMIT = 5;
    // 辖区考核排名--配置
    let source = [];
    if(id === 'areaAssess') {
        Object.keys(data).map((el) => {
            let sourceItem = [parseFloat(data[el].score).toFixed(2), data[el].areaName];
            source.push(sourceItem);
        });
        source.reverse(); // 倒序
        source = source.slice(0,8); // 取前8
        source.reverse(); // 倒序
        source.unshift(['score','areaName']);
    } else {
        let sourceBuyerName = [];
        let sourceScore = [];
        Object.keys(data).map((el) => {
            let sourceBuyerNameItem = data[el].buyerName;
            sourceBuyerName.push(sourceBuyerNameItem);
            let sourceScoreItem =  parseFloat(data[el].score).toFixed(2);
            sourceScore.push(sourceScoreItem);
        });
        sourceBuyerName.reverse();
        sourceScore.reverse();
        source = [sourceBuyerName, sourceScore];
    }
   
    let optionAreaAssess = {
        dataset: {
            source: source
        },
        grid: {
            top: 30,
            left: 20,
            bottom: 50,
            right: 80,
            containLabel: true
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
                position: 'right',
                distance: 10,
                formatter: function(params) {
                    return params.data[0] + '分'
                }
            },
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: "#112426",
                    }, {
                        offset: 1,
                        color: "#31A1AF"
                    }], false),
                    barBorderRadius: 6
                }        
            }
        }
    };
    // 主体风险排名
    let yAxisData = source[0];
    let subRiskData = source[1];
    let yIndex = [];
    subRiskData.forEach((e,index)=> {
        yIndex.push(index)
    })
    let optionSubRisk = {
        grid: {
            top: 30,
            left: 20,
            bottom: 50,
            right: 70,
            containLabel: true
        },
        xAxis: {
            max: 100,
            show: false
        },
        yAxis: [{
            // 辅助系列
            type: 'category',
            position: 'left',
            data: yIndex,
            axisLine: {
                show: false
            },
            axisTick:{
                show: false
            },
            axisLabel:{
                show:false
            }
        },{
            type: 'category',
            position: 'left',
            data: yAxisData,
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
                margin: 20,					//---刻度标签与轴线之间的距离
                formatter: function(params) {
                    return (params.length > LIMIT ? (params.slice(0,LIMIT)+"...") : params );
                }
            }
        }],
        textStyle:{
            color:'#FFFFFF',
            fontWeight: 400,
            fontSize: 12
        },
        series: [{
                type: 'bar',
                data: subRiskData,
                encode: {
                    x: 'score',
                    y: 'street'
                },
                barWidth: 14,
                barGap: 30,
                label: {
                    show: true,
                    position: ['380', 0],
                    formatter: function(params) {
                        return parseFloat(params.data).toFixed(2) + '分'
                    }
                },
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: "#181707",
                    }, {
                        offset: 1,
                        color: "#EED42A"
                    }], false),
                    barBorderRadius: 6
                }
            },{
                // 辅助系列
                type: 'bar',
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        color: '#1B2327',
                        opacity: 0.5,
                        barBorderRadius: 6
                    }
                },
                barWidth: 14,
                barGap: 30,
                data: subRiskData.map(function (val) {
                    return 100;
                })
            }]
    };
    // 鼠标移入yAxis文本时, 如文本过长已部分隐藏, 则在旁边显示
    extension(myChart);
    function extension(mychart) {
        //判断是否创建过div框,如果创建过就不再创建了
        let idTemp = document.getElementById("extension");
        let div = "<div id = \"extension\" style=\"display:none\"></div>"
        if(idTemp) {
          $('#extension').remove();
        } 
        $('#'+id).append(div);

        mychart.on('mouseover', function(params) {
            if(params.componentType == "yAxis") {
                if(params.value.length <= LIMIT) return;
                $('#extension').css({
                    "position": "absolute",
                    "color": "#FFFFFF",
                    "background-color": "#333333",
                    "border-radius": "4px",
                    "opacity": "0.7",
                    "font-size": "12px",
                    "padding": "5px",
                    "z-index": 999,
                    "display": "block",
                    "top": params.event.event.layerY,
                    "left": params.event.event.layerX + 50
                }).text(params.value);
            }
        });
        // 鼠标移除yAxis范围时, 隐藏文本
        mychart.on('mouseout', function(params) {
            if(params.componentType == "yAxis") {
                $('#extension').css('display', 'none');
            }
        });
    }

    myChart.setOption(id === 'areaAssess'? optionAreaAssess : optionSubRisk);
    // 窗口变化，重绘图像
    window.addEventListener('resize', function () {
        myChart.resize();
    }, false)
}