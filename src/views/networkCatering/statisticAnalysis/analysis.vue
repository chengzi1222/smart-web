<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>预警分析</span>
    </div>
    <div class="dataBox">
      <div class="sizer">
        <el-cascader ref="cascader" class="w150" v-model="areaCode" :options="areaList.options" @change="areaChange" :props="areaList.props" clearable placeholder="所属辖区"></el-cascader>
        <el-date-picker v-model="selDate" type="date" placeholder="年/月/日" class="w120 ml20" @change="selectChange" :picker-options="pickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
      </div>
      <div class="content-box risk-scale">
        <span class="title">市场风险占比</span>
        <div class="count fl">
          <span>{{28241}}</span>
          <span>{{'风险总数'}}</span>
        </div>
        <div class="echart-box fl">
          <div class="echart" id="riskScale"></div>
        </div>
      </div>
      <div class="content-box risk-distri">
        <span class="title">市场风险分布</span>
        <div class="echart" id="riskDistri"></div>
      </div>
      <div class="content-box table-box">
        <span class="title">高风险预警</span>
        <el-table :data="tableData" class="table-div r30 allDown movePoin" v-loading="tableLoading">
          <el-table-column show-overflow-tooltip width="60" type="index" label="序号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="areaName" label="商家名称" min-width="120">
            <template slot-scope="scope">
              <span>{{scope.row.areaName?scope.row.areaName:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="avgPrice" label="联系方式" min-width="120">
            <template slot-scope="scope">
              <span>{{scope.row.avgPrice?scope.row.avgPrice:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="yesAvgPrice" label="经营地址" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.yesAvgPrice?scope.row.yesAvgPrice:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="percent" label="所属辖区" min-width="120">
            <template slot-scope="scope">
              <span>{{scope.row.percent?scope.row.percent : '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="risk" label="风险等级" min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.risk === 'high'" class="risk-state risk-high">高风险</span>
              <span v-else-if="scope.row.risk === 'normal'" class="risk-state risk-normal">中风险</span>
              <span v-else-if="scope.row.risk === 'low'" class="risk-state risk-low">低风险</span>
              <span v-else>{{scope.row.risk?scope.row.risk:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="p1AvgPrice" label="风险指数" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.p1AvgPrice?scope.row.p1AvgPrice:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="p1MinPrice" label="风险点" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.p1MinPrice?scope.row.p1MinPrice:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="p1MaxPrice" label="第三方平台" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.p1MaxPrice?scope.row.p1MaxPrice:'-'}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import {getCharts} from './analysisCharts'
export default {
  data() {
    return {
      areaCode: '',
      // 所属辖区级联选择器配置
      areaList: {
        selectedOptions: [],
        options: [],
        parentCode: '',
        props: {
          checkStrictly: true,
          expandTrigger: 'click',
          value: 'areaCode',
          label: 'areaName',
          children: 'children',
          lazy: true,
          lazyLoad(node, resolve) {}
        }
      },
      selDate: '',
      pickerOptions: {
        disabledDate: (time) => {
          let before = new Date("2018-01-01") - 8.64e7;
          let after = new Date();
          return time.getTime() < before || time.getTime() > after
        }
      },
      tableLoading: false,
      tableData: []
    }
  },
  methods: {
    // 点击区域节点前的圆圈进行选择
    areaChange(val) {
        this.areaList.selectedOptions = val;
        this.tableRefresh();
    },
    selectChange() {

    },
    showCharts() {
      getCharts([], 'riskScale')
      getCharts([], 'riskDistri')
    }
  },
  created() {
    let that = this
    that.areaList.props.lazyLoad = function (node, resolve) {
      // let code = node.value ? node.value : that.userInfoAreaCode;
      // if (code.length > 6) {
      //   return resolve([])
      // }
      // area.findArea(code).then(r => {
      //   if (r.status) {
      //     resolve(r.data)
      //   }
      // });
    }
  },
  mounted() {
    this.showCharts()
  }
}
</script>
<style lang="scss" scoped>
  .bigbox {
    position: relative;
    .page-tilt {
      margin-bottom: 20px;
    }
    .dataBox {
      width: calc(100% + 40px);
      margin-left: -20px;
      padding-bottom: 20px;
      background-color: #edf0f3;
      display: inline-block;
      .sizer {
        width: 100%;
        margin-left: 20px;
        padding-top: 20px;
      }
      .content-box {
        position: relative;
        margin-left: 20px;
        margin-top: 20px;
        background-color: #FFFFFF;
        height: 340px;
        display: inline-block;
        .count {
          width: calc(100% / 3);
          height: 100%;
          >span {
            display: inline-block;
            width: 100%;
            text-align: center;
          }
          >span:first-child {
            font-size: 36px;
            color: #3B3B3B;
            margin-top: 130px;
          }
          >span:last-child {
            font-size: 18px;
            color: #A2AAB6;
            margin-bottom: 130px;
          }
        }
        .title {
          font-size: 15px;
          font-weight: 600;
          color: #393939;
          position: absolute;
          left: 20px;
          top: 16px;
        }
        .echart-box {
          width: calc(100% / 3 * 2);
          height: calc(100% - 80px);
          margin-top: 40px;
          border-left: 1px solid #C2CAD2;
          box-sizing: border-box;
          .echart {
            position: absolute;
            width: calc(100% / 3 * 2 - 80px);
            height: calc(100% - 80px);
            margin: 0 40px;
          }
        }
        .echart {
          position: absolute;
          width: calc(100% - 80px);
          height: calc(100% - 80px);
          margin: 40px;
          // border: 1px solid red;
          // box-sizing: border-box;
        }
      }
      .risk-scale {
        width: calc((100% - 60px) / 3 * 2);
        height: 340px;
      }
      .risk-distri {
        margin-left: 20px;
        width: calc((100% - 60px) / 3);
      }
      .table-box {
        overflow-x: auto;
        width: calc(100% - 40px);
        .table-div {
          position: absolute;
          width: calc(100% - 40px);
          left: 20px;
          top: 57px;
          right: 20px;
        }
      }

    }
  }
</style>
