import echarts from "echarts";

var sourceX = [-8000];
var sourceY = [-6000];
var directionX = [8000, 11000, 0, -7000, 7000];
var directionY = [7000, 1000, 10000, 7000, -5000];
let categories = [{
	name: '供货商',
	itemStyle: {
		normal: {
			color: "#66D6A2"
		}
	},
	symbol: 'circle',
}, {
	name: '配送商',
	itemStyle: {
		normal: {
			color: "#FFCF69"
		}
	},
	symbol: 'circle',
}, {
	name: '采购商',
	itemStyle: {
		normal: {
			color: "#0DB5EF",
		}
	},
	symbol: 'circle',
}]

let myChart;
let option = {
	animationDurationUpdate: 1000,
	animationEasingUpdate: 'quinticInOut',
	focusNodeAdjacency: true,
	legend: [{
		type: 'plain',
		right: 40,
		itemWidth: 40,
		itemHeight: 40,
		textStyle: {
			color: '#fff',
			fontSize: 24
		},
		data: [{
			name: '供货商',
			icon: 'image://' + require('assets/img/subjectData/4kTrace/pointgreen.png')
		}, {
			name: '配送商',
			icon: 'image://' + require('assets/img/subjectData/4kTrace/pointblue.png')
		}, {
			name: '采购商',
			icon: 'image://' + require('assets/img/subjectData/4kTrace/pointyellow.png')
		}]
	}],
	series: [{
		type: 'graph',
		layout: 'none',
		left: 150,
		right: 150,
		top: 150,
		bottom: 50,
		symbolSize: (value) => {
			return value;
		},
		coordinateSystem: null,
		label: {
			normal: {
				show: true,
				color: '#6D7787'
			},
			rotate: 55
		},
		edgeSymbol: ['', 'arrow'],
		edgeSymbolSize: 8,
		categories: categories,
		data: [],
		links: []
	}]
};
export function closedLoopEcharts(this_) {
	if (this_.suyAllData.supLi.length == 0 && this_.suyAllData.buyerLi.length == 0 && this_.suyAllData.sellerLi.length == 0) {
		this_.text = "暂无数据合成!!!";
		option.series[0].data = [];
		option.series[0].links = [];
		myChart.setOption(option, true);
		return;
	}
	myChart = echarts.init(document.getElementById("closeEchartsBox"));
	let data = [];//所有数据
	let links = [];//关联数据
	option.series[0].data = data;
	option.series[0].links = links;
	data.push({//配送商数据封装
		name: " " + this_.suyAllData.sellerLi[0].seller,
		x: 0,
		y: 1000,
		symbol: 'image://' + require('assets/img/subjectData/4kTrace/pointblue.png'),
		symbolSize: [60, 60],
		symbolOffset: ['0%', '0%'],
		category: 1,
		label: {//节点样式
			normal: {
				position: "top",
				color: '#fff',
				fontSize: 20
			}
		},
		value: this_.suyAllData.sellerLi[0],
	});
	let source = this_.suyAllData.supLi;
	for (let i = 0; i < source.length; i++) {
		data.push({//供应商数据封装
			name: source[i].sourceName,
			x: sourceX[i],
			y: sourceY[i],
			symbol: 'image://' + require('assets/img/subjectData/4kTrace/pointgreen.png'),
			symbolSize: [60, 60],
			value: source[i],
			category: 0,
			label: {//节点样式
				normal: {
					position: "top",
					color: '#fff',
					fontSize: 18
				}
			},
		});
		links.push({//供应商与配送商连线数据封装
			source: source[i].sourceName,
			target: " " + this_.suyAllData.sellerLi[0].seller,
			isLine: true,
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
					symbolSize: 10
				}
			}
		});
	}
	let direction = this_.suyAllData.buyerLi;
	for (let i = 0; i < direction.length&&i<5; i++) {
		data.push({//采购商数据封装
			name: direction[i].buyer,
			x: directionX[i],
			y: directionY[i],
			value: direction[i],
			category: 2,
			label: {//节点样式
				normal: {
					position: "top",
					color: '#fff',
					fontSize: 18
				},
			},
			symbol: 'image://' + require('assets/img/subjectData/4kTrace/pointyellow.png'),
			symbolSize: 60,
		});
		links.push({//采购商与配送商连线数据封装
			source: " " + this_.suyAllData.sellerLi[0].seller,
			target: direction[i].buyer,
			isLine: true,
			label: { normal: { show: false } },
			lineStyle: {
				normal: {
					curveness: 0,
					color: '#C2CAD2',
					textStyle: {
						fontSize: 12
					},
					symbolSize: 10
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
