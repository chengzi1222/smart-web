<template>
  <div class="user-box" style="margin-top:50px;">

    <div class="main-body" style="padding:0 30px 0 50px;box-sizing: border-box;">
      <section class="charts">

        <section style="width:32.5%;height:290px;" class="charts-item">
          <p class="title">待办事项</p>
          <div class="backlog">
            <div :class="{'canHover':item.path}" class="backlog-item" v-for="(item,index) in backlog" :key="index" @click="$router.push(item.path)">
              <i class="icon-style iconfont" :class="item.icon"></i>
              <div class="item-right">
                <p>{{item.num}}
                  <span class="unit">(个)</span>
                </p>
                <p>{{item.title}}</p>
              </div>

            </div>
          </div>

        </section>

        <section style="width:66%;height:290px;" class="charts-item">
          <p class="title">预警区</p>
          <div class="warning">
            <div class="warning-item">
              <p class="title">量化等级</p>
              <div class="warning-subitem1">
                <div>
                  <span class="iconsmile iconsmile1"></span>
                  <span style="color: #6D7787;">{{quanLevelLis?quanLevelLis[1].name:''}}</span>
                  <span class="floatR" style="font-size: 18px;color: #393939;">{{quantificat.A}}
                    <span class="unit">(个)</span>
                  </span>
                </div>
              </div>
              <div class="warning-subitem1">
                <div>
                  <span class="iconsmile iconsmile2"></span>
                  <span style="color: #6D7787;">{{quanLevelLis?quanLevelLis[2].name:''}}</span>
                  <span class="floatR" style="font-size: 18px;color: #393939;">{{quantificat.B}}
                    <span class="unit">(个)</span>
                  </span>
                </div>
              </div>
              <div class="warning-subitem1">
                <div>
                  <span class="iconsmile iconsmile3"></span>
                  <span style="color: #6D7787;">{{quanLevelLis?quanLevelLis[3].name:''}}</span>
                  <span class="floatR" style="font-size: 18px;color: #393939;">{{quantificat.C}}
                    <span class="unit">(个)</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="warning-item">
              <p class="title">风险等级</p>
              <div class="warning-subitem1">
                <div>
                  <span class="iconsmile iconsmile1"></span>
                  <span style="color: #6D7787;">{{riskLevelLis?riskLevelLis[1].name:''}}</span>
                  <span class="floatR" style="font-size: 18px;color: #393939;">{{quantificat1.A}}
                    <span class="unit">(个)</span>
                  </span>
                </div>
              </div>
              <div class="warning-subitem1">
                <div>
                  <span class="iconsmile iconsmile2"></span>
                  <span style="color: #6D7787;">{{riskLevelLis?riskLevelLis[2].name:''}}</span>
                  <span class="floatR" style="font-size: 18px;color: #393939;">{{quantificat1.B}}
                    <span class="unit">(个)</span>
                  </span>
                </div>
              </div>
              <div class="warning-subitem1">
                <div>
                  <span class="iconsmile iconsmile3"></span>
                  <span style="color: #6D7787;">{{riskLevelLis?riskLevelLis[3].name:''}}</span>
                  <span class="floatR" style="font-size: 18px;color: #393939;">{{quantificat1.C}}
                    <span class="unit">(个)</span>
                  </span>
                </div>
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
          </div>

        </section>

        <section style="width:48.5%" class="charts-item">
          <p class="title" style="line-height:30px;">主体</p>
          <div class="floatL charts-item-left" :class="{'canHover':entityShow}"  @click="$router.push(entityShow ? '/cosmeticsSub/subMap': '')">
            <i class="iconfont icon-fangzi icon-style" style="font-size:34px;"></i>
            <div>{{entityTotal}}
              <span class="unit">(家)</span>
            </div>
            <p>主体总数</p>
          </div>
          <div class="floatL" id="mainbody" style="width: 55%;height:100%;"></div>
        </section>

        <section style="width:48.5%" class="charts-item clearfix">
          <div class="floatL">
                  <!-- 主体类型（全部） -->
              <el-select class="w150 mr10" @change="entityTypeFun" v-model="entityTypePei" placeholder="主体类型(全部)">
                <el-option v-for="item in entityListPei" :key='item.key' :label="item.name" :value="item.key">
                </el-option>
              </el-select>
          </div>
          <div style="clear:both"></div>

          <div class="floatL charts-item-left"  :class="{'canHover':entityShow}"  @click="$router.push(entityShow ? '/cosmeticsSub/subMap?index='+entityTypePei_mapIndex: '')">
            <i class="iconfont  icon-shop icon-style" style="font-size:34px;"></i>
            <div>{{ EntityTypeData.total }}
              <span class="unit">(家)</span>
            </div>
            <p>{{ EntityTypeData.title }}</p>
          </div>
          <div class="floatL" id="cfda" style="width: 55%;height:100%;"></div>
        </section>

        <section style="width:62%;">
          <section style="width:100%;position:relative;" class="charts-item">
            <p class="title">日常巡查</p>
            <div class="floatR" style="width: 50%;text-align: right;">
              <el-date-picker class="w140" @change="dailyDateChange" v-model="dailyStartTime" :editable="false" :clearable="false" :picker-options="pickerOptions0"
                placeholder="起始时间"></el-date-picker>
              <span>至</span>
              <el-date-picker class="w140" @change="dailyDateChange" v-model="dailyEndTime" :editable="false" :clearable="false" :picker-options="pickerOptions1"
                placeholder="截止时间"></el-date-picker>
            </div>
            <div class="floatL charts-item-left" style="width:29.5%;margin: 8% 0%" :class="{'canHover':dailyShow}"
              @click="$router.push(dailyShow ? '/cosmetics/dailyRecord/index?startTime='+getdate(dailyStartTime)+'&endTime='+getdate(dailyEndTime): '')">
              <i class="iconfont  icon-plan icon-style" style="font-size:34px;"></i>
              <div>{{dailyData.dailyPatrolNum}}
                <span class="unit">(次)</span>
              </div>
              <p>累计巡查</p>
            </div>

            <div class="floatL" id="percent" style="width: 30%;height:85%;"></div>

            <div style="width:74px;position:absolute;top: 49%;left: 40.5%;color: #6D7787;text-align:center">
              <p>
                <span style="color: #393939;font-size:20px;">{{dailyData.entityCoverage}}</span>
                <span>%</span>
              </p>
              <p>覆盖率</p>
            </div>
            <div class="floatL" id="record" style="width: 38%;height:85%;"></div>
          </section>

          <section style="width:100%;height:200px;postion:ralative" class="charts-item">
            <p class="title floatL">专项巡查</p>
            <div class="floatR">
              <el-date-picker @change="dateChange" class="w140" v-model="startTime" placeholder="起始时间" :picker-options="pickerOptions5">
              </el-date-picker>
              <span>至</span>
              <el-date-picker @change="dateChange" class="w140" v-model="endTime" placeholder="截止时间" :picker-options="pickerOptions6">
              </el-date-picker>
            </div>
            <div style="clear:both;"></div>
            <div class="special">
              <div :class="{'canHover':item.path}" class="special-item" v-for="(item,index) in special" :key="index" @click="specialUrl(item)">
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
              <el-date-picker @change="rangeParamsChange" class="w140" v-model="range_startTime" type="date" placeholder="起始时间" :picker-options="pickerOptions3">
              </el-date-picker>
              <span>至</span>
              <el-date-picker @change="rangeParamsChange" class="w140" v-model="range_endTime" type="date" placeholder="截止时间" :picker-options="pickerOptions4">
              </el-date-picker>
            </div>
            <div style="clear:both;padding-top:20px;">
              <!-- 主体类型（全部） -->
              <el-select class="w120 mr10" @change="rangeParamsChange" v-model="entity" placeholder="主体类型(全部)">
                <el-option v-for="item in entityList" :key='item.key' :label="item.name" :value="item.key">
                </el-option>
              </el-select>
              <el-select class="w120 mr10" @change="rangeParamsChange" v-model="quanLevel" placeholder="量化等级">
                <el-option v-for="item in quanLevelLis" :key='item.code' :label="item.name" :value="item.code">
                </el-option>
              </el-select>
              <el-select class="w120 mr10" @change="rangeParamsChange" v-model="riskLevel" placeholder="风险等级">
                <el-option v-for="item in riskLevelLis" :key='item.code' :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </div>
          </div>

          <div style="clear:both"></div>

          <div id="range" style="width:100%;height:450px;"></div>

        </section>

        <section style="width:100%" class="charts-item">
          <div class="clearfix">
            <p class="title">巡查动态</p>
            <el-table :data="tableData" style="width: 100%;margin-top:20px;font-size:12px;">
              <el-table-column align="center" label="序号" type="index" width="50">
              </el-table-column>
              <el-table-column align="center" label="巡查对象" prop="entityName">
              </el-table-column>
              <el-table-column align="center" label="巡查结果" width="100">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.result == '符合'" size="mini" type="success">{{scope.row.result}}</el-tag>
                  <el-tag v-if="scope.row.result == '不符合'" size="mini" type="danger">{{scope.row.result}}</el-tag>
                  <el-tag v-if="scope.row.result == '基本符合'" size="mini" type="warning">{{scope.row.result}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="所属食药所" prop="syjName" width="300"> </el-table-column>
              <el-table-column align="center" prop="soName" label="监管员">
              </el-table-column>
              <el-table-column align="center" prop="patrolTime" label="时间">
              </el-table-column>
            </el-table>
          </div>
        </section>
      </section>
    </div>
  </div>
</template>

<script>
  // 引入echarts图表
  import drawRange from '../echarts/range_echarts';
  //上面的这个js和食品，药品首页共用，改的时候请注意
  import { drawPercent, drawRecord, drawMainBody, drawCFDA } from './echarts/echarts';

  import hasAuth from 'utils/checkAuth';
  import {
    getHomeEntityStat,
    getWarningArea,
    getPatrolPlan,
    getEynamic,
    getTotalPatrol,
    getEntityAll,
    getEntityType,
  } from 'api/cosmetics/subMap'
  import * as plan from 'api/common'

  export default {
    beforeDestroy() {
      this.willDestroy = true;
    },
    destroyed(){
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

      this.listDictUserItemByDictCode('COSM_QUANTIFY');
      this.listDictUserItemByDictCode('COSM_RISK');
      this.getEnums(['com.ybveg.govx.enums.cosmetic.CosmeticEntityTypeEnum']);

      //预警区和代办事项
      this.homeEntityStatFn()

      //日常巡查
      this.dailyFn();

      //专项巡查
      this.specialFn();

      //覆盖率排行
      this.rangeFn();

      //动态巡查
      this.dynamicFn();


      //主体数量统计
       this.statsEntityType('COSMETIC_PRODUCT')
       this.statsEntityAll()

    },
    components: {


    },
    data() {
      return {
        quanLevel: '',//量化等级
        riskLevel: '',//风险等级
        entity:'',//主体类型
        quanLevelLis: null,
        riskLevelLis: null,
        entityList:null,
        patrolTimesName: [], //巡查覆盖排行名字
        patrolTimesValue: [], //巡查覆盖排行值
        range_startTime: null,//覆盖率时间
        range_endTime: null,
        willDestroy: false, //将要摧毁组件
        dailyStartTime: null,//日常时间
        dailyEndTime: null,
        dailyData:{
          dailyPatrolNum: 0, //日常巡查数
          entityCoverage: 0, //覆盖率
          dailyFnPei:[]//
        },
        startTime: null,//专项时间
        endTime: null,
        special: [//专项
          {
            title: '已完成的计划',
            path: '',
            num: 0,
            icon: 'icon-wancheng-copy'
          },
          {
            title: '执行中的计划',
            num: 0,
            path: '',
            icon: 'icon-zhixingzhong'
          },
          {
            title: '累计巡查',
            path: '',
            num: 0,
            icon: 'icon-plan'
          },
        ],
        backlog: [//代办
          {
            num: 0,
            title: '待我审核',
            path: '',
            icon: 'icon-shenpi'

          }, {
            num: 0,
            title: '当前逾期未巡查',
            path: '',
            icon: 'icon-gantanhao'
          }, {
            num: 0,
            title: '当前待巡查',
            path: '',
            icon: 'icon-jijiangjiezhi',

          }
        ],
        quantificat: {//预警区量化分级
          A: 0,
          B: 0,
          C: 0,
        },
        quantificat1: {//预警区风险分级
          A: 0,
          B: 0,
          C: 0,
        },
        record: [//预警区巡查预警
          {
            title: '主体巡查覆盖率',
            percent: 0
          },
          {
            title: '巡查结果不符合率',
            percent: 0
          }
        ],
        tableData: [],//动态表格
        entityTotal: 0,//主体总和饼图
        entityTotalMap:[],
        entityListPei:[],//主体类型饼图
        entityTypePei:'',
        entityTypePei_mapIndex:'COSMETIC_PRODUCT',//跳转主体地图的type
        EntityTypeData: {
          name:[],
          data:[],
          total:0
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
              return time.getTime() < beginDateVal ;
            }
          }
        },
        intervalId: null
      };
    },

    methods: {
      specialUrl(item){
        if(item.title === '累计巡查'){
          this.$router.push(item.path+'?startTime='+this.getdate(this.startTime)+'&endTime='+this.getdate(this.endTime))
        }else{
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
          let obj={
            startDate:this.getdate(this.dailyStartTime),
            // .replace(new RegExp(/(\-)/g),'/'),
            endDate:this.getdate(this.dailyEndTime),
            // .replace(new RegExp(/(\-)/g),'/'),
            type:'DAILY',
          }
        getPatrolPlan(obj).then(res => {
          const { totalEntityPatrol, dailyCover, patrolResult } = res.data;

          this.dailyData.dailyPatrolNum = totalEntityPatrol;
          this.dailyData.entityCoverage = dailyCover==undefined ? 0: (dailyCover*100).toFixed(2);
          this.dailyData.dailyFnPei = patrolResult;

          this.dailyShow = hasAuth("cosmetic.patrol.record");

          drawPercent.call(this);
          drawRecord.call(this);
        });
      },
      //覆盖率排行
      rangeFn() {
         let obj ={
            startDate:this.getdate(this.range_startTime),
            endDate:this.getdate(this.range_endTime),
            entityType:this.entity,
            riskRank:this.riskLevel,
            quanLevel:this.quanLevel,
          }
        getTotalPatrol(obj).then(res => {
          for (let item of res.data) {
            this.patrolTimesName.push(item.deptName.replace("食品药品监督管理所", "").replace("食品药品监督管理局", ""));
            this.patrolTimesValue.push((item.dailyCover*100).toFixed(2));
          }
          drawRange.call(this);
        })
      },
       dateChange() {
        this.specialFn()
      },
      //专项巡查
      specialFn() {
         let obj={
          startDate:this.getdate(this.startTime),
          // .replace(new RegExp(/(\-)/g),'/'),
          endDate:this.getdate(this.endTime),
          // .replace(new RegExp(/(\-)/g),'/'),
          type:'SPECIAL',
        }
        getPatrolPlan(obj).then(res => {
          const { totalEntityPatrol, executing,alreadyCompleted } = res.data;
          this.special[2].num = totalEntityPatrol;
          this.special[1].num = executing;
          this.special[0].num = alreadyCompleted;

          if (hasAuth("cosmetic.special.plan")) {
            this.special[0].path = "/cosmetics/patrol/special/list?index=2";
            this.special[1].path = "/cosmetics/patrol/special/list?index=0";
          }
           if (hasAuth("cosmetic.patrol.record")) {
            this.special[2].path = "/cosmetics/recordSpecial/index";
          }
        })
      },
      //动态巡查
      dynamicFn() {
        if(this.intervalId) {
          clearInterval(this.intervalId)
        }
        getEynamic().then(res => {
          if(res.data.length<=0){return false}
          // this.updateTable(this.tableData, res.data, 5, 10, () => {
          //   setTimeout(() => {
          //     if (this.willDestroy) return
          //     this.dynamicFn()
          //   }, 10000)
          // });
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
              // clear()
              // callback()
              dynamicNum = 0 //数据滚完一遍之后重复滚动
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


      homeEntityStatFn() {
        //预警区3块
        getWarningArea().then(res=>{
          res.data.quanLevelWarning.forEach(a=>{
            if(a.colu=='A级'){
              this.quantificat.A=a.count;
            }
             if(a.colu=='B级'){
              this.quantificat.B=a.count;
            }
             if(a.colu=='C级'){
              this.quantificat.C=a.count;
            }
          })
          res.data.riskRankWarning.forEach(a=>{
            if(a.colu=='I级'){
              this.quantificat1.A=a.count;
            }
             if(a.colu=='II级'){
              this.quantificat1.B=a.count;
            }
             if(a.colu=='III级'){
              this.quantificat1.C=a.count;
            }
          })
            this.record[0].percent = res.data.patrolWarning.dailyCover?parseFloat((res.data.patrolWarning.dailyCover*100).toFixed(2)):0;
            this.record[1].percent = res.data.patrolWarning.disqualifiedCover?parseFloat((res.data.patrolWarning.disqualifiedCover*100).toFixed(2)):0;
        })
        //待办事项
        getHomeEntityStat().then(res => {
          this.backlog[0].num = res.data.reviewCount?res.data.reviewCount:0;
          this.backlog[1].num = res.data.overdueNoPatrol?res.data.overdueNoPatrol:0;
          this.backlog[2].num = res.data.waitPatrol?res.data.waitPatrol:0;
          if (hasAuth("cosmetic.biz.pb,biz.cosmetic.wf|func.add,biz.cosmetic.wf|func.edit")) {
            this.backlog[0].path = '/cosmeticswork/editorsProduction/editors';
          }
        })
      },
      entityTypeFun(){
        if(this.entityTypePei==''){
          this.entityTypePei_mapIndex='COSMETIC_PRODUCT';
        }else{
           this.entityTypePei_mapIndex=this.entityTypePei;
        }
        this.EntityTypeData.name=[]
        this.EntityTypeData.data=[]
        this.statsEntityType(this.entityTypePei)
      },
      statsEntityAll(){
        getEntityAll().then(res => {
          let count={
            a:res.data[0]?res.data[0].count:0,
            b:res.data[1]?res.data[1].count:0,
            c:res.data[2]?res.data[2].count:0,
          }
          this.entityTotal = count.a+count.b+count.c;
          this.entityTotalMap = res.data;
          this.entityShow = hasAuth("cosmetic.subject.map");
          drawMainBody.call(this);
        });
      },
      statsEntityType(t) {
        if(t==''){
          t='COSMETIC_PRODUCT'
        }
        if(t=='COSMETIC_PRODUCT'){
          this.EntityTypeData.title='生产主体总数'
        }else if(t=='COSMETIC_MANAGER'){
          this.EntityTypeData.title='经营主体总数'
        }else{
          this.EntityTypeData.title='使用主体总数'
        }
        getEntityType(t).then(res => {
          let total=0;
          res.data.forEach(item => {
            total+=item.count
            this.EntityTypeData.name.push({
              name:item.enterpriseForm,icon:'circle'
            });
            this.EntityTypeData.data.push({
              value:item.count,name:item.enterpriseForm
            })
          });
          this.EntityTypeData.total = total;
          drawCFDA.call(this);
        });
      },
      listDictUserItemByDictCode(dictCode) {//字典
        plan.listDictUserItemByDictCode(dictCode).then((data) => {
          if (dictCode == 'COSM_RISK') {
            this.riskLevelLis = data.data;
            this.riskLevelLis.unshift({ code: '', name: "风险等级" })
          } else {
            this.quanLevelLis = data.data;
            this.quanLevelLis.unshift({ code: '', name: "量化等级" })
          }
        })
      },
      getEnums(arr){//枚举
        plan.getEnums(arr,false).then((r) => {
          this.entityList = r.data
          this.entityList.unshift({ key: '', name: "主体类型(全部)" })
          this.entityListPei = r.data
          // this.entityListPei.unshift({ key: '', name: "主体类型(全部)" })
        });
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
      .backlog-item-right{
          width:55%;
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
      width: 32%;
      .title {
        font-size: 14px !important;
        color: #6d7787 !important;
        margin-bottom: 20px;
      }
      .warning-subitem1 {
        margin-bottom: 10px;
        line-height: 50px;
        height: 50px;
        width: 100%;
        background: #f6f7f8;
        >div {
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
        >div {
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
      &:hover{
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
    overflow: hidden;
    box-sizing: border-box;
    padding: 10px;
    background: #fff;
    height: 350px;
    margin-top: 20px;
    .charts-item-left {
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
      >div {
        font-size: 36px;
        color: #3b3b3b;
        width: 100%;
      }
      >P {
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
  .main-body{
    margin-left: -20px;
    width: 100%;
   }
</style>



<style lang="sass">
  .warning-item .el-progress-bar {
    width: 96%;
  }
</style>
