<template>
    <div class="bigbox">
    	<div class="page-tilt">
    	    <b></b><span>资讯管理</span>
    	</div>
         <yuanben-tab :tabs="tabs" label="name" value="tab" :tab="tab" @tab-change="choose"></yuanben-tab>
        <news-table :newsTypeList="newsTypeList" :viewTypeList="viewTypeList" v-if="tab === 'newsTable'"></news-table>
        <slider-img v-if="tab === 'sliderImg'"></slider-img>
    </div>
</template>

<script>
import YuanbenTab from 'components/common/YuanbenTab'
import NewsTable from './com/newsTable'
import SliderImg from './com/sliderImg'
import * as newsApi from 'api/news/news'
export default {
    methods: {
         choose(tab) {
            if (this.tab !== tab) {
                this.tab = tab
            }
        },
      //判断激活显示资讯列表和资讯轮播图列表，默认显示资讯列表
      activeTemplate() {
           if (this.tabType != 'newsTable' && this.tabType != 'sliderImg') {
             this.tab = 'newsTable';
           } else {
             this.tab = this.tabType;
           }
      },
    },
    created() {
      // 获得后端资讯标签类型列表等页面初始化需要的信息
      newsApi.webInit().then((r) => {
        this.viewTypeList = r.data.viewTypeList;
        this.newsTypeList = r.data.newsTypeList;
        this.viewTypeList.splice(0, 0, {key: '', value: '全部类型'});
        this.newsTypeList.splice(0, 0, {id: '', type_name: '全部标签'});
      });
    },
  mounted() {
    this.activeTemplate();
    },
    data() {
        return {
          tabType: this.$route.query.tab_type,
            tabs:[
              {tab: "newsTable", name: "资讯"},
              {tab: 'sliderImg', name: "轮播图"}
            ],
            tab: 'newsTable',
            newsTypeList: [],
            viewTypeList: []
        }
    },
    components: {
        YuanbenTab,NewsTable,SliderImg
    }
}
</script>

<style scoped lang="sass">

</style>
