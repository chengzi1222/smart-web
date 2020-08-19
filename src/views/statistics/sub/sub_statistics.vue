<style lang="sass">
  template {
    display: block;
  }
</style>
<template>
  <div class="user-box">
    <div class="main-body">
      <!-- 状态显示 -->
      <section class="state">
        <div @click="$router.push({name: 'subject.archives', params: {type: condition.entityType,totalstate:'valid'}})" class="state-item canHover">
          <p class="state-item-num">{{subTotals.subValidTotal}}</p>
          <p class="state-item-name">存活主体总数</p>
        </div>

        <div v-if="auth" @click="$router.push({name: 'subject.workflow',params:{type: condition.entityType}})" class="state-item canHover">
          <p class="state-item-num">{{subTotals.toWorkTotal}}</p>
          <p class="state-item-name">待处理{{entityTypeLabel}}主体工单总数</p>
        </div>
      </section>

      <!-- 下拉 -->
      <section class="select">
        <el-select v-model="condition.risk" @change="initReport" placeholder="风险等级(全部)">
          <el-option v-for="item in selectData.risk" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>

        <el-select v-model="condition.quantify" @change="initReport" placeholder="量化等级(全部)">
          <el-option v-for="item in selectData.quantify" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>

        <el-select v-model="condition.subType" @change="initReport" placeholder="主体业态（全部）">
          <el-option v-for="item in selectData.subType" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>

        <el-select v-model="condition.natureType" @change="initReport" placeholder="证照状态（全部）">
          <el-option v-for="item in selectData.natureType" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>

        <el-cascader :clearable="true" placeholder="所属区域（全部）" :options="deptsOptions.options" :props="deptsOptions.props" :change-on-select="true"
          :show-all-levels="false" @change="deptChange">
        </el-cascader>
      </section>

      <section class="charts">

        <section style="width:32.5%" class="charts-item">
          <p class="title">主体业态</p>
          <pie pieId="subType" :pieData="pieSubType"></pie>
        </section>

        <section style="width:32.5%" class="charts-item">
          <p class="title">风险等级</p>
          <pie pieId="riskLevel" :pieData="pieRiskLevel"></pie>
        </section>

        <section style="width:32.5%" class="charts-item">
          <p class="title">量化等级</p>
          <pie pieId="quantifylevel" :pieData="pieQuantifylevel"></pie>
        </section>

        <section style="width:32.5%" class="charts-item">
          <p class="title">证照状态</p>
          <pie pieId="nature" :pieData="pieNature"></pie>
        </section>

        <section style="width:66.3%" class="charts-item">
          <div class="clearfix">
            <p class="title floatL">辖区分布</p>
            <el-select v-model="optionsValue.areaValue" @change="areaChange" placeholder="请选择" class="w120 floatR">
              <el-option v-for="item in options.areaSelected" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>

          <yb-slider height='260' :echartsWidth='areaData.yNum.length*100'>
            <div id="area" style="min-width:100%;height:250px;"></div>
          </yb-slider>
        </section>

        <section style="width:100%" class="charts-item">
          <div class="clearfix">
            <p class="title floatL">主体趋势图</p>

            <div class="floatR iptBox" style="width: 90%; text-align: right;">
              <el-date-picker class="selectHeight mr10 w100" v-model="threndDate.start" format="yyyy" @change="initThread" value-format="yyyy"
                :clearable=f alse :editable=f alse :picker-options="startOptions" type="year" placeholder="选择起始年">
              </el-date-picker>
              <el-date-picker class="selectHeight mr10 w100" v-model="threndDate.end" @change="initThread" format="yyyy" value-format="yyyy"
                :clearable=f alse :editable=f alse :picker-options="endOptions" type="year" placeholder="选择结束年">
              </el-date-picker>

              <el-select @change="initThread" v-model="threndDate.granularity" placeholder="请选择" class="selectHeight mr10 w150">
                <el-option v-for="item in options.threndGranularitySelected" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>

              <el-select @change="initThread" v-model="threndDate.mode" placeholder="请选择" class="selectHeight mr10 w76">
                <el-option v-for="item in options.threndModeSelected" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>

              <el-select @change="initThread" class="selectHeight mr10 w150" v-model="threndDate.natureType" placeholder="证照状态（全部）">
                <el-option v-for="item in selectData.natureType" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>

              <el-select multiple :multiple-limit="3" @change="initThread" collapse-tags class="selectHeight mr10 w400" v-model="threndDate.areaCodes"
                placeholder="请选择辖区">
                <el-option v-for="item in depts" :key="item.areaCode" :label="item.deptName" :value="item.areaCode">
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
  import { getdeptGrid, getDicts, getDept } from 'api/statistics/statistics';
  import hasAuth from 'utils/checkAuth';
  import { subByType, subByRisk, subByQuantify, subByNatureType, subByArea, subByTrend, subNumberTotal } from 'api/statistics/subStatistics';

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
      let sub = '';//主体业态
      this.condition.entityType = this.$route.params.entityType;
      this.threndDate.entityType = this.$route.params.entityType;
      //    v-auth=",,'"
      switch (this.condition.entityType) {
        case 'product':
          sub = 'PB_SUB';
          this.entityTypeLabel = '生产';
          this.auth = hasAuth("food.biz.pb|func.review");
          break;
        case 'circulation':
          sub = 'CB_SUB';
          this.entityTypeLabel = '流通';
          this.auth = hasAuth("food.biz.cb|func.review");
          break;
        case 'restaurant':
          sub = 'RB_SUB';
          this.entityTypeLabel = '餐饮';
          this.auth = hasAuth("food.biz.rb|func.review");
          break;
      }
      getDicts(sub).then((result) => {
        this.selectData.risk = result.data.risk;
        this.selectData.quantify = result.data.quantify;
        this.selectData.otherPlace = result.data.otherPlace;
        this.selectData.subType = result.data.sub;
        this.selectData.natureType = result.data.natureType;
      });

      getdeptGrid().then((result) => {
        this.deptsOptions.options = result.data;
      });

      subNumberTotal(this.condition.entityType).then((result) => {
        this.subTotals = result.data;
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
        //主体业态饼状图
        subByType(this.condition).then((result) => {
          if (!result.data || !result.data.legend || !result.data.series) return;
          result.data.legend = handleLegend(result.data.legend);
          this.pieSubType = result.data;
        });

        //风险等级饼状图
        subByRisk(this.condition).then((result) => {
          if (!result.data || !result.data.legend || !result.data.series) return;
          result.data.legend = handleLegend(result.data.legend);
          this.pieRiskLevel = result.data;
        });

        //量化等级饼状图
        subByQuantify(this.condition).then((result) => {
          if (!result.data || !result.data.legend || !result.data.series) return;
          result.data.legend = handleLegend(result.data.legend);
          this.pieQuantifylevel = result.data;
        });

        //证照状态饼状图
        subByNatureType(this.condition).then((result) => {
          if (!result.data || !result.data.legend || !result.data.series) return;
          result.data.legend = handleLegend(result.data.legend);
          this.pieNature = result.data;
        });

        //辖区分布柱状图
        subByArea(this.condition).then((result) => {
          if (!result.data || !result.data.xArea || !result.data.yNum || !result.data.yPercentage) return;
          this.areaData = result.data;
          area('数量（个）', '主体数量（个）', this.areaData.xArea, this.areaData.yNum);
        });

      },
      initThread() {
        //主体趋势图
        subByTrend(this.threndDate).then((result) => {
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
      threndDeptChange(areaCode) {
        this.threndDate.areaCode = !areaCode ? "" : areaCode[areaCode.length - 1];
      },
    },
    data() {
      return {
        auth: false,
        startOptions: {
          disabledDate: (time) => {
            let enDateVal = this.threndDate.end;
            if (enDateVal) {
              let eDate = new Date(enDateVal);
              if (this.threndDate.granularity && this.threndDate.granularity == 'month') {
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
              if (this.threndDate.granularity && this.threndDate.granularity == 'month') {
                return time.getYear() < sDate.getYear() || time.getYear() > new Date((parseInt(startDate) + 2).toString()).getYear()
              }
              return time.getYear() < sDate.getYear();
            }
          }
        },
        subTotals: {
          subValidTotal: 0, //有效
          toWorkTotal: 0, //待审核工单
        },
        selectData: {
          risk: [],
          quantify: [],
          otherPlace: [],
          subType: [],
          natureType: []
        },
        condition: {
          risk: "",//风险等级
          quantify: "",//量化等级
          subType: "",//主体业态
          areaCode: "",//所在区域
          natureType: "",//证照状态
          entityType: '',
        },
        depts: [],
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
          start: '',
          end: '',
          natureType: '',
          entityType: '',
        },
        pieSubType: {
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
        pieNature: {
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
        entityTypeLabel: '',
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

<style scoped lang='scss'>
  .page-tilt {
    padding-top: 15px;
  }

  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
  }


  .canHover {
    cursor: pointer !important;
    &:hover {
      background: #fff !important;
      border: 1px solid #0DB5EF !important;
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

  .iptBox div {
    display: inline-block;
  }

  .selectHeight {
    margin-left: 0px !important;
  }
</style>