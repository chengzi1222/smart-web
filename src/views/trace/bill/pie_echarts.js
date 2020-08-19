import echarts from "echarts";

export default function(id,nameArr,dataArr,cb){
    var myChart = echarts.init(document.getElementById(id));
    var _right = 'right';
    if(nameArr.length>9){
        _right = 'right';
    }else{
        _right = '50%';
    }
   
    const option = {
            tooltip: {
                trigger: 'item',
                // formatter: "{b}: {c} ({d}%)"
                formatter: "{b}"
            },
            legend: {
                orient: 'vertical',
                x: _right,
                y:'center',
                selectedMode:false,
                data:nameArr               
            },
            color:["#0DB5EF","#66D6A2","#92E6FF","#FFCF69","#FA503B","#0f6e89","#6e0f89","#89850f","#649ae7","#91b4e5"],
            series: [
                {
                    type:'pie',
                    radius: ['50%', '70%'],
                    center:['30%','50%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            formatter: "{d}%",
                            textStyle: {
                                fontSize: '18',
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:dataArr
                }
            ]
        };
      
        myChart.setOption(option);
        myChart.on('click',function(a,b){
            cb(a,b)
        })
}



