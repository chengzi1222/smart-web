import echarts from "echarts";

export function pie_echart(data,id){
  let myChart;
  let container;
  let option = {
    title : {
      text: data.title,
      subtext:data.subtitle,
      x:'left',
      textStyle:{
        color:"#393939",
        fontSize:15,
        fontWeight:"normal"
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: "{b}<br/>" +
      "<span style='margin-right:5px;background: #92E6FF;display: inline-block;height: 10px;width: 10px;border-radius: 50%'></span>" +
        "检测批次：{c}次 <br/> " +
      "<span style='margin-right:5px;background: #92E6FF;display: inline-block;height: 10px;width: 10px;border-radius: 50%'></span>" +
      "占比：({d}%)"
    },
   legend: {
      icon:'circle',
      orient: 'vertical',
      x: 'right',
      y:'center',
      align:'left',
      data:data.nameArray
    }, 
    series: [
      {
        type:'pie',
        radius: ['30%', '50%'],
        avoidLabelOverlap: false,
        center : ['40%', '50%'],
        color:["#0DB5EF","#FFCF69"],
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '14',
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data:data.dataArray
      }
    ]
  };
    container = document.getElementById(id);
    myChart = echarts.init(container);
    myChart.setOption(option);
    // 窗口变化，重绘图像
    window.addEventListener('resize',function(){
      myChart.resize();
    },false)
}

export function bar_echart(data,id,router){
  let z={
      zoomLock:false,
      type: 'slider',
      xAxisIndex: 0,
      filterMode: 'empty',
      bottom:0,
      show:data.dataZoom == false ? false : true
  }
  if(data.zoomLock){
      z= {
          startValue:0,
          endValue:20,
          zoomLock:true,
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'empty',
          bottom:0,
          show:data.dataZoom == false ? false : true
      }
  }
  let myChart;
  let container;
  let Ttext=data.formatter.Ttext ? data.formatter.Ttext : '数值'
  let option = {
            title : {
                text: data.title,
                x:'left',
                textStyle:{
                color:"#393939",
                fontSize:15,
                fontWeight:"normal"
                }
            },
            color: ['#3398DB'],
            tooltip: {
                trigger: 'item',
                formatter: "{b}<br/>" +
                "<span style='margin-right:5px;background: #92E6FF;display: inline-block;height: 10px;width: 10px;border-radius: 50%'></span>" +
                  ""+Ttext+"：{c}"+data.formatter.tooltip+" <br/> "
              },
            grid: {
                top:data.title == '' ? '8%':'15%',
                left: '3%',
                right: '4%',
                bottom:data.gridB ? data.gridB :'15%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : data.name,
                    axisTick: {
                        alignWithLabel: true
                    }
                    ,triggerEvent:true 
                    ,axisLabel: {  
                        interval:0,  
                        rotate:data.rotate ==0  ? data.rotate :40  
                     }  
                }
            ],
            yAxis : [
                {
                    type : 'value'
                    ,axisLabel: {
                        formatter: data.formatter.y
                    }
                }
            ],
            dataZoom: z,
            series : [
                {
                    name:'数值',
                    type:'bar',
                    barWidth: '60%',
                    data:data.value
                }
            ]
        };

    container = document.getElementById(id);
    if(data.name && data.value){
        myChart = echarts.init(container);
    };
    myChart.setOption(option);
    // 窗口变化，重绘图像
    window.addEventListener('resize',function(){
      myChart.resize();
    },false);
    if(data.id && data.url && data.date){
        myChart.on('click', function (params) {
            let id=data.id;
            if(params.componentType =="xAxis"){ 
                console.log(params);
                let val=params.value;
                for(let i=0;i<data.name.length;i++ ){
                    if(data.name[i]==val){
                        if(data.backtitle){
                            router.push({name:data.url,query:{areaid:id[i],name:val,backtitle:data.backtitle,date:data.date}});
                        }else{
                            router.push({name:data.url,query:{areaid:id[i],name:val,date:data.date}});
                        }
                       
                    }
                }
            }else{
                if(data.backtitle){//如果需要就传backtitle
                    router.push({name:data.url,query:{areaid:id[params.dataIndex],name:params.name,backtitle:data.backtitle,date:data.date}});
                }else{
                    router.push({name:data.url,query:{areaid:id[params.dataIndex],name:params.name,date:data.date}})
                }
            };
        });
    }
}

export function bar2_echart(data,id){
  let myChart;
  let container;
  let option = {
            title : {
                    text: data.num+'月检测数据',
                    x:'left',
                    textStyle:{
                    color:"#393939",
                    fontSize:15,
                    fontWeight:"normal"
                    }
                },
            color: ['#3398DB',"#FFCF69"],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
                ,formatter: function(params) { 
                    if (params.length > 1) {
                        let rate=params[0].value/(params[0].value+params[1].value);
                            rate=(rate*100).toFixed(2)+"%"
                        let html=params[0].axisValue+"</br><span style='margin-right:5px;background: #3398DB;display: inline-block;height: 10px;width: 10px;border-radius: 50%'></span>"+
                        params[0].seriesName+":"+params[0].value+"（合格率为"+rate+")</br><span style='margin-right:5px;background: #FFCF69;display: inline-block;height: 10px;width: 10px;border-radius: 50%'></span>"+
                        params[1].seriesName+":"+params[1].value+"</br>"
                        return (html);
                    }
                }
            },
            legend: {
                icon:'circle',
                x: 'right',
                y:'top',
                align:'left',
                data: [data.resultdata.name, data.faildata.name]
            },
            grid: {
                left: '3%',
                right: '3%',
                bottom: '3%',
                containLabel: true
            },
            xAxis:  {
                type: 'category',
                data:data.nameArray
            },
            yAxis: {
                 type: 'value'
            },
            series: [
                {
                    name:data.resultdata.name,
                    type: 'bar',
                    stack: '总量',
                    data: data.resultdata.data
                },
                {
                    name: data.faildata.name,
                    type: 'bar',
                    stack: '总量',
                    data:data.faildata.data
                }
            ]
        };

    container = document.getElementById(id);
    myChart = echarts.init(container);
    myChart.setOption(option);
    // 窗口变化，重绘图像
    window.addEventListener('resize',function(){
      myChart.resize();
    },false)
}

export function barline_echart(data,id){
  let myChart;
  let container;
  let option = {
            title : {
                text: data.title,
                x:'left',
                textStyle:{
                color:"#393939",
                fontSize:15,
                fontWeight:"normal"
                }
            },
            color: ['#3398DB',"#FFCF69"],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            legend: {
                icon:'circle',
                x: 'right',
                align:'left',
                data:[data.bar.name,data.line.name]
            },
            xAxis: [
                {
                    type: 'category',
                    data: data.xAxis,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '',
                    max: 185,//需要找到这个数组的最大的一个数（要处理）
                    interval: 37,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '',
                    min: 0,
                    max: 100,
                    interval: 20,
                    axisLabel: {
                        formatter: '{value} %'
                    }
                }
                
            ],
            dataZoom: {
                startValue:0,
                endValue:6,
                zoomLock:true,
                type: 'slider',
                xAxisIndex: 0,
                filterMode: 'empty',
                bottom:0//控制位置
            },
            series: [
                {
                    name:data.bar.name,
                    type:'bar',
                    data:data.bar.data
                },
                {
                    name:data.line.name,
                    type:'line',
                    data: data.line.data
                }
            ]
        };

    container = document.getElementById(id);
    myChart = echarts.init(container);
    myChart.setOption(option);
    // 窗口变化，重绘图像
    window.addEventListener('resize',function(){
      myChart.resize();
    },false);
}