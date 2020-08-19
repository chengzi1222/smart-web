<template>
  <div class="rightBox">
    <ul class="top clear_a">
      <li  class="back_" @click="back"></li>
      <li  class="name">出库记录详情</li>
      <li  class="time">{{time}}</li>
    </ul>
    <div class="innerBox h272 mt20">
      <p class="innerBoxTitie"><span class="line"></span>基本信息</p>
      <div class="clear_a info"  v-loading="loading" element-loading-text="数据正在努力加载中" >
        <div class="baseInfo">
          <p><span class="col66">出库时间：</span>{{detailData.stockOutTime}}</p>
          <p><span class="col66">领用人：</span>{{detailData.handlerName}}</p>
          <p><span class="col66">出库品种数：</span>{{num}}</p>
        </div>
        <div  class="baseImg">
          <p  class="col66 mb20">领用现场拍照：</p>
          <ul class="clear_a">
            <span v-if="detailData.getImg == ''" >暂无图片!</span>
            <li v-if="detailData.getImg !== ''"  v-for="item in detailData.getImg" :key="item"><img :src="item"></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="innerBox h758 relative mt20">
      <p class="innerBoxTitie"><span class="line"></span>出库明细表</p>
      <div style="height:460px;">
        <el-scrollbar  style="height:100%;width:100%;">
          <div>
            <el-table :data="tableData" class="table-div"  v-loading="loading" element-loading-text="数据正在努力加载中" >
              <el-table-column show-overflow-tooltip prop="pdtName" min-width="100" label="食品名称"></el-table-column>
              <el-table-column show-overflow-tooltip  min-width="100" label="出库量">
                <template slot-scope="scope">
                  {{scope.row.weight}}/{{scope.row.unit}}
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="stockNo" min-width="100" label="出库批次"></el-table-column>
              <el-table-column show-overflow-tooltip prop="dlrName" min-width="100" label="供应商"></el-table-column>
            </el-table>
          </div>
        </el-scrollbar>
      </div>
    </div>

  </div>
</template>

<script>
  import * as api from "../../api/schoolTrace/home";
  import config from "utils/config";
  export default {
    methods: {
      back(){
        history.back()
      },
      timeShow(){
        let mydate = new Date();
        let str = "" + mydate.getFullYear() + "年";
        let M=mydate.getMonth()+1;
        if(M<10){
          M="0"+M;
        };
        str += M + "月";
        let D=mydate.getDate();
        if(D<10){
          D="0"+D;
        };
        str += D + "日";
        let h=mydate.getHours();
        if(h<10){
          h="0"+h;
        };
        str += " "+h + " : ";
        let s=mydate.getMinutes();
        if(s<10){
          s="0"+s;
        };
        str += s;
        this.time=str;
      },
      setInterval_time(){
        this.$nextTick(() => {
          if (this.willDestroy) return;
          var t=setInterval(()=>{
            this.timeShow();
          },1000);
          this.timer.push(t);
        });
      },

      getInfo(){
        this.loading=true;
        let obj={
          guid:this.id,
        }
        api.getDeliveryDtail(obj).then(r=>{
          if(r.code==200&&r.data!==null){
            this.detailData=r.data;
            this.tableData = r.data.detail
            if(this.detailData.getImg !== ''){
              this.detailData.getImg = this.detailData.getImg.split(",")
            }
            this.dataNull=false;
          }else{
          }
          this.loading=false;
        })
      }
    },
    beforeDestroy(){
      this.willDestroy = true;
      this.timer.forEach(item => {
        clearInterval(item);
        item = null;
      });
    },
    mounted() {
      this.schoolTraceBaseUrl=config.schoolTraceBaseUrl;
      if(this.$route.query.id){
        this.id=this.$route.query.id;
        this.num = this.$route.query.num;
      }
      this.setInterval_time()
      this.getInfo()
    },
    data() {
      return {
        willDestroy:false,
        id:'',
        timer:[],
        num:'',
        dataNull:false,
        loading:true,
        data:{fileDTOList:[],bigScreeDetailsDTOList:[]},
        detailData:{},
        tableData:[],
        schoolTraceBaseUrl:'',
        traceNull:require('assets/img/schoolTrace/traceNull.png'),
        time:'',
      };
    }
  }
</script>

<style scoped lang='scss'>
  *{
    color:#333;
  }
  .rightBox{
    width: 1792px;
    height: 1008px;
    position: relative;
    left: 64px;
    top: 36px;
    color: #333;
    background-color: #f5f5f5;
    .top{
      height: 60px;
      line-height: 60px;
      background: #fff;
      .back_{
        cursor: pointer;
        width: 50px;
        height: 100%;
        background: url("~@/assets/img/schoolTrace/back.png") no-repeat center right;
        background-size: 22px 22px;
      }
      .name{
        width: calc(100% - 230px);
        text-align: center;
        font-size: 20px;
      }
      .time{
        width: 180px;
        text-align: left;
        color: #999;
        font-size: 14px;
      }
    }
    .titie{
      height: 80px;
      line-height: 80px;
      .titie_left{
        font-size:20px;
        font-weight:500;
        color:rgba(51,51,51,1);
        width: 50%;
        height: 100%;
      }
      .titie_right{
        width: 50%;
        height: 100%;
        text-align: right;
      }
    }
    .h272{
      height:calc(272px - 40px);
    }
    .h758{
      height:calc(600px - 80px);
    }
    .innerBox{
      width:calc(100% - 80px);
      padding: 20px;
      background:#fff;
      margin: 0 auto;
      border-radius:10px;
      .col66{
        color: #666;
      }
      p.innerBoxTitie{
        font-size:16px;
        color: #333;
        margin-bottom: 30px;
        span.line{
          height: 18px;
          width: 4px;
          display: inline-block;
          background: #34C5D7;
          margin-right: 10px;
          position: relative;
          top: 2px;
        }
      }
      .info{
        height: 200px;
        >div{
          width: 50%;
          height: 100%;
        }
        .baseInfo{
          p{
            margin-bottom: 14px;
          }
        }
        .baseImg{
          li{
            width: 110px;
            height: 110px;
            margin-right: 15px;
            img{
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
  .yes{
    font-size: 14px;
    text-align: center;
    line-height: 30px;
    display: inline-block;
    width:58px;
    height:28px;
    border-radius:4px;
    border:1px solid rgba(112,206,151,1) !important;
    color: rgba(112,206,151,1);
    cursor: pointer;
  }
  .no{
    border:1px solid #ED8C98 !important;
    color: #ED8C98;
  }
  .infoPop{
    width: 300px;
    min-height: 164px;
    padding: 20px;
    background: #fff;
    border-radius: 6px;
    left: calc((1358px - 340px) / 2);
    top: 150px;
    box-shadow: 0 0 10px #999;
    z-index: 5;
    .close{
      position:absolute;
      font-size: 18px;
      color: #666;
      right: 20px;
      top: 20px;
    }
    p{
      color: #333;
      font-size: 16px;
      margin-bottom: 20px;
      span{
        color: #666;
      }
    }
  }
</style>
<style>
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>


