<template>
  <div class="charts-box">
    <div class="head">
      <div @click="tapChange(item.type,index)" v-for="(item,index) in tap" :key="index" :class="{active:index===activeIndex}" class="item">
        {{ item.name }}
      </div>
    </div>
    <div class="body">
      <div class="position">
        <i class="el-icon-location" style="cursor:pointer;"></i>
        <span>{{ center }}</span>
      </div>
      <div class="total">
        <p class="num-box">
          <span class="num">{{ total.num }}</span>
          <span v-if="total.unit">{{ total.unit }}</span>
        </p>
        <p class="charts-title">
          <span>{{ total.label }}</span>
        </p>
      </div>
      <div class="charts" id="charts">

      </div>
    </div>
  </div>
</template>

<script type="module">
  import echarts from "echarts";
  import { getMapPeiList } from 'api/medicalDevices/subMap'

  export default {
    props:{
      index: {
        type: String,
        default: 'ALL'
      }
    },
    data() {
      return {
        units: ["千", "万"],
        tap: [
          { type: 'ALL', name: '全部', label: '备案主体' },
          { type: 'MAAI_PRODUCT', name: '生产主体', label: '生产主体' },
          { type: 'MAAI_MANAGER', name: '经营主体', label: '经营主体' },
          { type: 'MAAI_EMPLOY', name: '使用主体', label: '使用主体' },
        ],
        dit: {
          MAAI_MANAGER: "经营主体",
          MAAI_EMPLOY: "使用主体",
          MAAI_PRODUCT: '生产主体',
          CES_BAB: "理发店",
          CES_BS: "美容院",
          CES_CSH: "整容医院",
          CES_NS: "美甲店",
          CMS_SPM: "商场",
          CMS_DS: "药店",
          CMS_SM: "超市",
          OTHER_MANAGER: '其他经营主体',
          OTHER_EMPLOY: '其他使用主体',
          CPS_PE: '生产企业',
        },
        activeIndex: 0,
        chart: null,
        total: {
          num: null,
          unit: null,
          label: null,
        }
      };
    },
    mounted() {
      if(this.$route.query.type){
        this.index = this.$route.query.type;
      }
      if(this.index=='MAAI_MANAGER'){
        this.activeIndex=2;
      }else if(this.index=='MAAI_EMPLOY'){
        this.activeIndex=3;
      }else if(this.index=='MAAI_PRODUCT'){
        this.activeIndex=1;
      }else{
        this.activeIndex=0;
      }
      this.chartPie(this.index);
      const chart = this.chart = echarts.init(document.getElementById("charts"));
      window.addEventListener('resize', () => {
        chart.resize();
      }, false);
    },
    methods: {
      tapChange(type, index) {
        if (this.activeIndex !== index) {
          this.$router.push({query:{type:type}});
          this.activeIndex = index;
          this.chartPie(type);
        }
      },
      showChart(option) {
        this.chart.clear();
        this.chart.setOption(option);
      },
      getOption(type) {
        return {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          color: ['#6477FF', '#0DB5EF', '#FFFFFF', '#B45B3E'],
          series: [{
            type: "pie",
            radius: ['70%', '75%'],
            center: ["50%", "50%"],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 1)"
              }
            }
          }]
        };
      },
      chartPie(type) {
        const option = this.getOption();
        getMapPeiList(type).then( result => {
          const data = result.data;
          const series = option.series[0];
          series.data = [];
          let total = 0;
          if (data) {
            if (data && data.length > 0) {
              data.forEach((item) => {
                total += item.num;
                series.data.push({
                  value: item.num,
                  name: this.dit[item.type] || item.type,
                })
              }, this);
            }
            this.setTotal(type, total);
            series.name = this.total.label;
            this.showChart(option);
          }
        });
      },
      setTotal(type, num) {
        this.tap.forEach((item) => {
          if (item.type === type) {
            this.total.label = item.label;
            return;
          }
        }, this);
        if (num > 10000) {
          this.total.num = (num / 10000).toFixed(2);
          this.total.unit = this.units[1];
        }
        else {
          this.total.unit = null;
          this.total.num = num;
        }
      }
    },
    computed: {
      center() {
        return this.$store.getters.mapCenter.center;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .charts-box {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 20px;
    top: 20px;
    width: 30%;
    height: 40%;
    min-width: 340px;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 3;
    .head {
      font-size: 14px;
      color: #c5cfd9;
      display: flex;
      flex-wrap: nowrap;
      .item {
        height: 40px;
        line-height: 40px;
        flex: 1;
        border-bottom: 3px solid #000;
        text-align: center;
        cursor: pointer;
      }
      .active {
        color: #fff;
        border-color: #0db5ef;
      }
    }
    .body {
      flex: 1;
      box-sizing: border-box;
      padding-top: 30px;
      .position {
        cursor: pointer;
        color: #fff;
        font-size: 16px;
        text-align: right;
        position: absolute;
        right: 15px;
        top: 50px;
        >span {
          margin-left: 10px;
        }
      }
      .charts {
        height: 92%;
        width: 100%;
      }

      .total {
        position: absolute;
        text-align: center;
        width: 100%;
        // left: calc(50% - 40px);
        top: calc(50% - 20px);
        font-size: 14px;
        .num-box {
          color: #a2aab6;
          margin: 3% auto 0;
          .num {
            font-size: 32px;
            color: #fff;
          }
        }
        .charts-title {
          color: #fff;
        }
      }
    }
    .foot {
      text-align: center;
      color: #fff;
      background: #6d6f73;
    }
  }
</style>