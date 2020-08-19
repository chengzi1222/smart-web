<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>详情-{{workData.cfdaTypeStr}}</span>
    </div>
    <div style="margin-top:20px;">
      <span style="font-size:20px;margin-right:20px;">{{workData.cfdaName}}</span>
      <span style="color:#A2AAB6">主体类型：{{workData.cfdaTypeStr}}</span>
    </div>
    <ul class="tab-box">
      <li v-for="(item,index) in lists" :key="item.tabName" @click="liClick(index)" :data-index='index' :class="index == defaultIndex? 'li-bott':''">
        <span :data-index='index'>{{item.tabName}}</span>
      </li>
      <li class="tab-bott"></li>
    </ul>
    <div class="main-body">
      <!--首次工单详情-->
      <work-info v-if="currentInfo == infoType.first" :cfdaWorkType="workData.cfdaWorkTypeStr" :workId="workData.workInfo.id" :cfdaId="workData.entityId"></work-info>
      <change-info v-if="currentInfo == infoType.change" :cfdaAfter="workData.after" :cfdaBefore="workData.before" :workId="workData.workInfo.id" :cfdaWorkType="workData.cfdaWorkTypeStr" :cfdaType="workData.cfdaType"></change-info>
      <delay-info v-if="currentInfo == infoType.delay" :cfdaAfter="workData.after" :cfdaBefore="workData.before" :workId="workData.workInfo.id" :cfdaWorkType="workData.cfdaWorkTypeStr"></delay-info>
      <entity v-if="currentInfo == infoType.entity" :cfda="cfdaInfo"></entity>
      <record-list @init="init" v-if="currentInfo == infoType.record" :currentEntityMenu="currentEntityMenu.info" :entityId="workData.entityId"></record-list>
      <entity-patrol-record-list v-if="currentInfo == infoType.entityPatrolRecord" :entityId="workData.entityId"></entity-patrol-record-list>
      <entity-punish-record-list v-if="currentInfo == infoType.entityPunishRecord" :entityId="workData.entityId"></entity-punish-record-list>
    </div>
    <!-- 底部按钮背景 -->
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button @click="backBtn">返回</el-button>
      </div>
    </div>
  </div>
</template>



<script>
import { INFO_TYPE, InfoTab, CURRENT_ENTITY_MENU } from "views/cfda/workflow/workUtil.js";
import { getWorkFlowInfo } from "api/cfda/bizWorkflow";
import { getCfda } from "api/cfda/details.js";
import workInfo from './workInfo';
import changeInfo from './changeInfo';
import delayInfo from './delayInfo';
import recordList from 'views/cfda/details/workflow_record';
import entity from 'views/cfda/details/info';
import entityPatrolRecordList from 'views/patrol/record/entityPatrolRecord';
import entityPunishRecordList from 'views/enforce/entityPunishRecord';

export default {
  components: {
    workInfo,
    changeInfo,
    delayInfo,
    recordList,
    entity,
    entityPatrolRecordList,
    entityPunishRecordList
  },
  mounted() {
    this.currentEntityMenu = CURRENT_ENTITY_MENU;
    this.init(this.$route.query.id);
  },
  methods: {
    init(id) {
      getWorkFlowInfo({ workId: id }).then((r) => {
        this.workData = r.data;
        this.lists = InfoTab(this.workData.workInfo.type);
        this.infoType = INFO_TYPE;
        this.currentInfo = this.lists && this.lists.length > 0 ? this.lists[0].key : 'NONE';
        this.defaultIndex = 0;
      });
    },
    backBtn() {
      if (this.$route.query.back) {
        this.$router.push({ name: this.$route.query.back });
      } else{
        this.$router.go(-1)
      }
    },
    liClick(e) {
      //点击导航切换样式
      var me = this;
      me.defaultIndex = e;
      this.currentInfo = this.lists[me.defaultIndex].key;
      if (this.currentInfo == this.infoType.entity) {
        getCfda(this.workData.entityId).then((r) => {
          this.cfdaInfo = r.data;
        });
      }
    },

  },
  data() {
    return {
      cfdaInfo: {},
      workData: {},
      infoType: {},
      currentEntityMenu: {},
      currentInfo: '',
      lists: [],
      defaultIndex: 0 //控制tab导航样式
    };
  },

};
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
