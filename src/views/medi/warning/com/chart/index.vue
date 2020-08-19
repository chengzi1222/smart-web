<template>
  <div class="chartBox">
      <ul class="detailBox mb20 clear_a">
        <!-- 小圆点有两个状态颜色 还有一种是已完成。颜色class+=radiusSucceed -->
        <li>
          <p class="fw clear_a">
          <span class="radius bor5 radiusSucceed" v-if="info.state === '已完成'"></span>
          <span class="radius bor5" v-if="info.state === '执行中'"></span>
            {{ info.state }}
          </p>
          <p>计划状态</p>
        </li>
        <li>
          <p  class="fw">{{ showTime }}</p>
          <p v-if="info.state === '执行中'">预警信息发布时长</p>
          <p v-if="info.state === '已完成'">预警任务耗时</p>
        </li>
        <li><p  class="fw">{{ info.unRevicedCount }}</p><p>未读企业</p></li>
        <li><p  class="fw">{{ info.tobeExecuteCount }}</p><p>待处理</p></li>
        <li><p  class="fw">{{ info.executedCount }}</p><p>已处理</p></li>
      </ul>
      <div class="clear_a pieBox mb20">
        <div id="pieLfet"></div>
        <div id="pieRight"></div>
      </div>
      <div class="clear_a barBox mb20" id="barBox">
      </div>
      <div class="clear_a newData mb20">
        <p class="fs16 col39">实时处理动态</p>
        <el-table :data="dynamic" :border="true" :resizable="true" style="width: 100%;margin-top:20px;font-size:12px;">
            <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
            <el-table-column align="center" label="企业名称" prop="entityName"></el-table-column>
            <el-table-column align="center" label="处理状态" width="100">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.state == '未读'" size="mini" type="danger">未读</el-tag>
                    <el-tag v-if="scope.row.state == '已处理'" size="mini">已处理</el-tag>
                    <el-tag v-if="scope.row.state == '待处理'" size="mini" type="warning">待处理</el-tag>
                </template>
            </el-table-column>
              <el-table-column align="center" label="所属下级部门" prop="deptName" width="300"> </el-table-column>
            <el-table-column align="center"prop="realName" label="联系人"></el-table-column>
            <el-table-column align="center"prop="phone" label="手机号"></el-table-column>
            <el-table-column align="center" prop="createTime" label="更新时间"></el-table-column>
        </el-table>
      </div>
  </div>
</template>

<script>
import * as echarts from "./echarts";
import * as warningTask from "api/warning/warning";
  export default {
    beforeDestroy(){
      this.willDestroy = true;
      this.timer.forEach(item => {
        clearInterval(item);
        item = null;
      });
    },
    props: {
      taskId: String
    },
    async mounted(){
      await this.initInfo()
      this.dynamicFn();
    },
    components: {
    },
    methods:{
      initInfo(){
        warningTask.taskRecordInfo(this.taskId).then(r=>{
            this.info = r.data
            this.pie1.seriesData=[{name:"已处理",value:r.data.executedCount},{name:"待处理",value:r.data.tobeExecuteCount},{name:"未读",value:r.data.unRevicedCount}]
            this.pie2.seriesData = []
            this.pie2.legendData = []
            r.data.dispList.forEach(s =>{
              this.pie2.seriesData.push({name:s.name,value:s.num})
              this.pie2.legendData.push(s.name)
            })
            if(this.info.state === '已完成'){
              this.timeInit()
            }else{
              this.timeinc()
            }
            this.chartInit()
        })
        warningTask.getLastData(this.taskId).then(r=>{
          this.dynamic = r.data
        })
        warningTask.getEchartData(this.taskId).then(r=>{
          this.bar.xData = r.data.nameList
          this.bar.seriesData = r.data.list
          this.chartInitN()
        })
      },

      timeinc (){
        this.$nextTick(() => {
          if (this.willDestroy) return;
          var t=setInterval(()=>{
            this.timeInit();
          },1000);
          this.timer.push(t);
        });

      },
      timeInit(){
        let time;
        if(this.info.state === '已完成'){
          time= parseFloat(this.info.finishTime - this.info.startTime) / 1000;
        }else{
          time= parseFloat(new Date().getTime() - this.info.startTime) / 1000;
        }
        if (null != time && "" != time) {
          if (time > 60 && time < 60 * 60) {
            var f=()=>{
              var num=parseInt(time / 60.0);
              if(num<10){
                return "0"+num;
              }else{
                return num;
              }
            };
            var m=()=>{
              var num=parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60);
              if(num<10){
                return "0"+num;
              }else{
                return num;
              }
            };
            time = "00:"+ f() + ":" + m() + "";
          } else if (time >= 60 * 60) {
             var s=()=>{
              var num= parseInt(time / 3600.0);
              if(num<10){
                return "0"+num;
              }else{
                if(num>24){
                  var n=num%24;
                  var t=(num-n)/24;
                  return t+"天 "+n
                }else{
                   return num;
                }
              }
            };
            var f=()=>{
              var num= parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60);
              if(num<10){
                return "0"+num;
              }else{
                return num;
              }
            };
            var m=()=>{
              var num=parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
              parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60);
              if(num<10){
                return "0"+num;
              }else{
                return num;
              }
            };
            time = s() + ":" + f()+ ":" + m();
          } else {
            if(time<10){
              time="00:00:0"+parseInt(time);
            }else{
              time="00:00:"+parseInt(time);
            }
          }
        }
        this.showTime = time
      },
      chartInit(){
        echarts.pie(this.pie1,"1","pieLfet","处理状态");
        echarts.pie(this.pie2,"0","pieRight","处理方式");
      },
      chartInitN(){
        echarts.bar(this.bar.legendData,this.bar.xData,this.bar.seriesData,"barBox","下级单位预警处理情况");
      },
      //动态巡查
      dynamicFn(){
        warningTask.getLastData(this.taskId).then(res=>{
            this.updateTable(this.dynamic,res.data,5,10,()=>{
                setTimeout(()=>{
                    if(this.willDestroy) return
                    this.dynamicFn()
                },10000)
              });
          })
      },
      //更新表格 @updateObj 更细的数据对象，@dataSource 数据源 ，@limit 显示格式，@time 间隔时间 @callback数据滚完一遍重新请求新的数据
      updateTable(updateObj,dataSource=[],limit=5,time=5,callback){
          let dynamicNum = 0
          handle()
          let timeID = setInterval(handle,time*1000)
          function handle(){
              try {
                      updateObj.splice(0,updateObj.length);
                      dynamicNum ++;
                      let newArr = dataSource.slice((dynamicNum-1)*limit,dynamicNum*limit);
                      if((dataSource.length%2 != 0) && (dynamicNum*limit >= dataSource.length)){
                              newArr =  dataSource.slice((dynamicNum-1)*limit,dataSource.length);
                      }
                      for(let i=0;i<newArr.length;i++){
                              updateObj.push(newArr[i]);
                      }
                      if(dynamicNum*limit>=dataSource.length){
                              clear()
                              callback()
                      }
              } catch (error) {
                  clearInterval(timeID)
                  timeID = null;

              }
          }

          function clear() {
            clearInterval(timeID);
            timeID = null;
            dynamicNum = null;
            limit = null;
            updateObj = null;
            dataSource = null;
            time = null;
          }
      },
    },
    watch:{

    },
    data() {
      return {
        timer:[],//定时器
        showTime:'',
        info: {
          entityCount: 0,
          tobeExecuteCount: 0,
          unRevicedCount: 0,
          executedCount: 0,
          dispList:[],
          startTime:'',
          finishTime:'',
          state:'',
        },
        pie1:{
          legendData:["已处理","待处理","未读"],
          seriesData:[
            {name:"已处理",value:0},
            {name:"待处理",value:0},
            {name:"未读",value:0}
          ]
        },
        pie2:{
          legendData:["已发现相关药品并处理","未发现相关药品","已接受并查阅该消息","其他"],
          seriesData:[
            {name:"已发现相关药品并处理",value:0},
            {name:"未发现相关药品",value:0},
            {name:"已接受并查阅该消息",value:0},
            {name:"其他",value:0},
          ]
        },
        bar:{
          legendData:["未读","待处理","已处理"],
          seriesData:[
            {
              data:[12,33,55,6,9,8,56,3,23],
              name:"未读",
              type:"bar"
            },
            {
              data:[1,3,5,6,9,8,6,3,13],
              name:"待处理",
              type:"bar"
            },
            {
              data:[10,23,34,6,14,8,16,3,43],
              name:"已处理",
              type:"bar"
            },
          ],
          xData:["太升街道","草市街道","西御河街道","汪家拐街道","少城街街道","草堂路街道","府南街道","东坡街道","金沙街道"]
        },
        willDestroy:false,
        dynamic:[]
      }
    }
  }
</script>

<style lang="scss" scoped>
.chartBox{
    background-color: #edf0f3;
    min-height: 200px;
    padding: 20px;
    margin-left: -20px;
    width: calc(100% + 20px);
}
.detailBox{
    width: 100%;
    height: 140px;
    background: #fff;
    li{
      width: 18%;
      height: 100%;
      padding: 0 1%;
      color: #a2aab6;
      font-size: 16px;
      text-align: center;
      p{
        line-height:45px;
        // width: 150px;
        margin: 0 auto;
        height: 45px;
      }
      .fw{
        color: #140a0a;
        font-size: 34px;
        margin-top: 25px;
        .radius{
          width: 10px;
          height: 10px;
          display: block;
          background: #FFBC40;
          position: relative;
          top: 28px;
          left: 10%;
        }
        .radiusSucceed{
          background: #32C25E;
        }
      }
    }
  }
.pieBox{
  height: 300px;
  width: 100%;
  #pieLfet,#pieRight{
    padding: 15px;
    width: calc((100% - 20px) / 2 - 30px);
    height: calc(100% - 30px);
    background: #fff !important;
  }
  #pieLfet{
    margin-right: 20px;
  }
}
.barBox{
  padding: 15px;
  height: 324px;
  width:  calc(100% - 30px);
  background: #fff !important;
}
.newData{
  height: 300px;
  width:  calc(100% - 30px);
  padding: 15px;
  background: #fff;
  >p{
    font-weight: 700;
    font-size: 15px;
    width: 100%;
  }
}
</style>
