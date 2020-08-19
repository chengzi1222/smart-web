<template>
  <div class="area">
    <div class="page-tilt">
      <b></b><span>新批发市场溯源监管{{ title == '' ? '': (title[0]=="-" ? title :"-"+title ) }}</span>
      <Back v-show="backshow"></Back>
    </div>
    <div class="main_content">
      <!-- 1 -->
      <section class="item1 clear_a">
        <div class="left">
          <div class="floatL">
            <p>溯源纳入情况</p>
            <div class=" clear_a">
              <div class="textR" style="color:#393939;">
                <p><span style="font-size:28px;">{{ sourceNunber }}</span>家</p>
                <p>市场数量</p>
              </div>
              <div class="textL">
                <p><span style="font-size:28px;">{{ totalBiz }}</span>家</p>
                <p>经营者数量</p>
              </div>
            </div>
          </div>
          <div class="floatR ">
            <div class="clear_a" style="height:34px;">
              <span class="fs14 col999"><span class="tipBAR mr10">!</span>点击此柱状图可查询详细溯源信息</span>
              <el-button class="fr btn" type="primary" @click="go">综合查询分析</el-button>
            </div>
            <div style="width:100%;height:88%" id="inquireBar1">
              <div class="partlyLoading">
                <div>拼命加载中...</div>
              </div>
            </div>
          </div>
        </div>
        <div class="right fr boxSB">
          <p class="fs14 col39 mb20">
            当月低溯源预警
            <!-- <el-tooltip class="item" effect="dark" content="按最近30天内溯源排名" placement="top-start">
              <span class="tip">!</span>
            </el-tooltip> -->
          </p>
          <div v-for="(item,index) in low" :key="index" class="low" :data-guid="item.areaId">
            <p :class="'low'+index">No.{{ index+1 }}</p>
            <div class="clear_a">
              <el-tooltip class="item" effect="dark" :content="item.areaName" placement="top-start">
                <div class="name textell">{{ item.areaName }}</div>
              </el-tooltip>
              <el-progress :stroke-width="18" :percentage="item.rate"></el-progress>
            </div>
          </div>
        </div>
      </section>
      <!-- 2 -->
      <section class="item2">
        <div class="date boxSB">
          <el-date-picker v-model="seldate" type="month" @change="use_()" :clearable="false" placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="info">
          <div class="floatL">
            <p>{{ useNumber.m }}月溯源平台使用情况</p>
            <div style="text-align: center;">
              <p><span style="color:#393939;font-size:36px;">{{ useNumber.rate }}</span></p>
              <p>各区县排名第 <span class="rankNumber" @click="ranking"> {{ rank }} </span>名</p>
            </div>
          </div>
          <div class="floatR">
            <div style="width:100%;height:100%;" id="inquireUsearea">
              <div class="partlyLoading">
                <div>拼命加载中...</div>
              </div>
            </div>
          </div>
        </div>

      </section>
      <!-- 3 -->
      <section class="item3 boxSB">
        <div style="width:100%;height:100%;" id="inquireHis">
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
      <section class="item5" v-show="is_det" key="c">
        <div class="date boxSB">
          <el-date-picker v-model="det_date" type="month" @change="check_()" :clearable="false" placeholder="选择日期"
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
              <el-table-column show-overflow-tooltip prop="goodsName" min-width="200" label="品种" align="left">
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="rate" min-width="100" label="不合格率" align="center">
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="total" min-width="100" label="检测总批次" align="center">
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="qua" min-width="100" label="合格批次" align="center">
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="unqua" min-width="100" label="不合格批次" align="center">
              </el-table-column>
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
      <section class="item6" v-show="is_det" key="b">
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
        <h3>区县使用率排行<a :href="derive" class="w65 dc godown" target="_blank" download="filename"
            style="display: inline-block">导出</a> <span style="float: right;margin-right: 10px;cursor: pointer;"
            @click="ranking">X</span></h3>
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
  import Back from "utils/back";
  import config from "utils/config";
  import { pie_echart, bar_echart, bar2_echart } from "./echarts/echarts";
  import { getNodeBussCount, getAreaSNode, getAreaTraceTop, getAreaSTraceVo, getAreaSTraceVoHistory, getAreaOwnRank,
           getRealTimeTrace, getRiskVariety, getMonthDetec, getRealDetec, getAreaTraceRank } from 'api/trace/newfarm';
  import scrollTop from "../dlr/slider";
  export default {
    components: {
      Back
    },
    methods: {
      getNodeBussCount() { //节点和经营者总数
        let params = {
          areaId: this.areaId_,
          nodeType: 'WHOLESALE'
        }
        getNodeBussCount(params).then(r => {
          if (r.status) {
            this.sourceNunber = r.data.nodeNum;
            this.totalBiz = r.data.bussNum;
          }
        })
      },
      getAreaSNode() { //各个区域下的节点个数统计
        let params = {
          areaId: this.areaId_,
          nodeType: 'WHOLESALE'
        }
        getAreaSNode(params).then(r => {
          if (r.status) {
            let name_ = [], data_ = [], id_ = [];
            for (let i = 0; i < r.data.length; i++) {
              name_.push(r.data[i].areaName);
              data_.push(r.data[i].cnt);
              id_.push(r.data[i].areaId);
            }
            this.bar1Data.name = name_;
            this.bar1Data.value = data_;
            this.bar1Data.id = id_;
            this.bar1Data.date = this.getdate();
            this.bar1Data.backtitle = this.title + "-"; //现在要把backtitle传过去，
            bar_echart(this.bar1Data, "inquireBar1", this.$router);
          }
        })
      },
      getAreaTraceTop() { //当月低溯源预警
        let params = {
          areaId: this.areaId_,
          nodeType: 'WHOLESALE'
        }
        getAreaTraceTop(params).then(r => {
          if (r.status) {
            this.low = r.data;
          }
        })
      },
      getAreaSTraceVo() { //区域溯源率
        let params = {
          areaId: this.areaId_,
          nodeType: 'WHOLESALE',
          date: this.seldate
        }
        getAreaSTraceVo(params).then(r => {
          if (r.status) {
            this.useNumber.rate = r.data.rate + "%";
            this.useNumber.m = this.seldate.slice(5, 7);
            let useareas_ = [], rate_ = [], id_ = [];
            for (let i = 0; i < r.data.childArea.length; i++) {
              useareas_.push(r.data.childArea[i].areaName);
              rate_.push(r.data.childArea[i].rate);
              id_.push(r.data.childArea[i].areaId);
            }
            this.useData.name = useareas_;
            this.useData.value = rate_;
            this.useData.date = this.seldate;
            this.useData.id = id_;
            this.useData.backtitle = this.title + "-";
            this.useData.title = this.seldate.slice(5, 7) + "月溯源数据";
            bar_echart(this.useData, "inquireUsearea", this.$router);
          }
        })
      },
      getAreaSTraceVoHistory() { //区域历史12个月溯源率
        let params = {
          areaId: this.areaId_,
          nodeType: 'WHOLESALE'
        }
        getAreaSTraceVoHistory(params).then(r => {
          if (r.status) {
            let hisData = [];
            let hisRate = [];
            for (let i = 0; i < r.data.length; i++) {
              hisData.push(r.data[i].month);
              hisRate.push(r.data[i].rate);
            }
            this.hisData.name = hisData.reverse();
            this.hisData.value = hisRate.reverse();
            bar_echart(this.hisData, "inquireHis", this.$router);
          }
        })
      },
      getRealTimeTrace() { //实时溯源数据
        let params = {
          areaId: this.areaId_,
          nodeType: 'WHOLESALE'
        }
        getRealTimeTrace(params).then(r => {
          if (r.status) {
            let new_ = [];
            for (let i = 0; i < r.data.length; i++) {
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
          areaId: this.areaId_,
          nodeType: 'WHOLESALE',
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
          areaId: this.areaId_,
          nodeType: 'WHOLESALE',
          date: this.det_date
        }
        getMonthDetec(params).then(r => {
          if (r.status) {
            let name = [];
            let result = [];
            let fail = [];
            for (let i = 0; i < r.data.length; i++) {
              name.push(r.data[i].areaName);
              result.push(r.data[i].qua * 1);
              fail.push(r.data[i].unqua * 1);
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
          areaId: this.areaId_,
          nodeType: 'WHOLESALE'
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
          areaId: this.areaId_,
          nodeType: 'WHOLESALE',
          date: this.seldate
        }
        getAreaTraceRank(params).then(r => {
          if (r.status) {
            this.rankData = r.data;
          }
        })
      },
      getAreaOwnRank() { //排名
        let params = {
          areaId: this.areaId_,
          nodeType: 'WHOLESALE',
          date: this.seldate
        }
        getAreaOwnRank(params).then(r => {
          if (r.status) {
            this.rank = r.data ? r.data : '0';
          }
        })
      },
      cb(timerObj) {
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
      ranking() {
        //排名弹框
        this.rankList = !this.rankList;
      },
      go() {
        //点击按钮是综合查询表格
        this.$router.push({ name: "yb.newanalyzeInfo" });
      },
      //排名导出
      down() {
        this.derive = encodeURI(`${config.newExport}/trace/supervise/area/trace/rank/export?areaId=${this.areaId_}&date=${this.seldate}&nodeType=WHOLESALE`);
      },
      use_() {
        this.seldate = this.getdate(this.seldate)
        this.down();
        //改变日期做的事
        this.getAreaSTraceVo();
        this.getAreaOwnRank();
        this.getAreaTraceRank();
      },
      check_() {
        this.det_date = this.getdate(this.det_date);
        this.getRiskVariety();
        this.getMonthDetec();
      },
      get() {
        this.getNodeBussCount();//溯源纳入情况总数
        this.getAreaSNode();//溯源纳入情况图表
        this.getAreaTraceTop();//低溯源预警
        this.getAreaSTraceVo();// 使用率
        this.getAreaTraceRank();  //区域溯源率排名
        this.getAreaSTraceVoHistory();//历史情况
        this.getRealTimeTrace()//实时溯源数据
        this.getRiskVariety();//风险品种
        this.getMonthDetec();//某个月的检测数据
        this.getRealDetec() //检测实时数据
        this.getAreaOwnRank();//排名
      }
    },
    mounted: function () {
      //判断这个页面是用户直接进来，还是上一层页面进来,并且确定id
      if (this.$route.query.areaid) {
        if (!this._isDestroyed) {
          this.areaId_ = this.$route.query.areaid;
          this.backshow = true;
          this.seldate = this.$route.query.date ? this.$route.query.date : this.getdate();
          this.title = this.$route.query.name;
          this.get();
        };
      } else {
        if (!this._isDestroyed) {
          this.areaId_ = this.$store.state.common.user.areaCode;
          this.backshow = false;
          this.get();
        };
      }
      this.down();
    },
    watch: {
      seldate: function (val, oldVal) {
        this.old = this.getdate(new Date(oldVal));
      }
    },
    data() {
      return {
        risk_: [], //风险品种
        is_det: true,
        timer: [],//定时器
        newdata_: [], //实时动态数据
        det_date: this.getdate(),//检测日期
        realTimeCheck_data: [],//动态检测情况
        pieData: {
          nameArray: ["合格", "不合格"],
          dataArray: [
            { name: "合格", value: "5565" },
            { name: "不合格", value: "556" }
          ],
          title: "检测情况",
          subtitle: ""
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
        derive: "",
        title: "", //标题
        sourceNunber: "0", //溯源纳入总数
        seldate: this.getdate(), //日期时间
        old: "", //如果选择器=null，数据还是上一次选择的时间
        areaId_: "", //用户id
        backshow: false, //是否显示back
        rank: "0", //排名
        rankList: false, //排名list
        rankData: [], //排名数据
        totalBiz: 0,//经营者数量
        useNumber: {
          rate: "0%",
          m: "0"
        }, //使用率
        useData: {
          //使用图表
          title: "",
          url: "yb.newstreetChart",
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
        low: [], //预警top5
        bar1Data: {
          title: "",
          url: "yb.newstreetChart",
          formatter: {
            y: "{value} 家",
            tooltip: "家",
            Ttext: "主体数量"
          },
          zoomLock: true
        },
        dataPage3: []
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
    background: transparent !important;
  }
  .item1>.left {
    height: 100%;
    width: 71%;
    background: #fff;
    margin-right: 20px;
  }
  .item1>.right {
    height: 100%;
    width: calc(29% - 20px);
    background: #fff;
    padding: 20px;
  }
  .item1>.left>.floatL {
    width: 30%;
    height: 100%;
    border-right: 1px #edf0f3 dashed;
    padding: 20px;
    box-sizing: border-box;
  }
  .item1>.left>.floatL>p {
    color: #393939;
    font-size: 14px;
  }
  .item1>.left>.floatL>div {
    color: #9199a7;
    font-size: 14px;
    margin-top: 100px;
  }
  .item1 .left>.floatL>div>div {
    width: 44%;
    padding: 0 3%;
  }
  .item1 .left>.floatL>div>div.textR {
    width: 43%;
    border-right: 1px solid #393939;
  }
  .item1>.left>.floatR {
    height: 100%;
    width: 70%;
    padding: 20px 20px 10px 20px;
    box-sizing: border-box;
  }
  .item1>.right .name {
    width: 33%;
    height: 21px;
    line-height: 21px;
    padding-right: 2%;
    font-size: 14px;
    margin-bottom: 12px;
  }
  .item1>.right .el-progress {
    width: 65%;
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
    min-height: 310px;
  }
  .item5 .info>.floatL {
    width: 30%;
    height: 310px;
    border-right: 1px #edf0f3 solid;
    padding: 20px;
    box-sizing: border-box;
  }
  .item5 .info>.floatR {
    height: 310px;
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
  .low {
    width: 100%;
    height: 50px;
  }
  .low>p {
    font-size: 14px;
    color: #393939;
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
    min-height: 820px;
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