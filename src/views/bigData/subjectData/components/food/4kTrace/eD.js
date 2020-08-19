import echarts from "echarts";

var sourceX = [-4000];
var sourceY = [-3000];
var directionX = [8000, 11000, 0, -7000, 7000];
var directionY = [7000, 1000, 10000, 7000, -5000];
let categories = [{
	name: '供货商q',
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
		top: 60,
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
export function closedLoopEchartsD(this_) {
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
	let sellerLi = this_.suyAllData.sellerLi;
	for (let i = 0; i < sellerLi.length && i < 5; i++) {
		data.push({//配送商数据封装
			name: sellerLi[i].seller,
			x: directionX[i],
			y: directionY[i],
			value: sellerLi[i],
			category: 2,
			label: {//节点样式
				normal: {
					position: "top",
					color: '#fff',
					fontSize: 18
				},
			},
			symbol: 'image://' + require('assets/img/subjectData/4kTrace/pointblue.png'),
			symbolSize: 60,
		});
		links.push({//采购商与配送商连线数据封装
			source: sellerLi[i].seller,
			target: this_.suyAllData.buyerLi[0].buyer,
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
	let source = this_.suyAllData.supLi;
	for (let i = 0; i < 1; i++) {
		data.push({//供应商数据封装
			name: '',
			x: sourceX[i],
			y: sourceY[i],
			symbol: 'image://' + require('assets/img/subjectData/4kTrace/pointgreen.png'),
			symbolSize: 0,
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
			source: '',
			target: " ",
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
	for (let i = 0; i < direction.length && i < 5; i++) {
		data.push({//采购商数据封装
			name: direction[i].buyer,
			x: -2000,
			y: 1000,
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
	}
	option.series[0].data = data;
	option.series[0].links = links;
	myChart.setOption(option, true);
	window.addEventListener('resize', function () {
		myChart.resize();
	}, false)
}
