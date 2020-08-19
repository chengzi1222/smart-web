<template>
  <div class="user-box">
    <ul class="flex-box mt20" v-if="dataLis">
      <li class="movePoin" @click="go">
        <h3>{{dataLis.surviveEntityCount}}</h3>
        <p>存活主体总数</p>
      </li>
      <li class="movePoin" @click="goTwo">
        <h3>{{dataLis.reviewCount}}</h3>
        <p>待审核工单</p>
      </li>
    </ul>
    <div class="mt20">
      <el-select style="vertical-align: top;" class="w150 mr20" v-model="riskRankValue" placeholder="请选择状态" @change="getParticular">
        <el-option v-for="item in riskRankSelect" :key="item.id" :label="item.name" :value="item.code"></el-option>
      </el-select>
      <el-select style="vertical-align: top;" class="w150 mr20" v-model="quanLevelValue" placeholder="请选择状态" @change="getParticular">
        <el-option v-for="item in quanLevelSelect" :key="item.id" :label="item.name" :value="item.code"></el-option>
      </el-select>
      <el-select class="w150 mr20" v-model="qiyeTypeValue" @change="getParticular" placeholder="企业形态" clearable>
        <el-option v-for="item in qiyeType" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      <el-cascader :clearable="true" placeholder="所属区域（全部）" class="w150" :options="deptsOptions.options" :props="deptsOptions.props"
        :change-on-select="true" :show-all-levels="false" @change="deptChange">
      </el-cascader>
    </div>
    <div class="way-box mt20">
      <div class="way-div">
        <h3>企业形态</h3>
        <div id="formBox"></div>
      </div>
      <div class="way-div">
        <h3>风险等级</h3>
        <div id="riskBox"></div>
      </div>
      <div class="way-div">
        <h3>量化等级</h3>
        <div id="quantizationBox"></div>
      </div>
    </div>
    <div class="way-box mt20">
      <div class="way-div" style="width: 100%;">
        <h3>辖区分布</h3>
        <el-select class="w100 selBox" v-model="fenBuValue" @change="xiaQu" placeholder="排序">
          <el-option v-for="item in selLis" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <div id="distributionBox"></div>
      </div>
    </div>
    <div class="way-box-bot mt20">
      <div class="way-div" style="width: 100%;">
        <h3>总体总量趋势图</h3>
        <div class="floatR iptBox" style="width: 90%; text-align: right;">
          <el-date-picker class="selectHeight mr10 w100" v-model="threndDate.start" format="yyyy" @change="initThread" value-format="yyyy"
            :clearable=false :editable=false :picker-options="startOptions" type="year" placeholder="选择起始年">
          </el-date-picker>
          <el-date-picker class="selectHeight mr10 w100" v-model="threndDate.end" @change="initThread" format="yyyy" value-format="yyyy"
            :clearable=false :editable=false :picker-options="endOptions" type="year" placeholder="选择结束年">
          </el-date-picker>

          <el-select @change="initThread" v-model="threndDate.granularity" placeholder="请选择" class="selectHeight mr10 w150">
            <el-option v-for="item in options.threndGranularitySelected" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

          <el-select @change="initThread" v-model="threndDate.mode" placeholder="请选择" class="selectHeight mr10 w76">
            <el-option v-for="item in options.threndModeSelected" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

          <el-select multiple :multiple-limit="3" @change="initThread" collapse-tags class="selectHeight mr10 w400" v-model="threndDate.areaCodes"
            placeholder="请选择辖区">
            <el-option v-for="item in depts" :key="item.areaCode" :label="item.deptName" :value="item.areaCode">
            </el-option>
          </el-select>
        </div>
      </div>

      <div id="mainBodyTrend" style="height:260px;"></div>
    </div>
  </div>
</template>

<script>
  import { getDicts, reportForms, getDept } from 'api/statistics/statistics';
  import * as plan from 'api/medi/subStatistics/subStatistics';
  import * as echartFun from "./echartsFun";
  import mainBodyTrend from "./mainBodyTrend_echarts.js";


  export default {
    async mounted() {
      let dicts = await getDicts();
      this.riskRankSelect = dicts.data.risk;
      this.quanLevelSelect = dicts.data.quantify;
      this.selectData.risk = dicts.data.risk;
      this.selectData.quantify = dicts.data.quantify;
      this.selectData.otherPlace = dicts.data.otherPlace;
      let depts = await getDept();
      this.depts = depts.data;

      this.threndDate.start = new Date().getFullYear().toString();
      this.threndDate.end = new Date().getFullYear().toString();

      this.getBasic()
      this.getEnums()
      this.getGrid()
      this.getParticular()
      this.initThread()
    },
    methods: {
      go() {
        let _path =  this.$route.name != 'index_employ' ?'/medi/subject/medicine_manager/list':'/medi/subject/medicine_employ/list';
        this.$router.push({
          path: _path,
          query:{
            statistics:true
          }
        })
      },
      goTwo() {
        let _path = this.$route.name != 'index_employ' ? '/medi/workflow/medicine_manager/list' : '/medi/workflow/medicine_employ/list';
        this.$router.push({
          path: _path,
          query: {
            statistics: true
          }
        })
      },
      deptChange(code) {
        this.codes = !code ? "" : code[code.length - 1];
        this.getParticular()
      },
      getBasic() {
        let _type = this.$route.name == 'index_employ' ? 'MEDICINE_EMPLOY' : 'MEDICINE_MANAGER';
        plan.getBasic(_type).then(r => {
          this.dataLis = r.data;
        })
      },
      getEnums() {
        let _type = this.$route.name == 'index_employ' ? ["com.ybveg.govx.enums.medi.EmployEnterpriseFormEnum"] : ["com.ybveg.govx.enums.medi.ManagerEnterpriseFormEnum"];
        plan.getEnums(_type).then(r => {
          this.qiyeType = r.data
        })
      },
      getGrid() {
        plan.getGrid().then(r => {
          this.deptsOptions.options = r.data
        })
      },
      getParticular() {
        let _type = this.$route.name == 'index_employ' ? 'MEDICINE_EMPLOY' : 'MEDICINE_MANAGER';
        let params = {
          riskRank: this.riskRankValue,
          quanLevel: this.quanLevelValue,
          enterpriseForm: this.qiyeTypeValue,
          areaCode: this.codes
        }
        plan.getParticular(_type, params).then(r => {
          let typeDistribution = {};
          let legendData = [];
          let seriesData = [];
          // 风险等级
          for (var i = 0; i < r.data.riskRank.length; i++) {
            let seriesobj = {};
            seriesobj.value = r.data.riskRank[i].count;
            seriesobj.name = r.data.riskRank[i].colu;

            legendData.push(r.data.riskRank[i].colu);
            seriesData.push(seriesobj);
          }
          typeDistribution.legendData = legendData;
          typeDistribution.seriesData = seriesData;
          echartFun.distribution(typeDistribution, "1", "riskBox");

          // 主体业态
          typeDistribution = {};
          legendData = [];
          seriesData = [];
          for (var i = 0; i < r.data.enterpriseForm.length; i++) {
            let seriesobj = {};
            seriesobj.value = r.data.enterpriseForm[i].count;
            seriesobj.name = r.data.enterpriseForm[i].colu;

            legendData.push(r.data.enterpriseForm[i].colu);
            seriesData.push(seriesobj);
          }
          typeDistribution.legendData = legendData;
          typeDistribution.seriesData = seriesData;
          echartFun.distribution(typeDistribution, "1", "formBox");

          // 量化等级
          typeDistribution = {};
          legendData = [];
          seriesData = [];
          for (var i = 0; i < r.data.quanLevel.length; i++) {
            let seriesobj = {};
            seriesobj.value = r.data.quanLevel[i].count;
            seriesobj.name = r.data.quanLevel[i].colu;

            legendData.push(r.data.quanLevel[i].colu);
            seriesData.push(seriesobj);
          }
          typeDistribution.legendData = legendData;
          typeDistribution.seriesData = seriesData;
          echartFun.distribution(typeDistribution, "1", "quantizationBox");

          // 辖区分布
          typeDistribution = {};
          legendData = [];
          seriesData = [];
          let numData = [];
          for (var i = 0; i < r.data.childrenDept.length; i++) {
            let seriesobj = {};
            seriesobj.value = r.data.childrenDept[i].count;
            seriesobj.name = r.data.childrenDept[i].colu;

            legendData.push(r.data.childrenDept[i].colu);
            seriesData.push(seriesobj);
            numData.push(r.data.childrenDept[i].percentage);
          }
          typeDistribution.legendData = legendData;
          typeDistribution.seriesData = seriesData;

          this.fenBu.legendData = legendData;
          this.fenBu.seriesData = seriesData;
          this.fenBu.numData = numData;
          // echartFun.draw(typeDistribution.legendData, typeDistribution.seriesData, "distributionBox");
          this.xiaQu();
        })
      },
      xiaQu() {
        if (this.fenBuValue == 'num') {
          echartFun.draw('数量（个）', '主体数量（个）', this.fenBu.legendData, this.fenBu.seriesData, "distributionBox");
        } else {
          echartFun.draw('百分比（%）', '主体占比（%）', this.fenBu.legendData, this.fenBu.numData, "distributionBox");
        }
      },
      initThread() {
        //趋势图
        let _type = this.$route.name == 'index_employ' ? 'MEDICINE_EMPLOY' : 'MEDICINE_MANAGER';
        let params = {
          granularity: this.threndDate.granularity.toUpperCase(),
          startDate: this.threndDate.start,
          endDate: this.threndDate.end,
          type: this.threndDate.mode == 0 ? 'INCREMEMENT' : 'TOTALA',
          areaCode: this.threndDate.areaCodes,
        }
        plan.getTotalTrend(_type, params).then(r => {
          mainBodyTrend(r.data.xData, r.data.yData)
        })
      }
    },
    components: {
    },
    data() {
      return {
        dataLis: {
          surviveEntityCount: '0',
          reviewCount: '0'
        },
        selLis: [{
          name: '主体数量',
          value: 'num'
        }, {
          name: '主体占比',
          value: 'zhanBi'
        }],
        codes:'',
        fenBuValue: 'num',
        selValue: '',
        riskRankValue: '',//风险等级
        quanLevelValue: '',//量化等级
        riskRankSelect: [],//风险等级
        quanLevelSelect: [],//量化等级
        qiyeTypeValue: '',//企业形态
        qiyeType: [], //企业形态
        deptsOptions: {
          props: {
            label: 'deptName',
            value: 'areaCode'
          },
          options: []
        },
        fenBu: {},
        threndDate: {//趋势图数据
          areaCodes: [],
          mode: 1,
          granularity: 'month',
          start: '',
          end: ''
        },
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
        depts: '',
        options: {
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
          ]
        },
        selectData: {
          risk: [],
          quantify: [],
          otherPlace: [],
        },
      }
    }
  }
</script>

<style scoped lang="scss">
  .user-box {
    background-color: #edf0f3;
    padding: 20px;
    margin-top: -2px;
    margin-left: -20px;
    width: 100%;
    padding-top: 1px;
  }

  .flex-box {
    display: flex;
    padding: 20px 0px;
    background: #fff;
    li {
      width: 50%;
      text-align: center;
      height: 100px;
      padding-top: 15px;
      box-sizing: border-box;
      h3 {
        font-size: 36px;
        color: #333333;
        line-height: 50px;
      }
      p {
        font-size: 16px;
        color: #A2AAB6;
        line-height: 22px;
      }
    }
  }

  .way-box {
    display: flex;
    position: relative;
    justify-content: space-between;
    .way-div {
      width: 32.5%;
      height: 340px;
      background: #fff;
      h3 {
        font-size: 15px;
        color: #393939;
        line-height: 21px;
        padding: 20px 0 0 16px;
      }
      div {
        height: 280px;
      }
      .selBox {
        float: right;
        margin: -25px 20px 0 0;
        height: 34px;
      }
      #distributionBox {
        width: 100%;
      }
    }
  }

  .state-box {
    background: #fff;
    padding: 16px 20px;
    h3 {
      font-size: 15px;
      color: #393939;
    }
  }

  .iptBox div {
    display: inline-block;
  }

  .selectHeight {
    margin-left: 0px !important;
  }

  .way-box-bot {
    background: #fff;
    .way-div {
      overflow: hidden;
    }
    h3 {
      font-size: 15px;
      color: #393939;
      line-height: 21px;
      padding: 20px 0 0 16px;
    }
  }
</style>