<template>
    <div class="bigbox">
    	<div class="page-tilt">
    	    <b></b><span>{{isEdit ? '编辑' : '添加'}}资讯</span> <div class="back" @click="backList()"><i class="icon iconfont icon-back"></i></div>
    	</div>
        <yuanben-tab :tabs="tabs" label="name" value="tab" :tab="tab" @tab-change="choose"></yuanben-tab>
        <text-news :newsTypeList="newsTypeList" :editInfo="editInfo" v-if="tab === 'WORD'" ></text-news>
        <img-news :newsTypeList="newsTypeList" :editInfo="editInfo"  v-if="tab === 'PICWORD'"></img-news>
        <video-news :newsTypeList="newsTypeList" :editInfo="editInfo" v-if="tab === 'VIDEO'"></video-news>
    </div>
</template>

<script>
import YuanbenTab from 'components/common/YuanbenTab'
import TextNews from './com/textNews'
import ImgNews from './com/imgNews'
import VideoNews from './com/videoNews'
import * as newsApi from 'api/news/news'
export default {
    methods: {
      backList() {
        this.$router.push({ name: 'news.list', query: { tab_type: 'newsTable' } });
      },
        choose(tab) {
            if (this.tab !== tab) {
                this.tab = tab
            }
        },
        //判断是否编辑状态，并激活显示文字，图文，视频组件
        activeTemplate() {
          let tempTabs = this.initTabs;
          if (this.isEdit) {
              for (let i = 0; i < tempTabs.length; i++) {
                  if (tempTabs[i].tab === this.view_type) {
                    this.tabs.push(tempTabs[i]);
                  }
              }
          } else {
            this.tabs = tempTabs;
          }
        },
      //. 加载详情
      loadDetail() {
        if (!this.isEdit) {
          return ;
        }
        newsApi.detail({id: this.newsId}).then((r) =>{
          let detail = {};
          if (r.status) {
            if (!r.data) {
              this.$message.error("未查询到资讯详情");
            } else {
              detail = r.data;
            }
          }
          let tmpDetail = {
            id : detail.id,
            title: detail.title,
            viewType: detail.view_type,
            videoYes: detail.video_yes,
            bigYes: detail.big_yes,
            pubDeptName: detail.pub_dept_name,
            content: detail.content,
            pubYes: detail.pub_yes,
            newsTypeId: detail.news_type_id,
            videoUrl: detail.video_url,
            imgurls: detail.imgurls,
            releaseTypeList: detail.release_type_list
            // , picList: detail.imgurls.split(",")
          };
          this.editInfo = {
            detail : tmpDetail,
            isEdit : this.isEdit,
            view_type: this.view_type
          }
        });
      }
    },
    mounted() {
      // 获得后端资讯标签类型列表等页面初始化需要的信息
      newsApi.webInit().then((r) => {
        this.newsTypeList = r.data.newsTypeList;
      });
      this.activeTemplate();
      this.loadDetail();
    },
   /**
    * 对于编辑资讯时，资讯正文中已关联的图片被删除，但数据库仍存在文件的情况，需要
    * 1.编辑后点击保存时正则匹配当前资讯正文中的所有关联的图片src,将其与关联表中资讯正文关联的图片集合匹配，匹配不上则删除关联数据和文件。
    * 2.定时实现上面的删除流程，两种方式都行。
    */
    data() {
        return {
          newsId: this.$route.query.id,
          view_type: this.$route.query.view_type,
          isEdit: this.$route.name == 'news.edit' && this.$route.query.id && this.$route.query.view_type || false, //是编辑资讯,
          editInfo: {
             detail: {},
             isEdit: this.isEdit,
             view_type: this.view_type
          },
          initTabs:[
            {tab: "WORD", name: "文字资讯"},
            {tab: 'PICWORD', name: "图文资讯"},
            {tab: 'VIDEO', name: "视频资讯"}
          ],
            tabs:[],
            tab: this.$route.query.view_type || 'WORD',
            newsTypeList: []
        }
    },
    components: {
        YuanbenTab,TextNews,ImgNews,VideoNews
    }
}
</script>

<style scoped lang="sass">

  .back{
    cursor: pointer;
    display: inline-block;
    color: #606979;
    height: 22px;
    width: 22px;
    line-height: 22px;
  }
  .back i{
    font-size: 22px !important;
  }
</style>
