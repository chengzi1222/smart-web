<template>
  <div class="city">
    <div class="page-tilt">
      <b></b><span>新农贸市场溯源监管</span>
    </div>
    <div class="main_content">
      <!-- 1 -->
      <section class="item1 clearfix">
        <div class="floatL">
          <p>溯源纳入情况</p>
          <div class=" clear_a">
            <div class="textR" style="color:#393939;">
              <p><span style="font-size:30px;">{{ sourceNunber }}</span>家</p>
              <p>市场数量</p>
            </div>
            <div class="textL">
              <p><span style="font-size:30px;">{{ totalBiz }}</span>家</p>
              <p>经营者数量</p>
            </div>
          </div>
        </div>
        <div class="floatR">
          <div class="inquireBtn  relative">
            <span class="fs14 col999"><span class="tipBAR mr10">!</span>点击此柱状图可查询详细溯源信息</span>
            <el-button class="absolute btn" type="primary" @click="go">综合查询分析</el-button>
          </div>
          <div style="width:100%;height:calc(100% - 44px);" id="bar1">
            <div class="partlyLoading">
              <div>拼命加载中...</div>
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
            <p>
              {{ useNumber.m }}月溯源平台使用情况
              <span class="areaRankBtn fr" @click="areaRank">区域排名</span>
            </p>
            <div style="text-align: center;">
              <p style="color:#393939;font-size:36px;">{{ useNumber.rate }}</p>
              <p>溯源平台使用率</p>
            </div>
          </div>
          <div class="floatR">
            <div style="width:100%;height:100%;" id="usearea">
              <div class="partlyLoading">
                <div>拼命加载中...</div>
              </div>
            </div>
          </div>
        </div>

      </section>
      <!-- 3 -->
      <section class="item3 boxSB">
        <div style="width:100%;height:100%;" id="his">
          <div class="partlyLoading">
            <div>拼命加载中...</div>
          </div>
        </div>
      </section>
      <!-- 4 -->
      <section class="item4 boxSB">
        <p class="fs14 col39 mb20">实时溯源数据</p>
        <div class="tableBox">
          <ul class="tHead">
            <li class="td1">主体</li>
            <li class="td2">所属区县</li>
            <li class="td3">商品</li>
            <li class="td4">上游信息</li>
            <li class="td5">发生时间</li>
          </ul>
          <div class="tBodyBox" id="tBodyBox">
            <div class="tBody" id="tBody">
              <ul v-for="(item,index) in newdata_" :key="index">
                <el-tooltip class="item" effect="dark" :content="item.market" placement="top-start">
                  <li class="td1">{{item.market}}</li>
                </el-tooltip>
                <li class="td2">{{item.area}}</li>
                <el-tooltip class="item" effect="dark" :content="item.goods" placement="top-start">
                  <li class="td3">{{item.goods}}</li>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="item.from" placement="top-start">
                  <li class="td4">{{item.from}}</li>
                </el-tooltip>
                <li class="td5">{{item.date}}</li>
              </ul>
            </div>
            <div class="tBody" id="tBody2">
              <ul v-for="(item,index) in newdata_" :key="index+1">
                <el-tooltip class="item" effect="dark" :content="item.market" placement="top-start">
                  <li class="td1">{{item.market}}</li>
                </el-tooltip>
                <li class="td2">{{item.area}}</li>
                <el-tooltip class="item" effect="dark" :content="item.goods" placement="top-start">
                  <li class="td3">{{item.goods}}</li>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="item.from" placement="top-start">
                  <li class="td4">{{item.from}}</li>
                </el-tooltip>
                <li class="td5">{{item.date}}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <!-- 5 -->
      <section class="item5" key="c">
        <div class="date boxSB">
          <el-date-picker v-model="det_date" type="month" @change="check_" :clearable="false" placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="info">
          <div class="floatL relative">
            <div style="width:100%;height:100%;" id="piebox">
              <div class="partlyLoading">
                <div>拼命加载中...</div>
              </div>
            </div>
          </div>
          <div class="floatR boxSB">
            <div class="fs14 col39 mb20">风险品种</div>
            <el-table :data="risk_" class="table-div">
              <el-table-column show-overflow-tooltip prop="goodsName" min-width="200" label="品种" align="left"></el-table-column>
              <el-table-column show-overflow-tooltip prop="rate" min-width="100" label="不合格率" align="center"></el-table-column>
              <el-table-column show-overflow-tooltip prop="total" min-width="100" label="检测总批次" align="center"></el-table-column>
              <el-table-column show-overflow-tooltip prop="qua" min-width="100" label="合格批次" align="center"></el-table-column>
              <el-table-column show-overflow-tooltip prop="unqua" min-width="100" label="不合格批次" align="center"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="item5Box boxSB" id="bar2">
          <div class="partlyLoading">
            <div>拼命加载中...</div>
          </div>
        </div>
      </section>
      <!-- 6 -->
      <section class="item6" key="b">
        <p class="fs14 col39 mb20">实时检测数据</p>
        <div class="tableBox tableBox2">
          <ul class="tHead">
            <li class="td1">主体</li>
            <li class="td2">所属区县</li>
            <li class="td3">商品</li>
            <li class="td4">检测类型</li>
            <li class="td5">检测值</li>
            <li class="td6">检测结果</li>
            <li class="td7">检测时间</li>
          </ul>
          <div class="tBodyBox" id="tBodyBox2">
            <div class="tBody" id="tBody3">
              <ul v-for="(item,index) in realTimeCheck_data" :key="index+2">
                <el-tooltip class="item" effect="dark" :content="item.marketName" placement="top-start">
                  <li class="td1">{{item.marketName}}</li>
                </el-tooltip>
                <li class="td2">{{item.areaName}}</li>
                <el-tooltip class="item" effect="dark" :content="item.goodsName" placement="top-start">
                  <li class="td3">{{item.goodsName}}</li>
                </el-tooltip>
                <li class="td4">{{item.detecType}}</li>
                <li class="td5">{{item.displayVal ? item.displayVal : "暂无"}}</li>
                <li class="td6">{{item.detecResult}}</li>
                <li class="td7">{{item.detecTime}}</li>
              </ul>
            </div>
            <div class="tBody" id="tBody4">
              <ul v-for="(item,index) in realTimeCheck_data" :key="index+2">
                <el-tooltip class="item" effect="dark" :content="item.marketName" placement="top-start">
                  <li class="td1">{{item.marketName}}</li>
                </el-tooltip>
                <li class="td2">{{item.areaName}}</li>
                <el-tooltip class="item" effect="dark" :content="item.goodsName" placement="top-start">
                  <li class="td3">{{item.goodsName}}</li>
                </el-tooltip>
                <li class="td4">{{item.detecType}}</li>
                <li class="td5">{{item.displayVal ? item.displayVal : "暂无"}}</li>
                <li class="td6">{{item.detecResult}}</li>
                <li class="td7">{{item.detecTime}}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
    <!-- 排名list -->
    <div v-if="rankList" class="rankBox">
      <div class="rank">
        <h3>
          区县使用率排行
          <a :href="derive" class="w65 dc godown" target="_blank" download="filename"
            style="display: inline-block">导出</a>
          <span style="float: right;margin-right: 10px;cursor: pointer;" @click="areaRank">X</span>
        </h3>
        <p v-for="(item,idnex) in rankData" :class="item.areaId == areaId_ ? 'theIs': '' " :key="idnex">
          <span style="text-align: center;width: 70px;">{{item.rank}}</span>
          <span style="width: 160px;">{{item.areaName}}</span>
          <span class="biBo" style="margin-bottom: -5px;"><span :style="'width:' + item.rate + '%'"
              class="smBo"></span></span>
          <span style="width: 190px;text-align: center;">{{ item.rate }}%</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import { pie_echart, bar_echart, bar2_echart, barline_echart } from "../inquire/echarts/echarts";
  import { getNodeBussCount, getAreaSNode, getAreaSTraceVo, getAreaSTraceVoHistory, getRealTimeTrace,
           getRiskVariety, getMonthDetec, getRealDetec, getAreaTraceRank } from 'api/trace/newfarm';
  import scrollTop from "../dlr/slider";
  import config from "utils/config";
  export default {
    methods: {
      getNodeBussCount(){ //节点和经营者总数
        let params = {
          areaId: this.$store.state.common.user.areaCode,
          nodeType: 'FARMER'
        }
        getNodeBussCount(params).then(r=>{
          if(r.status){
            this.sourceNunber = r.data.nodeNum;
            this.totalBiz = r.data.bussNum;
          }
        })
      },
      getAreaSNode() { //各个区域下的节点个数统计
        let params = {
          areaId: this.$store.state.common.user.areaCode,
          nodeType: 'FARMER'
        }
        getAreaSNode(params).then(r => {
          if (r.status) {
            let name_ = [],data_ = [],id_ = [];
            for (let i=0; i<r.data.length;i++) {
              name_.push(r.data[i].areaName);
              data_.push(r.data[i].cnt);
              id_.push(r.data[i].areaId);
            }
            this.bar1Data.name = name_;
            this.bar1Data.value = data_;
            this.bar1Data.id = id_;
            this.bar1Data.date = this.seldate;
            if (!this._isDestroyed) {
              bar_echart(this.bar1Data, "bar1", this.$router);
            }
          }
        })
      },
      getAreaSTraceVo() { //区域溯源率
        let params = {
          areaId: this.$store.state.common.user.areaCode,
          nodeType: 'FARMER',
          date: this.seldate
        }
        getAreaSTraceVo(params).then(r => {
          if (r.status) {
            this.useNumber.rate = r.data.rate + "%";
            this.useNumber.m = this.seldate.slice(5, 7);
            let useareas_ = [], rate_ = [], id_ = [];
            for (let i=0;i<r.data.childArea.length; i++) {
              useareas_.push(r.data.childArea[i].areaName);
              rate_.push(r.data.childArea[i].rate);
              id_.push(r.data.childArea[i].areaId);
            }
            this.useData.name = useareas_;
            this.useData.value = rate_;
            this.useData.date = this.seldate;
            this.useData.id = id_;
            this.useData.title = this.seldate.slice(5, 7) + "月溯源数据";
            if (!this._isDestroyed) {
              bar_echart(this.useData, "usearea", this.$router);
            }
          }
        })
      }, 
      getAreaSTraceVoHistory() { //区域历史12个月溯源率
        let params = {
          areaId: this.$store.state.common.user.areaCode,
          nodeType: 'FARMER'
        }
        getAreaSTraceVoHistory(params).then(r => {
          if (r.status) {
            let hisData = [];
            let hisRate = [];
            for (let i=0;i<r.data.length;i++) {
              hisData.push(r.data[i].month);
              hisRate.push(r.data[i].rate);
            }
            this.hisData.name = hisData.reverse();
            this.hisData.value = hisRate.reverse();
            if (!this._isDestroyed) {
              bar_echart(this.hisData, "his", this.$router);
            }
          }
        })
      }, 
      getRealTimeTrace() { //实时溯源数据
        let params = {
          areaId: this.$store.state.common.user.areaCode,
          nodeType: 'FARMER'
        }
        getRealTimeTrace(params).then(r => {
          if (r.status) {
            let new_ = [];
            for (let i=0;i<r.data.length;i++) {
              new_.push(r.data[i]);
            }
            this.newdata_ = new_;
            this.$nextTick(() => {
              if (this._isDestroyed) return;
              scrollTop("tBodyBox", "tBody", "tBody2", this.cb);
            });
          }
        })
      },
      getRiskVariety() { //风险品种
        let params = {
          areaId: this.$store.state.common.user.areaCode,
          nodeType: 'FARMER',
          date: this.det_date
        }
        getRiskVariety(params).then(r => {
          if (r.status) {
            this.pieData.dataArray = [
              { name: "合格", value: r.data.quaTotal },
              { name: "不合格", value: r.data.unQuaTotal }
            ];
            this.pieData.subtitle = "检测总批次（" + r.data.detecTotal + "次)";
            if (!this._isDestroyed) {
              pie_echart(this.pieData, "piebox");
            }
            this.risk_ = r.data.riksVar;
          }
        })
      },
      getMonthDetec() { //某个月的检测数据
        let params = {
          areaId: this.$store.state.common.user.areaCode,
          nodeType: 'FARMER',
          date: this.det_date
        }
        getMonthDetec(params).then(r => {
          if (r.status) {
            let name = [];
            let result = [];
            let fail = [];
            for (let i=0;i<r.data.length;i++) {
              name.push(r.data[i].areaName);
              result.push(r.data[i].qua*1);
              fail.push(r.data[i].unqua*1);
            }
            this.bar2Data.nameArray = name;
            this.bar2Data.resultdata.data = result;
            this.bar2Data.faildata.data = fail;
            this.bar2Data.num = this.det_date.slice(5, 7);
            if (!this._isDestroyed) {
              bar2_echart(this.bar2Data, "bar2");
            }
          }
        })
      }, 
      getRealDetec() { //实时检测数据
        let params = {
          areaId: this.$store.state.common.user.areaCode,
          nodeType: 'FARMER'
        }
        getRealDetec(params).then(r => {
          if (r.status) {
            this.realTimeCheck_data = r.data;
            this.$nextTick(() => {
              if (this._isDestroyed) return
              scrollTop("tBodyBox2", "tBody3", "tBody4", this.cb)
            })
          }
        })
      },
      getAreaTraceRank() { //区域溯源率排名
        let params = {
          areaId: this.$store.state.common.user.areaCode,
          nodeType: 'FARMER',
          date: this.seldate
        }
        getAreaTraceRank(params).then(r => {
          if (r.status) {
            this.rankData = r.data;
          }
        })
      },
      areaRank() {
        this.rankList = !this.rankList;
      },
      cb(timerObj) {
        //处理定时器泄漏
        const prev = timerObj.prev;
        const current = timerObj.current;
        if (prev) {
          let index = this.timer.indexOf(prev);
          if (~index) {
            this.timer.splice(index, 1);
          }
        }
        if (current) {
          if (!this.timer.includes(current)) this.timer.push(current);
        }
        // timerObj=null;
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
      //排名导出
      down() {
        this.derive = encodeURI(`${config.newExport}/trace/supervise/area/trace/rank/export?areaId=${this.$store.state.common.user.areaCode}&date=${this.seldate}&nodeType=FARMER`);
      },
      check_() {
        this.det_date = this.getdate(this.det_date);
        this.getRiskVariety();
        this.getMonthDetec();
      },
      use_() {
        this.seldate = this.getdate(this.seldate);
        this.down();
        this.getAreaSTraceVo();
        this.getAreaTraceRank();
      }
    },
    watch: {
      seldate: function (val, oldVal) {
        this.old = this.getdate(new Date(oldVal));
      }
    },
    mounted() {
      setTimeout(() => {
        this.getNodeBussCount();
        this.getAreaSNode();
        this.getAreaSTraceVo();
        this.getAreaSTraceVoHistory();
        this.getRealTimeTrace();
        this.getRiskVariety();
        this.getMonthDetec();
        this.getRealDetec();
        this.down();
        this.getAreaTraceRank();
      }, 1500);
    },
    beforeDestroy() {
      this.timer.forEach(item => {
        clearInterval(item);
        item = null;
      });
    },
    data() {
      return {
        derive: "",
        timer: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6;
          }
        },
        rankList: false, //排名list
        rankData: [], //排名数据
        sourceNunber: 0, //溯源纳入情况
        newdata_: [], //实时动态数据
        useNumber: {
          rate: "0%",
          m: "0"
        }, //使用率
        totalBiz: 0,//经营者数量
        risk_: [], //风险品种
        realTimeCheck_data: [],//动态检测情况
        seldate: this.getdate(), //日期时间
        det_date: this.getdate(),//检测日期
        old: "", //如果选择器=null，数据还是上一次选择的时间
        areaId_: "", //地区id
        dataPage2: [
          {
            vendor: "张家院子小卖店张家院子小卖店张家院子小",
            area: "高新区",
            pdt: "胡萝卜",
            checkType: "萝卜",
            num: "南城市场",
            topinfo: "南城市场",
            result: "及格",
            date: "2018-2-28 12:55"
          }
        ],
        dataPage3: [
          {
            area: "合计",
            marketNum: "55",
            vendorNum: "55",
            current: "50%",
            lastMonth: "50%",
            currentNum: "250",
            lastMonthNum: "250"
          }
        ],
        pieData: {
          nameArray: ["合格", "不合格"],
          dataArray: [
            { name: "合格", value: "5565" },
            { name: "不合格", value: "556" }
          ],
          title: "检测情况",
          subtitle: ""
        },
        useData: {
          title: "",
          url: "yb.newfarmAreaChart",
          formatter: {
            y: "{value} %",
            tooltip: "%",
            Ttext: "溯源使用率"
          },
          zoomLock: true
        },
        hisData: {
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
        bar1Data: {
          title: "",
          url: "yb.newfarmAreaChart",
          formatter: {
            y: "{value} 家",
            tooltip: "家",
            Ttext: "主体数量"
          },
          zoomLock: true
        },
        bar2Data: {
          nameArray: ["合格1", "不合格2", "合格3", "不合格4", "合格5", "不合格"],
          resultdata: {
            name: "合格",
            data: ["5555", "55", "881", "785", "788", "445"]
          },
          faildata: {
            name: "不合格",
            data: ["155", "15", "120", "350", "450", "280"]
          }
        },
        barlineData: {
          title: "历史溯源33333",
          bar: {
            name: "实际数量",
            data: [2.6,5.9,9.0,26.4,28.7,70.7,175.6,182.2,48.7,18.8,6.0,3]
          },
          line: {
            name: "使用率",
            data: [2.6,5.9,9.0,26.4,28.7,70.7,175.6,182.2,48.7,18.8,6.0,3]
          },
          xAxis: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
        }
      };
    }
  };
</script>

<style scoped lang="sass">
  .city {
    background: #edf0f3;
    width: calc(100% + 40px);
    position: relative;
    left: -20px;
    height: 2750px !important;
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
    height: 340px;
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
  .item1>.floatL>div>div {
    width: 44%;
    padding: 0 3%;
  }
  .item1>.floatL>div>div.textR {
    width: 43%;
    border-right: 1px solid #393939;
  }
  .item1>.floatR {
    height: 100%;
    width: 70%;
    padding: 20px 20px 0px 20px;
    box-sizing: border-box;
  }
  .inquireBtn {
    height: 34px;
  }
  .inquireBtn>.btn {
    right: 0;
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
  .item4 {
    min-height: 288px;
    padding: 20px;
  }
  .item5 {
    height: 724px;
  }
  .item5>.date {
    height: 74px;
    padding: 20px;
    border-bottom: 1px #edf0f3 solid;
  }
  .item5 .info {
    border-bottom: 1px #edf0f3 solid;
    min-height: 280px;
  }
  .item5 .info>.floatL {
    width: 30%;
    height: 280px;
    border-right: 1px #edf0f3 solid;
    padding: 20px;
    box-sizing: border-box;
  }
  .item5 .info>.floatR {
    height: 280px;
    width: 70%;
    padding: 20px;
    box-sizing: border-box;
  }
  .item5>.item5Box {
    height: 340px;
    padding: 20px;
  }
  .item6,
  .item7 {
    min-height: 288px;
    padding: 20px;
    box-sizing: border-box;
  }
  /*滚动表格*/
  .tableBox {
    width: 100%;
    height: 255px;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    width: 100%;
    max-width: 100%;
    border: 1px solid #ebeef5;
    /*border-bottom: 0!important;*/
  }
  .tableBox .tHead {
    height: 45px;
    line-height: 45px;
    background: #f1f4f7;
    color: #909399;
    font-weight: 100;
    font-size: 12px;
  }
  .tableBox li {
    padding: 0 5px;
    box-sizing: border-box;
    text-align: left;
    float: left;
    list-style: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tableBox ul:after {
    content: "";
    clear: both;
    display: block;
    height: 0;
  }
  .tBodyBox {
    height: 210px;
    overflow: hidden;
    transition: all 0.5s;
    -moz-transition: all 0.5s;
    -webkit-transition: all 0.5s;
    -o-transition: all 0.5s;
  }
  .tBody {
    width: 100%;
    min-height: 755px;
  }
  .tBody ul {
    border-bottom: 1px solid #ebeef5;
    line-height: 41px;
    height: 41px;
    color: #787878;
    font-size: 14px;
  }
  .tBody ul:hover {
    background: #f4f6f9;
  }
  .td1 {
    width: 25%;
  }
  .td2 {
    width: 10%;
  }
  .td3 {
    width: 25%;
  }
  .td4 {
    width: 20%;
  }
  .td5 {
    width: 20%;
    text-align: center !important;
  }
  /*排名*/
  .rankBox {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(155, 155, 155, .5);
    z-index: 9999;
    overflow: auto;
    padding-bottom: 20px;
  }
  .rank {
    background-color: #fff;
    width: 900px;
    margin: 80px auto 0;
    border-radius: 5px;
    color: #7c7d7e;
    padding-bottom: 20px;

    h3 {
      font-size: 18px;
      font-weight: 500;
      padding: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #ccc;
    }
    p {
      margin: 5px 0;
      line-height: 40px;
      height: 40px;
      padding: 0 28px;

      span {
        display: inline-block;
      }
    }
  }
  .biBo {
    width: 400px;
    display: inline-block;
    background-color: #c0c0c0;
    position: relative;
    height: 20px;
  }
  .smBo {
    display: inline-block;
    background-color: #f05050;
    position: absolute;
    left: 0;
    top: 0;
    height: 20px;
  }
  .theIs {
    background-color: #ccc;
  }
  .rotate360 {
    transform: rotateX(180deg);
  }
  .col5e {
    color: #32c25e;
  }
  .col3b {
    color: #fa503b;
  }
  .areaRankBtn {
    color: rgb(13, 181, 239);
    cursor: pointer;
    font-size: 14px;
    width: 65px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border: 1px solid rgb(13, 181, 239);
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    border-radius: 3px;

  }
  .areaRankBtn:hover {
    background: rgba(13, 181, 239, 0.3);
    border: 1px solid rgba(13, 181, 239, 0.3);
    color: #fff;
  }
  .tableBox2 .td1 {
    width: 20%;
  }
  .tableBox2 .td2 {
    width: 15%;
  }
  .tableBox2 .td3 {
    width: 20%;
  }
  .tableBox2 .td4 {
    width: 10%;
  }
  .tableBox2 .td5 {
    width: 10%;
  }
  .tableBox2 .td6 {
    width: 10%;
  }
  .tableBox2 .td7 {
    width: 15%;
    text-align: center !important;
  }
</style>