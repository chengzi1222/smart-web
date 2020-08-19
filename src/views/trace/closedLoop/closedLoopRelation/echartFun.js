import echarts from "echarts";
// 所有数据
let data = []
for (var i = 0; i < 8; i++) {
    let obj = {
        name: '大数据' + i,
        attributes: {
            modularity_class: i
        },
        category: (i % 2 == 0) ? 0 : 1,
        symbolSize: 10,
        value: 123,
        x: null,
        y: null,
    }
    data.push(obj);
}
// 关联关系
let link = [];
for (var i = 1; i < data.length; i++) {
    let obj = {
        source: '大数据0',
        target: '大数据' + i
    }
    link.push(obj);
}
// type类别
var categories = [{name:'供货商'},{name:'配送商'},{name:'采购商'}]
export function closedLoopEcharts(id){
let option = {
		tooltip: {
			// trigger: 'item',
			// triggerOn: 'mousemove',
			// formatter: (parmes) => {
			// 	return ''
			// 	console.log(parmes)
			// }
		},
		color:["#66D6A2","#FFCF69","#0DB5EF"],
		itemStyle: {
			shadowBlur: 15
		},
		textStyle: {
			color: '#333',
			fontSize: 16,
			fontWeight: 600,
		},
		legend: [{
			// selectedMode: 'single',
			data: categories.map(function(a) {
				return a.name;
			})
		}],
		animation: false,
		series: [{
			type: 'graph',//echart类别关系图
			layout: 'force',//布局
			data: data,//所有数据
			links: link,//关联数据
			categories: categories,//类别
			focusNodeAdjacency: true,//移入效果
			roam: false,//拖动
			force: {
				repulsion: 2000//节点距离
			},
			lineStyle: {
                normal: {
                    color: '#C2CAD2',
                }
            },
			label: {//节点样式
						normal: {
							position: "top",
							show: true,
							textStyle: {
								fontSize: 12
							},
						}
					},
		}]
	};
let myChart;
    myChart = echarts.init(document.getElementById(id));
    myChart.setOption(option);
    window.addEventListener('resize', function () {
		myChart.resize();
	}, false)
}