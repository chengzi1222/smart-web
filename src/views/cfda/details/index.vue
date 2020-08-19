<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>三小档案</span>
    </div>
    <div style="margin-top:20px;">
      <span style="font-size:20px;margin-right:1px;">{{info.entityName}}</span>
      <span style="color:#A2AAB6;margin-right:20px;">
        <qrcode v-if="shows" :url="entityUrl" :backImg="this.backImg" v-on:refreshbizlines="downloadImage" :datas="this.info"></qrcode>
      </span>
      <span style="color:#A2AAB6">主体类型：{{info.typeStr}}</span>
    </div>
    <ul class="tab-box">
      <li v-for="(item,index) in lists" :key="item.tabName" @click="liClick(index)" :data-index='index' :class="index == defaultIndex? 'li-bott':''">
        <span :data-index='index'>{{item.tabName}}</span>
      </li>
      <li class="tab-bott"></li>
    </ul>
    <div class="main-body">
      <entity v-if="currentInfo == infoType.entity" :cfda="info"></entity>
      <record-list v-if="currentInfo == infoType.record" :currentEntityMenu="currentEntityMenu.archives" :entityId="info.id"></record-list>
      <entity-patrol-record-list v-if="currentInfo == infoType.entityPatrolRecord" :entityId="info.id"></entity-patrol-record-list>
      <entity-punish-record-list v-if="currentInfo == infoType.entityPunishRecord" :entityId="info.id"></entity-punish-record-list>
    </div>
    <!-- 底部按钮背景 -->
    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button style="width:120px;" @click="backBtn">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getCfda } from "api/cfda/details.js";
import { INFO_TYPE, InfoTab, CURRENT_ENTITY_MENU } from "../workflow/workUtil.js";
import entity from 'views/cfda/details/info';
import recordList from 'views/cfda/details/workflow_record';
import qrcode from 'components/QRcode.vue';
import entityPatrolRecordList from 'views/patrol/record/entityPatrolRecord';
import entityPunishRecordList from 'views/enforce/entityPunishRecord';

export default {
  components: {
    entity,
    recordList,
    qrcode,
    entityPatrolRecordList,
    entityPunishRecordList
  },
  async mounted() {
    this.entityId = this.$route.query.id;
    this.init(this.entityId);
  },
  methods: {
    async init(id) {
      await getCfda(id).then((r) => {
        this.info = r.data;
        this.infoType = INFO_TYPE;
        this.currentEntityMenu = CURRENT_ENTITY_MENU;
        this.lists = InfoTab('INFO');
      });
      this.currentInfo = this.lists && this.lists.length > 0 ? this.lists[0].key : 'NONE';
      //二维码素材
      this.entityUrl = `${this.$store.getters.base.qrUrl.qrUrl}?t=F_ENTITY&v=1&id=`+id
      if(this.$store.state.common.user.areaCode.substring(0,4)=='4419'){//处理东莞环境
        this.backImg = require('assets/img/codeBackDG.png');
      }else{
        this.backImg = require('assets/img/codeBack.png');
      }
      this.shows = true;
    },
    backBtn() {
      if (this.$route.query.back) {
        this.$router.push({ name: this.$route.query.back });
      } else {
        this.$router.go(-1);
      }

    },
    liClick(e) {   //点击导航切换样式
      var me = this;
      me.defaultIndex = e;
      this.currentInfo = this.lists[me.defaultIndex].key;
    },
    downloadImage() {
      //      downQR(this.entityId);
    }
  },
  data() {
    return {
      infoType: {},
      currentInfo: '',
      currentEntityMenu: {},
      info: {},
      lists: [],
      defaultIndex: 0,		//控制tab导航样式
      entityUrl: '',
      entityId: '',
      shows: false,
      backImg: "",
    }
  },

}
</script>
<style scoped lang="scss">
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

/* 切换页面下面的内容 */

.main-body {
  margin-top: 20px;
  margin-bottom: 430px;
  padding-left: 230px;
  position: relative;
  .router-btn {
    margin: 0 5px;
  }
}
.active {
  .el-button {
    background: #0db5ef;
    color: #fff;
  }
}
</style>
