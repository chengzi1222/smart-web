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
        <el-select style="vertical-align: top;" class="w150 mr20" v-model="quanLevelValue" placeholder="请选择状态" @change="getParticular">
          <el-option :label="'风险分级(全部)'" :value="''"></el-option>
          <el-option v-for="item in quanLevelSelect" :key="item.id" :label="item.name" :value="item.code"></el-option>
        </el-select>
        <el-select class="w150 mr20" v-if="subType!='MAAI_PRODUCT'" v-model="qiyeTypeValue" @change="getParticular" placeholder="企业形态" clearable>
          <el-option :label="'企业形态(全部)'" :value="''"></el-option>
          <el-option v-for="item in qiyeType" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
        <el-cascader :clearable="true" placeholder="所属区域（全部）" class="w150" :options="deptsOptions.options" :props="deptsOptions.props"
          :change-on-select="true" :show-all-levels="false" @change="deptChange">
        </el-cascader>
      </div>
      <div class="way-box mt20" :class="subType=='MAAI_PRODUCT'?'inlineDiv':''">
        <div class="way-div"  v-if="subType != 'MAAI_PRODUCT'" :class="{'way_div_pdt':subType!=='MAAI_PRODUCT'}">
          <h3>企业形态</h3>
          <div id="formBox"></div>
        </div>
        <div class="way-div" :class="{'way_div_pdt':subType!=='MAAI_PRODUCT'}">
          <h3>风险分级</h3>
          <div id="quantizationBox"></div>
        </div>
      </div>
      <div class="way-box mt20" :class="subType=='MAAI_PRODUCT'?'inlineDivBig':''">
        <div class="way-div" style="width: 100%;">
          <h3>辖区分布</h3>
          <el-select class="w100 selBox" v-model="fenBuValue" @change="xiaQu" placeholder="排序">
            <el-option v-for="item in selLis" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <yb-slider height='260' :echartsWidth='fenBu.seriesData.length*100'>
            <div id="distributionBox" style="min-width:100%;height:250px;"></div>
          </yb-slider>
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
              <el-option v-for="item in options.threndGranularitySelected" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>

            <el-select @change="initThread" v-model="threndDate.mode" placeholder="请选择" class="selectHeight mr10 w76">
              <el-option v-for="item in options.threndModeSelected" :key="item.key" :label="item.value" :value="item.key">
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
  </div>
</template>

<script type="module">
  import * as API from "api/cosmetics/subMap"
  import * as echartFun from "./echartsFun";
  import YbSlider from 'components/YbSlider';
  import mainBodyTrend from "./mainBodyTrend_echarts.js";
  import { getStaticsInit, getCountEntity, getCountWork, getCountEnterpriseForm, getCountQuantifyLevel, getCountAreaEntity, getCountTotality  } from 'api/medicalDevices/statisticAnalysis'

  export default {
    props:{
      subType:String 
    },
    async mounted() {
      getStaticsInit(this.subType).then(res => {
        if(!res.status){return}
        this.quanLevelSelect = res.data.quantifyLevelSelector;
        this.qiyeType = res.data.enterpriseFormSelector;
        this.depts = res.data.chidDeptSelector;
        this.options.threndModeSelected = res.data.totalOrNewSelector;
        this.options.threndGranularitySelected = res.data.timeUnitSelector;
        this.initThread()
      })
     
      this.threndDate.start = new Date().getFullYear().toString();
      this.threndDate.end = new Date().getFullYear().toString();
      this.getGrid()
      this.getBasic()
      this.getParticular()
    },
    methods: {
      getGrid() {
        API.getGrid().then(r => {
          this.deptsOptions.options = r.data
        })
      },
      go() {
        let _path = this.subTypeList[this.subType].ArchivesPath;
        this.$router.push({
          path: _path,
          query:{
            statistics:true
          }
        })
      },
      goTwo() {
        let _path = this.subTypeList[this.subType].editorsPath;
        this.$router.push({
          path: _path,
        })
      },
      deptChange(code) {
        this.codes = code.length==0 ? "" : code[code.length - 1];
        this.getParticular()
      },
      getBasic() {
        getCountEntity(this.subType).then(r => {
          if(r.status){
            this.dataLis.surviveEntityCount = r.data.cnt;
          }
        })
        getCountWork(this.subType).then(r => {
          if (r.status) {
            this.dataLis.reviewCount = r.data.cnt;
          }
        })
      },
      getParticular() {
        if (this.subType != 'MAAI_PRODUCT') {
          // 企业形态
          getCountEnterpriseForm(this.subType,this.quanLevelValue,this.qiyeTypeValue,this.codes).then(res => {
            let typeDistribution = {};
            let legendData = [];
            let seriesData = [];
            for (var i = 0; i < res.data.length; i++) {
              let seriesobj = {};
              seriesobj.value = res.data[i].cnt;
              seriesobj.name = res.data[i].enterprise_form_name;

              legendData.push(res.data[i].enterprise_form_name);
              seriesData.push(seriesobj);
            }
            typeDistribution.legendData = legendData;
            typeDistribution.seriesData = seriesData;
            echartFun.distribution(typeDistribution, "1", "formBox");
          })
        }
        //风险分级
        getCountQuantifyLevel(this.subType, this.quanLevelValue, this.qiyeTypeValue, this.codes).then(res => {
          let typeDistribution = {};
          let legendData = [];
          let seriesData = [];
          for (var i = 0; i < res.data.length; i++) {
            let seriesobj = {};
            seriesobj.value = res.data[i].cnt;
            seriesobj.name = res.data[i].quantify_level_name;

            legendData.push(res.data[i].quantify_level_name);
            seriesData.push(seriesobj);
          }
          typeDistribution.legendData = legendData;
          typeDistribution.seriesData = seriesData;
          echartFun.distribution(typeDistribution, "1", "quantizationBox");
        })
        // 辖区分布
        this.showxiaqu = false
        getCountAreaEntity(this.subType, this.quanLevelValue, this.qiyeTypeValue, this.codes).then(res => {
          this.showxiaqu = true
          let typeDistribution = {};
          let legendData = [];
          let seriesData = [];
          let numData = [];
          for (var i = 0; i < res.data.length; i++) {
            let seriesobj = {};
            seriesobj.value = res.data[i].cnt;
            seriesobj.name = res.data[i].dept_name.replace("食品药品监督管理所", "").replace("食品药品监督管理局", "").replace("市场和质量监督管理局", "");

            legendData.push(res.data[i].dept_name.replace("食品药品监督管理所", "").replace("食品药品监督管理局", "").replace("市场和质量监督管理局", ""));
            seriesData.push(seriesobj);
            numData.push(res.data[i].ratio);
          }
          typeDistribution.legendData = legendData;
          typeDistribution.seriesData = seriesData;

          this.fenBu.legendData = legendData;
          this.fenBu.seriesData = seriesData;
          this.fenBu.numData = numData;
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
        // debugger
        let params = new FormData();
        params.append('entityType', this.subType)
        params.append('startYear', this.threndDate.start)
        params.append('endYear', this.threndDate.end)
        params.append('timeUnit', this.threndDate.granularity)
        params.append('totalOrNew', this.threndDate.mode)
        // params.append('selectAreaCode', this.threndDate.areaCodes)

        getCountTotality(this.subType, this.threndDate.start, this.threndDate.end, this.threndDate.granularity, this.threndDate.mode, this.threndDate.areaCodes).then(r => {
          if(r.status){
            let xData = [];
            for(let i=0;i< r.data[0].list.length;i++){
              xData.push(r.data[0].list[i].time_value);
            }
            mainBodyTrend(xData, r.data)
          }
        })
      }
    },
    data() {
      return {
        showxiaqu: false,
        subTypeList:{
          MAAI_MANAGER:{
            name:'经营主体',
            dict:'MAAI_MANAGER',
            editorsPath:'/medicalDevices/fileAudit/editorsManage/index',
            ArchivesPath:'/medicalDevices/subject/manager/list'
          } ,
          MAAI_PRODUCT: {
            name:'生产主体',
            dict:'MAAI_PRODUCT',
            editorsPath:'/medicalDevices/fileAudit/editorsProduction/index',
            ArchivesPath:'/medicalDevices/subject/product/list'
          } ,
          MAAI_EMPLOY:{
            name:'使用主体',
            dict:'MAAI_EMPLOY',
            editorsPath:'/medicalDevices/fileAudit/editorsUse/index',
            ArchivesPath:'/medicalDevices/subject/employ/list'
          }
        },
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
        quanLevelValue: '',//风险分级
        quanLevelSelect: [],//风险分级
        qiyeTypeValue: '',//企业形态
        qiyeType: [], //企业形态
        deptsOptions: {
          props: {
            label: 'deptName',
            value: 'areaCode'
          },
          options: []
        },
        fenBu: {
          legendData:[],
          seriesData:[]
        },
        threndDate: {//趋势图数据
          areaCodes: [],
          mode: 'total',
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
        depts: [],
        options: {
          threndModeSelected: [],
          threndGranularitySelected: []
        },
      }
    },
    components: {
      YbSlider
    },
  }
</script>

<style scoped lang="scss">
  .yb-slider .content-box{
    overflow: hidden;
    width: 100%;
  }
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
    .way_div_pdt {
      width: 48.5%;
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
  .inlineDiv{
    display: inline-block;
    width: 32.5%;
    .way-div{
      width: 100%;
    }
  }
  .inlineDivBig{
    /* display: inline-block; */
    width: 66%;
    float: right;
  }
</style>