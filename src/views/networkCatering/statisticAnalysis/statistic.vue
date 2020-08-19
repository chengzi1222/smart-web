<template>
  <div class="bigbox">
    <div class="page-tilt"> 
      <b></b><span>商家统计</span>
    </div>
    <div class="dataBox">
      <div class="sizer">
        <el-cascader ref="cascader" class="w150" v-model="areaCode" :options="areaList.options" @change="areaChange" :props="areaList.props" clearable placeholder="所属辖区"></el-cascader>
        <el-select v-model="platformVal" clearable placeholder="采集平台" @change="selectChange" class="ml20 w150">
          <el-option v-for="item in platformOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="kindsVal" clearable placeholder="品类" @change="selectChange" class="ml20 w150">
          <el-option v-for="item in kindsOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="echart-box mer-count">
        <span class="title">商家总数统计</span>
        <div class="echart" id="merCount"></div>
        <div class="block">
          <el-slider v-model="merCountVal"  :show-tooltip="false" :min="0" :max="dateMax" @input="merCountValChange">
          </el-slider>
        </div>
      </div>
      <div class="echart-box mer">
        <span class="title">商家统计</span>
        <div class="echart" id="mer"></div>
        <div class="block">
          <el-slider v-model="merVal" :show-tooltip="false" :min="0" :max="dateMax" @input="merValChange"></el-slider>
        </div>
      </div>
      <div class="echart-box mer-area">
        <span class="title">商家辖区数量统计</span>
        <div class="echart" id="merArea"></div>
        <div class="block">
          <el-slider v-model="merAreaVal" :show-tooltip="false" :min="0" :max="areaMax" @input="merAreaValChange"></el-slider>
        </div>
      </div>
      <div class="echart-box mer-type">
        <span class="title">商家经营类别统计</span>
        <div class="echart" id="merType"></div>
      </div>
    </div>
  </div>
</template>
<script>
import {getCharts} from './statisticCharts'
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
      platformVal: '',
      platformOptions: [],
      kindsVal: '',
      kindsOptions: [],
      lastMerCountVal: 0, // 商家总数统计 折线图的slider前一次的值
      merCountVal: 0, // 商家总数统计 折线图的slider当前的值
      lastMerVal: 0, // 商家统计 曲线图的slider前一次的值
      merVal: 0, // 商家统计 曲线图的slider当前的值
      lastMerAreaVal: 0, // 商家辖区数量 柱状图的slider前一次的值
      merAreaVal: 0, // 商家辖区数量 柱状图的slider当前的值
      merCountData: [], // 商家总数统计数据
      merData: [], // 商家统计数据
      merData2: [], // 商家统计数据
      merAreaData: [], // 商家辖区数量数据
      xAxisData: [], // 商家总数统计和商家统计 x轴 当前展示的月份数据
      dateData: [], // 商家总数统计和商家统计 x轴 所有月份数据
      xAxisAreaData: [], // 商家辖区数量 x轴 当前展示的月份数据
      areaData: [] // 商家辖区数量 x轴 所有月份数据
    }
  },
  computed: { // slider最大值
    dateMax: function() {
      return this.dateData.length - 6
    },
    areaMax:function() {
      return this.areaData.length - 10
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
    showCharts() { // 所有charts全部初始化
      getCharts(this.merCountData, this.xAxisData, 'merCount')
      getCharts({'merData': this.merData, 'merData2': this.merData2}, this.xAxisData, 'mer')
      getCharts(this.merAreaData, this.xAxisAreaData, 'merArea')
      getCharts(null, null, 'merType')
    },
    // 商家总数统计 slider改变图表
    merCountValChange(val) { // 数据改变时触发（使用鼠标拖曳时，活动过程实时触发）
      this.xAxisData = this.dateData.slice(val, val+6)
      if(val === this.lastMerCountVal) return // slider没有滑动
      let valueBase1 = (Math.random() * 2500).toFixed(0)
      this.xAxisData = this.dateData.slice(val, val+6)
      if(this.lastMerCountVal < val) { // slider右滑增加
        this.merCountData.shift()
        this.merCountData.push(valueBase1)
      } else if(this.lastMerCountVal > val) { // slider左滑减小
        this.merCountData.pop()
        this.merCountData.unshift(valueBase1)
      }
      getCharts(this.merCountData, this.xAxisData, 'merCount')
      this.lastMerCountVal = val
    },
    // 商家统计 slider改变图表
    merValChange(val) {
      if(val === this.lastMerVal) return // slider没有滑动
      let valueBase2 = (Math.random() * 500).toFixed(0)
      let valueBase3 = (Math.random() * 500).toFixed(0)
      this.xAxisData = this.dateData.slice(val, val+6)
      if(this.lastMerVal < val) { // slider右滑增加
        this.merData.shift()
        this.merData2.shift()
        this.merData.push(valueBase2)
        this.merData2.push(valueBase3)
      } else if(this.lastMerVal > val) { // slider左滑减小
        this.merData.pop()
        this.merData2.pop()
        this.merData.unshift(valueBase2)
        this.merData2.unshift(valueBase3)
      }
      getCharts({'merData': this.merData, 'merData2': this.merData2}, this.xAxisData, 'mer')
      this.lastMerVal = val
    },
    // 商家辖区数量统计 slider改变图表
    merAreaValChange(val) {
      if(val === this.lastMerAreaVal) return // slider没有滑动
      let valueBase4 = (Math.random() * 2500).toFixed(0)
      this.xAxisAreaData = this.areaData.slice(val, val+10)
      if(this.lastMerAreaVal < val) { // slider右滑增加
        this.merAreaData.shift()
        this.merAreaData.push(valueBase4)
      } else if(this.lastMerAreaVal > val) { // slider左滑减小
        this.merAreaData.pop()
        this.merAreaData.unshift(valueBase4)
      }
      getCharts(this.merAreaData, this.xAxisAreaData, 'merArea')
      this.lastMerAreaVal = val
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
    // 商家总数 和 商家统计 假数据
    this.dateData = ['2017-01','2017-02','2017-03','2017-04','2017-05','2017-06','2017-07','2017-08','2017-09','2017-10','2017-11','2017-12']
    for(let i=0; i<this.dateData.length; i++) {
      let valueBase1 = (Math.random() * 2500).toFixed(0)
      let valueBase2 = (Math.random() * 500).toFixed(0)
      let valueBase3 = (Math.random() * 500).toFixed(0)
      this.merCountData.push(valueBase1)
      this.merData.push(valueBase2)
      this.merData2.push(valueBase3)
    }
    this.xAxisData = this.dateData.slice(0, 6)
    // 商家辖区总数统计 假数据
    this.areaData = ['武侯区', '高新区', '青羊区', '金牛区', '新都区', '天府新区', '锦江区', '成华区', '温江区', '郫都区', '龙泉驿区', '青白江区', '双流区', '浦江县', '大邑县', '金堂县', '新津县', '都江堰市', '彭州市', '邛崃市', '崇州市', '简阳市']
    for(let i=0; i<this.areaData.length; i++) {
      let valueBase4 = (Math.random() * 2500).toFixed(0)
      this.merAreaData.push(valueBase4)
    }
    this.xAxisAreaData = this.areaData.slice(0, 10)
    this.showCharts()
  }
}
</script>
<style lang="scss" scoped>
  .bigbox {
    position: relative;
    .dataBox {
      width: calc(100% + 40px);
      margin-left: -20px;
      padding-bottom: 20px;
      background-color: #edf0f3;
      .sizer {
        width: 100%;
        margin-top: 20px;
        margin-left: 20px;
        padding-top: 20px;
      }
      .echart-box {
        position: relative;
        margin-left: 20px;
        height: 370px;
        background-color: #FFFFFF;
        display: inline-block;
        .title {
          font-size: 15px;
          font-weight: 600;
          color: #393939;
          position: absolute;
          left: 20px;
          top: 16px;
        }
        .echart {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        .block {
          position: absolute;
          width: calc(100% - 70px);
          right: 20px;
          bottom: 30px;
        }
        /deep/.el-slider {
          .el-slider__runway {
            .el-slider__bar {
              height: 4px;
              background-color: #E5E9F2;
              border-radius: 2px;
            }
            .el-slider__button-wrapper {
              top: -10px;
              :before {
                content: '';
                display:inline-block;
                height: 6px;
                width: 8px;
                border-left: 2px solid#B3BDD1;
                border-right: 2px solid#B3BDD1;
                border-radius: 1px;
              }
              .el-slider__button {
                width: 36px;
                height: 20px;
                border-radius: 10px;
                background: #FFFFFF;
                border: 2px solid #B3BDD1;
              }
            }
          }
        }
      }
      .mer-count {
        width: calc((100% - 60px) / 2);
      }
      .mer {
        width: calc((100% - 60px) / 2);
        margin-left: 20px;
        margin-top: 20px;
      }
      .mer-area {
        width: calc((100% - 60px) / 3 * 2);
      }
      .mer-type {
        margin-left: 20px;
        margin-top: 20px;
        width: calc((100% - 60px) / 3);
      }
    }
  }
</style>