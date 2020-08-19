<template>
  <div class="user-box" style="margin-top:50px;">

    <div class="main-body" style="padding:0 30px 0 50px;box-sizing: border-box;">
      <section class="charts">

        <section style="width:32.5%;height:290px;" class="charts-item">
          <p class="title">待办事项</p>
          <div class="backlog">
            <div class="backlog-item canHover daiban" v-for="(item,index) in backlog" :key="index"
                 @click="$router.push(item.path)">
              <i class="icon-style iconfont" :class="item.icon"></i>
              <div class="item-right">
                <p>{{item.num}}
                  <span class="unit">(个)</span>
                </p>
                <p>{{item.title}}</p>
              </div>
              <ul class="selectbox" v-if="item.goList">
                <li v-for="goto in item.goList" class="movePoin" @click.stop="$router.push(goto.path)">
                  <span>{{ goto.name }}</span>
                </li>
              </ul>
            </div>
          </div>

        </section>

        <section style="width:66%;height:290px;" class="charts-item">
          <p class="title">预警区</p>
          <div class="warning">
            <div class="warning-item">
              <p class="title">量化风险预警</p>
              <div class="warning-subitem1 movePoin daiban">
                <div>
                  <span class="iconsmile iconsmile1"></span>
                  <span style="color: #6D7787;">{{quanLevelLis?quanLevelLis[1].name:''}}</span>
                  <span class="floatR" style="font-size: 18px;color: #393939;">{{quantificat.A}}
                    <span class="unit">(个)</span>
                  </span>
                </div>
                <ul class="selectbox" style="top:50px">
                  <li class="movePoin"
                      @click.stop="$router.push({name:'otherRating.quantifyLevel',query: {entityParentType: 'CFDA',quantifyLevelThis:'A',pathName:'综合评定'}})">
                    三小
                  </li>
                  <li class="movePoin"
                      @click.stop="$router.push({name:'otherRating.quantifyLevel',query: {entityParentType: 'PRODUCT',quantifyLevelThis:'A',pathName:'综合评定'}})">
                    生产主体
                  </li>
                  <li class="movePoin"
                      @click.stop="$router.push({name:'otherRating.quantifyLevel',query: {entityParentType: 'CIRCULATION',quantifyLevelThis:'A',pathName:'综合评定'}})">
                    流通主体
                  </li>
                  <li class="movePoin"
                      @click.stop="$router.push({name:'otherRating.quantifyLevel',query: {entityParentType: 'RESTAURANT',quantifyLevelThis:'A',pathName:'综合评定'}})">
                    餐饮主体
                  </li>
                </ul>
              </div>
              <div class="warning-subitem1 movePoin daiban">
                <div>
                  <span class="iconsmile iconsmile2"></span>
                  <span style="color: #6D7787;">{{quanLevelLis?quanLevelLis[2].name:''}}</span>
                  <span class="floatR" style="font-size: 18px;color: #393939;">{{quantificat.B}}
                    <span class="unit">(个)</span>
                  </span>
                </div>
                <ul class="selectbox" style="top:50px">
                  <li class="movePoin"
                      @click.stop="$router.push({name:'otherRating.quantifyLevel',query: {entityParentType: 'CFDA',quantifyLevelThis:'B',pathName:'综合评定'}})">
                    三小
                  </li>
                  <li class="movePoin"
                      @click.stop="$router.push({name:'otherRating.quantifyLevel',query: {entityParentType: 'PRODUCT',quantifyLevelThis:'B',pathName:'综合评定'}})">
                    生产主体
                  </li>
                  <li class="movePoin"
                      @click.stop="$router.push({name:'otherRating.quantifyLevel',query: {entityParentType: 'CIRCULATION',quantifyLevelThis:'B',pathName:'综合评定'}})">
                    流通主体
                  </li>
                  <li class="movePoin"
                      @click.stop="$router.push({name:'otherRating.quantifyLevel',query: {entityParentType: 'RESTAURANT',quantifyLevelThis:'B',pathName:'综合评定'}})">
                    餐饮主体
                  </li>
                </ul>
              </div>
              <div class="warning-subitem1 movePoin daiban">
                <div>
                  <span class="iconsmile iconsmile3"></span>
                  <span style="color: #6D7787;">{{quanLevelLis?quanLevelLis[3].name:''}}</span>
                  <span class="floatR" style="font-size: 18px;color: #393939;">{{quantificat.C}}
                    <span class="unit">(个)</span>
                  </span>
                </div>
                <ul class="selectbox" style="top:50px">
                  <li class="movePoin"
                      @click.stop="$router.push({name:'otherRating.quantifyLevel',query: {entityParentType: 'CFDA',quantifyLevelThis:'C',pathName:'综合评定'}})">
                    三小
                  </li>
                  <li class="movePoin"
                      @click.stop="$router.push({name:'otherRating.quantifyLevel',query: {entityParentType: 'PRODUCT',quantifyLevelThis:'C',pathName:'综合评定'}})">
                    生产主体
                  </li>
                  <li class="movePoin"
                      @click.stop="$router.push({name:'otherRating.quantifyLevel',query: {entityParentType: 'CIRCULATION',quantifyLevelThis:'C',pathName:'综合评定'}})">
                    流通主体
                  </li>
                  <li class="movePoin"
                      @click.stop="$router.push({name:'otherRating.quantifyLevel',query: {entityParentType: 'RESTAURANT',quantifyLevelThis:'C',pathName:'综合评定'}})">
                    餐饮主体
                  </li>
                </ul>
              </div>
            </div>

            <div class="warning-item">
              <p class="title">即将到期预警</p>
              <div class="warning-subitem1 daiban movePoin" v-for="(item,index) in expire" :key="index">
                <div @click="$router.push(item.path)">
                  <span style="color: #6D7787;">{{item.title}}</span>
                  <span class="floatR" style="font-size: 18px;color: #393939;">{{item.num}}
                    <span class="unit">(个)</span>
                  </span>
                </div>
                <ul class="selectbox selectboxtop50" v-if="item.goList">
                  <li v-for="goto in item.goList" class="movePoin" @click="$router.push(goto.path)">
                    <span>{{ goto.name }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="warning-item">
              <p class="title">巡查预警</p>
              <div class="warning-subitem2" v-for="(item,index) in record" :key="index">
                <div>
                  <span>{{item.title}}</span>
                  <!-- 去掉tag -->
                  <!--<el-tag size="mini" :type="item.type">{{item.state}}</el-tag>-->
                </div>
                <el-progress :percentage="item.percent"></el-progress>
              </div>
            </div>

            <div class="warning-item">
              <p class="title">溯源监测预警</p>
              <div class="warning-subitem2" v-for="(item,index) in trace" :key="index">
                <div>
                  <span>{{item.title}}</span>
                  <!-- 去掉tag -->
                  <!--<el-tag size="mini" :type="item.type">{{item.state}}</el-tag>-->
                </div>
                <el-progress :percentage="item.percent"></el-progress>
              </div>
            </div>
          </div>

        </section>

        <section style="width:48.5%" class="charts-item">
          <p class="title">主体</p>
          <div class="floatL charts-item-left" :class="{'canHover':entityShow}"
               @click="$router.push(entityShow ? '/sub/map': '')">
            <i class="iconfont icon-fangzi icon-style" style="font-size:34px;"></i>
            <div>{{entityTotal}}
              <span class="unit">(家)</span>
            </div>
            <p>存活主体总数</p>
          </div>
          <div class="floatL" id="mainbody" style="width: 55%;height:100%;"></div>
        </section>

        <section style="width:48.5%" class="charts-item">
          <p class="title">三小</p>
          <div class="floatL charts-item-left" :class="{'canHover':entityShow}"
               @click="$router.push(entityShow ? '/sub/map?index=4': '')">
            <i class="iconfont  icon-shop icon-style" style="font-size:34px;"></i>
            <div>{{cfdaTotal}}
              <span class="unit">(家)</span>
            </div>
            <p>存活三小主体总数</p>
          </div>
          <div class="floatL" id="cfda" style="width: 55%;height:100%;"></div>
        </section>

        <section style="width:62%;">
          <section style="width:100%;position:relative;float:left;" class="charts-item">
            <p class="title">日常巡查</p>
            <div class="floatR" style="width: 50%;text-align: right;">
              <el-date-picker class="w140" @change="dailyDateChange" v-model="dailyStartTime" :editable="false" :clearable="false"
                              :picker-options="pickerOptions0"
                              placeholder="起始时间"></el-date-picker>
              <span>至</span>
              <el-date-picker class="w140" @change="dailyDateChange" v-model="dailyEndTime" :editable="false" :clearable="false"
                              :picker-options="pickerOptions1"
                              placeholder="截止时间"></el-date-picker>
            </div>
            <div class="floatL charts-item-left" style="width:29.5%;margin: 8% 0%" :class="{'canHover':dailyShow}"
                 @click="$router.push(dailyShow ? {path: '/biz/patrol/record/daily?startTime='+getdate(dailyStartTime)+'&endTime='+getdate(dailyEndTime), query: { pathName: '日常监管记录'}}: '')">
              <i class="iconfont  icon-plan icon-style" style="font-size:34px;"></i>
              <div>{{dailyPatrolNum}}
                <span class="unit">(次)</span>
              </div>
              <p>累计巡查</p>
            </div>

            <div class="floatL" id="percent" style="width: 30%;height:85%;"></div>

            <div style="width:74px;position:absolute;top: 49%;left: 40.5%;color: #6D7787;text-align:center">
              <p>
                <span style="color: #393939;font-size:20px;">{{entityCoverage}}</span>
                <span>%</span>
              </p>
              <p>覆盖率</p>
            </div>
            <div class="floatL" id="record" style="width: 38%;height:85%;"></div>
          </section>

          <section style="width:100%;height:210px;postion:ralative;float:left;" class="charts-item">
            <p class="title floatL">专项巡查</p>
            <div class="floatR">
              <el-date-picker @change="dateChange" class="w140" v-model="startTime" placeholder="起始时间"
                              :picker-options="pickerOptions5">
              </el-date-picker>
              <span>至</span>
              <el-date-picker @change="dateChange" class="w140" v-model="endTime" placeholder="截止时间"
                              :picker-options="pickerOptions6">
              </el-date-picker>
            </div>
            <div style="clear:both;"></div>
            <div class="special">
              <div :class="{'canHover':item.path}" class="special-item" v-for="(item,index) in special" :key="index"
                   @click="specialUrl(item)">
                <i class="icon-style iconfont" :class="item.icon"></i>
                <div class="item-right">
                  <div style="font-size:28px;">{{item.num}}
                    <span class="unit">{{item.title === '累计巡查'?'(次)':'(条)'}}</span>
                  </div>
                  <div style="color: #A2AAB6;">{{item.title}}</div>
                  <span v-if="item.title === '已完成的计划'" class="dot" style="background:#32C25E;positon:absolute;"></span>
                  <span v-if="item.title === '执行中的计划'" class="dot" style="background:#FFBC40;positon:absolute;"></span>
                </div>

              </div>
            </div>
          </section>
        </section>

        <section style="width:37%;height:570px;" class="charts-item">
          <div class="clearfix">
            <p class="title floatL">巡查覆盖率排名</p>
            <div class="floatR">
              <el-date-picker @change="rangeParamsChange" class="w140" v-model="range_startTime" type="date"
                              placeholder="起始时间" :picker-options="pickerOptions3">
              </el-date-picker>
              <span>至</span>
              <el-date-picker @change="rangeParamsChange" class="w140" v-model="range_endTime" type="date"
                              placeholder="截止时间" :picker-options="pickerOptions4">
              </el-date-picker>
            </div>
            <div style="clear:both;padding-top:20px;">
              <span style="margin: 0 5px 0 10px;">量化等级</span>
              <el-select class="w120 mr10" @change="rangeParamsChange" v-model="quanLevel" placeholder="请选择">
                <el-option v-for="item in quanLevelLis" :key='item.code' :label="item.name" :value="item.code">
                </el-option>
              </el-select>
              <span style="margin: 0 5px 0 10px;">风险等级</span>
              <el-select class="w120 mr10" @change="rangeParamsChange" v-model="riskLevel" placeholder="请选择">
                <el-option v-for="item in riskLevelLis" :key='item.code' :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </div>
          </div>

          <div style="clear:both"></div>

          <div id="range" style="width:100%;height:450px;"></div>

        </section>

        <section style="width:62%" class="charts-item">
          <div class="clearfix">
            <p class="title">巡查动态</p>
            <el-table :data="tableData" style="width: 100%;margin-top:20px;font-size:12px;">
              <el-table-column align="center" label="序号" type="index" width="50">
              </el-table-column>
              <el-table-column align="center" label="巡查对象" prop="entityName" show-overflow-tooltip>
              </el-table-column>
              <el-table-column align="center" label="巡查结果" width="100">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.resultStr == '符合'" size="mini" type="success">{{scope.row.resultStr}}</el-tag>
                  <el-tag v-if="scope.row.resultStr == '不符合'" size="mini" type="danger">{{scope.row.resultStr}}</el-tag>
                  <el-tag v-if="scope.row.resultStr == '基本符合'" size="mini" type="warning">{{scope.row.resultStr}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="所属食药所" prop="deptName" width="300" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="supervisor" label="监管员">
              </el-table-column>
              <el-table-column align="center" prop="patrolTime" label="时间" show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </div>
        </section>

        <section style="width:37%" class="charts-item">
          <div class="clearfix">
            <p class="title" style="margin-bottom:20px;">阳光厨房</p>
            <div class="kitchen">
              <div class="kitchen-item" @click="$router.push(cameraShow ? '/camera': '')">
                <i class="icon iconfont icon-shop"></i>
                <p class="num">{{entityNum}}
                  <span class="unit">(家)</span>
                </p>
                <p>接入主体</p>
              </div>

              <div class="kitchen-item" @click="$router.push(cameraShow ? '/camera': '')">
                <i class="icon iconfont icon-webcam"></i>
                <p class="num">{{cameraNum}}
                  <span class="unit">(个)</span>
                </p>
                <p>摄像头</p>
              </div>
            </div>
          </div>
        </section>

        <section style="width:62%;height:250px;" class="charts-item">
          <div class="clearfix">
            <p class="title">溯源监测</p>
            <div class="symonitor">
              <div class="symonitor-item movePoin" @click="$router.push('/yb/main/monitoring')">
                <i class="iconfont icon-style  icon-fangzi"></i>
                <div class="item-right">
                  <span class="num">{{suySta.alls}}
                    <span class="unit">(家)</span>
                  </span>
                  <span>监管主体总数</span>
                </div>
              </div>
              <div class="symonitor-item movePoin" @click="$router.push('/yb/gathermain/gather')">
                <i class="iconfont icon-style icon-detection"></i>
                <div class="item-right">
                  <span class="num">{{suySta.num}}
                    <span class="unit">(次)</span>
                  </span>
                  <span>今日检测批次</span>
                </div>
              </div>
              <div class="symonitor-item movePoin" @click="$router.push('/yb/gathermain/gather')">
                <i class="iconfont icon-style  icon-bingtu"></i>
                <div class="item-right">
                  <span class="num">{{suySta.pass == '--' ? 0 : suySta.pass + '%'}}</span>
                  <span>检测合格率</span>
                </div>
              </div>
              <div class="symonitor-item movePoin" @click="$router.push('/yb/analyzemain/analyze')">
                <i class="iconfont icon-style  icon-summary"></i>
                <div class="item-right">
                  <span class="num">{{suySta.suyRate == '--' ? 0 : suySta.suyRate + '%'}}</span>
                  <span>溯源系统使用率</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        <section style="width:37%;height:250px;" class="charts-item">
          <div class="clearfix">
            <p class="title" style="margin-bottom:20px;">溯源检测动态</p>
            <div class="">
              <el-table :data="dynamicList" style="width: 100%;margin-top:20px;font-size:12px;">
                <el-table-column align="center" type="index" label="序号" width="40">
                </el-table-column>
                <el-table-column align="center" prop="seller" label="配送商">
                </el-table-column>
                <el-table-column align="center" prop="detecResult" label="结果" width="120">
                </el-table-column>
                <el-table-column align="center" prop="date" label="检测日期" width="160">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </section>
      </section>
    </div>
  </div>
</template>

<script>
  // 引入echarts图表
  import {drawMainBody, drawCFDA, drawPercent, drawRecord} from '../echarts/echarts';

  import drawRange from '../echarts/range_echarts';
  import hasAuth from 'utils/checkAuth';

  import {
    getDaily,
    getEynamic,
    getHomeEntityStat,
    getPatrolPlanRecord,
    getPatrolResult,
    getSpecial,
    getStatsCamera,
    getStatsDynamic,
    getStatsEntity,
    getStatsSuySta,
    getTotalPatrol
  } from 'api/index'
  import * as plan from 'api/common'

  export default {
    beforeDestroy() {
      this.willDestroy = true;
    },
    mounted() {
      // 默认开始日期为本年1月1日，截止时间为当天
      const dates = new Date();
      let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
      if (mon <= 9) {                                     //如果小于9的话，则需要加上0
        mon = "0" + mon;
      }
      let day = dates.getDate();                   //getdate()返回的是1-31，则不需要加1
      if (day <= 9) {                                     //如果小于9的话，则需要加上0
        day = "0" + day;
      }
      this.endTime = dates.getFullYear() + "-" + mon + "-" + day;
      this.dailyEndTime = dates.getFullYear() + "-" + mon + "-" + day;
      this.range_endTime = dates.getFullYear() + "-" + mon + "-" + day;
      this.startTime = dates.getFullYear() + "-01-01";
      this.dailyStartTime = dates.getFullYear() + "-01-01";
      this.range_startTime = dates.getFullYear() + "-01-01";

      this.listDictUserItemByDictCode('OTHER_RISK');
      this.listDictUserItemByDictCode('OTHER_QUANTIFY');

      //日常巡查
      this.dailyFn();

      //覆盖率排行
      this.rangeFn();

      //专项巡查
      this.specialFn();

      //动态巡查
      this.dynamicFn();

      //阳光厨房
      this.cameraFn();

      //主体相关
      this.homeEntityStatFn()

      //主体数量统计
      this.statsEntity();

      //当前逾期未巡查
      this.patrolPlanRecordFn();

      //首页检测数据
      this.statsSuySta(this.$store.state.common.user.regionCode);

      //首页检测动态
      this.statsDynamic(this.$store.state.common.user.regionCode);
    },
    components: {},
    data() {
      return {
        quanLevel: '',
        riskLevel: '',
        quanLevelLis: null,
        riskLevelLis: null,
        willDestroy: false, //将要摧毁组件
        patrolTimesName: [], //巡查覆盖排行名字
        patrolTimesValue: [], //巡查覆盖排行值
        cameraNum: 0, //摄像头数
        entityNum: 0, //接入主体数
        startTime: null,
        endTime: null,
        dailyStartTime: null,
        dailyEndTime: null,
        deadlineNum: 0, //累计巡查
        executingNum: 0, //执行中的计划
        finishedNum: 0, //已完成的计划
        range_startTime: null,
        range_endTime: null,
        dailyPatrolNum: 0, //日常巡查数
        entityCoverage: 0, //覆盖率
        patrolResult: {
          QUALIFIED: 0,    //符合
          PASSED: 0,       //基本符合
          DISQUALIFIED: 0, //不符合
        },//巡查结果
        backlog: [
          {
            num: 0,
            title: '待处理工单',
            path: '',
            icon: 'icon-record',
            goList: [{
              name: '三小审核',
              path: '/cfda/workflow'
            }, {
              name: '生产审核',
              path: '/subject/product/workflow'
            }, {
              name: '流通审核',
              path: '/subject/circulation/workflow'
            }, {
              name: '餐饮审核',
              path: '/subject/restaurant/workflow'
            }]
          }, {
            num: 0,
            title: '草稿箱',
            path: '',
            icon: 'icon-shenpi',
            goList: [{
              name: '三小草稿',
              path: '/cfda/add/draft'
            }, {
              name: '生产草稿',
              path: {
                name: 'subject.product.add',
                query: {
                  isDrafts: true
                }
              }
            }, {
              name: '流通草稿',
              path: {
                name: 'subject.circulation.add',
                query: {
                  isDrafts: true
                }
              }
            }, {
              name: '餐饮草稿',
              path: {
                name: 'subject.restaurant.add',
                query: {
                  isDrafts: true
                }
              }
            }]
          }, {
            num: 0,
            title: '当前逾期未巡查',
            path: {
              path: '/biz/patrol/situation/statistics',
              query: {
                chooseTwo: 4
              }
            },
            icon: 'icon-gantanhao',

          }, {
            num: 0,
            title: '当前即将逾期',
            path: {
              path: '/biz/patrol/situation/statistics',
              query: {
                chooseTwo: 5
              }
            },
            icon: 'icon-jijiangjiezhi'
          }
        ],
        quantificat: {
          A: 0,
          B: 0,
          C: 0,
        },
        expire: [
          {
            title: '许可证',
            num: 0,
            goList: [{
              name: '生产主体',
              path: '/subject/product/archives?entityState=none'
            }, {
              name: '流通主体',
              path: '/subject/circulation/archives?entityState=none'
            }, {
              name: '餐饮主体',
              path: '/subject/restaurant/archives?entityState=none'
            }]
          },
          {
            title: '三小',
            num: 0,
            path: '/cfda/archives?entityState=none'
          },
          {
            title: '专项计划',
            num: 0,
            path: '/biz/patrol/special/list'
          },
        ],
        record: [
          {
            title: '主体巡查覆盖率',
            percent: 0
          },
          {
            title: '巡查结果不符合率',
            percent: 0
          }
        ],
        trace: [
          {
            title: '检测合格率',
            percent: 0,
          },
          {
            title: '溯源使用率',
            percent: 0
          }
        ],
        special: [
          {
            title: '已完成的计划',
            path: '/biz/patrol/special/list?index=2',
            num: 0,
            icon: 'icon-wancheng-copy'
          },
          {
            title: '执行中的计划',
            num: 0,
            path: '/biz/patrol/special/list?index=0',
            icon: 'icon-zhixingzhong'
          },
          {
            title: '累计巡查',
            path: '/biz/patrol/record/special',
            num: 0,
            icon: 'icon-plan'
          },
        ],
        tableData: [],
        dynamicList: [],
        entityTotal: 0,
        entityTotalMap: {
          CIRCULATION: 0,
          RESTAURANT: 0,
          PRODUCT: 0,
          CFDA: 0,
        },
        cfdaTotal: 0,
        cfdaTotalMap: {
          CFDARESTAURANT: 0,
          SALE: 0,
          WORKSHOP: 0,
          VENDORS: 0,
        },
        suySta: {
          num: 0,
          pass: 0,
          seller: 0,
          suyRate: 0,
          alls: 0
        },
        entityShow: false,
        dailyShow: false,
        cameraShow: false,
        pickerOptions0: {
          disabledDate: (time) => {
            let endDateVal = new Date(this.dailyEndTime);
            if (this.dailyEndTime) {
              return time.getTime() > endDateVal;
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            let beginDateVal = new Date(this.dailyStartTime);
            if (this.dailyStartTime) {
              return time.getTime() < beginDateVal;
            }
          }
        },
        pickerOptions3: {
          disabledDate: (time) => {
            let endDateVal = new Date(this.range_endTime);
            if (this.range_endTime) {
              return time.getTime() > endDateVal;
            }
          }
        },
        pickerOptions4: {
          disabledDate: (time) => {
            let beginDateVal = new Date(this.range_startTime);
            if (this.range_startTime) {
              return time.getTime() < beginDateVal;
            }
          }
        },
        pickerOptions5: {
          disabledDate: (time) => {
            let endDateVal = new Date(this.endTime);
            if (this.endTime) {
              return time.getTime() > endDateVal;
            }
          }
        },
        pickerOptions6: {
          disabledDate: (time) => {
            let beginDateVal = new Date(this.startTime);
            if (this.startTime) {
              return time.getTime() < beginDateVal;
            }
          }
        },
        intervalId: null
      };
    },

    methods: {
      specialUrl(item) {
        if (item.title === '累计巡查') {
          this.$router.push({
            path: item.path + '?startTime=' + this.getdate(this.startTime) + '&endTime=' + this.getdate(this.endTime),
            query: {pathName: '专项检查记录'}
          })
        } else {
          this.$router.push(item.path)
        }
      },
      getdate(date) {
        if (date == null || date.getDate == undefined) {
          return date || ''
        }
        let mon = date.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        let day = date.getDate();         //getMonth()返回的是0-11，则需要加1
        if (day <= 9) {                                     //如果小于9的话，则需要加上0
          day = "0" + day;
        }
        return date.getFullYear() + "-" + mon + "-" + day;
      },
      liClick(e) {
        //点击导航切换样式
        var me = this;
        me.defaultIndex = e.target.dataset.index;
      },
      dateChange(type) {
        this.specialFn()
      },
      rangeParamsChange() {
        this.patrolTimesValue.length = 0;
        this.patrolTimesName.length = 0;
        this.rangeFn()
      },
      dailyDateChange() {
        this.dailyFn()
      },
      //日常巡查
      dailyFn() {

        getDaily(this.getdate(this.dailyStartTime), this.getdate(this.dailyEndTime)).then(res => {
          const {totalPatrol, entityCoverage, toBeOverdue, deptName} = res.data;

          this.dailyPatrolNum = totalPatrol;
          this.entityCoverage = entityCoverage;
          this.toBeOverdueNum = toBeOverdue;
          /*this.record = [
            {
              title: '主体巡查覆盖率',
              percent: this.entityCoverage
            },
            {
              title: '巡查结果不符合率',
              percent: this.toBeOverdueNum
            }
          ];*/
          //todo 巡查预警
          this.record[0].percent = this.entityCoverage;
          //        this.record[1].percent = this.toBeOverdueNum;
          this.dailyShow = hasAuth("food.patrol.record");
          drawPercent.call(this);

        });

        getPatrolResult(this.getdate(this.dailyStartTime), this.getdate(this.dailyEndTime)).then(res => {
          for (let item of res.data) {
            this.patrolResult[item.result] = item.number;
            //todo 巡查结果不符合率
            if (item.result == 'DISQUALIFIED') {
              this.record[1].percent = item.percent;
            }
          }
          drawRecord.call(this);
        })
      },
      //覆盖率排行
      rangeFn() {
        getTotalPatrol(this.getdate(this.range_startTime), this.getdate(this.range_endTime), this.quanLevel, this.riskLevel).then(res => {
          // this.patrolTimesName.length = 0;
          // this.patrolTimesValue.length = 0;
          for (let item of res.data) {
            this.patrolTimesName.push(item.deptName.replace("食品药品监督管理所", "").replace("食品药品监督管理局", ""));
            this.patrolTimesValue.push(item.entityCoverage);
          }
          drawRange.call(this);
        })
      },
      //专项巡查
      specialFn() {
        getSpecial(this.getdate(this.startTime), this.getdate(this.endTime)).then(res => {
          const {totalPatrol, executingNum, finishedNum, deadlineNum} = res.data;
          this.special[2].num = totalPatrol;
          this.special[1].num = executingNum;
          this.special[0].num = finishedNum;
          this.expire[2].num = deadlineNum;

          if (!hasAuth("food.patrol.record")) {
            this.special[0].path = "";
            this.special[2].path = "";
          }
        })
      },
      //动态巡查
      dynamicFn() {
        if(this.intervalId) {
          clearInterval(this.intervalId)
        }
        getEynamic().then(res => {
          this.updateTable(this.tableData, res.data, 5, 10);
          this.intervalId = setInterval(() => {
            if (this.willDestroy) return
            this.dynamicFn()
          }, 600000)      // 每十分钟重新请求一次新的数据
        })
      },
      //更新表格 @updateObj 更细的数据对象，@dataSource 数据源 ，@limit 显示格式，@time 间隔时间
      updateTable(updateObj, dataSource = [], limit = 5, time = 5) {
        let dynamicNum = 0
        handle()
        let timeID = setInterval(handle, time * 1000)

        function handle() {
          try {
            updateObj.splice(0, updateObj.length);
            dynamicNum++;
            let newArr = dataSource.slice((dynamicNum - 1) * limit, dynamicNum * limit);
            if ((dataSource.length % 2 != 0) && (dynamicNum * limit >= dataSource.length)) {
              newArr = dataSource.slice((dynamicNum - 1) * limit, dataSource.length);
            }
            for (let i = 0; i < newArr.length; i++) {
              updateObj.push(newArr[i]);
            }
            if (dynamicNum * limit >= dataSource.length) {
              dynamicNum = 0     //数据滚完一遍之后重复滚动
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
      cameraFn() {
        getStatsCamera().then(res => {
          if (res.data.cameraNum) {
            this.cameraNum = res.data.cameraNum;
          }
          if (res.data.entityNum) {
            this.entityNum = res.data.entityNum;
          }
          this.cameraShow = hasAuth("food.peri.camera");
        })
      },
      homeEntityStatFn() {
        getHomeEntityStat().then(res => {
          this.backlog[0].num = res.data.pendReviewCount;
          this.backlog[1].num = res.data.draftsCount;
          this.expire[0].num = res.data.entityLabelStats;
          this.expire[1].num = res.data.cfdaExpiringTotal;

          for (let item of res.data.quanLevelStats) {
            for (let key in this.quantificat) {
              if (key === item.quanLevel) {
                this.quantificat[key] = item.num;
                break;
              }
            }
          }

          // if (hasAuth("food.biz.cfda|func.add")) {
          //   this.backlog[0].path = '/cfda/workflow';
          //   this.backlog[1].path = '/cfda/add/draft';
          // } else if (hasAuth("food.biz.pb|func.add")) {
          //   this.backlog[0].path = '/mywork/product';
          //   this.backlog[1].path = '/sub/add/product/back';
          // } else if (hasAuth("food.biz.cb|func.add")) {
          //   this.backlog[0].path = '/mywork/circulation';
          //   this.backlog[1].path = '/sub/add/circulation/back';
          // } else if (hasAuth("food.biz.rb|func.add")) {
          //   this.backlog[0].path = '/mywork/restaurant';
          //   this.backlog[1].path = '/sub/add/restaurant/back';

          // } else if (hasAuth(
          //   "food.biz.cfda|func.change,food.biz.cfda|func.edit,food.biz.cfda|func.cancel,food.biz.cfda|func.delay")) {
          //   this.backlog[0].path = '/cfda/workflow';
          // } else if (hasAuth("food.biz.pb|func.change,food.biz.pb|func.cancel,food.biz.pb|func.delay")) {
          //   this.backlog[0].path = '/mywork/product';
          // } else if (hasAuth("food.biz.cb|func.change,food.biz.cb|func.cancel,food.biz.cb|func.delay")) {
          //   this.backlog[0].path = '/mywork/circulation';
          // } else if (hasAuth("food.biz.rb|func.change,food.biz.rb|func.cancel,food.biz.rb|func.delay")) {
          //   this.backlog[0].path = '/mywork/restaurant';
          // } else {
          //   this.backlog[0].path = '';
          //   this.backlog[1].path = '';
          // }

        })
      },
      patrolPlanRecordFn() {
        getPatrolPlanRecord().then(res => {
          this.backlog[2].num = res.data.patrolTimeout;
          this.backlog[3].num = res.data.patrolWillTimeout;
        })
      },

      statsEntity() {
        getStatsEntity("ALL").then(res => {
          this.entityTotal = res.data.total;
          res.data.list.forEach(entityType => {
            this.entityTotalMap[entityType.type] = entityType.num;
          })
          this.entityShow = hasAuth("food.subject.map");
          drawMainBody.call(this);
        });

        getStatsEntity("CFDA").then(res => {
          this.cfdaTotal = res.data.total;
          res.data.list.forEach(cfdaType => {
            this.cfdaTotalMap[cfdaType.type] = cfdaType.num;
          })
          drawCFDA.call(this);
        });
      },

      statsDynamic(areaCode) {
        getStatsDynamic(areaCode).then(res => {
          this.updateTable(this.dynamicList, res.data, 3, 10, () => {
            setTimeout(() => {
              if (this.willDestroy) return
              this.statsDynamic(areaCode);
            }, 10000)
          })
        })
      },

      statsSuySta(areaCode) {
        getStatsSuySta(areaCode).then(res => {
          if (!res.data) {
            return
          }
          this.suySta = res.data;

          this.trace = [
            {
              title: '检测合格率',
              percent: this.suySta.pass == '--' ? 0 : this.suySta.pass
            },
            {
              title: '溯源使用率',
              percent: this.suySta.suyRate == '--' ? 0 : this.suySta.suyRate
            }
          ]
        })
      },
      listDictUserItemByDictCode(dictCode) {
        plan.listDictUserItemByDictCode(dictCode).then((data) => {
          if (dictCode == 'OTHER_RISK') {
            this.riskLevelLis = data.data;
            this.riskLevelLis.unshift({code: '', name: "全部"})
          } else {
            this.quanLevelLis = data.data;
            this.quanLevelLis.unshift({code: '', name: "全部"})
          }
        })
      }
    }
  };
</script>

<style scoped lang="scss">
  .iconsmile {
    height: 14px;
    width: 14px;
    display: inline-block;
    background-size: cover;
    background-repeat: no-repeat;
    vertical-align: text-top;
  }

  .iconsmile1 {
    background-image: url("../../../assets/img/pic1.png");
  }

  .iconsmile2 {
    background-image: url("../../../assets/img/pic2.png");
  }

  .iconsmile3 {
    background-image: url("../../../assets/img/pic3.png");
  }

  .item-right {
    width: 55%;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
  }

  .backlog {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    .backlog-item {
      border: 1px solid #fff;
      position: relative;
      box-sizing: border-box;
      margin-bottom: 20px;
      background: #f6f7f8;
      width: 48%;
      height: 100px;
      font-size: 14px;
      color: #a2aab6;
      display: flex;
      align-items: center;
      justify-content: center;
      .backlog-item-right {
        width: 55%;
        text-align: left;
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-wrap: wrap;
      }
      p {
        width: 100%;
      }
      P:nth-child(1) {
        font-size: 28px;
        color: #393939;
      }
    }
  }

  .dot {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
  }

  .warning {
    margin-top: 20px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .warning-item {
      width: 23.5%;
      .title {
        font-size: 14px !important;
        color: #6d7787 !important;
        margin-bottom: 20px;
      }
      .warning-subitem1 {
        position: relative;
        margin-bottom: 10px;
        line-height: 50px;
        height: 50px;
        width: 100%;
        background: #f6f7f8;
        > div {
          padding: 0 10px;
        }
      }
      .warning-subitem2 {
        padding: 10px 10px;
        box-sizing: border-box;
        margin-bottom: 10px;
        height: 82px;
        width: 100%;
        background: #f6f7f8;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        > div {
          width: 100%;
          margin-bottom: 5px;
        }
      }
    }
  }

  .special {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .special-item {
      box-sizing: border-box;
      margin-top: 20px;
      box-sizing: border-box;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      .dot {
        position: absolute;
        left: 10px;
        top: 10px;
      }

      width: 32%;
      height: 110px;
      background: #f6f7f8;
      text-align: left;
    }
  }

  .canHover {
    cursor: pointer !important;
    &:hover {
      background: #fff !important;
      border: 1px solid #0db5ef !important;
      .icon-style {
        color: #0db5ef !important;
      }
    }
  }

  .kitchen {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    .kitchen-item {
      box-sizing: border-box;
      background: #f6f7f8;
      height: 240px;
      width: 45%;
      color: #a2aab6;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .num {
        color: #333333;
        font-size: 30px;
      }
      .icon {
        font-size: 34px;
        margin-bottom: 10px;
      }
      &:hover {
        border: 1px solid #0db5ef;
        background: #fff;
        .icon {
          color: #0db5ef;
        }
      }
    }
  }

  .symonitor {
    margin-top: 20px;
    font-size: 14px;
    color: #a2aab6;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    .symonitor-item {
      height: 170px;
      width: 23.5%;
      background: #f6f7f8;
      box-sizing: border-box;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .num {
        font-size: 30px;
        color: #333333;
      }
      &:hover {
        border: 1px solid #0DB5EF;
        background: #fff;
      }
    }
  }

  .main-body {
    padding: 20px;
    position: relative;
    background: #edf0f3;
  }

  .charts {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .charts .charts-item {
    /* overflow: hidden; */
    box-sizing: border-box;
    padding: 10px;
    background: #fff;
    height: 340px;
    margin-top: 20px;
    .charts-item-left {
      cursor: pointer;
      box-sizing: border-box;
      display: flex;
      text-align: center;
      flex-wrap: wrap;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      width: 35%;
      height: 70%;
      margin: 8% 5%;
      border-right: 1px solid #c2cad2;
      > div {
        font-size: 36px;
        color: #3b3b3b;
        width: 100%;
      }
      > P {
        font-size: 16px;
        color: #a2aab6;
        width: 100%;
      }
    }
  }

  .charts .charts-item .title {
    font-size: 15px;
    color: #393939;
    font-weight: bold;
  }

  .main-body {
    margin-left: -20px;
    width: 100%;
  }

  .daiban:hover {
    .selectbox {
      display: block;
    }
  }

  /* 新增下拉样式 */
  .selectbox {
    display: none;
    position: absolute;
    top: 99px;
    background: #fff;
    width: 100%;
    padding: 5px 0;
    box-shadow: 0px 2px 4px 0px rgba(51, 51, 51, 0.2);
    border: 1px solid rgba(226, 230, 237, 1);
    z-index: 66;
    li {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      padding: 0 12px;
      color: #393939;
    }
    li:hover {
      background: #F6F7F8;
      color: #0DB5EF;
    }
  }

  .selectboxtop50 {
    top: 49px !important;
  }
</style>


<style lang="sass">
  .warning-item .el-progress-bar {
    width: 96%;
  }
</style>
