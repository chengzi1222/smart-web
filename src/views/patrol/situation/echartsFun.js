import echarts from "echarts";

// 巡查结果分布
export function distribution(data,index,id){
	let itemGap;
	if (index == 0) {
		itemGap = 30;
	}else{
		itemGap = 20;
	}
	let myChart = echarts.init(document.getElementById(id));
	let option = {
		tooltip: {
	        trigger: 'item',
	        formatter: "{b} <br/>数量: {c} <br/> 占比:{d}%"
	    },
	    color:['#66D6A2','#0DB5EF','#FFCF69',"#92E6FF",'#BDEC98'],
	    legend: {
	        orient: 'vertical',
	        x: '65%',
	        y:"25%",
	        itemGap:itemGap,
	        icon:'circle',
	        data:data.legendData
	    },
	    series: [
	        {
	            type:'pie',
	            radius: ['40%', '55%'],
	            center:["35%","50%"],
	            avoidLabelOverlap: false,
	            label: {
	                normal: {
	                    show: false,
	                    position: 'center'
	                },
	                emphasis: {
	                    show: true,
	                    textStyle: {
	                        fontSize: '30',
	                        fontWeight: 'bold'
	                    }
	                }
	            },
	            labelLine: {
	                normal: {
	                    show: false
	                }
	            },
	            data:data.seriesData
	        }
	    ]
	}
	myChart.setOption(option);
}

export function totalPatrol(legendData,xData,seriesData,id){
	let myChart = echarts.init(document.getElementById(id));
	let option = {
	    tooltip : {
			trigger: 'axis',
			tooltip : {
				trigger: 'axis',
				axisPointer : {            // 坐标轴指示器，坐标轴触发有效
					type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				},
			},
	    },
	    color:['#0DB5EF','#66D6A2','#FFCF69'],
	    legend: {
	    	icon:'circle',
	        x: "right",
	        data:legendData
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '15%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
		        axisTick:{
		            show:false
		        },
	            data : xData,
	            axisLabel : {//坐标轴刻度标签的相关设置。
	                formatter : function(params){
	                    if(params){
		                    var newParamsName = "";// 最终拼接成的字符串
	                        var paramsNameNumber = params.length;// 实际标签的个数
	                        var provideNumber = 8;// 每行能显示的字的个数
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
	            }
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
		        axisTick:{
		            show:false
		        },
	        }
	    ],
	    dataZoom: {
            startValue:0,
			endValue:6,
			minSpan:10,
            // zoomLock:true,
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty'
        },
	    series : seriesData
	};
	myChart.setOption(option);
}

export function oneBarEchart(legendData,xData,seriesData,id){
	let myChart = echarts.init(document.getElementById(id));
	let _formatter = '{value}';
	let _forma = '{a}:{c}';
	if(id == "coverage"){
		_formatter = '{value} %';
		_forma = '{b} <br/>{a}: {c}%'
	}
	let option = {
	    tooltip : {
	        trigger: 'axis',
	        formatter:_forma
	    },
	    color:['#0DB5EF'],
	    legend: {
	    	icon:'circle',
	        x: "right",
	        data:legendData
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '15%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
		        axisTick:{
		            show:false
		        },
	            data : xData,
	            axisLabel : {//坐标轴刻度标签的相关设置。
	                formatter : function(params){
	                    if(params){
		                    var newParamsName = "";// 最终拼接成的字符串
	                        var paramsNameNumber = params.length;// 实际标签的个数
	                        var provideNumber = 8;// 每行能显示的字的个数
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
	            }
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
		        axisTick:{
		            show:false  //去掉刻度线
		        },
		        axisLabel: {
		            formatter: _formatter	// 添加%号
		        },
		        axisLine: {
		            show: false 	//y轴消失
		        },
	        }
	    ],
	    dataZoom: {
            startValue:0,
			endValue:6,
			minSpan:10,
            // zoomLock:false,
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty'
        },
	    series : seriesData
	};
	myChart.setOption(option);
}