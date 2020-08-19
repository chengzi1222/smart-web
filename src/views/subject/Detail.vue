<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>
        {{entityInfo.entityTypeStr}}
      </span>
    </div>
    <div style="margin-top:20px;">
      <span style="font-size:20px;margin-right:1px;">{{entityInfo.entityName}}</span>
      <span style="color:#A2AAB6;margin-right:20px;">
        <qrcode v-if="shows" :url="this.entityUrl" :backImg="this.backImg" :datas="this.entityInfo"></qrcode>
      </span>
      <span style="color:#A2AAB6">证照类型：{{entityInfo.natureTypeStr}}</span>
    </div>
    <ul class="tab-box">
      <li v-for="item in lists" :key="item.tab" @click="tabChange(item.tab)" :class="tab == item.tab? 'li-bott':''">
        <span>{{item.tabName}}</span>
      </li>
      <li class="tab-bott"></li>
    </ul>

    <div class="main-body">
      <detail-component :data="entityInfo" v-if="tab === 'detail'"></detail-component>
      <workflow-record :entity-id="entityId" :entity-type="type" from="detail" v-else-if="tab==='workflow'"></workflow-record>
      <patrol-record :entity-id="entityId" v-else-if="tab==='patrol'"></patrol-record>
      <punish-record :entity-id="entityId" v-else-if="tab==='punish'"></punish-record>
    </div>
    <!-- 底部按钮背景 -->
    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:1" v-if="xcwsIsShow!=1">
      <div>
        <el-button style="width:120px;" @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>

import DetailComponent from './common/DetailComponent';
import WorkflowRecord from './common/WorkflowRecord';
import PatrolRecord from 'views/patrol/record/entityPatrolRecord';
import PunishRecord from 'views/enforce/entityPunishRecord';
import qrcode from 'components/QRcode';
import { getSubInfo } from "api/sub/sub";

export default {
  components: {
    DetailComponent,
    WorkflowRecord,
    PatrolRecord,
    PunishRecord,
    qrcode
  },
  created() {
    this.entityId = this.$route.query.id;
    this.type = this.$route.params.type;
    this.xcwsIsShow = this.$route.query.xcwsIsShow;
    if(this.xcwsIsShow==1){
      this.lists= [{ tabName: '主体信息', tab: 'detail' }]
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    tabChange(tab) {   //点击导航切换样式
      this.tab = tab;
    },
    init() {
      getSubInfo(this.entityId).then((results) => {
        this.entityInfo = results.data;
      });
      this.entityUrl = `${this.$store.getters.base.qrUrl.qrUrl}?t=F_ENTITY&v=1&id=` + this.entityId;
       if(this.$store.state.common.user.areaCode.substring(0,4)=='4419'){//处理东莞环境
        this.backImg = require('assets/img/codeBackDG.png');
      }else{
        this.backImg = require('assets/img/codeBack.png');
      }
      this.shows = true;
    }
  },
  watch: {
    "$route"(route) {
      this.entityId = route.query.id;
      this.type = route.query.type;
      this.init();
    }
  },
  data() {
    return {
      xcwsIsShow:0,
      entityInfo: {},
      tab: 'detail',
      type: '',
      lists: [
        { tabName: '主体信息', tab: 'detail' },
        { tabName: '备案编辑记录', tab: 'workflow' },
        { tabName: '巡查记录', tab: 'patrol' },
        { tabName: '处罚记录', tab: 'punish' },
      ],
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
  height: calc(100% - 220px);
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
