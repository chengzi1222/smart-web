import echarts from "echarts";
    
function cal(i, length, item) {
    if(length<30){
        item=3000
    }else  if(length<50){
        item=2500
    }else  if(length<50){
        item=5000
    }
    let curveness = 0;
    if (length === 1) {
        curveness = 0;
    } else if (i < length / 2) {
        curveness = -item * (i + 1);
    } else if (i * 1.0 === parseInt(length / 2)) {
        curveness = 0;
    } else {
        curveness = item * (length - i);
    }
    return curveness;
}
function calX(i, length, x, item) {
    let curveness = 0;
    if (length === 1) {
        curveness = x;
    } else if (i < length / 2) {
        curveness = x+item * (i + 1);
    } else if (i * 1.0 === parseInt(length / 2)) {
        curveness = x;
    } else {
        curveness = x+item * (length - i);
    }
    return curveness;
}
function getRandomNum(Min, Max) {
    let Range = Max - Min;
    let Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}
let categories=[{
        name: '供货商',
        itemStyle: {
            normal: {
                color:"#66D6A2"
            }
        },
        symbol: 'circle',
    }, {
        name: '配送商',
        itemStyle: {
            normal: {
                color: "#FFCF69"  }
        },
        symbol: 'circle',
    }, {
        name: '采购商',
        itemStyle: {
            normal: {
                color:"#0DB5EF",
            }
        },
        symbol: 'circle',
    }]

        let myChart;
        let option = {
            backgroundColor: '#fff',
            animationDurationUpdate: 1000,
            animationEasingUpdate: 'quinticInOut',
            focusNodeAdjacency:true,
            legend: [{
                // selectedMode: 'single',
                data: categories.map(function(a) {
                    return a.name;
                }),
                icon: 'circle',
            }],
            tooltip:{
                trigger: 'item',
            },
            series: [{
                type: 'graph',
                layout: 'none',
                symbolSize: (value) => {
                    return value;
                },
                coordinateSystem: null,
                label: {
                    normal: {
                        show: true,
                        color: '#6D7787'
                    },
                    rotate:55
                },
                edgeSymbol: ['', 'arrow'],
                edgeSymbolSize: 8,
                categories: categories,
                data: [],
                links: []
            }]
    };
export function closedLoopEcharts(this_){
    if(this_.suyAllData.supLi.length==0&&this_.suyAllData.buyerLi.length==0&&this_.suyAllData.sellerLi.length==0){
        this_.text="暂无数据合成!!!";
        option.series[0].data = [];
        option.series[0].links = [];
        myChart.setOption(option, true);
        return;
    }
    myChart = echarts.init(document.getElementById("echartsBox"));
    let data = [];//所有数据
    let links = [];//关联数据
    option.series[0].data = data;
    option.series[0].links = links;
    data.push({//配送商数据封装
        name: "配送商："+this_.suyAllData.sellerLi[0].seller,
        x: 522,
        y: 0,
        symbol: 'image://'+require('assets/img/ybclosedloop.png'),
        symbolSize:[88,88],
        symbolOffset: ['0%', '0%'],
        category: 1,
        label: {//节点样式
            normal: {
                position: "bottom",
            }
        },
        value:this_.suyAllData.sellerLi[0],
        tooltip:{
                trigger: 'item',
                formatter:(p)=>{
                    let data=p.data.value;
                    if(p.data.isLine){
                        return p.data.source+">>"+p.data.target
                    }else{
                    let html="<span style='margin-right:5px;background: #FFCF69;display: inline-block;height: 10px;width: 10px;border-radius: 50%'></span>" +
                    "配送商："+data.seller+"<br/>" +
                        "责任人："+data.sellerLegalPerson+" <br/> " +
                        "联系电话："+data.sellerTel+" <br/> " +
                        "地址："+data.sellerAddr+" <br/> " +
                        "配送时间："+data.deliveryTime
                        return html;
                    }
                    
                }
        }
    });
    let source = this_.suyAllData.supLi;
    for (let i = 0; i < source.length; i++) {
        data.push({//供应商数据封装
            name:"供应商："+ source[i].sourceName,
            x: -calX(i, source.length, 13000, 15),
            y: cal(i, source.length,900),
            value: source[i],
            category: 0,
            symbolSize:15,
            label: {//节点样式
                normal: {
                    position: "right",
                    offset:[0,20]
                }
            },
            tooltip:{
                trigger: 'item',
                formatter:(p)=>{
                    let data=p.data.value;
                    if(p.data.isLine){
                        return p.data.source+">>"+p.data.target
                    }else{
                        let html="<span style='margin-right:5px;background: #66D6A2;display: inline-block;height: 10px;width: 10px;border-radius: 50%'></span>" +
                        "供应商："+ data.sourceName+"<br/>" +
                        "责任人："+data.linkMan+" <br/> " +
                        "联系电话："+data.tel+" <br/> " +
                        "地址："+data.sourceAddr+" <br/> " +
                        "进货时间："+data.buyTime
                    return html;
                    }
                    
                }
            },
        });
        links.push({//供应商与配送商连线数据封装
            source: "供应商："+ source[i].sourceName,
            target:  "配送商："+this_.suyAllData.sellerLi[0].seller,
            isLine:true,
            lineStyle: {
                normal: {
                    curveness: 0,
                    colorStops: [{
                        offset: 0, color: '#C2CAD2' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#fff' // 100% 处的颜色
                    }],
                    textStyle: {
                            fontSize: 12
                    },
                    symbolSize:10
                }
            }
        });
    }
    let direction = this_.suyAllData.buyerLi;
    for (let i = 0; i < direction.length; i++) {
        data.push({//采购商数据封装
            name:"采购商："+ direction[i].buyer,
            x:calX(i, source.length, 13000, -125),
            y: cal(i, direction.length,9000),
            value:direction[i],
            category: 2,
            label: {//节点样式
                normal: {
                    position: "left",
                    offset:[-20,20]
                },
            },
            symbolSize:15,
            tooltip:{
                trigger: 'item',
                formatter:(p)=>{
                    let data=p.data.value;
                    if(p.data.isLine){
                        return p.data.source+">>"+p.data.target
                    }else{
                    let html="<span style='margin-right:5px;background: #0DB5EF;display: inline-block;height: 10px;width: 10px;border-radius: 50%'></span>" +
                    "采购商："+data.buyer+"<br/>" +
                        "责任人："+data.buyerLegalPerson+" <br/> " +
                        "联系电话："+data.buyerTel+" <br/> " +
                        "地址："+data.buyerAddr+" <br/> " +
                        "签收时间："+data.receiveTime
                    return html;
                    }
                    
                }
            },
        });
        links.push({//采购商与配送商连线数据封装
            source: "配送商："+ this_.suyAllData.sellerLi[0].seller,
            target: "采购商："+direction[i].buyer,
            isLine:true,
            label:{normal:{show:false}},
            lineStyle: {
                normal: {
                    curveness: 0,
                    color:'#C2CAD2',
                    textStyle: {
                            fontSize: 12
                    },
                    symbolSize:10
                }
            }
        });
    }

    option.series[0].data = data;
    option.series[0].links = links;
    myChart.setOption(option, true);
    window.addEventListener('resize', function () {
        myChart.resize();
    }, false)
}
