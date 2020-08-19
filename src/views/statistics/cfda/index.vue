<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>统计分析 - 三小</span>
    </div>

    <ul class="tab-box">
      <li v-for="(item,index) in lists" :key="item.tabName" @click="liClick(index)" :data-index='index' :class="index == defaultIndex? 'li-bott':''">
        <span :data-index='index'>{{item.tabName}}</span>
      </li>
      <li class="tab-bott"></li>
    </ul>

    <div class="main-body">
      <statistic v-if="tableKey == 0"></statistic>
      <report v-if="tableKey == 1"></report>
      <work-report v-if="tableKey == 2"></work-report>
    </div>

  </div>
</template>

<script>
import statistic from 'views/statistics/cfda/cfda_statistics';
import report from 'views/statistics/cfda/cfda_report_forms';
import WorkReport from 'views/statistics/cfda/cfda_work_statistics';

export default {
  mounted() {

  },
  components: {
    statistic,
    report,
    WorkReport
  },
  methods: {
    liClick(e) {
      this.defaultIndex = e;
      this.tableKey = this.lists[e].key;
    },
  },
  data() {
    return {
      tableKey: 0,
      lists: [
        { tabName: "主体概况", key: 0 },
        { tabName: "统计报表", key: 1 },
        { tabName: "办件统计", key: 2 },
      ],
      defaultIndex: 0, //控制tab导航样式
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
</style>
