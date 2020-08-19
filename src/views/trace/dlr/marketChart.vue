<template>
    <div class="area">
        <div class="page-tilt">
            <b></b><span>配送商溯源监管{{ title == '' ? '': (title[0]=="-" ? title :"-"+title ) }}</span><Back v-show="backshow"></Back>
        </div>
        <div class="main_content">
            <!-- 1 -->
           <section class="item1 clearfix">
                <div class="floatL">
                    <p>溯源纳入情况</p>
                    <div class="textC">
                        <p><span style="color:#393939;font-size:36px;">{{ sourceNunber }}</span>家</p>
                        <p>配送商数量</p>
                    </div>
                </div>
                <div class="floatR">
                        <el-button class="fr btn" type="primary" @click="go">综合查询分析</el-button>
                        <p class="fs14 col39 mb20" style="margin-top:34px">
                            低溯源预警Top5
                            <el-tooltip class="item" effect="dark" content="按最近30天内溯源排名" placement="top-start">
                              <span class="tip">!</span>
                            </el-tooltip>
                        </p>
                         <div v-for="(item,index) in low" :key="index" class="low movePoin" @click="lowclick(item.sellerCode,item.deptName)">
                            <p :class="'low'+index" >No.{{ index+1 }}</p>
                            <div class="clear_a">
                            <el-tooltip class="item" effect="dark" :content="item.deptName" placement="top-start">
                                <div class="name textell">{{ item.deptName }}</div> 
                            </el-tooltip>
                            <el-progress :stroke-width="18" :percentage="item.cc" ></el-progress> 
                            </div>
                        </div>
                </div>
            </section>
            <!-- 2 -->
            <section class="item2">
                <div class="date boxSB">
                    <el-date-picker
                    v-model="seldate"
                    :clearable="false"
                    type="month"
                    @change="use_()"
                    placeholder="选择日期"
                    :picker-options="pickerOptions">
                    </el-date-picker>
                </div>
                <div class="info">
                    <div class="floatL">
                        <p>{{ useNumber.m }}月溯源平台使用情况</p>
                        <div class="textC">
                            <p><span style="color:#393939;font-size:36px;">{{ useNumber.rate }}</span></p>
                            <p>辖区内街道办排名第<span class="rankNumber" @click="ranking"> {{ rank }} </span>名</p>
                        </div>
                    </div>
                    <div class="floatR">
                        <div class="clear_a" style="height:17px;">
                            <span class="fs14 col999"><span class="tipBAR mr10">!</span>点击此柱状图可查询详细溯源信息</span>
                        </div>
                        <div style="width:100%;height:90%;" id="Musearea">
                             <div class="partlyLoading"><div>拼命加载中...</div></div>
                        </div>
                    </div>
                </div>
               
            </section>
            <!-- 3 -->
            <section class="item3 boxSB">
                <div  style="width:100%;height:100%;" id="Mhis">
                     <div class="partlyLoading"><div>拼命加载中...</div></div>
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
                                    <el-tooltip class="item" effect="dark" :content="item.deptName" placement="top-start">
                                         <li class="td1">{{item.deptName}}</li>
                                    </el-tooltip>
                                    <li class="td2">{{item.areaName}}</li>
                                    <el-tooltip class="item" effect="dark" :content="item.pdtName" placement="top-start">
                                        <li class="td3">{{item.pdtName}}</li>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" :content="item.sourceName" placement="top-start">
                                        <li class="td4">{{item.sourceName}}</li>
                                    </el-tooltip>
                                    <li class="td5" >{{item.inputTime}}</li>
                                </ul>
                            </div>
                             <div class="tBody" id="tBody2">
                                <ul v-for="(item,index) in newdata_" :key="index+1">
                                    <el-tooltip class="item" effect="dark" :content="item.deptName" placement="top-start">
                                         <li class="td1">{{item.deptName}}</li>
                                    </el-tooltip>
                                    <li class="td2">{{item.areaName}}</li>
                                    <el-tooltip class="item" effect="dark" :content="item.pdtName" placement="top-start">
                                        <li class="td3">{{item.pdtName}}</li>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" :content="item.sourceName" placement="top-start">
                                        <li class="td4">{{item.sourceName}}</li>
                                    </el-tooltip>
                                    <li class="td5" >{{item.inputTime}}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
            </section>
            <!-- 5 -->
            <section class="item5" >
                 <div class="date boxSB">
                    <el-date-picker
                    v-model="det_date"
                    type="month"
                    @change="check_()"
                    placeholder="选择日期"
                    :clearable="false"
                    :picker-options="pickerOptions">
                    </el-date-picker>
                </div>
                <div class="info">
                    <div class="floatL relative">
                        <div style="width:100%;height:100%;" id="piebox">
                             <div class="partlyLoading"><div>拼命加载中...</div></div>
                        </div>
                    </div>
                    <div class="floatR boxSB">
                        <div class="fs14 col39 mb20">风险品种</div>
                        <el-table :data="risk_" class="textC table-div">
                            <el-table-column show-overflow-tooltip prop="pdtName" min-width="200" label="品种"  align="left"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="rate" min-width="100" label="不合格率" align="center"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="total" min-width="100" label="检测总批次"  align="center"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="qua" min-width="100" label="合格批次"  align="center"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="unqua" min-width="100" label="不合格批次"  align="center"></el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="item5Box boxSB"  id="bar2">
                     <div class="partlyLoading"><div>拼命加载中...</div></div>
                </div>
            </section>
            <!-- 6 -->
            <section class="item6">
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
                                    <el-tooltip class="item" effect="dark" :content="item.deptName" placement="top-start">
                                         <li class="td1">{{item.deptName}}</li>
                                    </el-tooltip>
                                    <li class="td2">{{item.areaName}}</li>
                                    <el-tooltip class="item" effect="dark" :content="item.pdtName" placement="top-start">
                                        <li class="td3">{{item.pdtName}}</li>
                                    </el-tooltip>
                                    <li class="td4">{{item.detecType}}</li>
                                    <li class="td5" >{{item.actualVal}}</li>
                                    <li class="td6">{{item.detecResult}}</li>
                                    <li class="td7" >{{item.detecTime}}</li>
                                </ul>
                            </div>
                            <div class="tBody" id="tBody4">
                                <ul v-for="(item,index) in realTimeCheck_data" :key="index+3">
                                    <el-tooltip class="item" effect="dark" :content="item.deptName" placement="top-start">
                                         <li class="td1">{{item.deptName}}</li>
                                    </el-tooltip>
                                    <li class="td2">{{item.areaName}}</li>
                                    <el-tooltip class="item" effect="dark" :content="item.pdtName" placement="top-start">
                                        <li class="td3">{{item.pdtName}}</li>
                                    </el-tooltip>
                                    <li class="td4">{{item.detecType}}</li>
                                    <li class="td5" >{{item.actualVal}}</li>
                                    <li class="td6">{{item.detecResult}}</li>
                                    <li class="td7" >{{item.detecTime}}</li>
                                </ul>
                            </div>
                        </div>
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
        <!-- 排名list -->
        <div v-if="rankList" class="rankBox">
            <div class="rank">
                <h3>街道使用率排行 
                    <a :href="derive" class="w65 dc godown" target="_blank" download="filename" style="display: inline-block">导出</a>
                    <span style="float: right;margin-right: 10px;cursor: pointer;" @click="ranking">X</span>
                </h3>
                <p v-for="(item,idnex) in rankData" :class="item.streetAreaId == areaId_ ? 'theIs': '' " :key="idnex">
                    <span style="text-align: center;width: 70px;">{{item.rank}}</span>
                    <span style="width: 160px;">{{item.areaName}}</span>
                    <span class="biBo" style="margin-bottom: -5px;"><span :style="'width:' + Math.round(item.cc*100) + '%'" class="smBo"></span></span>
                    <span style="width: 190px;text-align: center;">{{ (item.cc*100).toFixed(2) }}%</span>
                </p >
            </div>
        </div>
    </div>
</template>

<script>
import Back from "utils/back";
import {pie_echart,bar_echart,bar2_echart} from "../inquire/echarts/echarts";
import scrollTop from "./slider";
import * as api1 from "api/trace/dlr";
import config from "utils/config";
export default {
  components: {
    Back
  },
  methods: {
     cb(timerObj){
      const prev = timerObj.prev;
      const current = timerObj.current;
      if(prev){
        let index = this.timer.indexOf(prev);
        if(~index){
          this.timer.splice(index,1);
        }
      }
      if(current){
        if(!this.timer.includes(current)) this.timer.push(current);
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
    go() {
      //点击按钮是综合查询表格
      this.$router.push({ name: "yb.dlrAnalyzeInfo" });
    },
    lowclick(id, stName) {
    },
     check_() {
      api1
        .risk({
          areaId: this.areaId_,
          date: this.getdate(this.det_date),
          type:"jie"
        })
        .then(d => {
          let rd = d.data;
          for (let item in rd) {
            if (
              Object.prototype.toString
                .call(rd[item])
                .slice(8, -1)
                .toLowerCase() === "function"
            ) {
              continue;
            }
            rd[item].rate = rd[item].rate * 100;
            rd[item].rate = rd[item].rate + "%";
          }
          this.risk_ = rd;
        });
      //检测情况
      api1
        .check({
          areaId: this.areaId_,
          date: this.getdate(this.det_date),
          type:"jie"
        })
        .then(d => {
          let name = [];
          let result = [];
          let fail = [];
          let bar2 = d.data.list;
          console.log(d.data);
          for (let item in bar2) {
            if (
              Object.prototype.toString
                .call(bar2[item])
                .slice(8, -1)
                .toLowerCase() === "function"
            ) {
              continue;
            }
            name.push(bar2[item].areaName);
            result.push(bar2[item].qua);
            fail.push(bar2[item].unqua);
          }
          this.bar2Data.nameArray = name;
          this.bar2Data.resultdata.data = result;
          this.bar2Data.faildata.data = fail;
          this.bar2Data.num=this.getdate(this.det_date).slice(5, 7);
          if(!this._isDestroyed) {
             bar2_echart(this.bar2Data, "bar2");
          }
          this.pieData.dataArray = [
            { name: "合格", value: d.data.quaTotal },
            { name: "不合格", value: d.data.unquaTotal }
          ];
          this.pieData.subtitle = "检测总批次（" + d.data.total + "次)";
          if(!this._isDestroyed){
              pie_echart(this.pieData, "piebox");
          } 
        });
    },
    use_() {
      this.down();
      //改变日期做的事
        api1
          .dlrrate({
            streetAreaId: this.areaId_,
            month: this.getdate(this.seldate)
          })
          .then(d => {
            this.down();
            let list = d.data;
            let useareas_ = [];
            let rate_ = [];
            let sellerCode_ = [];
            let bfb = 0;
            for (let item in list) {
              if (
                Object.prototype.toString
                  .call(list[item])
                  .slice(8, -1)
                  .toLowerCase() === "function"
              ) {
                continue;
              }
              bfb = bfb + list[item].cc;
              useareas_.push(list[item].deptName);
              rate_.push((list[item].cc * 100).toFixed(2));
              sellerCode_.push(list[item].sellerCode);
            }
            if (list.length == 0) {
              this.useNumber.rate = "0.00%"; //如果当月没有数据，要处理nan的情况
              this.rank = 0;
            } else {
              let n = bfb / list.length * 100;
              this.useNumber.rate = n.toFixed(2) + "%";
              //排名第几
              api1
                .streetRank({
                  streetAreaId: this.areaId_,
                  month: this.getdate(this.seldate)
                })
                .then(d => {
                  this.rank = Math.ceil(d.data.rownum);
                });
            }
            this.useNumber.m = this.getdate(this.seldate).slice(5, 7);
            this.useData.name = useareas_;
            this.useData.value = rate_;
            this.useData.id = sellerCode_;
            this.useData.date = this.getdate(this.seldate);
            this.useData.backtitle = this.title + "-";
            this.useData.title =
              this.getdate(this.seldate).slice(5, 7) + "月溯源数据";
            bar_echart(this.useData, "Musearea", this.$router);
          });
      //排名列表
      api1
        .rankNumberStreet({
          streetAreaId: this.areaId_,
          month: this.getdate(this.seldate)
        })
        .then(d => {
          this.rankData = d.data;
          this.down();
        });
    },
    //排名导出
    down(){
      if(this.seldate.length == 7){
        this.derive = config.Derive + 'govapi/trace/city/exportstreet?streetAreaId=' + this.areaId_ + '&month=' + this.seldate;
      } else{
        this.derive = config.Derive + 'govapi/trace/city/exportstreet?streetAreaId=' + this.areaId_ + '&month=' + this.getdate(this.seldate);        
      }
    },
    ranking() {
      this.rankList = !this.rankList;
    },
    rowclick(row, event) {
      // console.log(row,event)
      this.$router.push({
        name: "yb.dlrVendorChart",
        query: { selected: "2" }
      });
    },
    //纳入情况
    dlrrate_num() {
      api1
        .streetdlrcount({
          streetAreaId: this.areaId_
        }).then(d => {
            this.sourceNunber = d.data;
        });
      api1
        .dlrrate({
          streetAreaId: this.areaId_,
          month: "",
          orderBy: "TRUE"
        })
        .then(d => {
          let list = d.data.slice(0, 5);
          for (let item in list) {
            if (
              Object.prototype.toString
                .call(list[item])
                .slice(8, -1)
                .toLowerCase() === "function"
            ) {
              continue;
            }
            list[item].cc = list[item].cc * 100;
            list[item].cc = Math.ceil(list[item].cc);
          }
          this.low = list;
        });
    },
    //使用率
    dlrrate() {
      api1
        .dlrrate({
          streetAreaId: this.areaId_,
          month: this.$route.query.date ? this.$route.query.date: this.getdate()
        })
        .then(d => {
          let list = d.data;
          let useareas_ = [];
          let rate_ = [];
          let sellerCode_ = [];
          for (let item in list) {
            if (
              Object.prototype.toString
                .call(list[item])
                .slice(8, -1)
                .toLowerCase() === "function"
            ) {
              continue;
            }
            useareas_.push(list[item].deptName);
            sellerCode_.push(list[item].sellerCode);
            rate_.push((list[item].cc * 100).toFixed(2));
          }
          if (list.length == 0) {
            this.useNumber.rate = "0.00%"; //如果当月没有数据，要处理nan的情况
            this.rank = 0;
          } else {
            //排名
            api1
              .streetRank({
                streetAreaId: this.areaId_,
                month: this.$route.query.date ? this.$route.query.date: this.getdate()
              })
              .then(d => {
                this.rank = Math.ceil(d.data.rownum);
                this.useNumber.rate = (d.data.cc * 100).toFixed(2) + "%";
              });
          }
          this.useNumber.m =this.$route.query.date ? this.$route.query.date: this.getdate();
          this.useNumber.m = this.useNumber.m.slice(5, 7);
          this.useData.name = useareas_;
          this.useData.value = rate_;
          this.useData.id = sellerCode_;
          this.useData.date = this.$route.query.date ? this.$route.query.date: this.getdate();
          this.useData.backtitle = this.title + "-";
          this.useNumber.m =this.$route.query.date ? this.$route.query.date: this.getdate();
          this.useNumber.m = this.useNumber.m.slice(5, 7);
          bar_echart(this.useData, "Musearea", this.$router);
        });
      //排名列表
      api1
        .rankNumberStreet({
          streetAreaId: this.areaId_,
          month: this.$route.query.date ? this.$route.query.date: this.getdate()
        })
        .then(d => {
          this.rankData = d.data;
          this.down();
        });
    },
    getHis() {
      //历史
      api1
        .streethis({
          streetAreaId: this.areaId_
        })
        .then(d => {
          let hisData = [];
          let hisRate = [];
          let list = d.data;
          for (let item in list) {
            if (
              Object.prototype.toString
                .call(list[item])
                .slice(8, -1)
                .toLowerCase() === "function"
            ) {
              continue;
            }
            hisData.push(list[item].month);
            hisRate.push((list[item].cc * 100).toFixed(2));
          }
          this.hisData.name = hisData;
          this.hisData.value = hisRate;
          bar_echart(this.hisData, "Mhis", this.$router);
        });
    },
    newdata(){
       //实时溯源数据
        api1
          .newdata({
            areaId: this.areaId_,
            type:"jie"
          })
          .then(d => {
            let list = d.data;
            let new_ = [];
            for (let item in list) {
              if (
                Object.prototype.toString
                  .call(list[item])
                  .slice(8, -1)
                  .toLowerCase() === "function"
              ) {
                continue;
              }
              new_.push(list[item]);
            }
            this.newdata_ = new_;
            this.$nextTick(()=>{
              if(this._isDestroyed) return
              scrollTop("tBodyBox", "tBody", "tBody2",this.cb)
            });
          });
    },
    risk(){//风险品种
       api1
          .risk({
            areaId: this.areaId_,
            date: this.det_date,
            type:"jie"
          })
          .then(d => {
            let rd = d.data;
            for (let item in rd) {
              if (
                Object.prototype.toString
                  .call(rd[item])
                  .slice(8, -1)
                  .toLowerCase() === "function"
              ) {
                continue;
              }
              rd[item].rate = rd[item].rate * 100;
              rd[item].rate = rd[item].rate + "%";
            }
            this.risk_ = rd;
          });
    },
    check(){
      //检测情况
        api1
          .check({
            areaId: this.areaId_,
            date: this.det_date,
            type:"jie"
          })
          .then(d => {
            let name = [];
            let result = [];
            let fail = [];
            let bar2 = d.data.list;
            for (let item in bar2) {
              if (
                Object.prototype.toString
                  .call(bar2[item])
                  .slice(8, -1)
                  .toLowerCase() === "function"
              ) {
                continue;
              }
              name.push(bar2[item].areaName);
              result.push(bar2[item].qua);
              fail.push(bar2[item].unqua);
            }
            this.bar2Data.nameArray = name;
            this.bar2Data.resultdata.data = result;
            this.bar2Data.faildata.data = fail;
            this.bar2Data.num=this.det_date.slice(5, 7);
            if(!this._isDestroyed) {
              bar2_echart(this.bar2Data, "bar2");
            }
            this.pieData.dataArray = [
              { name: "合格", value: d.data.quaTotal },
              { name: "不合格", value: d.data.unquaTotal }
            ];
            this.pieData.subtitle = "检测总批次（" + d.data.total + "次)";
            if(!this._isDestroyed){
              pie_echart(this.pieData, "piebox");
            } 
            
          });
    },
    realTimeCheck(){
        //检测动态
        api1
          .realTimeCheck({
            areaId: this.areaId_,
            type:"jie"
          })
          .then(d => {
            let cd = d.data;
            for (let item in cd) {
              if (
                Object.prototype.toString
                  .call(cd[item])
                  .slice(8, -1)
                  .toLowerCase() === "function"
              ) {
                continue;
              }
              if (cd[item].detecResult == "QUA") {
                cd[item].detecResult = "合格";
              } else if (cd[item].detecResult == "UNQUA") {
                cd[item].detecResult = "不合格";
              }
            }
            this.realTimeCheck_data = cd;
            this.$nextTick(()=>{
              if(this._isDestroyed) return
              scrollTop("tBodyBox2", "tBody3", "tBody4",this.cb)
            })
          });
    },
    post() {
      //纳入情况
      this.dlrrate_num();
      // 使用率
      this.dlrrate();
      //历史情况
      this.getHis();
      this.risk()//风险品种
      this.check()//检测情况
      this.realTimeCheck()//检测动态
      this.newdata()//实时溯源数据
    }
  },
  mounted: function() {
    //判断这个页面是用户直接进来，还是上一层页面进来,并且确定id
    if (this.$route.query.areaid) {
       if (!this._isDestroyed) {
          this.areaId_ = this.$route.query.areaid;
          //    this.areaId_="51011001";
          this.areaname_ = this.$route.query.name;
          this.seldate=this.$route.query.date ? this.$route.query.date: this.getdate();
          this.backshow = true;
          this.title = this.$route.query.backtitle + this.$route.query.name;
          this.post();
       };
    } else {
       if (!this._isDestroyed) {
          this.areaId_ = this.$store.state.common.user.regionCode;
          this.backshow = false;
          this.post();
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      det_date: this.getdate(),
      realTimeCheck_data:[],//检测实时动态
      newdata_: [], //实时动态数据
      risk_: [], //风险品种
      pieData: {
        nameArray: ["合格", "不合格"],
        dataArray: [{ name: "合格", value: "" }, { name: "不合格", value: "" }],
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
      timer:[],
      backshow: false,
      rank: "", //排名
      rankList: false, //排名list
      rankData: [], //排名数据
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
        url: "yb.dlrVendorChart",
        title: "",
        formatter: {
          y: "{value} %",
          tooltip: "%",
          Ttext: "溯源使用率"
        }
        ,zoomLock:true
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
      ],
      derive:''
    };
  }
};
</script>

<style scoped lang='sass'>
.area{
    background: #edf0f3;
    width:calc(100% + 40px);
    position: relative;
    left: -20px;
    height:2800px !important;
}
.bigbox{
    position: relative;
}
.page-tilt{
    background: #ffffff;
    padding: 12.5px 0 12.5px 20px;
}
.main_content{
    padding: 20px;
    width: calc(100% - 40px);
}
.main_content>section{
    background: #fff;
    width: 100%;
    margin-bottom: 20px;
}
.item1{
    height: 380px;
}
.item1>.floatL{
    width:30%;
    height:100%;
    border-right:1px  #EDF0F3 solid;
    padding: 20px;
        box-sizing: border-box;
}
.item1>.floatL>p{
    color: #393939;
    font-size: 14px;
}
.item1>.floatL>div{
    color: #9199A7;
    font-size: 14px;
    margin-top: 100px;
}
.item1>.floatR{
    height: 100%;
    width:70%;
    padding:20px;
    box-sizing: border-box;
}
.item1>.floatR .name{
    width: 20%;
    height: 21px;
    line-height:21px;
    padding-right: 2%;
    font-size: 14px;
    margin-bottom: 12px;
}
.item1>.floatR .el-progress{
    width: 78%;
    height: 21px;
    margin-bottom: 12px;
}
    .item2{
    height: 415px;
}
.item2>.date{
    height: 74px;
    padding: 20px;
    border-bottom:1px  #EDF0F3 solid;
}
.item2 .info>.floatL{
    width:30%;
    height:340px;
    border-right:1px  #EDF0F3 solid;
    padding: 20px;
        box-sizing: border-box;
}
.item2 .info>.floatL>p{
    color: #393939;
    font-size: 14px;
}
.item2 .info>.floatL>div{
    color: #9199A7;
    font-size: 14px;
    margin-top: 100px;
}
.item2 .info>.floatR{
    height: 340px;
    width:70%;
    padding:20px 20px 10px 20px;
    box-sizing: border-box;
}
.item3{
    width: 100%;
    height: 340px;
    padding: 20px 20px 10px 20px;
}
.item4{
    min-height: 337px;
    padding: 20px;
}
.item5{
    height: 724px;
}
  .item5>.date{
    height: 74px;
    padding: 20px;
    border-bottom:1px  #EDF0F3 solid;
}
.item5 .info{
    border-bottom:1px  #EDF0F3 solid;
    min-height: 280px;
}
.item5 .info>.floatL{
    width:30%;
    height:280px;
    border-right:1px  #EDF0F3 solid;
    padding: 20px;
    box-sizing: border-box;
}
.item5 .info>.floatR{
    height: 280px;
    width:70%;
    padding:20px;
    box-sizing: border-box;
}
.item5>.item5Box{
    height: 340px;
    padding: 20px;
}
.item6,.item7{min-height: 288px;padding: 20px;box-sizing: border-box}
.item6{
    height: 354px;
}
.item7{min-height: 288px;padding: 20px;box-sizing: border-box}
    .tip{
    border:1px solid red;
    color: red;
    display: inline-block;
    width: 15px;
    height:15px;
    line-height: 15px;
    text-align: center;
    border-radius: 50%;
    -webkit-border-radius:50%;
    -o-border-radius:50%;
    -ms-border-radius:50%;
}
.low>.low0{
    color: #2694CA;
}
.low>.low1{
    color: #0DB5EF;
}
.low>.low2{
    color: #92E6FF;
}
/*排名*/

.rankBox{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(155,155,155,.5);
    z-index: 9999;
    overflow: auto;
    padding-bottom: 20px;
}
.rank{
    background-color: #fff;
    width: 900px;
    margin: 80px auto 0;
    border-radius: 5px;
    color: #7c7d7e;
    padding-bottom: 20px;
        h3{
        font-size: 18px;
        font-weight: 500;
        padding: 20px;
        margin-bottom: 20px;
        border-bottom: 1px solid #ccc;
        }
        p{
        margin: 5px 0;
        line-height: 40px;
        height: 40px;
        padding: 0 28px;
            span{
            display: inline-block;
            }
        }
}
.biBo{
    width: 400px;
    display: inline-block;
    background-color: #c0c0c0;
    position: relative;
    height: 20px;
}
.smBo{
    display: inline-block;
    background-color: #f05050;
    position: absolute;
    left: 0;
    top: 0;
    height: 20px;
}
.theIs{
    background-color: #ccc;
}
.rotate360{
    transform: rotateX(180deg);
}
.col5e{
    color: #32c25e;
}
.col3b{
    color: #fa503b;
}
/*滚动表格*/
.tableBox{
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
  border: 1px solid #ebeef5 ;
  /*border-bottom: 0!important;*/
}
.tableBox .tHead{
  height: 45px;
  line-height: 45px;
  background: #F1F4F7;
  color: #909399;
  font-weight: 100;
  font-size: 12px;
}
.tableBox li{
  padding: 0 5px;
  box-sizing: border-box;
  text-align: left;
  float: left;
  list-style: none;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.tableBox ul:after{
  content: "";
  clear: both;
  display: block;
  height: 0;
}
.tBodyBox{
  height: 210px;
  overflow: hidden;
  transition: all 0.5s;
  -moz-transition: all 0.5s;
  -webkit-transition: all 0.5s;
  -o-transition: all 0.5s;
}
.tBody{
  width: 100%;
  min-height: 820px;
}
.tBody ul{
  border-bottom: 1px solid #ebeef5;
  line-height: 41px;
  height: 41px;
  color: #787878;
  font-size: 14px;
}
.tBody ul:hover{
  background: #F4F6F9;
}
.td1{
  width: 25%;
}
.td2{
  width: 10% ;
}
.td3{
  width: 25%;
}
.td4{
  width: 20%;
}
.td5{
  width: 20%;
  text-align: center !important;
}
.tableBox2 .td1{
  width: 20%;
}
.tableBox2 .td2{
  width: 15%;
}
.tableBox2 .td3{
  width: 20%;
}
.tableBox2 .td4{
  width: 10%;
}
.tableBox2 .td5{
  width: 10%;
}
.tableBox2 .td6{
  width: 10%;
}
.tableBox2 .td7{
  width: 15%; 
  text-align: center !important;
}

</style>
