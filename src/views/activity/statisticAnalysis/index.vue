<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b>
      <span>{{ taskName }}执行情况</span>
      <div class="back" @click="goBack"><i class="icon iconfont icon-back"></i></div>
    </div>
    <ul class="tab-box">
      <li class="tabLi" v-for="(item,index) in patternLis" :data-index="index" :class="index==mess?'li-bott':''" @click="choose(index,item.type)">
        <div :data-index='index'>
          <span :class="index==mess?'li-span':''">{{item.name}}</span>
        </div>
      </li>
      <li class="tab-bott"></li>
    </ul>
    <MediMap @messFUn='choose' v-if="mess == 0" :id="$route.query.taskId"></MediMap>
    <Analyze v-if="mess == 1" :id="$route.query.taskId"></Analyze>
    <KitchenLive v-if="mess == 2" :id="$route.query.taskId"></KitchenLive>
    <Live v-if="mess == 3" :id="$route.query.taskId"></Live>
    <BoxLunch v-if="mess == 4" :id="$route.query.taskId"></BoxLunch>
    <DataManage v-if="mess == 5" :id="$route.query.taskId"></DataManage>
  </div>
</template>

<script>
  import BoxLunch from './boxLunch.vue'
  import Live from './live.vue'
  import DataManage from './dataManage.vue'
  import KitchenLive from './kitchenLive.vue'
  import Analyze from './analyze.vue'
  import MediMap from 'views/bigData/mediMap/mapIndex'

  export default {
    methods: {
      //切换导航样式
      choose(index) {
        if (this.mess != index) {
          this.mess = index;
          this.backNum++;
          this.$router.push({
            query: {
              taskId: this.$route.query.taskId,
              taskName: this.$route.query.taskName,
              starTime: this.$route.query.starTime,
              endTime: this.$route.query.endTime,
              mess: index
            }
          })
        }
      },
      goBack() {
        history.go(-this.backNum);
      }
    },
    mounted() {
      if (this.$route.query.mess) {
        this.mess = this.$route.query.mess
      }
      this.taskName = this.$route.query.taskName;
    },
    data() {
      return {
        taskName: '',
        mess: 0,
        patternLis: [{
          name: '全局地图',
          type: 'all',
          num: 0
        }, {
          name: '统计分析',
          type: 'all',
          num: 0
        }, {
          name: '阳光厨房',
          type: 'pass',
          num: 0
        }, {
          name: '直播配置',
          type: 'unPass',
          num: 0
        }, {
          name: '盒饭出厂记录',
          type: 'unPass',
          num: 0
        }, {
          name: '上报数据管理',
          type: 'unPass',
          num: 0
        }],
        backNum: 1
      };
    },
    components: {
      BoxLunch,
      Live,
      DataManage,
      KitchenLive,
      Analyze,
      MediMap
    }
  }
</script>

<style scoped lang="sass">
  .bigbox {
    height: 100%;
  }

  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
    margin-bottom: 20px;
  }

  .tab-box .tabLi {
    width: 110px;
    height: 50px;
    line-height: 50px;
    /* margin-right: 30px; */
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9A9A9A;
    text-align: center;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0DB5EF;
    z-index: 666;
    position: relative;
  }

  .tab-box .li-span {
    color: #393939;
  }

  .back {
    cursor: pointer;
    display: inline-block;
    color: #606979;
    height: 22px;
    width: 22px;
    line-height: 22px;
  }

  .back i {
    font-size: 22px !important;
  }
</style>