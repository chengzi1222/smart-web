<style lang="sass">
  template{
    display: block;
  }
</style>
<template>
  <div class="user-box">
    <div class="main-body">
      <!-- 状态显示 -->
      <section class="state">

        <div :class="{'canHover': '/cfda/archives'}" @click="$router.push({name: 'cfda.archives', params: {total: 'effective'}})" class="state-item">
          <p class="state-item-num">{{cfdaTotals.cfdaValidTotal}}</p>
          <p class="state-item-name">存活主体总数</p>
        </div>

        <div :class="{'canHover': '/cfda/archives'}" @click="$router.push({name: 'cfda.archives', params: {total: 'expir'}})" class="state-item">
          <p class="state-item-num">{{cfdaTotals.cfdaExpiringTotal}}</p>
          <p class="state-item-name">即将到期的三小主体</p>
        </div>

        <div :class="{'canHover': '/cfda/workflow'}" @click="$router.push('/cfda/workflow')" class="state-item">
          <p class="state-item-num">{{cfdaTotals.cfdaWorkPendingTotal}}</p>
          <p class="state-item-name">待处理三小主体工单总数</p>
        </div>
      </section>

      <!-- 下拉 -->
      <section class="select">
        <el-select v-model="condition.risk" @change="initReport" placeholder="风险等级(全部)">
          <el-option v-for="item in selectData.risk" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>

        <el-select v-model="condition.quanLevel" @change="initReport" placeholder="量化等级(全部)">
          <el-option v-for="item in selectData.quantify" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>

        <el-select v-model="condition.cfdaType" @change="initReport" placeholder="三小类型（全部）">
          <el-option v-for="item in selectData.cfdaType" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>

        <el-cascader :clearable="true" placeholder="所属区域（全部）" :options="deptsOptions.options" :props="deptsOptions.props" :change-on-select="true" :show-all-levels="false" @change="deptChange">
        </el-cascader>
      </section>

      <section class="charts">

        <section style="width:32.5%" class="charts-item">
          <p class="title">三小类型</p>
          <pie pieId="cfdaType" :pieData="pieCfdaType"></pie>
        </section>

        <section style="width:32.5%" class="charts-item">
          <p class="title">风险等级</p>
          <pie pieId="riskLevel" :pieData="pieRiskLevel"></pie>
        </section>

        <section style="width:32.5%" class="charts-item">
          <p class="title">量化等级</p>
          <pie pieId="quantifylevel" :pieData="pieQuantifylevel"></pie>
        </section>

        <section style="width:100%" class="charts-item">
          <div class="clearfix">
            <p class="title floatL">辖区分布</p>
            <el-select v-model="optionsValue.areaValue"
                       @change="areaChange" placeholder="请选择" class="w120 floatR">
              <el-option v-for="item in options.areaSelected" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>

          <yb-slider height='250' :echartsWidth='areaData.yNum.length*100'>
            <div id="area" style="min-width:100%;height:250px;"></div>
          </yb-slider>
        </section>

        <section style="width:100%" class="charts-item">
          <div class="clearfix">
            <p class="title floatL">主体趋势图</p>

            <div class="floatR" style="width: 90%;text-align: right;">
              <el-date-picker class="selectHeight mr10 w100"
                              v-model="threndDate.start"
                              format="yyyy"
                              @change="initThread"
                              value-format="yyyy"
                              :clearable = false
                              :editable = false
                              :picker-options="startOptions"
                              type="year" placeholder="选择起始年">
              </el-date-picker>
              <el-date-picker class="selectHeight mr10 w100"
                              v-model="threndDate.end"
                              @change="initThread"
                              format="yyyy"
                              value-format="yyyy"
                              :clearable = false
                              :editable = false
                              :picker-options="endOptions"
                              type="year" placeholder="选择结束年">
              </el-date-picker>

              <el-select @change="initThread" class="selectHeight w150 mr10"
                         v-model="threndDate.granularity"
                        
                         placeholder="请选择" >
                <el-option v-for="item in options.threndGranularitySelected" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>

              <el-select @change="initThread" class="selectHeight w76 mr10"
                         v-model="threndDate.mode"
                        
                         placeholder="请选择" >
                <el-option v-for="item in options.threndModeSelected"
                           :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>

              <el-select @change="initThread"
                         class="selectHeight w150 mr10"
                        
                         v-model="threndDate.cfdaType"
                         placeholder="三小类型（全部）">
                <el-option v-for="item in selectData.cfdaType" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>

              <el-select multiple @change="initThread" class="selectHeight w400 mr10"
                        
                         :multiple-limit="3"
                         v-model="threndDate.areaCodes"
                         collapse-tags
                         placeholder="请选择辖区">
                <el-option v-for="item in depts"
                           :key="item.areaCode"
                           :label="item.deptName"
                           :value="item.areaCode">
                </el-option>
              </el-select>
            </div>
          </div>

          <div id="box" style="height:260px;">
            <div id="mainBodyTrend "></div>
          </div>
        </section>

      </section>
    </div>
  </div>
</template>

<script>
// 引入echarts图表
import area from '../echarts/area_echarts';
import site from '../echarts/site_echarts';
import mainBodyTrend from '../echarts/mainBodyTrend_echarts';
import pie from '../assembly/pie_chart.vue';
import YbSlider from 'components/YbSlider';
import {  cfdaByType, getdeptGrid, getDicts, cfdaByRisk,getDept,
  cfdaByQuantify, cfdaByArea, cfdaByPlace, cfdaByTrend, cfdaNumberTotal} from 'api/statistics/statistics';

/**
 * 处理饼状图数据标签
 * @constructor
 */
function handleLegend(data) {
  let legend = new Array();
  for (let index in data) {//只保留name字段
    legend.push({ name: data[index].name })
  }
  legend.push({ name: '未填' });
  return legend;
}

export default {
  async mounted() {
    getDicts("CFDA").then((result) => {
      this.selectData.risk = result.data.risk;
      this.selectData.quantify = result.data.quantify;
      this.selectData.otherPlace = result.data.otherPlace;
      this.selectData.cfdaType = result.data.cfdaType;
    });

    getdeptGrid().then((result) => {
      this.deptsOptions.options = result.data;
    });

    cfdaNumberTotal().then((result) => {
      this.cfdaTotals = result.data;
    });

    getDept().then((result) => {
      this.depts = result.data;
    });

    this.initReport();

    this.threndDate.start = new Date().getFullYear().toString();
    this.threndDate.end = new Date().getFullYear().toString();
    this.initThread();
  },
  components: {
    YbSlider,
    pie
  },
  methods: {
    initReport() {
      //三小类型饼状图
      cfdaByType(this.condition).then((result) => {
        if (!result.data || !result.data.legend || !result.data.series) return;
        result.data.legend = handleLegend(result.data.legend);
        this.pieCfdaType = result.data;
      });

      //三小风险等级饼状图
      cfdaByRisk(this.condition).then((result) => {
        if (!result.data || !result.data.legend || !result.data.series) return;
        result.data.legend = handleLegend(result.data.legend);
        this.pieRiskLevel = result.data;
      });

      //三小量化等级饼状图
      cfdaByQuantify(this.condition).then((result) => {
        if (!result.data || !result.data.legend || !result.data.series) return;
        result.data.legend = handleLegend(result.data.legend);
        this.pieQuantifylevel = result.data;
      });

      //辖区分布柱状图
      cfdaByArea(this.condition).then((result) => {
        if (!result.data || !result.data.xArea || !result.data.yNum || !result.data.yPercentage) return;
        this.areaData = result.data;
        area('数量（个）', '主体数量（个）', this.areaData.xArea, this.areaData.yNum);
      });

    },
    initThread(){
      //主体趋势图
      cfdaByTrend(this.threndDate).then((result) => {
        mainBodyTrend(result.data.area, result.data.xData, result.data.yData);
      });
    },
    areaChange() {
      if (this.optionsValue.areaValue == 'num') {
        area('数量（个）', '主体数量（个）', this.areaData.xArea, this.areaData.yNum);
      } else {
        area('百分比（%）', '主体占比（%）', this.areaData.xArea, this.areaData.yPercentage);
      }
    },
    placeChange() {
      if (this.optionsValue.placeValue == 'num') {
        site('数量（个）', '主体数量（个）', this.placeData.xData, this.placeData.yData);
      } else {
        site('百分比（%）', '主体占比（%）', this.placeData.xData, this.placeData.yPercentage);
      }
    },
    deptChange(areaCode) {
      this.condition.areaCode = !areaCode ? "" : areaCode[areaCode.length - 1];
      this.initReport();
    },
  },
  data() {
    return {
      startOptions: {
        disabledDate: (time) => {
          let enDateVal = this.threndDate.end;
          if (enDateVal) {
            let eDate = new Date(enDateVal);
            if (this.threndDate.granularity && this.threndDate.granularity == 'month'){
              return time.getYear() > eDate.getYear() || time.getYear() < new Date((enDateVal - 2).toString()).getYear()
            }
            return time.getYear() > eDate.getYear();
          }
        }
      },
      endOptions: {
        disabledDate: (time) => {
          let startDate = this.threndDate.start;
          if (startDate) {
            let sDate = new Date(startDate)
            if (this.threndDate.granularity && this.threndDate.granularity == 'month'){
              return time.getYear() < sDate.getYear() || time.getYear() > new Date((parseInt(startDate) + 2).toString()).getYear()
            }
            return time.getYear() < sDate.getYear();
          }
        }
      },
      cfdaTotals: {
        cfdaValidTotal: 0, //有效
        cfdaExpiringTotal: 0, //即将过期
        cfdaWorkPendingTotal: 0, //待审核工单
      },
      selectData: {
        risk: [],
        quantify: [],
        otherPlace: [],
        cfdaType: [],
      },
      condition: {
        risk: "",//风险等级
        quanLevel: "",//量化等级
        cfdaType: "",//三小类型
        areaCode: "",//所在区域
        //        spaceDst:"",//场所分布
      },
      deptsOptions: {
        props: {
          label: 'deptName',
          value: 'areaCode'
        },
        options: []
      },
      threndDate: {//主体统计趋势图数据
        areaCodes: [],
        mode: 1,
        granularity: 'month',
        cfdaType: '',
        start: '',
        end: '',
        cfdaType: '',
      },
      pieCfdaType: {
        legend: [],
        series: [],
      },
      pieRiskLevel: {
        legend: [],
        series: []
      },
      pieQuantifylevel: {
        legend: [],
        series: []
      },
      areaData: {
        xArea: [],
        yNum: [],
        yPercentage: [],
      },
      placeData: {
        xData: [],
        yData: [],
        yPercentage: [],
      },
      depts:[],
      /*lists: [
        { tabName: "主体概况", router: 'cfda.statistics' },
        { tabName: "统计报表", router: 'cfda.statistics.report' }
      ],*/
      defaultIndex: 0, //控制tab导航样式
      options: {
        areaSelected: [
          {
            value: "num",
            label: "主体数量"
          },
          {
            value: "percentage",
            label: "主体占比"
          },
        ],
        placeSelected: [
          {
            value: "num",
            label: "主体数量"
          },
          {
            value: "percentage",
            label: "主体占比"
          },
        ],
        threndModeSelected: [
         {
            value: 0,
            label: '增量'
          },
          {
            value: 1,
            label: '总量'
          }
        ],
        threndGranularitySelected: [
          {
            value: 'month',
            label: '时间颗粒度：月'
          },
          {
            value: 'quarter',
            label: '时间颗粒度：季度'
          },
          {
            value: 'year',
            label: '时间颗粒度：年'
          },
        ],
      },
      optionsValue: {
        areaValue: 'num',
        placeValue: 'num',
      },
    };
  }
};

</script>

<style scoped lang="sass">
  .backlog{
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  .backlog-item{
    box-sizing: border-box;
    margin-bottom: 20px;
    background: #F6F7F8;
    width: 48%;
    height: 100px;
    text-align: center;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: 14px;
    color: #A2AAB6;
  >p{width: 100%;}
  >P:nth-child(1){
    font-size: 28px;
    color: #393939;
  }
  }
  }

  .canHover{
    cursor: pointer  !important;
  &:hover{
     background: #fff !important;
     border: 1px solid #0DB5EF  !important;
   }
  }

.tab-box li {
  width: 110px;
  height: 50px;
  line-height: 50px;
  margin-right: 30px;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #9a9a9a;
  text-align: center;
}

.tab-box .li-bott {
  border-bottom: 2px solid #0db5ef;
  z-index: 666;
  position: relative;
}

.li-bott span {
  color: #393939;
}

.tab-box .tab-bott {
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 2px;
  background: #ebf1f5;
}

.main-body {
  padding: 20px;
  position: relative;
  background: #edf0f3;
}

.state {
  height: 140px;
  background: #fff;
  display: flex;
  justify-content: space-between;
}
.state .state-item {
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.state .state-item .state-item-num {
  font-size: 36px;
  color: #333;
}
.state .state-item .state-item-name {
  font-size: 16px;
  color: #a2aab6;
}

section.select .el-select {
  margin-top: 20px;
  margin-right: 20px;
  width: 150px;
}

.charts {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.charts .charts-item {
  box-sizing: border-box;
  padding: 10px;
  background: #fff;
  height: 340px;
  margin-top: 20px;
}
.charts .charts-item .title {
  font-size: 15px;
  color: #393939;
}

.main-body {
  margin-left: -20px;
  width: 100%;
}
.selectHeight{
  margin-left: 0px !important;
}
</style>



