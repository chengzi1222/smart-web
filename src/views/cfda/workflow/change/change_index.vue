<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>{{titleName}}</span>
    </div>
    <div class="typeName">
      <span>主体名称：{{title.entityName}}</span>
        <span>主体类型：{{title.type}}</span>
    </div>
    <ul class="tab-box">
      <li v-for="(item,index) in lists" :key="item.tabName" @click="liClick(index)" :data-index='index' :class="index == defaultIndex? 'li-bott':''">
        <span :data-index='index'>{{item.tabName}}</span>
      </li>
      <li class="tab-bott"></li>
    </ul>
    <div class="main-body no-star">
      <restaurant v-if="currentInfo == 'CFDARESTAURANT' && type == infoType.first" :handleType="type" :entityId="entityId" :workId="workId"></restaurant>
      <restaurant v-if="currentInfo == 'CFDARESTAURANT' && type == infoType.edit" :handleType="type" :entityId="entityId" :workId="workId"></restaurant>
      <sale v-if="currentInfo == 'SALE' && type == infoType.first" :handleType="type" :entityId="entityId" :workId="workId"></sale>
      <sale v-if="currentInfo == 'SALE' && type == infoType.edit" :handleType="type" :entityId="entityId" :workId="workId"></sale>
      <workshop v-if="currentInfo == 'WORKSHOP' && type == infoType.first" :handleType="type" :entityId="entityId" :workId="workId"></workshop>
      <workshop v-if="currentInfo == 'WORKSHOP' && type == infoType.edit" :handleType="type" :entityId="entityId" :workId="workId"></workshop>
      <vendors v-if="currentInfo == 'VENDORS' && type == infoType.first" :handleType="type" :entityId="entityId" :workId="workId"></vendors>
      <vendors v-if="currentInfo == 'VENDORS' && type == infoType.edit" :handleType="type" :entityId="entityId" :workId="workId"></vendors>
      <delay v-if="currentInfo == infoType.delay" :cfdaForm="rData"></delay>
      <restaurant-change v-if="currentInfo == 'CFDARESTAURANT' && type == infoType.change" :cfdaData="rData"></restaurant-change>
      <sale-change v-if="currentInfo == 'SALE' && type == infoType.change" :cfdaData="rData"></sale-change>
      <vendors-change v-if="currentInfo == 'VENDORS' && type == infoType.change" :cfdaData="rData"></vendors-change>
      <workshop-change v-if="currentInfo == 'WORKSHOP' && type == infoType.change" :cfdaData="rData"></workshop-change>
      <entity v-if="currentInfo == infoType.entity && type != infoType.first" :cfda="cfdaInfo"></entity>
      <record-list v-if="currentInfo == infoType.record && type != infoType.first" :currentEntityMenu="currentMenu" :entityId="rData.entityId"></record-list>
      <entity-patrol-record-list v-if="currentInfo == infoType.entityPatrolRecord" :entityId="entityId"></entity-patrol-record-list>
      <entity-punish-record-list v-if="currentInfo == infoType.entityPunishRecord" :entityId="entityId"></entity-punish-record-list>
    </div>
    <!-- 底部按钮背景 -->
    <div class="foot-btn" style="z-index:0">
      <div>
        <el-button style="width:120px;" @click="backBtn">返回</el-button>
      </div>
    </div>
  </div>
</template>



<script>

import entity from 'views/cfda/details/info';
import recordList from 'views/cfda/details/workflow_record';
import delay from 'views/cfda/workflow/change/delay';
import restaurantChange from 'views/cfda/workflow/change/restaurant_change';
import saleChange from 'views/cfda/workflow/change/sale_change';
import vendorsChange from 'views/cfda/workflow/change/vendors_change';
import workshopChange from 'views/cfda/workflow/change/workshop_change';
import restaurant from 'views/cfda/workflow/change/reapply/restaurant';
import sale from 'views/cfda/workflow/change/reapply/sale';
import vendors from 'views/cfda/workflow/change/reapply/vendors';
import workshop from 'views/cfda/workflow/change/reapply/workshop';
import { getCfda } from "api/cfda/details.js";
import { getWorkFlowInfo } from "api/cfda/bizWorkflow";
import entityPatrolRecordList from 'views/patrol/record/entityPatrolRecord';
import entityPunishRecordList from 'views/enforce/entityPunishRecord';
import { InfoTab, INFO_TYPE, CURRENT_ENTITY_MENU } from "views/cfda/workflow/workUtil";

export default {
  components: {
    delay,
    restaurantChange,
    saleChange,
    vendorsChange,
    workshopChange,
    restaurant,
    sale,
    vendors,
    workshop,
    recordList,
    entity,
    entityPatrolRecordList,
    entityPunishRecordList
  },
  async mounted() {
    this.currentEntityMenu = CURRENT_ENTITY_MENU;
    let cfdaId = this.$route.query.cfdaId; //主体ID
    let workId = this.$route.query.workId; //工单ID
    this.type = this.$route.query.type; //操作类型change/delay/first/edit
    switch (this.type) {//判断操作类型,并初始化子类数据
      case INFO_TYPE.change: await this.initChangeData(cfdaId, workId);
        this.lists = InfoTab(this.type.toUpperCase(), this.rData.type);//生成tab选项卡
        //默认打开第一个选项卡
        this.currentInfo = this.lists && this.lists.length > 0 ? this.lists[0].entityType : 'NONE';
        this.titleName = '主体备案变更'
        break;
      case INFO_TYPE.delay: await this.initDelayData(cfdaId, workId);
        //默认打开第一个选项卡
        this.lists = InfoTab(this.type.toUpperCase(), this.rData.type);//生成tab选项卡
        this.currentInfo = this.lists && this.lists.length > 0 ? this.lists[0].key : 'NONE';
        this.titleName = '主体备案延续'
        break;
      case INFO_TYPE.first: await this.initFirstData(workId);
        this.lists = InfoTab(this.type.toUpperCase(), this.rData.type);//生成tab选项卡
        this.currentInfo = this.lists && this.lists.length > 0 ? this.lists[0].entityType : 'NONE';
        this.titleName = '主体备案重新申请'
        break;
      //编辑
      case INFO_TYPE.edit: await this.initEditData(cfdaId, workId);
        this.lists = InfoTab(this.type.toUpperCase(), this.rData.type);//生成tab选项卡
        this.currentInfo = this.lists && this.lists.length > 0 ? this.lists[0].entityType : 'NONE';
        this.titleName = '主体备案编辑'
    }
    this.infoType = INFO_TYPE;

  },
  methods: {
    async initChangeData(cfdaId, workId) {//变更初始化数据
      let data = {};
      if (cfdaId) {//变更申请
        this.entityId = cfdaId;
        this.title.opt = '主体备案变更';
        this.currentMenu = CURRENT_ENTITY_MENU.archives;
        await getCfda(cfdaId).then((r) => {
          data = r.data;
        });
      } else if (workId) {//变更重新申请
        this.title.opt = '重新申请-变更';
        this.workId = workId;
        this.currentMenu = CURRENT_ENTITY_MENU.myWork;
        await getWorkFlowInfo({ workId: workId }).then((r) => {
          data = r.data.after;
          data.type = r.data.cfdaType;
          data.typeStr = r.data.cfdaTypeStr;
          data.entityName = r.data.cfdaName;
          data.entityId = r.data.entityId;
        });
      }
      this.rData = data;
      data.projectMain = data.projectMain ? data.projectMain.split(",") : [];
      data.projectSid = data.projectSid ? data.projectSid.split(",") : [];
      data.foodSales = data.foodSales ? data.foodSales.split(",") : [];
      data.foodProd = data.foodProd ? data.foodProd.split(",") : [];
      data.prodForm = data.prodForm ? data.prodForm.split(",") : [];
      data.prodType = data.prodType ? data.prodType.split(",") : [];
      data.prodVariety = data.prodVariety ? data.prodVariety.split(",") : [];
      data.workId = this.workId;
      this.title.entityName = data.entityName;
      this.title.type = data.typeStr;
      this.entityId = data.entityId;
    },
    async initDelayData(cfdaId, workId) { //延续初始化数据
      let data = {
        entityId: '',
        workId: '',
        delayDate: '',
        delayDateStr: '',
        entityName: '',
        typeStr: '',
        type: ''
      };
      if (cfdaId) {//延续申请
        this.title.opt = '主体备案延续';
        this.currentMenu = CURRENT_ENTITY_MENU.archives;
        await getCfda(cfdaId).then((r) => {
          data = r.data;
          data.delayDate = r.data.recordEndStr;
          data.delayDateStr = r.data.recordEndStr;
          data.entityId = cfdaId;
        });
      } else if (workId) {//延续重新申请
        this.title.opt = '重新申请-延续';
        this.currentMenu = CURRENT_ENTITY_MENU.myWork;
        data.workId = workId;
        await getWorkFlowInfo({ workId: workId }).then((r) => {
          data.delayDate = r.data.after.recordEnd;
          data.delayDateStr = r.data.after.recordEnd;
          data.entityId = r.data.entityId;
          data.entityName = r.data.cfdaName;
          data.typeStr = r.data.cfdaTypeStr;
          data.type = r.data.cfdaType;
        });
      }
      this.rData = data;
      this.title.entityName = data.entityName;
      this.title.type = data.typeStr;
      this.entityId = data.entityId;
    },
    async initFirstData(workId) {
      await getWorkFlowInfo({ workId: workId }).then((r) => {
        this.title.opt = '重新申请-' + r.data.cfdaTypeStr;
        this.currentMenu = CURRENT_ENTITY_MENU.myWork;
        this.workId = workId;
        this.title.entityName = r.data.cfdaName;
        this.title.type = r.data.cfdaTypeStr;
        this.entityId = r.data.entityId;
        this.rData = { type: r.data.cfdaType };
      });
    },
    async initEditData(cfdaId, workId) {
      let data = {};
      if(cfdaId) {
        this.entityId = cfdaId;
        this.title.opt = '主体编辑';
        this.currentMenu = CURRENT_ENTITY_MENU.archives;
        await getCfda(cfdaId).then((r) => {

          this.title.entityName = r.data.entityName;
          this.title.type = r.data.typeStr;
          this.entityId = r.data.entityId;
          this.rData = r.data;
        });
      } else if (workId) {//编辑重新申请
        this.title.opt = '重新申请-编辑';
        this.workId = workId;
        this.currentMenu = CURRENT_ENTITY_MENU.myWork;
        await getWorkFlowInfo({ workId: workId }).then((r) => {
          data = r.data.after;
          data.type = r.data.cfdaType;
          data.typeStr = r.data.cfdaTypeStr;
          data.entityName = r.data.cfdaName;
          data.entityId = r.data.entityId;

          this.title.entityName = r.data.entityName;
          this.title.type = r.data.cfdaTypeStr;
          this.entityId = r.data.entityId;
          this.rData = r.data.after;
        });
      }
    },

    backBtn() {
      this.$router.push({ name: this.$route.query.back });
    },
    liClick(index) {   //点击导航切换样式
      let me = this;
      me.defaultIndex = index;
      let currentTba = this.lists[me.defaultIndex];
      if (currentTba.entityType && currentTba.entityType != 'NONE') {
        this.currentInfo = currentTba.entityType;
      } else {
        this.currentInfo = currentTba.key;
      }
      if (this.currentInfo == this.infoType.entity) {
        getCfda(this.entityId).then((r) => {
          this.cfdaInfo = r.data;
        });
      }
    },

  },
  data() {
    return {
      init: null,
      title: {
        entityName: '',
        type: '',
        opt: ''
      },
      currentInfo: '',
      infoType: {},
      type: '',//操作类型
      rData: {},
      cfdaInfo: {},
      lists: [],
      entityId: '',
      workId: '',
      currentMenu: '',//当前页面菜单
      defaultIndex: 0,		//控制tab导航样式2
      titleName: '' // 根据不同的type参数显示不同的title
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
.tab-box a {
  color: #9a9a9a;
  width: 100%;
  height: 100%;
  display: inline-block;
}

.tab-box .li-bott {
  border-bottom: 2px solid #0db5ef;
  z-index: 666;
  position: relative;
}

.li-bott a {
  color: #393939;
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

.typeName {
  margin-top: 24px;
  margin-left: 20px;
}

.typeName span:first-child {
  font-size: 15px;
  color: #393939;
}
.typeName span:last-child {
  font-size: 15px;
  color: #a2aab6;
  margin-left: 20px;
}
</style>
