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

<script>
  import echarts from "echarts";
  import * as mapApi from "api/sub/map";

  export default {
    data() {
      return {
        units: ["千", "万"],
        tap: [
          { type: 'ALL', name: '全部', label: '备案主体' },
          { type: 'CIRCULATION', name: '流通', label: '流通环节' },
          { type: 'RESTAURANT', name: '餐饮', label: '餐饮环节' },
          { type: 'PRODUCT', name: '生产', label: '生产环节' },
          { type: 'CFDA', name: '三小', label: '三小环节' },
        ],
        dit: {
          PRODUCT: "生产",
          CIRCULATION: "流通",
          RESTAURANT: "餐饮",
          WORKSHOP: "小作坊",
          SALE: "小经营店(销售)",
          CFDARESTAURANT: "小经营店(餐饮)",
          VENDORS: "小摊贩",
          CFDA: "三小",
          YZYZ: "有证有照",
          YZWZ: "有照无证",
          WZWZ: "无证无照",
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
      const chart = this.chart = echarts.init(document.getElementById("charts"));
      this.chartPie('ALL');
      window.addEventListener('resize', () => {
        chart.resize();
      }, false);
    },
    methods: {
      tapChange(type, index) {
        if (this.activeIndex !== index) {
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
        mapApi.chartPie(type).then((result) => {
          const data = result.data;
          const series = option.series[0];
          if (data) {
            if (data.list && data.list.length > 0) {
              data.list.forEach((item) => {
                series.data.push({
                  value: item.num,
                  name: this.dit[item.type] || item.type,
                })
              }, this);
            }
            this.setTotal(type, data.total);
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
        }//  else if (num > 1000) {
        //   this.total.num = (num / 1000).toFixed(2);
        //   this.total.unit = this.units[0];
        // } 
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
    top: 26px;
    width: 30%;
    height: 40%;
    min-width: 340px;
    background: rgba(65, 69, 76, .85);
    // opacity: 0.85;
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
        border-bottom: 3px solid rgba(78, 80, 86, 1);
        ;
        text-align: center;
        cursor: pointer;
      }
      .active {
        color: #fff;
        border-color: #0DB5EF;
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