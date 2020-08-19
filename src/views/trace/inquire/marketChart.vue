<template>
    <div class="area">
        <div class="page-tilt">
            <b></b><span>批发市场溯源监管{{ title == '' ? '': (title[0]=="-" ? title :"-"+title ) }}</span><Back></Back>
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
                            低溯源预警Top5
                            <el-tooltip class="item" effect="dark" content="按最近30天内溯源排名" placement="top-start">
                              <span class="tip">!</span>
                            </el-tooltip>
                        </p>
                         <div v-for="(item,index) in low" :key="index" class="low" :data-guid="item.areaId">
                            <p :class="'low'+index" >No.{{ index+1 }}</p>
                            <div class="clear_a">
                            <el-tooltip class="item" effect="dark" :content="item.bizName" placement="top-start">
                                <div class="name textell">{{ item.bizName }}</div> 
                            </el-tooltip>
                            <el-progress  :stroke-width="18" :percentage="item.rate" ></el-progress> 
                            </div>
                        </div>
                </div>
            </section>
            <!-- 2 -->
            <section class="item2">
                <div class="date boxSB">
                    <el-date-picker
                    v-model="seldate"
                    type="month"
                    @change="use_()"
                    :clearable="false"
                    placeholder="选择日期"
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
                        <div style="width:100%;height:90%;" id="IMusearea">
                             <div class="partlyLoading"><div>拼命加载中...</div></div>
                        </div>
                    </div>
                </div>
               
            </section>
            <!-- 3 -->
            <section class="item3 boxSB">
                <div  style="width:100%;height:100%;" id="IMhis">
                     <div class="partlyLoading"><div>拼命加载中...</div></div>
                </div>
            </section>
            <!-- 7 -->
            <section class="item7" v-show="false">
                 <p class="fs14 col39 mb20">下级区域溯源检测情况</p>
                <el-table :data="dataPage3" class="textC table-div pointerTab" @row-click="rowclick">
                    <el-table-column show-overflow-tooltip prop="area" min-width="180" label="商户名"  align="center" ></el-table-column>
                    <el-table-column show-overflow-tooltip prop="marketNum" min-width="100" label="批发市场数量" align="center" ></el-table-column>
                    <el-table-column show-overflow-tooltip prop="current" min-width="100" label="当月溯源使用率"  align="center" ></el-table-column>
                    <el-table-column show-overflow-tooltip prop="lastMonth" min-width="100" label="上月溯源使用率"  align="center" ></el-table-column>
                    <el-table-column show-overflow-tooltip prop="currentNum" min-width="100" label="当月检测批次"  align="center" ></el-table-column>
                    <el-table-column show-overflow-tooltip prop="lastMonthNum" min-width="100" label="上月检测批次"  align="center"></el-table-column>
                </el-table>
            </section>
        </div>
    </div>
</template>

<script>
import Back from "utils/back";
import {bar_echart} from "./echarts/echarts";
import * as api from "api/trace/inquire";
export default {
  components: {
    Back
  },
  methods: {
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
      this.$router.push({ name: "yb.analyzeInfo" });
    },
    use_() {
      //改变日期做的事
        api
          .market_rate({
            nodeId: this.areaId_,
            nodeName: this.areaname_,
            date: this.getdate(this.seldate)
          })
          .then(d => {
            let n = d * 100;
            this.useNumber.rate = n.toFixed(2) + "%";
            this.useNumber.m = this.getdate(this.seldate).slice(5, 7);
          });
        api
          .market_areas({
            nodeId: this.areaId_,
            nodeName: this.areaname_,
            date: this.getdate(this.seldate)
          })
          .then(d => {
            let useareas_ = [];
            let rate_ = [];
            let id_ = [];
            for (let item in d) {
              if (
                Object.prototype.toString
                  .call(d[item])
                  .slice(8, -1)
                  .toLowerCase() === "function"
              ) {
                continue;
              }
              useareas_.push(d[item].bizName);
              rate_.push((d[item].rate * 100).toFixed(2));
              id_.push(d[item].bizId);
            }
            this.useData.name = useareas_;
            this.useData.value = rate_;
            this.useData.id = id_;
            this.useData.date = this.getdate(this.seldate);
            this.useData.backtitle = this.title + "-";
            this.useData.title =
              this.getdate(this.seldate).slice(5, 7) + "月溯源数据";
            bar_echart(this.useData, "IMusearea", this.$router);
          });
    },
    rowclick(row, event) {
      // console.log(row,event)
      this.$router.push({ name: "yb.vendorChart", query: { selected: "2" } });
    },
    his() {
      //历史情况
      api
        .market_his({
          nodeId: this.areaId_,
          nodeName: this.areaname_,
          date: this.getdate()
        })
        .then(d => {
          let hisData = [];
          let hisRate = [];
          for (let item in d) {
            if (
              Object.prototype.toString
                .call(d[item])
                .slice(8, -1)
                .toLowerCase() === "function"
            ) {
              continue;
            }
            hisData.push(d[item].date);
            hisRate.push((d[item].rate * 100).toFixed(2));
          }
          this.hisData.name = hisData.reverse();
          this.hisData.value = hisRate.reverse();
          bar_echart(this.hisData, "IMhis", this.$router);
        });
    },
    marketNumber() {
      //纳入情况
      api
        .marketNumber({
          nodeId: this.areaId_,
          nodeName: this.areaname_
        })
        .then(d => {
          this.sourceNunber = d;
        });
      //预警
      api
        .market_low({
          nodeId: this.areaId_,
          nodeName: this.areaname_
        })
        .then(d => {
          for (let item in d) {
            if (
              Object.prototype.toString
                .call(d[item])
                .slice(8, -1)
                .toLowerCase() === "function"
            ) {
              continue;
            }
            d[item].rate = d[item].rate * 100;
            d[item].rate = Math.ceil(d[item].rate);
          }
          this.low = d;
        });
    },
    market_rate() {
      // 使用率
      api
        .market_rate({
          nodeId: this.areaId_,
          nodeName: this.areaname_,
          date: this.$route.query.date ? this.$route.query.date: this.getdate()
        })
        .then(d => {
          let n = d * 100;
          this.useNumber.rate = n.toFixed(2) + "%";
          this.useNumber.m =this.$route.query.date ? this.$route.query.date: this.getdate();
          this.useNumber.m = this.useNumber.m.slice(5, 7);
        });
      api
        .market_areas({
          nodeId: this.areaId_,
          nodeName: this.areaname_,
          date: this.$route.query.date ? this.$route.query.date: this.getdate()
        })
        .then(d => {
          let useareas_ = [];
          let rate_ = [];
          let id_ = [];
          for (let item in d) {
            if (
              Object.prototype.toString
                .call(d[item])
                .slice(8, -1)
                .toLowerCase() === "function"
            ) {
              continue;
            }
            useareas_.push(d[item].bizName);
            rate_.push((d[item].rate * 100).toFixed(2));
            id_.push(d[item].bizId);
          }
          this.useData.name = useareas_;
          this.useData.value = rate_;
          this.useData.id = id_;
          this.useData.date =this.$route.query.date ? this.$route.query.date: this.getdate();
          this.useData.backtitle = this.title + "-";
          this.useData.title  = this.$route.query.date ? this.$route.query.date: this.getdate();
          this.useData.title =this.useData.title.slice(5, 7) + "月溯源数据";
          bar_echart(this.useData, "IMusearea", this.$router);
        });
    },
    get() {
      this.market_rate();
      this.marketNumber();
      this.his();
    }
  },
  mounted: function() {
    //得到数据并且确定id
    if (this.$route.query.areaid) {
       if (!this._isDestroyed) {
          this.areaId_ = this.$route.query.areaid;
          this.areaname_ = this.$route.query.name;
          this.backshow = true;
          this.seldate = this.$route.query.date ? this.$route.query.date: this.getdate();
          this.title = this.$route.query.backtitle + this.$route.query.name;
          this.get();
       };
    } else {
       if (!this._isDestroyed) {
          this.areaId_ = this.$store.state.common.user.regionCode;
          this.backshow = false;
          this.get();
       };
    }
  },
  watch: {
    seldate: function(val, oldVal) {
      this.old = this.getdate(new Date(oldVal));
    }
  },
  data() {
    return {
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
        url: "yb.vendorChart",
        title: "",
        formatter: {
          y: "{value} %",
          tooltip: "%",
          Ttext: "溯源使用率"
        },
        zoomLock: true
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      low: "", //预警
      sourceNunber: "", //纳入总数
      areaId_: "", //区域id
      areaname_: "", //区域名
      seldate: this.getdate(), //日期时间
      old: "", //如果选择器=null，数据还是上一次选择的时间
      dataPage3: [
        {
          area: "好利来",
          marketNum: "55",
          current: "50%",
          lastMonth: "50%",
          currentNum: "250",
          lastMonthNum: "250"
        },
        {
          area: "好利来",
          marketNum: "55",
          current: "50%",
          lastMonth: "50%",
          currentNum: "250",
          lastMonthNum: "250"
        },
        {
          area: "好利来",
          marketNum: "55",
          current: "50%",
          lastMonth: "50%",
          currentNum: "250",
          lastMonthNum: "250"
        },
        {
          area: "好利来",
          marketNum: "55",
          current: "50%",
          lastMonth: "50%",
          currentNum: "250",
          lastMonthNum: "250"
        },
        {
          area: "合计",
          marketNum: "55",
          current: "50%",
          lastMonth: "50%",
          currentNum: "250",
          lastMonthNum: "250"
        }
      ]
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
  height: 1300px !important;
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
.main_content > section {
  background: #fff;
  width: 100%;
  margin-bottom: 20px;
}
.item1 {
  height: 380px;
}
.item1 > .floatL {
  width: 30%;
  height: 100%;
  border-right: 1px #edf0f3 solid;
  padding: 20px;
  box-sizing: border-box;
}
.item1 > .floatL > p {
  color: #393939;
  font-size: 14px;
}
.item1 > .floatL > div {
  color: #9199a7;
  font-size: 14px;
  margin-top: 100px;
}
.item1 > .floatR {
  height: 100%;
  width: 70%;
  padding: 20px;
  box-sizing: border-box;
}
.item1 > .floatR .name {
  width: 20%;
  height: 21px;
  line-height: 21px;
  padding-right: 2%;
  font-size: 14px;
  margin-bottom: 12px;
}
.item1 > .floatR .el-progress {
  width: 78%;
  height: 21px;
  margin-bottom: 12px;
}
.item2 {
  height: 415px;
}
.item2 > .date {
  height: 74px;
  padding: 20px;
  border-bottom: 1px #edf0f3 solid;
}
.item2 .info > .floatL {
  width: 30%;
  height: 340px;
  border-right: 1px #edf0f3 solid;
  padding: 20px;
  box-sizing: border-box;
}
.item2 .info > .floatL > p {
  color: #393939;
  font-size: 14px;
}
.item2 .info > .floatL > div {
  color: #9199a7;
  font-size: 14px;
  margin-top: 100px;
}
.item2 .info > .floatR {
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
.low > .low0 {
  color: #2694ca;
}
.low > .low1 {
  color: #0db5ef;
}
.low > .low2 {
  color: #92e6ff;
}
</style>
