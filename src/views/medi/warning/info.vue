<template>
  <div class="info">
    <div class="page-tilt">
      <b></b>
      <span>{{ this.$route.query.warningTaskName }}执行情况</span>
    </div>
    <yuanben-tab :tabs="tabs" label="name" value="tab" :tab="tab" @tab-change="choose"></yuanben-tab>
    <div class="main-body">
      <warn-map :taskId="this.$route.query.warningTaskId" v-if="tab === 'map'"></warn-map>
      <statistic-chart :taskId="this.$route.query.warningTaskId" v-if="tab === 'chart'"></statistic-chart>
      <detail-list :taskId="this.$route.query.warningTaskId" v-if="tab === 'list'"></detail-list>
    </div>
    <!-- 底部按钮 start-->
    <div class="foot-btn" style="z-index:998">
      <div>
        <el-button @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import YuanbenTab from 'components/common/YuanbenTab'
  import statisticChart from './com/chart/index'
  import detailList from './com/list/list'
  import warnMap from './com/map/index'


  export default {
    data() {
      return {
        tabs: [{
          name: '预警地图', tab: 'map',
        }, {
          name: '统计图表', tab: 'chart',
        }, {
          name: '执行明细', tab: 'list',
        }],
        tab: 'map',
        info: {
          entityCount: 0,
          tobeExecuteCount: 0,
          unRevicedCount: 0,
          executedCount: 0,
          dispList: [],
          startTime: '',
          state: '',
        },
      }
    },
    mounted() {

    },
    methods: {
      choose(tab) {
        if (this.tab !== tab) {
          this.tab = tab
        }
      },
      init() {

      },
    },
    computed: {

    },
    components: {
      YuanbenTab, statisticChart, detailList, warnMap
    }
  };
</script>

<style scoped lang="sass">
  /* 切换页面下面的内容 */
  .info {
    height: 100%;
  }

  .main-body {
    height: calc(100% - 112px);
    margin-top: -22px;
    .router-btn {
      margin: 0 5px;
    }
  }
</style>