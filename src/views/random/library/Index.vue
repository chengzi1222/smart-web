<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b>
      <span>一单两库</span>
    </div>
    <yuanben-tab :tabs="tabs" label="name" value="tab" :tab="tab" @tab-change="choose"></yuanben-tab>
    <RandomInventory v-if="tab === 'table'" ></RandomInventory>
    <SubjectDirectories v-if="tab === 'subject'" ></SubjectDirectories>
    <person-directories v-if="tab === 'person'" ></person-directories>
  </div>
</template>

<script>
import YuanbenTab from 'components/common/YuanbenTab'
import PersonDirectories from 'views/random/library/person/PersonDirectories'
import RandomInventory from "./project/RandomInventory";
import SubjectDirectories from "./subject/SubjectDirectories";
import hasAuth from 'utils/checkAuth';
export default {
  methods: {
    //切换导航样式
    choose(tab) {
      if (this.tab !== tab) {
        this.tab = tab
        this.$router.push({ name: "random.library", query: { tab: tab } })
      }
    },
    initTab(currentTab) {

      if (!currentTab && this.tabs.length > 0) {  // 当前选项是没有权限
        this.tab = this.tabs[0].tab
        this.$router.push({ name: "random.library", query: { tab: this.tab } })
      }
    },
  },
  mounted() {
    this.tabs = this.data.filter(item => {  // 去掉没有权限选项
      return !item.auth ? true : hasAuth(item.auth)
    })
    this.tab = this.$route.query.tab || this.tab;
    const currentTab = this.tabs.find(item => { // 当前选项是否有权限
      if (item.tab === this.tab) {
        return item;
      }
    })
    this.initTab(currentTab)
  },
  data() {
    return {
      tabs: [],
      data: [{
        name: '随机抽查事项清单', tab: 'table',
        auth: 'food.library.point'
      }, {
        name: '执法检查人员名录库', tab: 'person', auth: 'food.library.person'
      }, {
        name: '主体名录库', tab: 'subject',
         auth: 'food.library.subject'
      }],
      tab: 'table'
    };
  },
  components: {
    RandomInventory, SubjectDirectories, YuanbenTab, PersonDirectories
  },
  watch: {
    '$route.query.tab'() {
      this.tab = this.$route.query.tab;
      if (!this.tab) {
        this.initTab(this.tab)
      }
    }
  }
}
</script>

<style scoped lang="sass">
.bigbox {
  /* position: relative; */
}
.tab-box {
  width: 100%;
  display: flex;
  position: relative;
  margin-bottom: 20px;
  padding: 0 !important;
}
.tab-box .tabLi {
  width: 165px;
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
.tab-box .li-span {
  color: #393939;
}
.tab-box span:first-child {
  margin-right: 10px;
}
</style>
