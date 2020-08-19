<template>
  <div class="center">
    <yuanben-tab :tabs="tabs" label="name" value="tab" :tab="tab" @tab-change="choose"></yuanben-tab>
    <ul class="box" v-if="!error">
      <li v-for="(item,index) in this.active" :key='index' v-if="hasAuth(item.auth)">
        <router-link :to="{name:item.url ,query:item.query}" target="_blank">
          <img :src="item.src">
        </router-link>
        <el-tooltip class="item" effect="light" :content="item.p" placement="top-start">
          <p class="textell">{{ item.p }}</p>
        </el-tooltip>
      </li>
    </ul>
    <div v-else class="error">
      <div class="clear_a">
        <img :src="errorIcon">
        <p>暂未开放该功能!</p>
      </div>
    </div>
  </div>
</template>

<script>
  // import this.hasAuth from 'utils/checkAuth';
  import * as base from "api/login";
  import YuanbenTab from 'components/common/YuanbenTab'
  // import * as guard from 'api/guard'
  export default {
    methods: {
      choose(tab) {
        if (this.tab !== tab) {
          this.tab = tab;
          this.active = [];
          if (this.tab == 'FOOD') {
            this.active = this.food;
          }
          if (this.tab == 'GUARD') {
            this.active = this.xcwsGuard;
          }
          if (this.active.length <= 0) {
            this.error = true;
          } else {
            this.error = false;
          }
          console.log(this.tab, this.active)
        }
      },
      hasAuth(right) {
        if (this.auths.length <= 0) {
          return false
        } else {
          const auths = this.auths;
          let flag = false;
          if (auths) {
            const _modules = right.split(",")
            for (let i = 0, len = _modules.length; i < len; i++) {
              const _modulesCode = _modules[i];
              for (let j = 0, lenj = auths.length; j < lenj; j++) {
                if (auths[j] === _modulesCode) { // 有权限
                  flag = true;
                  break;
                }
              }
            }
          }
          return flag;
        }

      }
    },
    async mounted() {
      await base.getAuths().then(res => {
        this.auths=res.data
      })
      //h5大屏-获取访问密匙
      // await guard.getSecretKey().then((res) => {
      //   if (res.status) {
      //   this.XCWSOpenSecret=res.data.XCWSOpenSecret;
      //   let obj={src:require('assets/img/schoolTrace/ipadBg.png'),p:'校餐卫士H5',url:'indexH5',query:{entityId:'FA0E67F801D945E09D8480E74078B5EC',XCWSOpenSecret:this.XCWSOpenSecret}}
      //   this.xcwsGuard.push(obj)
      //   }else{
      //   this.$message.warning('h5大屏获取访问密匙失败')
      //   }
      // }).catch(function (error) {
      //   console.log(error);
      // })
      this.active = this.food;
      if (this.active.length <= 0) {
        this.error = true;
      } else {
        this.error = false;
      }
      if (this.hasAuth('bigdata.food.views')) {
        this.tabs.push({
          tab: "FOOD",
          name: "食品"
        });
        
      }
      if(this.hasAuth('bigdata.medi.views')){
        this.tabs.push({tab: 'MEDICINE', name: "药品"});
      }
      if(this.hasAuth('bigdata.cosmetic.views')){
        this.tabs.push({tab: "COSMETIC", name: "化妆品"});
      }
      if(this.hasAuth('bigdata.maai.views')){
        this.tabs.push({tab: 'MEDICAL_EQUIPMENT', name: "医疗器械"});
      }
      if(this.hasAuth('bigdata.tzsb.views')){
        this.tabs.push({tab: "SPECIAL_EQUIPMENT", name: "特种设备"});
      }
      if(this.hasAuth('bigdata.guard.views')){
        this.tabs.push({tab: "GUARD", name: "校餐监管"});
        this.xcwsGuard.map(item=>{
          if(this.hasAuth(item.auth)){
            item.authShow=1
          }
        })
      }
      console.log(this.tabs);
    },
    data() {
      return {
        // XCWSOpenSecret:'',
        tabs: [],
        auths:[],
        tab: 'FOOD',
        errorIcon: require('assets/img/bigData/bigDataError.png'),
        error: false,
        active: [],
        food: [{
            src: require('assets/img/bigData/bigDataMap.jpg'),
            p: '主体全局分布图',
            url: 'bigData.foodMap',
            query: {},
            auth: 'bigdata.food.views|subject.distributed',
          
          },
          {
            src: require('assets/img/bigData/tjMap.jpg'),
            p: '主体统计总数(map)',
            url: 'bigData.statisticsMap',
            query: {},
            auth: 'bigdata.food.views|subject.statistics',
          
          },
          // {src:require('assets/img/bigData/tj.png'),p:'主体统计总数',url:'bigData.foodStatistics',query:{}},
          // {src:require('assets/img/bigData/foodMapA.jpg'),p:'源本智慧城市监管平台',url:'bigData.foodMapA',query:{}},
          // {src:require('assets/img/bigData/foodMapB.jpg'),p:'主体分布情况',url:'bigData.foodMapB',query:{}},
          {
            src: require('assets/img/bigData/togNewBigData.png'),
            p: 'tog新版大数据',
            url: 'subjectData.foodConsole',
            query: {},
            auth: 'bigdata.food.views|bigdata',
          
          },
          {
            src: require('assets/img/subjectData/4kTrace/4k.png'),
            p: '4k溯源大屏',
            url: 'subjectData.4k',
            auth: 'bigdata.food.views|source',
          
          },
          // {src:require('assets/img/bigData/minEmergency.png'),p:'应急处置',url:'bigData.emergency'},
          // {src:require('assets/img/bigData/minRedBlack.png'),p:'红黑榜',url:'bigData.redBlack'},
          // {src:require('assets/img/bigData/minOrder.png'),p:'订单农业',url:'bigData.order'},
        ],
        xcwsGuard: [{
            src: require('assets/img/xcwsWarnCenter.png'),
            p: '预警中心',
            url: 'xcwsWarnStatistics',
            auth: 'bigdata.guard.views|warning.center',
          
          },
          // {src:require('assets/img/bigData/AIScreenMin.png'),p:'AI智能后厨',url:'AICamera.AIScreenV1'},
          //  {src:require('assets/img/bigData/AIScreenMin.png'),p:'AI智能后厨',url:'AICamera.AIScreenV101'},
          // {src:require('assets/img/bigData/AIAccompanyScreenMin.png'),p:'AI智能校长陪餐',url:'bigData.xcws.AIAccompanyScreen'},
        ]
      }
    },
    components: {
      YuanbenTab,
    }
  }
</script>

<style scoped lang='scss'>
  .center {
    width: 1024px;
    height: 100%;
    min-height: 100%;
    margin: 52px auto 0;
  }

  .box {
    width: calc(100% + 20px);
    min-height: 200px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;

    li {
      width: 240px;
      height: 200px;
      box-sizing: border-box;
      margin-right: 20px;

      >a {
        display: block;
        height: 136px;
        width: 100%;
        overflow: hidden;
        background: #000000;
        border-radius: 8px;
        margin-bottom: 10px;

        // border: 2px solid #000;
        // &:hover{
        //       border: 2px solid #0db5ef;
        // }
        img {
          height: 100%;
          width: 100%;
        }
      }

      .textell {
        font-size: 16px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(57, 57, 57, 1);
        line-height: 22px;
      }
    }
  }

  .error {
    width: 100%;
    height: 100%;

    >div {
      width: 800px;
      height: 230px;
      margin: 100px auto 0;

      p {
        font-size: 36px;
        font-family: PingFangSC-Semibold;
        color: rgba(57, 57, 57, 1);
        line-height: 230px;
      }
    }
  }
</style>