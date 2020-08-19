<template>
  <div class="area">
    <div class="page-tilt">
      <b></b><span>新农贸市场溯源监管{{ title == '' ? '': (title[0]=="-" ? title :"-"+title ) }}</span>
      <Back v-show="backshow"></Back>
    </div>
    <div class="main_content">
      <!-- 1 -->
      <section class="item1 clearfix">
        <div class="floatL">
          <p>溯源纳入情况</p>
          <div style="text-align: center;">
            <p><span style="color:#393939;font-size:36px;">{{ sourceNunber }}</span>家</p>
            <p>经营者数量</p>
          </div>
        </div>
        <div class="floatR">
          <el-button class="fr btn" type="primary" @click="go">综合查询分析</el-button>
          <p class="fs14 col39 mb20">
            当月低溯源预警
            <!-- <el-tooltip class="item" effect="dark" content="按最近30天内溯源排名" placement="top-start">
              <span class="tip">!</span>
            </el-tooltip> -->
          </p>
          <div v-for="(item,index) in low" :key="index" class="low" :data-guid="item.areaId">
            <p :class="'low'+index">No.{{ index+1 }}</p>
            <div class="clear_a market">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                <div class="name textell">{{ item.name }}</div>
              </el-tooltip>
              <el-progress :stroke-width="18" :percentage="item.trace*1"></el-progress>
            </div>
          </div>
        </div>
      </section>
      <!-- 2 -->
      <section class="item2">
        <div class="date boxSB">
          <el-date-picker v-model="seldate" type="month" @change="use_" :clearable="false" placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="info">
          <div class="floatL">
            <p>{{ useNumber.m }}月溯源平台使用情况</p>
            <div style="text-align: center;">
              <p><span style="color:#393939;font-size:36px;">{{ useNumber.rate }}</span></p>
              <p>溯源平台使用率</p>
            </div>
          </div>
          <div class="floatR">
            <div class="clear_a" style="height:17px;">
              <span class="fs14 col999"><span class="tipBAR mr10">!</span>点击此柱状图可查询详细溯源信息</span>
            </div>
            <div style="width:100%;height:90%;" id="FMusearea">
              <div class="partlyLoading">
                <div>拼命加载中...</div>
              </div>
            </div>
          </div>
        </div>

      </section>
      <!-- 3 -->
      <section class="item3 boxSB">
        <div style="width:100%;height:100%;" id="FMhis">
          <div class="partlyLoading">
            <div>拼命加载中...</div>
          </div>
        </div>
      </section>
      <!-- 4 -->
      <section class="item2">
        <div class="date boxSB">
          <el-date-picker v-model="varietyDate" type="month" @change="varietyChange" :clearable="false" placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="info">
          <div class="floatL">
            <p>{{ varietyData.mon }}月溯源品种数</p>
            <div style="text-align: center;">
              <p><span style="color:#393939;font-size:36px;">{{ varietyData.num }}</span></p>
              <p>本月溯源品种数</p>
            </div>
          </div>
          <div class="floatR">
            <div style="width:100%;height:90%;" id="FMvariety">
              <div class="partlyLoading">
                <div>拼命加载中...</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import Back from "utils/back";
  import { bar_echart } from "../inquire/echarts/echarts";
  import { getTraceWarning, getTraceUse, getTraceTrend, getVariety } from 'api/trace/newfarm'
  export default {
    components: {
      Back
    },
    methods: {
      getTraceWarning(){
        getTraceWarning({date: this.getdate()+'-01', nodeId: this.areaId_}).then(r=>{
          if(r.status){
            this.sourceNunber = r.data.bussTotal;
            this.low = r.data.traceList;
          }
        })
      },
      getTraceUse() {
        let params = {
          nodeId: this.areaId_,
          date: this.seldate + '-01'
        }
        getTraceUse(params).then(r => {
          if (r.status) {
            this.useNumber.rate = r.data.trace + "%";
            this.useNumber.m = this.seldate.slice(5, 7);
            let useareas_ = [], rate_ = [], id_ = [];
            for (let i=0; i<r.data.traceList.length; i++) {
              if(r.data.traceList[i].name.length>8){
                useareas_.push(r.data.traceList[i].name.slice(0,8)+'...');
              } else {
                useareas_.push(r.data.traceList[i].name);
              }
              rate_.push(r.data.traceList[i].trace);
              id_.push(r.data.traceList[i].id);
            }
            this.useData.name = useareas_;
            this.useData.value = rate_;
            this.useData.id = id_;
            this.useData.date = this.seldate.slice(0, 7);
            this.useData.backtitle = this.title + "-";
            this.useData.title = this.seldate.slice(5, 7) + "月溯源数据";
            bar_echart(this.useData, "FMusearea", this.$router);
          }
        })
      },
      getTraceTrend(){
        let params = {
          nodeId: this.areaId_,
        }
        getTraceTrend(params).then(r=>{
          if(r.status){
            r.data.reverse();
            let hisData = [], hisRate = [];
            for (let i=0; i<r.data.length; i++) {
              hisData.push(r.data[i].monthDay);
              hisRate.push(r.data[i].trace);
            }
            this.hisData.name = hisData.reverse();
            this.hisData.value = hisRate.reverse();
            bar_echart(this.hisData, "FMhis", this.$router);
          }
        })
      },
      getVariety() {
        let params = {
          marketId: this.areaId_,
          month: this.varietyDate
        }
        getVariety(params).then(r => {
          if (r.status) {
            let variety_ = [], varietyNum_ = [];
            let data = r.data;
            let num = 0;
            data.sort((a,b) => {
              return parseInt(b.varietyNum) - parseInt(a.varietyNum)
            })
            for (let i=0; i<data.length; i++) {
              if(data[i].variety.length>8){
                variety_.push(data[i].variety.slice(0,8)+'...');
              } else {
                variety_.push(data[i].variety);
              }
              varietyNum_.push(data[i].varietyNum);
              num += parseInt(data[i].varietyNum);
            }
            this.varietyData.mon = this.varietyDate.slice(5, 7);
            this.varietyData.num = num;
            this.varietyData.title = this.varietyData.mon + "月溯源品种排行";
            this.varietyData.name = variety_;
            this.varietyData.value = varietyNum_;
            bar_echart(this.varietyData, "FMvariety", this.$router);
          }
        })
      },
      //  获取时间处理，默认为当前时间
      getdate(date) {
        let dates = date || new Date();
        let mon = dates.getMonth() + 1; //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {
          //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        return dates.getFullYear() + "-" + mon;
      },
      go() {
        //点击按钮是综合查询表格
        this.$router.push({ name: "yb.newfarmAnalyzeInfo" });
      },
      use_() {
        this.seldate = this.getdate(this.seldate);
        this.getTraceUse();
      },
      varietyChange() {
        this.varietyDate = this.getdate(this.varietyDate);
        this.getVariety();
      },
      get() {
        this.getTraceWarning();
        this.getTraceUse();
        this.getTraceTrend();
        this.getVariety();
      }
    },
    mounted: function () {
      //得到数据并且确定id
      if (this.$route.query.areaid) {
        if (!this._isDestroyed) {
          this.areaId_ = this.$route.query.areaid;
          this.areaname_ = this.$route.query.name;
          this.backshow = true;
          this.seldate = this.$route.query.date ? this.$route.query.date : this.getdate();
          this.varietyDate = this.seldate;
          this.title = this.$route.query.backtitle + this.$route.query.name;
          this.get();
        };
      } else {
        if (!this._isDestroyed) {
          this.areaId_ = this.$store.state.common.user.areaCode;
          this.backshow = false;
          this.get();
        };
      }
    },
    watch: {
      seldate: function (val, oldVal) {
        this.old = this.getdate(new Date(oldVal));
      }
    },
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6;
          }
        },
        backshow: false,
        title: "", //backtitle
        hisData: {
          //历史溯源平台使用情况趋势图
          title: "历史溯源平台使用情况趋势图",
          formatter: {
            y: "{value} %",
            tooltip: "%",
            Ttext: "溯源使用率"
          },
          dataZoom: false,
          gridB: "5%",
          rotate: 0
        },
        useNumber: {
          rate: "0%",
          m: "0"
        }, //使用率
        useData: {
          //使用图表
          url: "yb.newfarmVendorChart",
          title: "",
          formatter: {
            y: "{value} %",
            tooltip: "%",
            Ttext: "溯源使用率"
          },
          zoomLock: true
        },
        varietyData: {
          mon: '2019-12',
          num: '0',
          url: "",
          title: "",
          formatter: {
            y: "{value}",
            tooltip: "",
            Ttext: "溯源品种排行"
          },
          zoomLock: true
        },
        low: "", //预警
        sourceNunber: "", //纳入总数
        areaId_: "", //区域id
        areaname_: "", //区域名
        seldate: this.getdate(), //日期时间
        old: "", //如果选择器=null，数据还是上一次选择的时间
        dataPage3: [],
        varietyDate: this.getdate()
      };
    }
  };
</script>

<style scoped lang="sass">
  .area {
    background: #edf0f3;
    width: calc(100% + 40px);
    position: relative;
    left: -20px;
    height: 1700px !important;
  }
  .bigbox {
    position: relative;
  }
  .page-tilt {
    background: #ffffff;
    padding: 12.5px 0 12.5px 20px;
  }
  .main_content {
    padding: 20px;
    width: calc(100% - 40px);
  }
  .main_content>section {
    background: #fff;
    width: 100%;
    margin-bottom: 20px;
  }
  .item1 {
    height: 380px;
  }
  .item1>.floatL {
    width: 30%;
    height: 100%;
    border-right: 1px #edf0f3 solid;
    padding: 20px;
    box-sizing: border-box;
  }
  .item1>.floatL>p {
    color: #393939;
    font-size: 14px;
  }
  .item1>.floatL>div {
    color: #9199a7;
    font-size: 14px;
    margin-top: 100px;
  }
  .item1>.floatR {
    height: 100%;
    width: 70%;
    padding: 20px;
    box-sizing: border-box;
  }
  .item1>.floatR .name {
    width: 20%;
    height: 21px;
    line-height: 21px;
    padding-right: 2%;
    font-size: 14px;
    margin-bottom: 12px;
  }
  .item1>.floatR .el-progress {
    width: 78%;
    height: 21px;
    margin-bottom: 12px;
  }
  .item2 {
    height: 415px;
  }
  .item2>.date {
    height: 74px;
    padding: 20px;
    border-bottom: 1px #edf0f3 solid;
  }
  .item2 .info>.floatL {
    width: 30%;
    height: 340px;
    border-right: 1px #edf0f3 solid;
    padding: 20px;
    box-sizing: border-box;
  }
  .item2 .info>.floatL>p {
    color: #393939;
    font-size: 14px;
  }
  .item2 .info>.floatL>div {
    color: #9199a7;
    font-size: 14px;
    margin-top: 100px;
  }
  .item2 .info>.floatR {
    height: 340px;
    width: 70%;
    padding: 20px 20px 10px 20px;
    box-sizing: border-box;
  }
  .item3 {
    width: 100%;
    height: 340px;
    padding: 20px 20px 10px 20px;
  }
  .item7 {
    min-height: 288px;
    padding: 20px;
    box-sizing: border-box;
  }
  .tip {
    border: 1px solid red;
    color: red;
    display: inline-block;
    width: 15px;
    height: 15px;
    line-height: 15px;
    text-align: center;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -o-border-radius: 50%;
    -ms-border-radius: 50%;
  }
  .low>.low0 {
    color: #2694ca;
  }
  .low>.low1 {
    color: #0db5ef;
  }
  .low>.low2 {
    color: #92e6ff;
  }
</style>
<style lang="sass">
  .market .el-progress-bar {
    margin-right: -60px;
    padding-right: 60px;
  }
</style>